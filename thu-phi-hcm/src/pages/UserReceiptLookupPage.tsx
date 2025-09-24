import React, { useState, useEffect } from 'react'
import { 
  MagnifyingGlassIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import { useNotification } from '../context/NotificationContext'
import Button from '../components/ui/Button'

const UserReceiptLookupPage: React.FC = () => {
  const [searchData, setSearchData] = useState({
    receiptCode: '',
    captcha: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSearching, setIsSearching] = useState(false)
  const [captchaText, setCaptchaText] = useState('')
  const [captchaInput, setCaptchaInput] = useState('')

  const { showInfo, showError } = useNotification()

  // Generate random captcha text
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  // Initialize captcha on component mount
  useEffect(() => {
    setCaptchaText(generateCaptcha())
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === 'captcha') {
      setCaptchaInput(value)
    } else {
      setSearchData(prev => ({
        ...prev,
        [name]: value
      }))
    }

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

    if (!captchaInput.trim()) {
      newErrors.captcha = 'Vui lòng nhập mã xác nhận'
    } else if (captchaInput.toUpperCase() !== captchaText) {
      newErrors.captcha = 'Mã xác nhận không đúng'
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
    setCaptchaText(generateCaptcha())
    setCaptchaInput('')
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Tra cứu biên lai điện tử</h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-y-6 gap-x-4">
          {/* Mã nhận biên lai */}
          <div className="col-span-12 md:col-span-3 flex items-center">
            <label className="text-gray-800 font-medium">
              Mã nhận biên lai: <span className="text-red-500">*</span>
            </label>
          </div>
          <div className="col-span-12 md:col-span-9">
            <input
              name="receiptCode"
              type="text"
              value={searchData.receiptCode}
              onChange={handleInputChange}
              maxLength={10}
              placeholder="NHẬP MÃ Ở ĐÂY"
              className={`h-10 w-[340px] rounded border px-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.receiptCode ? 'border-red-500' : 'border-gray-300'}`}
              required
            />
            <p className="mt-1 text-xs text-gray-500">Mã nhận biên lai gồm 6-10 ký tự</p>
            {errors.receiptCode && (
              <p className="mt-1 text-sm text-red-600">{errors.receiptCode}</p>
            )}
          </div>

          {/* Mã xác nhận */}
          <div className="col-span-12 md:col-span-3 flex items-center">
            <label className="text-gray-800 font-medium">
              Mã xác nhận: <span className="text-red-500">*</span>
            </label>
          </div>
          <div className="col-span-12 md:col-span-9">
            <div className="flex items-center gap-3 w-[340px]">
              <input
                name="captcha"
                type="text"
                value={captchaInput}
                onChange={handleInputChange}
                className={`h-10 w-40 rounded border px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.captcha ? 'border-red-500' : 'border-gray-300'}`}
                required
              />
              <div className="h-10 px-4 rounded border border-blue-300 bg-blue-100 flex items-center justify-center">
                <span className="text-blue-700 font-bold tracking-widest select-none">
                  {captchaText}
                </span>
              </div>
              <button type="button" onClick={refreshCaptcha} className="inline-flex items-center text-blue-600 hover:text-blue-800">
                <ArrowPathIcon className="w-4 h-4 mr-1" /> Refresh
              </button>
            </div>
            {errors.captcha && (
              <p className="mt-1 text-sm text-red-600">{errors.captcha}</p>
            )}
          </div>

          {/* Submit */}
          <div className="col-span-12 md:col-span-3"></div>
          <div className="col-span-12 md:col-span-9">
            <Button
              type="submit"
              variant="success"
              size="lg"
              loading={isSearching}
              className="bg-green-600 hover:bg-green-700"
            >
              <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
              Tìm biên lai
            </Button>
          </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UserReceiptLookupPage
