import React, { useState, useEffect } from 'react'
import { useNotification } from '../context/NotificationContext'

interface QROrder {
  id: number
  stt: number
  soThuTu: string
  doanhNghiep: string
  soDonHang: string
  ngayDonHang: string
  loaiThanhToan: string
  tongTien: number
  nganHang: string
  trangThai: string
  moTa: string
}

const QROrderPage: React.FC = () => {
  const { showError, showSuccess } = useNotification()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  
  // Filter states
  const [fromDate, setFromDate] = useState('2022-02-13')
  const [toDate, setToDate] = useState('2022-03-15')
  const [orderNumber, setOrderNumber] = useState('')
  const [notificationNumber, setNotificationNumber] = useState('')
  const [paymentType, setPaymentType] = useState('')
  const [status, setStatus] = useState('')
  const [filteredOrders, setFilteredOrders] = useState<QROrder[]>([])
  
  // Modal states
  const [showCreateOrderModal, setShowCreateOrderModal] = useState(false)
  const [showSelectFeeModal, setShowSelectFeeModal] = useState(false)
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false)
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any>(null)
  const [formData, setFormData] = useState({
    nganHang: 'VCB', // Value thay vì tên
    hinhThucThanhToan: 'EC', // Value thay vì tên
    diaChi: '',
    email: '',
    sdt: '',
    soDonHang: '',
    ngayDonHang: '',
    moTa: '',
    ghiChu: ''
  })
  const [selectedFeeNotifications, setSelectedFeeNotifications] = useState<typeof feeNotifications>([])
  const [feeTableCurrentPage, setFeeTableCurrentPage] = useState(1)
  const feeTableItemsPerPage = 5
  const [showTotal, setShowTotal] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [countdown, setCountdown] = useState(3)
  const [showPaymentLink, setShowPaymentLink] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)
  const [donHangId, setDonHangId] = useState<number | null>(null)
  const [isOrderSigned, setIsOrderSigned] = useState(false)
  
  // Fee selection states
  const [feeFromDate, setFeeFromDate] = useState('2022-02-13')
  const [feeToDate, setFeeToDate] = useState('2022-03-15')
  const [feeNotificationNumber, setFeeNotificationNumber] = useState('')
  const [selectedFees, setSelectedFees] = useState<number[]>([])
  const [filteredFeeNotifications, setFilteredFeeNotifications] = useState<typeof feeNotifications>([])
  
  // Order data states
  const [orderData, setOrderData] = useState<any>(null)
  const [orderLoading, setOrderLoading] = useState(false)
  
  // Fee notifications data (loaded from API)
  const [feeNotifications, setFeeNotifications] = useState<any[]>([])

  // Orders data (loaded from API)
  const [orders] = useState<QROrder[]>([])

  // Initialize filtered orders
  useEffect(() => {
    setFilteredOrders(orders)
  }, [orders])

  // Initialize filtered fee notifications when modal opens
  useEffect(() => {
    if (showSelectFeeModal) {
      setFilteredFeeNotifications(feeNotifications)
      setSelectedFees([])
    }
  }, [showSelectFeeModal, feeNotifications])

  // Countdown effect when processing
  useEffect(() => {
    if (isProcessing && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (isProcessing && countdown === 0) {
      // Processing complete
      setIsProcessing(false)
      setCountdown(3) // Reset for next time
      
      // Check payment method and show appropriate result
      if (formData.hinhThucThanhToan === 'EC') {
        setShowPaymentLink(true)
      } else if (formData.hinhThucThanhToan === 'QR') {
        setShowQRCode(true)
      } else {
        alert('Đơn hàng đã được xử lý thành công!')
      }
    }
  }, [isProcessing, countdown, formData.hinhThucThanhToan])

  // Search function
  const handleSearch = () => {
    let filtered = orders.filter(order => {
      // Filter by date range
      const orderDate = new Date(order.ngayDonHang.split('/').reverse().join('-'))
      const fromDateObj = new Date(fromDate)
      const toDateObj = new Date(toDate)
      
      const isInDateRange = orderDate >= fromDateObj && orderDate <= toDateObj
      
      // Filter by order number
      const matchesOrderNumber = !orderNumber || order.soDonHang.toLowerCase().includes(orderNumber.toLowerCase())
      
      // Filter by payment type
      const matchesPaymentType = !paymentType || order.loaiThanhToan === paymentType
      
      // Filter by status
      const matchesStatus = !status || order.trangThai.toLowerCase().includes(status.toLowerCase())
      
      return isInDateRange && matchesOrderNumber && matchesPaymentType && matchesStatus
    })
    
    setFilteredOrders(filtered)
    setCurrentPage(1) // Reset to first page
  }

  const totalPages = Math.ceil((orderData?.content || filteredOrders).length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  // Use API data if available, otherwise use filteredOrders
  const ordersToShow = orderData?.content || filteredOrders
  const currentOrders = ordersToShow.slice(startIndex, endIndex)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount)
  }

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return '';
      
      // Handle both ISO format (2025-09-15T04:21:07.92136) and DD/MM/YYYY format
      let date: Date;
      
      if (dateString.includes('T')) {
        // ISO format from API
        date = new Date(dateString);
      } else {
        // DD/MM/YYYY format
        const [day, month, year] = dateString.split('/');
        date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      }
      
      // Format to DD/MM/YYYY
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString; // Return original string if formatting fails
    }
  }

  // Helper function to get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case '00':
        return 'Tạo link EcomPay thành công';
      case '01':
        return 'Thanh toán thành công';
      default:
        return status;
    }
  }

  // Helper function to get status style
  const getStatusStyle = (status: string) => {
    switch (status) {
      case '00':
        return {
          backgroundColor: '#e3f2fd',
          color: '#1976d2',
          fontWeight: 'bold',
          borderRadius: '4px',
          padding: '4px 8px'
        };
      case '01':
        return {
          backgroundColor: '#e8f5e8',
          color: '#2e7d32',
          fontWeight: 'bold',
          borderRadius: '4px',
          padding: '4px 8px'
        };
      default:
        return {
          backgroundColor: '#f5f5f5',
          color: '#666',
          fontWeight: 'normal'
        };
    }
  }

  // Helper function to view order details
  const handleViewOrderDetails = (order: any) => {
    console.log('🔍 Viewing order details:', order);
    setSelectedOrderDetails(order);
    setShowOrderDetailsModal(true);
  }

  // Helper function to close order details modal
  const handleCloseOrderDetailsModal = () => {
    setShowOrderDetailsModal(false);
    setSelectedOrderDetails(null);
  }


  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Modal handlers
  const handleCreateOrder = () => {
    setShowCreateOrderModal(true)
    setShowTotal(false) // Reset total display when opening modal
    setShowPaymentLink(false) // Reset payment link when opening modal
    setShowQRCode(false) // Reset QR code when opening modal
  }

  const handleCloseModal = () => {
    setShowCreateOrderModal(false)
    setFormData({
      nganHang: 'VCB', // Value thay vì tên
      hinhThucThanhToan: 'EC', // Value thay vì tên
      diaChi: '',
      email: '',
      sdt: '',
      soDonHang: '',
      ngayDonHang: '',
      moTa: '',
      ghiChu: ''
    })
    setSelectedFeeNotifications([])
    setFeeTableCurrentPage(1)
    setShowTotal(false)
    setIsProcessing(false)
    setCountdown(3)
    setShowPaymentLink(false)
    setShowQRCode(false)
    setDonHangId(null)
    setIsOrderSigned(false)
  }

  const handleFormSubmit = async () => {
    try {
      console.log('🔍 Creating order...');
      
      // Validate required data
      if (selectedFeeNotifications.length === 0) {
        throw new Error('Vui lòng chọn ít nhất một thông báo phí');
      }
      
      // Prepare request body with validation
      const requestBody = {
        mst: "0304126484",
        tenDn: "Công ty TNHH Vận Tải Biển Đông",
        diaChi: String(formData.diaChi || ""),
        email: String(formData.email || ""),
        sdt: String(formData.sdt || ""),
        soDonHang: String(formData.soDonHang || ""),
        ngayDonHang: String(formData.ngayDonHang || ""),
        loaiThanhToan: String(formData.hinhThucThanhToan || "EC"),
        tongTien: Number(selectedFeeNotifications.reduce((sum, fee) => sum + (fee.thanhTien || 0), 0)),
        nganHang: String(formData.nganHang || "VCB"),
        trangThai: "00",
        moTa: String(formData.moTa || ""),
        nguoiTao: "System",
        xmlKy: "",
        chiTietList: selectedFeeNotifications.map(fee => ({
          idTokhai: Number(fee.id || 0),
          soThongBao: String(fee.soThongBao || ""),
          ngayThongBao: String(fee.ngayThongBao || ""),
          thanhTien: Number(fee.thanhTien || 0)
        }))
      };
      
      console.log('🔍 Order request body:', requestBody);
      console.log('🔍 Selected fee notifications:', selectedFeeNotifications);
      console.log('🔍 ChiTietList with idTokhai:', requestBody.chiTietList);
      
      // Validate request body before sending
      const jsonBody = JSON.stringify(requestBody);
      console.log('🔍 JSON string:', jsonBody);
      console.log('🔍 JSON length:', jsonBody.length);
      
      const response = await fetch('/api/don-hang/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: jsonBody
      });
      
      if (!response.ok) {
        // Log detailed error response
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        console.error('❌ Response Status:', response.status);
        console.error('❌ Response Headers:', Object.fromEntries(response.headers.entries()));
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ Order created successfully:', result);
      
      // Save donHangId from response
      if (result.status === 200 && result.data && result.data.id) {
        setDonHangId(result.data.id);
        console.log('🔍 Saved donHangId:', result.data.id);
      }
      
      // Show total when save button is clicked
      setShowTotal(true);
      showSuccess('Đơn hàng đã được tạo thành công!');
      
    } catch (error) {
      console.error('❌ Error creating order:', error);
      showError('Có lỗi xảy ra khi tạo đơn hàng: ' + (error as Error).message);
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Fee selection handlers
  const handleSelectFee = async () => {
    // Prevent duplicate calls
    if (isFeeLoadingRef.current) {
      console.log('🔄 Fee notifications are already loading, skipping duplicate call');
      return;
    }
    
    try {
      isFeeLoadingRef.current = true;
      console.log('🔍 Loading fee notifications...');
      
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 seconds timeout
      
      const response = await fetch('/api/tokhai-thongtin/ds-nphi', {
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log('🔍 Fee notifications response:', result);
      
      if (result.status === 200 && result.data) {
        // Map API data to fee notifications format
        const feeNotifications = result.data.map((item: any) => ({
          id: item.id,
          soToKhai: item.soToKhai,
          ngayToKhai: item.ngayToKhai,
          soThongBao: item.soThongBaoNopPhi,
          ngayThongBao: item.ngayKhaiPhi,
          thanhTien: item.tongTienPhi,
          trangThai: item.trangThaiNganHang === 'DA_THANH_TOAN' ? 'Đã thanh toán' : 'Chưa thanh toán',
          // Additional fields from API
          maDoanhNghiepKhaiPhi: item.maDoanhNghiepKhaiPhi,
          tenDoanhNghiepKhaiPhi: item.tenDoanhNghiepKhaiPhi,
          diaChiKhaiPhi: item.diaChiKhaiPhi,
          maDoanhNghiepXNK: item.maDoanhNghiepXNK,
          tenDoanhNghiepXNK: item.tenDoanhNghiepXNK,
          diaChiXNK: item.diaChiXNK,
          maHaiQuan: item.maHaiQuan,
          maLoaiHinh: item.maLoaiHinh,
          maLuuKho: item.maLuuKho,
          nuocXuatKhau: item.nuocXuatKhau,
          maPhuongThucVC: item.maPhuongThucVC,
          phuongTienVC: item.phuongTienVC,
          maDiaDiemXepHang: item.maDiaDiemXepHang,
          maDiaDiemDoHang: item.maDiaDiemDoHang,
          maPhanLoaiHangHoa: item.maPhanLoaiHangHoa,
          mucDichVC: item.mucDichVC,
          soTiepNhanKhaiPhi: item.soTiepNhanKhaiPhi,
          nhomLoaiPhi: item.nhomLoaiPhi,
          loaiThanhToan: item.loaiThanhToan,
          ghiChuKhaiPhi: item.ghiChuKhaiPhi,
          soThongBaoNopPhi: item.soThongBaoNopPhi,
          msgId: item.msgId,
          idPhatHanh: item.idPhatHanh,
          soBienLai: item.soBienLai,
          ngayBienLai: item.ngayBienLai,
          kyHieuBienLai: item.kyHieuBienLai,
          mauBienLai: item.mauBienLai,
          maTraCuuBienLai: item.maTraCuuBienLai,
          xemBienLai: item.xemBienLai,
          idBienLai: item.idBienLai,
          loaiHangMienPhi: item.loaiHangMienPhi,
          loaiHang: item.loaiHang,
          trangThaiPhatHanh: item.trangThaiPhatHanh,
          chiTietList: item.chiTietList || []
        }));
        
        setFeeNotifications(feeNotifications);
        console.log('✅ Fee notifications loaded:', feeNotifications.length, 'items');
        showSuccess(`Đã tải ${feeNotifications.length} thông báo phí`);
        
        // Open the fee selection modal
        setShowSelectFeeModal(true);
      } else {
        console.log('❌ No fee notifications data');
        setFeeNotifications([]);
      }
    } catch (error) {
      console.error('❌ Error loading fee notifications:', error);
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          showError('Request timeout - Vui lòng thử lại');
        } else {
          showError('Có lỗi xảy ra khi tải danh sách thông báo phí: ' + error.message);
        }
      } else {
        showError('Có lỗi xảy ra khi tải danh sách thông báo phí');
      }
      setFeeNotifications([]);
    } finally {
      isFeeLoadingRef.current = false;
    }
  }

  const handleCloseFeeModal = () => {
    setShowSelectFeeModal(false)
    setSelectedFees([])
  }

  const handleFeeCheckboxChange = (feeId: number) => {
    setSelectedFees(prev => {
      if (prev.includes(feeId)) {
        const newSelectedFees = prev.filter(id => id !== feeId);
        console.log('🔍 Unchecked fee ID (idtokhai):', feeId);
        console.log('🔍 Updated selectedFees:', newSelectedFees);
        return newSelectedFees;
      } else {
        const newSelectedFees = [...prev, feeId];
        console.log('🔍 Checked fee ID (idtokhai):', feeId);
        console.log('🔍 Updated selectedFees:', newSelectedFees);
        return newSelectedFees;
      }
    })
  }

  const handleSelectAllFees = () => {
    if (selectedFees.length === filteredFeeNotifications.length) {
      setSelectedFees([])
    } else {
      setSelectedFees(filteredFeeNotifications.map(fee => fee.id))
    }
  }

  const handleConfirmSelectedFees = () => {
    // Get the selected fee notifications
    const selectedFeesToAdd = filteredFeeNotifications.filter(fee => selectedFees.includes(fee.id))
    
    console.log('🔍 Selected fees IDs:', selectedFees);
    console.log('🔍 Selected fees to add:', selectedFeesToAdd);
    console.log('🔍 Selected fees to add IDs (idtokhai):', selectedFeesToAdd.map(fee => fee.id));
    
    // Add to selectedFeeNotifications, avoiding duplicates
    const existingIds = selectedFeeNotifications.map(fee => fee.id)
    const newFees = selectedFeesToAdd.filter(fee => !existingIds.includes(fee.id))
    
    console.log('🔍 New fees to add (after duplicate check):', newFees);
    console.log('🔍 New fees IDs (idtokhai):', newFees.map(fee => fee.id));
    
    setSelectedFeeNotifications(prev => [...prev, ...newFees])
    setFeeTableCurrentPage(1) // Reset to first page
    
    alert(`Đã thêm ${newFees.length} thông báo phí vào đơn hàng`)
    handleCloseFeeModal()
  }

  // Remove fee from selected list
  const handleRemoveFee = (feeId: number) => {
    setSelectedFeeNotifications(prev => prev.filter(fee => fee.id !== feeId))
  }

  // Fee table pagination
  const feeTableTotalPages = Math.ceil(selectedFeeNotifications.length / feeTableItemsPerPage)
  const feeTableIndexOfFirstItem = (feeTableCurrentPage - 1) * feeTableItemsPerPage
  const feeTableIndexOfLastItem = feeTableIndexOfFirstItem + feeTableItemsPerPage
  const feeTableCurrentItems = selectedFeeNotifications.slice(feeTableIndexOfFirstItem, feeTableIndexOfLastItem)

  const handleFeeTablePageChange = (page: number) => {
    setFeeTableCurrentPage(page)
  }

  // Handle digital signature
  const handleDigitalSignature = async () => {
    try {
      if (!donHangId) {
        showError('Không tìm thấy ID đơn hàng. Vui lòng tạo đơn hàng trước.');
        return;
      }

      console.log('🔍 Signing order with ID:', donHangId);
      
      const requestBody = {
        idDonHang: donHangId,
        serialNumber: "97CC8605BB55E734"
      };
      
      console.log('🔍 Ky-so request body:', requestBody);
      
      const response = await fetch('/api/don-hang/ky-so', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Ky-so API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ Order signed successfully:', result);
      
      // Update status for each selected fee notification
      console.log('🔍 Updating status for fee notifications...');
      const updatePromises = selectedFeeNotifications.map(async (fee) => {
        try {
          const updateRequestBody = {
            id: fee.id, // idTokhai
            trangThai: "03"
          };
          
          console.log('🔍 Updating fee notification:', fee.id, 'to status 03');
          
          const updateResponse = await fetch('/api/tokhai-thongtin/update-status', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(updateRequestBody)
          });
          
          if (!updateResponse.ok) {
            const errorText = await updateResponse.text();
            console.error(`❌ Error updating fee ${fee.id}:`, errorText);
            throw new Error(`Failed to update fee ${fee.id}: ${errorText}`);
          }
          
          const updateResult = await updateResponse.json();
          console.log(`✅ Fee notification ${fee.id} updated successfully:`, updateResult);
          
        } catch (error) {
          console.error(`❌ Error updating fee notification ${fee.id}:`, error);
          throw error;
        }
      });
      
      // Wait for all updates to complete
      await Promise.all(updatePromises);
      console.log('✅ All fee notifications updated successfully');
      
      // Mark order as signed
      setIsOrderSigned(true);
      
      // Start processing animation
      setIsProcessing(true);
      setCountdown(3);
      
      showSuccess('Ký số đơn hàng và cập nhật trạng thái thành công!');
      
    } catch (error) {
      console.error('❌ Error signing order:', error);
      showError('Có lỗi xảy ra khi ký số đơn hàng: ' + (error as Error).message);
    }
  }

  // Load order data from API with timeout
  const loadOrderData = async () => {
    // Prevent duplicate calls
    if (isLoadingRef.current) {
      console.log('🔄 Order data is already loading, skipping duplicate call');
      return;
    }
    
    try {
      isLoadingRef.current = true;
      setOrderLoading(true);
      console.log('🔍 Loading order data...');
      
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout
      
      const response = await fetch('/api/don-hang/all?page=0&size=10&sortBy=ngayTao&sortDir=desc', {
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('🔍 Order data response:', result);
      
      if (result.status === 200 && result.data) {
        setOrderData(result.data);
        console.log('✅ Order data loaded:', result.data.content.length, 'orders');
        showSuccess(`Đã tải ${result.data.content.length} đơn hàng`);
      } else {
        console.log('❌ No order data');
        setOrderData(null);
      }
    } catch (error) {
      console.error('❌ Error loading order data:', error);
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          showError('Request timeout - Vui lòng thử lại');
        } else {
          showError('Có lỗi xảy ra khi tải danh sách đơn hàng: ' + error.message);
        }
      } else {
        showError('Có lỗi xảy ra khi tải danh sách đơn hàng');
      }
      setOrderData(null);
    } finally {
      isLoadingRef.current = false;
      setOrderLoading(false);
    }
  };

  // Load order data on component mount
  useEffect(() => {
    loadOrderData();
  }, []);

  // Prevent duplicate calls by adding a ref to track if data is already loading
  const isLoadingRef = React.useRef(false);
  const isFeeLoadingRef = React.useRef(false);

  // Fee search function
  const handleFeeSearch = () => {
    let filtered = feeNotifications.filter(fee => {
      // Filter by date range - convert DD/MM/YYYY to Date for comparison
      const parseDate = (dateStr: string) => {
        const [day, month, year] = dateStr.split('/')
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
      }

      const feeDate = parseDate(fee.ngayThongBao)
      const fromDate = new Date(feeFromDate)
      const toDate = new Date(feeToDate)

      // Check date range
      const isInDateRange = feeDate >= fromDate && feeDate <= toDate

      // Filter by notification number
      const matchesNotificationNumber = feeNotificationNumber === '' || 
        fee.soThongBao.toLowerCase().includes(feeNotificationNumber.toLowerCase()) ||
        fee.soToKhai.toLowerCase().includes(feeNotificationNumber.toLowerCase())

      return isInDateRange && matchesNotificationNumber
    })

    setFilteredFeeNotifications(filtered)
    setSelectedFees([]) // Reset selections when filtering
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      
      {/* Filter Section */}
      <div style={{ 
        backgroundColor: '#fff', 
        padding: '15px 20px', 
        marginBottom: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Left side - Tạo đơn hàng button */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              onClick={handleCreateOrder}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                padding: '8px 15px',
                borderRadius: '4px',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#0056b3'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#007bff'
              }}
            >
              <i className="fas fa-plus"></i>
              Tạo đơn hàng
            </button>
            
            <button
              onClick={loadOrderData}
              disabled={orderLoading}
              style={{
                backgroundColor: orderLoading ? '#9ca3af' : '#28a745',
                color: 'white',
                border: 'none',
                padding: '8px 15px',
                borderRadius: '4px',
                fontSize: '14px',
                cursor: orderLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontWeight: '500',
                opacity: orderLoading ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!orderLoading) {
                  e.currentTarget.style.backgroundColor = '#218838'
                }
              }}
              onMouseLeave={(e) => {
                if (!orderLoading) {
                  e.currentTarget.style.backgroundColor = '#28a745'
                }
              }}
            >
              <i className={`fas fa-sync-alt ${orderLoading ? 'fa-spin' : ''}`}></i>
              {orderLoading ? 'Đang tải...' : 'Làm mới'}
            </button>
          </div>

          {/* Right side - Filter fields and search button */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '10px'
          }}>
            {/* Từ ngày */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', minWidth: '60px' }}>Từ ngày:</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                style={{
                  padding: '6px 8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '13px',
                  width: '140px'
                }}
              />
            </div>

            {/* Đến ngày */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', minWidth: '65px' }}>Đến ngày:</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                style={{
                  padding: '6px 8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '13px',
                  width: '140px'
                }}
              />
            </div>

            {/* Số đơn hàng */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input
                type="text"
                placeholder="Số đơn hàng"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                style={{
                  padding: '6px 8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '13px',
                  width: '120px'
                }}
              />
            </div>

            {/* Số thông báo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input
                type="text"
                placeholder="Số thông báo"
                value={notificationNumber}
                onChange={(e) => setNotificationNumber(e.target.value)}
                style={{
                  padding: '6px 8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '13px',
                  width: '120px'
                }}
              />
            </div>

            {/* Thanh toán dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                style={{
                  padding: '6px 8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '13px',
                  width: '120px',
                  backgroundColor: 'white'
                }}
              >
                <option value="">-- Thanh toán --</option>
                <option value="EC">EC</option>
                <option value="QR">QR</option>
                <option value="CASH">Tiền mặt</option>
              </select>
            </div>

            {/* Trạng thái dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{
                  padding: '6px 8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '13px',
                  width: '120px',
                  backgroundColor: 'white'
                }}
              >
                <option value="">-- Trạng thái --</option>
                <option value="success">Thành công</option>
                <option value="pending">Đang xử lý</option>
                <option value="failed">Thất bại</option>
              </select>
            </div>

            {/* Tìm kiếm button */}
            <button
              onClick={handleSearch}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                padding: '8px 15px',
                borderRadius: '4px',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#0056b3'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#007bff'
              }}
            >
              <i className="fas fa-search"></i>
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ 
        backgroundColor: '#fff', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          fontSize: '13px'
        }}>
          <thead style={{ backgroundColor: '#e3f2fd' }}>
            <tr>
              <th style={{ 
                padding: '12px 8px', 
                textAlign: 'center', 
                borderBottom: '2px solid #ddd',
                fontWeight: 'bold',
                width: '40px',
                whiteSpace: 'nowrap'
              }}>STT</th>
              <th style={{ 
                padding: '12px 8px', 
                textAlign: 'center', 
                borderBottom: '2px solid #ddd',
                fontWeight: 'bold',
                width: '40px',
                whiteSpace: 'nowrap'
              }}>#</th>
              <th style={{ 
                padding: '12px 8px', 
                textAlign: 'center', 
                borderBottom: '2px solid #ddd',
                fontWeight: 'bold',
                width: '200px',
                whiteSpace: 'nowrap'
              }}>DOANH NGHIỆP</th>
              <th style={{ 
                padding: '12px 8px', 
                textAlign: 'center', 
                borderBottom: '2px solid #ddd',
                fontWeight: 'bold',
                width: '120px',
                whiteSpace: 'nowrap'
              }}>SỐ ĐƠN HÀNG</th>
              <th style={{ 
                padding: '12px 8px', 
                textAlign: 'center', 
                borderBottom: '2px solid #ddd',
                fontWeight: 'bold',
                width: '120px',
                whiteSpace: 'nowrap'
              }}>NGÀY ĐƠN HÀNG</th>
              <th style={{ 
                padding: '12px 8px', 
                textAlign: 'center', 
                borderBottom: '2px solid #ddd',
                fontWeight: 'bold',
                width: '130px',
                whiteSpace: 'nowrap'
              }}>LOẠI THANH TOÁN</th>
              <th style={{ 
                padding: '12px 8px', 
                textAlign: 'center', 
                borderBottom: '2px solid #ddd',
                fontWeight: 'bold',
                width: '90px',
                whiteSpace: 'nowrap'
              }}>TỔNG TIỀN</th>
              <th style={{ 
                padding: '12px 8px', 
                textAlign: 'center', 
                borderBottom: '2px solid #ddd',
                fontWeight: 'bold',
                width: '150px',
                whiteSpace: 'nowrap'
              }}>NGÂN HÀNG</th>
              <th style={{ 
                padding: '12px 8px', 
                textAlign: 'center', 
                borderBottom: '2px solid #ddd',
                fontWeight: 'bold',
                width: '100px',
                whiteSpace: 'nowrap'
              }}>TRẠNG THÁI</th>
              <th style={{ 
                padding: '12px 8px', 
                textAlign: 'center', 
                borderBottom: '2px solid #ddd',
                fontWeight: 'bold',
                width: '67px',
                whiteSpace: 'nowrap'
              }}>MÔ TẢ</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order, index) => (
              <tr key={order.id} style={{ 
                backgroundColor: index % 2 === 0 ? '#f8f9fa' : '#fff',
                borderBottom: '1px solid #dee2e6'
              }}>
                <td style={{ 
                  padding: '8px', 
                  textAlign: 'center',
                  borderRight: '1px solid #dee2e6'
                }}>{index + 1}</td>
                <td style={{ 
                  padding: '8px', 
                  textAlign: 'center',
                  borderRight: '1px solid #dee2e6'
                }}>
                  <button
                    onClick={() => handleViewOrderDetails(order)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#007bff',
                      cursor: 'pointer',
                      fontSize: '16px',
                      padding: '4px',
                      borderRadius: '3px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#e3f2fd';
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                    title="Xem thông tin đơn hàng"
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                </td>
                <td style={{ 
                  padding: '8px',
                  borderRight: '1px solid #dee2e6'
                }}>{order.tenDn || order.doanhNghiep}</td>
                <td style={{ 
                  padding: '8px', 
                  textAlign: 'center',
                  borderRight: '1px solid #dee2e6'
                }}>{order.soDonHang}</td>
                <td style={{ 
                  padding: '8px', 
                  textAlign: 'center',
                  borderRight: '1px solid #dee2e6'
                }}>{formatDate(order.ngayDonHang)}</td>
                <td style={{ 
                  padding: '8px', 
                  textAlign: 'center',
                  borderRight: '1px solid #dee2e6'
                }}>{order.loaiThanhToan}</td>
                <td style={{ 
                  padding: '8px', 
                  textAlign: 'right',
                  borderRight: '1px solid #dee2e6'
                }}>{formatCurrency(order.tongTien)}</td>
                <td style={{ 
                  padding: '8px',
                  textAlign: 'center',
                  borderRight: '1px solid #dee2e6',
                  whiteSpace: 'pre-line'
                }}>{order.nganHang}</td>
                <td style={{ 
                  padding: '8px', 
                  textAlign: 'center',
                  borderRight: '1px solid #dee2e6',
                  whiteSpace: 'nowrap',
                  ...getStatusStyle(order.trangThai)
                }}>{getStatusText(order.trangThai)}</td>
                <td style={{ 
                  padding: '8px', 
                  textAlign: 'center'
                }}></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {/* Pagination */}
      <div style={{ 
        backgroundColor: '#fff', 
        padding: '15px 20px', 
        marginTop: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '5px' }}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              backgroundColor: currentPage === 1 ? '#f8f9fa' : '#fff',
              color: currentPage === 1 ? '#999' : '#333',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              borderRadius: '4px'
            }}
          >
            &laquo; Trước
          </button>
          
          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1
            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  backgroundColor: currentPage === page ? '#007bff' : '#fff',
                  color: currentPage === page ? '#fff' : '#333',
                  cursor: 'pointer',
                  borderRadius: '4px'
                }}
              >
                {page}
              </button>
            )
          })}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              backgroundColor: currentPage === totalPages ? '#f8f9fa' : '#fff',
              color: currentPage === totalPages ? '#999' : '#333',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              borderRadius: '4px'
            }}
          >
            Sau &raquo;
          </button>
        </div>
      </div>

      {/* Create Order Modal */}
      {showCreateOrderModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            width: '1000px',
            maxWidth: '95vw',
            maxHeight: '95vh',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            position: 'relative',
            overflow: 'auto'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderBottom: '1px solid #dee2e6',
              backgroundColor: '#f8f9fa'
            }}>
              <h4 style={{
                margin: '0',
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#333'
              }}>
                <i className="fas fa-plus-circle" style={{ marginRight: '8px', color: '#007bff' }}></i>
                Thông Tin Đơn Hàng Thanh Toán
              </h4>
              <button
                onClick={handleCloseModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#666',
                  padding: '4px'
                }}
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', gap: '20px' }}>
                {/* Left Column - Form */}
                <div style={{ flex: '1' }}>
                  {/* Ngân hàng thanh toán */}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#333'
                    }}>
                      Ngân hàng thanh toán:
                    </label>
                    <select
                      value={formData.nganHang}
                      onChange={(e) => handleInputChange('nganHang', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px',
                        backgroundColor: 'white'
                      }}
                    >
                      <option value="VCB">Ngân hàng TMCP Ngoại Thương Việt Nam</option>
                      <option value="BIDV">Ngân hàng TMCP Đầu tư và Phát triển Việt Nam</option>
                      <option value="Vietinbank">Ngân hàng TMCP Công Thương Việt Nam</option>
                    </select>
                  </div>

                  {/* Hình thức thanh toán */}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#333'
                    }}>
                      Hình thức thanh toán:
                    </label>
                    <select
                      value={formData.hinhThucThanhToan}
                      onChange={(e) => handleInputChange('hinhThucThanhToan', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px',
                        backgroundColor: 'white'
                      }}
                    >
                      <option value="EC">Thông qua liên kết Ecom</option>
                      <option value="QR">Quét Mã QR</option>
                    </select>
                  </div>

                  {/* Ghi chú */}
                  <div style={{ marginBottom: '-5px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#333'
                    }}>
                      Ghi chú:
                    </label>
                    <textarea
                      value={formData.ghiChu}
                      onChange={(e) => handleInputChange('ghiChu', e.target.value)}
                      rows={4}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px',
                        resize: 'vertical',
                        fontFamily: 'inherit'
                      }}
                      placeholder="Nhập ghi chú..."
                    />
                  </div>
                </div>

                {/* Right Column - QR Info */}
                <div style={{
                  width: '300px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: (showPaymentLink || showQRCode) ? '10px' : '20px',
                  border: (showPaymentLink || showQRCode) ? 'none' : '1px solid #ddd',
                  borderRadius: '8px',
                  backgroundColor: (showPaymentLink || showQRCode) ? 'transparent' : '#f8f9fa'
                }}>
                  <div style={{
                    width: (showPaymentLink || showQRCode) ? 'auto' : '160px',
                    height: (showPaymentLink || showQRCode) ? 'auto' : '160px',
                    backgroundColor: (showPaymentLink || showQRCode) ? 'transparent' : '#fff',
                    border: (showPaymentLink || showQRCode) ? 'none' : '2px solid #ddd',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '12px',
                    position: 'relative',
                    minHeight: (showPaymentLink || showQRCode) ? '80px' : '160px'
                  }}>
                    {isProcessing ? (
                      <>
                        <i className="fas fa-qrcode" style={{ fontSize: '60px', color: '#ccc' }}></i>
                        <div style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          backgroundColor: 'rgba(0, 123, 255, 0.9)',
                          color: 'white',
                          borderRadius: '50%',
                          width: '60px',
                          height: '60px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px',
                          fontWeight: 'bold'
                        }}>
                          {countdown}
                        </div>
                      </>
                    ) : showPaymentLink ? (
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        width: '100%',
                        padding: '0'
                      }}>
                        <button
                          onClick={() => window.open('/ecom-payment', '_blank')}
                          style={{
                            backgroundColor: '#ffffff',
                            color: '#007bff',
                            border: '2px solid #dc3545',
                            padding: '15px 25px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            textAlign: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            minWidth: '200px',
                            whiteSpace: 'nowrap',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                            transition: 'all 0.3s ease',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f8f9fa'
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
                            e.currentTarget.style.transform = 'translateY(-1px)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#ffffff'
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'
                            e.currentTarget.style.transform = 'translateY(0)'
                          }}
                        >
                          <i className="fas fa-external-link-alt" style={{ fontSize: '14px' }}></i>
                          <span>THANH TOÁN TẠI ĐÂY</span>
                        </button>
                      </div>
                    ) : showQRCode ? (
                      // Real QR Code Display
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        width: '100%',
                        padding: '0'
                      }}>
                        <svg 
                          width="140" 
                          height="140" 
                          viewBox="0 0 140 140"
                          style={{
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            backgroundColor: 'white'
                          }}
                        >
                          {/* QR Code Pattern - Dense Realistic QR code */}
                          <rect width="140" height="140" fill="white"/>
                          
                          {/* Corner squares */}
                          <g fill="black">
                            {/* Top-left corner */}
                            <rect x="4" y="4" width="28" height="28"/>
                            <rect x="8" y="8" width="20" height="20" fill="white"/>
                            <rect x="12" y="12" width="12" height="12"/>
                            
                            {/* Top-right corner */}
                            <rect x="108" y="4" width="28" height="28"/>
                            <rect x="112" y="8" width="20" height="20" fill="white"/>
                            <rect x="116" y="12" width="12" height="12"/>
                            
                            {/* Bottom-left corner */}
                            <rect x="4" y="108" width="28" height="28"/>
                            <rect x="8" y="112" width="20" height="20" fill="white"/>
                            <rect x="12" y="116" width="12" height="12"/>
                          </g>
                          
                          {/* Dense Data pattern - Much more realistic */}
                          <g fill="black">
                            {/* Row 1 */}
                            <rect x="36" y="4" width="4" height="4"/>
                            <rect x="44" y="4" width="4" height="4"/>
                            <rect x="48" y="4" width="4" height="4"/>
                            <rect x="56" y="4" width="4" height="4"/>
                            <rect x="64" y="4" width="4" height="4"/>
                            <rect x="68" y="4" width="4" height="4"/>
                            <rect x="72" y="4" width="4" height="4"/>
                            <rect x="80" y="4" width="4" height="4"/>
                            <rect x="84" y="4" width="4" height="4"/>
                            <rect x="88" y="4" width="4" height="4"/>
                            <rect x="96" y="4" width="4" height="4"/>
                            <rect x="100" y="4" width="4" height="4"/>
                            <rect x="104" y="4" width="4" height="4"/>
                            
                            {/* Row 2 */}
                            <rect x="36" y="8" width="4" height="4"/>
                            <rect x="40" y="8" width="4" height="4"/>
                            <rect x="48" y="8" width="4" height="4"/>
                            <rect x="52" y="8" width="4" height="4"/>
                            <rect x="60" y="8" width="4" height="4"/>
                            <rect x="68" y="8" width="4" height="4"/>
                            <rect x="76" y="8" width="4" height="4"/>
                            <rect x="80" y="8" width="4" height="4"/>
                            <rect x="88" y="8" width="4" height="4"/>
                            <rect x="92" y="8" width="4" height="4"/>
                            <rect x="100" y="8" width="4" height="4"/>
                            
                            {/* Row 3 */}
                            <rect x="36" y="12" width="4" height="4"/>
                            <rect x="44" y="12" width="4" height="4"/>
                            <rect x="52" y="12" width="4" height="4"/>
                            <rect x="56" y="12" width="4" height="4"/>
                            <rect x="64" y="12" width="4" height="4"/>
                            <rect x="72" y="12" width="4" height="4"/>
                            <rect x="76" y="12" width="4" height="4"/>
                            <rect x="84" y="12" width="4" height="4"/>
                            <rect x="88" y="12" width="4" height="4"/>
                            <rect x="96" y="12" width="4" height="4"/>
                            <rect x="104" y="12" width="4" height="4"/>
                            
                            {/* Row 4 */}
                            <rect x="40" y="16" width="4" height="4"/>
                            <rect x="44" y="16" width="4" height="4"/>
                            <rect x="48" y="16" width="4" height="4"/>
                            <rect x="56" y="16" width="4" height="4"/>
                            <rect x="60" y="16" width="4" height="4"/>
                            <rect x="68" y="16" width="4" height="4"/>
                            <rect x="72" y="16" width="4" height="4"/>
                            <rect x="80" y="16" width="4" height="4"/>
                            <rect x="84" y="16" width="4" height="4"/>
                            <rect x="92" y="16" width="4" height="4"/>
                            <rect x="96" y="16" width="4" height="4"/>
                            <rect x="100" y="16" width="4" height="4"/>
                            
                            {/* Row 5 */}
                            <rect x="36" y="20" width="4" height="4"/>
                            <rect x="40" y="20" width="4" height="4"/>
                            <rect x="48" y="20" width="4" height="4"/>
                            <rect x="52" y="20" width="4" height="4"/>
                            <rect x="60" y="20" width="4" height="4"/>
                            <rect x="64" y="20" width="4" height="4"/>
                            <rect x="72" y="20" width="4" height="4"/>
                            <rect x="76" y="20" width="4" height="4"/>
                            <rect x="84" y="20" width="4" height="4"/>
                            <rect x="88" y="20" width="4" height="4"/>
                            <rect x="96" y="20" width="4" height="4"/>
                            <rect x="104" y="20" width="4" height="4"/>
                            
                            {/* Row 6 */}
                            <rect x="36" y="24" width="4" height="4"/>
                            <rect x="44" y="24" width="4" height="4"/>
                            <rect x="48" y="24" width="4" height="4"/>
                            <rect x="52" y="24" width="4" height="4"/>
                            <rect x="60" y="24" width="4" height="4"/>
                            <rect x="68" y="24" width="4" height="4"/>
                            <rect x="72" y="24" width="4" height="4"/>
                            <rect x="76" y="24" width="4" height="4"/>
                            <rect x="84" y="24" width="4" height="4"/>
                            <rect x="92" y="24" width="4" height="4"/>
                            <rect x="96" y="24" width="4" height="4"/>
                            <rect x="100" y="24" width="4" height="4"/>
                            
                            {/* Row 7 */}
                            <rect x="40" y="28" width="4" height="4"/>
                            <rect x="44" y="28" width="4" height="4"/>
                            <rect x="52" y="28" width="4" height="4"/>
                            <rect x="56" y="28" width="4" height="4"/>
                            <rect x="64" y="28" width="4" height="4"/>
                            <rect x="68" y="28" width="4" height="4"/>
                            <rect x="76" y="28" width="4" height="4"/>
                            <rect x="80" y="28" width="4" height="4"/>
                            <rect x="88" y="28" width="4" height="4"/>
                            <rect x="92" y="28" width="4" height="4"/>
                            <rect x="100" y="28" width="4" height="4"/>
                            <rect x="104" y="28" width="4" height="4"/>
                            
                            {/* Separator line */}
                            <rect x="4" y="32" width="4" height="4"/>
                            <rect x="8" y="32" width="4" height="4"/>
                            <rect x="12" y="32" width="4" height="4"/>
                            <rect x="16" y="32" width="4" height="4"/>
                            <rect x="20" y="32" width="4" height="4"/>
                            <rect x="24" y="32" width="4" height="4"/>
                            <rect x="28" y="32" width="4" height="4"/>
                            <rect x="32" y="32" width="4" height="4"/>
                            <rect x="40" y="32" width="4" height="4"/>
                            <rect x="48" y="32" width="4" height="4"/>
                            <rect x="56" y="32" width="4" height="4"/>
                            <rect x="64" y="32" width="4" height="4"/>
                            <rect x="72" y="32" width="4" height="4"/>
                            <rect x="80" y="32" width="4" height="4"/>
                            <rect x="88" y="32" width="4" height="4"/>
                            <rect x="96" y="32" width="4" height="4"/>
                            <rect x="104" y="32" width="4" height="4"/>
                            <rect x="112" y="32" width="4" height="4"/>
                            <rect x="120" y="32" width="4" height="4"/>
                            <rect x="128" y="32" width="4" height="4"/>
                            <rect x="132" y="32" width="4" height="4"/>
                            <rect x="136" y="32" width="4" height="4"/>
                            
                            {/* Dense middle section */}
                            <rect x="4" y="36" width="4" height="4"/>
                            <rect x="12" y="36" width="4" height="4"/>
                            <rect x="16" y="36" width="4" height="4"/>
                            <rect x="24" y="36" width="4" height="4"/>
                            <rect x="28" y="36" width="4" height="4"/>
                            <rect x="36" y="36" width="4" height="4"/>
                            <rect x="40" y="36" width="4" height="4"/>
                            <rect x="48" y="36" width="4" height="4"/>
                            <rect x="52" y="36" width="4" height="4"/>
                            <rect x="60" y="36" width="4" height="4"/>
                            <rect x="64" y="36" width="4" height="4"/>
                            <rect x="72" y="36" width="4" height="4"/>
                            <rect x="76" y="36" width="4" height="4"/>
                            <rect x="84" y="36" width="4" height="4"/>
                            <rect x="88" y="36" width="4" height="4"/>
                            <rect x="96" y="36" width="4" height="4"/>
                            <rect x="100" y="36" width="4" height="4"/>
                            <rect x="108" y="36" width="4" height="4"/>
                            <rect x="112" y="36" width="4" height="4"/>
                            <rect x="120" y="36" width="4" height="4"/>
                            <rect x="124" y="36" width="4" height="4"/>
                            <rect x="132" y="36" width="4" height="4"/>
                            
                            {/* Continue dense pattern for realistic look */}
                            <rect x="8" y="40" width="4" height="4"/>
                            <rect x="12" y="40" width="4" height="4"/>
                            <rect x="20" y="40" width="4" height="4"/>
                            <rect x="28" y="40" width="4" height="4"/>
                            <rect x="32" y="40" width="4" height="4"/>
                            <rect x="40" y="40" width="4" height="4"/>
                            <rect x="44" y="40" width="4" height="4"/>
                            <rect x="52" y="40" width="4" height="4"/>
                            <rect x="56" y="40" width="4" height="4"/>
                            <rect x="64" y="40" width="4" height="4"/>
                            <rect x="68" y="40" width="4" height="4"/>
                            <rect x="76" y="40" width="4" height="4"/>
                            <rect x="80" y="40" width="4" height="4"/>
                            <rect x="88" y="40" width="4" height="4"/>
                            <rect x="92" y="40" width="4" height="4"/>
                            <rect x="100" y="40" width="4" height="4"/>
                            <rect x="104" y="40" width="4" height="4"/>
                            <rect x="112" y="40" width="4" height="4"/>
                            <rect x="116" y="40" width="4" height="4"/>
                            <rect x="124" y="40" width="4" height="4"/>
                            <rect x="128" y="40" width="4" height="4"/>
                            <rect x="136" y="40" width="4" height="4"/>
                            
                            {/* Center alignment pattern */}
                            <rect x="56" y="56" width="28" height="28"/>
                            <rect x="60" y="60" width="20" height="20" fill="white"/>
                            <rect x="64" y="64" width="12" height="12"/>
                            
                            {/* More dense patterns around center */}
                            <rect x="4" y="44" width="4" height="4"/>
                            <rect x="8" y="44" width="4" height="4"/>
                            <rect x="16" y="44" width="4" height="4"/>
                            <rect x="20" y="44" width="4" height="4"/>
                            <rect x="28" y="44" width="4" height="4"/>
                            <rect x="32" y="44" width="4" height="4"/>
                            <rect x="40" y="44" width="4" height="4"/>
                            <rect x="48" y="44" width="4" height="4"/>
                            <rect x="88" y="44" width="4" height="4"/>
                            <rect x="96" y="44" width="4" height="4"/>
                            <rect x="104" y="44" width="4" height="4"/>
                            <rect x="108" y="44" width="4" height="4"/>
                            <rect x="116" y="44" width="4" height="4"/>
                            <rect x="120" y="44" width="4" height="4"/>
                            <rect x="128" y="44" width="4" height="4"/>
                            <rect x="132" y="44" width="4" height="4"/>
                            
                            {/* Continue pattern to bottom */}
                            <rect x="4" y="88" width="4" height="4"/>
                            <rect x="12" y="88" width="4" height="4"/>
                            <rect x="16" y="88" width="4" height="4"/>
                            <rect x="24" y="88" width="4" height="4"/>
                            <rect x="32" y="88" width="4" height="4"/>
                            <rect x="40" y="88" width="4" height="4"/>
                            <rect x="44" y="88" width="4" height="4"/>
                            <rect x="52" y="88" width="4" height="4"/>
                            <rect x="56" y="88" width="4" height="4"/>
                            <rect x="64" y="88" width="4" height="4"/>
                            <rect x="68" y="88" width="4" height="4"/>
                            <rect x="76" y="88" width="4" height="4"/>
                            <rect x="80" y="88" width="4" height="4"/>
                            <rect x="88" y="88" width="4" height="4"/>
                            <rect x="92" y="88" width="4" height="4"/>
                            <rect x="100" y="88" width="4" height="4"/>
                            <rect x="104" y="88" width="4" height="4"/>
                            <rect x="112" y="88" width="4" height="4"/>
                            <rect x="116" y="88" width="4" height="4"/>
                            <rect x="124" y="88" width="4" height="4"/>
                            <rect x="128" y="88" width="4" height="4"/>
                            <rect x="136" y="88" width="4" height="4"/>
                            
                            {/* Bottom separator */}
                            <rect x="4" y="104" width="4" height="4"/>
                            <rect x="40" y="104" width="4" height="4"/>
                            <rect x="48" y="104" width="4" height="4"/>
                            <rect x="56" y="104" width="4" height="4"/>
                            <rect x="64" y="104" width="4" height="4"/>
                            <rect x="72" y="104" width="4" height="4"/>
                            <rect x="80" y="104" width="4" height="4"/>
                            <rect x="88" y="104" width="4" height="4"/>
                            <rect x="96" y="104" width="4" height="4"/>
                            <rect x="104" y="104" width="4" height="4"/>
                            
                            {/* Bottom rows */}
                            <rect x="36" y="112" width="4" height="4"/>
                            <rect x="44" y="112" width="4" height="4"/>
                            <rect x="48" y="112" width="4" height="4"/>
                            <rect x="56" y="112" width="4" height="4"/>
                            <rect x="64" y="112" width="4" height="4"/>
                            <rect x="68" y="112" width="4" height="4"/>
                            <rect x="76" y="112" width="4" height="4"/>
                            <rect x="80" y="112" width="4" height="4"/>
                            <rect x="88" y="112" width="4" height="4"/>
                            <rect x="92" y="112" width="4" height="4"/>
                            <rect x="100" y="112" width="4" height="4"/>
                            <rect x="104" y="112" width="4" height="4"/>
                            <rect x="112" y="112" width="4" height="4"/>
                            <rect x="116" y="112" width="4" height="4"/>
                            <rect x="124" y="112" width="4" height="4"/>
                            <rect x="128" y="112" width="4" height="4"/>
                            <rect x="136" y="112" width="4" height="4"/>
                            
                            <rect x="36" y="116" width="4" height="4"/>
                            <rect x="40" y="116" width="4" height="4"/>
                            <rect x="48" y="116" width="4" height="4"/>
                            <rect x="52" y="116" width="4" height="4"/>
                            <rect x="60" y="116" width="4" height="4"/>
                            <rect x="64" y="116" width="4" height="4"/>
                            <rect x="72" y="116" width="4" height="4"/>
                            <rect x="76" y="116" width="4" height="4"/>
                            <rect x="84" y="116" width="4" height="4"/>
                            <rect x="88" y="116" width="4" height="4"/>
                            <rect x="96" y="116" width="4" height="4"/>
                            <rect x="100" y="116" width="4" height="4"/>
                            <rect x="108" y="116" width="4" height="4"/>
                            <rect x="112" y="116" width="4" height="4"/>
                            <rect x="120" y="116" width="4" height="4"/>
                            <rect x="124" y="116" width="4" height="4"/>
                            <rect x="132" y="116" width="4" height="4"/>
                            <rect x="136" y="116" width="4" height="4"/>
                            
                            <rect x="36" y="120" width="4" height="4"/>
                            <rect x="44" y="120" width="4" height="4"/>
                            <rect x="48" y="120" width="4" height="4"/>
                            <rect x="52" y="120" width="4" height="4"/>
                            <rect x="60" y="120" width="4" height="4"/>
                            <rect x="68" y="120" width="4" height="4"/>
                            <rect x="72" y="120" width="4" height="4"/>
                            <rect x="76" y="120" width="4" height="4"/>
                            <rect x="84" y="120" width="4" height="4"/>
                            <rect x="92" y="120" width="4" height="4"/>
                            <rect x="96" y="120" width="4" height="4"/>
                            <rect x="100" y="120" width="4" height="4"/>
                            <rect x="108" y="120" width="4" height="4"/>
                            <rect x="116" y="120" width="4" height="4"/>
                            <rect x="120" y="120" width="4" height="4"/>
                            <rect x="128" y="120" width="4" height="4"/>
                            <rect x="132" y="120" width="4" height="4"/>
                            
                            <rect x="40" y="124" width="4" height="4"/>
                            <rect x="44" y="124" width="4" height="4"/>
                            <rect x="52" y="124" width="4" height="4"/>
                            <rect x="56" y="124" width="4" height="4"/>
                            <rect x="64" y="124" width="4" height="4"/>
                            <rect x="68" y="124" width="4" height="4"/>
                            <rect x="76" y="124" width="4" height="4"/>
                            <rect x="80" y="124" width="4" height="4"/>
                            <rect x="88" y="124" width="4" height="4"/>
                            <rect x="92" y="124" width="4" height="4"/>
                            <rect x="100" y="124" width="4" height="4"/>
                            <rect x="104" y="124" width="4" height="4"/>
                            <rect x="112" y="124" width="4" height="4"/>
                            <rect x="116" y="124" width="4" height="4"/>
                            <rect x="124" y="124" width="4" height="4"/>
                            <rect x="128" y="124" width="4" height="4"/>
                            <rect x="136" y="124" width="4" height="4"/>
                            
                            <rect x="36" y="128" width="4" height="4"/>
                            <rect x="40" y="128" width="4" height="4"/>
                            <rect x="48" y="128" width="4" height="4"/>
                            <rect x="56" y="128" width="4" height="4"/>
                            <rect x="60" y="128" width="4" height="4"/>
                            <rect x="68" y="128" width="4" height="4"/>
                            <rect x="72" y="128" width="4" height="4"/>
                            <rect x="80" y="128" width="4" height="4"/>
                            <rect x="84" y="128" width="4" height="4"/>
                            <rect x="92" y="128" width="4" height="4"/>
                            <rect x="96" y="128" width="4" height="4"/>
                            <rect x="104" y="128" width="4" height="4"/>
                            <rect x="108" y="128" width="4" height="4"/>
                            <rect x="116" y="128" width="4" height="4"/>
                            <rect x="120" y="128" width="4" height="4"/>
                            <rect x="128" y="128" width="4" height="4"/>
                            <rect x="132" y="128" width="4" height="4"/>
                            
                            <rect x="36" y="132" width="4" height="4"/>
                            <rect x="44" y="132" width="4" height="4"/>
                            <rect x="48" y="132" width="4" height="4"/>
                            <rect x="52" y="132" width="4" height="4"/>
                            <rect x="60" y="132" width="4" height="4"/>
                            <rect x="68" y="132" width="4" height="4"/>
                            <rect x="72" y="132" width="4" height="4"/>
                            <rect x="76" y="132" width="4" height="4"/>
                            <rect x="84" y="132" width="4" height="4"/>
                            <rect x="92" y="132" width="4" height="4"/>
                            <rect x="96" y="132" width="4" height="4"/>
                            <rect x="100" y="132" width="4" height="4"/>
                            <rect x="108" y="132" width="4" height="4"/>
                            <rect x="116" y="132" width="4" height="4"/>
                            <rect x="120" y="132" width="4" height="4"/>
                            <rect x="124" y="132" width="4" height="4"/>
                            <rect x="132" y="132" width="4" height="4"/>
                            <rect x="136" y="132" width="4" height="4"/>
                            
                            <rect x="40" y="136" width="4" height="4"/>
                            <rect x="44" y="136" width="4" height="4"/>
                            <rect x="52" y="136" width="4" height="4"/>
                            <rect x="56" y="136" width="4" height="4"/>
                            <rect x="64" y="136" width="4" height="4"/>
                            <rect x="68" y="136" width="4" height="4"/>
                            <rect x="76" y="136" width="4" height="4"/>
                            <rect x="80" y="136" width="4" height="4"/>
                            <rect x="88" y="136" width="4" height="4"/>
                            <rect x="92" y="136" width="4" height="4"/>
                            <rect x="100" y="136" width="4" height="4"/>
                            <rect x="104" y="136" width="4" height="4"/>
                            <rect x="112" y="136" width="4" height="4"/>
                            <rect x="116" y="136" width="4" height="4"/>
                            <rect x="124" y="136" width="4" height="4"/>
                            <rect x="128" y="136" width="4" height="4"/>
                            <rect x="136" y="136" width="4" height="4"/>
                          </g>
                        </svg>
                      </div>
                    ) : (
                      <i className="fas fa-qrcode" style={{ fontSize: '80px', color: '#666' }}></i>
                    )}
                  </div>
                  <p style={{
                    fontSize: '13px',
                    textAlign: 'center',
                    color: '#666',
                    margin: '0',
                    lineHeight: '1.5',
                    padding: '0 10px'
                  }}>
                    {isProcessing ? (
                      <span style={{ color: '#007bff', fontWeight: '500' }}>
                        Hệ thống đang xử lý đơn hàng của bạn, vui lòng chờ trong giây lát...
                      </span>
                    ) : showPaymentLink ? (
                      <span style={{ color: '#28a745', fontWeight: '500', fontStyle: 'italic' }}>
                        Click vào liên kết(url) bên trên để thanh toán.
                      </span>
                    ) : showQRCode ? (
                      <span style={{ color: '#666', fontWeight: '400', fontSize: '12px' }}>
                        Nếu không quét được mã vạch bạn có thể click chuột phải vào mã QR để tải ảnh về
                      </span>
                    ) : (
                      'Thông tin thanh toán sẽ tự động hiện thị sau khi điệy sản phẩm có kết quả'
                    )}
                  </p>
                  {isProcessing && (
                    <p style={{
                      fontSize: '12px',
                      textAlign: 'center',
                      color: '#007bff',
                      margin: '8px 0 0 0',
                      fontWeight: '500'
                    }}>
                      <i className="fas fa-clock" style={{ marginRight: '5px' }}></i>
                      {countdown}s
                    </p>
                  )}
                </div>
              </div>

              {/* Table Section */}
              <div style={{ marginTop: '20px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <h5 style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#333',
                    margin: '0'
                  }}>
                    THÔNG BÁO PHÍ TRONG ĐƠN HÀNG
                  </h5>
                  <button
                    onClick={handleSelectFee}
                    disabled={donHangId !== null}
                    style={{
                      backgroundColor: donHangId !== null ? '#9ca3af' : '#007bff',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      fontSize: '13px',
                      cursor: donHangId !== null ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontWeight: '500',
                      opacity: donHangId !== null ? 0.6 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (donHangId === null) {
                        e.currentTarget.style.backgroundColor = '#0056b3'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (donHangId === null) {
                        e.currentTarget.style.backgroundColor = '#007bff'
                      }
                    }}
                  >
                    <i className="fas fa-plus" style={{ fontSize: '12px' }}></i>
                    Chọn thông báo phí
                  </button>
                </div>
                
                <div style={{
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#e3f2fd' }}>
                      <tr>
                        <th style={{
                          padding: '10px',
                          textAlign: 'center',
                          borderRight: '1px solid #ddd',
                          fontSize: '14px',
                          fontWeight: 'bold'
                        }}>STT</th>
                        <th style={{
                          padding: '10px',
                          textAlign: 'center',
                          borderRight: '1px solid #ddd',
                          fontSize: '14px',
                          fontWeight: 'bold'
                        }}>#</th>
                        <th style={{
                          padding: '10px',
                          textAlign: 'center',
                          borderRight: '1px solid #ddd',
                          fontSize: '14px',
                          fontWeight: 'bold'
                        }}>Số thông báo</th>
                        <th style={{
                          padding: '10px',
                          textAlign: 'center',
                          borderRight: '1px solid #ddd',
                          fontSize: '14px',
                          fontWeight: 'bold'
                        }}>Ngày thông báo</th>
                        <th style={{
                          padding: '10px',
                          textAlign: 'center',
                          fontSize: '14px',
                          fontWeight: 'bold'
                        }}>Thành tiền</th>
                      </tr>
                    </thead>
                                      <tbody>
                    {feeTableCurrentItems.length > 0 ? (
                      feeTableCurrentItems.map((fee, index) => (
                        <tr key={fee.id} style={{
                          backgroundColor: index % 2 === 0 ? '#f8f9fa' : '#ffffff'
                        }}>
                          <td style={{
                            padding: '8px',
                            textAlign: 'center',
                            borderRight: '1px solid #ddd',
                            fontSize: '14px'
                          }}>{feeTableIndexOfFirstItem + index + 1}</td>
                          <td style={{
                            padding: '8px',
                            textAlign: 'center',
                            borderRight: '1px solid #ddd',
                            fontSize: '14px'
                          }}>
                            <button
                              onClick={() => handleRemoveFee(fee.id)}
                              style={{
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '3px',
                                padding: '2px 6px',
                                fontSize: '12px',
                                cursor: 'pointer'
                              }}
                              title="Xóa"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </td>
                          <td style={{
                            padding: '8px',
                            textAlign: 'center',
                            borderRight: '1px solid #ddd',
                            fontSize: '14px'
                          }}>{fee.soThongBao}</td>
                          <td style={{
                            padding: '8px',
                            textAlign: 'center',
                            borderRight: '1px solid #ddd',
                            fontSize: '14px'
                          }}>{fee.ngayThongBao}</td>
                          <td style={{
                            padding: '8px',
                            textAlign: 'right',
                            fontSize: '14px'
                          }}>{fee.thanhTien.toLocaleString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} style={{
                          padding: '40px',
                          textAlign: 'center',
                          color: '#666',
                          fontStyle: 'italic'
                        }}>
                          Chưa có dữ liệu
                        </td>
                      </tr>
                    )}
                  </tbody>
                  </table>
                </div>
                
                {/* Pagination for fee table */}
                {selectedFeeNotifications.length > feeTableItemsPerPage && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '10px',
                    marginTop: '15px'
                  }}>
                    <button
                      onClick={() => handleFeeTablePageChange(feeTableCurrentPage - 1)}
                      disabled={feeTableCurrentPage === 1}
                      style={{
                        padding: '6px 12px',
                        border: '1px solid #ddd',
                        backgroundColor: feeTableCurrentPage === 1 ? '#f8f9fa' : 'white',
                        cursor: feeTableCurrentPage === 1 ? 'not-allowed' : 'pointer',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    >
                      &laquo; Trước
                    </button>

                    {Array.from({ length: feeTableTotalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => handleFeeTablePageChange(page)}
                        style={{
                          padding: '6px 12px',
                          border: '1px solid #ddd',
                          backgroundColor: page === feeTableCurrentPage ? '#007bff' : 'white',
                          color: page === feeTableCurrentPage ? 'white' : '#333',
                          cursor: 'pointer',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => handleFeeTablePageChange(feeTableCurrentPage + 1)}
                      disabled={feeTableCurrentPage === feeTableTotalPages}
                      style={{
                        padding: '6px 12px',
                        border: '1px solid #ddd',
                        backgroundColor: feeTableCurrentPage === feeTableTotalPages ? '#f8f9fa' : 'white',
                        cursor: feeTableCurrentPage === feeTableTotalPages ? 'not-allowed' : 'pointer',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    >
                      Sau &raquo;
                    </button>
                  </div>
                )}

                {/* Total amount and digital signature section - Only show when "Lưu lại" is clicked */}
                {showTotal && selectedFeeNotifications.length > 0 && (
                  <div style={{ marginTop: '15px' }}>
                    {/* Digital signature button on left and total on right */}
                    <div style={{
                      display: 'flex',
                      justifyContent: isProcessing ? 'flex-end' : 'space-between',
                      alignItems: 'center',
                      gap: '20px'
                    }}>
                      {/* Digital signature button - Hide when processing */}
                      {!isProcessing && !isOrderSigned && (
                        <button
                          style={{
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '4px',
                            fontSize: '14px',
                            cursor: 'pointer',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#0056b3'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#007bff'
                          }}
                          onClick={handleDigitalSignature}
                        >
                          <i className="fas fa-signature" style={{ fontSize: '16px' }}></i>
                          Ký số để xác nhận thanh toán đơn hàng
                        </button>
                      )}

                      {/* Total amount */}
                      <div style={{
                        padding: '10px 15px',
                        backgroundColor: '#e8f5e8',
                        borderRadius: '4px',
                        border: '1px solid #ddd'
                      }}>
                        <span style={{
                          fontSize: '16px',
                          fontWeight: 'bold',
                          color: '#28a745'
                        }}>
                          Tổng cộng: {selectedFeeNotifications.reduce((total, fee) => total + fee.thanhTien, 0).toLocaleString()} VNĐ
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              padding: '16px 20px',
              borderTop: '1px solid #dee2e6',
              backgroundColor: '#f8f9fa'
            }}>
              {!isProcessing && !isOrderSigned && (
                <button
                  onClick={handleFormSubmit}
                  style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    padding: '8px 20px',
                    borderRadius: '4px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#0056b3'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#007bff'
                  }}
                >
                  Lưu lại
                </button>
              )}
              <button
                onClick={handleCloseModal}
                style={{
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '8px 20px',
                  borderRadius: '4px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#5a6268'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#6c757d'
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Select Fee Modal */}
      {showSelectFeeModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1001
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            width: '1200px',
            maxWidth: '95vw',
            maxHeight: '95vh',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            position: 'relative',
            overflow: 'auto'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderBottom: '1px solid #dee2e6',
              backgroundColor: '#e3f2fd'
            }}>
              <h4 style={{
                margin: '0',
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#333'
              }}>
                <i className="fas fa-info-circle" style={{ marginRight: '8px', color: '#007bff' }}></i>
                Danh Sách Thông Báo Nộp Phí Chưa Thanh Toán
              </h4>
              <button
                onClick={handleCloseFeeModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#666',
                  padding: '4px'
                }}
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '20px' }}>
              {/* Subtitle and Filter Section in one row */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                {/* Subtitle */}
                <p style={{
                  fontSize: '14px',
                  color: '#666',
                  fontStyle: 'italic',
                  margin: '0'
                }}>
                  (Chọn các thông báo phí bên dưới)
                </p>

                {/* Filter Section */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  flexWrap: 'wrap'
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '500', minWidth: '60px' }}>Từ ngày:</label>
                  <input
                    type="date"
                    value={feeFromDate}
                    onChange={(e) => setFeeFromDate(e.target.value)}
                    style={{
                      padding: '6px 10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '500', minWidth: '60px' }}>Đến ngày:</label>
                  <input
                    type="date"
                    value={feeToDate}
                    onChange={(e) => setFeeToDate(e.target.value)}
                    style={{
                      padding: '6px 10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '500', minWidth: '80px' }}>Số thông báo:</label>
                  <input
                    type="text"
                    value={feeNotificationNumber}
                    onChange={(e) => setFeeNotificationNumber(e.target.value)}
                    placeholder="Nhập số thông báo"
                    style={{
                      padding: '6px 10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      width: '150px'
                    }}
                  />
                </div>

                  <button
                    onClick={handleFeeSearch}
                    style={{
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      padding: '6px 15px',
                      borderRadius: '4px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontWeight: '500'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#0056b3'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#007bff'
                    }}
                  >
                    <i className="fas fa-search" style={{ fontSize: '12px' }}></i>
                    Tìm kiếm
                  </button>
                </div>
              </div>

              {/* Table */}
              <div style={{
                border: '1px solid #ddd',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: '#e3f2fd' }}>
                    <tr>
                      <th style={{
                        padding: '12px 8px',
                        textAlign: 'center',
                        borderRight: '1px solid #ddd',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        width: '50px'
                      }}>STT</th>
                      <th style={{
                        padding: '12px 8px',
                        textAlign: 'center',
                        borderRight: '1px solid #ddd',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        width: '40px'
                      }}>
                        <input
                          type="checkbox"
                          checked={selectedFees.length === filteredFeeNotifications.length && filteredFeeNotifications.length > 0}
                          onChange={handleSelectAllFees}
                          style={{ cursor: 'pointer' }}
                        />
                      </th>
                      <th style={{
                        padding: '12px 8px',
                        textAlign: 'center',
                        borderRight: '1px solid #ddd',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}>Số tờ khai</th>
                      <th style={{
                        padding: '12px 8px',
                        textAlign: 'center',
                        borderRight: '1px solid #ddd',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}>Ngày tờ khai</th>
                      <th style={{
                        padding: '12px 8px',
                        textAlign: 'center',
                        borderRight: '1px solid #ddd',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}>Số thông báo</th>
                      <th style={{
                        padding: '12px 8px',
                        textAlign: 'center',
                        borderRight: '1px solid #ddd',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}>Ngày thông báo</th>
                      <th style={{
                        padding: '12px 8px',
                        textAlign: 'center',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFeeNotifications.length > 0 ? (
                      filteredFeeNotifications.map((fee, index) => (
                        <tr key={fee.id} style={{
                          backgroundColor: index % 2 === 0 ? '#f8f9fa' : '#ffffff'
                        }}>
                          <td style={{
                            padding: '10px 8px',
                            textAlign: 'center',
                            borderRight: '1px solid #ddd',
                            fontSize: '14px'
                          }}>{index + 1}</td>
                          <td style={{
                            padding: '10px 8px',
                            textAlign: 'center',
                            borderRight: '1px solid #ddd'
                          }}>
                            <input
                              type="checkbox"
                              checked={selectedFees.includes(fee.id)}
                              onChange={() => handleFeeCheckboxChange(fee.id)}
                              style={{ cursor: 'pointer' }}
                            />
                          </td>
                          <td style={{
                            padding: '10px 8px',
                            textAlign: 'center',
                            borderRight: '1px solid #ddd',
                            fontSize: '14px'
                          }}>{fee.soToKhai}</td>
                          <td style={{
                            padding: '10px 8px',
                            textAlign: 'center',
                            borderRight: '1px solid #ddd',
                            fontSize: '14px'
                          }}>{fee.ngayToKhai}</td>
                          <td style={{
                            padding: '10px 8px',
                            textAlign: 'center',
                            borderRight: '1px solid #ddd',
                            fontSize: '14px'
                          }}>{fee.soThongBao}</td>
                          <td style={{
                            padding: '10px 8px',
                            textAlign: 'center',
                            borderRight: '1px solid #ddd',
                            fontSize: '14px'
                          }}>{fee.ngayThongBao}</td>
                          <td style={{
                            padding: '10px 8px',
                            textAlign: 'right',
                            fontSize: '14px'
                          }}>{fee.thanhTien.toLocaleString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} style={{
                          padding: '40px',
                          textAlign: 'center',
                          color: '#666',
                          fontStyle: 'italic'
                        }}>
                          Không tìm thấy thông báo phí nào phù hợp với điều kiện lọc
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              padding: '16px 20px',
              borderTop: '1px solid #dee2e6',
              backgroundColor: '#f8f9fa'
            }}>
              <button
                onClick={handleConfirmSelectedFees}
                disabled={selectedFees.length === 0}
                style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '8px 20px',
                  borderRadius: '4px',
                  fontSize: '14px',
                  cursor: selectedFees.length > 0 ? 'pointer' : 'not-allowed',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  opacity: selectedFees.length > 0 ? 1 : 0.6
                }}
                onMouseEnter={(e) => {
                  if (selectedFees.length > 0) {
                    e.currentTarget.style.backgroundColor = '#0056b3'
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedFees.length > 0) {
                    e.currentTarget.style.backgroundColor = '#007bff'
                  }
                }}
              >
                <i className="fas fa-check"></i>
                Lấy các thông báo phí đang chọn
              </button>
              <button
                onClick={handleCloseFeeModal}
                style={{
                  backgroundColor: 'white',
                  color: '#333',
                  border: '1px solid #ddd',
                  padding: '8px 20px',
                  borderRadius: '4px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8f9fa'
                  e.currentTarget.style.borderColor = '#adb5bd'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white'
                  e.currentTarget.style.borderColor = '#ddd'
                }}
              >
                <i className="fas fa-times"></i>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderDetailsModal && selectedOrderDetails && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '24px',
            maxWidth: '800px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              paddingBottom: '12px',
              borderBottom: '2px solid #e3f2fd'
            }}>
              <h2 style={{
                margin: 0,
                color: '#1976d2',
                fontSize: '20px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <i className="fas fa-eye" style={{ color: '#1976d2' }}></i>
                Thông tin chi tiết đơn hàng
              </h2>
              <button
                onClick={handleCloseOrderDetailsModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '18px',
                  color: '#666',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '4px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                  e.currentTarget.style.color = '#333';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#666';
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Modal Content */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '20px',
              marginBottom: '20px'
            }}>
              {/* Column 1 */}
              <div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    color: '#333',
                    marginBottom: '6px',
                    minHeight: '20px'
                  }}>ID Đơn hàng:</label>
                  <div style={{
                    padding: '10px 12px',
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: '#495057',
                    minHeight: '42px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    {selectedOrderDetails.id}
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    color: '#333',
                    marginBottom: '6px',
                    minHeight: '20px'
                  }}>Số đơn hàng:</label>
                  <div style={{
                    padding: '10px 12px',
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: '#495057',
                    minHeight: '42px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    {selectedOrderDetails.soDonHang}
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    color: '#333',
                    marginBottom: '6px',
                    minHeight: '20px'
                  }}>Ngày đơn hàng:</label>
                  <div style={{
                    padding: '10px 12px',
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: '#495057',
                    minHeight: '42px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    {formatDate(selectedOrderDetails.ngayDonHang)}
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    color: '#333',
                    marginBottom: '6px',
                    minHeight: '20px'
                  }}>Loại thanh toán:</label>
                  <div style={{
                    padding: '10px 12px',
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: '#495057',
                    minHeight: '42px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    {selectedOrderDetails.loaiThanhToan}
                  </div>
                </div>
              </div>

              {/* Column 2 */}
              <div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    color: '#333',
                    marginBottom: '6px',
                    minHeight: '20px'
                  }}>Doanh nghiệp:</label>
                  <div style={{
                    padding: '10px 12px',
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: '#495057',
                    minHeight: '42px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    {selectedOrderDetails.tenDn || selectedOrderDetails.doanhNghiep}
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    color: '#333',
                    marginBottom: '6px',
                    minHeight: '20px'
                  }}>Ngân hàng:</label>
                  <div style={{
                    padding: '10px 12px',
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: '#495057',
                    minHeight: '42px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    {selectedOrderDetails.nganHang}
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    color: '#333',
                    marginBottom: '6px',
                    minHeight: '20px'
                  }}>Người tạo:</label>
                  <div style={{
                    padding: '10px 12px',
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: '#495057',
                    minHeight: '42px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    {selectedOrderDetails.nguoiTao || 'System'}
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    color: '#333',
                    marginBottom: '6px',
                    minHeight: '20px'
                  }}>Ngày tạo:</label>
                  <div style={{
                    padding: '10px 12px',
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: '#495057',
                    minHeight: '42px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    {formatDate(selectedOrderDetails.ngayTao)}
                  </div>
                </div>
              </div>

              {/* Column 3 */}
              <div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    color: '#333',
                    marginBottom: '6px',
                    minHeight: '20px'
                  }}>Tổng tiền:</label>
                  <div style={{
                    padding: '10px 12px',
                    backgroundColor: '#e8f5e8',
                    border: '1px solid #c8e6c9',
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: '#2e7d32',
                    fontWeight: 'bold',
                    minHeight: '42px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    {formatCurrency(selectedOrderDetails.tongTien)}
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    color: '#333',
                    marginBottom: '6px',
                    minHeight: '20px'
                  }}>Trạng thái:</label>
                  <div style={{
                    padding: '10px 12px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    minHeight: '42px',
                    display: 'flex',
                    alignItems: 'center',
                    whiteSpace: 'nowrap',
                    ...getStatusStyle(selectedOrderDetails.trangThai)
                  }}>
                    {getStatusText(selectedOrderDetails.trangThai)}
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    color: '#333',
                    marginBottom: '6px',
                    minHeight: '20px'
                  }}>Ngày sửa:</label>
                  <div style={{
                    padding: '10px 12px',
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: '#495057',
                    minHeight: '42px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    {selectedOrderDetails.ngaySua ? formatDate(selectedOrderDetails.ngaySua) : 'Chưa sửa'}
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    color: '#333',
                    marginBottom: '6px',
                    minHeight: '20px'
                  }}>Mô tả:</label>
                  <div style={{
                    padding: '10px 12px',
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: '#495057',
                    minHeight: '42px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    {selectedOrderDetails.moTa || 'Không có'}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              paddingTop: '16px',
              borderTop: '1px solid #e3f2fd'
            }}>
              <button
                onClick={handleCloseOrderDetailsModal}
                style={{
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#5a6268';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#6c757d';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <i className="fas fa-times"></i>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default QROrderPage
