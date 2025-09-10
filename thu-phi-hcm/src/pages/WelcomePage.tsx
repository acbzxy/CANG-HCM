import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const WelcomePage: React.FC = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Auto redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const features = [
    {
      icon: '💳',
      title: 'Nộp Phí Online',
      description: 'Khai báo và nộp phí sử dụng kết cấu hạ tầng cảng biển một cách nhanh chóng, tiện lợi.',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      icon: '✍️',
      title: 'Ký Số Điện Tử',
      description: 'Ký số điện tử các tờ khai, đảm bảo tính pháp lý và bảo mật thông tin.',
      gradient: 'from-green-500 to-green-600'
    },
    {
      icon: '🔍',
      title: 'Tra Cứu Biên Lai',
      description: 'Tra cứu thông tin biên lai điện tử đã thanh toán một cách dễ dàng.',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      icon: '🎧',
      title: 'Hỗ Trợ 24/7',
      description: 'Đội ngũ hỗ trợ kỹ thuật sẵn sàng giải đáp mọi thắc mắc của quý khách.',
      gradient: 'from-orange-500 to-orange-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-blue-100 rounded-full opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-purple-100 rounded-full opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-green-100 rounded-full opacity-15 animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Dev Environment Indicator */}
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full shadow-lg animate-scale-in">
            <span className="font-bold text-sm">🔧 DEV ENVIRONMENT</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              HỆ THỐNG THU PHÍ
            </span>
            <br />
            <span className="text-3xl md:text-4xl text-gray-700">
              THÀNH PHỐ HỒ CHÍ MINH
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
            Thu phí sử dụng kết cấu hạ tầng, công trình dịch vụ, tiện ích công cộng<br />
            trong khu vực cửa khẩu cảng biển trên địa bàn TP.HCM
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-up stagger-2">
            <Link 
              to="/login" 
              className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2 min-w-[200px]"
            >
              <span className="text-xl">🔐</span>
              <span>Đăng Nhập</span>
            </Link>
            
            <Link 
              to="/receipt-lookup" 
              className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2 min-w-[200px]"
            >
              <span className="text-xl">🔍</span>
              <span>Tra Cứu Biên Lai</span>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group animate-fade-in-up stagger-${index + 3}`}
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto animate-fade-in-up stagger-5">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-center space-x-2">
              <span className="text-3xl">📞</span>
              <span>Thông Tin Liên Hệ</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-600">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl">
                  📞
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Hotline</p>
                  <p className="text-blue-600 font-bold">1900 1286</p>
                </div>
              </div>
              
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-xl">
                  ✉️
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Email</p>
                  <p className="text-green-600 font-bold">thuphihatang@tphcm.gov.vn</p>
                </div>
              </div>
              
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl">
                  ⏰
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Thời gian hỗ trợ</p>
                  <p className="text-purple-600 font-bold">7:30 - 17:30 (T2-T6)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 animate-fade-in">
          <p className="text-sm">
            © 2025 - Demo web thu phí
          </p>
        </div>
      </div>
    </div>
  )
}

export default WelcomePage