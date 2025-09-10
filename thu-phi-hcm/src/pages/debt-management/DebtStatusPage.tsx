import React, { useState } from 'react'
import * as XLSX from 'xlsx'

const DebtStatusPage: React.FC = () => {
  const [fromDate, setFromDate] = useState('28/08/2024')
  const [toDate, setToDate] = useState('28/08/2025')
  const [declarationNumber, setDeclarationNumber] = useState('')
  const [declarationType, setDeclarationType] = useState('-- Loại khai --')
  const [feePaymentType, setFeePaymentType] = useState('-- TT nộp phí --')
  const [activeTab, setActiveTab] = useState('debt-list')
  const [refreshKey, setRefreshKey] = useState(0)

  // All mock data for filtering
  const allDebtListData = [
    {
      stt: 1,
      enterprise: 'CÔNG TY CỔ PHẦN KỸ THUẬT ĐO LƯỜNG VBS',
      declarationNumber: '1000021416',
      declarationDate: '30/10/2021',
      declarationType: 'Tờ khai nợ phí',
      customsOffice: 'Cục Hải quan TP.HCM',
      warehouseCode: 'KHO001',
      feeNotificationDate: '30/10/2021',
      getoutDate: '30/10/2021',
      totalWeight: '750',
      unit: 'Tấn',
      feeType: 'Phí cảng',
      containerDetails: 'Container 20 feet, 40 feet',
      amount: '1,500,000',
      feeDeclaration: 'Tờ khai nợ phí',
      repeat: 'Lần 1',
      maPLHH: 'PL001',
      exemption: 'Không',
      note: ''
    },
    {
      stt: 2,
      enterprise: 'CÔNG TY TNHH ABC LOGISTICS',
      declarationNumber: '1000021417',
      declarationDate: '15/11/2021',
      declarationType: 'Chưa khai báo phí',
      customsOffice: 'Cục Hải quan Đồng Nai',
      warehouseCode: 'KHO002',
      feeNotificationDate: '15/11/2021',
      getoutDate: '16/11/2021',
      totalWeight: '1,200',
      unit: 'Tấn',
      feeType: 'Phí dịch vụ',
      containerDetails: 'Container 40 feet',
      amount: '2,300,000',
      feeDeclaration: 'Chưa khai báo phí',
      repeat: 'Lần 1',
      maPLHH: 'PL002',
      exemption: 'Không',
      note: 'Đã thanh toán 50%'
    },
    {
      stt: 3,
      enterprise: 'CÔNG TY CP THƯƠNG MẠI XYZ',
      declarationNumber: '1000021418',
      declarationDate: '20/12/2021',
      declarationType: 'Đã khai báo phí nhưng chưa nộp',
      customsOffice: 'Cục Hải quan Vũng Tàu',
      warehouseCode: 'KHO003',
      feeNotificationDate: '20/12/2021',
      getoutDate: '21/12/2021',
      totalWeight: '400',
      unit: 'Tấn',
      feeType: 'Phí kho bãi',
      containerDetails: 'Container 20 feet',
      amount: '800,000',
      feeDeclaration: 'Đã khai báo phí nhưng chưa nộp',
      repeat: 'Lần 1',
      maPLHH: 'PL003',
      exemption: 'Có',
      note: 'Hoàn thành'
    },
    {
      stt: 4,
      enterprise: 'CÔNG TY TNHH DEF IMPORT EXPORT',
      declarationNumber: '1000021419',
      declarationDate: '05/01/2022',
      declarationType: 'Đã nộp phí nhưng khai sai hoặc thiếu',
      customsOffice: 'Cục Hải quan TP.HCM',
      warehouseCode: 'KHO004',
      feeNotificationDate: '05/01/2022',
      getoutDate: '06/01/2022',
      totalWeight: '2,100',
      unit: 'Tấn',
      feeType: 'Phí cảng',
      containerDetails: 'Hàng container',
      amount: '4,200,000',
      feeDeclaration: 'Đã nộp phí nhưng khai sai hoặc thiếu',
      repeat: 'Lần 2',
      maPLHH: 'PL004',
      exemption: 'Không',
      note: 'Cần bổ sung'
    },
    {
      stt: 5,
      enterprise: 'CÔNG TY CP LOGISTICS GHI',
      declarationNumber: '1000021420',
      declarationDate: '12/02/2022',
      declarationType: 'Đang bị cưỡng chế',
      customsOffice: 'Cục Hải quan Đồng Nai',
      warehouseCode: 'KHO005',
      feeNotificationDate: '12/02/2022',
      getoutDate: '13/02/2022',
      totalWeight: '890',
      unit: 'Tấn',
      feeType: 'Phí dịch vụ',
      containerDetails: 'Hàng kiện, rời, lỏng',
      amount: '1,780,000',
      feeDeclaration: 'Đang bị cưỡng chế',
      repeat: 'Lần 3',
      maPLHH: 'PL005',
      exemption: 'Không',
      note: 'Đang xử lý'
    },
    {
      stt: 6,
      enterprise: 'CÔNG TY TNHH JKL TRADING',
      declarationNumber: '1000021421',
      declarationDate: '28/08/2024',
      declarationType: 'Tờ khai nợ phí',
      customsOffice: 'Cục Hải quan Vũng Tàu',
      warehouseCode: 'KHO006',
      feeNotificationDate: '28/08/2024',
      getoutDate: '29/08/2024',
      totalWeight: '1,500',
      unit: 'Tấn',
      feeType: 'Phí kho bãi',
      containerDetails: 'Hàng lạnh',
      amount: '3,000,000',
      feeDeclaration: 'Tờ khai nợ phí',
      repeat: 'Lần 1',
      maPLHH: 'PL006',
      exemption: 'Có',
      note: 'Mới phát sinh'
    },
    {
      stt: 7,
      enterprise: 'CÔNG TY CP MNO SHIPPING',
      declarationNumber: '1000021422',
      declarationDate: '15/08/2024',
      declarationType: 'Chưa khai báo phí',
      customsOffice: 'Cục Hải quan TP.HCM',
      warehouseCode: 'KHO007',
      feeNotificationDate: '15/08/2024',
      getoutDate: '16/08/2024',
      totalWeight: '3,200',
      unit: 'Tấn',
      feeType: 'Phí cảng',
      containerDetails: 'Container 40 feet',
      amount: '6,400,000',
      feeDeclaration: 'Chưa khai báo phí',
      repeat: 'Lần 1',
      maPLHH: 'PL007',
      exemption: 'Không',
      note: 'Cần xử lý gấp'
    },
    {
      stt: 8,
      enterprise: 'CÔNG TY TNHH PQR LOGISTICS',
      declarationNumber: '1000021423',
      declarationDate: '10/08/2025',
      declarationType: 'Đã khai báo phí nhưng chưa nộp',
      customsOffice: 'Cục Hải quan Đồng Nai',
      warehouseCode: 'KHO008',
      feeNotificationDate: '10/08/2025',
      getoutDate: '11/08/2025',
      totalWeight: '2,800',
      unit: 'Tấn',
      feeType: 'Phí dịch vụ',
      containerDetails: 'Hàng rời',
      amount: '5,600,000',
      feeDeclaration: 'Đã khai báo phí nhưng chưa nộp',
      repeat: 'Lần 1',
      maPLHH: 'PL008',
      exemption: 'Không',
      note: 'Đã có thông báo'
    }
  ]

  // Filter function - always apply filters based on current values
  const filterData = () => {
    return allDebtListData.filter(item => {
      // Filter by date range
      const itemDate = new Date(item.getoutDate.split('/').reverse().join('-'))
      const fromDateObj = new Date(fromDate.split('/').reverse().join('-'))
      const toDateObj = new Date(toDate.split('/').reverse().join('-'))
      
      const dateInRange = itemDate >= fromDateObj && itemDate <= toDateObj

      // Filter by declaration number
      const declarationMatch = !declarationNumber || item.declarationNumber.includes(declarationNumber)

      // Filter by declaration type
      const typeMatch = declarationType === '-- Loại khai --' || item.declarationType === declarationType

      // Filter by fee payment type
      const feeMatch = feePaymentType === '-- TT nộp phí --' || item.feeDeclaration === feePaymentType

      return dateInRange && declarationMatch && typeMatch && feeMatch
    })
  }

  // Handle search button click - force re-render by updating refresh key
  const handleSearch = () => {
    setRefreshKey(prev => prev + 1) // Force re-render to apply current filter values
  }

  // Handle export excel
  const handleExportExcel = () => {
    const currentData = activeTab === 'debt-list' ? mockDebtListData : mockDebtSummaryData
    
    if (currentData.length === 0) {
      alert('Không có dữ liệu để xuất!')
      return
    }

    // Prepare data for Excel
    let worksheetData = []
    let sheetName = ''
    let fileName = ''
    
    if (activeTab === 'debt-list') {
      // Headers for debt list
      const headers = [
        'STT', 'DOANH NGHIỆP', 'SỐ TK', 'NGÀY ĐĂNG KÝ', 'LOẠI HÌNH', 'HẢI QUAN', 
        'ĐỊ LƯU KHO', 'DỊCH BÁO THUẾ', 'NGÀY GETOUT', 'TỔNG TL', 'ĐVT', 'LOẠI PHÍ', 
        'CHI TIẾT HÀNG CONT', 'SỐ TIỀN', 'KHAI PHÍ', 'BIỆN LAI', 'MÃ PL HH', 'MIỄN PHÍ', 'GHI CHÚ'
      ]
      
      // Add headers as first row
      worksheetData.push(headers)
      
      // Add data rows
      mockDebtListData.forEach(item => {
        worksheetData.push([
          item.stt,
          item.enterprise,
          item.declarationNumber,
          item.declarationDate,
          item.declarationType,
          item.customsOffice,
          item.warehouseCode,
          item.feeNotificationDate,
          item.getoutDate,
          item.totalWeight,
          item.unit,
          item.feeType,
          item.containerDetails,
          item.amount,
          item.feeDeclaration,
          item.repeat,
          item.maPLHH,
          item.exemption,
          item.note
        ])
      })
      
      sheetName = 'Danh sách tờ khai nợ phí'
      fileName = `Danh_sach_to_khai_no_phi_${new Date().toLocaleDateString('vi-VN').replace(/\//g, '_')}.xlsx`
    } else {
      // Headers for debt summary
      const headers = [
        'STT', 'MÃ DN', 'TÊN DN', 'LOẠI HÀNG', 'TỔNG TỜ KHAI', 
        'TỔNG TRỌNG LƯỢNG', 'TỔNG TIỀN', 'NGÀY GETOUT GẦN NHẤT', 'MÃ HỒ GETOUT', 'CƯỠNG CHẾ'
      ]
      
      // Add headers as first row
      worksheetData.push(headers)
      
      // Add data rows
      mockDebtSummaryData.forEach(item => {
        worksheetData.push([
          item.stt,
          item.enterpriseCode,
          item.enterprise,
          item.cargoType,
          item.totalDeclarations,
          `${item.totalWeight} tấn`,
          `${item.totalAmount} VNĐ`,
          item.lastGetoutDate,
          item.getoutCode,
          item.enforcement
        ])
      })
      
      sheetName = 'Tổng hợp nợ phí DN'
      fileName = `Tong_hop_no_phi_doanh_nghiep_${new Date().toLocaleDateString('vi-VN').replace(/\//g, '_')}.xlsx`
    }

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)
    
    // Set column widths
    
    if (activeTab === 'debt-list') {
      worksheet['!cols'] = [
        { width: 5 },   // STT
        { width: 35 },  // DOANH NGHIỆP
        { width: 15 },  // SỐ TK
        { width: 12 },  // NGÀY ĐĂNG KÝ
        { width: 25 },  // LOẠI HÌNH
        { width: 20 },  // HẢI QUAN
        { width: 12 },  // ĐỊ LƯU KHO
        { width: 15 },  // DỊCH BÁO THUẾ
        { width: 15 },  // NGÀY GETOUT
        { width: 10 },  // TỔNG TL
        { width: 8 },   // ĐVT
        { width: 15 },  // LOẠI PHÍ
        { width: 25 },  // CHI TIẾT HÀNG CONT
        { width: 15 },  // SỐ TIỀN
        { width: 20 },  // KHAI PHÍ
        { width: 10 },  // BIỆN LAI
        { width: 12 },  // MÃ PL HH
        { width: 10 },  // MIỄN PHÍ
        { width: 15 }   // GHI CHÚ
      ]
    } else {
      worksheet['!cols'] = [
        { width: 5 },   // STT
        { width: 10 },  // MÃ DN
        { width: 35 },  // TÊN DN
        { width: 15 },  // LOẠI HÀNG
        { width: 15 },  // TỔNG TỜ KHAI
        { width: 18 },  // TỔNG TRỌNG LƯỢNG
        { width: 18 },  // TỔNG TIỀN
        { width: 20 },  // NGÀY GETOUT GẦN NHẤT
        { width: 15 },  // MÃ HỒ GETOUT
        { width: 15 }   // CƯỠNG CHẾ
      ]
    }
    
    // Apply styles to all cells
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1')
    
    for (let row = range.s.r; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col })
        
        if (!worksheet[cellAddress]) {
          worksheet[cellAddress] = { t: 's', v: '' }
        }
        
        // Header row styling (row 0)
        if (row === 0) {
          worksheet[cellAddress].s = {
            font: { 
              bold: true, 
              color: { rgb: "FFFFFF" },
              sz: 11
            },
            fill: { 
              patternType: "solid",
              fgColor: { rgb: "4472C4" }
            },
            alignment: { 
              horizontal: "center", 
              vertical: "center",
              wrapText: true
            },
            border: {
              top: { style: "thin", color: { rgb: "000000" } },
              bottom: { style: "thin", color: { rgb: "000000" } },
              left: { style: "thin", color: { rgb: "000000" } },
              right: { style: "thin", color: { rgb: "000000" } }
            }
          }
        } else {
          // Data row styling
          worksheet[cellAddress].s = {
            font: { 
              sz: 10
            },
            alignment: { 
              horizontal: col === 0 || (activeTab === 'debt-list' && [9, 13].includes(col)) || (activeTab === 'debt-summary' && [0, 4].includes(col)) ? "center" : "left",
              vertical: "center"
            },
            border: {
              top: { style: "thin", color: { rgb: "000000" } },
              bottom: { style: "thin", color: { rgb: "000000" } },
              left: { style: "thin", color: { rgb: "000000" } },
              right: { style: "thin", color: { rgb: "000000" } }
            }
          }
        }
      }
    }
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
    
    // Write and download the file
    XLSX.writeFile(workbook, fileName)
    
    // Show success message
    alert(`Đã xuất thành công ${currentData.length} bản ghi ra file Excel (.xlsx)!`)
  }

  const mockDebtListData = filterData().map((item, index) => ({
    ...item,
    stt: index + 1,
    refreshKey // Include refreshKey to trigger re-calculation
  }))

  // Mock data for debt summary tab - also filtered
  const allDebtSummaryData = [
    {
      stt: 1,
      enterpriseCode: 'VBS001',
      enterprise: 'CÔNG TY CỔ PHẦN KỸ THUẬT ĐO LƯỜNG VBS',
      cargoType: 'Container',
      totalDeclarations: 5,
      totalWeight: '2,500',
      totalAmount: '7,500,000',
      lastGetoutDate: '30/10/2021',
      getoutCode: 'GT001',
      enforcement: 'Chưa cưỡng chế'
    },
    {
      stt: 2,
      enterpriseCode: 'ABC002',
      enterprise: 'CÔNG TY TNHH ABC LOGISTICS',
      cargoType: 'Hàng rời',
      totalDeclarations: 8,
      totalWeight: '5,200',
      totalAmount: '12,300,000',
      lastGetoutDate: '15/11/2021',
      getoutCode: 'GT002',
      enforcement: 'Đã cưỡng chế'
    },
    {
      stt: 3,
      enterpriseCode: 'XYZ003',
      enterprise: 'CÔNG TY CP THƯƠNG MẠI XYZ',
      cargoType: 'Hàng khô',
      totalDeclarations: 3,
      totalWeight: '1,800',
      totalAmount: '4,200,000',
      lastGetoutDate: '20/12/2021',
      getoutCode: 'GT003',
      enforcement: 'Chưa cưỡng chế'
    },
    {
      stt: 4,
      enterpriseCode: 'DEF004',
      enterprise: 'CÔNG TY TNHH DEF IMPORT EXPORT',
      cargoType: 'Container',
      totalDeclarations: 12,
      totalWeight: '8,750',
      totalAmount: '18,900,000',
      lastGetoutDate: '05/01/2022',
      getoutCode: 'GT004',
      enforcement: 'Đang xử lý'
    },
    {
      stt: 5,
      enterpriseCode: 'GHI005',
      enterprise: 'CÔNG TY CP LOGISTICS GHI',
      cargoType: 'Hàng lạnh',
      totalDeclarations: 6,
      totalWeight: '3,400',
      totalAmount: '9,800,000',
      lastGetoutDate: '12/01/2022',
      getoutCode: 'GT005',
      enforcement: 'Chưa cưỡng chế'
    }
  ]

  const mockDebtSummaryData = allDebtSummaryData.map((item, index) => ({
    ...item,
    stt: index + 1
  }))

  const currentData = activeTab === 'debt-list' ? mockDebtListData : mockDebtSummaryData

  return (
    <div className="min-h-screen bg-white">
      {/* Top toolbar matching the right image */}
      <div className="bg-blue-600 text-white px-4 py-3">
        <div className="flex items-center space-x-3 flex-wrap">
          <button 
            onClick={handleExportExcel}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm flex items-center space-x-2 font-medium"
          >
            <span>📄</span>
            <span>Export excel</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Ngày getout, từ:</span>
            <input 
              type="text" 
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="px-3 py-2 text-black text-sm w-28 rounded border-0 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Đến:</span>
            <input 
              type="text" 
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="px-3 py-2 text-black text-sm w-28 rounded border-0 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Số TK:</span>
            <input 
              type="text" 
              value={declarationNumber}
              onChange={(e) => setDeclarationNumber(e.target.value)}
              className="px-3 py-2 text-black text-sm w-36 rounded border-0 focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Số tờ khai"
            />
          </div>
          
          <select 
            value={declarationType}
            onChange={(e) => setDeclarationType(e.target.value)}
            className="px-3 py-2 text-black text-sm rounded border-0 focus:outline-none focus:ring-2 focus:ring-blue-300 min-w-40"
          >
            <option>-- Loại khai --</option>
            <option>Tờ khai nợ phí</option>
            <option>Chưa khai báo phí</option>
            <option>Đã khai báo phí nhưng chưa nộp</option>
            <option>Đã nộp phí nhưng khai sai hoặc thiếu</option>
            <option>Đang bị cưỡng chế</option>
          </select>
          
          <select 
            value={feePaymentType}
            onChange={(e) => setFeePaymentType(e.target.value)}
            className="px-3 py-2 text-black text-sm rounded border-0 focus:outline-none focus:ring-2 focus:ring-blue-300 min-w-40"
          >
            <option>-- TT nộp phí --</option>
            <option>Tờ khai nợ phí</option>
            <option>Chưa khai báo phí</option>
            <option>Đã khai báo phí nhưng chưa nộp</option>
            <option>Đã nộp phí nhưng khai sai hoặc thiếu</option>
            <option>Đang bị cưỡng chế</option>
          </select>
          
          <button 
            onClick={handleSearch}
            className="bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded text-sm font-medium flex items-center space-x-2"
          >
            <span>🔍</span>
            <span>Xem dữ liệu</span>
          </button>
          
          <div className="flex items-center ml-auto">
            <span className="text-sm">...</span>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="p-4">
        {/* Tab Navigation */}
        <div className="mb-0">
          <div className="flex border-b-0">
            <button
              onClick={() => setActiveTab('debt-list')}
              className={`px-4 py-2 text-sm border border-gray-300 border-b-0 ${
                activeTab === 'debt-list'
                  ? 'bg-blue-50 border-blue-300 text-blue-700 font-medium'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              📋 Danh sách tờ khai nợ phí
            </button>
            <button
              onClick={() => setActiveTab('debt-summary')}
              className={`px-4 py-2 text-sm border border-gray-300 border-b-0 border-l-0 ${
                activeTab === 'debt-summary'
                  ? 'bg-blue-50 border-blue-300 text-blue-700 font-medium'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              📊 Tổng hợp nợ phí của doanh nghiệp
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="border border-gray-300 bg-white" style={{ height: '500px', overflow: 'auto' }}>
          {activeTab === 'debt-list' ? (
            // Debt List Table
            <table className="w-full text-xs border-collapse" style={{ minWidth: '2400px' }}>
              <thead className="bg-blue-100 sticky top-0 z-10">
                <tr>
                  <th className="border border-gray-300 px-3 py-2 text-center whitespace-nowrap" style={{ minWidth: '50px' }}>STT</th>
                  <th className="border border-gray-300 px-3 py-2 text-center whitespace-nowrap" style={{ minWidth: '300px' }}>DOANH NGHIỆP</th>
                  <th className="border border-gray-300 px-3 py-2 text-center whitespace-nowrap" style={{ minWidth: '100px' }}>SỐ TK</th>
                  <th className="border border-gray-300 px-3 py-2 text-center whitespace-nowrap" style={{ minWidth: '100px' }}>NGÀY ĐĂNG KÝ</th>
                  <th className="border border-gray-300 px-3 py-2 text-center whitespace-nowrap" style={{ minWidth: '120px' }}>LOẠI HÌNH</th>
                  <th className="border border-gray-300 px-3 py-2 text-center whitespace-nowrap" style={{ minWidth: '150px' }}>HẢI QUAN</th>
                  <th className="border border-gray-300 px-3 py-2 text-center whitespace-nowrap" style={{ minWidth: '100px' }}>ĐỊ LƯU KHO</th>
                  <th className="border border-gray-300 px-3 py-2 text-center whitespace-nowrap" style={{ minWidth: '120px' }}>DỊCH BÁO THUẾ</th>
                  <th className="border border-gray-300 px-3 py-2 text-center whitespace-nowrap" style={{ minWidth: '120px' }}>NGÀY GETOUT</th>
                  <th className="border border-gray-300 px-3 py-2 text-center whitespace-nowrap" style={{ minWidth: '80px' }}>TỔNG TL</th>
                  <th className="border border-gray-300 px-3 py-2 text-center whitespace-nowrap" style={{ minWidth: '60px' }}>ĐVT</th>
                  <th className="border border-gray-300 px-3 py-2 text-center whitespace-nowrap" style={{ minWidth: '100px' }}>LOẠI PHÍ</th>
                  <th className="border border-gray-300 px-3 py-2 text-center whitespace-nowrap" style={{ minWidth: '200px' }}>CHI TIẾT HÀNG CONT</th>
                  <th className="border border-gray-300 px-3 py-2 text-center whitespace-nowrap" style={{ minWidth: '100px' }}>SỐ TIỀN</th>
                  <th className="border border-gray-300 px-3 py-2 text-center whitespace-nowrap" style={{ minWidth: '100px' }}>KHAI PHÍ</th>
                  <th className="border border-gray-300 px-3 py-2 text-center whitespace-nowrap" style={{ minWidth: '80px' }}>BIỆN LAI</th>
                  <th className="border border-gray-300 px-3 py-2 text-center whitespace-nowrap" style={{ minWidth: '100px' }}>MÃ PL HH</th>
                  <th className="border border-gray-300 px-3 py-2 text-center whitespace-nowrap" style={{ minWidth: '80px' }}>MIỄN PHÍ</th>
                  <th className="border border-gray-300 px-3 py-2 text-center whitespace-nowrap" style={{ minWidth: '120px' }}>GHI CHÚ</th>
                </tr>
              </thead>
              <tbody>
                {mockDebtListData.length === 0 ? (
                  <tr>
                    <td colSpan={19} className="border border-gray-300 px-2 py-8 text-center">
                      <div className="text-blue-500 text-sm">
                        KHÔNG CÓ DỮ LIỆU<br/>
                        VUI LÒNG KIỂM TRA LẠI ĐIỀU KIỆN LỌC ĐỂ LẤY DỮ LIỆU MÀ BẠN MONG MUỐN.
              </div>
                    </td>
                  </tr>
                ) : (
                  mockDebtListData.map((item, index) => (
                    <tr key={index} className="hover:bg-blue-50">
                      <td className="border border-gray-300 px-3 py-1 text-center whitespace-nowrap" style={{ minWidth: '50px' }}>{item.stt}</td>
                      <td className="border border-gray-300 px-3 py-1 text-left" style={{ minWidth: '300px' }}>{item.enterprise}</td>
                      <td className="border border-gray-300 px-3 py-1 text-center whitespace-nowrap" style={{ minWidth: '100px' }}>{item.declarationNumber}</td>
                      <td className="border border-gray-300 px-3 py-1 text-center whitespace-nowrap" style={{ minWidth: '100px' }}>{item.declarationDate}</td>
                      <td className="border border-gray-300 px-3 py-1 text-center whitespace-nowrap" style={{ minWidth: '120px' }}>{item.declarationType}</td>
                      <td className="border border-gray-300 px-3 py-1 text-center whitespace-nowrap" style={{ minWidth: '150px' }}>{item.customsOffice}</td>
                      <td className="border border-gray-300 px-3 py-1 text-center whitespace-nowrap" style={{ minWidth: '100px' }}>{item.warehouseCode}</td>
                      <td className="border border-gray-300 px-3 py-1 text-center whitespace-nowrap" style={{ minWidth: '120px' }}>{item.feeNotificationDate}</td>
                      <td className="border border-gray-300 px-3 py-1 text-center whitespace-nowrap" style={{ minWidth: '120px' }}>{item.getoutDate}</td>
                      <td className="border border-gray-300 px-3 py-1 text-center whitespace-nowrap" style={{ minWidth: '80px' }}>{item.totalWeight}</td>
                      <td className="border border-gray-300 px-3 py-1 text-center whitespace-nowrap" style={{ minWidth: '60px' }}>{item.unit}</td>
                      <td className="border border-gray-300 px-3 py-1 text-center whitespace-nowrap" style={{ minWidth: '100px' }}>{item.feeType}</td>
                      <td className="border border-gray-300 px-3 py-1 text-left" style={{ minWidth: '200px' }}>{item.containerDetails}</td>
                      <td className="border border-gray-300 px-3 py-1 text-right whitespace-nowrap" style={{ minWidth: '100px' }}>{item.amount}</td>
                      <td className="border border-gray-300 px-3 py-1 text-center whitespace-nowrap" style={{ minWidth: '100px' }}>{item.feeDeclaration}</td>
                      <td className="border border-gray-300 px-3 py-1 text-center whitespace-nowrap" style={{ minWidth: '80px' }}>{item.repeat}</td>
                      <td className="border border-gray-300 px-3 py-1 text-center whitespace-nowrap" style={{ minWidth: '100px' }}>{item.maPLHH}</td>
                      <td className="border border-gray-300 px-3 py-1 text-center whitespace-nowrap" style={{ minWidth: '80px' }}>{item.exemption}</td>
                      <td className="border border-gray-300 px-3 py-1 text-left" style={{ minWidth: '120px' }}>{item.note}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            // Debt Summary Table
            <table className="w-full text-xs border-collapse" style={{ minWidth: '1800px' }}>
              <thead className="bg-blue-100 sticky top-0 z-10">
                <tr>
                  <th className="border border-gray-300 px-3 py-2 text-center whitespace-nowrap" style={{ minWidth: '50px' }}>STT</th>
                  <th className="border border-gray-300 px-3 py-2 text-center whitespace-nowrap" style={{ minWidth: '100px' }}>MÃ DN</th>
                  <th className="border border-gray-300 px-3 py-2 text-center whitespace-nowrap" style={{ minWidth: '300px' }}>TÊN DN</th>
                  <th className="border border-gray-300 px-3 py-2 text-center whitespace-nowrap" style={{ minWidth: '120px' }}>LOẠI HÀNG</th>
                  <th className="border border-gray-300 px-3 py-2 text-center whitespace-nowrap" style={{ minWidth: '120px' }}>TỔNG TỜ KHAI</th>
                  <th className="border border-gray-300 px-3 py-2 text-center whitespace-nowrap" style={{ minWidth: '150px' }}>TỔNG TRỌNG LƯỢNG</th>
                  <th className="border border-gray-300 px-3 py-2 text-center whitespace-nowrap" style={{ minWidth: '150px' }}>TỔNG TIỀN</th>
                  <th className="border border-gray-300 px-3 py-2 text-center whitespace-nowrap" style={{ minWidth: '150px' }}>NGÀY GETOUT GẦN NHẤT</th>
                  <th className="border border-gray-300 px-3 py-2 text-center whitespace-nowrap" style={{ minWidth: '120px' }}>MÃ HỒ GETOUT</th>
                  <th className="border border-gray-300 px-3 py-2 text-center whitespace-nowrap" style={{ minWidth: '120px' }}>CƯỠNG CHẾ</th>
                </tr>
              </thead>
              <tbody>
                {mockDebtSummaryData.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="border border-gray-300 px-2 py-8 text-center">
                      <div className="text-blue-500 text-sm">
                        KHÔNG CÓ DỮ LIỆU<br/>
                        VUI LÒNG KIỂM TRA LẠI ĐIỀU KIỆN LỌC ĐỂ LẤY DỮ LIỆU MÀ BẠN MONG MUỐN.
                      </div>
                    </td>
                  </tr>
                ) : (
                  mockDebtSummaryData.map((item, index) => (
                    <tr key={index} className="hover:bg-blue-50">
                      <td className="border border-gray-300 px-3 py-1 text-center whitespace-nowrap">{item.stt}</td>
                      <td className="border border-gray-300 px-3 py-1 text-center whitespace-nowrap font-medium text-blue-600">{item.enterpriseCode}</td>
                      <td className="border border-gray-300 px-3 py-1 text-left">{item.enterprise}</td>
                      <td className="border border-gray-300 px-3 py-1 text-center whitespace-nowrap">{item.cargoType}</td>
                      <td className="border border-gray-300 px-3 py-1 text-center whitespace-nowrap font-medium">{item.totalDeclarations}</td>
                      <td className="border border-gray-300 px-3 py-1 text-right whitespace-nowrap">{item.totalWeight} tấn</td>
                      <td className="border border-gray-300 px-3 py-1 text-right whitespace-nowrap font-medium text-red-600">{item.totalAmount} VNĐ</td>
                      <td className="border border-gray-300 px-3 py-1 text-center whitespace-nowrap">{item.lastGetoutDate}</td>
                      <td className="border border-gray-300 px-3 py-1 text-center whitespace-nowrap font-medium text-green-600">{item.getoutCode}</td>
                      <td className="border border-gray-300 px-3 py-1 text-center whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          item.enforcement === 'Đã cưỡng chế' 
                            ? 'bg-red-100 text-red-800' 
                            : item.enforcement === 'Đang xử lý'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {item.enforcement}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
                </tbody>
              </table>
          )}
            </div>

        {/* Status bar */}
        <div className="bg-gray-100 border border-gray-300 border-t-0 px-2 py-1 text-xs">
          Có {currentData.length} bản ghi
        </div>
      </div>
    </div>
  )
}

export default DebtStatusPage
