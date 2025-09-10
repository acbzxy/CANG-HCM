import React, { useState } from 'react'


interface BienLai {
  stt: number
  yeuCau: string
  ngayYeuCau: string
  ngayXuLy: string
  ttLienQuan: string
  loaiBienLai: string
  noiDung: string
  mauKyHieu: string
  soBienLai: string
  ngayBienLai: string
  tongTien: string
  maTraCuu: string
  soToKhai: string
  ngayToKhai: string
  loaiHinh: string
}

const rawData: BienLai[] = [
  {
    stt: 1,
    yeuCau: "Hủy",
    ngayYeuCau: "2025-08-01",
    ngayXuLy: "2025-08-02",
    ttLienQuan: "TT01",
    loaiBienLai: "Thuế",
    noiDung: "Nội dung 1",
    mauKyHieu: "AA/22P",
    soBienLai: "0001",
    ngayBienLai: "2025-08-01",
    tongTien: "1,000,000",
    maTraCuu: "TRA001",
    soToKhai: "TK123",
    ngayToKhai: "2025-08-01",
    loaiHinh: "Xuất khẩu",
  },
  {
    stt: 2,
    yeuCau: "Điều chỉnh",
    ngayYeuCau: "2025-08-05",
    ngayXuLy: "2025-08-06",
    ttLienQuan: "TT02",
    loaiBienLai: "Lệ phí",
    noiDung: "Nội dung 2",
    mauKyHieu: "BB/22P",
    soBienLai: "0002",
    ngayBienLai: "2025-08-05",
    tongTien: "2,500,000",
    maTraCuu: "TRA002",
    soToKhai: "TK456",
    ngayToKhai: "2025-08-05",
    loaiHinh: "Nhập khẩu",
  },
]

