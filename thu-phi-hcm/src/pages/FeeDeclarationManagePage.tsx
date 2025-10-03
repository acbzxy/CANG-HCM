import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FeeDeclarationService, type FeeDeclarationSearchParams, type TokhaiThongtinResponse } from '../utils/feeDeclarationApi';
import { useNotification } from '../context/NotificationContext';
import { debugLog } from '../debug';
import type { FeeDeclaration } from '../types';
// Simple PDF download using browser's print functionality

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


// Helper function to extract content from chiTiet object
  const getChiTietContent = (chiTiet: any): string => {
    // Try common field names for content/description
    const possibleFields = [
      'ghiChuKhaiPhi', 'noiDung', 'tenNoiDung', 'moTa', 'content', 'description',
      'tenPhieu', 'tenBieuPhi', 'tenLoaiPhi', 'tenDichVu', 'dichVu',
      'loaiPhi', 'tenLoai', 'tenSanPham', 'sanPham', 'hangHoa',
      'ghiChu', 'note', 'notes', 'comment', 'comments',
      'donViTinh', 'dvt', 'unit', 'tongTrongLuong' // Add unit fields
    ];
    
    for (const field of possibleFields) {
      if (chiTiet[field] && typeof chiTiet[field] === 'string' && chiTiet[field].trim()) {
        return chiTiet[field];
      }
    }
    
    // If no string field found, try to find any non-empty string value
    for (const key in chiTiet) {
      if (typeof chiTiet[key] === 'string' && chiTiet[key].trim()) {
        return chiTiet[key];
      }
    }
    
    // Last resort: return formatted JSON
    return JSON.stringify(chiTiet, null, 2);
  };

  // Function to convert number to Vietnamese text
  const numberToVietnameseText = (num: number): string => {
    const ones = ['', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
    const tens = ['', '', 'hai mươi', 'ba mươi', 'bốn mươi', 'năm mươi', 'sáu mươi', 'bảy mươi', 'tám mươi', 'chín mươi'];
    const hundreds = ['', 'một trăm', 'hai trăm', 'ba trăm', 'bốn trăm', 'năm trăm', 'sáu trăm', 'bảy trăm', 'tám trăm', 'chín trăm'];
    
    if (num === 0) return 'không';
    if (num < 0) return 'âm ' + numberToVietnameseText(-num);
    
    let result = '';
    
    // Handle millions
    if (num >= 1000000) {
      const millions = Math.floor(num / 1000000);
      result += numberToVietnameseText(millions) + ' triệu ';
      num %= 1000000;
    }
    
    // Handle thousands
    if (num >= 1000) {
      const thousands = Math.floor(num / 1000);
      if (thousands > 0) {
        result += numberToVietnameseText(thousands) + ' nghìn ';
      }
      num %= 1000;
    }
    
    // Handle hundreds
    if (num >= 100) {
      const hundred = Math.floor(num / 100);
      result += hundreds[hundred] + ' ';
      num %= 100;
    }
    
    // Handle tens and ones
    if (num >= 20) {
      const ten = Math.floor(num / 10);
      result += tens[ten] + ' ';
      num %= 10;
    } else if (num >= 10) {
      if (num === 10) result += 'mười ';
      else if (num < 15) result += 'mười ' + ones[num % 10] + ' ';
      else result += 'mười ' + ones[num % 10] + ' ';
      num = 0;
    }
    
    if (num > 0) {
      result += ones[num] + ' ';
    }
    
    // Capitalize first letter of each word
    const words = (result.trim() + ' đồng').split(' ');
    const capitalizedWords = words.map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );
    return capitalizedWords.join(' ');
  };

