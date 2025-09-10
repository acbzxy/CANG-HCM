import React from 'react'
import { UserCircleIcon, BuildingOfficeIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../context/AuthContext'
import Card from '../components/ui/Card'

const AccountPage: React.FC = () => {
  const { user } = useAuth()

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleString('vi-VN')
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <UserCircleIcon className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Thông Tin Tài Khoản</h1>
        </div>
        <p className="text-gray-600">
          Quản lý thông tin tài khoản của bạn
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Basic Information */}
        <Card>
          <Card.Header className="bg-blue-50">
            <div className="flex items-center gap-3">
              <UserCircleIcon className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">Thông Tin Cơ Bản</h2>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {user?.companyName?.charAt(0) || user?.username?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {user?.fullName || 'Người dùng'}
                  </h3>
                  <p className="text-gray-600">
                    {user?.userType === 'dev' ? 'Dev Environment' : 'Doanh nghiệp nộp phí'}
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Tài khoản:</span>
                  <span className="text-gray-900">{user?.taxCode || user?.username}</span>
                </div>

                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Loại tài khoản:</span>
                  <span className="text-gray-900">
                    {user?.userType === 'dev' ? 'Dev Environment' : 'Doanh nghiệp'}
                  </span>
                </div>

                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Trạng thái:</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    Đang hoạt động
                  </span>
                </div>

                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Ngày tạo:</span>
                  <span className="text-gray-900">{formatDate(user?.createdAt)}</span>
                </div>

                <div className="flex justify-between py-3">
                  <span className="font-medium text-gray-700">Đăng nhập lần cuối:</span>
                  <span className="text-gray-900">{formatDate(user?.lastLoginAt)}</span>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Company Information */}
        <Card>
          <Card.Header className="bg-green-50">
            <div className="flex items-center gap-3">
              <BuildingOfficeIcon className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-800">Thông Tin Doanh Nghiệp</h2>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="font-medium text-gray-700">Tên doanh nghiệp:</span>
                <span className="text-gray-900 text-right">
                  {user?.companyName || 'Công ty Demo TPHCM'}
                </span>
              </div>

              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="font-medium text-gray-700">Mã số thuế:</span>
                <span className="text-gray-900">{user?.taxCode || '0109844160'}</span>
              </div>

              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="font-medium text-gray-700">Địa chỉ:</span>
                <span className="text-gray-900 text-right">
                  {user?.address || 'Thành phố Hồ Chí Minh'}
                </span>
              </div>

              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="font-medium text-gray-700">Số điện thoại:</span>
                <span className="text-gray-900">{user?.phone || '1900 1286'}</span>
              </div>

              <div className="flex justify-between py-3">
                <span className="font-medium text-gray-700">Email:</span>
                <span className="text-gray-900">{user?.email || 'demo@example.com'}</span>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Contact & Support */}
      <Card className="mt-8">
        <Card.Header className="bg-purple-50">
          <div className="flex items-center gap-3">
            <PhoneIcon className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-800">Liên Hệ & Hỗ Trợ</h2>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông Tin Liên Hệ</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <PhoneIcon className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-800">Hotline hỗ trợ</p>
                    <p className="text-blue-600 font-semibold text-lg">1900 1286</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <EnvelopeIcon className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-800">Email hỗ trợ</p>
                    <p className="text-blue-600">thuphihatang@tphcm.gov.vn</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <BuildingOfficeIcon className="w-5 h-5 text-gray-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-800">Địa chỉ</p>
                    <p className="text-gray-600">Số 167 - Lưu Hữu Phước - P.15 - Quận 8 - TP HCM</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Thời Gian Hỗ Trợ</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-700">Thứ 2 - Thứ 6:</span>
                  <span className="font-medium text-gray-800">7:30 - 17:30</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-700">Thứ 7:</span>
                  <span className="font-medium text-gray-800">8:00 - 12:00</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-700">Chủ nhật:</span>
                  <span className="font-medium text-red-600">Nghỉ</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Lưu ý:</strong> Trong trường hợp cần hỗ trợ khẩn cấp ngoài giờ hành chính, 
                  vui lòng gửi email và chúng tôi sẽ phản hồi trong thời gian sớm nhất.
                </p>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Security Notice */}
      <Card className="mt-8">
        <Card.Header className="bg-yellow-50">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-800">Lưu Ý Bảo Mật</h2>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Bảo Vệ Tài Khoản</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">•</span>
                  Không chia sẻ thông tin đăng nhập với người khác
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">•</span>
                  Thường xuyên thay đổi mật khẩu
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">•</span>
                  Sử dụng mật khẩu mạnh (ít nhất 8 ký tự)
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">•</span>
                  Đăng xuất sau khi sử dụng xong
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Phát Hiện Bất Thường</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  Liên hệ ngay hotline nếu phát hiện giao dịch lạ
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  Thông báo khi tài khoản bị truy cập trái phép
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  Kiểm tra thường xuyên lịch sử đăng nhập
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  Cập nhật thông tin liên hệ để nhận thông báo
                </li>
              </ul>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}

export default AccountPage