const DataTablePage: React.FC = () => {
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    soToKhai: "",
    soThongBao: "",
    maTraCuu: "",
  })

  const [filteredData, setFilteredData] = useState<BienLai[]>(rawData)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSearch = () => {
    let result = rawData

    if (filters.fromDate && filters.toDate) {
      const from = new Date(filters.fromDate)
      const to = new Date(filters.toDate)
      result = result.filter((row) => {
        const ngayBL = new Date(row.ngayBienLai)
        return ngayBL >= from && ngayBL <= to
      })
    }

    if (filters.soToKhai.trim() !== "") {
      result = result.filter((row) =>
        row.soToKhai.toLowerCase().includes(filters.soToKhai.toLowerCase())
      )
    }

    if (filters.soThongBao.trim() !== "") {
      result = result.filter((row) =>
        row.soBienLai.toLowerCase().includes(filters.soThongBao.toLowerCase())
      )
    }

    if (filters.maTraCuu.trim() !== "") {
      result = result.filter((row) =>
        row.maTraCuu.toLowerCase().includes(filters.maTraCuu.toLowerCase())
      )
    }

    setFilteredData(result)
  }

  return (
    <div className="max-w-screen overflow-x-hidden p-4">
      {/* Bộ lọc */}
      <div className="flex flex-wrap items-center justify-end gap-2 mb-4 text-sm">
        <label className="font-medium">Ngày biên lai, từ:</label>
        <input
          type="date"
          name="fromDate"
          value={filters.fromDate}
          onChange={handleChange}
          className="border rounded px-2 py-1  focus:bg-white"
        />
        <label className="font-medium">đến:</label>
        <input
          type="date"
          name="toDate"
          value={filters.toDate}
          onChange={handleChange}
          className="border rounded px-2 py-1  focus:bg-white"
        />
        <input
          type="text"
          name="soToKhai"
          value={filters.soToKhai}
          onChange={handleChange}
          placeholder="Số tờ khai"
          className="border rounded px-2 py-1 w-28  focus:bg-white"
        />
        <input
          type="text"
          name="soThongBao"
          value={filters.soThongBao}
          onChange={handleChange}
          placeholder="Số thông báo"
          className="border rounded px-2 py-1 w-32  focus:bg-white"
        />
        <input
          type="text"
          name="maTraCuu"
          value={filters.maTraCuu}
          onChange={handleChange}
          placeholder="Mã tra cứu"
          className="border rounded px-2 py-1 w-28  focus:bg-white"
        />
        <button
          onClick={handleSearch}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded hover:opacity-80"
        >
          Tìm kiếm
        </button>
      </div>

      {/* Bảng */}
      <div className="border rounded-sm w-full overflow-x-auto">
        <table className="border-collapse text-sm min-w-[1200px] w-max">
          <thead>
            <tr className="text-center font-semibold h-12">
              <th rowSpan={2} className="border px-2 py-2 bg-white">
                STT
              </th>
              <th rowSpan={2} className="border px-2 py-2 bg-white">
                #
              </th>
              <th colSpan={4} className="border px-2 py-2 bg-[#ffeeba]">
                THÔNG TIN YÊU CẦU XỬ LÝ
              </th>
              <th colSpan={10} className="border px-2 py-2 bg-[#e2e3e5]">
                THÔNG TIN BIÊN LAI GỐC
              </th>
            </tr>
            <tr className="bg-[#f9f9f9] text-center font-semibold h-10">
              <th className="border px-2 py-1 bg-[#fff3cd]">LOẠI YÊU CẦU</th>
              <th className="border px-2 py-1 bg-[#fff3cd]">NGÀY YÊU CẦU</th>
              <th className="border px-2 py-1 bg-[#fff3cd]">NGÀY XỬ LÝ</th>
              <th className="border px-2 py-1 bg-[#fff3cd]">TT LIÊN QUAN</th>
              <th className="border px-2 py-1">LOẠI BIÊN LAI</th>
              <th className="border px-2 py-1">NỘI DUNG BIÊN LAI</th>
              <th className="border px-2 py-1">MẪU/ KÝ HIỆU</th>
              <th className="border px-2 py-1">SỐ BIÊN LAI</th>
              <th className="border px-2 py-1">NGÀY BIÊN LAI</th>
              <th className="border px-2 py-1">TỔNG TIỀN</th>
              <th className="border px-2 py-1">MÃ TRA CỨU</th>
              <th className="border px-2 py-1">SỐ TỜ KHAI</th>
              <th className="border px-2 py-1">NGÀY TỜ KHAI</th>
              <th className="border px-2 py-1">LOẠI HÌNH</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, i) => (
              <tr key={i} className="text-center">
                <td className="border px-2 py-1">{row.stt}</td>
                <td className="border px-2 py-1">{i + 1}</td>
                <td className="border px-2 py-1">{row.yeuCau}</td>
                <td className="border px-2 py-1">{row.ngayYeuCau}</td>
                <td className="border px-2 py-1">{row.ngayXuLy}</td>
                <td className="border px-2 py-1">{row.ttLienQuan}</td>
                <td className="border px-2 py-1">{row.loaiBienLai}</td>
                <td className="border px-2 py-1">{row.noiDung}</td>
                <td className="border px-2 py-1">{row.mauKyHieu}</td>
                <td className="border px-2 py-1">{row.soBienLai}</td>
                <td className="border px-2 py-1">{row.ngayBienLai}</td>
                <td className="border px-2 py-1">{row.tongTien}</td>
                <td className="border px-2 py-1">{row.maTraCuu}</td>
                <td className="border px-2 py-1">{row.soToKhai}</td>
                <td className="border px-2 py-1">{row.ngayToKhai}</td>
                <td className="border px-2 py-1">{row.loaiHinh}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Hiển thị tổng số biên lai */}
      <div className="mt-2 text-sm">
        Có{" "}
        <span className="text-blue-600 font-bold">{filteredData.length}</span>{" "}
        biên lai
      </div>
    </div>
  )


}

export default DataTablePage 