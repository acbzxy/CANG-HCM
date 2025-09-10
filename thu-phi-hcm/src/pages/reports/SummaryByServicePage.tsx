import React, { useState, useEffect } from 'react'
import Button from '../../components/ui/Button'
import * as XLSX from 'xlsx'

const SummaryByServicePage: React.FC = () => {
  const [dateFrom, setDateFrom] = useState('2021-08-01')
  const [dateTo, setDateTo] = useState('2021-08-31')
  const [filteredData, setFilteredData] = useState<any[]>([])

  // Dữ liệu giả lập theo hình ảnh Excel
  const allMockData = [
    { 
      stt: 'A', 
      dichVu: 'Hàng tạm nhập, tái xuất, hàng chuyển khẩu, hàng gửi cửa, hàng gửi kho ngoại quan', 
      soLuong: '', 
      donGia: '', 
      soTien: 2278800000,
      ngayTao: '2021-08-01',
      isGroup: true 
    },
    { 
      stt: 'B', 
      dichVu: 'Hàng gửi kho ngoại quan', 
      soLuong: '', 
      donGia: '', 
      soTien: 0,
      ngayTao: '2021-08-01',
      isGroup: true 
    },
    { 
      stt: '1', 
      dichVu: 'Dã thu phí sớm', 
      soLuong: 3, 
      donGia: 0, 
      soTien: 0,
      ngayTao: '2021-08-01' 
    },
    { 
      stt: '2', 
      dichVu: 'Dã thu phí sớm', 
      soLuong: '', 
      donGia: 133550000, 
      soTien: 2005250000,
      ngayTao: '2021-08-02' 
    },
    { 
      stt: '3', 
      dichVu: 'Dã thu phí sớm', 
      soLuong: '', 
      donGia: 800000, 
      soTien: 42400000,
      ngayTao: '2021-08-03' 
    },
    { 
      stt: '4', 
      dichVu: 'Hàng ủy thác bốc dỡ không dùng trong Container', 
      soLuong: '', 
      donGia: 4000000, 
      soTien: 200000000,
      ngayTao: '2021-08-04' 
    },
    { 
      stt: '5', 
      dichVu: 'Dã thu phí sớm', 
      soLuong: 27, 
      donGia: 250000, 
      soTien: 6750000,
      ngayTao: '2021-08-05' 
    },
    { 
      stt: '6', 
      dichVu: 'Dã thu phí sớm', 
      soLuong: 20, 
      donGia: 500000, 
      soTien: 10000000,
      ngayTao: '2021-08-06' 
    },
    { 
      stt: '7', 
      dichVu: 'Dã thu phí sớm', 
      soLuong: 1, 
      donGia: 1000000, 
      soTien: 1000000,
      ngayTao: '2021-08-07' 
    },
    { 
      stt: '8', 
      dichVu: 'Dã thu phí sớm', 
      soLuong: 2, 
      donGia: 2200000, 
      soTien: 4400000,
      ngayTao: '2021-08-08' 
    },
    { 
      stt: '9', 
      dichVu: 'Container 20 feet', 
      soLuong: 1, 
      donGia: 2200000, 
      soTien: 2200000,
      ngayTao: '2021-08-09' 
    },
    { 
      stt: '10', 
      dichVu: 'Container 40 feet', 
      soLuong: 2, 
      donGia: 4400000, 
      soTien: 8800000,
      ngayTao: '2021-08-10' 
    },
    { 
      stt: 'C', 
      dichVu: 'Gửi về hàng hóa thập khẩu, hàng hóa xuất khẩu mở tỏ khai ngoại TP.HCM', 
      soLuong: '', 
      donGia: '', 
      soTien: 30523225760,
      ngayTao: '2021-08-15',
      isGroup: true 
    },
    { 
      stt: '1', 
      dichVu: 'Hàng ủy thác bốc dỡ không dùng trong Container', 
      soLuong: '', 
      donGia: 1099874757, 
      soTien: 30296225760,
      ngayTao: '2021-08-16' 
    },
    { 
      stt: '2', 
      dichVu: 'Container 20 feet', 
      soLuong: 42, 
      donGia: 5400000, 
      soTien: 227000000,
      ngayTao: '2021-08-17' 
    }
  ]

  // Filter data based on date range
  const filterDataByDate = () => {
    if (!dateFrom || !dateTo) {
      setFilteredData(allMockData)
      return
    }
    
    const filtered = allMockData.filter(item => {
      const itemDate = new Date(item.ngayTao)
      const fromDate = new Date(dateFrom)
      const toDate = new Date(dateTo)
      
      return itemDate >= fromDate && itemDate <= toDate
    })
    
    setFilteredData(filtered)
  }

  // Initialize filtered data on component mount
  useEffect(() => {
    filterDataByDate()
  }, [])

  // Calculate totals
  const totalAmount = filteredData.reduce((sum, item) => sum + item.soTien, 0)
  const totalRecords = filteredData.length

  // Export to Excel function
  const exportToExcel = () => {
    try {
      const wb = XLSX.utils.book_new()
      
      const currentDate = new Date().toLocaleDateString('vi-VN')
      const fromDateFormatted = new Date(dateFrom).toLocaleDateString('vi-VN')
      const toDateFormatted = new Date(dateTo).toLocaleDateString('vi-VN')
      
      const headerData = [
        ['TỔNG HỢP THU DỊCH VỤ'],
        [`Từ ngày: ${fromDateFormatted} - Đến ngày: ${toDateFormatted}`],
        [`Ngày xuất báo cáo: ${currentDate}`],
        [`Tổng số dịch vụ: ${totalRecords}`],
        [],
        ['STT', 'Dịch vụ', 'Số lượng', 'Đơn giá', 'Số tiền']
      ]

      const dataRows = filteredData.map(item => [
        item.stt,
        item.dichVu,
        item.soLuong || '',
        item.donGia ? item.donGia.toLocaleString() : '',
        item.soTien.toLocaleString()
      ])

      const totalRow = [
        'TỔNG CỘNG',
        '',
        '',
        '',
        totalAmount.toLocaleString()
      ]

      const allData = [...headerData, ...dataRows, totalRow]
      const ws = XLSX.utils.aoa_to_sheet(allData)

      // Set column widths
      const colWidths = [
        { wch: 5 },   // STT
        { wch: 80 },  // Dịch vụ
        { wch: 15 },  // Số lượng
        { wch: 20 },  // Đơn giá
        { wch: 20 }   // Số tiền
      ]
      ws['!cols'] = colWidths

      XLSX.utils.book_append_sheet(wb, ws, 'Tổng hợp thu dịch vụ')
      
      const filename = `TongHop_ThuDichVu_${fromDateFormatted.replace(/\//g, '-')}_${toDateFormatted.replace(/\//g, '-')}.xlsx`
      XLSX.writeFile(wb, filename)
      
      alert(`✅ Đã xuất Excel thành công!\n📄 File: ${filename}\n📊 Số dịch vụ: ${totalRecords}\n💰 Tổng tiền: ${totalAmount.toLocaleString()} VNĐ`)
      
    } catch (error) {
      console.error('Lỗi khi xuất Excel:', error)
      alert('❌ Có lỗi xảy ra khi xuất Excel. Vui lòng thử lại!')
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
                  <th className="border-r border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 text-center flex-1 bg-gray-100">Dịch vụ</th>
                  <th className="border-r border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 text-center w-20 bg-gray-100">Số lượng</th>
                  <th className="border-r border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 text-center w-24 bg-gray-100">Đơn giá</th>
                  <th className="px-3 py-2 text-xs font-medium text-gray-700 text-center w-24 bg-gray-100">Số tiền</th>
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
                  <th className="border-r border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 text-center flex-1">Dịch vụ</th>
                  <th className="border-r border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 text-center w-20">Số lượng</th>
                  <th className="border-r border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 text-center w-24">Đơn giá</th>
                  <th className="px-3 py-2 text-xs font-medium text-gray-700 text-center w-24">Số tiền</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={`${item.stt}-${index}`} className={`border-b border-gray-200 hover:bg-gray-50 ${
                    item.isGroup 
                      ? 'bg-blue-50 font-semibold' 
                      : index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                  }`}>
                    <td className="border-r border-gray-300 px-3 py-2 text-xs text-center">
                      {item.stt}
                    </td>
                    <td className={`border-r border-gray-300 px-3 py-2 text-xs ${
                      item.isGroup ? 'font-semibold text-blue-800' : ''
                    }`}>
                      {item.dichVu}
                    </td>
                    <td className="border-r border-gray-300 px-3 py-2 text-xs text-center">
                      {item.soLuong}
                    </td>
                    <td className="border-r border-gray-300 px-3 py-2 text-xs text-right">
                      {item.donGia ? item.donGia.toLocaleString() : ''}
                    </td>
                    <td className="px-3 py-2 text-xs text-right font-medium">
                      {item.soTien.toLocaleString()}
                    </td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr className="bg-yellow-100 border-t-2 border-gray-400 font-bold sticky bottom-0">
                  <td className="border-r border-gray-300 px-3 py-2 text-xs text-center bg-yellow-100" colSpan={4}>
                    <span className="font-bold">TỔNG CỘNG: {totalRecords} dịch vụ</span>
                  </td>
                  <td className="px-3 py-2 text-xs text-right font-bold text-red-600 bg-yellow-100">
                    {totalAmount.toLocaleString()}
                  </td>
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

export default SummaryByServicePage