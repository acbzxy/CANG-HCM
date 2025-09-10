import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FeeDeclarationService, type FeeDeclarationSearchParams } from '../utils/feeDeclarationApi';
import { useNotification } from '../context/NotificationContext';
import { debugLog, debugError, isDebugMode } from '../debug';
import type { FeeDeclaration } from '../types';

// Local interface for display purposes (legacy)
interface FeeDeclarationDisplay {
  id: string;
  kyso: string;
  hash1: string;
  tkNopPhi: string;
  ngayTKNP: string;
  loaiToKhai: string;
  tkHaiQuan: string;
  doanhNghiep: string;
  trangThai: string;
  hanhDong: string;
  thongBao: string;
  hash2: string;
  tongTien: number;
}

// Helper function to get status text
const getStatusText = (status: string): string => {
  switch (status) {
    case 'DRAFT': return 'Mới';
    case 'SUBMITTED': return 'Đã nộp';
    case 'APPROVED': return 'Đã duyệt';
    case 'REJECTED': return 'Bị từ chối';
    case 'CANCELLED': return 'Đã hủy';
    default: return status;
  }
}

// Helper function to determine display status based on trangThaiPhatHanh
const getDisplayStatus = (item: FeeDeclaration): string => {
  console.log(`Status debug for ID ${item.id}:`, {
    trangThaiPhatHanh: item.trangThaiPhatHanh,
    declarationStatus: item.declarationStatus,
    paymentStatus: item.paymentStatus,
    declarationNumber: item.declarationNumber
  });
  
  // Use trangThaiPhatHanh to determine status
  let displayStatus: string;
  switch (item.trangThaiPhatHanh) {
    case '02': 
      displayStatus = 'Phát hành'; 
      break;
    case '01': 
      displayStatus = 'Bản nháp'; 
      break;
    case '03': 
      displayStatus = 'Đã hủy'; 
      break;
    case '00': 
    default: 
      displayStatus = 'Mới'; 
      break;
  }
  
  console.log(`ID ${item.id}: Showing "${displayStatus}" (trangThaiPhatHanh: ${item.trangThaiPhatHanh})`);
  return displayStatus;
};

