import React from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card'

const DataReconciliationPage: React.FC = () => {
  const reconciliationTypes = [
    {
      id: 'initialize',
      title: 'Khởi tạo',
      description: 'Khởi tạo quy trình đối soát dữ liệu mới',
      icon: '🚀',
      path: '/data-reconciliation/initialize',
      gradient: 'from-green-500 to-green-600'
    },
    {
      id: 'manage-list',
      title: 'Quản lý danh sách đối soát',
      description: 'Quản lý và theo dõi các đợt đối soát dữ liệu',
      icon: '📋',
      path: '/data-reconciliation/manage-list',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      id: 'customs-report',
      title: 'Báo cáo đối soát Hải Quan',
      description: 'Báo cáo kết quả đối soát với cơ quan Hải Quan',
      icon: '📊',
      path: '/data-reconciliation/customs-report',
      gradient: 'from-purple-500 to-purple-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-2xl">
              🔄
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Đối Soát Dữ Liệu</h1>
              <p className="text-gray-600">Quản lý và thực hiện đối soát dữ liệu với các cơ quan liên quan</p>
            </div>
          </div>
        </div>

        {/* Reconciliation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {reconciliationTypes.map((item, index) => (
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
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-cyan-600 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Arrow */}
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-gray-500">Truy cập</span>
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-cyan-100 group-hover:text-cyan-600 transition-all duration-300">
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

        {/* Process Flow */}
        <Card variant="elevated" className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-800">Quy Trình Đối Soát</h2>
          </Card.Header>
          <Card.Body>
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-2xl mb-3">
                  🚀
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">Bước 1</h3>
                <p className="text-gray-600 text-sm">Khởi tạo đợt đối soát</p>
              </div>
              
              <div className="hidden md:block text-gray-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl mb-3">
                  📋
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">Bước 2</h3>
                <p className="text-gray-600 text-sm">Quản lý danh sách</p>
              </div>
              
              <div className="hidden md:block text-gray-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-2xl mb-3">
                  📊
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">Bước 3</h3>
                <p className="text-gray-600 text-sm">Báo cáo Hải Quan</p>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Information Notice */}
        <Card variant="elevated" className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <Card.Body>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl flex-shrink-0">
                ℹ️
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Thông Tin Quan Trọng</h3>
                <div className="text-gray-600 space-y-2">
                  <p>• Đối soát dữ liệu được thực hiện định kỳ hàng tháng</p>
                  <p>• Cần đảm bảo tính chính xác và đầy đủ của dữ liệu trước khi đối soát</p>
                  <p>• Báo cáo đối soát phải được gửi đến Hải Quan trong thời hạn quy định</p>
                  <p>• Mọi sai lệch phải được ghi nhận và xử lý kịp thời</p>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          {[
            { label: 'Đợt đối soát tháng này', value: '3', icon: '🔄', color: 'cyan' },
            { label: 'Dữ liệu đã đối soát', value: '1,245', icon: '📊', color: 'blue' },
            { label: 'Sai lệch phát hiện', value: '12', icon: '⚠️', color: 'yellow' },
            { label: 'Đã xử lý', value: '10', icon: '✅', color: 'green' }
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

export default DataReconciliationPage
