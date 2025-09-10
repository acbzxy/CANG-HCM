import React from 'react'
import { 
  QuestionMarkCircleIcon,
  PlayCircleIcon,
  DocumentTextIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { useNotification } from '../context/NotificationContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const GuidePage: React.FC = () => {
  const { showInfo } = useNotification()

  const handleLinkClick = (title: string) => {
    showInfo(`${title} sẽ có sẵn trong phiên bản chính thức!`, 'Thông báo')
  }

  const installationGuides = [
    {
      title: 'File cài đặt ký số',
      description: 'Cài đặt phần mềm ký số điện tử cho Windows',
      note: 'Nếu máy tính có Windows < 8, tải file khác',
      type: 'exe' as const
    },
    {
      title: 'Extension Chrome',
      description: 'Ecustsd signature on website - Hỗ trợ ký số trên trình duyệt',
      note: 'Cần thiết để thực hiện ký số trực tuyến',
      type: 'extension' as const
    },
    {
      title: 'Microsoft .NET Framework',
      description: 'Version >= 4.6 (nếu chưa cài đặt)',
      note: 'Yêu cầu hệ thống để chạy phần mềm',
      type: 'installer' as const
    }
  ]

  const videoGuides = [
    {
      title: 'Video hướng dẫn khai phí trên ECUS',
      duration: '12:45',
      views: '15,234'
    },
    {
      title: 'Video hướng dẫn khai phí trên Website',
      duration: '18:32',
      views: '8,976'
    },
    {
      title: 'Hướng dẫn đăng ký tài khoản',
      duration: '8:15',
      views: '22,187'
    },
    {
      title: 'Hướng dẫn ký số điện tử',
      duration: '14:28',
      views: '11,543'
    }
  ]

  const documents = [
    {
      title: 'Tài liệu hướng dẫn sử dụng',
      type: 'PDF',
      size: '2.4 MB',
      description: 'Hướng dẫn chi tiết toàn bộ quy trình'
    },
    {
      title: 'Quy trình thu phí',
      type: 'PDF',
      size: '1.8 MB',
      description: 'Quy định và quy trình thu phí chính thức'
    },
    {
      title: 'Câu hỏi thường gặp',
      type: 'PDF',
      size: '956 KB',
      description: 'Giải đáp các vấn đề phổ biến'
    },
    {
      title: 'Mẫu biểu và văn bản',
      type: 'ZIP',
      size: '3.2 MB',
      description: 'Tập hợp các mẫu biểu cần thiết'
    }
  ]

  const paymentGuides = [
    {
      bank: 'Vietcombank',
      channels: ['VCB-iB@nking', 'VCB Digibank'],
      color: 'blue'
    },
    {
      bank: 'VietinBank',
      channels: ['Tất cả các kênh VietinBank'],
      color: 'red'
    },
    {
      bank: 'BIDV',
      channels: ['Tất cả các kênh BIDV'],
      color: 'green'
    },
    {
      bank: 'QR Code',
      channels: ['Quét mã QR', 'ECOM Banking'],
      color: 'purple'
    }
  ]

  const steps = [
    { step: 1, title: 'Tạo tờ khai phí', completed: true },
    { step: 2, title: 'Ký số (Khai báo nộp phí)', completed: true },
    { step: 3, title: 'Lấy thông báo phí', completed: true },
    { step: 4, title: 'Thực hiện nộp phí', completed: true },
    { step: 5, title: 'Hoàn thành', completed: true }
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <QuestionMarkCircleIcon className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Hướng Dẫn Sử Dụng</h1>
        </div>
        <p className="text-gray-600">
          Tài liệu và video hướng dẫn sử dụng hệ thống
        </p>
      </div>

      {/* Installation Guide */}
      <Card className="mb-8">
        <Card.Header className="bg-blue-50">
          <h2 className="text-xl font-semibold text-gray-800">
            I. Cài Đặt Môi Trường Sử Dụng
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Để thực hiện đăng ký chữ ký số và khai báo nộp phí trên website, vui lòng tải và cài đặt các file sau:
          </p>
        </Card.Header>
        <Card.Body>
          <div className="grid md:grid-cols-3 gap-6">
            {installationGuides.map((guide, index) => (
              <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">
                      {index + 1}. {guide.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">{guide.description}</p>
                    {guide.note && (
                      <p className="text-xs text-gray-500 italic">
                        ({guide.note})
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="info"
                  fullWidth
                  onClick={() => handleLinkClick(guide.title)}
                >
                  Tải xuống
                </Button>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* Video Guides */}
      <Card className="mb-8">
        <Card.Header className="bg-green-50">
          <div className="flex items-center gap-3">
            <PlayCircleIcon className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              II. Video Hướng Dẫn
            </h2>
          </div>
          <p className="text-gray-600 text-sm mt-1">
            Xem video hướng dẫn chi tiết cho từng bước thực hiện
          </p>
        </Card.Header>
        <Card.Body>
          <div className="grid md:grid-cols-2 gap-6">
            {videoGuides.map((video, index) => (
              <div key={index} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-video bg-gray-900 relative group cursor-pointer" onClick={() => handleLinkClick(video.title)}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <PlayCircleIcon className="w-16 h-16 text-white group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h4 className="text-white font-semibold text-sm mb-1">{video.title}</h4>
                    <div className="flex items-center justify-between text-white/80 text-xs">
                      <span>{video.duration}</span>
                      <span>{video.views} lượt xem</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* Process Steps */}
      <Card className="mb-8">
        <Card.Header className="bg-purple-50">
          <h2 className="text-xl font-semibold text-gray-800">
            III. Các Bước Nộp Phí
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Để hoàn thành việc nộp phí, doanh nghiệp phải thực hiện đủ các bước sau:
          </p>
        </Card.Header>
        <Card.Body>
          <div className="flex flex-wrap gap-4 justify-center mb-6">
            {steps.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm
                  ${item.completed ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'}
                `}>
                  {item.completed ? (
                    <CheckCircleIcon className="w-5 h-5" />
                  ) : (
                    item.step
                  )}
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700 max-w-24 uppercase">
                  {item.title}
                </span>
                {index < steps.length - 1 && (
                  <div className="mx-4 w-8 h-0.5 bg-purple-600"></div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 italic">
              Chi tiết các bước có trong file: <strong>Tài liệu hướng dẫn sử dụng.pdf</strong>
            </p>
          </div>
        </Card.Body>
      </Card>

      {/* Documents */}
      <Card className="mb-8">
        <Card.Header className="bg-yellow-50">
          <div className="flex items-center gap-3">
            <DocumentTextIcon className="w-6 h-6 text-yellow-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              IV. Tài Liệu Hướng Dẫn
            </h2>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="grid md:grid-cols-2 gap-4">
            {documents.map((doc, index) => (
              <div key={index} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <DocumentTextIcon className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{doc.title}</h4>
                  <p className="text-sm text-gray-600">{doc.description}</p>
                  <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                    <span>{doc.type}</span>
                    <span>{doc.size}</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleLinkClick(doc.title)}
                >
                  Tải về
                </Button>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* Payment Guides */}
      <Card className="mb-8">
        <Card.Header className="bg-indigo-50">
          <h2 className="text-xl font-semibold text-gray-800">
            V. Hướng Dẫn Nộp Phí
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Sau khi doanh nghiệp đã thực hiện khai phí thành công, có thể xem hướng dẫn dưới đây để thực hiện nộp phí:
          </p>
        </Card.Header>
        <Card.Body>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {paymentGuides.map((guide, index) => (
              <div key={index} className="text-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-lg flex items-center justify-center
                  ${guide.color === 'blue' ? 'bg-blue-100' :
                    guide.color === 'red' ? 'bg-red-100' :
                    guide.color === 'green' ? 'bg-green-100' :
                    'bg-purple-100'}`}>
                  <span className={`font-bold text-lg
                    ${guide.color === 'blue' ? 'text-blue-600' :
                      guide.color === 'red' ? 'text-red-600' :
                      guide.color === 'green' ? 'text-green-600' :
                      'text-purple-600'}`}>
                    {guide.bank.slice(0, 3).toUpperCase()}
                  </span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">{guide.bank}</h4>
                <div className="text-sm text-gray-600 mb-4">
                  {guide.channels.map((channel, i) => (
                    <p key={i}>{channel}</p>
                  ))}
                </div>
                <Button
                  size="sm"
                  variant="info"
                  fullWidth
                  onClick={() => handleLinkClick(`Hướng dẫn ${guide.bank}`)}
                >
                  Xem hướng dẫn
                </Button>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* Contact Support */}
      <Card>
        <Card.Header className="bg-gray-50">
          <div className="flex items-center gap-3">
            <PhoneIcon className="w-6 h-6 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              VI. Liên Hệ Hỗ Trợ
            </h2>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PhoneIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Hotline hỗ trợ</h3>
              <p className="text-2xl font-bold text-blue-600 mb-2">1900 1286</p>
              <p className="text-sm text-gray-600">Hỗ trợ 24/7</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <EnvelopeIcon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Email hỗ trợ</h3>
              <p className="text-blue-600 mb-2">thuphihatang@tphcm.gov.vn</p>
              <p className="text-sm text-gray-600">Phản hồi trong 24h</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClockIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Giờ làm việc</h3>
              <p className="text-gray-800 mb-1">7:30 - 17:30</p>
              <p className="text-sm text-gray-600">Thứ 2 - Thứ 6</p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-blue-50 rounded-lg text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <img
                src="/logo-placeholder.png"
                alt="Logo TSD"
                className="w-16 h-16"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.nextElementSibling!.style.display = 'flex'
                }}
              />
              <div 
                className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                style={{ display: 'none' }}
              >
                TSD
              </div>
              <div className="text-left">
                <p className="text-lg font-semibold text-gray-800">
                  Tổng đài hỗ trợ Thu phí Thành phố Hồ Chí Minh
                </p>
                <p className="text-blue-600">Demo web thu phí</p>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}

export default GuidePage
