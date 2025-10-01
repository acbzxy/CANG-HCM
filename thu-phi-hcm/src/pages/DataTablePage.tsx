import React, { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
import { useNotification } from '../context/NotificationContext'

// Backend API response interface
interface BienLaiApiResponse {
  id: number
  mst: string
  tenDvi: string
  diaChi: string
  email: string
  sdt: string
  maBl: string
  soBl: string
  hthucTtoan: string
  ngayBl: string
  loaiCtiet: string
  ghiChu: string
  stb: string
  ngayNop: string
  soTk: string
  ngayTk: string
  maKho: string
  ngayTao: string
  nguoiTao: string
  ngaySua: string
  nguoiSua: string | null
  idPhatHanh: string
  imageBl: string
  chiTietList: {
    id: number
    blId: number
    ndungTp: string
    dvt: string
    soLuong: number
    donGia: number
    soTien: number
  }[]
}

// Frontend display interface (keep existing for compatibility)
interface BienLai {
  id: number
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
  tongTien: number
  maTraCuu: string
  soToKhai: string
  ngayToKhai: string
  loaiHinh: string
  trangThai?: string
  createdAt?: string
  updatedAt?: string
}

interface ApiResponse<T> {
  status: number
  timestamp: string
  message: string
  data: T
}

interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
}

// Helper function to safely format date
const formatDate = (dateString: string): string => {
  try {
    // Handle null/undefined/empty values
    if (!dateString || dateString === 'null' || dateString === 'undefined' || dateString.trim() === '') {
      return ''; // Trả về chuỗi rỗng để hiển thị trống
    }
    
    console.log('Formatting date:', dateString);
    
    // Simple regex to extract date parts from various formats
    const dateRegex = /(\d{4})-(\d{2})-(\d{2})/;
    const match = dateString.match(dateRegex);
    
    if (match) {
      const year = parseInt(match[1]);
      const month = parseInt(match[2]) - 1; // JavaScript months are 0-based
      const day = parseInt(match[3]);
      
      // Validate date parts
      if (year >= 1900 && year <= 2100 && month >= 0 && month <= 11 && day >= 1 && day <= 31) {
        const date = new Date(year, month, day);
        
        // Double-check the date is valid
        if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
          const formattedDate = `${day.toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}/${year}`;
          console.log('Successfully formatted date:', dateString, '→', formattedDate);
          return formattedDate;
        }
      }
    }
    
    console.warn('Could not parse date:', dateString);
    return '';
  } catch (error) {
    console.warn('Error formatting date:', dateString, error);
    return '';
  }
};

// Helper function to map API response to display format
const mapApiResponseToDisplay = (apiData: BienLaiApiResponse[], startIndex = 0): BienLai[] => {
  return apiData.map((item, index) => {
    console.log(`Mapping item ${index}:`, {
      id: item.id,
      ngayNop: item.ngayNop,
      ngayTao: item.ngayTao,
      ngayBl: item.ngayBl,
      ngayTk: item.ngayTk
    });
    
    // Calculate total amount from chiTietList
    const totalAmount = item.chiTietList.reduce((sum, chiTiet) => sum + chiTiet.soTien, 0);
    
    return {
      id: item.id,
      stt: startIndex + index + 1,
      yeuCau: "", // Để trống nếu chưa có thông tin
      ngayYeuCau: formatDate(item.ngayNop),
      ngayXuLy: formatDate(item.ngayTao),
      ttLienQuan: item.stb || "", // Để trống nếu chưa có thông tin
      loaiBienLai: "Biên lai phí", // Default value
      noiDung: item.chiTietList.map(ct => ct.ndungTp).join(', '),
      mauKyHieu: item.maBl,
      soBienLai: item.soBl,
      ngayBienLai: formatDate(item.ngayBl),
      tongTien: totalAmount,
      maTraCuu: item.maBl,
      soToKhai: item.soTk,
      ngayToKhai: formatDate(item.ngayTk),
      loaiHinh: "Xuất nhập khẩu", // Default value
      trangThai: "Đã xử lý", // Default value
      createdAt: item.ngayTao,
      updatedAt: item.ngaySua
    };
  });
};

