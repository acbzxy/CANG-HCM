import React from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

const BusinessServicesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white text-2xl">
                ⚙️
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Thực Hiện Nghiệp Vụ</h1>
                <p className="text-gray-600">Thực hiện các nghiệp vụ liên quan đến xử lý nợ phí</p>
              </div>
            </div>
            <Button variant="success" icon={<span>📊</span>}>
              Báo Cáo Nghiệp Vụ
            </Button>
          </div>
        </div>

        <Card className="animate-fade-in-up">
          <Card.Body>
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">⚙️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Thực Hiện Nghiệp Vụ</h3>
              <p className="text-gray-600 mb-6">Thực hiện các nghiệp vụ xử lý nợ phí và quản lý thu hồi</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <div className="p-6 bg-green-50 rounded-lg">
                  <div className="text-2xl mb-3">📧</div>
                  <h4 className="font-semibold text-gray-800 mb-2">Gửi thông báo nhắc nợ</h4>
                  <p className="text-gray-600 text-sm">Gửi thông báo nhắc nhở đến các doanh nghiệp nợ phí</p>
                </div>
                
                <div className="p-6 bg-green-50 rounded-lg">
                  <div className="text-2xl mb-3">📋</div>
                  <h4 className="font-semibold text-gray-800 mb-2">Lập biên bản vi phạm</h4>
                  <p className="text-gray-600 text-sm">Tạo lập biên bản vi phạm về việc chậm nộp phí</p>
                </div>
                
                <div className="p-6 bg-green-50 rounded-lg">
                  <div className="text-2xl mb-3">💼</div>
                  <h4 className="font-semibold text-gray-800 mb-2">Thương lượng thanh toán</h4>
                  <p className="text-gray-600 text-sm">Đàm phán và thương lượng kế hoạch thanh toán</p>
                </div>
                
                <div className="p-6 bg-green-50 rounded-lg">
                  <div className="text-2xl mb-3">⚖️</div>
                  <h4 className="font-semibold text-gray-800 mb-2">Chuyển cơ quan pháp luật</h4>
                  <p className="text-gray-600 text-sm">Chuyển hồ sơ cho cơ quan có thẩm quyền xử lý</p>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}

export default BusinessServicesPage
