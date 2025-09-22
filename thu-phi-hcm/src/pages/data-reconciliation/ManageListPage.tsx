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
    note?: string
  }

  const [allRows] = useState<ReconcileRow[]>([
    {
      lanDoiSoat: 'DS001',
      soBanKhai: 1250,
      ngayBanKhai: '2025-01-10',
      ngayDoiSoat: '2025-01-15',
      nganHangDoiSoat: 'Vietcombank',
      khoBacDoiSoat: 'Kho bạc HCM',
      tongTien: 125000000,
      note: 'Đợt đối soát đầu năm, số liệu đã được xác nhận bởi Kho bạc HCM.'
    },
    {
      lanDoiSoat: 'DS002',
      soBanKhai: 1380,
      ngayBanKhai: '2024-12-12',
      ngayDoiSoat: '2024-12-15',
      nganHangDoiSoat: 'BIDV',
      khoBacDoiSoat: 'Kho bạc Q1',
      tongTien: 98500000,
      note: 'Có 2 bản ghi chờ đối soát bổ sung ở ngân hàng.'
    },
    {
      lanDoiSoat: 'DS003',
      soBanKhai: 4200,
      ngayBanKhai: '2024-11-01',
      ngayDoiSoat: '2024-12-01',
      nganHangDoiSoat: 'VietinBank',
      khoBacDoiSoat: 'Kho bạc Q7',
      tongTien: 245500000,
      note: 'Đã đối chiếu 100% chứng từ. Không có lệch.'
    }
  ])

  const [results, setResults] = useState<ReconcileRow[]>([])
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [currentNote, setCurrentNote] = useState<string>('')

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
                        <td className="px-4 py-3 text-sm text-gray-800">
                          <button
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:border-blue-300 transition-colors"
                            title="Xem ghi chú"
                            onClick={() => {
                              setCurrentNote(row.note || 'Không có ghi chú')
                              setShowNoteModal(true)
                            }}
                          >
                            <span>📝</span>
                            <span className="hidden sm:inline">View</span>
                          </button>
                        </td>
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

        {showNoteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Ghi chú đối soát</h3>
                <button
                  className="px-3 py-1.5 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowNoteModal(false)}
                >
                  Đóng
                </button>
              </div>
              <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                {currentNote}
              </div>
            </div>
          </div>
        )}

        {/* Summary Stats - removed */}
        <div></div>
      </div>
    </div>
  )
}

export default ManageListPage
