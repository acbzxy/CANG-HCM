import React, { useState, useEffect } from 'react'
import { CrmApiService } from '../utils/crmApi'

interface CrmApiStatusProps {
  showDetails?: boolean
  autoRefresh?: boolean
  refreshInterval?: number
}

const CrmApiStatus: React.FC<CrmApiStatusProps> = ({
  showDetails = false,
  autoRefresh = false,
  refreshInterval = 30000 // 30 seconds
}) => {
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [apiStats, setApiStats] = useState({
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0
  })

  const checkApiConnection = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const connected = await CrmApiService.testConnection()
      setIsConnected(connected)
      setLastChecked(new Date())
      
      // Update stats
      setApiStats(prev => ({
        ...prev,
        totalRequests: prev.totalRequests + 1,
        successfulRequests: connected ? prev.successfulRequests + 1 : prev.successfulRequests,
        failedRequests: connected ? prev.failedRequests : prev.failedRequests + 1
      }))
    } catch (err: any) {
      setIsConnected(false)
      setError(err.message || 'Unknown error')
      setApiStats(prev => ({
        ...prev,
        totalRequests: prev.totalRequests + 1,
        failedRequests: prev.failedRequests + 1
      }))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Initial check
    checkApiConnection()

    // Set up auto-refresh if enabled
    let interval: NodeJS.Timeout | null = null
    if (autoRefresh) {
      interval = setInterval(checkApiConnection, refreshInterval)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [autoRefresh, refreshInterval])

  const getStatusColor = () => {
    if (isLoading) return 'bg-yellow-500'
    return isConnected ? 'bg-green-500' : 'bg-red-500'
  }

  const getStatusText = () => {
    if (isLoading) return 'Đang kiểm tra...'
    return isConnected ? 'Kết nối' : 'Ngắt kết nối'
  }

  return (
    <div className="crm-api-status">
      {/* Basic Status */}
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${getStatusColor()} ${isLoading ? 'animate-pulse' : ''}`}></div>
        <span className="text-sm font-medium">
          CRM API: {getStatusText()}
        </span>
        <button
          onClick={checkApiConnection}
          disabled={isLoading}
          className="text-xs text-blue-600 hover:text-blue-800 underline"
        >
          Kiểm tra
        </button>
      </div>

      {/* Detailed Status */}
      {showDetails && (
        <div className="mt-3 p-3 bg-gray-50 rounded border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <h4 className="font-semibold mb-2">Thông tin kết nối</h4>
              <div className="space-y-1">
                <div>
                  <span className="text-gray-600">Endpoint:</span>{' '}
                  <span className="font-mono">10.14.122.24:8081</span>
                </div>
                <div>
                  <span className="text-gray-600">Kiểm tra lần cuối:</span>{' '}
                  <span>{lastChecked ? lastChecked.toLocaleTimeString('vi-VN') : 'Chưa kiểm tra'}</span>
                </div>
                {error && (
                  <div className="text-red-600">
                    <span className="text-gray-600">Lỗi:</span> {error}
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Thống kê</h4>
              <div className="space-y-1">
                <div>
                  <span className="text-gray-600">Tổng requests:</span>{' '}
                  <span>{apiStats.totalRequests}</span>
                </div>
                <div>
                  <span className="text-gray-600">Thành công:</span>{' '}
                  <span className="text-green-600">{apiStats.successfulRequests}</span>
                </div>
                <div>
                  <span className="text-gray-600">Thất bại:</span>{' '}
                  <span className="text-red-600">{apiStats.failedRequests}</span>
                </div>
                <div>
                  <span className="text-gray-600">Tỷ lệ thành công:</span>{' '}
                  <span>
                    {apiStats.totalRequests > 0 
                      ? Math.round((apiStats.successfulRequests / apiStats.totalRequests) * 100) 
                      : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* API Endpoints */}
          <div className="mt-4">
            <h4 className="font-semibold mb-2">API Endpoints</h4>
            <div className="space-y-1 text-xs font-mono">
              <div>GET /api/fee-declarations - Danh sách tờ khai</div>
              <div>GET /api/companies - Danh sách công ty</div>
              <div>POST /api/fee-declarations - Tạo tờ khai mới</div>
              <div>PUT /api/fee-declarations/:id - Cập nhật tờ khai</div>
            </div>
          </div>

          {/* Auto Refresh Status */}
          {autoRefresh && (
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Tự động làm mới mỗi {refreshInterval / 1000}s</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CrmApiStatus

