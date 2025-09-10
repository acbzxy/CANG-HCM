import React from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card'

const ReportsPage: React.FC = () => {
  const reportTypes = [
    {
      id: 'receipt-list',
      title: 'Bảng kê BL thu',
      description: 'Danh sách biên lai thu phí theo thời gian',
      icon: '📋',
      path: '/reports/receipt-list',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      id: 'summary-by-warehouse',
      title: 'Tổng hợp theo kho',
      description: 'Báo cáo tổng hợp thu phí theo kho',
      icon: '🏪',
      path: '/reports/summary-by-warehouse',
      gradient: 'from-green-500 to-green-600'
    },
    {
      id: 'summary-by-service',
      title: 'Tổng hợp thu dịch vụ',
      description: 'Báo cáo thu phí theo loại dịch vụ',
      icon: '🛎️',
      path: '/reports/summary-by-service',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      id: 'summary-by-enterprise',
      title: 'Tổng hợp theo DN',
      description: 'Báo cáo thu phí theo doanh nghiệp',
      icon: '🏢',
      path: '/reports/summary-by-enterprise',
      gradient: 'from-orange-500 to-orange-600'
    },
    {
      id: 'detailed-report',
      title: 'Báo cáo ấn chỉ',
      description: 'Báo cáo chi tiết về ấn chỉ',
      icon: '📊',
      path: '/reports/detailed-report',
      gradient: 'from-red-500 to-red-600'
    },
    {
      id: 'receipt-usage-history',
      title: 'Tình hình sử dụng BL',
      description: 'Lịch sử sử dụng biên lai',
      icon: '📈',
      path: '/reports/receipt-usage-history',
      gradient: 'from-cyan-500 to-cyan-600'
    },
    {
      id: 'collection-summary',
      title: 'Tổng hợp thu theo CB lập',
      description: 'Báo cáo thu theo cán bộ lập',
      icon: '👥',
      path: '/reports/collection-summary',
      gradient: 'from-pink-500 to-pink-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl">
              📊
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Báo Cáo Thống Kê</h1>
              <p className="text-gray-600">Xem và xuất các báo cáo thống kê hệ thống</p>
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportTypes.map((report, index) => (
            <Link
              key={report.id}
              to={report.path}
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
                  <div className={`w-16 h-16 bg-gradient-to-r ${report.gradient} rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {report.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {report.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {report.description}
                  </p>

                  {/* Arrow */}
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-gray-500">Xem báo cáo</span>
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-blue-100 group-hover:text-blue-600 transition-all duration-300">
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

        {/* Quick Stats */}
        <div className="mt-12 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Thống Kê Tổng Quan</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Tổng biên lai', value: '1,234', icon: '📋', color: 'blue' },
              { label: 'Tổng thu', value: '2.5M VNĐ', icon: '💰', color: 'green' },
              { label: 'Doanh nghiệp', value: '89', icon: '🏢', color: 'purple' },
              { label: 'Báo cáo tháng', value: '12', icon: '📊', color: 'orange' }
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
    </div>
  )
}

export default ReportsPage
