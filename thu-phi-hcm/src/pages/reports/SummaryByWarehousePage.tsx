import React from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

const SummaryByWarehousePage: React.FC = () => {
  const mockData = [
    { warehouse: 'Kho A', totalReceipts: 45, totalAmount: '2,500,000', percentage: 35 },
    { warehouse: 'Kho B', totalReceipts: 32, totalAmount: '1,800,000', percentage: 25 },
    { warehouse: 'Kho C', totalReceipts: 28, totalAmount: '1,200,000', percentage: 20 },
    { warehouse: 'Kho D', totalReceipts: 25, totalAmount: '1,500,000', percentage: 20 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white text-2xl">
                🏪
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Tổng Hợp Theo Kho</h1>
                <p className="text-gray-600">Báo cáo tổng hợp thu phí theo kho</p>
              </div>
            </div>
            <Button variant="success" icon={<span>📊</span>}>
              Xuất Báo Cáo
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {mockData.map((item, index) => (
            <Card 
              key={index} 
              hover 
              variant="elevated" 
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-500 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4">
                  🏪
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{item.warehouse}</h3>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{item.totalReceipts}</span> biên lai
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    {item.totalAmount} VNĐ
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500">{item.percentage}% tổng thu</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Detailed Table */}
        <Card className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-800">Chi Tiết Theo Kho</h2>
          </Card.Header>
          <Card.Body className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Kho</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Số biên lai</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tổng tiền</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tỷ lệ</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {mockData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">{item.warehouse}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.totalReceipts}</td>
                      <td className="px-6 py-4 text-sm font-medium text-green-600">{item.totalAmount} VNĐ</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.percentage}%</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          Hoạt động
                        </span>
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

export default SummaryByWarehousePage
