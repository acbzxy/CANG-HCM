import React, { useState, useEffect } from 'react'
import Button from '../../components/ui/Button'
import { useLocation } from 'react-router-dom'

const ReceiptLookupPage: React.FC = () => {
  const location = useLocation()
  const [receiptId, setReceiptId] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [captcha, setCaptcha] = useState('JRHMG')
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null)
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [receiptData, setReceiptData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // Mock receipt data based on the image
  const mockReceipt = {
    title: 'BIÊN LAI THU TIỀN PHÍ',
    subtitle: 'Sử dụng công trình kết cấu hạ tầng, công trình phục vụ',
    subtitle2: 'của Cảng vụ Hàng hải khu vực nước cảng Sài Gòn - TP.HCM',
    receiptNumber: 'SỐ TỐ KHAI/CẤP BIÊN LAI ĐẾN SỐ:',
    receiptSeries: 'TPHCM ngày 19 tháng 10 năm 2021',
    
    company: {
      name: 'CÔNG TY CỔ PHẦN KỸ THUẬT ĐỒ LƯỜNG VBS',
      taxCode: '0101556324',
      address: 'Số 298, phố Cầu Giấy Đình - Phường Cầu Giấy - Quận Ba Đình - Hà Nội'
    },
    
    vessel: {
      registrationNumber: '31418849799',
      departureDate: '30/10/2021',
      tonnage: '100001244149',
      arrivalDate: '04/10/2021'
    },
    
    cargo: {
      type: 'A11',
      category: 'TP001',
      description: 'Chuyển khoản'
    },
    
    services: [
      {
        stt: 1,
        description: 'Container 20 feet',
        unit: 'Đồng/Tấn',
        quantity: 1,
        unitPrice: 500000,
        amount: 500000
      },
      {
        stt: 2,
        description: 'Container 40 feet',
        unit: 'Đồng/Tấn',
        quantity: 2,
        unitPrice: 500000,
        amount: 1000000
      }
    ],
    
    total: 1500000,
    
    signatures: {
      payer: 'Người nộp tiền\n(Ký, ghi rõ họ tên)',
      collector: 'Người thu tiền\n(Ký, ghi rõ họ tên)'
    }
  }

  const handleSearch = async () => {
    if (!receiptId || !verificationCode) {
      alert('Vui lòng nhập đầy đủ thông tin!')
      return
    }

    setLoading(true)
    try {
      // Call API to search receipt by maBl
      const response = await fetch(`/api/bien-lai/search-by-mabl?maBl=${receiptId}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
      console.log('🔍 Receipt search response:', result)
      
      if (result.status === 200 && result.data) {
        console.log('🔍 Receipt data received:', result.data)
        console.log('🔍 imageBl type:', typeof result.data.imageBl)
        console.log('🔍 imageBl length:', result.data.imageBl?.length)
        console.log('🔍 imageBl preview:', result.data.imageBl?.substring(0, 100) + '...')
        setReceiptData(result.data)
        setShowReceiptModal(true)
      } else {
        alert('Không tìm thấy biên lai với mã: ' + receiptId)
      }
    } catch (error) {
      console.error('❌ Error searching receipt:', error)
      alert('Có lỗi xảy ra khi tìm kiếm biên lai: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleCloseModal = () => {
    setShowReceiptModal(false)
    setReceiptData(null)
  }

  const handleDownloadPDF = () => {
    if (receiptData?.imageBl) {
      try {
        // Create blob from base64
        const byteCharacters = atob(receiptData.imageBl)
        const byteNumbers = new Array(byteCharacters.length)
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i)
        }
        const byteArray = new Uint8Array(byteNumbers)
        const blob = new Blob([byteArray], { type: 'application/pdf' })
        
        // Create download link
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `bien-lai-${receiptData.maBl}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        
        console.log('✅ PDF downloaded successfully')
      } catch (error) {
        console.error('❌ Error downloading PDF:', error)
        alert('Có lỗi khi tải PDF: ' + (error as Error).message)
      }
    }
  }

  const refreshCaptcha = () => {
    // Generate random captcha
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setCaptcha(result)
  }

  // Auto open viewer when having query params (code or receiptNo)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const code = searchParams.get('code')
    const receiptNo = searchParams.get('receiptNo')
    const value = code || receiptNo
    if (value) {
      setReceiptId(value)
      setVerificationCode(captcha) // auto pass captcha
      // wait state set, then search
      setTimeout(() => {
        handleSearch()
      }, 0)
    }
  }, [location.search, captcha])

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content */}
      <div className="h-full">
        {!selectedReceipt ? (
          <div className="bg-white min-h-screen">
            {/* Header Section */}
            <div className="text-center py-8 bg-gray-50">
              <h1 className="text-2xl font-bold text-blue-600 mb-2">SỞ XÂY DỰNG</h1>
              <h2 className="text-xl font-bold text-blue-600 mb-2">THÀNH PHỐ HỒ CHÍ MINH</h2>
              <h3 className="text-xl font-bold text-blue-600">CẢNG VỤ ĐƯỜNG THỦY NỘI ĐỊA</h3>
            </div>

            {/* Form Section */}
            <div className="border border-gray-300 mx-8 mb-8">
              {/* Form Header */}
              <div className="bg-white border-b border-gray-300 p-4">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">📄</span>
                  <span className="font-medium text-gray-800">Tra cứu biên lai điện tử</span>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6">
                {/* Description */}
                <div className="text-center mb-6">
                  <p className="text-gray-700 mb-1">ĐỂ ĐĂNG TRA CỨU BIÊN LAI ĐIỆN TỬ ĐƯỢC PHÁT HÀNH TỪ HỆ THỐNG THU PHÍ.</p>
                  <p className="text-gray-700 font-semibold">TIỆN ÍCH - ĐƠN GIẢN - NHANH CHÓNG</p>
                </div>

                {/* Form Fields */}
                <div className="max-w-3xl mx-auto px-8">
                  <table className="w-full">
                    <tbody>
                      {/* Receipt ID Row */}
                      <tr>
                        <td className="py-3 pr-4 text-right align-middle w-48">
                          <label className="text-gray-700">
                            Mã nhận biên lai: <span className="text-red-500">*</span>
                          </label>
                        </td>
                        <td className="py-3 pl-4">
                          <input
                            type="text"
                            value={receiptId}
                            onChange={(e) => setReceiptId(e.target.value)}
                            placeholder="NHẬP MÃ Ở ĐÂY"
                            className="px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-blue-500 w-80"
                          />
                        </td>
                      </tr>
                      
                      {/* Verification Code Row */}
                      <tr>
                        <td className="py-3 pr-4 text-right align-middle w-48">
                          <label className="text-gray-700">
                            Mã xác nhận: <span className="text-red-500">*</span>
                          </label>
                        </td>
                        <td className="py-3 pl-4">
                          <div className="flex items-center space-x-3">
                            <input
                              type="text"
                              value={verificationCode}
                              onChange={(e) => setVerificationCode(e.target.value)}
                              className="px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-blue-500 w-24"
                            />
                            <div className="bg-blue-100 border border-blue-300 px-3 py-2 font-bold text-blue-800 text-base tracking-widest">
                              {captcha}
                            </div>
                            <button
                              onClick={refreshCaptcha}
                              className="text-blue-600 hover:text-blue-800 text-sm underline"
                              title="Refresh"
                            >
                              🔄 Refresh
                            </button>
                          </div>
                        </td>
                      </tr>
                      
                      {/* Button Row */}
                      <tr>
                        <td></td>
                        <td className="py-6 pl-4">
                          <button
                            onClick={handleSearch}
                            disabled={loading}
                            className={`${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium px-6 py-2 transition-colors duration-200 flex items-center`}
                          >
                            {loading ? '⏳ Đang tìm...' : '🔍 Tìm biên lai'}
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white min-h-screen px-8 py-8">
            {/* Back Button */}
            <div className="mb-4 flex justify-between items-center">
              <button
                onClick={() => setSelectedReceipt(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
              >
                ← Quay lại
              </button>
              <button
                onClick={handlePrint}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
              >
                🖨️ In biên lai
              </button>
            </div>
            
            {/* Receipt Content */}
            <div className="bg-white border border-black p-6 print:border-none print:p-0 max-w-4xl mx-auto relative" id="receipt-content">
              {/* Watermark ở giữa */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <img 
                  src="/trong-dong.jpg" 
                  alt="Watermark" 
                  className="opacity-25 w-[600px] h-[600px] object-contain"
                />
              </div>
              {/* Content - positioned above watermark */}
              <div className="relative z-10">
              {/* Header */}
              <div className="text-center mb-4">
                <h1 className="text-lg font-bold mb-1">BIÊN LAI THU TIỀN PHÍ</h1>
                <p className="text-xs font-bold mb-1">Sử dụng công trình kết cấu hạ tầng, công trình phục vụ</p>
                <p className="text-xs font-bold mb-1">của Cảng vụ Hàng hải khu vực nước cảng Sài Gòn - TP.HCM</p>
                <p className="text-xs mb-3">(BẢN THỂ HIỆN CỦA BIÊN LAI ĐIỆN TỬ)</p>
                                  <p className="text-xs italic">TPHCM ngày 19 tháng 10 năm 2021</p>
              </div>

              {/* Company Info Table - Exact match to image */}
              <div className="mb-6 text-sm">
                <table className="w-full border-collapse border border-black">
                  <tbody>
                    {/* Company Name Row - spans full width */}
                    <tr>
                      <td className="border border-black px-2 py-1 font-semibold bg-gray-100 w-40">Tên đơn vị:</td>
                      <td className="border border-black px-2 py-1 font-bold" colSpan={3}>CÔNG TY CỔ PHẦN KỸ THUẬT ĐO LƯỜNG VBS</td>
                    </tr>
                    
                    {/* Tax Code Row - spans full width */}
                    <tr>
                      <td className="border border-black px-2 py-1 font-semibold bg-gray-100">Mã doanh nghiệp:</td>
                      <td className="border border-black px-2 py-1" colSpan={3}>0101566324</td>
                    </tr>
                    
                    {/* Address Row - spans full width */}
                    <tr>
                      <td className="border border-black px-2 py-1 font-semibold bg-gray-100">Địa chỉ:</td>
                      <td className="border border-black px-2 py-1" colSpan={3}>phố Cao Cát Dứa - Thị Trấn Cao Phong - Hòa Bình</td>
                    </tr>
                    
                    {/* Phone and Date Row - 4 columns */}
                    <tr>
                      <td className="border border-black px-2 py-1 font-semibold bg-gray-100 w-40">Số điện thoại:</td>
                      <td className="border border-black px-2 py-1 w-40">2114483959</td>
                      <td className="border border-black px-2 py-1 font-semibold bg-gray-100 w-40">Ngày thông báo phí:</td>
                      <td className="border border-black px-2 py-1">30.10.2023</td>
                    </tr>
                    
                    {/* Declaration Number and Date Row - 4 columns */}
                    <tr>
                      <td className="border border-black px-2 py-1 font-semibold bg-gray-100">Số tờ khai hải quan:</td>
                      <td className="border border-black px-2 py-1">1000021416</td>
                      <td className="border border-black px-2 py-1 font-semibold bg-gray-100">Ngày tờ khai:</td>
                      <td className="border border-black px-2 py-1">30.10.2023</td>
                    </tr>
                    
                    {/* Empty Row for spacing */}
                    <tr>
                      <td className="border border-black px-2 py-1" colSpan={4}>&nbsp;</td>
                    </tr>
                    
                    {/* Cargo Type Row */}
                    <tr>
                      <td className="border border-black px-2 py-1 font-semibold bg-gray-100">Loại hành lý:</td>
                      <td className="border border-black px-2 py-1">A11</td>
                      <td className="border border-black px-2 py-1" colSpan={2}>&nbsp;</td>
                    </tr>
                    
                    {/* Goods Group and Payment Method Row */}
                    <tr>
                      <td className="border border-black px-2 py-1 font-semibold bg-gray-100">Nhóm hàng hóa:</td>
                      <td className="border border-black px-2 py-1">TP003</td>
                      <td className="border border-black px-2 py-1 font-semibold bg-gray-100">Hình thức thanh toán:</td>
                      <td className="border border-black px-2 py-1">Chuyển khoản</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Services Table */}
              <div className="mb-4">
                <table className="w-full border-collapse border border-black text-xs">
                  <thead>
                    <tr>
                      <th className="border border-black px-1 py-1 text-center w-8">STT</th>
                      <th className="border border-black px-1 py-1 text-center">Nội dung thu phí</th>
                      <th className="border border-black px-1 py-1 text-center w-16">Đơn vị tính</th>
                      <th className="border border-black px-1 py-1 text-center w-16">Khối lượng/Số lượng</th>
                      <th className="border border-black px-1 py-1 text-center w-20">Thành tiền (đồng)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-black px-1 py-1 text-center">(1)</td>
                      <td className="border border-black px-1 py-1 text-center">(2)</td>
                      <td className="border border-black px-1 py-1 text-center">(3)</td>
                      <td className="border border-black px-1 py-1 text-center">(4)</td>
                      <td className="border border-black px-1 py-1 text-center">(5) = (3) x (4)</td>
                    </tr>
                    <tr>
                      <td className="border border-black px-1 py-2 text-center">1</td>
                      <td className="border border-black px-1 py-2">Container 20 feet</td>
                      <td className="border border-black px-1 py-2 text-center">Đồng/Tấn</td>
                      <td className="border border-black px-1 py-2 text-center">250.000</td>
                      <td className="border border-black px-1 py-2 text-right">500.000</td>
                    </tr>
                    <tr>
                      <td className="border border-black px-1 py-2 text-center">2</td>
                      <td className="border border-black px-1 py-2">Container 40 feet</td>
                      <td className="border border-black px-1 py-2 text-center">Đồng/Tấn</td>
                      <td className="border border-black px-1 py-2 text-center">500.000</td>
                      <td className="border border-black px-1 py-2 text-right">1.000.000</td>
                    </tr>
                    {/* Empty rows */}
                    {[...Array(12)].map((_, i) => (
                      <tr key={`empty-${i}`} className="h-6">
                        <td className="border border-black px-1 py-1">&nbsp;</td>
                        <td className="border border-black px-1 py-1">&nbsp;</td>
                        <td className="border border-black px-1 py-1">&nbsp;</td>
                        <td className="border border-black px-1 py-1">&nbsp;</td>
                        <td className="border border-black px-1 py-1">&nbsp;</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total */}
              <div className="mb-4 text-xs">
                <div className="flex justify-between items-center">
                  <span>Cộng số tiền phải nộp:</span>
                  <span className="font-bold">1.500.000</span>
                </div>
                <div className="mt-1">
                  <span>Số tiền viết bằng chữ: </span>
                  <span className="italic">Một triệu năm trăm nghìn đồng</span>
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-8 text-xs text-center mt-8">
                <div>
                  <div className="font-medium mb-12">Người nộp tiền<br/>(Ký, ghi rõ họ tên)</div>
                </div>
                <div>
                  <div className="font-medium mb-12">Người thu tiền<br/>(Ký, ghi rõ họ tên)</div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 text-xs text-center border-t border-red-500 pt-2">
                <p className="text-red-600">Mẫu biên lai được PVCFCAVN sử dụng theo quyết định số 1525 - QĐ/PVCFCAVN ngày 15/9/2021</p>
                <p className="text-xs text-gray-600 mt-1">Cần ghi biên lai khi PVCFCAVN có yêu cầu - Hotline: 1800.6779 hoặc truy cập: www.pvcfcavn.vn để biết thêm chi tiết</p>
              </div>
              </div> {/* End content div */}
            </div>
          </div>
        )}
      </div>

      {/* Receipt Modal - PDF Viewer Style */}
      {showReceiptModal && receiptData && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Header */}
          <div style={{
            backgroundColor: '#1f2937',
            color: 'white',
            padding: '12px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #374151'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '16px', fontWeight: 'bold' }}>▲ Phát hành biên lai điện tử</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={handleCloseModal}
                style={{
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '4px'
                }}
              >
                ×
              </button>
            </div>
          </div>

          {/* PDF Viewer Area */}
          <div style={{
            flex: 1,
            backgroundColor: '#f3f4f6',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Toolbar */}
            <div style={{
              backgroundColor: 'white',
              borderBottom: '1px solid #e5e7eb',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '12px'
            }}>
              <button style={{ padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: 'white' }}>📋</button>
              <button style={{ padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: 'white' }}>🖨️</button>
              <button style={{ padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: 'white' }}>⋯</button>
              <div style={{ width: '1px', height: '20px', backgroundColor: '#d1d5db' }}></div>
              <button style={{ padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: 'white' }}>-</button>
              <span style={{ fontSize: '11px', color: '#6b7280' }}>100%</span>
              <button style={{ padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: 'white' }}>+</button>
              <div style={{ width: '1px', height: '20px', backgroundColor: '#d1d5db' }}></div>
              <button style={{ padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: 'white' }}>‹</button>
              <span style={{ fontSize: '11px', color: '#6b7280' }}>1 of 1</span>
              <button style={{ padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: 'white' }}>›</button>
              <div style={{ width: '1px', height: '20px', backgroundColor: '#d1d5db' }}></div>
              <button style={{ padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: 'white' }}>🔄</button>
              <button style={{ padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: 'white' }}>📋</button>
              <button style={{ padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: 'white' }}>🔍</button>
              <button 
                onClick={handleDownloadPDF}
                style={{ 
                  padding: '4px 8px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '4px', 
                  backgroundColor: 'white',
                  cursor: 'pointer'
                }}
                title="Tải PDF"
              >
                💾
              </button>
              <button style={{ padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: 'white' }}>⋯</button>
            </div>

            {/* PDF Content */}
            <div style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '20px',
              overflow: 'auto'
            }}>
              {receiptData.imageBl ? (
                <iframe
                  src={`data:application/pdf;base64,${receiptData.imageBl}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    backgroundColor: 'white'
                  }}
                  title="Biên lai điện tử PDF"
                />
              ) : (
                <div style={{
                  backgroundColor: 'white',
                  padding: '40px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  textAlign: 'center',
                  color: '#6b7280'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>Biên lai điện tử</div>
                  <div style={{ fontSize: '14px' }}>Mã biên lai: {receiptData.maBl}</div>
                  <div style={{ fontSize: '14px' }}>Số biên lai: {receiptData.soBl}</div>
                  <div style={{ fontSize: '14px' }}>Ngày tạo: {new Date(receiptData.ngayTao).toLocaleDateString('vi-VN')}</div>
                  <div style={{ fontSize: '12px', marginTop: '16px', color: '#9ca3af' }}>
                    Không có dữ liệu PDF từ server
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div style={{
            backgroundColor: '#f9fafb',
            borderTop: '1px solid #e5e7eb',
            padding: '12px 20px',
            textAlign: 'right'
          }}>
            <button
              onClick={handleCloseModal}
              style={{
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '8px 16px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReceiptLookupPage
