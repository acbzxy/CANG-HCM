import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'

const PaymentManagementPage: React.FC = () => {
  const location = useLocation()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // States cho các modals
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [detailData, setDetailData] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // Sample data cho các trang
  const [payments] = useState([
    {
      id: 1,
      paymentId: 'PT001',
      receiptId: 'BL001',
      amount: 1500000,
      method: 'Chuyển khoản',
      status: 'Hoàn thành',
      company: 'Công ty TNHH ABC',
      date: '2024-01-15'
    },
    {
      id: 2,
      paymentId: 'PT002',
      receiptId: 'BL002',
      amount: 2300000,
      method: 'QR Code',
      status: 'Chờ xử lý',
      company: 'Tập đoàn XYZ',
      date: '2024-01-15'
    }
  ])

  const [cancelablePayments] = useState([
    {
      id: 1,
      paymentId: 'PT004',
      receiptId: 'BL004',
      amount: 1200000,
      method: 'Chuyển khoản',
      status: 'Chờ xử lý',
      company: 'Công ty TNHH GHI',
      date: '2024-01-16'
    }
  ])

  const [cancelledPayments] = useState([
    {
      id: 1,
      paymentId: 'PT006',
      receiptId: 'BL006',
      amount: 750000,
      method: 'Chuyển khoản',
      status: 'Đã hủy',
      company: 'Công ty TNHH MNO',
      date: '2024-01-10',
      cancelDate: '2024-01-12',
      cancelReason: 'Lỗi thông tin thanh toán'
    }
  ])

  const [treasuryTransfers] = useState([
    {
      id: 1,
      transferId: 'TF001',
      amount: 50000000,
      transferDate: '2024-01-15',
      status: 'Đã chuyển',
      fromAccount: '123-456-789',
      toAccount: 'KB-001-2024'
    }
  ])

  const [bankReconciliation] = useState([
    {
      id: 1,
      reconciliationId: 'RS001',
      bankName: 'Vietcombank',
      fileDate: '2024-01-15',
      totalTransactions: 150,
      totalAmount: 250000000,
      matchedTransactions: 148,
      unmatchedTransactions: 2,
      status: 'Đã đối soát'
    }
  ])

  // Utility functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    const statusClasses: { [key: string]: string } = {
      'Hoàn thành': 'bg-green-100 text-green-800',
      'Chờ xử lý': 'bg-yellow-100 text-yellow-800',
      'Đang xử lý': 'bg-blue-100 text-blue-800',
      'Đã hủy': 'bg-red-100 text-red-800',
      'Đã chuyển': 'bg-green-100 text-green-800',
      'Chờ duyệt': 'bg-yellow-100 text-yellow-800',
      'Đã đối soát': 'bg-green-100 text-green-800',
      'Đang đối soát': 'bg-yellow-100 text-yellow-800'
    }
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    )
  }

  const showDetail = (data: any) => {
    setDetailData(data)
    setShowDetailModal(true)
  }

  const closeDetailModal = () => {
    setShowDetailModal(false)
    setDetailData(null)
  }

  const getPageTitle = () => {
    switch(location.pathname) {
      case '/payment-management/manage':
        return 'Quản lý thanh toán'
      case '/payment-management/cancel':
        return 'Hủy thanh toán'
      case '/payment-management/restore':
        return 'Khôi phục thanh toán'
      case '/payment-management/notify-transfer':
        return 'Thông báo chuyển tiền về Kho bạc'
      case '/payment-management/manage-transfer':
        return 'Quản lý chuyển tiền về Kho bạc'
      case '/payment-management/bank-reconciliation':
        return 'Đối soát dữ liệu thanh toán từ ngân hàng'
      default:
        return 'Quản lý thanh toán'
    }
  }

  const renderManagePayments = () => (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Có {payments.length} thanh toán
            </div>
            <div className="flex items-center gap-3">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="Hoàn thành">Hoàn thành</option>
                <option value="Chờ xử lý">Chờ xử lý</option>
              </select>
              <input
                type="text"
                placeholder="Mã thanh toán"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm w-40"
              />
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                <i className="fas fa-search mr-2"></i>Tìm kiếm
              </button>
              <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                <i className="fas fa-plus mr-2"></i>Thêm mới
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">STT</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">MÃ THANH TOÁN</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SỐ TIỀN</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">DOANH NGHIỆP</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">TRẠNG THÁI</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">NGÀY</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment, index) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => showDetail(payment)}
                        className="text-blue-500 hover:text-blue-700" 
                        title="Xem chi tiết"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button className="text-red-500 hover:text-red-700" title="Xóa">
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-blue-600">{payment.paymentId}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(payment.amount)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{payment.company}</td>
                  <td className="px-4 py-3 text-sm">{getStatusBadge(payment.status)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{payment.date}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <button className="text-green-500 hover:text-green-700" title="Chỉnh sửa">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="text-yellow-500 hover:text-yellow-700" title="In biên lai">
                        <i className="fas fa-print"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const getPageContent = () => {
    switch(location.pathname) {
      case '/payment-management/manage':
        return renderManagePayments()

      case '/payment-management/cancel':
        return (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b">
                <div className="text-sm text-gray-700">
                  Có {cancelablePayments.length} thanh toán có thể hủy
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">STT</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">MÃ THANH TOÁN</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SỐ TIỀN</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">DOANH NGHIỆP</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">TRẠNG THÁI</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">THAO TÁC</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cancelablePayments.map((payment, index) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                      <td className="px-4 py-3 text-sm font-medium text-blue-600">{payment.paymentId}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(payment.amount)}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{payment.company}</td>
                      <td className="px-4 py-3 text-sm">{getStatusBadge(payment.status)}</td>
                      <td className="px-4 py-3 text-sm">
                        <button 
                          onClick={() => alert(`Hủy thanh toán ${payment.paymentId}`)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                        >
                          Hủy thanh toán
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )

      case '/payment-management/restore':
        return (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b">
                <div className="text-sm text-gray-700">
                  Có {cancelledPayments.length} thanh toán đã hủy
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">STT</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">MÃ THANH TOÁN</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SỐ TIỀN</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">LÝ DO HỦY</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">TRẠNG THÁI</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">THAO TÁC</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cancelledPayments.map((payment, index) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                      <td className="px-4 py-3 text-sm font-medium text-blue-600">{payment.paymentId}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(payment.amount)}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{payment.cancelReason}</td>
                      <td className="px-4 py-3 text-sm">{getStatusBadge(payment.status)}</td>
                      <td className="px-4 py-3 text-sm">
                        <button 
                          onClick={() => alert(`Khôi phục thanh toán ${payment.paymentId}`)}
                          className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
                        >
                          Khôi phục
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )

      case '/payment-management/notify-transfer':
        return (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Tạo thông báo chuyển tiền về Kho bạc</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền chuyển:</label>
                  <input type="number" className="w-full border border-gray-300 rounded px-3 py-2" placeholder="Nhập số tiền" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày chuyển:</label>
                  <input type="date" className="w-full border border-gray-300 rounded px-3 py-2" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú:</label>
                  <textarea className="w-full border border-gray-300 rounded px-3 py-2" rows={3} placeholder="Nhập ghi chú"></textarea>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  <i className="fas fa-paper-plane mr-2"></i>Gửi thông báo
                </button>
              </div>
            </div>
          </div>
        )

      case '/payment-management/manage-transfer':
        return (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Có {treasuryTransfers.length} giao dịch chuyển tiền
                  </div>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    <i className="fas fa-plus mr-2"></i>Tạo yêu cầu chuyển tiền
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">STT</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">MÃ CHUYỂN TIỀN</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SỐ TIỀN</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">TK NGUỒN</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">TK KB</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">NGÀY</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">TRẠNG THÁI</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">THAO TÁC</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {treasuryTransfers.map((transfer, index) => (
                    <tr key={transfer.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => showDetail(transfer)}
                            className="text-blue-500 hover:text-blue-700" 
                            title="Xem chi tiết"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button className="text-red-500 hover:text-red-700" title="Xóa">
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-blue-600">{transfer.transferId}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(transfer.amount)}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{transfer.fromAccount}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{transfer.toAccount}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{transfer.transferDate}</td>
                      <td className="px-4 py-3 text-sm">{getStatusBadge(transfer.status)}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          <button className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600">
                            Duyệt
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )

      case '/payment-management/bank-reconciliation':
        return (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Tải lên file đối soát từ ngân hàng</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <i className="fas fa-upload text-3xl text-gray-400 mb-2"></i>
                <p className="text-gray-600 mb-2">Kéo thả file hoặc click để chọn file</p>
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Chọn file
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Có {bankReconciliation.length} file đối soát
                  </div>
                  <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                    <i className="fas fa-sync mr-2"></i>Đối soát tự động
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">STT</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">MÃ ĐỐI SOÁT</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">NGÂN HÀNG</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">NGÀY FILE</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">TỔNG GD</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">TỔNG TIỀN</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">KHỚP</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">CHƯA KHỚP</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">TRẠNG THÁI</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">THAO TÁC</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bankReconciliation.map((record, index) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                      <td className="px-4 py-3 text-sm font-medium text-blue-600">{record.reconciliationId}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{record.bankName}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{record.fileDate}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{record.totalTransactions}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(record.totalAmount)}</td>
                      <td className="px-4 py-3 text-sm text-green-600">{record.matchedTransactions}</td>
                      <td className="px-4 py-3 text-sm text-red-600">{record.unmatchedTransactions}</td>
                      <td className="px-4 py-3 text-sm">{getStatusBadge(record.status)}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => showDetail(record)}
                            className="text-blue-500 hover:text-blue-700" 
                            title="Xem chi tiết"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button className="text-green-500 hover:text-green-700" title="Xuất báo cáo">
                            <i className="fas fa-download"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )

      default:
        return (
          <div className="text-center py-12">
            <i className="fas fa-credit-card text-6xl text-blue-500 mb-4"></i>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Quản lý thanh toán</h2>
            <p className="text-gray-600 mb-8">Chọn một mục từ menu để bắt đầu</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <i className="fas fa-money-check-alt text-3xl text-blue-500 mb-3"></i>
                <h3 className="text-lg font-semibold mb-2">Quản lý thanh toán</h3>
                <p className="text-gray-600 text-sm">Quản lý tất cả các giao dịch thanh toán</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <i className="fas fa-times-circle text-3xl text-red-500 mb-3"></i>
                <h3 className="text-lg font-semibold mb-2">Hủy thanh toán</h3>
                <p className="text-gray-600 text-sm">Hủy các giao dịch thanh toán chưa hoàn thành</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <i className="fas fa-redo-alt text-3xl text-green-500 mb-3"></i>
                <h3 className="text-lg font-semibold mb-2">Khôi phục thanh toán</h3>
                <p className="text-gray-600 text-sm">Khôi phục lại các thanh toán đã hủy</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <i className="fas fa-bell text-3xl text-yellow-500 mb-3"></i>
                <h3 className="text-lg font-semibold mb-2">TB chuyển tiền về KB</h3>
                <p className="text-gray-600 text-sm">Thông báo chuyển tiền về Kho bạc Nhà nước</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <i className="fas fa-exchange-alt text-3xl text-purple-500 mb-3"></i>
                <h3 className="text-lg font-semibold mb-2">QL chuyển tiền về KB</h3>
                <p className="text-gray-600 text-sm">Quản lý các giao dịch chuyển tiền về Kho bạc</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <i className="fas fa-balance-scale text-3xl text-indigo-500 mb-3"></i>
                <h3 className="text-lg font-semibold mb-2">Đối soát ngân hàng</h3>
                <p className="text-gray-600 text-sm">Đối soát dữ liệu thanh toán từ ngân hàng</p>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <i className="fas fa-credit-card text-blue-500 mr-3"></i>
          {getPageTitle()}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {getPageContent()}
      </div>

      {/* Detail Modal */}
      {showDetailModal && detailData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-3/4 max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Chi tiết thông tin</h2>
              <button
                onClick={closeDetailModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="space-y-4">
              {Object.entries(detailData).map(([key, value]) => {
                if (key === 'id') return null
                
                const fieldMapping: { [key: string]: string } = {
                  'paymentId': 'Mã thanh toán',
                  'receiptId': 'Mã biên lai',
                  'amount': 'Số tiền',
                  'method': 'Phương thức',
                  'status': 'Trạng thái',
                  'company': 'Doanh nghiệp',
                  'date': 'Ngày thanh toán',
                  'cancelDate': 'Ngày hủy',
                  'cancelReason': 'Lý do hủy',
                  'transferId': 'Mã chuyển tiền',
                  'transferDate': 'Ngày chuyển',
                  'fromAccount': 'Tài khoản nguồn',
                  'toAccount': 'Tài khoản đích',
                  'reconciliationId': 'Mã đối soát',
                  'bankName': 'Tên ngân hàng',
                  'fileDate': 'Ngày file',
                  'totalTransactions': 'Tổng giao dịch',
                  'totalAmount': 'Tổng số tiền',
                  'matchedTransactions': 'GD đã khớp',
                  'unmatchedTransactions': 'GD chưa khớp'
                }
                
                const displayKey = fieldMapping[key] || key
                const displayValue = (key === 'amount' || key === 'totalAmount')
                  ? formatCurrency(Number(value))
                  : String(value || '-')
                
                return (
                  <div key={key} className="flex">
                    <div className="w-1/3 font-medium text-gray-700 bg-gray-50 px-3 py-2 border">
                      {displayKey}:
                    </div>
                    <div className="w-2/3 px-3 py-2 border border-l-0">
                      {displayValue}
                    </div>
                  </div>
                )
              })}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeDetailModal}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PaymentManagementPage
