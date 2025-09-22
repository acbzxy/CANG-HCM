import React, { useState } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

const ManageListPage: React.FC = () => {
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  type ReconcileRow = {
    lanDoiSoat: string
    soBanKhai: number
    ngayBanKhai: string // yyyy-mm-dd
    ngayDoiSoat: string // yyyy-mm-dd
    nganHangDoiSoat: string
    khoBacDoiSoat: string
    tongTien: number
  }

  const [allRows] = useState<ReconcileRow[]>([
    {
      lanDoiSoat: 'DS001',
      soBanKhai: 1250,
      ngayBanKhai: '2025-01-10',
      ngayDoiSoat: '2025-01-15',
      nganHangDoiSoat: 'Vietcombank',
      khoBacDoiSoat: 'Kho bạc HCM',
      tongTien: 125000000
    },
    {
      lanDoiSoat: 'DS002',
      soBanKhai: 1380,
      ngayBanKhai: '2024-12-12',
      ngayDoiSoat: '2024-12-15',
      nganHangDoiSoat: 'BIDV',
      khoBacDoiSoat: 'Kho bạc Q1',
      tongTien: 98500000
    },
    {
      lanDoiSoat: 'DS003',
      soBanKhai: 4200,
      ngayBanKhai: '2024-11-01',
      ngayDoiSoat: '2024-12-01',
      nganHangDoiSoat: 'VietinBank',
      khoBacDoiSoat: 'Kho bạc Q7',
      tongTien: 245500000
    }
  ])

  const [results, setResults] = useState<ReconcileRow[]>([])

  const handleSearch = () => {
    if (!fromDate && !toDate) {
      setResults(allRows)
      return
    }
    const from = fromDate ? new Date(fromDate) : null
    const to = toDate ? new Date(toDate) : null
    const filtered = allRows.filter((row) => {
      const d = new Date(row.ngayDoiSoat)
      const afterFrom = from ? d >= from : true
      const beforeTo = to ? d <= to : true
      return afterFrom && beforeTo
    })
    setResults(filtered)
  }

  // Đã bỏ danh sách thẻ hiển thị

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-2xl">
                📋
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Tra Cứu Đối Soát</h1>
                <p className="text-gray-600">Tra cứu và theo dõi các đợt đối soát dữ liệu</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="primary" icon={<span>🏦</span>}>
                Đối soát ngân hàng
              </Button>
              <Button variant="success" icon={<span>💰</span>}>
                Đối soát kho bạc
              </Button>
            </div>
          </div>
        </div>

        {/* Search - only From/To date */}
        <Card className="mb-6 animate-fade-in-up">
          <Card.Body>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Từ ngày"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
              <Input
                label="Đến ngày"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
              <div className="flex items-end">
                <Button variant="primary" fullWidth onClick={handleSearch}>
                  Tìm kiếm
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Result Table */}
        <Card>
          <Card.Header>
            <h2 className="text-lg font-semibold text-gray-800">Kết quả tra cứu ({results.length})</h2>
          </Card.Header>
          <Card.Body className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap">Lần đối soát</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap">#</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap">Số bản khai</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap">Ngày bản khai</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap">Ngày đối soát</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap">Ngân hàng đối soát</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap">Kho bạc đối soát</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap">Tổng tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {results.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                        Không có dữ liệu. Vui lòng chọn khoảng ngày và bấm Tìm kiếm.
                      </td>
                    </tr>
                  ) : (
                    results.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-6 py-3 text-sm text-gray-800">{row.lanDoiSoat}</td>
                        <td className="px-4 py-3 text-sm text-gray-800">{idx + 1}</td>
                        <td className="px-6 py-3 text-sm text-gray-800">{row.soBanKhai.toLocaleString('vi-VN')}</td>
                        <td className="px-6 py-3 text-sm text-gray-800">{new Date(row.ngayBanKhai).toLocaleDateString('vi-VN')}</td>
                        <td className="px-6 py-3 text-sm text-gray-800">{new Date(row.ngayDoiSoat).toLocaleDateString('vi-VN')}</td>
                        <td className="px-6 py-3 text-sm text-gray-800">{row.nganHangDoiSoat}</td>
                        <td className="px-6 py-3 text-sm text-gray-800">{row.khoBacDoiSoat}</td>
                        <td className="px-6 py-3 text-sm text-gray-800">{row.tongTien.toLocaleString('vi-VN')} VNĐ</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card.Body>
        </Card>

        {/* Summary Stats - removed */}
        <div></div>
      </div>
    </div>
  )
}

export default ManageListPage