const DataTablePage: React.FC = () => {
  // const navigate = useNavigate()
  const { showError, showSuccess } = useNotification()
  
  // States
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<BienLai[]>([])
  const [filteredData, setFilteredData] = useState<BienLai[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [pageSize] = useState(10)
  
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    soToKhai: '',
    soThongBao: '',
    maTraCuu: '',
    loaiBienLai: '',
    trangThai: ''
  })

  // Viewer modal states
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [loadingReceipt, setLoadingReceipt] = useState(false)
  const [receiptData, setReceiptData] = useState<any | null>(null)

  // Load data from API
  const loadData = async (page = 0, size = 10) => {
    try {
      setLoading(true)
      console.log('🔍 Loading bien lai data from API...')
      
      const response = await fetch(`/api/bien-lai/all?page=${page}&size=${size}&sortBy=ngayTao&sortDir=desc`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result: ApiResponse<PageResponse<BienLaiApiResponse>> = await response.json()
      console.log('🔍 API Response:', result)
      
      if (result.status === 200 && result.data) {
        const apiData = result.data.content || []
        console.log('🔍 Raw API data:', apiData)
        
        // Map API response to display format
        const mappedData = mapApiResponseToDisplay(apiData, page * size)
        console.log('🔍 Mapped data:', mappedData)
        
        setData(mappedData)
        setFilteredData(mappedData)
        setTotalElements(result.data.totalElements)
        setTotalPages(result.data.totalPages)
        setCurrentPage(result.data.number)
        console.log('✅ Data loaded successfully:', mappedData.length, 'records')
        showSuccess(`Đã tải ${mappedData.length} biên lai`)
      } else {
        console.log('❌ No data received')
        setData([])
        setFilteredData([])
        setTotalElements(0)
        setTotalPages(0)
      }
    } catch (error) {
      console.error('❌ Error loading data:', error)
      showError('Có lỗi xảy ra khi tải dữ liệu biên lai: ' + (error as Error).message)
      
      // Fallback to mock data
      console.log('🔄 Using mock data as fallback...')
      const mockData: BienLai[] = [
        {
          id: 1,
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
          tongTien: 1000000,
          maTraCuu: "TRA001",
          soToKhai: "TK123",
          ngayToKhai: "2025-08-01",
          loaiHinh: "Xuất khẩu",
          trangThai: "Đã xử lý"
        },
        {
          id: 2,
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
          tongTien: 2500000,
          maTraCuu: "TRA002",
          soToKhai: "TK456",
          ngayToKhai: "2025-08-05",
          loaiHinh: "Nhập khẩu",
          trangThai: "Đang xử lý"
        }
      ]
      setData(mockData)
      setFilteredData(mockData)
      setTotalElements(mockData.length)
      setTotalPages(1)
      showSuccess('Sử dụng dữ liệu demo')
    } finally {
      setLoading(false)
    }
  }

  // Load data on component mount
  useEffect(() => {
    loadData()
  }, [])

  // Handle filter changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Apply filters
  const handleSearch = () => {
    let result = [...data]

    // Date range filter
    if (filters.fromDate && filters.toDate) {
      const from = new Date(filters.fromDate)
      const to = new Date(filters.toDate)
      result = result.filter(row => {
        const ngayBL = new Date(row.ngayBienLai)
        return ngayBL >= from && ngayBL <= to
      })
    }

    // Text filters
    if (filters.soToKhai.trim() !== '') {
      result = result.filter(row =>
        row.soToKhai.toLowerCase().includes(filters.soToKhai.toLowerCase())
      )
    }

    if (filters.soThongBao.trim() !== '') {
      result = result.filter(row =>
        row.soBienLai.toLowerCase().includes(filters.soThongBao.toLowerCase())
      )
    }

    if (filters.maTraCuu.trim() !== '') {
      result = result.filter(row =>
        row.maTraCuu.toLowerCase().includes(filters.maTraCuu.toLowerCase())
      )
    }

    if (filters.loaiBienLai.trim() !== '') {
      result = result.filter(row =>
        row.loaiBienLai.toLowerCase().includes(filters.loaiBienLai.toLowerCase())
      )
    }

    if (filters.trangThai.trim() !== '') {
      result = result.filter(row =>
        row.trangThai?.toLowerCase().includes(filters.trangThai.toLowerCase())
      )
    }

    setFilteredData(result)
    showSuccess(`Tìm thấy ${result.length} biên lai`)
  }

  // Reset filters
  const handleReset = () => {
    setFilters({
      fromDate: '',
      toDate: '',
      soToKhai: '',
      soThongBao: '',
      maTraCuu: '',
      loaiBienLai: '',
      trangThai: ''
    })
    setFilteredData(data)
    showSuccess('Đã reset bộ lọc')
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount)
  }


  // Get status badge color
  const getStatusBadgeColor = (status?: string) => {
    switch (status) {
      case 'Đã xử lý':
        return 'bg-green-100 text-green-800'
      case 'Đang xử lý':
        return 'bg-yellow-100 text-yellow-800'
      case 'Chờ xử lý':
        return 'bg-blue-100 text-blue-800'
      case 'Đã hủy':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Handle view receipt
  const handleViewReceipt = async (row: BienLai) => {
    try {
      setLoadingReceipt(true)
      const code = row.maTraCuu || row.soBienLai
      if (!code) {
        showError('Không có mã tra cứu hoặc số biên lai để xem')
        return
      }
      // Ưu tiên tra cứu theo mã biên lai (maTraCuu = maBl)
      const resp = await fetch(`/api/bien-lai/search-by-mabl?maBl=${encodeURIComponent(code)}`)
      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}`)
      }
      const result = await resp.json()
      if (result?.status === 200 && result?.data) {
        setReceiptData(result.data)
        setShowReceiptModal(true)
      } else {
        showError('Không tìm thấy biên lai tương ứng')
      }
    } catch (e) {
      showError('Lỗi khi tải biên lai: ' + (e as Error).message)
    } finally {
      setLoadingReceipt(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Danh sách biên lai
        </h1>
        <p className="text-gray-600">
          Quản lý và tra cứu thông tin biên lai thu phí
        </p>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Bộ lọc tìm kiếm
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <i className="fas fa-search mr-2"></i>
              Tìm kiếm
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              <i className="fas fa-refresh mr-2"></i>
              Reset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày biên lai từ
            </label>
            <input
              type="date"
              name="fromDate"
              value={filters.fromDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Đến
            </label>
            <input
              type="date"
              name="toDate"
              value={filters.toDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Text Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số tờ khai
            </label>
            <input
              type="text"
              name="soToKhai"
              value={filters.soToKhai}
              onChange={handleChange}
              placeholder="Nhập số tờ khai"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số biên lai
            </label>
            <input
              type="text"
              name="soThongBao"
              value={filters.soThongBao}
              onChange={handleChange}
              placeholder="Nhập số biên lai"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mã tra cứu
            </label>
            <input
              type="text"
              name="maTraCuu"
              value={filters.maTraCuu}
              onChange={handleChange}
              placeholder="Nhập mã tra cứu"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại biên lai
            </label>
            <select
              name="loaiBienLai"
              value={filters.loaiBienLai}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tất cả</option>
              <option value="Thuế">Thuế</option>
              <option value="Lệ phí">Lệ phí</option>
              <option value="Phí dịch vụ">Phí dịch vụ</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái
            </label>
            <select
              name="trangThai"
              value={filters.trangThai}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tất cả</option>
              <option value="Đã xử lý">Đã xử lý</option>
              <option value="Đang xử lý">Đang xử lý</option>
              <option value="Chờ xử lý">Chờ xử lý</option>
              <option value="Đã hủy">Đã hủy</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Danh sách biên lai
            </h3>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Hiển thị <span className="font-semibold text-blue-600">{filteredData.length}</span> trong tổng số <span className="font-semibold text-blue-600">{totalElements}</span> biên lai
              </span>
              <button
                onClick={() => loadData(currentPage, pageSize)}
                disabled={loading}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 transition-colors"
              >
                <i className="fas fa-sync-alt mr-1"></i>
                Làm mới
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-16 px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  #
                </th>
                <th className="w-16 px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  STT
                </th>
                <th className="w-28 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Ngày yêu cầu
                </th>
                <th className="w-28 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Ngày xử lý
                </th>
                <th className="w-32 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  TT liên quan
                </th>
                <th className="w-32 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Loại biên lai
                </th>
                <th className="w-64 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Nội dung
                </th>
                <th className="w-32 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Mẫu/Ký hiệu
                </th>
                <th className="w-32 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Số biên lai
                </th>
                <th className="w-28 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Ngày biên lai
                </th>
                <th className="w-32 px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Tổng tiền
                </th>
                <th className="w-32 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Mã tra cứu
                </th>
                <th className="w-32 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Số tờ khai
                </th>
                <th className="w-28 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Ngày tờ khai
                </th>
                <th className="w-32 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Loại hình
                </th>
                <th className="w-24 px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={17} className="px-4 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <i className="fas fa-spinner fa-spin text-blue-600 text-xl mr-3"></i>
                      <span className="text-gray-600">Đang tải dữ liệu...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={17} className="px-4 py-8 text-center">
                    <div className="text-gray-500">
                      <i className="fas fa-inbox text-4xl mb-4"></i>
                      <p>Không có dữ liệu biên lai</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredData.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-3 text-sm text-gray-900 text-center">
                      <button
                        onClick={() => handleViewReceipt(row)}
                        className="inline-flex items-center justify-center w-8 h-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                        title="Xem biên lai"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-900 text-center">
                      {row.stt}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-900">
                      {row.ngayYeuCau}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-900">
                      {row.ngayXuLy}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-900 truncate">
                      {row.ttLienQuan}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-900 truncate">
                      {row.loaiBienLai}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-900 truncate">
                      {row.noiDung}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-900 truncate">
                      {row.mauKyHieu}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-900 font-medium truncate">
                      {row.soBienLai}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-900">
                      {row.ngayBienLai}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-900 text-right font-semibold">
                      {formatCurrency(row.tongTien)}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-900 truncate">
                      {row.maTraCuu}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-900 truncate">
                      {row.soToKhai}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-900">
                      {row.ngayToKhai}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-900 truncate">
                      {row.loaiHinh}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className={`inline-flex items-center justify-center px-2 py-1 rounded text-xs font-medium w-full whitespace-nowrap ${getStatusBadgeColor(row.trangThai)}`}>
                        {row.trangThai || 'Đã xử lý'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Trang {currentPage + 1} / {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => loadData(currentPage - 1, pageSize)}
                  disabled={currentPage === 0 || loading}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <i className="fas fa-chevron-left mr-1"></i>
                  Trước
                </button>
                <button
                  onClick={() => loadData(currentPage + 1, pageSize)}
                  disabled={currentPage >= totalPages - 1 || loading}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Sau
                  <i className="fas fa-chevron-right ml-1"></i>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Receipt Viewer Modal */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-start justify-start pt-16 pl-[356px] pr-4">
          {/* Popup container */}
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-7xl h-[85vh] overflow-hidden">
            {/* Close Button */}
            <button
              onClick={() => { setShowReceiptModal(false); setReceiptData(null); }}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 text-white text-xl flex items-center justify-center shadow-lg"
              aria-label="Đóng"
              title="Đóng"
            >
              ×
            </button>

            {/* Header */}
            <div className="bg-gray-800 text-white px-4 py-3 flex items-center justify-between">
              <div className="font-semibold">Phát hành biên lai điện tử</div>
            </div>

            {/* Body */}
            <div className="w-full h-[calc(85vh-48px)] bg-gray-100 p-3">
              <div className="w-full h-full bg-white rounded-md overflow-hidden">
                {loadingReceipt ? (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                    <i className="fas fa-spinner fa-spin mr-2"></i> Đang tải biên lai...
                  </div>
                ) : receiptData?.imageBl ? (
                  <iframe
                    src={`data:application/pdf;base64,${receiptData.imageBl}`}
                    title="Receipt PDF"
                    className="w-full h-full border-0"
                  />
                ) : receiptData ? (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                    Không có dữ liệu PDF. Mã: {receiptData?.maBl} - Số: {receiptData?.soBl}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataTablePage