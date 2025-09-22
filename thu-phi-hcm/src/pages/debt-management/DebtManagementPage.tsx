import React from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card'

const DebtManagementPage: React.FC = () => {
  const debtManagementTypes = [
    {
      id: 'debt-status',
      title: 'Tra cứu tình trạng nợ phí',
      description: 'Kiểm tra và tra cứu tình trạng nợ phí của doanh nghiệp',
      icon: '🔍',
      path: '/debt-management/debt-status',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      id: 'business-services',
      title: 'Thực hiện nghiệp vụ',
      description: 'Thực hiện các nghiệp vụ liên quan đến xử lý nợ phí',
      icon: '⚙️',
      path: '/debt-management/business-services',
      gradient: 'from-green-500 to-green-600'
    },
    {
      id: 'create-qr-code',
      title: 'Tạo lập QĐ cưỡng chế',
      description: 'Tạo lập quyết định cưỡng chế thu nợ phí',
      icon: '📋',
      path: '/debt-management/create-qr-code',
      gradient: 'from-red-500 to-red-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white text-2xl">
              ⚠️
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Quản Lý Xử Lý Nợ Phí</h1>
              <p className="text-gray-600">Quản lý và xử lý các vấn đề liên quan đến nợ phí</p>
            </div>
          </div>
        </div>

        {/* Management Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {debtManagementTypes.map((item, index) => (
            <Link
              key={item.id}
              to={item.path}
              className="group block animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Card
                hover
                variant="default"
                className="h-full transition-all duration-300 group-hover:scale-105"
              >
                <div className="p-6">
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-r ${item.gradient} rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {item.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Arrow */}
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-gray-500">Truy cập</span>
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-orange-100 group-hover:text-orange-600 transition-all duration-300">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Warning Notice */}
        <Card variant="elevated" className="mb-8 animate-fade-in-up">
          <Card.Body>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 text-xl flex-shrink-0">
                ⚠️
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Lưu Ý Quan Trọng</h3>
                <div className="text-gray-600 space-y-2">
                  <p>• Việc xử lý nợ phí cần tuân thủ đúng quy định pháp luật hiện hành</p>
                  <p>• Cần kiểm tra kỹ thông tin trước khi thực hiện các nghiệp vụ</p>
                  <p>• Quyết định cưỡng chế chỉ được thực hiện khi đã thực hiện đầy đủ các bước theo quy định</p>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          {[
            { label: 'Doanh nghiệp nợ phí', value: '23', icon: '🏢', color: 'red' },
            { label: 'Tổng nợ phí', value: '1.2M VNĐ', icon: '💰', color: 'orange' },
            { label: 'QĐ cưỡng chế', value: '5', icon: '📋', color: 'blue' },
            { label: 'Đã thu hồi', value: '800K VNĐ', icon: '✅', color: 'green' }
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

export default DebtManagementPage
