import React, { useState } from 'react'
import { useNotification } from '../context/NotificationContext'

const BarcodeFeePage: React.FC = () => {
  const { showError, showSuccess } = useNotification()
  const [barcodeData, setBarcodeData] = useState('')

  const handleBarcodeScan = () => {
    // TODO: Implement barcode scanning functionality
    showSuccess('Chức năng quét barcode đang được phát triển')
  }

  const handleSubmit = () => {
    if (!barcodeData.trim()) {
      showError('Vui lòng nhập mã barcode')
      return
    }
    
    // TODO: Implement barcode processing
    showSuccess(`Đã xử lý barcode: ${barcodeData}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Barcode Tờ Khai Nộp Phí
        </h1>
        
        <div className="space-y-6">
          {/* Barcode Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mã Barcode
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={barcodeData}
                onChange={(e) => setBarcodeData(e.target.value)}
                placeholder="Nhập mã barcode hoặc quét..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleBarcodeScan}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <i className="fas fa-camera mr-2"></i>
                Quét
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <i className="fas fa-check mr-2"></i>
              Xử Lý
            </button>
            
            <button
              onClick={() => setBarcodeData('')}
              className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <i className="fas fa-refresh mr-2"></i>
              Làm Mới
            </button>
          </div>

          {/* Info Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h3 className="text-lg font-medium text-blue-800 mb-2">
              Hướng dẫn sử dụng
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Nhập mã barcode vào ô input hoặc sử dụng nút "Quét"</li>
              <li>• Nhấn "Xử Lý" để tra cứu thông tin tờ khai</li>
              <li>• Nhấn "Làm Mới" để xóa dữ liệu hiện tại</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BarcodeFeePage

