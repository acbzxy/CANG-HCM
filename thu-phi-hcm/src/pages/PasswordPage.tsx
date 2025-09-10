import React, { useState } from 'react'
import { KeyIcon, EyeIcon, EyeSlashIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import { useNotification } from '../context/NotificationContext'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

const PasswordPage: React.FC = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { showSuccess, showError } = useNotification()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
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

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại'
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới'
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự'
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới'
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp'
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'Mật khẩu mới phải khác mật khẩu hiện tại'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      showSuccess('Đổi mật khẩu thành công!', 'Thành công')
      
      // Reset form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      showError('Có lỗi xảy ra khi đổi mật khẩu. Vui lòng thử lại!', 'Lỗi')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, text: '', color: '' }
    
    let score = 0
    if (password.length >= 8) score += 1
    if (/[a-z]/.test(password)) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1

    if (score <= 2) return { strength: 1, text: 'Yếu', color: 'bg-red-500' }
    if (score <= 3) return { strength: 2, text: 'Trung bình', color: 'bg-yellow-500' }
    if (score <= 4) return { strength: 3, text: 'Mạnh', color: 'bg-green-500' }
    return { strength: 4, text: 'Rất mạnh', color: 'bg-green-600' }
  }

  const passwordStrength = getPasswordStrength(formData.newPassword)

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <KeyIcon className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Đổi Mật Khẩu</h1>
        </div>
        <p className="text-gray-600">
          Thay đổi mật khẩu đăng nhập của bạn để bảo mật tài khoản
        </p>
      </div>

      <div className="space-y-8">
        {/* Top Row - Form and Security */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Change Password Form */}
          <div className="lg:col-span-2">
            <Card>
              <Card.Header className="bg-blue-50">
                <div className="flex items-center gap-3">
                  <KeyIcon className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-800">Thay Đổi Mật Khẩu</h2>
                </div>
              </Card.Header>
              <Card.Body>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Current Password */}
                  <div className="relative">
                    <Input
                      label="Mật khẩu hiện tại"
                      name="currentPassword"
                      type={showPasswords.current ? 'text' : 'password'}
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      error={errors.currentPassword}
                      placeholder="Nhập mật khẩu hiện tại"
                      icon={<KeyIcon className="w-5 h-5" />}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.current ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* New Password */}
                  <div className="relative">
                    <Input
                      label="Mật khẩu mới"
                      name="newPassword"
                      type={showPasswords.new ? 'text' : 'password'}
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      error={errors.newPassword}
                      placeholder="Nhập mật khẩu mới"
                      icon={<KeyIcon className="w-5 h-5" />}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.new ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {formData.newPassword && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-gray-600">Độ mạnh mật khẩu:</span>
                        <span className={`text-sm font-medium ${
                          passwordStrength.strength <= 1 ? 'text-red-600' :
                          passwordStrength.strength <= 2 ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {passwordStrength.text}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${passwordStrength.color} transition-all duration-300`}
                          style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Confirm Password */}
                  <div className="relative">
                    <Input
                      label="Xác nhận mật khẩu mới"
                      name="confirmPassword"
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      error={errors.confirmPassword}
                      placeholder="Nhập lại mật khẩu mới"
                      icon={<KeyIcon className="w-5 h-5" />}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.confirm ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      loading={isSubmitting}
                      fullWidth
                    >
                      <KeyIcon className="w-5 h-5 mr-2" />
                      Đổi Mật Khẩu
                    </Button>
                  </div>
                </form>
              </Card.Body>
            </Card>
          </div>

          {/* Security Tips */}
          <div className="lg:col-span-1">
            <Card>
              <Card.Header className="bg-green-50">
                <div className="flex items-center gap-3">
                  <ShieldCheckIcon className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Bảo Mật</h3>
                </div>
              </Card.Header>
              <Card.Body>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Mật khẩu mạnh nên có:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Ít nhất 8 ký tự
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Chữ hoa và chữ thường
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Ít nhất 1 số
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Ký tự đặc biệt (@, #, $, ...)
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Lưu ý bảo mật:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li className="flex items-start">
                        <span className="text-yellow-500 mr-2 mt-1">•</span>
                        Không sử dụng thông tin cá nhân
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-500 mr-2 mt-1">•</span>
                        Thay đổi mật khẩu định kỳ
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-500 mr-2 mt-1">•</span>
                        Không chia sẻ với người khác
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-500 mr-2 mt-1">•</span>
                        Đăng xuất sau khi sử dụng
                      </li>
                    </ul>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>

        {/* Bottom Row - Support Info (Full Width) */}
        <div>
          <Card>
            <Card.Header className="bg-blue-50">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-800">Hỗ Trợ</h3>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="grid md:grid-cols-4 gap-6 text-sm">
                <div>
                  <p className="font-medium text-gray-800">Quên mật khẩu?</p>
                  <p className="text-gray-600">Liên hệ hotline để được hỗ trợ</p>
                </div>

                <div>
                  <p className="font-medium text-gray-800">Hotline:</p>
                  <p className="text-blue-600 font-semibold">1900 1286</p>
                </div>

                <div>
                  <p className="font-medium text-gray-800">Email:</p>
                  <p className="text-blue-600">thuphihatang@tphcm.gov.vn</p>
                </div>

                <div>
                  <p className="font-medium text-gray-800">Thời gian hỗ trợ:</p>
                  <p className="text-gray-600">7:30 - 17:30 (T2-T6)</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default PasswordPage
