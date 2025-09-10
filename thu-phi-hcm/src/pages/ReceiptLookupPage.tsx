import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  MagnifyingGlassIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  HomeIcon
} from '@heroicons/react/24/outline'
import { useNotification } from '../context/NotificationContext'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

const ReceiptLookupPage: React.FC = () => {
  const [searchData, setSearchData] = useState({
    receiptCode: '',
    captcha: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSearching, setIsSearching] = useState(false)
  const [captchaUrl, setCaptchaUrl] = useState('/api/captcha.jpg')

  const { showInfo, showError } = useNotification()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSearchData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!searchData.receiptCode.trim()) {
      newErrors.receiptCode = 'Vui lòng nhập mã nhận biên lai'
    } else if (searchData.receiptCode.length < 6) {
      newErrors.receiptCode = 'Mã nhận biên lai phải có ít nhất 6 ký tự'
    }

    if (!searchData.captcha.trim()) {
      newErrors.captcha = 'Vui lòng nhập mã xác nhận'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSearching(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // For demo purposes, show a message instead of actual results
      showInfo('Không tìm thấy biên lai với mã đã nhập. Vui lòng kiểm tra lại mã nhận biên lai.', 'Kết quả tìm kiếm')
    } catch (error) {
      showError('Có lỗi xảy ra khi tra cứu. Vui lòng thử lại!', 'Lỗi')
    } finally {
      setIsSearching(false)
    }
  }

  const refreshCaptcha = () => {
    setCaptchaUrl(`/api/captcha.jpg?t=${Date.now()}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800">
      {/* Header */}
      <header className="bg-blue-800 text-white py-4 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DocumentTextIcon className="w-8 h-8" />
              <h1 className="text-xl font-bold uppercase">
                Hệ thống thu phí Thành Phố Hồ Chí Minh
              </h1>
            </div>
            <Link
              to="/welcome"
              className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors"
            >
              <HomeIcon className="w-5 h-5" />
              <span>Trang chủ</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-12 text-white">
            <h1 className="text-4xl font-light mb-6 leading-tight">
              <span className="block text-2xl font-normal">Sở Xây Dựng</span>
              <span className="block text-2xl font-normal">Thành phố Hồ Chí Minh</span>
              <span className="block text-3xl font-bold text-yellow-400 mt-2">
                Cảng vụ đường thủy nội địa
              </span>
            </h1>
          </div>

          {/* Search Form */}
          <div className="max-w-2xl mx-auto">
            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
              <Card.Header className="bg-blue-50 text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <MagnifyingGlassIcon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Tra cứu biên lai điện tử</h2>
                </div>
                <p className="text-gray-600">
                  Dễ dàng tra cứu biên lai điện tử được phát hành từ hệ thống thu phí.<br />
                  <span className="font-semibold">Tiện ích - Đơn giản - Nhanh chóng</span>
                </p>
              </Card.Header>

              <Card.Body>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Receipt Code Input */}
                  <Input
                    label="Mã nhận biên lai"
                    name="receiptCode"
                    type="text"
                    value={searchData.receiptCode}
                    onChange={handleInputChange}
                    error={errors.receiptCode}
                    placeholder="Nhập mã ở đây"
                    maxLength={10}
                    icon={<DocumentTextIcon className="w-5 h-5" />}
                    helpText="Mã nhận biên lai gồm 6-10 ký tự"
                    required
                  />

                  {/* Captcha */}
                  <div>
                    <label className="form-label">Mã xác nhận</label>
                    <div className="flex gap-3 mb-3">
                      <img
                        src={captchaUrl}
                        alt="Captcha"
                        className="h-12 bg-gray-200 rounded border flex-shrink-0"
                        onError={() => refreshCaptcha()}
                      />
                      <button
                        type="button"
                        onClick={refreshCaptcha}
                        className="px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors border border-gray-300"
                        title="Làm mới mã xác nhận"
                      >
                        <ArrowPathIcon className="w-5 h-5" />
                      </button>
                    </div>
                    <Input
                      name="captcha"
                      type="text"
                      value={searchData.captcha}
                      onChange={handleInputChange}
                      error={errors.captcha}
                      placeholder="Nhập mã xác nhận"
                      autoComplete="off"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="success"
                    size="lg"
                    loading={isSearching}
                    fullWidth
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
                    Tìm biên lai
                  </Button>
                </form>
              </Card.Body>
            </Card>

            {/* Additional Info */}
            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <Card className="bg-white/90 backdrop-blur-sm">
                <Card.Header className="bg-green-50">
                  <h3 className="text-lg font-semibold text-gray-800">Lưu ý quan trọng</h3>
                </Card.Header>
                <Card.Body>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">•</span>
                      Mã nhận biên lai được gửi qua email sau khi thanh toán thành công
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">•</span>
                      Biên lai điện tử có giá trị pháp lý như biên lai giấy
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">•</span>
                      Vui lòng lưu trữ biên lai để đối chiếu khi cần thiết
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">•</span>
                      Liên hệ hotline nếu gặp vấn đề với biên lai
                    </li>
                  </ul>
                </Card.Body>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm">
                <Card.Header className="bg-blue-50">
                  <h3 className="text-lg font-semibold text-gray-800">Hỗ trợ khách hàng</h3>
                </Card.Header>
                <Card.Body>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-sm">24/7</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Hotline hỗ trợ</p>
                        <p className="text-blue-600 font-bold">1900 1286</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-green-600 font-bold text-sm">@</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Email hỗ trợ</p>
                        <p className="text-blue-600 text-sm">thuphihatang@tphcm.gov.vn</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t">
                      <p className="text-xs text-gray-500">
                        Thời gian hỗ trợ: 7:30 - 17:30 (Thứ 2 - Thứ 6)
                      </p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>

            {/* Navigation Links */}
            <div className="mt-8 text-center">
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/welcome"
                  className="text-white/80 hover:text-white text-sm flex items-center gap-2 px-4 py-2 rounded-md hover:bg-white/10 transition-colors"
                >
                  <HomeIcon className="w-4 h-4" />
                  Quay về trang chủ
                </Link>

                <Link
                  to="/login"
                  className="text-white/80 hover:text-white text-sm flex items-center gap-2 px-4 py-2 rounded-md hover:bg-white/10 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m0 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Đăng nhập hệ thống
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            <strong>Copyright &copy; 2025</strong> - DEMO HỆ THỐNG THU PHÍ
          </p>
          <div className="mt-2 text-xs text-gray-400">
            <span>Sở Xây Dựng Thành phố Hồ Chí Minh</span><br />
            <span>Cảng vụ đường thủy nội địa</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default ReceiptLookupPage
