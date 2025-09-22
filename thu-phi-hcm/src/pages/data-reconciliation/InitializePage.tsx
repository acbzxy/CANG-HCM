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
  const [searchDate, setSearchDate] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingItem, setEditingItem] = useState<ReconciliationData | null>(null)
  
  const [formData, setFormData] = useState({
    reconciliationName: '',
    fromDate: '',
    toDate: '',
    description: '',
    dataSource: 'system'
  })

  // Mock data - để trống bảng
  const [reconciliationData, setReconciliationData] = useState<ReconciliationData[]>([])

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
    const matchesDate = !searchDate || 
                       (item.fromDate <= searchDate && item.toDate >= searchDate) ||
                       item.createdAt === searchDate
    return matchesDate
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
                <h1 className="text-3xl font-bold text-gray-800">Đối Soát Thủ Công</h1>
                <p className="text-gray-600">Quản lý các đợt đối soát dữ liệu</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="success" 
                icon={<span>➕</span>}
                onClick={() => setShowCreateModal(true)}
              >
                Tạo đối soát
              </Button>
              <Button variant="primary" icon={<span>🏦</span>}>
                Đối soát ngân hàng
              </Button>
              <Button variant="success" icon={<span>💰</span>}>
                Đối soát kho bạc
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 animate-fade-in-up">
          <div className="flex justify-end gap-4">
            <div className="w-48">
              <Input
                type="date"
                placeholder="Tìm kiếm theo ngày đối soát..."
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
              />
            </div>
            <div className="w-32">
              <Button
                variant="success"
                onClick={() => {
                  // Logic search sẽ được thực hiện tự động khi searchDate thay đổi
                }}
                className="w-full flex items-center justify-center space-x-2"
              >
                <i className="fas fa-search"></i>
                <span>Search</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <Card className="animate-fade-in-up">
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-800">
              Danh Sách Đợt Đối Soát ({filteredData.length})
            </h2>
          </Card.Header>
          <Card.Body className="p-0">
            {filteredData.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-inbox text-gray-400 text-2xl"></i>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có dữ liệu đối soát</h3>
                <p className="text-gray-500">Chưa có đợt đối soát nào được tạo hoặc không tìm thấy kết quả phù hợp.</p>
              </div>
            ) : (
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
            )}
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
