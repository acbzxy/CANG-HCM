import React from 'react'
import { 
  PlusCircleIcon,
  ListBulletIcon,
  PencilSquareIcon,
  DocumentCheckIcon,
  CreditCardIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useNotification } from '../context/NotificationContext'

const PaymentPage: React.FC = () => {
  const { showInfo } = useNotification()

  const handleFeatureClick = (feature: string) => {
    showInfo(`Chức năng ${feature} đang được phát triển!`, 'Thông báo')
  }

  const paymentSteps = [
    { step: 1, title: 'TẠO TỜ KHAI PHÍ', completed: true },
    { step: 2, title: 'KÝ SỐ (KHAI BÁO NỘP PHÍ)', completed: true },
    { step: 3, title: 'LẤY THÔNG BÁO PHÍ', completed: true },
    { step: 4, title: 'THỰC HIỆN NỘP PHÍ', completed: true },
    { step: 5, title: 'HOÀN THÀNH', completed: true },
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <CreditCardIcon className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Nộp Phí Cơ Sở Hạ Tầng</h1>
        </div>
        <p className="text-gray-600">
          Quản lý và khai báo nộp phí sử dụng kết cấu hạ tầng cảng biển
        </p>
      </div>

      {/* Payment Process Steps */}
      <Card className="mb-8">
        <Card.Header>
          <h2 className="text-xl font-semibold text-gray-800">Các Bước Nộp Phí</h2>
          <p className="text-gray-600 text-sm mt-1">
            Để hoàn thành việc nộp phí, doanh nghiệp phải thực hiện đủ các bước sau:
          </p>
        </Card.Header>
        <Card.Body>
          <div className="flex flex-wrap gap-4 justify-center">
            {paymentSteps.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm
                  ${item.completed ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}
                `}>
                  {item.completed ? (
                    <DocumentCheckIcon className="w-5 h-5" />
                  ) : (
                    item.step
                  )}
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700 max-w-24">
                  {item.title}
                </span>
                {index < paymentSteps.length - 1 && (
                  <div className="mx-4 w-8 h-0.5 bg-blue-600"></div>
                )}
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* Main Actions Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Create Declaration */}
        <Card hover>
          <Card.Header className="bg-blue-50">
            <div className="flex items-center gap-3">
              <PlusCircleIcon className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">Tạo Tờ Khai Mới</h3>
            </div>
          </Card.Header>
          <Card.Body>
            <p className="text-gray-600 mb-4">
              Tạo tờ khai nộp phí cho dịch vụ cảng biển
            </p>
            <ul className="text-sm text-gray-600 space-y-2 mb-6">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Khai báo thông tin tàu
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Tính toán phí tự động
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Lưu nháp và chỉnh sửa
              </li>
            </ul>
            <Button
              variant="primary"
              fullWidth
              onClick={() => handleFeatureClick('Tạo tờ khai')}
            >
              <PlusCircleIcon className="w-4 h-4 mr-2" />
              Tạo Tờ Khai
            </Button>
          </Card.Body>
        </Card>

        {/* Declaration List */}
        <Card hover>
          <Card.Header className="bg-green-50">
            <div className="flex items-center gap-3">
              <ListBulletIcon className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-800">Danh Sách Tờ Khai</h3>
            </div>
          </Card.Header>
          <Card.Body>
            <p className="text-gray-600 mb-4">
              Xem và quản lý các tờ khai đã tạo
            </p>
            <ul className="text-sm text-gray-600 space-y-2 mb-6">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Tờ khai nháp
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Tờ khai đã gửi
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Theo dõi trạng thái
              </li>
            </ul>
            <Button
              variant="success"
              fullWidth
              onClick={() => handleFeatureClick('Danh sách tờ khai')}
            >
              <ListBulletIcon className="w-4 h-4 mr-2" />
              Xem Danh Sách
            </Button>
          </Card.Body>
        </Card>

        {/* Digital Signature */}
        <Card hover>
          <Card.Header className="bg-yellow-50">
            <div className="flex items-center gap-3">
              <PencilSquareIcon className="w-6 h-6 text-yellow-600" />
              <h3 className="text-lg font-semibold text-gray-800">Ký Số Điện Tử</h3>
            </div>
          </Card.Header>
          <Card.Body>
            <p className="text-gray-600 mb-4">
              Thực hiện ký số cho tờ khai nộp phí
            </p>
            <ul className="text-sm text-gray-600 space-y-2 mb-6">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                Chữ ký số hợp lệ
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                Bảo mật cao
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                Có giá trị pháp lý
              </li>
            </ul>
            <Button
              variant="warning"
              fullWidth
              onClick={() => handleFeatureClick('Ký số điện tử')}
            >
              <PencilSquareIcon className="w-4 h-4 mr-2" />
              Ký Số
            </Button>
          </Card.Body>
        </Card>
      </div>

      {/* Payment Methods */}
      <Card>
        <Card.Header>
          <div className="flex items-center gap-3">
            <BanknotesIcon className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-800">Phương Thức Thanh Toán</h2>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* VCB */}
            <div className="text-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">VCB</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Vietcombank</h4>
              <p className="text-sm text-gray-600 mb-3">
                VCB-iB@nking<br />
                VCB Digibank
              </p>
              <Button
                size="sm"
                variant="info"
                onClick={() => handleFeatureClick('Thanh toán VCB')}
                className="w-full"
              >
                Hướng dẫn
              </Button>
            </div>

            {/* VietinBank */}
            <div className="text-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 font-bold text-lg">VTB</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">VietinBank</h4>
              <p className="text-sm text-gray-600 mb-3">
                Tất cả các kênh<br />
                của VietinBank
              </p>
              <Button
                size="sm"
                variant="info"
                onClick={() => handleFeatureClick('Thanh toán VietinBank')}
                className="w-full"
              >
                Hướng dẫn
              </Button>
            </div>

            {/* BIDV */}
            <div className="text-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-bold text-lg">BIDV</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">BIDV</h4>
              <p className="text-sm text-gray-600 mb-3">
                Tất cả các kênh<br />
                của BIDV
              </p>
              <Button
                size="sm"
                variant="info"
                onClick={() => handleFeatureClick('Thanh toán BIDV')}
                className="w-full"
              >
                Hướng dẫn
              </Button>
            </div>

            {/* QR Code */}
            <div className="text-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zM13 3v8h8V3h-8zm6 6h-4V5h4v4zM19 13h2v2h-2zM13 13h2v2h-2zM15 15h2v2h-2zM13 17h2v2h-2zM15 19h2v2h-2zM17 17h2v2h-2zM17 13h2v2h-2zM19 15h2v2h-2z"/>
                </svg>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">QR Code</h4>
              <p className="text-sm text-gray-600 mb-3">
                Quét mã QR<br />
                ECOM Banking
              </p>
              <Button
                size="sm"
                variant="info"
                onClick={() => handleFeatureClick('Thanh toán QR Code')}
                className="w-full"
              >
                Hướng dẫn
              </Button>
            </div>
          </div>

          {/* Inter-bank Transfer Info */}
          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3">Nộp Phí Liên Ngân Hàng</h4>
            <p className="text-sm text-gray-600 mb-3">
              Cảng vụ thống nhất cấu trúc trường nội dung trên điện chuyển tiền liên ngân hàng:
            </p>
            <div className="bg-white p-4 rounded border-l-4 border-blue-500">
              <code className="text-sm font-mono text-gray-800">
                TPHTCSG+MST+(So_TB_NP;Số tiền, Ghi chú)
              </code>
            </div>
            <div className="mt-3 text-sm text-gray-600">
              <p><strong>TPHTSG:</strong> Thể hiện giao dịch nộp phí hạ tầng Sài Gòn</p>
              <p><strong>MST:</strong> Mã số thuế đơn vị nộp</p>
              <p><strong>So_TB_NP:</strong> Số thông báo nộp phí</p>
              <p><strong>Số tiền:</strong> Số tiền tương ứng với số tiền trên thông báo phí</p>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}

export default PaymentPage
