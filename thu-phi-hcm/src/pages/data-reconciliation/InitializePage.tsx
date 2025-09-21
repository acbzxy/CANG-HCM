import React, { useState } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

interface ReconciliationData {
  id: string
  name: string
  fromDate: string
  toDate: string
  dataSource: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  createdAt: string
  createdBy: string
  description: string
  matchRate?: number
}

const InitializePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingItem, setEditingItem] = useState<ReconciliationData | null>(null)
  
  const [formData, setFormData] = useState({
    reconciliationName: '',
    fromDate: '',
    toDate: '',
    description: '',
    dataSource: 'system'
  })

  // Mock data
  const [reconciliationData, setReconciliationData] = useState<ReconciliationData[]>([
    {
      id: '1',
      name: 'Đối soát tháng 12/2024',
      fromDate: '2024-12-01',
      toDate: '2024-12-31',
      dataSource: 'system',
      status: 'completed',
      createdAt: '2024-12-01',
      createdBy: 'Nguyễn Văn A',
      description: 'Đối soát dữ liệu tháng 12/2024',
      matchRate: 98.5
    },
    {
      id: '2',
      name: 'Đối soát tháng 11/2024',
      fromDate: '2024-11-01',
      toDate: '2024-11-30',
      dataSource: 'customs',
      status: 'completed',
      createdAt: '2024-11-01',
      createdBy: 'Trần Thị B',
      description: 'Đối soát dữ liệu tháng 11/2024',
      matchRate: 99.2
    },
    {
      id: '3',
      name: 'Đối soát tháng 10/2024',
      fromDate: '2024-10-01',
      toDate: '2024-10-31',
      dataSource: 'bank',
      status: 'processing',
      createdAt: '2024-10-01',
      createdBy: 'Lê Văn C',
      description: 'Đối soát dữ liệu tháng 10/2024'
    },
    {
      id: '4',
      name: 'Đối soát tháng 9/2024',
      fromDate: '2024-09-01',
      toDate: '2024-09-30',
      dataSource: 'manual',
      status: 'pending',
      createdAt: '2024-09-01',
      createdBy: 'Phạm Thị D',
      description: 'Đối soát dữ liệu tháng 9/2024'
    }
  ])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Chờ xử lý' },
      processing: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Đang xử lý' },
      completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Hoàn thành' },
      failed: { bg: 'bg-red-100', text: 'text-red-800', label: 'Thất bại' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    )
  }

  const getDataSourceLabel = (source: string) => {
    const sourceConfig = {
      system: 'Hệ thống nội bộ',
      customs: 'Dữ liệu Hải Quan',
      bank: 'Dữ liệu ngân hàng',
      manual: 'Nhập thủ công'
    }
    return sourceConfig[source as keyof typeof sourceConfig] || source
  }

  const filteredData = reconciliationData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleCreate = () => {
    if (!formData.reconciliationName || !formData.fromDate || !formData.toDate) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc')
      return
    }

    const newItem: ReconciliationData = {
      id: Date.now().toString(),
      name: formData.reconciliationName,
      fromDate: formData.fromDate,
      toDate: formData.toDate,
      dataSource: formData.dataSource,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: 'Người dùng hiện tại',
      description: formData.description
    }

    setReconciliationData(prev => [newItem, ...prev])
    setFormData({
      reconciliationName: '',
      fromDate: '',
      toDate: '',
      description: '',
      dataSource: 'system'
    })
    setShowCreateModal(false)
  }

  const handleEdit = (item: ReconciliationData) => {
    setEditingItem(item)
    setFormData({
      reconciliationName: item.name,
      fromDate: item.fromDate,
      toDate: item.toDate,
      description: item.description,
      dataSource: item.dataSource
    })
    setShowCreateModal(true)
  }

  const handleUpdate = () => {
    if (!editingItem) return

    setReconciliationData(prev => prev.map(item => 
      item.id === editingItem.id 
        ? { ...item, ...formData, name: formData.reconciliationName }
        : item
    ))
    
    setEditingItem(null)
    setFormData({
      reconciliationName: '',
      fromDate: '',
      toDate: '',
      description: '',
      dataSource: 'system'
    })
    setShowCreateModal(false)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đợt đối soát này?')) {
      setReconciliationData(prev => prev.filter(item => item.id !== id))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white text-2xl">
                📊
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Quản Lý Đối Soát Dữ Liệu</h1>
                <p className="text-gray-600">Quản lý các đợt đối soát dữ liệu</p>
              </div>
            </div>
            <Button 
              variant="success" 
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2"
            >
              <span>+</span>
              <span>Tạo Mới</span>
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6 animate-fade-in-up">
          <Card.Body>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Tìm kiếm theo tên hoặc mô tả..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="md:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl hover:bg-gray-100 focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-300 focus:outline-none"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="pending">Chờ xử lý</option>
                  <option value="processing">Đang xử lý</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="failed">Thất bại</option>
                </select>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Data Table */}
        <Card className="animate-fade-in-up">
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-800">
              Danh Sách Đợt Đối Soát ({filteredData.length})
            </h2>
          </Card.Header>
          <Card.Body className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tên đợt</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Thời gian</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nguồn dữ liệu</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Trạng thái</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tỷ lệ khớp</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Người tạo</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-800">{item.name}</div>
                          <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(item.fromDate).toLocaleDateString('vi-VN')} - {new Date(item.toDate).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {getDataSourceLabel(item.dataSource)}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(item.status)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {item.matchRate ? `${item.matchRate}%` : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <div>
                          <div>{item.createdBy}</div>
                          <div className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString('vi-VN')}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card.Body>
        </Card>

        {/* Create/Edit Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {editingItem ? 'Chỉnh Sửa Đợt Đối Soát' : 'Tạo Mới Đợt Đối Soát'}
              </h2>
              
              <form className="space-y-4">
                <Input
                  label="Tên đợt đối soát"
                  name="reconciliationName"
                  value={formData.reconciliationName}
                  onChange={handleInputChange}
                  placeholder="Nhập tên đợt đối soát..."
                  required
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Từ ngày"
                    name="fromDate"
                    type="date"
                    value={formData.fromDate}
                    onChange={handleInputChange}
                    required
                  />
                  
                  <Input
                    label="Đến ngày"
                    name="toDate"
                    type="date"
                    value={formData.toDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nguồn dữ liệu
                  </label>
                  <select
                    name="dataSource"
                    value={formData.dataSource}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl hover:bg-gray-100 focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-300 focus:outline-none"
                  >
                    <option value="system">Hệ thống nội bộ</option>
                    <option value="customs">Dữ liệu Hải Quan</option>
                    <option value="bank">Dữ liệu ngân hàng</option>
                    <option value="manual">Nhập thủ công</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl hover:bg-gray-100 focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-300 focus:outline-none"
                    rows={4}
                    placeholder="Nhập mô tả chi tiết về đợt đối soát..."
                  />
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <Button 
                    variant="success" 
                    fullWidth
                    onClick={editingItem ? handleUpdate : handleCreate}
                  >
                    {editingItem ? 'Cập Nhật' : 'Tạo Mới'}
                  </Button>
                  <Button 
                    variant="outline" 
                    fullWidth
                    onClick={() => {
                      setShowCreateModal(false)
                      setEditingItem(null)
                      setFormData({
                        reconciliationName: '',
                        fromDate: '',
                        toDate: '',
                        description: '',
                        dataSource: 'system'
                      })
                    }}
                  >
                    Hủy Bỏ
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default InitializePage
