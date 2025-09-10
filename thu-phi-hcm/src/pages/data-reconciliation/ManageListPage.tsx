import React, { useState } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

const ManageListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const mockReconciliations = [
    {
      id: 'DS001',
      name: 'Đối soát tháng 1/2025',
      period: '01/01 - 31/01/2025',
      status: 'Đang xử lý',
      progress: 75,
      totalRecords: 1250,
      matchedRecords: 1180,
      unmatchedRecords: 70,
      createdDate: '2025-01-15'
    },
    {
      id: 'DS002',
      name: 'Đối soát tháng 12/2024',
      period: '01/12 - 31/12/2024',
      status: 'Hoàn thành',
      progress: 100,
      totalRecords: 1380,
      matchedRecords: 1360,
      unmatchedRecords: 20,
      createdDate: '2024-12-15'
    },
    {
      id: 'DS003',
      name: 'Đối soát quý 4/2024',
      period: '01/10 - 31/12/2024',
      status: 'Chờ duyệt',
      progress: 100,
      totalRecords: 4200,
      matchedRecords: 4150,
      unmatchedRecords: 50,
      createdDate: '2024-12-01'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-2xl">
                📋
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Quản Lý Danh Sách Đối Soát</h1>
                <p className="text-gray-600">Quản lý và theo dõi các đợt đối soát dữ liệu</p>
              </div>
            </div>
            <Button variant="primary" icon={<span>➕</span>}>
              Tạo Đợt Mới
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-800">Tìm Kiếm và Lọc</h2>
          </Card.Header>
          <Card.Body>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                label="Tên đợt đối soát"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Trạng thái</label>
                <select className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl hover:bg-gray-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 focus:outline-none">
                  <option value="">Tất cả</option>
                  <option value="processing">Đang xử lý</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="pending">Chờ duyệt</option>
                </select>
              </div>
              <Input
                label="Từ ngày"
                type="date"
              />
              <div className="flex items-end">
                <Button variant="primary" fullWidth>
                  Tìm kiếm
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Reconciliation List */}
        <div className="space-y-6">
          {mockReconciliations.map((item, index) => (
            <Card 
              key={item.id} 
              hover 
              className="animate-fade-in-up"
              style={{ animationDelay: `${(index + 1) * 0.1}s` }}
            >
              <Card.Body>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                  {/* Main Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                      <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                        item.status === 'Hoàn thành' 
                          ? 'bg-green-100 text-green-800'
                          : item.status === 'Đang xử lý'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">
                      <span className="font-medium">Mã:</span> {item.id} | 
                      <span className="font-medium"> Thời gian:</span> {item.period} | 
                      <span className="font-medium"> Tạo ngày:</span> {item.createdDate}
                    </p>
                    
                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Tiến độ xử lý</span>
                        <span>{item.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-1000 ${
                            item.status === 'Hoàn thành' ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Statistics */}
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Tổng bản ghi:</span>
                        <div className="font-semibold text-gray-800">{item.totalRecords.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Đã khớp:</span>
                        <div className="font-semibold text-green-600">{item.matchedRecords.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Chưa khớp:</span>
                        <div className="font-semibold text-red-600">{item.unmatchedRecords.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-col space-y-2 lg:ml-6">
                    <Button variant="outline" size="sm">
                      Xem Chi Tiết
                    </Button>
                    {item.status === 'Đang xử lý' && (
                      <Button variant="primary" size="sm">
                        Tiếp Tục
                      </Button>
                    )}
                    {item.status === 'Hoàn thành' && (
                      <Button variant="success" size="sm">
                        Xuất Báo Cáo
                      </Button>
                    )}
                    {item.status === 'Chờ duyệt' && (
                      <Button variant="warning" size="sm">
                        Duyệt
                      </Button>
                    )}
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          {[
            { label: 'Tổng đợt đối soát', value: '12', icon: '📋', color: 'blue' },
            { label: 'Đang xử lý', value: '3', icon: '⏳', color: 'yellow' },
            { label: 'Hoàn thành', value: '8', icon: '✅', color: 'green' },
            { label: 'Chờ duyệt', value: '1', icon: '⏸️', color: 'orange' }
          ].map((stat, index) => (
            <Card key={index} variant="elevated" className="text-center p-6">
              <div className={`w-12 h-12 bg-${stat.color}-100 text-${stat.color}-600 rounded-full flex items-center justify-center text-xl mx-auto mb-3`}>
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ManageListPage