const FeeDeclarationManagePage: React.FC = () => {
  const navigate = useNavigate();
  const { showError, showSuccess } = useNotification();
  
  // States for filters
  const [fromDate, setFromDate] = useState('2021-04-06');
  const [toDate, setToDate] = useState('2021-08-21');
  const [loaiToKhai, setLoaiToKhai] = useState('');
  const [thanhToan, setThanhToan] = useState('');
  const [nguoiTao, setNguoiTao] = useState('');
  const [trangThaiTo, setTrangThaiTo] = useState('');
  const [nhomBieuPhi, setNhomBieuPhi] = useState('');

  // State for detail modal
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FeeDeclarationDisplay | null>(null);

  // State for notification modal
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [selectedNotificationItem, setSelectedNotificationItem] = useState<FeeDeclarationDisplay | null>(null);

  // State for download success modal
  const [showDownloadSuccessModal, setShowDownloadSuccessModal] = useState(false);

  // State for loading and pagination
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Load fee declarations on component mount and when filters change
  useEffect(() => {
    debugLog('Component mounted, loading fee declarations');
    loadFeeDeclarations();
  }, [currentPage, pageSize]);

  // Effect to check for status updates from localStorage
  useEffect(() => {
    const checkForUpdates = () => {
      // Check for old format updates
      const updateStatusData = localStorage.getItem('updateFeeDeclarationStatus');
      if (updateStatusData) {
        try {
          const updateInfo = JSON.parse(updateStatusData);
          
          // Cập nhật trạng thái của item tương ứng
          setFeeDeclarations(prev => 
            prev.map(item => 
              item.id === updateInfo.id 
                ? { ...item, trangThai: updateInfo.newStatus }
                : item
            )
          );
          
          // Xóa thông tin update khỏi localStorage
          localStorage.removeItem('updateFeeDeclarationStatus');
          
          // Hiển thị thông báo thành công
          alert('Cập nhật trạng thái thành công: ' + updateInfo.newStatus);
        } catch (error) {
          console.error('Error updating fee declaration status:', error);
        }
      }

      // Check for receipt creation updates
      const receiptUpdateData = localStorage.getItem('feeDeclarationUpdated');
      if (receiptUpdateData) {
        try {
          const updateInfo = JSON.parse(receiptUpdateData);
          console.log('Receipt creation update detected:', updateInfo);
          
          // Reload data to get fresh status from backend
          loadFeeDeclarations();
          
          // Clear the update flag
          localStorage.removeItem('feeDeclarationUpdated');
          
          console.log('Fee declaration data reloaded after receipt creation');
        } catch (error) {
          console.error('Error processing receipt update:', error);
        }
      }
    };

    // Check immediately
    checkForUpdates();
    
    // Listen for storage events (cross-tab updates)
    window.addEventListener('storage', checkForUpdates);
    
    // Listen for focus events (when returning to tab)
    window.addEventListener('focus', checkForUpdates);

    return () => {
      window.removeEventListener('storage', checkForUpdates);
      window.removeEventListener('focus', checkForUpdates);
    };
  }, []);

  // Fee declarations data
  const [feeDeclarations, setFeeDeclarations] = useState<FeeDeclaration[]>([]);
  const [displayDeclarations, setDisplayDeclarations] = useState<FeeDeclarationDisplay[]>([]);

  // Load fee declarations from API
  const loadFeeDeclarations = async () => {
    try {
      setLoading(true);
      console.log('Loading fee declarations...');
      
      const searchParams: FeeDeclarationSearchParams = {
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        // Map frontend parameters to backend parameters
        declarationStatus: trangThaiTo || undefined,
        paymentStatus: thanhToan || undefined,
        // Legacy parameters for backward compatibility
        feeType: loaiToKhai || undefined,
        paymentMethod: thanhToan || undefined,
        createdBy: nguoiTao || undefined,
        status: trangThaiTo || undefined,
        feeGroupCode: nhomBieuPhi || undefined,
        page: currentPage,
        size: pageSize,
        sortBy: 'arrivalDate', // Use backend field name
        sortDir: 'desc'
      };

      console.log('Search params:', searchParams);

      // Try to call the real API first
      try {
        const response = await FeeDeclarationService.searchFeeDeclarations(searchParams);
        console.log('📡 API Response received 1:', response);
        
        // Backend returns PageResponse directly, not wrapped in ApiResponse
        if (response ) {
          console.log('✅ API data received:', response);
          console.log('📊 Content length:', response.content.length);
          const apiDeclarations = response.content || [];
          setFeeDeclarations(apiDeclarations);
          
          // Map backend data to display format
          const mappedData = apiDeclarations.map((item: FeeDeclaration, index: number) => ({
            id: String(item.id),
            kyso: String(index + 1),
            hash1: '',
            tkNopPhi: item.declarationNumber,
            ngayTKNP: new Date(item.arrivalDate).toLocaleDateString('vi-VN'),
            loaiToKhai: 'Tờ khai phí cảng',
            tkHaiQuan: item.voyageNumber || '',
            doanhNghiep: `${item.company.taxCode} - ${item.company.companyName}`,
            trangThai: getDisplayStatus(item),
            hanhDong: 'Xem chi tiết',
            thongBao: item.notes || 'Có thông báo',
            hash2: '',
            tongTien: Number(item.totalFeeAmount)
          }));

          console.log('🔄 Mapped data:', mappedData);
          setDisplayDeclarations(mappedData);
          setTotalElements(response.totalElements);
          setTotalPages(response.totalPages);
          console.log('✅ Data set successfully. Total elements:', response.totalElements);
          console.log('✅ displayDeclarations set to:', mappedData.length, 'items');
          showSuccess('Tải dữ liệu thành công từ API mới');
          return;
        } else {
          console.log('❌ No content in response');
          console.log('❌ Response structure:', response);
          setFeeDeclarations([]);
          setTotalElements(0);
          setTotalPages(0);
        }
      } catch (apiError) {
        console.error('💥 API call failed:', apiError);
        console.error('💥 Error message:', apiError.message);
        console.error('💥 Error stack:', apiError.stack);
        showError('Không thể kết nối đến server. Sử dụng dữ liệu demo.');
      }

      // Fallback to mock data
      console.log('Using mock data...');
      const mockResponse = await FeeDeclarationService.getAllFeeDeclarations();
      console.log('Mock response:', mockResponse);
      console.log('Mock response content:', mockResponse.content);
      
      if (mockResponse && mockResponse.content) {
        const apiDeclarations = mockResponse.content || [];
        console.log('Mock API declarations:', apiDeclarations);
        setFeeDeclarations(apiDeclarations);
        
        // Map mock data to display format
        console.log('Mapping mock data to display format...');
        const mappedData = apiDeclarations.map((item: FeeDeclaration, index: number) => ({
          id: String(item.id),
          kyso: String(index + 1),
          hash1: '',
          tkNopPhi: item.declarationNumber,
          ngayTKNP: new Date(item.arrivalDate).toLocaleDateString('vi-VN'),
          loaiToKhai: 'Tờ khai phí cảng',
          tkHaiQuan: item.voyageNumber || '',
          doanhNghiep: `${item.company.taxCode} - ${item.company.companyName}`,
          trangThai: getDisplayStatus(item),
          hanhDong: 'Xem chi tiết',
          thongBao: item.notes || 'Có thông báo',
          hash2: '',
          tongTien: Number(item.totalFeeAmount)
        }));
        
        console.log('🔄 Mapped mock data:', mappedData);
        setDisplayDeclarations(mappedData);
        setTotalElements(mockResponse.totalElements || mappedData.length);
        setTotalPages(mockResponse.totalPages || 1);
        console.log('✅ Mock data set successfully. Total elements:', mockResponse.totalElements || mappedData.length);
        console.log('✅ Mock displayDeclarations set to:', mappedData.length, 'items');
        showSuccess('Sử dụng dữ liệu demo');
      } else {
        showError('Không thể tải dữ liệu');
      }
    } catch (error) {
      console.error('💥 Error loading fee declarations:', error);
      console.error('💥 Error message:', error.message);
      console.error('💥 Error stack:', error.stack);
      showError('Có lỗi xảy ra khi tải dữ liệu: ' + (error as Error).message);
      
      // Set empty data if all fails
      setFeeDeclarations([]);
      setDisplayDeclarations([]);
      setTotalElements(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
      console.log('🔄 Loading finished, loading state set to false');
    }
  };

  // Calculate total amount
  const totalAmount = displayDeclarations.reduce((sum, item) => sum + item.tongTien, 0);
  console.log('🔄 Total amount calculated:', totalAmount);
  
  // Debug logging
  console.log('🔍 Component state:', {
    loading,
    feeDeclarationsLength: feeDeclarations.length,
    displayDeclarationsLength: displayDeclarations.length,
    totalElements,
    totalPages,
    currentPage
  });
  
  // Force re-render debug
  console.log('🔄 Component render - displayDeclarations:', displayDeclarations);
  console.log('🔄 Component render - displayDeclarations.length:', displayDeclarations.length);

  // Format currency
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN');
  };

  const handleSearch = () => {
    console.log('Searching with filters:', {
      fromDate,
      toDate,
      loaiToKhai,
      thanhToan,
      nguoiTao,
      trangThaiTo,
      nhomBieuPhi
    });
    // Reset to first page and reload data
    setCurrentPage(0);
    loadFeeDeclarations();
  };

  const handleViewDetail = (item: FeeDeclarationDisplay) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedItem(null);
  };

  const handleGetNotification = (item: FeeDeclarationDisplay) => {
    setSelectedNotificationItem(item);
    setShowNotificationModal(true);
  };

  const handleCloseNotificationModal = () => {
    setShowNotificationModal(false);
    setSelectedNotificationItem(null);
  };

  const handleDownloadNotification = () => {
    // Close the notification modal first
    setShowNotificationModal(false);
    setSelectedNotificationItem(null);
    
    // Show download success modal
    setShowDownloadSuccessModal(true);
  };

  const handleCloseDownloadSuccessModal = () => {
    setShowDownloadSuccessModal(false);
  };

  const handleCreateReceipt = (item: FeeDeclaration) => {
    console.log('Tạo biên lai cho:', item.id);
    console.log('FeeDeclaration data:', item);
    // Navigate to create receipt page with selectedItem
    navigate('/receipt-management/create', { state: { selectedItem: item } });
  };

  // Error boundary fallback
  const ErrorFallback = ({ error }: { error: Error }) => (
    <div style={{ 
      padding: '40px', 
      textAlign: 'center', 
      backgroundColor: '#f8f9fa', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        maxWidth: '500px'
      }}>
        <h2 style={{ color: '#dc3545', marginBottom: '20px' }}>
          <i className="fas fa-exclamation-triangle" style={{ marginRight: '10px' }}></i>
          Có lỗi xảy ra
        </h2>
        <p style={{ marginBottom: '20px', color: '#666' }}>
          Trang quản lý tờ khai phí gặp lỗi. Vui lòng thử lại sau.
        </p>
        <details style={{ marginBottom: '20px', textAlign: 'left' }}>
          <summary style={{ cursor: 'pointer', color: '#007bff' }}>Chi tiết lỗi</summary>
          <pre style={{ 
            marginTop: '10px', 
            padding: '10px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '4px',
            fontSize: '12px',
            overflow: 'auto'
          }}>
            {error.message}
          </pre>
        </details>
        <button
          onClick={() => window.location.reload()}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Tải lại trang
        </button>
      </div>
    </div>
  );

  // Render with error boundary
  if (window.location.search.includes('debug=error')) {
    throw new Error('Debug error for testing');
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Debug Info */}
      {isDebugMode() && (
        <div style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '4px',
          padding: '10px',
          marginBottom: '20px',
          fontSize: '12px',
          color: '#856404'
        }}>
          <strong>DEBUG MODE:</strong> 
          <span style={{ marginLeft: '10px' }}>
            Loading: {loading ? 'Yes' : 'No'} | 
            Data count: {feeDeclarations.length} | 
            Total: {totalElements} |
            Backend URL: {window.location.hostname === 'localhost' ? 'http://localhost:8080' : 'Production'}
          </span>
          <button 
            onClick={() => (window as any).debug.disableDebug()}
            style={{ 
              marginLeft: '10px', 
              fontSize: '10px', 
              padding: '2px 6px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '2px',
              cursor: 'pointer'
            }}
          >
            Tắt Debug
          </button>
        </div>
      )}
      
      {/* Page Title */}
      <div style={{ 
        marginBottom: '20px',
        fontSize: '14px',
        fontWeight: 'bold'
      }}>
        [ {totalElements} tờ khai phí ] - Trang: {currentPage + 1}/{totalPages || 1}
        {loading && <span style={{ marginLeft: '10px', color: '#007bff' }}>Đang tải...</span>}
      </div>

      {/* Filter Section */}
      <div style={{
        backgroundColor: 'white',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {/* Filter Row */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end',
          alignItems: 'end',
          gap: '10px', 
          marginBottom: '15px'
        }}>
          <div style={{ width: '130px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '500' }}>
              Ngày bắt đầu, Tới:
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '12px'
              }}
            />
          </div>
          
          <div style={{ width: '130px' }}>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '12px'
              }}
            />
          </div>

          <div style={{ width: '120px' }}>
            <select
              value={loaiToKhai}
              onChange={(e) => setLoaiToKhai(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '12px'
              }}
            >
              <option value="">-- Loại tờ khai --</option>
              <option value="100">100 - hàng container</option>
              <option value="101">101 - hàng đông lại</option>
            </select>
          </div>

          <div style={{ width: '110px' }}>
            <select
              value={thanhToan}
              onChange={(e) => setThanhToan(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '12px'
              }}
            >
              <option value="">-- Thanh toán --</option>
              <option value="da-thanh-toan">Đã thanh toán</option>
              <option value="chua-thanh-toan">Chưa thanh toán</option>
            </select>
          </div>

          <div style={{ width: '110px' }}>
            <select
              value={nguoiTao}
              onChange={(e) => setNguoiTao(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '12px'
              }}
            >
              <option value="">-- Người tạo --</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>

          <div style={{ width: '110px' }}>
            <select
              value={trangThaiTo}
              onChange={(e) => setTrangThaiTo(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '12px'
              }}
            >
              <option value="">-- Trạng thái tờ --</option>
              <option value="moi">Mới</option>
              <option value="ly-thong-bao">Lý thông báo</option>
              <option value="da-tao-bien-lai">Đã tạo biên lai thành công</option>
            </select>
          </div>

          <div style={{ width: '120px' }}>
            <select
              value={nhomBieuPhi}
              onChange={(e) => setNhomBieuPhi(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '12px'
              }}
            >
              <option value="">-- Nhóm biểu phí --</option>
              <option value="TP003">TP003</option>
              <option value="TP001">TP001</option>
              <option value="TP002">TP002</option>
            </select>
          </div>

          <div>
            <button
              onClick={handleSearch}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500'
              }}
            >
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
              <th style={{ padding: '12px 8px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', width: '80px' }}>
                Ký số
              </th>
              <th style={{ padding: '12px 8px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', width: '40px' }}>
                #
              </th>
              <th style={{ padding: '12px 8px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', width: '140px' }}>
                TK nộp phí
              </th>
              <th style={{ padding: '12px 8px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', width: '90px' }}>
                Ngày TK NP
              </th>
              <th style={{ padding: '12px 8px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', width: '150px' }}>
                Loại tờ khai
              </th>
              <th style={{ padding: '12px 8px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', width: '120px' }}>
                TK hải quan
              </th>
              <th style={{ padding: '12px 8px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                Doanh nghiệp
              </th>
              <th style={{ padding: '12px 8px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', width: '100px' }}>
                Trạng thái
              </th>
                             <th style={{ padding: '12px 8px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', width: '120px' }}>
                 Thông báo
               </th>
               <th style={{ padding: '12px 8px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', width: '100px' }}>
                 Hành động
               </th>
               <th style={{ padding: '12px 8px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', width: '120px' }}>
                 Tổng tiền(VNĐ)
               </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={11} style={{ 
                  padding: '40px', 
                  textAlign: 'center', 
                  fontSize: '14px', 
                  color: '#007bff' 
                }}>
                  <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : displayDeclarations.length === 0 ? (
              <tr>
                <td colSpan={11} style={{ 
                  padding: '40px', 
                  textAlign: 'center', 
                  fontSize: '14px', 
                  color: '#666' 
                }}>
                  Không có dữ liệu (Debug: displayDeclarations.length = {displayDeclarations.length})
                </td>
              </tr>
            ) : displayDeclarations.map((item, index) => {
              console.log(`🔄 Rendering item ${index}:`, item);
              return (
              <tr key={item.id} style={{ 
                borderBottom: '1px solid #eee',
                backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9'
              }}>
                <td style={{ padding: '8px', textAlign: 'center', fontSize: '12px' }}>
                  {item.kyso}
                </td>
                <td style={{ padding: '8px', textAlign: 'center', fontSize: '12px' }}>
                  <i 
                    className="fas fa-eye" 
                    style={{ 
                      color: '#007bff', 
                      cursor: 'pointer', 
                      fontSize: '14px',
                      padding: '4px'
                    }}
                    onClick={() => handleViewDetail(item)}
                    title="Xem chi tiết"
                  ></i>
                </td>
                <td style={{ padding: '8px', fontSize: '12px', color: '#0066cc' }}>
                  {item.tkNopPhi}
                </td>
                <td style={{ padding: '8px', textAlign: 'center', fontSize: '12px' }}>
                  {item.ngayTKNP}
                </td>
                <td style={{ padding: '8px', fontSize: '12px' }}>
                  {item.loaiToKhai}
                </td>
                <td style={{ padding: '8px', fontSize: '12px' }}>
                  {item.tkHaiQuan}
                </td>
                <td style={{ padding: '8px', fontSize: '12px' }}>
                  {item.doanhNghiep}
                </td>
                <td style={{ padding: '8px', textAlign: 'center', fontSize: '12px' }}>
                  {item.trangThai === 'Lý thông báo' ? (
                    <span style={{
                      backgroundColor: '#d4edda',
                      color: '#155724',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 'bold'
                    }}>
                      ✓ Lấy thông báo
                    </span>
                  ) : (
                    <span style={{
                      backgroundColor: '#f8d7da',
                      color: '#721c24',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 'bold'
                    }}>
                      {item.trangThai}
                    </span>
                  )}
                </td>
                <td style={{ padding: '8px', textAlign: 'center', fontSize: '12px' }}>
                  <button
                    style={{
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      margin: '0 auto',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#0056b3';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = '#007bff';
                    }}
                    onClick={() => handleGetNotification(item)}
                    title="Lấy thông báo"
                  >
                    <span style={{ fontSize: '10px', color: '#ffffff' }}>✓</span>
                    Lấy thông báo
                  </button>
                </td>
                                 <td style={{ padding: '8px', textAlign: 'center', fontSize: '12px' }}>
                   <button
                     style={{
                       backgroundColor: '#17a2b8',
                       color: 'white',
                       border: 'none',
                       padding: '6px 12px',
                       borderRadius: '4px',
                       cursor: 'pointer',
                       fontSize: '11px',
                       fontWeight: '500'
                     }}
                     onClick={() => {
                       // Find the corresponding FeeDeclaration object
                       const feeDeclaration = feeDeclarations.find(fd => String(fd.id) === item.id);
                       if (feeDeclaration) {
                         handleCreateReceipt(feeDeclaration);
                       } else {
                         console.error('Could not find FeeDeclaration for item:', item);
                       }
                     }}
                     title="Tạo biên lai"
                   >
                     Tạo biên lai
                   </button>
                 </td>
                <td style={{ padding: '8px', textAlign: 'right', fontSize: '12px', fontWeight: 'bold' }}>
                  {formatCurrency(item.tongTien)}
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer with Pagination */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '15px',
        padding: '10px 5px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Hiển thị {(currentPage * pageSize) + 1}-{Math.min((currentPage + 1) * pageSize, totalElements)} trong tổng số {totalElements} bản ghi
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <button
              onClick={() => {
                if (currentPage > 0) {
                  setCurrentPage(currentPage - 1);
                }
              }}
              disabled={currentPage === 0 || loading}
              style={{
                padding: '4px 8px',
                fontSize: '12px',
                border: '1px solid #ddd',
                backgroundColor: currentPage === 0 || loading ? '#f5f5f5' : 'white',
                cursor: currentPage === 0 || loading ? 'not-allowed' : 'pointer',
                borderRadius: '3px'
              }}
            >
              ‹ Trước
            </button>
            <span style={{ fontSize: '12px', padding: '0 8px' }}>
              Trang {currentPage + 1} / {totalPages || 1}
            </span>
            <button
              onClick={() => {
                if (currentPage < totalPages - 1) {
                  setCurrentPage(currentPage + 1);
                }
              }}
              disabled={currentPage >= totalPages - 1 || loading}
              style={{
                padding: '4px 8px',
                fontSize: '12px',
                border: '1px solid #ddd',
                backgroundColor: currentPage >= totalPages - 1 || loading ? '#f5f5f5' : 'white',
                cursor: currentPage >= totalPages - 1 || loading ? 'not-allowed' : 'pointer',
                borderRadius: '3px'
              }}
            >
              Sau ›
            </button>
          </div>
        </div>
        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#d32f2f' }}>
          Tổng tiền: {formatCurrency(totalAmount)} VNĐ
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedItem && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              borderBottom: '2px solid #007bff',
              paddingBottom: '10px'
            }}>
              <h3 style={{ margin: 0, color: '#007bff', fontSize: '18px' }}>
                Chi tiết tờ khai nộp phí
              </h3>
              <button
                onClick={handleCloseDetailModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ×
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '15px',
              fontSize: '14px'
            }}>
              <div>
                <strong>Ký số:</strong> {selectedItem.kyso}
              </div>
              <div>
                <strong>TK nộp phí:</strong> 
                <span style={{ color: '#0066cc', marginLeft: '5px' }}>{selectedItem.tkNopPhi}</span>
              </div>
              <div>
                <strong>Ngày TK NP:</strong> {selectedItem.ngayTKNP}
              </div>
              <div>
                <strong>Loại tờ khai:</strong> {selectedItem.loaiToKhai}
              </div>
              <div>
                <strong>TK hải quan:</strong> {selectedItem.tkHaiQuan}
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <strong>Doanh nghiệp:</strong> {selectedItem.doanhNghiep}
              </div>
              <div>
                <strong>Trạng thái:</strong> 
                <span style={{
                  marginLeft: '5px',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  backgroundColor: selectedItem.trangThai === 'Lý thông báo' ? '#d4edda' : '#f8d7da',
                  color: selectedItem.trangThai === 'Lý thông báo' ? '#155724' : '#721c24'
                }}>
                  {selectedItem.trangThai === 'Lý thông báo' ? '✓ Lý thông báo' : selectedItem.trangThai}
                </span>
              </div>
              <div>
                <strong>Thông báo:</strong>
                <button
                  style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: '500',
                    marginLeft: '8px',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#0056b3';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#007bff';
                  }}
                  onClick={() => handleGetNotification(selectedItem)}
                >
                  <span style={{ color: '#ffffff' }}>✓</span> Lấy thông báo
                </button>
              </div>
                             <div>
                 <strong>Hành động:</strong>
                 <button
                   style={{
                     backgroundColor: '#17a2b8',
                     color: 'white',
                     border: 'none',
                     padding: '4px 8px',
                     borderRadius: '4px',
                     cursor: 'pointer',
                     fontSize: '11px',
                     fontWeight: '500',
                     marginLeft: '8px'
                   }}
                   onClick={() => {
                     // Find the corresponding FeeDeclaration object
                     const feeDeclaration = feeDeclarations.find(fd => String(fd.id) === selectedItem.id);
                     if (feeDeclaration) {
                       handleCreateReceipt(feeDeclaration);
                     } else {
                       console.error('Could not find FeeDeclaration for selectedItem:', selectedItem);
                     }
                   }}
                 >
                   Tạo biên lai
                 </button>
               </div>
               <div>
                 <strong>Tổng tiền:</strong> 
                 <span style={{ color: '#d32f2f', fontWeight: 'bold', marginLeft: '5px' }}>
                   {formatCurrency(selectedItem.tongTien)} VNĐ
                 </span>
               </div>
            </div>

            <div style={{
              marginTop: '20px',
              textAlign: 'right',
              borderTop: '1px solid #eee',
              paddingTop: '15px'
            }}>
              <button
                onClick={handleCloseDetailModal}
                style={{
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {showNotificationModal && selectedNotificationItem && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1001,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            maxWidth: '900px',
            width: '95%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              borderBottom: '2px solid #007bff',
              paddingBottom: '10px'
            }}>
              <h3 style={{ margin: 0, color: '#007bff', fontSize: '18px' }}>
                Thông báo tờ khai nộp phí
              </h3>
              <button
                onClick={handleCloseNotificationModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ×
              </button>
            </div>

            {/* Info Row */}
            <div style={{
              display: 'flex',
              gap: '20px',
              marginBottom: '20px',
              fontSize: '13px',
              color: '#333'
            }}>
              <span>STK HQ: 1357487692765,</span>
              <span>STB nộp phí: 2149093142570,</span>
              <span>Nhóm loại hình: TP003 - Loại hình: A31</span>
            </div>

            {/* Company Info Section */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '30px', 
              marginBottom: '20px',
              fontSize: '13px'
            }}>
              {/* Left: Đơn vị nhập tờ khai nộp phí */}
              <div>
                <h4 style={{ 
                  margin: '0 0 15px 0', 
                  fontSize: '14px', 
                  fontWeight: 'bold',
                  color: '#333'
                }}>
                  Đơn vị nhập tờ khai nộp phí:
                </h4>
                <div style={{ marginBottom: '8px' }}>
                  <strong>Mã đơn vị:</strong> 0314308155
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <strong>Tên đơn vị:</strong> CÔNG TY TNHH DELVNETS VIETNAM
                </div>
                <div>
                  <strong>Địa chỉ:</strong> Tầng 5, Cao ốc Vạn Phúc Số 25 Nguyễn Thị Điều - Phường 06 - Quận 3 - TP Hồ Chí Minh
                </div>
              </div>

              {/* Right: Đơn vị xuất nhập khẩu (DNK) */}
              <div>
                <h4 style={{ 
                  margin: '0 0 15px 0', 
                  fontSize: '14px', 
                  fontWeight: 'bold',
                  color: '#333'
                }}>
                  Đơn vị xuất nhập khẩu (DNK):
                </h4>
                <div style={{ marginBottom: '8px' }}>
                  <strong>Mã đơn vị:</strong> 0314308155
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <strong>Tên đơn vị:</strong> CÔNG TY TNHH DELVNETS VIETNAM
                </div>
                <div>
                  <strong>Địa chỉ:</strong> Tầng 5, Cao ốc Vạn Phúc Số 25 Nguyễn Thị Điều - Phường 06 - Quận 3 - TP Hồ Chí Minh
                </div>
              </div>
            </div>

            {/* Fee Details Table */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ 
                margin: '0 0 15px 0', 
                fontSize: '14px', 
                fontWeight: 'bold',
                color: '#333'
              }}>
                Chi tiết nộp phí (Chuyển khoản):
              </h4>
              
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse', 
                fontSize: '12px',
                border: '1px solid #ddd'
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ 
                      border: '1px solid #ddd', 
                      padding: '10px', 
                      textAlign: 'center',
                      width: '60px'
                    }}>STT</th>
                    <th style={{ 
                      border: '1px solid #ddd', 
                      padding: '10px',
                      textAlign: 'left'
                    }}>Nội dung thu phí</th>
                    <th style={{ 
                      border: '1px solid #ddd', 
                      padding: '10px',
                      textAlign: 'center',
                      width: '80px'
                    }}>Mã DVT</th>
                    <th style={{ 
                      border: '1px solid #ddd', 
                      padding: '10px',
                      textAlign: 'center',
                      width: '120px'
                    }}>Số lượng/trong lượng</th>
                    <th style={{ 
                      border: '1px solid #ddd', 
                      padding: '10px',
                      textAlign: 'right',
                      width: '100px'
                    }}>Đơn giá</th>
                    <th style={{ 
                      border: '1px solid #ddd', 
                      padding: '10px',
                      textAlign: 'right',
                      width: '120px'
                    }}>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>1</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      Phí hỗ trợ nhập cảnh phi thuyền viên tờ khai (1355430545&4)
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>null</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>1</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>250,000</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>250,000</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>2</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      Container 40 feet
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>null</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>1</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>500,000</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>500,000</td>
                  </tr>
                  <tr style={{ backgroundColor: '#f8f9fa', fontWeight: 'bold' }}>
                    <td colSpan={4} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                      TỔNG SỐ:
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>2</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>750,000</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Note */}
            <div style={{ 
              fontSize: '11px', 
              color: '#666', 
              fontStyle: 'italic',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              Số tiền bằng chữ: Bảy trăm năm mươi nghìn đồng
            </div>

            {/* Footer Buttons */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              borderTop: '1px solid #eee',
              paddingTop: '15px'
            }}>
              <button
                style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#0056b3';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#007bff';
                }}
                onClick={handleDownloadNotification}
              >
                <span style={{ color: '#ffffff' }}>📥</span> Tải thông báo nộp phí
              </button>
              
              <button
                onClick={handleCloseNotificationModal}
                style={{
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
              >
                Đóng
              </button>
            </div>
                     </div>
         </div>
       )}

      {/* Download Success Modal */}
      {showDownloadSuccessModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1002,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '30px',
            maxWidth: '450px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}>
            {/* Warning Icon and Title */}
            <div style={{
              marginBottom: '20px'
            }}>
              <div style={{
                fontSize: '24px',
                marginBottom: '10px',
                color: '#007bff'
              }}>
                ⚠
              </div>
              <h3 style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#007bff'
              }}>
                THÔNG BÁO
              </h3>
            </div>

            {/* Success Message */}
            <div style={{
              marginBottom: '25px',
              fontSize: '14px',
              color: '#333',
              lineHeight: '1.6'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '15px',
                color: '#007bff',
                fontWeight: '500'
              }}>
                <span style={{ marginRight: '8px', fontSize: '16px' }}>✓</span>
                Lấy thông báo nộp phí thành công.
              </div>
              <div>
                Vui lòng kiểm tra Thông báo nộp phí trong thư mục download của bạn. Xin cảm ơn!
              </div>
            </div>

            {/* Close Button */}
            <div style={{
              textAlign: 'right'
            }}>
              <button
                onClick={handleCloseDownloadSuccessModal}
                style={{
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '8px 20px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeDeclarationManagePage;
