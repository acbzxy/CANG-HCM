import React, { useState } from 'react'
import { NetworkDiagnostics, type NetworkDiagnosticResult } from '../utils/networkDiagnostics'

interface NetworkDiagnosticPanelProps {
  onClose?: () => void
}

const NetworkDiagnosticPanel: React.FC<NetworkDiagnosticPanelProps> = ({ onClose }) => {
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<NetworkDiagnosticResult | null>(null)

  const runDiagnostics = async () => {
    setIsRunning(true)
    try {
      const diagnosticResults = await NetworkDiagnostics.runDiagnostics()
      setResults(diagnosticResults)
    } catch (error) {
      console.error('Diagnostic failed:', error)
    } finally {
      setIsRunning(false)
    }
  }

  const getStatusIcon = (status: 'pass' | 'fail' | 'warning') => {
    switch (status) {
      case 'pass': return '✅'
      case 'fail': return '❌'
      case 'warning': return '⚠️'
      default: return '❓'
    }
  }

  const getStatusColor = (status: 'pass' | 'fail' | 'warning') => {
    switch (status) {
      case 'pass': return 'text-green-600'
      case 'fail': return 'text-red-600'
      case 'warning': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl max-h-[90vh] overflow-y-auto m-4">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              🔧 Chẩn đoán kết nối CRM API
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Description */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
            <p className="text-blue-800 text-sm">
              Công cụ này sẽ kiểm tra kết nối tới server CRM tại{' '}
              <code className="bg-blue-100 px-2 py-1 rounded">10.14.122.24:8081</code>{' '}
              và chỉ ra các vấn đề có thể gặp phải.
            </p>
          </div>

          {/* Run Button */}
          <div className="mb-6">
            <button
              onClick={runDiagnostics}
              disabled={isRunning}
              className="btn btn-primary rounded px-4 py-2"
            >
              {isRunning ? (
                <>
                  <span className="animate-spin mr-2">🔄</span>
                  Đang chạy chẩn đoán...
                </>
              ) : (
                <>
                  🔧 Chạy chẩn đoán
                </>
              )}
            </button>
          </div>

          {/* Results */}
          {results && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="bg-gray-50 p-4 rounded border">
                <h3 className="font-semibold text-gray-800 mb-2">📊 Tóm tắt</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {results.summary.passed}
                    </div>
                    <div className="text-gray-600">Thành công</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {results.summary.warnings}
                    </div>
                    <div className="text-gray-600">Cảnh báo</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {results.summary.failed}
                    </div>
                    <div className="text-gray-600">Thất bại</div>
                  </div>
                </div>
              </div>

              {/* Test Results */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">🧪 Kết quả kiểm tra</h3>
                <div className="space-y-2">
                  {results.tests.map((test, index) => (
                    <div
                      key={index}
                      className={`p-3 border rounded ${
                        test.status === 'pass'
                          ? 'bg-green-50 border-green-200'
                          : test.status === 'warning'
                          ? 'bg-yellow-50 border-yellow-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getStatusIcon(test.status)}</span>
                          <span className="font-medium">{test.name}</span>
                        </div>
                        <span className={`text-sm ${getStatusColor(test.status)}`}>
                          {test.message}
                        </span>
                      </div>
                      {test.details && (
                        <div className="mt-2 ml-7">
                          <details className="text-xs text-gray-600">
                            <summary className="cursor-pointer hover:text-gray-800">
                              Chi tiết
                            </summary>
                            <pre className="mt-1 bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                              {JSON.stringify(test.details, null, 2)}
                            </pre>
                          </details>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              {results.recommendations.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">💡 Khuyến nghị</h3>
                  <div className="bg-orange-50 border border-orange-200 rounded p-4">
                    <ul className="space-y-2">
                      {results.recommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm">
                          <span className="text-orange-600 font-bold">•</span>
                          <span className="text-orange-800">{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Technical Info */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">🔍 Thông tin kỹ thuật</h3>
                <div className="bg-gray-100 p-3 rounded text-xs font-mono">
                  <div><strong>Thời gian:</strong> {new Date(results.timestamp).toLocaleString('vi-VN')}</div>
                  <div><strong>User Agent:</strong> {navigator.userAgent}</div>
                  <div><strong>Target:</strong> http://10.14.122.24:8081/CRM_BE</div>
                  <div><strong>Origin:</strong> {window.location.origin}</div>
                </div>
              </div>

              {/* Export Results */}
              <div className="border-t pt-4">
                <button
                  onClick={() => {
                    const dataStr = JSON.stringify(results, null, 2)
                    const dataBlob = new Blob([dataStr], { type: 'application/json' })
                    const url = URL.createObjectURL(dataBlob)
                    const link = document.createElement('a')
                    link.href = url
                    link.download = `crm-diagnostic-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`
                    link.click()
                    URL.revokeObjectURL(url)
                  }}
                  className="btn btn-sm btn-outline-secondary rounded text-xs px-3 py-1"
                >
                  💾 Xuất kết quả
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NetworkDiagnosticPanel