// Helper function to determine display status based on trangThaiPhatHanh
const getDisplayStatus = (item: FeeDeclaration): string => {
  console.log(`Status debug for ID ${item.id}:`, {
    trangThaiPhatHanh: item.trangThaiPhatHanh,
    declarationStatus: item.declarationStatus,
    paymentStatus: item.paymentStatus,
    declarationNumber: item.declarationNumber
  });
  
  // Map explicit business statuses 00-04 per requirement
  // 00: Mới tạo, 01: Đã ký số, 02: Đã tính phí, 03: Đã tạo hóa đơn, 04: Thành công
  if (item.trangThai) {
    switch (item.trangThai) {
      case '00':
        return 'Mới tạo';
      case '01':
        return 'Đã ký số';
      case '02':
        return 'Đã tính phí';
      case '03':
        return 'Đã tạo hóa đơn';
      case '04':
        return 'Thành công';
      default:
        break; // fall through to trangThaiPhatHanh mapping
    }
  }

  // Fallback: use trangThaiPhatHanh for display when 00-04 not provided
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
  const [selectedItemDetail, setSelectedItemDetail] = useState<TokhaiThongtinResponse | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // State for notification modal
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [selectedNotificationItem, setSelectedNotificationItem] = useState<FeeDeclarationDisplay | null>(null);
  const [notificationDetail, setNotificationDetail] = useState<TokhaiThongtinResponse | null>(null);
  const [loadingNotification, setLoadingNotification] = useState(false);

  // State for download success modal
  const [showDownloadSuccessModal, setShowDownloadSuccessModal] = useState(false);

  // State for loading and pagination
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Prevent duplicate API calls
  const isLoadingRef = React.useRef(false);

  // Receipt viewer states
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [loadingReceipt, setLoadingReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<any | null>(null);

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

      // Check for new fee declaration creation
      const newDeclarationData = localStorage.getItem('newFeeDeclarationCreated');
      if (newDeclarationData) {
        try {
          const newDeclarationInfo = JSON.parse(newDeclarationData);
          console.log('New fee declaration creation detected:', newDeclarationInfo);
          
          // Reload data to get fresh data from backend
          loadFeeDeclarations();
          
          // Clear the update flag
          localStorage.removeItem('newFeeDeclarationCreated');
          
          console.log('Fee declaration data reloaded after new creation');
        } catch (error) {
          console.error('Error processing new declaration creation:', error);
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
    // Prevent duplicate calls
    if (isLoadingRef.current) {
      console.log('🔄 Fee declarations are already loading, skipping duplicate call');
      return;
    }
    
    try {
      isLoadingRef.current = true;
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
        console.error('💥 Error message:', (apiError as Error).message);
        console.error('💥 Error stack:', (apiError as Error).stack);
        console.log('🔄 API không kết nối được, sử dụng dữ liệu demo.');
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
      console.error('💥 Error message:', (error as Error).message);
      console.error('💥 Error stack:', (error as Error).stack);
      showError('Có lỗi xảy ra khi tải dữ liệu: ' + (error as Error).message);
      
      // Set empty data if all fails
      setFeeDeclarations([]);
      setDisplayDeclarations([]);
      setTotalElements(0);
      setTotalPages(0);
    } finally {
      isLoadingRef.current = false;
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

  const handleViewDetail = async (item: FeeDeclarationDisplay) => {
    console.log('👁️ Starting handleViewDetail for item:', item);
    setSelectedItem(item);
    setShowDetailModal(true);
    setLoadingDetail(true);
    
    try {
      console.log('👁️ Fetching detail for ID:', item.id);
      // Fetch detailed information from API
      const detailData = await FeeDeclarationService.getFeeDeclarationById(parseInt(item.id));
      console.log('👁️ Detail data received:', detailData);
      setSelectedItemDetail(detailData);
      console.log('Detail data loaded:', detailData);
      console.log('ChiTietList:', detailData.chiTietList);
      if (detailData.chiTietList && detailData.chiTietList.length > 0) {
        console.log('First chiTiet item:', detailData.chiTietList[0]);
        console.log('All chiTiet fields:', Object.keys(detailData.chiTietList[0]));
      }
    } catch (error) {
      console.error('❌ Error loading detail:', error);
      console.error('❌ Error details:', (error as Error).message, (error as Error).stack);
      showError('Không thể tải chi tiết tờ khai: ' + (error as Error).message);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedItem(null);
    setSelectedItemDetail(null);
    setLoadingDetail(false);
  };

  const handleGetNotification = async (item: FeeDeclarationDisplay) => {
    console.log('🔔 Starting handleGetNotification for item:', item);
    setSelectedNotificationItem(item);
    setShowNotificationModal(true);
    setLoadingNotification(true);
    
    try {
      console.log('🔔 Fetching notification detail for ID:', item.id);
      // Fetch detailed information from API for notification
      const detailData = await FeeDeclarationService.getFeeDeclarationById(parseInt(item.id));
      console.log('🔔 Notification detail data received:', detailData);
      setNotificationDetail(detailData);
      console.log('Notification detail data loaded:', detailData);
      console.log('Notification ChiTietList:', detailData.chiTietList);
      if (detailData.chiTietList && detailData.chiTietList.length > 0) {
        console.log('First notification chiTiet item:', detailData.chiTietList[0]);
        console.log('All notification chiTiet fields:', Object.keys(detailData.chiTietList[0]));
      }
    } catch (error) {
      console.error('❌ Error loading notification detail:', error);
      console.error('❌ Error details:', (error as Error).message, (error as Error).stack);
      showError('Không thể tải thông báo tờ khai: ' + (error as Error).message);
    } finally {
      setLoadingNotification(false);
    }
  };

  const handleCloseNotificationModal = () => {
    setShowNotificationModal(false);
    setSelectedNotificationItem(null);
    setNotificationDetail(null);
    setLoadingNotification(false);
  };

  const handleDownloadNotification = () => {
    if (!notificationDetail) return;
    
    try {
      console.log('Starting PDF generation...');
      
      // Create HTML content
      const htmlContent = createPDFHTML();
      console.log('HTML content created, length:', htmlContent.length);
      
      // Create a new window for printing (A4 landscape size)
      const printWindow = window.open('', '_blank', 'width=1200,height=800');
      if (!printWindow) {
        alert('Không thể mở cửa sổ in. Vui lòng kiểm tra popup blocker.');
        return;
      }
      
      // Write content to the new window
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Wait for content to load
      printWindow.onload = () => {
        console.log('Print window loaded, starting print...');
        
        // Add a small delay to ensure everything is rendered
        setTimeout(() => {
          printWindow.print();
          
          // Close the window after a delay
          setTimeout(() => {
            printWindow.close();
          }, 1000);
        }, 500);
      };
      
      // Close the notification modal
      setShowNotificationModal(false);
      setSelectedNotificationItem(null);
      setNotificationDetail(null);
      setLoadingNotification(false);
      
      // Show download success modal
      setShowDownloadSuccessModal(true);
      
      console.log('PDF generation completed successfully');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(`Có lỗi khi tạo PDF: ${error}. Vui lòng thử lại.`);
    }
  };


  const createPDFHTML = () => {
    if (!notificationDetail) return '';
    
    return `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thông báo tờ khai nộp phí</title>
    <style>
        @page {
            size: A4 landscape;
            margin: 15mm;
        }
        
        * {
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 12px;
            line-height: 1.4;
            color: #000;
            margin: 0;
            padding: 0;
            background: white;
            width: 100%;
            max-width: 100%;
            overflow-x: hidden;
        }
        
        .container {
            width: 100%;
            max-width: 100%;
            padding: 0;
            margin: 0;
        }
        
        .header {
            text-align: center;
            margin-bottom: 25px;
        }
        
        .title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
            text-transform: uppercase;
        }
        
        .blue-line {
            height: 3px;
            background-color: #0066cc;
            margin: 15px auto;
            width: 200px;
        }
        
        .info-bar {
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            padding: 15px;
            margin-bottom: 25px;
            border-radius: 5px;
        }
        
        .info-row {
            display: flex;
            margin-bottom: 8px;
            align-items: center;
        }
        
        .info-row:last-child {
            margin-bottom: 0;
        }
        
        .info-label {
            font-weight: bold;
            min-width: 140px;
            color: #333;
        }
        
        .info-value {
            flex: 1;
        }
        
        .company-section {
            margin-bottom: 25px;
        }
        
        .company-info {
            display: flex;
            gap: 30px;
            margin-bottom: 20px;
        }
        
        .company-column {
            flex: 1;
            background-color: #fafafa;
            padding: 15px;
            border: 1px solid #e0e0e0;
            border-radius: 5px;
        }
        
        .company-title {
            font-weight: bold;
            font-size: 13px;
            margin-bottom: 12px;
            color: #0066cc;
            border-bottom: 1px solid #0066cc;
            padding-bottom: 5px;
        }
        
        .company-detail {
            margin-bottom: 8px;
            display: flex;
        }
        
        .company-detail:last-child {
            margin-bottom: 0;
        }
        
        .company-detail strong {
            min-width: 80px;
            color: #333;
        }
        
        .table-section {
            margin-bottom: 25px;
        }
        
        .table-title {
            font-weight: bold;
            font-size: 13px;
            margin-bottom: 12px;
            color: #333;
        }
        
        .pdf-table {
            width: 100%;
            border-collapse: collapse;
            border: 2px solid #333;
            margin-bottom: 15px;
        }
        
        .pdf-table th,
        .pdf-table td {
            border: 1px solid #333;
            padding: 8px 6px;
            text-align: left;
            vertical-align: top;
        }
        
        .pdf-table th {
            background-color: #f8f9fa;
            font-weight: bold;
            text-align: center;
            color: #333;
        }
        
        .pdf-table .text-center {
            text-align: center;
        }
        
        .pdf-table .text-right {
            text-align: right;
        }
        
        .pdf-table .total-row {
            background-color: #f0f0f0;
            font-weight: bold;
        }
        
        .pdf-table .total-row td {
            border-top: 2px solid #333;
        }
        
        .amount-in-words {
            text-align: center;
            font-style: italic;
            color: #666;
            margin-top: 20px;
            padding: 10px;
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        
        @media print {
            body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
        <div class="title">Thông báo tờ khai nộp phí</div>
        <div class="blue-line"></div>
    </div>
    
    <div class="info-bar">
        <div class="info-row">
            <span class="info-label">STK HQ:</span>
            <span class="info-value">${notificationDetail.soToKhai || 'N/A'}</span>
        </div>
        <div class="info-row">
            <span class="info-label">STB nộp phí:</span>
            <span class="info-value">${notificationDetail.soThongBaoNopPhi || 'N/A'}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Nhóm loại hình:</span>
            <span class="info-value">${notificationDetail.nhomLoaiPhi || 'N/A'} - Loại hình: ${notificationDetail.maLoaiHinh || 'N/A'}</span>
        </div>
    </div>
    
    <div class="company-section">
        <div class="company-info">
            <div class="company-column">
                <div class="company-title">Đơn vị nhập tờ khai nộp phí</div>
                <div class="company-detail">
                    <strong>Mã đơn vị:</strong>
                    <span>${notificationDetail.maDoanhNghiepKhaiPhi || 'N/A'}</span>
                </div>
                <div class="company-detail">
                    <strong>Tên đơn vị:</strong>
                    <span>${notificationDetail.tenDoanhNghiepKhaiPhi || 'N/A'}</span>
                </div>
                <div class="company-detail">
                    <strong>Địa chỉ:</strong>
                    <span>${notificationDetail.diaChiKhaiPhi || 'N/A'}</span>
                </div>
            </div>
            <div class="company-column">
                <div class="company-title">Đơn vị xuất nhập khẩu (DNK)</div>
                <div class="company-detail">
                    <strong>Mã đơn vị:</strong>
                    <span>${notificationDetail.maDoanhNghiepXNK || 'N/A'}</span>
                </div>
                <div class="company-detail">
                    <strong>Tên đơn vị:</strong>
                    <span>${notificationDetail.tenDoanhNghiepXNK || 'N/A'}</span>
                </div>
                <div class="company-detail">
                    <strong>Địa chỉ:</strong>
                    <span>${notificationDetail.diaChiXNK || 'N/A'}</span>
                </div>
            </div>
        </div>
    </div>
    
    <div class="table-section">
        <div class="table-title">Chi tiết nộp phí (CHUYEN_KHOAN):</div>
        <table class="pdf-table">
            <thead>
                <tr>
                    <th style="width: 8%;">STT</th>
                    <th style="width: 35%;">Nội dung thu phí</th>
                    <th style="width: 12%;">Mã DVT</th>
                    <th style="width: 15%;">Số lượng/trọng lượng</th>
                    <th style="width: 15%;">Đơn giá</th>
                    <th style="width: 15%;">Thành tiền</th>
                </tr>
            </thead>
            <tbody>
                ${notificationDetail.chiTietList && notificationDetail.chiTietList.length > 0 ? 
                    notificationDetail.chiTietList.map((chiTiet: any, index: number) => `
                        <tr>
                            <td class="text-center">${index + 1}</td>
                            <td>${getChiTietContent(chiTiet)}</td>
                            <td class="text-center">${chiTiet.donViTinh || 'null'}</td>
                            <td class="text-center">${chiTiet.tongTrongLuong || chiTiet.soLuong || 'N/A'}</td>
                            <td class="text-right">${chiTiet.donGia ? new Intl.NumberFormat('vi-VN').format(chiTiet.donGia) : 'N/A'}</td>
                            <td class="text-right">${chiTiet.soTien ? new Intl.NumberFormat('vi-VN').format(chiTiet.soTien) : chiTiet.thanhTien ? new Intl.NumberFormat('vi-VN').format(chiTiet.thanhTien) : 'N/A'}</td>
                        </tr>
                    `).join('') : 
                    '<tr><td colspan="6" class="text-center">Không có chi tiết phí</td></tr>'
                }
                ${notificationDetail.chiTietList && notificationDetail.chiTietList.length > 0 ? `
                    <tr class="total-row">
                        <td colspan="5"><strong>TỔNG SỐ:</strong></td>
                        <td class="text-right"><strong>${new Intl.NumberFormat('vi-VN').format(notificationDetail.tongTienPhi || 0)}</strong></td>
                    </tr>
                ` : ''}
            </tbody>
        </table>
    </div>
    
    <div class="amount-in-words">
        <strong>Số tiền bằng chữ:</strong> ${numberToVietnameseText(notificationDetail.tongTienPhi || 0)}
    </div>
    </div>
</body>
</html>`;
  };

  const handleCloseDownloadSuccessModal = () => {
    setShowDownloadSuccessModal(false);
  };

  const handleCreateReceipt = async (item: FeeDeclaration) => {
    console.log('🗂️ ===== CREATE RECEIPT DEBUG =====');
    console.log('🗂️ Tạo biên lai cho:', item.id);
    console.log('🗂️ Item idBienLai:', item.idBienLai);
    console.log('🗂️ Item trangThaiPhatHanh:', item.trangThaiPhatHanh);
    console.log('🗂️ Item declarationStatus:', item.declarationStatus);
    console.log('🗂️ Item paymentStatus:', item.paymentStatus);
    
    try {
      // Check if item has idBienLai (not null and not empty)
      if (item.idBienLai && item.idBienLai !== 0) {
        console.log('🗂️ Item has idBienLai, loading existing receipt data...');
        
        // Call API to get existing receipt data
        const receiptResponse = await fetch(`/api/bien-lai/${item.idBienLai}`);
        if (!receiptResponse.ok) {
          throw new Error(`HTTP error! status: ${receiptResponse.status}`);
        }
        const receiptResponseData = await receiptResponse.json();
        console.log('🗂️ Existing receipt response:', receiptResponseData);
        
        // Extract data from response wrapper
        const receiptData = receiptResponseData.data;
        console.log('🗂️ Existing receipt data:', receiptData);
        console.log('🗂️ DEBUG: receiptData.idPhatHanh:', receiptData.idPhatHanh);
        console.log('🗂️ DEBUG: receiptData keys:', Object.keys(receiptData));
        console.log('🗂️ DEBUG: Has idPhatHanh?', 'idPhatHanh' in receiptData);
        
        // Navigate with receipt data and toKhaiId
        navigate('/receipt-management/create', { 
          state: { 
            selectedItem: receiptData,
            isEditMode: true,
            toKhaiId: item.id, // Pass the fee declaration ID as toKhaiId
            trangThaiPhatHanh: item.trangThaiPhatHanh // Pass trangThaiPhatHanh from fee declaration
          } 
        });
      } else {
        console.log('🗂️ Item has no idBienLai (null or empty), loading fee declaration data...');
        
        // Call API to get fee declaration data
        console.log('🗂️ Calling API /api/tokhai-thongtin/' + item.id);
        const detailedData = await FeeDeclarationService.getFeeDeclarationById(item.id);
        console.log('🗂️ Fee declaration data:', detailedData);
        
        // Navigate to create receipt page with fee declaration data
        navigate('/receipt-management/create', { 
          state: { 
            selectedItem: detailedData,
            isEditMode: false,
            toKhaiId: item.id, // Pass the fee declaration ID as toKhaiId
            trangThaiPhatHanh: item.trangThaiPhatHanh // Pass trangThaiPhatHanh from fee declaration
          } 
        });
      }
    } catch (error) {
      console.error('🗂️ Error fetching data:', error);
      showError('Không thể lấy dữ liệu: ' + (error as Error).message);
    }
  };

  // View receipt if available; otherwise fallback to detail
  const handleViewReceiptOrDetail = async (displayItem: FeeDeclarationDisplay) => {
    try {
      // Find original item to access idBienLai
      const original = feeDeclarations.find(fd => String(fd.id) === displayItem.id);
      if (original && original.idBienLai && original.idBienLai !== 0) {
        setLoadingReceipt(true);
        setShowReceiptModal(true);
        const resp = await fetch(`/api/bien-lai/${original.idBienLai}`);
        if (!resp.ok) {
          throw new Error(`HTTP ${resp.status}`);
        }
        const payload = await resp.json();
        setReceiptData(payload?.data || null);
        setLoadingReceipt(false);
        return;
      }
      // Fallback: open fee declaration detail
      await handleViewDetail(displayItem);
    } catch (e) {
      setLoadingReceipt(false);
      showError('Không thể tải biên lai: ' + (e as Error).message);
    }
  };

  // Render with error boundary
  if (window.location.search.includes('debug=error')) {
    throw new Error('Debug error for testing');
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Debug Info removed as per user request */}
      
      {/* Title removed: hide total declarations line */}

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
                 Tính phí
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
                    onClick={() => handleViewReceiptOrDetail(item)}
                    title="Xem biên lai (nếu có) / Chi tiết"
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
                      ✓ Tính phí
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
                <td style={{ padding: '8px', textAlign: 'center', fontSize: '12px', whiteSpace: 'nowrap' }}>
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
                    title="Tính phí"
                  >
                    <span style={{ fontSize: '10px', color: '#ffffff' }}>✓</span>
                    Tính phí
                  </button>
                </td>
                                 <td style={{ padding: '8px', textAlign: 'center', fontSize: '12px' }}>
                   {(() => {
                     // Find the corresponding FeeDeclaration object to get trangThai from API
                     const feeDeclaration = feeDeclarations.find(fd => String(fd.id) === item.id);
                     const canCreateReceipt = feeDeclaration?.trangThai === '04' && feeDeclaration?.trangThaiPhatHanh !== '02';
                     
                     return (
                       <button
                         style={{
                           backgroundColor: canCreateReceipt ? '#17a2b8' : '#6c757d',
                           color: 'white',
                           border: 'none',
                           padding: '6px 12px',
                           borderRadius: '4px',
                           cursor: canCreateReceipt ? 'pointer' : 'not-allowed',
                           fontSize: '11px',
                           fontWeight: '500',
                           opacity: canCreateReceipt ? 1 : 0.6
                         }}
                         disabled={!canCreateReceipt}
                         onClick={() => {
                           if (canCreateReceipt && feeDeclaration) {
                             handleCreateReceipt(feeDeclaration);
                           } else {
                             console.error('Could not find FeeDeclaration for item:', item);
                           }
                         }}
                         title={canCreateReceipt ? 'Tạo biên lai' : `Không thể tạo biên lai (Trạng thái: ${feeDeclaration?.trangThai || 'N/A'})`}
                       >
                         Tạo biên lai
                       </button>
                     );
                   })()}
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

            {loadingDetail ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <i className="fas fa-spinner fa-spin" style={{ fontSize: '24px', color: '#007bff', marginBottom: '10px' }}></i>
                <div style={{ color: '#007bff' }}>Đang tải chi tiết...</div>
              </div>
            ) : selectedItemDetail ? (
              <div>
                {/* Header Info */}
                <div style={{
                  display: 'flex',
                  gap: '20px',
                  marginBottom: '20px',
                  fontSize: '13px',
                  color: '#333',
                  padding: '10px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px'
                }}>
                  <span><strong>STK HQ:</strong> {selectedItemDetail.soThongBaoNopPhi || 'N/A'}</span>
                  <span><strong>STB nộp phí:</strong> {selectedItemDetail.soToKhai || 'N/A'}</span>
                  <span><strong>Nhóm loại hình:</strong> {selectedItemDetail.nhomLoaiPhi || 'N/A'} - <strong>Loại hình:</strong> {selectedItemDetail.maLoaiHinh || 'N/A'}</span>
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
                      <strong>Mã đơn vị:</strong> {selectedItemDetail.maDoanhNghiepKhaiPhi || 'N/A'}
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>Tên đơn vị:</strong> {selectedItemDetail.tenDoanhNghiepKhaiPhi || 'N/A'}
                    </div>
                    <div>
                      <strong>Địa chỉ:</strong> {selectedItemDetail.diaChiKhaiPhi || 'N/A'}
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
                      <strong>Mã đơn vị:</strong> {selectedItemDetail.maDoanhNghiepXNK || 'N/A'}
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>Tên đơn vị:</strong> {selectedItemDetail.tenDoanhNghiepXNK || 'N/A'}
                    </div>
                    <div>
                      <strong>Địa chỉ:</strong> {selectedItemDetail.diaChiXNK || 'N/A'}
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
                    Chi tiết nộp phí ({selectedItemDetail.loaiThanhToan || 'Chuyển khoản'}):
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
                        }}>Số lượng/trọng lượng</th>
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
                      {selectedItemDetail.chiTietList && selectedItemDetail.chiTietList.length > 0 ? (
                        selectedItemDetail.chiTietList.map((chiTiet: any, index: number) => (
                          <tr key={index}>
                            <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                              {index + 1}
                            </td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                              {getChiTietContent(chiTiet)}
                            </td>
                            <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                              {chiTiet.donViTinh || 'null'}
                            </td>
                            <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                              {chiTiet.tongTrongLuong || chiTiet.soLuong || 'N/A'}
                            </td>
                            <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>
                              {chiTiet.donGia ? formatCurrency(chiTiet.donGia) : 'N/A'}
                            </td>
                            <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>
                              {chiTiet.soTien ? formatCurrency(chiTiet.soTien) : chiTiet.thanhTien ? formatCurrency(chiTiet.thanhTien) : 'N/A'}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} style={{ 
                            border: '1px solid #ddd', 
                            padding: '20px', 
                            textAlign: 'center',
                            color: '#666'
                          }}>
                            Không có chi tiết phí
                          </td>
                        </tr>
                      )}
                      {selectedItemDetail.chiTietList && selectedItemDetail.chiTietList.length > 0 && (
                        <tr style={{ backgroundColor: '#f8f9fa', fontWeight: 'bold' }}>
                          <td colSpan={4} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                            TỔNG SỐ:
                          </td>
                          <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                            {selectedItemDetail.chiTietList.length}
                          </td>
                          <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>
                            {formatCurrency(selectedItemDetail.tongTienPhi || 0)}
                          </td>
                        </tr>
                      )}
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
                  Số tiền bằng chữ: {selectedItemDetail.ghiChuKhaiPhi || 'Không có ghi chú'}
                </div>

                {/* Action Buttons */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderTop: '1px solid #eee',
                  paddingTop: '15px'
                }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      style={{
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500',
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
                      <span style={{ color: '#ffffff' }}>✓</span> Tính phí
                    </button>
                    
                    <button
                      style={{
                        backgroundColor: '#17a2b8',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500'
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
                  
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#d32f2f' }}>
                    Tổng tiền: {formatCurrency(selectedItemDetail.tongTienPhi || 0)} VNĐ
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                Không thể tải chi tiết tờ khai
              </div>
            )}

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

            {loadingNotification ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <i className="fas fa-spinner fa-spin" style={{ fontSize: '24px', color: '#007bff', marginBottom: '10px' }}></i>
                <div style={{ color: '#007bff' }}>Đang tải thông báo...</div>
              </div>
            ) : notificationDetail ? (
              <div>
                {/* Info Row */}
                <div style={{
                  display: 'flex',
                  gap: '20px',
                  marginBottom: '20px',
                  fontSize: '13px',
                  color: '#333',
                  padding: '10px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px'
                }}>
                  <span><strong>STK HQ:</strong> {notificationDetail.soThongBaoNopPhi || 'N/A'},</span>
                  <span><strong>STB nộp phí:</strong> {notificationDetail.soToKhai || 'N/A'},</span>
                  <span><strong>Nhóm loại hình:</strong> {notificationDetail.nhomLoaiPhi || 'N/A'} - <strong>Loại hình:</strong> {notificationDetail.maLoaiHinh || 'N/A'}</span>
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
                      <strong>Mã đơn vị:</strong> {notificationDetail.maDoanhNghiepKhaiPhi || 'N/A'}
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>Tên đơn vị:</strong> {notificationDetail.tenDoanhNghiepKhaiPhi || 'N/A'}
                    </div>
                    <div>
                      <strong>Địa chỉ:</strong> {notificationDetail.diaChiKhaiPhi || 'N/A'}
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
                      <strong>Mã đơn vị:</strong> {notificationDetail.maDoanhNghiepXNK || 'N/A'}
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>Tên đơn vị:</strong> {notificationDetail.tenDoanhNghiepXNK || 'N/A'}
                    </div>
                    <div>
                      <strong>Địa chỉ:</strong> {notificationDetail.diaChiXNK || 'N/A'}
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
                    Chi tiết nộp phí ({notificationDetail.loaiThanhToan || 'Chuyển khoản'}):
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
                        }}>Số lượng/trọng lượng</th>
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
                      {notificationDetail.chiTietList && notificationDetail.chiTietList.length > 0 ? (
                        notificationDetail.chiTietList.map((chiTiet: any, index: number) => (
                          <tr key={index}>
                            <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                              {index + 1}
                            </td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                              {getChiTietContent(chiTiet)}
                            </td>
                            <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                              {chiTiet.donViTinh || 'null'}
                            </td>
                            <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                              {chiTiet.tongTrongLuong || chiTiet.soLuong || 'N/A'}
                            </td>
                            <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>
                              {chiTiet.donGia ? formatCurrency(chiTiet.donGia) : 'N/A'}
                            </td>
                            <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>
                              {chiTiet.soTien ? formatCurrency(chiTiet.soTien) : chiTiet.thanhTien ? formatCurrency(chiTiet.thanhTien) : 'N/A'}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} style={{ 
                            border: '1px solid #ddd', 
                            padding: '20px', 
                            textAlign: 'center',
                            color: '#666'
                          }}>
                            Không có chi tiết phí
                          </td>
                        </tr>
                      )}
                      {notificationDetail.chiTietList && notificationDetail.chiTietList.length > 0 && (
                        <tr style={{ backgroundColor: '#f8f9fa', fontWeight: 'bold' }}>
                          <td colSpan={5} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                            TỔNG SỐ:
                          </td>
                   
                          <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>
                            {formatCurrency(notificationDetail.tongTienPhi || 0)}
                          </td>
                        </tr>
                      )}
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
                  Số tiền bằng chữ: {numberToVietnameseText(notificationDetail.tongTienPhi || 0)}
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
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                Không thể tải thông báo tờ khai
              </div>
            )}
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
                Tính phí thành công.
              </div>
              <div>
                Vui lòng kiểm tra kết quả tính phí trong thư mục download của bạn. Xin cảm ơn!
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

      {/* Receipt Viewer Modal */}
      {showReceiptModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1100,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          paddingTop: '64px'
        }}>
          <div style={{ position: 'relative', background: 'white', borderRadius: 12, width: '90%', maxWidth: 1200, height: '85vh', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
            <button
              onClick={() => { setShowReceiptModal(false); setReceiptData(null); }}
              title="Đóng"
              style={{ position: 'absolute', top: 10, right: 10, width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,0,0,0.55)', color: '#fff', border: 'none', cursor: 'pointer', zIndex: 2 }}
            >
              ×
            </button>
            <div style={{ background: '#1f2937', color: '#fff', padding: '10px 14px', fontWeight: 600 }}>Phát hành biên lai điện tử</div>
            <div style={{ width: '100%', height: 'calc(85vh - 44px)', background: '#f3f4f6' }}>
              {loadingReceipt ? (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4b5563' }}>
                  <i className="fas fa-spinner fa-spin" style={{ marginRight: 8 }}></i> Đang tải biên lai...
                </div>
              ) : receiptData?.imageBl ? (
                <iframe
                  title="Receipt PDF"
                  src={`data:application/pdf;base64,${receiptData.imageBl}`}
                  style={{ width: '100%', height: '100%', border: 0 }}
                />
              ) : receiptData ? (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
                  Không có dữ liệu PDF. Mã: {receiptData?.maBl} - Số: {receiptData?.soBl}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeDeclarationManagePage;
