import React, { useState } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

const CustomsReportPage: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState('')

  const reportTemplates = [
    {
      id: 'monthly',
      name: 'Báo cáo đối soát tháng',
      description: 'Báo cáo tổng hợp đối soát dữ liệu theo tháng',
      icon: '📅'
    },
    {
      id: 'quarterly',
      name: 'Báo cáo đối soát quý',
      description: 'Báo cáo tổng hợp đối soát dữ liệu theo quý',
      icon: '📊'
    },
    {
      id: 'discrepancy',
      name: 'Báo cáo sai lệch',
      description: 'Báo cáo chi tiết các sai lệch phát hiện',
      icon: '⚠️'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl">
                📊
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Báo Cáo Đối Soát Hải Quan</h1>
                <p className="text-gray-600">Tạo và gửi báo cáo đối soát đến cơ quan Hải Quan</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Report Selection */}
          <Card className="animate-fade-in-up">
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-800">Chọn Loại Báo Cáo</h2>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                {reportTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                      selectedReport === template.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
                    }`}
                    onClick={() => setSelectedReport(template.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{template.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{template.name}</h3>
                        <p className="text-gray-600 text-sm">{template.description}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        selectedReport === template.id
                          ? 'border-purple-500 bg-purple-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedReport === template.id && (
                          <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Từ ngày"
                    type="date"
                  />
                  <Input
                    label="Đến ngày"
                    type="date"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cơ quan nhận báo cáo
                  </label>
                  <select className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl hover:bg-gray-100 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all duration-300 focus:outline-none">
                    <option value="customs-hcm">Cục Hải Quan TP.HCM</option>
                    <option value="customs-central">Tổng Cục Hải Quan</option>
                    <option value="port-authority">Cảng Vụ Hàng Hải</option>
                  </select>
                </div>
                
                <div className="flex space-x-4">
                  <Button variant="primary" fullWidth disabled={!selectedReport}>
                    Tạo Báo Cáo
                  </Button>
                  <Button variant="outline" fullWidth>
                    Xem Trước
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Report Preview */}
          <Card className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-800">Xem Trước Báo Cáo</h2>
            </Card.Header>
            <Card.Body>
              {selectedReport ? (
                <div className="bg-white border-2 border-gray-200 rounded-lg p-6 min-h-[400px]">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      BÁO CÁO ĐỐI SOÁT DỮ LIỆU
                    </h3>
                    <p className="text-sm text-gray-600">
                      {reportTemplates.find(t => t.id === selectedReport)?.name}
                    </p>
                    <p className="text-sm text-gray-600">Số: ___/BC-CVHCM</p>
                  </div>
                  
                  <div className="space-y-4 text-sm text-gray-700">
                    <div>
                      <strong>Kính gửi:</strong> Cục Hải Quan TP. Hồ Chí Minh
                    </div>
                    
                    <div>
                      <strong>Về việc:</strong> Báo cáo kết quả đối soát dữ liệu thu phí
                    </div>
                    
                    <div className="pt-4">
                      <strong>Nội dung báo cáo:</strong>
                    </div>
                    
                    {selectedReport === 'monthly' && (
                      <div className="space-y-2">
                        <p>1. Thời gian đối soát: Tháng [tháng/năm]</p>
                        <p>2. Tổng số bản ghi: [số lượng]</p>
                        <p>3. Số bản ghi khớp: [số lượng] ([%])</p>
                        <p>4. Số bản ghi chưa khớp: [số lượng] ([%])</p>
                        <p>5. Các sai lệch chính: [mô tả]</p>
                      </div>
                    )}
                    
                    {selectedReport === 'quarterly' && (
                      <div className="space-y-2">
                        <p>1. Thời gian đối soát: Quý [quý/năm]</p>
                        <p>2. Tổng số đợt đối soát: [số lượng]</p>
                        <p>3. Tỷ lệ khớp trung bình: [%]</p>
                        <p>4. Xu hướng sai lệch: [phân tích]</p>
                        <p>5. Đề xuất cải thiện: [kiến nghị]</p>
                      </div>
                    )}
                    
                    {selectedReport === 'discrepancy' && (
                      <div className="space-y-2">
                        <p>1. Tổng số sai lệch phát hiện: [số lượng]</p>
                        <p>2. Phân loại theo mức độ nghiêm trọng</p>
                        <p>3. Nguyên nhân chính gây sai lệch</p>
                        <p>4. Biện pháp xử lý đã thực hiện</p>
                        <p>5. Kế hoạch ngăn ngừa tương lai</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-8 text-right">
                    <div className="text-sm text-gray-600">
                      <p>TP. Hồ Chí Minh, ngày ... tháng ... năm 2025</p>
                      <p className="mt-4 font-semibold">GIÁM ĐỐC</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-6xl mb-4">📄</div>
                  <p>Vui lòng chọn loại báo cáo để xem trước</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </div>

        {/* Recent Reports */}
        <Card className="mt-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Card.Header>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Báo Cáo Gần Đây</h2>
              <Button variant="outline" size="sm">
                Xem Tất Cả
              </Button>
            </div>
          </Card.Header>
          <Card.Body className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tên báo cáo</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Loại</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Thời gian</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Trạng thái</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    { name: 'BC-001/2025', type: 'Tháng', period: 'T12/2024', status: 'Đã gửi' },
                    { name: 'BC-002/2025', type: 'Quý', period: 'Q4/2024', status: 'Chờ duyệt' },
                    { name: 'BC-003/2025', type: 'Sai lệch', period: 'T11/2024', status: 'Đã gửi' }
                  ].map((report, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 text-sm font-medium text-blue-600">{report.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{report.type}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{report.period}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          report.status === 'Đã gửi' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Xem
                          </Button>
                          <Button variant="primary" size="sm">
                            Tải về
                          </Button>
                        </div>
                      </td>
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

export default CustomsReportPage
