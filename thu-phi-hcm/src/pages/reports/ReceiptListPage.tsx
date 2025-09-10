import React, { useState, useEffect } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import * as XLSX from 'xlsx'

const ReceiptListPage: React.FC = () => {
  const [dateFrom, setDateFrom] = useState('2025-01-01')
  const [dateTo, setDateTo] = useState('2025-01-31')
  const [filteredData, setFilteredData] = useState<any[]>([])

  // Dữ liệu giả lập với nhiều ngày khác nhau
  const allMockData = [
    { stt: 1, so: '21/08/2021 14:03:59', ngay: '2025-01-01', tenDN: 'Công ty CP Cảng Đình Vũ điều hành Phú Mỹ PTSC', tongCong: 750000, tMuc1: 250000, tMuc2: 300000, tMuc3: 200000, tMuc4: 0 },
    { stt: 2, so: '0000123', ngay: '2025-01-01', tenDN: 'Công ty TNHH An Phú', tongCong: 1600000, tMuc1: 600000, tMuc2: 500000, tMuc3: 300000, tMuc4: 200000 },
    { stt: 3, so: '0000124', ngay: '2025-01-02', tenDN: 'Công ty TNHH An Phú', tongCong: 1560000, tMuc1: 560000, tMuc2: 400000, tMuc3: 350000, tMuc4: 250000 },
    { stt: 4, so: '0000125', ngay: '2025-01-02', tenDN: 'Công ty Phát triển Cảng nghiệp Thái bình', tongCong: 890000, tMuc1: 300000, tMuc2: 290000, tMuc3: 200000, tMuc4: 100000 },
    { stt: 5, so: '0000126', ngay: '2025-01-03', tenDN: 'Công ty TNHH phát triển cảng nghiệp & thải bom', tongCong: 2100000, tMuc1: 800000, tMuc2: 600000, tMuc3: 400000, tMuc4: 300000 },
    { stt: 6, so: '0000127', ngay: '2025-01-03', tenDN: 'Công ty Logistics Sài Gòn', tongCong: 670000, tMuc1: 200000, tMuc2: 170000, tMuc3: 150000, tMuc4: 150000 },
    { stt: 7, so: '0000128', ngay: '2025-01-04', tenDN: 'Công ty CP Vận tải biển Việt Nam', tongCong: 1850000, tMuc1: 700000, tMuc2: 550000, tMuc3: 350000, tMuc4: 250000 },
    { stt: 8, so: '0000129', ngay: '2025-01-04', tenDN: 'Công ty TNHH Cảng Container Quốc tế', tongCong: 3200000, tMuc1: 1200000, tMuc2: 900000, tMuc3: 600000, tMuc4: 500000 },
    { stt: 9, so: '0000130', ngay: '2025-01-05', tenDN: 'Công ty CP Dịch vụ Hàng hóa Ngoại thương', tongCong: 945000, tMuc1: 350000, tMuc2: 295000, tMuc3: 200000, tMuc4: 100000 },
    { stt: 10, so: '0000131', ngay: '2025-01-05', tenDN: 'Công ty TNHH Kho vận Đông Nam Á', tongCong: 1200000, tMuc1: 450000, tMuc2: 350000, tMuc3: 250000, tMuc4: 150000 },
    { stt: 11, so: '0000132', ngay: '2025-01-06', tenDN: 'Công ty CP Cảng Sài Gòn', tongCong: 2800000, tMuc1: 1000000, tMuc2: 800000, tMuc3: 600000, tMuc4: 400000 },
    { stt: 12, so: '0000133', ngay: '2025-01-07', tenDN: 'Công ty TNHH Vận tải Hàng hải Phương Nam', tongCong: 1450000, tMuc1: 500000, tMuc2: 400000, tMuc3: 350000, tMuc4: 200000 },
    { stt: 13, so: '0000134', ngay: '2025-01-08', tenDN: 'Công ty CP Dịch vụ Cảng Hải Phòng', tongCong: 1980000, tMuc1: 700000, tMuc2: 580000, tMuc3: 400000, tMuc4: 300000 },
    { stt: 14, so: '0000135', ngay: '2025-01-08', tenDN: 'Công ty TNHH Logistics Miền Trung', tongCong: 760000, tMuc1: 250000, tMuc2: 210000, tMuc3: 180000, tMuc4: 120000 },
    { stt: 15, so: '0000136', ngay: '2025-01-09', tenDN: 'Công ty CP Cảng Quốc tế Tân Cảng', tongCong: 4200000, tMuc1: 1500000, tMuc2: 1200000, tMuc3: 800000, tMuc4: 700000 },
    { stt: 16, so: '0000137', ngay: '2025-01-10', tenDN: 'Công ty TNHH Vận chuyển Hàng hóa Á Châu', tongCong: 1100000, tMuc1: 400000, tMuc2: 320000, tMuc3: 230000, tMuc4: 150000 },
    { stt: 17, so: '0000138', ngay: '2025-01-11', tenDN: 'Công ty CP Dịch vụ Hàng hải Việt Nam', tongCong: 2650000, tMuc1: 950000, tMuc2: 750000, tMuc3: 550000, tMuc4: 400000 },
    { stt: 18, so: '0000139', ngay: '2025-01-12', tenDN: 'Công ty TNHH Cảng Container Cát Lái', tongCong: 3800000, tMuc1: 1400000, tMuc2: 1100000, tMuc3: 700000, tMuc4: 600000 },
    { stt: 19, so: '0000140', ngay: '2025-01-13', tenDN: 'Công ty CP Vận tải Đường thủy', tongCong: 920000, tMuc1: 320000, tMuc2: 280000, tMuc3: 200000, tMuc4: 120000 },
    { stt: 20, so: '0000141', ngay: '2025-01-14', tenDN: 'Công ty TNHH Logistics Thành phố', tongCong: 1750000, tMuc1: 650000, tMuc2: 500000, tMuc3: 350000, tMuc4: 250000 },
    { stt: 21, so: '0000142', ngay: '2025-01-15', tenDN: 'Công ty CP Cảng Nhà Rồng', tongCong: 2200000, tMuc1: 800000, tMuc2: 650000, tMuc3: 450000, tMuc4: 300000 },
    { stt: 22, so: '0000143', ngay: '2025-01-16', tenDN: 'Công ty TNHH Dịch vụ Cảng biển Miền Nam', tongCong: 1380000, tMuc1: 500000, tMuc2: 380000, tMuc3: 300000, tMuc4: 200000 },
    { stt: 23, so: '0000144', ngay: '2025-01-17', tenDN: 'Công ty CP Vận tải Container Quốc tế', tongCong: 3100000, tMuc1: 1100000, tMuc2: 900000, tMuc3: 600000, tMuc4: 500000 },
    { stt: 24, so: '0000145', ngay: '2025-01-18', tenDN: 'Công ty TNHH Cảng Hiệp Phước', tongCong: 1650000, tMuc1: 600000, tMuc2: 450000, tMuc3: 350000, tMuc4: 250000 },
    { stt: 25, so: '0000146', ngay: '2025-01-20', tenDN: 'Công ty CP Dịch vụ Hàng hóa Tổng hợp', tongCong: 2450000, tMuc1: 900000, tMuc2: 700000, tMuc3: 500000, tMuc4: 350000 },
    { stt: 26, so: '0000147', ngay: '2025-01-22', tenDN: 'Công ty TNHH Logistics Đông Á', tongCong: 890000, tMuc1: 300000, tMuc2: 250000, tMuc3: 200000, tMuc4: 140000 },
    { stt: 27, so: '0000148', ngay: '2025-01-25', tenDN: 'Công ty CP Cảng Bến Nghé', tongCong: 1950000, tMuc1: 700000, tMuc2: 550000, tMuc3: 400000, tMuc4: 300000 },
    { stt: 28, so: '0000149', ngay: '2025-01-28', tenDN: 'Công ty TNHH Vận tải Hàng hải Á Âu', tongCong: 2750000, tMuc1: 1000000, tMuc2: 800000, tMuc3: 550000, tMuc4: 400000 },
    { stt: 29, so: '0000150', ngay: '2025-01-30', tenDN: 'Công ty CP Dịch vụ Cảng Tân Thuận', tongCong: 1820000, tMuc1: 650000, tMuc2: 520000, tMuc3: 380000, tMuc4: 270000 },
    { stt: 30, so: '0000151', ngay: '2025-01-31', tenDN: 'Công ty TNHH Container Quốc tế Sài Gòn', tongCong: 3600000, tMuc1: 1300000, tMuc2: 1000000, tMuc3: 700000, tMuc4: 600000 },
  ]

  // Filter data based on date range
  const filterDataByDate = () => {
    if (!dateFrom || !dateTo) {
      setFilteredData(allMockData)
      return
    }
    
    const filtered = allMockData.filter(item => {
      const itemDate = new Date(item.ngay)
      const fromDate = new Date(dateFrom)
      const toDate = new Date(dateTo)
      
      return itemDate >= fromDate && itemDate <= toDate
    })
    
    // Re-index STT after filtering
    const reIndexed = filtered.map((item, index) => ({
      ...item,
      stt: index + 1
    }))
    
    setFilteredData(reIndexed)
  }

  // Initialize filtered data on component mount
  useEffect(() => {
    filterDataByDate()
  }, [])

  const totalAmount = filteredData.reduce((sum, item) => sum + item.tongCong, 0)
  const totalTMuc1 = filteredData.reduce((sum, item) => sum + item.tMuc1, 0)
  const totalTMuc2 = filteredData.reduce((sum, item) => sum + item.tMuc2, 0)
  const totalTMuc3 = filteredData.reduce((sum, item) => sum + item.tMuc3, 0)
  const totalTMuc4 = filteredData.reduce((sum, item) => sum + item.tMuc4, 0)
  const totalRecords = filteredData.length

  // Export to Excel function
  const exportToExcel = () => {
    try {
      // Create workbook
      const wb = XLSX.utils.book_new()
      
      // Prepare header data
      const currentDate = new Date().toLocaleDateString('vi-VN')
      const fromDateFormatted = new Date(dateFrom).toLocaleDateString('vi-VN')
      const toDateFormatted = new Date(dateTo).toLocaleDateString('vi-VN')
      
      const headerData = [
        ['BẢNG KÊ BIÊN LAI THU PHÍ'],
        [`Từ ngày: ${fromDateFormatted} - Đến ngày: ${toDateFormatted}`],
        [`Ngày xuất báo cáo: ${currentDate}`],
        [`Tổng số bản ghi: ${totalRecords} biên lai`],
        [], // Empty row
        ['STT', 'Số', 'Ngày', 'Tên doanh nghiệp', 'Tổng số', 'T.Mức 1', 'T.Mức 2', 'T.Mức 3', 'T.Mức 4']
      ]

      // Prepare data rows
      const dataRows = filteredData.map(item => [
        item.stt,
        item.so,
        item.ngay,
        item.tenDN,
        item.tongCong,
        item.tMuc1,
        item.tMuc2,
        item.tMuc3,
        item.tMuc4
      ])

      // Prepare total row
      const totalRow = [
        '',
        '',
        '',
        `Tổng cộng biên lai đã thu: ${totalRecords} biên lai - Tổng số tiền đã thu: ${totalAmount.toLocaleString()}`,
        totalAmount,
        totalTMuc1,
        totalTMuc2,
        totalTMuc3,
        totalTMuc4
      ]

      // Combine all data
      const allData = [...headerData, ...dataRows, totalRow]

      // Create worksheet
      const ws = XLSX.utils.aoa_to_sheet(allData)

      // Set column widths
      const colWidths = [
        { wch: 5 },   // STT
        { wch: 20 },  // Số
        { wch: 12 },  // Ngày
        { wch: 60 },  // Tên doanh nghiệp
        { wch: 15 },  // Tổng số
        { wch: 12 },  // T.Mức 1
        { wch: 12 },  // T.Mức 2
        { wch: 12 },  // T.Mức 3
        { wch: 12 }   // T.Mức 4
      ]
      ws['!cols'] = colWidths

      // Merge cells for header
      if (!ws['!merges']) ws['!merges'] = []
      ws['!merges'].push(
        { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } }, // Title
        { s: { r: 1, c: 0 }, e: { r: 1, c: 8 } }, // Date range
        { s: { r: 2, c: 0 }, e: { r: 2, c: 8 } }, // Export date
        { s: { r: 3, c: 0 }, e: { r: 3, c: 8 } }, // Total records
        { s: { r: allData.length - 1, c: 0 }, e: { r: allData.length - 1, c: 3 } } // Total row text
      )

      // Style cells
      const headerRowIndex = 5 // Header row starts at index 5
      const totalRowIndex = allData.length - 1

      // Style title
      const titleCell = 'A1'
      if (ws[titleCell]) {
        ws[titleCell].s = {
          font: { bold: true, size: 16 },
          alignment: { horizontal: "center", vertical: "center" }
        }
      }

      // Style header info rows
      for (let row = 1; row <= 3; row++) {
        const cellAddress = `A${row + 1}`
        if (ws[cellAddress]) {
          ws[cellAddress].s = {
            font: { bold: true },
            alignment: { horizontal: "center" }
          }
        }
      }

      // Style column headers
      for (let col = 0; col < 9; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: headerRowIndex, c: col })
        if (ws[cellAddress]) {
          ws[cellAddress].s = {
            font: { bold: true, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "366092" } },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
              top: { style: "thin", color: { rgb: "000000" } },
              bottom: { style: "thin", color: { rgb: "000000" } },
              left: { style: "thin", color: { rgb: "000000" } },
              right: { style: "thin", color: { rgb: "000000" } }
            }
          }
        }
      }

      // Style data rows
      for (let row = headerRowIndex + 1; row < totalRowIndex; row++) {
        for (let col = 0; col < 9; col++) {
          const cellAddress = XLSX.utils.encode_cell({ r: row, c: col })
          if (ws[cellAddress]) {
            ws[cellAddress].s = {
              alignment: { 
                horizontal: col >= 4 ? "right" : (col === 0 ? "center" : "left"),
                vertical: "center"
              },
              border: {
                top: { style: "thin", color: { rgb: "CCCCCC" } },
                bottom: { style: "thin", color: { rgb: "CCCCCC" } },
                left: { style: "thin", color: { rgb: "CCCCCC" } },
                right: { style: "thin", color: { rgb: "CCCCCC" } }
              }
            }
            
            // Format numbers
            if (col >= 4 && typeof ws[cellAddress].v === 'number') {
              ws[cellAddress].z = '#,##0'
            }
          }
        }
      }

      // Style total row
      for (let col = 0; col < 9; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: totalRowIndex, c: col })
        if (ws[cellAddress]) {
          ws[cellAddress].s = {
            font: { bold: true, color: { rgb: "000000" } },
            fill: { fgColor: { rgb: "FFFF00" } },
            alignment: { 
              horizontal: col >= 4 ? "right" : "left",
              vertical: "center"
            },
            border: {
              top: { style: "medium", color: { rgb: "000000" } },
              bottom: { style: "medium", color: { rgb: "000000" } },
              left: { style: "thin", color: { rgb: "000000" } },
              right: { style: "thin", color: { rgb: "000000" } }
            }
          }
          
          // Format numbers in total row
          if (col >= 4 && typeof ws[cellAddress].v === 'number') {
            ws[cellAddress].z = '#,##0'
          }
        }
      }

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Bảng kê BL thu')

      // Generate filename
      const filename = `BangKe_BienLai_${fromDateFormatted.replace(/\//g, '-')}_${toDateFormatted.replace(/\//g, '-')}_${currentDate.replace(/\//g, '-')}.xlsx`

      // Save file
      XLSX.writeFile(wb, filename)
      
      // Show success message
      alert(`✅ Đã xuất Excel thành công!
      
📄 File: ${filename}
📊 Số bản ghi: ${totalRecords}
💰 Tổng tiền: ${totalAmount.toLocaleString()} VNĐ
📅 Khoảng thời gian: ${fromDateFormatted} - ${toDateFormatted}

File đã được lưu vào thư mục Downloads của bạn.`)
      
    } catch (error) {
      console.error('Lỗi khi xuất Excel:', error)
      alert('❌ Có lỗi xảy ra khi xuất Excel. Vui lòng thử lại!\n\nChi tiết lỗi: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Fixed Header & Table Header Combined */}
      <div className="sticky top-20 z-10 bg-gray-100 shadow-sm">
        {/* Filter Bar */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={exportToExcel}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 border border-green-600 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
              >
                📊 Export excel
              </button>
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <span>Ngày biên lai từ:</span>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                />
                <span>Đến:</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                />
                <Button variant="outline" size="sm" onClick={filterDataByDate}>
                  Tìm kiếm
                </Button>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">{totalRecords} Đơn</span>
            </div>
          </div>
        </div>
        
        {/* Table Header */}
        <div className="border-b border-gray-300">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border-r border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 text-center w-12 bg-gray-100">STT</th>
                  <th className="border-r border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 text-center w-32 bg-gray-100">Số</th>
                  <th className="border-r border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 text-center w-32 bg-gray-100">Ngày</th>
                  <th className="border-r border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 text-center flex-1 bg-gray-100">Tên doanh nghiệp</th>
                  <th className="border-r border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 text-center w-24 bg-gray-100">Tổng số</th>
                  <th className="border-r border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 text-center w-20 bg-gray-100">T.Mức</th>
                  <th className="border-r border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 text-center w-20 bg-gray-100">T.Mức</th>
                  <th className="border-r border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 text-center w-20 bg-gray-100">T.Mức</th>
                  <th className="px-3 py-2 text-xs font-medium text-gray-700 text-center w-20 bg-gray-100">T.Mức</th>
                </tr>
              </thead>
            </table>
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Excel-like Data Table */}
        <div className="flex-1 bg-white border-l border-r border-gray-300">
          <div className="overflow-x-auto h-full">
            <table className="w-full border-collapse">
              <thead className="invisible">
                <tr className="border-b border-gray-300">
                  <th className="border-r border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 text-center w-12">STT</th>
                  <th className="border-r border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 text-center w-32">Số</th>
                  <th className="border-r border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 text-center w-32">Ngày</th>
                  <th className="border-r border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 text-center flex-1">Tên doanh nghiệp</th>
                  <th className="border-r border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 text-center w-24">Tổng số</th>
                  <th className="border-r border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 text-center w-20">T.Mức</th>
                  <th className="border-r border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 text-center w-20">T.Mức</th>
                  <th className="border-r border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 text-center w-20">T.Mức</th>
                  <th className="px-3 py-2 text-xs font-medium text-gray-700 text-center w-20">T.Mức</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={item.stt} className={`border-b border-gray-200 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className="border-r border-gray-300 px-3 py-2 text-xs text-center">{item.stt}</td>
                    <td className="border-r border-gray-300 px-3 py-2 text-xs">{item.so}</td>
                    <td className="border-r border-gray-300 px-3 py-2 text-xs text-center">{item.ngay}</td>
                    <td className="border-r border-gray-300 px-3 py-2 text-xs">{item.tenDN}</td>
                    <td className="border-r border-gray-300 px-3 py-2 text-xs text-right font-medium">
                      {item.tongCong.toLocaleString()}
                    </td>
                    <td className="border-r border-gray-300 px-3 py-2 text-xs text-right">{item.tMuc1.toLocaleString()}</td>
                    <td className="border-r border-gray-300 px-3 py-2 text-xs text-right">{item.tMuc2.toLocaleString()}</td>
                    <td className="border-r border-gray-300 px-3 py-2 text-xs text-right">{item.tMuc3.toLocaleString()}</td>
                    <td className="px-3 py-2 text-xs text-right">{item.tMuc4.toLocaleString()}</td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr className="bg-yellow-100 border-t-2 border-gray-400 font-bold sticky bottom-0">
                  <td className="border-r border-gray-300 px-3 py-2 text-xs text-center bg-yellow-100" colSpan={4}>
                    Tổng cộng biên lai đã thu: {totalRecords} biên lai - Tổng số tiền đã thu: {totalAmount.toLocaleString()}
                  </td>
                  <td className="border-r border-gray-300 px-3 py-2 text-xs text-right font-bold text-red-600 bg-yellow-100">
                    {totalAmount.toLocaleString()}
                  </td>
                  <td className="border-r border-gray-300 px-3 py-2 text-xs text-right font-bold bg-yellow-100">{totalTMuc1.toLocaleString()}</td>
                  <td className="border-r border-gray-300 px-3 py-2 text-xs text-right font-bold bg-yellow-100">{totalTMuc2.toLocaleString()}</td>
                  <td className="border-r border-gray-300 px-3 py-2 text-xs text-right font-bold bg-yellow-100">{totalTMuc3.toLocaleString()}</td>
                  <td className="px-3 py-2 text-xs text-right font-bold bg-yellow-100">{totalTMuc4.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Fixed Pagination */}
        <div className="sticky bottom-0 z-10 bg-gray-100 border-t border-gray-300 px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="text-sm text-gray-600">
            Hiển thị 1-{totalRecords} trong tổng số {totalRecords} bản ghi
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              ‹ Trước
            </Button>
            <span className="px-3 py-1 bg-blue-500 text-white text-sm rounded">1</span>
            <Button variant="outline" size="sm" disabled>
              Sau ›
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReceiptListPage
