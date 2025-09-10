import React, { useState } from 'react'

interface RowData {
  id: number
  dnTrinhKy: string
  loaiYeuCau: string
  trangThai: string
  ngayYeuCau: string
  mauKyHieu: string
  soBienLai: string
  ngayBienLai: string
  soToKhai: string
  soThongBao: string
  tongTien: string
  blLienQuan: string
}

const ReceiptApprovalPage: React.FC = () => {
  const [filters, setFilters] = useState({
    tuNgay: '',
    denNgay: '',
    maDn: '',
    soToKhai: '',
    soThongBao: '',
    soBienLai: '',
  })

  const [data] = useState<RowData[]>([
    {
      id: 1,
      dnTrinhKy: 'Công ty ABC',
      loaiYeuCau: 'Hoàn thuế',
      trangThai: 'Đã xử lý',
      ngayYeuCau: '01/08/2025',
      mauKyHieu: '01BL',
      soBienLai: '12345',
      ngayBienLai: '02/08/2025',
      soToKhai: 'TK001',
      soThongBao: 'TB001',
      tongTien: '5,000,000',
      blLienQuan: 'BL01',
    },
    {
      id: 2,
      dnTrinhKy: 'Doanh nghiệp XYZ',
      loaiYeuCau: 'Nộp phí',
      trangThai: 'Chờ duyệt',
      ngayYeuCau: '05/08/2025',
      mauKyHieu: '02BL',
      soBienLai: '67890',
      ngayBienLai: '06/08/2025',
      soToKhai: 'TK002',
      soThongBao: 'TB002',
      tongTien: '10,000,000',
      blLienQuan: 'BL02',
    },
  ])

  const [filteredData, setFilteredData] = useState<RowData[]>(data)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  const handleSearch = () => {
    const maDn = filters.maDn.trim().toLowerCase()
    const soToKhai = filters.soToKhai.trim().toLowerCase()
    const soThongBao = filters.soThongBao.trim().toLowerCase()
    const soBienLai = filters.soBienLai.trim().toLowerCase()

    const filtered = data.filter((row) => {
      return (
        (maDn === '' || row.dnTrinhKy.toLowerCase().includes(maDn)) &&
        (soToKhai === '' || row.soToKhai.toLowerCase().includes(soToKhai)) &&
        (soThongBao === '' || row.soThongBao.toLowerCase().includes(soThongBao)) &&
        (soBienLai === '' || row.soBienLai.toLowerCase().includes(soBienLai))
      )
    })
    setFilteredData(filtered)
  }

  return (
    <div className="max-w-screen overflow-x-hidden p-4">
      {/* Bộ lọc */}
      <div className="flex flex-wrap items-center justify-end gap-2 mb-4 text-sm">
        <label className="font-medium">Ngày trình ký, từ:</label>
        <input
          type="date"
          name="tuNgay"
          value={filters.tuNgay}
          onChange={handleChange}
          className="border rounded px-2 py-1  focus:bg-white"
        />
        <label className="font-medium">đến:</label>
        <input
          type="date"
          name="denNgay"
          value={filters.denNgay}
          onChange={handleChange}
          className="border rounded px-2 py-1  focus:bg-white"
        />
        <input
          type="text"
          name="maDn"
          placeholder="Mã DN"
          value={filters.maDn}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-28  focus:bg-white"
        />
        <input
          type="text"
          name="soToKhai"
          placeholder="Số tờ khai"
          value={filters.soToKhai}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-28  focus:bg-white"
        />
        <input
          type="text"
          name="soThongBao"
          placeholder="Số thông báo"
          value={filters.soThongBao}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-32  focus:bg-white"
        />
        <input
          type="text"
          name="soBienLai"
          placeholder="Số biên lai"
          value={filters.soBienLai}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-28  focus:bg-white"
        />
        <button
          type="button"
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded hover:opacity-80"
          onClick={handleSearch}
        >
          Tìm kiếm
        </button>
      </div>

      {/* Bảng */}
      <div className="border rounded-sm w-full overflow-x-auto">
        <table className="border-collapse text-sm table-fixed w-full min-w-[1800px]">
          <colgroup>
            <col style={{ width: '280px' }} />
            <col style={{ width: '200px' }} />
            <col style={{ width: '160px' }} />
            <col style={{ width: '160px' }} />
            <col style={{ width: '140px' }} />
            <col style={{ width: '180px' }} />
            <col style={{ width: '160px' }} />
            <col style={{ width: '140px' }} />
            <col style={{ width: '160px' }} />
            <col style={{ width: '140px' }} />
            <col style={{ width: '140px' }} />
          </colgroup>
          <thead>
            <tr className="bg-[#f9f9f9] text-center font-semibold h-10">
              <th className="border px-2 py-1 ">DN TRÌNH KÝ</th>
              <th className="border px-2 py-1 ">LOẠI YÊU CẦU</th>
              <th className="border px-2 py-1 ">TRẠNG THÁI TRÌNH</th>
              <th className="border px-2 py-1">NGÀY YÊU CẦU</th>
              <th className="border px-2 py-1">MẪU/ KÝ HIỆU</th>
              <th className="border px-2 py-1">SỐ BIÊN LAI</th>
              <th className="border px-2 py-1">NGÀY BIÊN LAI</th>
              <th className="border px-2 py-1">SỐ TỜ KHAI</th>
              <th className="border px-2 py-1">SỐ THÔNG BÁO</th>
              <th className="border px-2 py-1">TỔNG TIỀN</th>
              <th className="border px-2 py-1">BL LIÊN QUAN</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((row, index) => (
                <tr key={row.id} className="text-center">
                  <td className="border px-2 py-1">{row.dnTrinhKy}</td>
                  <td className="border px-2 py-1">{row.loaiYeuCau}</td>
                  <td className="border px-2 py-1">{row.trangThai}</td>
                  <td className="border px-2 py-1">{row.ngayYeuCau}</td>
                  <td className="border px-2 py-1">{row.mauKyHieu}</td>
                  <td className="border px-2 py-1 text-blue-600 font-semibold">{row.soBienLai}</td>
                  <td className="border px-2 py-1">{row.ngayBienLai}</td>
                  <td className="border px-2 py-1">{row.soToKhai}</td>
                  <td className="border px-2 py-1">{row.soThongBao}</td>
                  <td className="border px-2 py-1 text-green-600">{row.tongTien}</td>
                  <td className="border px-2 py-1">{row.blLienQuan}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={11} className="text-center text-blue-600 py-3">
                  Không có dữ liệu.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Tổng số bản ghi */}
      <div className="mt-2 text-sm">
        (Có <span className="text-blue-600 font-bold">{filteredData.length}</span> bản ghi)
      </div>
    </div>
  )
}

export default ReceiptApprovalPage 
 