import React, { useState, useEffect } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import * as XLSX from 'xlsx'

const SummaryByEnterprisePage: React.FC = () => {
  const [dateFrom, setDateFrom] = useState('2021-08-14')
  const [dateTo, setDateTo] = useState('2021-08-31')
  const [filteredData, setFilteredData] = useState<any[]>([])

  // Dữ liệu giả lập với ngày tháng để có thể filter
  const allMockData = [
    {
      stt: 1,
      maDN: 'C100244075',
      tenDN: 'Công ty TNHH phụ tùng ô tô Việt',
      ngayTao: '2021-08-14',
      tongSoTK: 12,
      iCmt20: 0,
      iCmt40: 0,
      iHangRoi: 0,
      iiCmt20: 0,
      iiCmt40: 0,
      iiHangRoi: 0,
      iiiCmt20: 6,
      iiiCmt40: 10,
      thanhTien: 17300000
    },
    {
      stt: 2,
      maDN: 'C101290862',
      tenDN: 'CÔNG TY PHÁT TRIỂN CẢNG NGHỆP THÁI BÌNH SƠN',
      ngayTao: '2021-08-15',
      tongSoTK: 1,
      iCmt20: 0,
      iCmt40: 0,
      iHangRoi: 2,
      iiCmt20: 0,
      iiCmt40: 0,
      iiHangRoi: 0,
      iiiCmt20: 0,
      iiiCmt40: 0,
      thanhTien: 1600000
    },
    {
      stt: 3,
      maDN: 'C100821415',
      tenDN: 'Công ty TNHH Cảng Nghệ Phúc Minh',
      ngayTao: '2021-08-16',
      tongSoTK: 2,
      iCmt20: 0,
      iCmt40: 0,
      iHangRoi: 0,
      iiCmt20: 0,
      iiCmt40: 0,
      iiHangRoi: 2,
      iiiCmt20: 0,
      iiiCmt40: 0,
      thanhTien: 560000
    },
    {
      stt: 4,
      maDN: 'C100842415',
      tenDN: 'Công ty TNHH VinaCargo VNP Việt Nam',
      ngayTao: '2021-08-17',
      tongSoTK: 10,
      iCmt20: 850,
      iCmt40: 0,
      iHangRoi: 0,
      iiCmt20: 3,
      iiCmt40: 4,
      iiHangRoi: 0,
      iiiCmt20: 0,
      iiiCmt40: 850,
      thanhTien: 54000000
    },
    {
      stt: 5,
      maDN: 'C200651688',
      tenDN: 'Công ty Trách Nhiệm Hữu Hạn Thương Mại Ngọc Hiếu',
      ngayTao: '2021-08-18',
      tongSoTK: 1,
      iCmt20: 0,
      iCmt40: 0,
      iHangRoi: 0,
      iiCmt20: 1,
      iiCmt40: 1,
      iiHangRoi: 0,
      iiiCmt20: 0,
      iiiCmt40: 0,
      thanhTien: 750000
    },
    {
      stt: 6,
      maDN: 'C200754426',
      tenDN: 'Công ty CP Cảng Dịch vụ và cầu đất Đình Vũ PTSC',
      ngayTao: '2021-08-20',
      tongSoTK: 5,
      iCmt20: 0,
      iCmt40: 0,
      iHangRoi: 0,
      iiCmt20: 3,
      iiCmt40: 2,
      iiHangRoi: 0,
      iiiCmt20: 2,
      iiiCmt40: 2,
      thanhTien: 5000000
    },
    {
      stt: 7,
      maDN: '6201252117',
      tenDN: 'Công ty TNHH đầu tư phát triển cảng Hải Sơn',
      ngayTao: '2021-08-22',
      tongSoTK: 1,
      iCmt20: 0,
      iCmt40: 0,
      iHangRoi: 0,
      iiCmt20: 1,
      iiCmt40: 0,
      iiHangRoi: 0,
      iiiCmt20: 0,
      iiiCmt40: 0,
      thanhTien: 500000
    },
    {
      stt: 8,
      maDN: '6314438138',
      tenDN: 'Công ty CP cảng An VIỆT NAM',
      ngayTao: '2021-08-25',
      tongSoTK: 1,
      iCmt20: 0,
      iCmt40: 0,
      iHangRoi: 0,
      iiCmt20: 1,
      iiCmt40: 0,
      iiHangRoi: 0,
      iiiCmt20: 2,
      iiiCmt40: 2,
      thanhTien: 2000000
    },
    {
      stt: 9,
      maDN: '2301017748',
      tenDN: 'CÔNG TY CỔ PHẦN XUẤT NHẬP KHẨU VÀ COPPER',
      ngayTao: '2021-08-28',
      tongSoTK: 5,
      iCmt20: 0,
      iCmt40: 0,
      iHangRoi: 0,
      iiCmt20: 0,
      iiCmt40: 0,
      iiHangRoi: 0,
      iiiCmt20: 0,
      iiiCmt40: 0,
      thanhTien: 57000
    },
    {
      stt: 10,
      maDN: '6300805089',
      tenDN: 'Công ty Cổ Phần GAP SG-2 - VinaChem',
      ngayTao: '2021-08-30',
      tongSoTK: 5,
      iCmt20: 0,
      iCmt40: 0,
      iHangRoi: 0,
      iiCmt20: 1,
      iiCmt40: 0,
      iiHangRoi: 0,
      iiiCmt20: 1,
      iiiCmt40: 2,
      thanhTien: 760000
    },
    // Thêm dữ liệu cho tháng 9 để test filter
    {
      stt: 11,
      maDN: 'C300123456',
      tenDN: 'Công ty TNHH Vận tải Container Sài Gòn',
      ngayTao: '2021-09-01',
      tongSoTK: 8,
      iCmt20: 200,
      iCmt40: 150,
      iHangRoi: 0,
      iiCmt20: 2,
      iiCmt40: 3,
      iiHangRoi: 1,
      iiiCmt20: 5,
      iiiCmt40: 8,
      thanhTien: 12500000
    },
    {
      stt: 12,
      maDN: 'C400789012',
      tenDN: 'Công ty CP Logistics Miền Nam',
      ngayTao: '2021-09-05',
      tongSoTK: 6,
      iCmt20: 0,
      iCmt40: 0,
      iHangRoi: 3,
      iiCmt20: 4,
      iiCmt40: 2,
      iiHangRoi: 0,
      iiiCmt20: 1,
      iiiCmt40: 3,
      thanhTien: 8900000
    },
    {
      stt: 13,
      maDN: 'C500345678',
      tenDN: 'Công ty TNHH Cảng Quốc tế Việt Nam',
      ngayTao: '2021-09-10',
      tongSoTK: 15,
      iCmt20: 500,
      iCmt40: 300,
      iHangRoi: 2,
      iiCmt20: 8,
      iiCmt40: 6,
      iiHangRoi: 1,
      iiiCmt20: 12,
      iiiCmt40: 20,
      thanhTien: 35000000
    },
    {
      stt: 14,
      maDN: 'C600901234',
      tenDN: 'Công ty CP Dịch vụ Hàng hải Đông Nam Á',
      ngayTao: '2021-09-15',
      tongSoTK: 3,
      iCmt20: 0,
      iCmt40: 0,
      iHangRoi: 0,
      iiCmt20: 1,
      iiCmt40: 1,
      iiHangRoi: 0,
      iiiCmt20: 2,
      iiiCmt40: 1,
      thanhTien: 4200000
    },
    {
      stt: 15,
      maDN: 'C700567890',
      tenDN: 'Công ty TNHH Kho vận Tân Cảng',
      ngayTao: '2021-09-20',
      tongSoTK: 7,
      iCmt20: 100,
      iCmt40: 80,
      iHangRoi: 1,
      iiCmt20: 3,
      iiCmt40: 2,
      iiHangRoi: 0,
      iiiCmt20: 4,
      iiiCmt40: 6,
      thanhTien: 15600000
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

  // Calculate totals
  const totalTK = filteredData.reduce((sum, item) => sum + item.tongSoTK, 0)
  const totalICmt20 = filteredData.reduce((sum, item) => sum + item.iCmt20, 0)
  const totalICmt40 = filteredData.reduce((sum, item) => sum + item.iCmt40, 0)
  const totalIHangRoi = filteredData.reduce((sum, item) => sum + item.iHangRoi, 0)
  const totalIICmt20 = filteredData.reduce((sum, item) => sum + item.iiCmt20, 0)
  const totalIICmt40 = filteredData.reduce((sum, item) => sum + item.iiCmt40, 0)
  const totalIIHangRoi = filteredData.reduce((sum, item) => sum + item.iiHangRoi, 0)
  const totalIIICmt20 = filteredData.reduce((sum, item) => sum + item.iiiCmt20, 0)
  const totalIIICmt40 = filteredData.reduce((sum, item) => sum + item.iiiCmt40, 0)
  const totalThanhTien = filteredData.reduce((sum, item) => sum + item.thanhTien, 0)
  const totalRecords = filteredData.length

  // Export to Excel function
  const exportToExcel = () => {
    try {
      const wb = XLSX.utils.book_new()
      
      const currentDate = new Date().toLocaleDateString('vi-VN')
      const fromDateFormatted = new Date(dateFrom).toLocaleDateString('vi-VN')
      const toDateFormatted = new Date(dateTo).toLocaleDateString('vi-VN')
      
      const headerData = [
        ['TỔNG HỢP THEO DOANH NGHIỆP'],
        [`Từ ngày: ${fromDateFormatted} - Đến ngày: ${toDateFormatted}`],
        [`Ngày xuất báo cáo: ${currentDate}`],
        [`Tổng số doanh nghiệp: ${totalRecords}`],
        [],
        ['STT', 'Mã DN', 'Tên DN', 'Ngày tạo', 'Tổng số TK', 'I-Cmt 20', 'I-Cmt 40', 'I-Hàng rời', 'II-Cmt 20', 'II-Cmt 40', 'II-Hàng rời', 'III-Cmt 20', 'III-Cmt 40', 'Thành tiền']
      ]

      const dataRows = filteredData.map(item => [
        item.stt,
        item.maDN,
        item.tenDN,
        item.ngayTao,
        item.tongSoTK,
        item.iCmt20 || '',
        item.iCmt40 || '',
        item.iHangRoi || '',
        item.iiCmt20 || '',
        item.iiCmt40 || '',
        item.iiHangRoi || '',
        item.iiiCmt20 || '',
        item.iiiCmt40 || '',
        item.thanhTien
      ])

      const totalRow = [
        'TỔNG',
        '',
        '',
        '',
        totalTK,
        totalICmt20,
        totalICmt40,
        totalIHangRoi,
        totalIICmt20,
        totalIICmt40,
        totalIIHangRoi,
        totalIIICmt20,
        totalIIICmt40,
        totalThanhTien
      ]

      const allData = [...headerData, ...dataRows, totalRow]
      const ws = XLSX.utils.aoa_to_sheet(allData)

      // Set column widths
      ws['!cols'] = [
        { wch: 5 }, { wch: 12 }, { wch: 50 }, { wch: 12 }, { wch: 12 },
        { wch: 10 }, { wch: 10 }, { wch: 12 }, { wch: 10 },
        { wch: 10 }, { wch: 12 }, { wch: 10 }, { wch: 10 }, { wch: 15 }
      ]

      XLSX.utils.book_append_sheet(wb, ws, 'Tổng hợp theo DN')
      const filename = `TongHop_TheoDN_${fromDateFormatted.replace(/\//g, '-')}_${toDateFormatted.replace(/\//g, '-')}.xlsx`
      XLSX.writeFile(wb, filename)
      
      alert(`✅ Đã xuất Excel thành công!\n📄 File: ${filename}\n🏢 Số DN: ${totalRecords}\n💰 Tổng tiền: ${totalThanhTien.toLocaleString()} VNĐ`)
      
    } catch (error) {
      alert('❌ Có lỗi xảy ra khi xuất Excel!')
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
                <button
                  onClick={filterDataByDate}
                  className="inline-flex items-center px-3 py-1 text-sm font-medium text-white bg-gray-600 border border-gray-600 rounded hover:bg-gray-700 transition-colors duration-200"
                >
                  Tìm kiếm
                </button>
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
                  <th className="border-r border-gray-300 px-2 py-2 text-xs font-medium text-gray-700 text-center w-12 bg-gray-100">STT</th>
                  <th className="border-r border-gray-300 px-2 py-2 text-xs font-medium text-gray-700 text-center w-24 bg-gray-100">Mã DN</th>
                  <th className="border-r border-gray-300 px-2 py-2 text-xs font-medium text-gray-700 text-center flex-1 bg-gray-100">Tên DN</th>
                  <th className="border-r border-gray-300 px-2 py-2 text-xs font-medium text-gray-700 text-center w-20 bg-gray-100">Tổng số TK</th>
                  <th className="border-r border-gray-300 px-2 py-2 text-xs font-medium text-gray-700 text-center w-16 bg-gray-100">I-Cmt 20</th>
                  <th className="border-r border-gray-300 px-2 py-2 text-xs font-medium text-gray-700 text-center w-16 bg-gray-100">I-Cmt 40</th>
                  <th className="border-r border-gray-300 px-2 py-2 text-xs font-medium text-gray-700 text-center w-18 bg-gray-100">I-Hàng rời</th>
                  <th className="border-r border-gray-300 px-2 py-2 text-xs font-medium text-gray-700 text-center w-16 bg-gray-100">II-Cmt 20</th>
                  <th className="border-r border-gray-300 px-2 py-2 text-xs font-medium text-gray-700 text-center w-16 bg-gray-100">II-Cmt 40</th>
                  <th className="border-r border-gray-300 px-2 py-2 text-xs font-medium text-gray-700 text-center w-18 bg-gray-100">II-Hàng rời</th>
                  <th className="border-r border-gray-300 px-2 py-2 text-xs font-medium text-gray-700 text-center w-16 bg-gray-100">III-Cmt 20</th>
                  <th className="border-r border-gray-300 px-2 py-2 text-xs font-medium text-gray-700 text-center w-16 bg-gray-100">III-Cmt 40</th>
                  <th className="px-2 py-2 text-xs font-medium text-gray-700 text-center w-24 bg-gray-100">Thành tiền</th>
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
                  <th className="border-r border-gray-300 px-2 py-2 text-xs font-medium text-gray-700 text-center w-12">STT</th>
                  <th className="border-r border-gray-300 px-2 py-2 text-xs font-medium text-gray-700 text-center w-24">Mã DN</th>
                  <th className="border-r border-gray-300 px-2 py-2 text-xs font-medium text-gray-700 text-center flex-1">Tên DN</th>
                  <th className="border-r border-gray-300 px-2 py-2 text-xs font-medium text-gray-700 text-center w-20">Tổng số TK</th>
                  <th className="border-r border-gray-300 px-2 py-2 text-xs font-medium text-gray-700 text-center w-16">I-Cmt 20</th>
                  <th className="border-r border-gray-300 px-2 py-2 text-xs font-medium text-gray-700 text-center w-16">I-Cmt 40</th>
                  <th className="border-r border-gray-300 px-2 py-2 text-xs font-medium text-gray-700 text-center w-18">I-Hàng rời</th>
                  <th className="border-r border-gray-300 px-2 py-2 text-xs font-medium text-gray-700 text-center w-16">II-Cmt 20</th>
                  <th className="border-r border-gray-300 px-2 py-2 text-xs font-medium text-gray-700 text-center w-16">II-Cmt 40</th>
                  <th className="border-r border-gray-300 px-2 py-2 text-xs font-medium text-gray-700 text-center w-18">II-Hàng rời</th>
                  <th className="border-r border-gray-300 px-2 py-2 text-xs font-medium text-gray-700 text-center w-16">III-Cmt 20</th>
                  <th className="border-r border-gray-300 px-2 py-2 text-xs font-medium text-gray-700 text-center w-16">III-Cmt 40</th>
                  <th className="px-2 py-2 text-xs font-medium text-gray-700 text-center w-24">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={item.stt} className={`border-b border-gray-200 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className="border-r border-gray-300 px-2 py-2 text-xs text-center">{item.stt}</td>
                    <td className="border-r border-gray-300 px-2 py-2 text-xs">{item.maDN}</td>
                    <td className="border-r border-gray-300 px-2 py-2 text-xs">{item.tenDN}</td>
                    <td className="border-r border-gray-300 px-2 py-2 text-xs text-center font-medium">{item.tongSoTK}</td>
                    <td className="border-r border-gray-300 px-2 py-2 text-xs text-center">{item.iCmt20 || ''}</td>
                    <td className="border-r border-gray-300 px-2 py-2 text-xs text-center">{item.iCmt40 || ''}</td>
                    <td className="border-r border-gray-300 px-2 py-2 text-xs text-center">{item.iHangRoi || ''}</td>
                    <td className="border-r border-gray-300 px-2 py-2 text-xs text-center">{item.iiCmt20 || ''}</td>
                    <td className="border-r border-gray-300 px-2 py-2 text-xs text-center">{item.iiCmt40 || ''}</td>
                    <td className="border-r border-gray-300 px-2 py-2 text-xs text-center">{item.iiHangRoi || ''}</td>
                    <td className="border-r border-gray-300 px-2 py-2 text-xs text-center">{item.iiiCmt20 || ''}</td>
                    <td className="border-r border-gray-300 px-2 py-2 text-xs text-center">{item.iiiCmt40 || ''}</td>
                    <td className="px-2 py-2 text-xs text-right font-medium">{item.thanhTien.toLocaleString()}</td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr className="bg-yellow-100 border-t-2 border-gray-400 font-bold sticky bottom-0">
                  <td className="border-r border-gray-300 px-2 py-2 text-xs text-center font-bold bg-yellow-100">TỔNG</td>
                  <td className="border-r border-gray-300 px-2 py-2 text-xs bg-yellow-100"></td>
                  <td className="border-r border-gray-300 px-2 py-2 text-xs bg-yellow-100"></td>
                  <td className="border-r border-gray-300 px-2 py-2 text-xs text-center font-bold bg-yellow-100">{totalTK}</td>
                  <td className="border-r border-gray-300 px-2 py-2 text-xs text-center font-bold bg-yellow-100">{totalICmt20 || ''}</td>
                  <td className="border-r border-gray-300 px-2 py-2 text-xs text-center font-bold bg-yellow-100">{totalICmt40 || ''}</td>
                  <td className="border-r border-gray-300 px-2 py-2 text-xs text-center font-bold bg-yellow-100">{totalIHangRoi || ''}</td>
                  <td className="border-r border-gray-300 px-2 py-2 text-xs text-center font-bold bg-yellow-100">{totalIICmt20 || ''}</td>
                  <td className="border-r border-gray-300 px-2 py-2 text-xs text-center font-bold bg-yellow-100">{totalIICmt40 || ''}</td>
                  <td className="border-r border-gray-300 px-2 py-2 text-xs text-center font-bold bg-yellow-100">{totalIIHangRoi || ''}</td>
                  <td className="border-r border-gray-300 px-2 py-2 text-xs text-center font-bold bg-yellow-100">{totalIIICmt20 || ''}</td>
                  <td className="border-r border-gray-300 px-2 py-2 text-xs text-center font-bold bg-yellow-100">{totalIIICmt40 || ''}</td>
                  <td className="px-2 py-2 text-xs text-right font-bold text-red-600 bg-yellow-100">{totalThanhTien.toLocaleString()}</td>
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
            <button className="px-3 py-1 text-sm border border-gray-300 rounded bg-white hover:bg-gray-50" disabled>
              ‹ Trước
            </button>
            <span className="px-3 py-1 bg-blue-500 text-white text-sm rounded">1</span>
            <button className="px-3 py-1 text-sm border border-gray-300 rounded bg-white hover:bg-gray-50" disabled>
              Sau ›
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SummaryByEnterprisePage
