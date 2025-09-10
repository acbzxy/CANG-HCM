import React, { useState } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

const InitializePage: React.FC = () => {
  const [formData, setFormData] = useState({
    reconciliationName: '',
    fromDate: '',
    toDate: '',
    description: '',
    dataSource: 'system'
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white text-2xl">
                🚀
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Khởi Tạo Đối Soát</h1>
                <p className="text-gray-600">Tạo mới một đợt đối soát dữ liệu</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <Card className="animate-fade-in-up">
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-800">Thông Tin Đợt Đối Soát</h2>
            </Card.Header>
            <Card.Body>
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
                  <Button variant="success" fullWidth>
                    Khởi Tạo
                  </Button>
                  <Button variant="outline" fullWidth>
                    Hủy Bỏ
                  </Button>
                </div>
              </form>
            </Card.Body>
          </Card>

          {/* Configuration */}
          <Card className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-800">Cấu Hình Đối Soát</h2>
            </Card.Header>
            <Card.Body>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Loại Dữ Liệu Đối Soát</h3>
                  <div className="space-y-2">
                    {[
                      { id: 'receipts', label: 'Biên lai thu phí', checked: true },
                      { id: 'payments', label: 'Dữ liệu thanh toán', checked: true },
                      { id: 'declarations', label: 'Tờ khai phí', checked: false },
                      { id: 'enterprises', label: 'Thông tin doanh nghiệp', checked: false }
                    ].map((item) => (
                      <label key={item.id} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          defaultChecked={item.checked}
                          className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="text-gray-700">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Tùy Chọn Nâng Cao</h3>
                  <div className="space-y-2">
                    {[
                      { id: 'autoMatch', label: 'Tự động ghép nối dữ liệu', checked: true },
                      { id: 'emailNotify', label: 'Gửi email thông báo', checked: false },
                      { id: 'autoReport', label: 'Tự động tạo báo cáo', checked: false }
                    ].map((item) => (
                      <label key={item.id} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          defaultChecked={item.checked}
                          className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="text-gray-700">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Recent Reconciliations */}
        <Card className="mt-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-800">Đợt Đối Soát Gần Đây</h2>
          </Card.Header>
          <Card.Body className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tên đợt</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Thời gian</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Trạng thái</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Kết quả</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    { name: 'Đối soát tháng 12/2024', period: '01/12 - 31/12/2024', status: 'Hoàn thành', result: '98.5% khớp' },
                    { name: 'Đối soát tháng 11/2024', period: '01/11 - 30/11/2024', status: 'Hoàn thành', result: '99.2% khớp' },
                    { name: 'Đối soát tháng 10/2024', period: '01/10 - 31/10/2024', status: 'Hoàn thành', result: '97.8% khớp' }
                  ].map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">{item.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.period}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.result}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}

export default InitializePage
