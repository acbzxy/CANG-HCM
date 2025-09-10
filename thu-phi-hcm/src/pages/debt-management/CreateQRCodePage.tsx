import React, { useState } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

const CreateQRCodePage: React.FC = () => {
  const [formData, setFormData] = useState({
    enterpriseName: '',
    taxCode: '',
    debtAmount: '',
    dueDate: '',
    reason: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white text-2xl">
                📋
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Tạo Lập QĐ Cưỡng Chế</h1>
                <p className="text-gray-600">Tạo lập quyết định cưỡng chế thu nợ phí</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <Card className="animate-fade-in-up">
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-800">Thông Tin Quyết Định</h2>
            </Card.Header>
            <Card.Body>
              <form className="space-y-4">
                <Input
                  label="Tên doanh nghiệp"
                  name="enterpriseName"
                  value={formData.enterpriseName}
                  onChange={handleInputChange}
                  placeholder="Nhập tên doanh nghiệp..."
                  required
                />
                
                <Input
                  label="Mã số thuế"
                  name="taxCode"
                  value={formData.taxCode}
                  onChange={handleInputChange}
                  placeholder="Nhập mã số thuế..."
                  required
                />
                
                <Input
                  label="Số tiền nợ (VNĐ)"
                  name="debtAmount"
                  type="number"
                  value={formData.debtAmount}
                  onChange={handleInputChange}
                  placeholder="Nhập số tiền nợ..."
                  required
                />
                
                <Input
                  label="Hạn cuối cưỡng chế"
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  required
                />
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Lý do cưỡng chế
                  </label>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl hover:bg-gray-100 focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all duration-300 focus:outline-none"
                    rows={4}
                    placeholder="Nhập lý do thực hiện cưỡng chế..."
                    required
                  />
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <Button variant="danger" fullWidth>
                    Tạo Quyết Định
                  </Button>
                  <Button variant="outline" fullWidth>
                    Xem Trước
                  </Button>
                </div>
              </form>
            </Card.Body>
          </Card>

          {/* Preview */}
          <Card className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-800">Xem Trước Quyết Định</h2>
            </Card.Header>
            <Card.Body>
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6 min-h-[400px]">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    QUYẾT ĐỊNH CƯỠNG CHẾ THU NỢ PHÍ
                  </h3>
                  <p className="text-sm text-gray-600">Số: ___/QĐ-CVHCM</p>
                </div>
                
                <div className="space-y-4 text-sm text-gray-700">
                  <div>
                    <strong>Căn cứ:</strong> Luật Phí và Lệ phí năm 2015
                  </div>
                  
                  <div>
                    <strong>Căn cứ:</strong> Nghị định số 45/2020/NĐ-CP
                  </div>
                  
                  <div className="pt-4">
                    <strong>QUYẾT ĐỊNH:</strong>
                  </div>
                  
                  <div>
                    <strong>Điều 1:</strong> Cưỡng chế thu nợ phí đối với:
                    <br />
                    - Tên doanh nghiệp: <span className="text-red-600">{formData.enterpriseName || '[Tên doanh nghiệp]'}</span>
                    <br />
                    - Mã số thuế: <span className="text-red-600">{formData.taxCode || '[Mã số thuế]'}</span>
                    <br />
                    - Số tiền: <span className="text-red-600">{formData.debtAmount ? `${formData.debtAmount} VNĐ` : '[Số tiền]'}</span>
                  </div>
                  
                  <div>
                    <strong>Điều 2:</strong> Thời hạn thực hiện: <span className="text-red-600">{formData.dueDate || '[Ngày hết hạn]'}</span>
                  </div>
                  
                  <div>
                    <strong>Điều 3:</strong> Lý do: <span className="text-red-600">{formData.reason || '[Lý do cưỡng chế]'}</span>
                  </div>
                </div>
                
                <div className="mt-8 text-right">
                  <div className="text-sm text-gray-600">
                    <p>TP. Hồ Chí Minh, ngày ... tháng ... năm 2025</p>
                    <p className="mt-4 font-semibold">GIÁM ĐỐC</p>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Warning */}
        <Card variant="elevated" className="mt-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Card.Body>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-xl flex-shrink-0">
                ⚠️
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Lưu Ý Về Cưỡng Chế</h3>
                <div className="text-gray-600 space-y-2">
                  <p>• Quyết định cưỡng chế chỉ được thực hiện sau khi đã thực hiện đầy đủ các biện pháp nhắc nhở</p>
                  <p>• Cần có căn cứ pháp lý đầy đủ và chính xác</p>
                  <p>• Phải tuân thủ đúng quy trình và thời hạn theo quy định</p>
                  <p>• Quyết định phải được ký bởi người có thẩm quyền</p>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}

export default CreateQRCodePage
