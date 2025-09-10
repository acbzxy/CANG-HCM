import React from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

const DetailedReportPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white text-2xl">
                📊
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Báo Cáo Ấn Chỉ</h1>
                <p className="text-gray-600">Báo cáo chi tiết về ấn chỉ</p>
              </div>
            </div>
            <Button variant="danger" icon={<span>📊</span>}>
              Xuất Báo Cáo
            </Button>
          </div>
        </div>

        <Card className="animate-fade-in-up">
          <Card.Body>
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Báo Cáo Ấn Chỉ</h3>
              <p className="text-gray-600">Báo cáo chi tiết về tình hình ấn chỉ</p>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}

export default DetailedReportPage
