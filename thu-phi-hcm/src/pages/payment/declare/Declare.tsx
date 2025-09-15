import Button from "@/components/ui/Button";
import { PencilSquareIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import FeeInformationFormModal from "./components/FeeInformationFormModal";
import { CrmApiService, type CrmFeeDeclarationSearchParams, type ChuKySoInfo, ToKhaiStatusHelper, TOKHAI_STATUS } from "../../../utils/crmApi";
import { useNotification } from "../../../context/NotificationContext";
import NetworkDiagnosticPanel from "../../../components/NetworkDiagnosticPanel";
// import { useAuth } from "../../../context/AuthContext"; // Unused import

const Declare: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [showFeeInfoModal, setShowFeeInfoModal] = useState(false);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [allData, setAllData] = useState<any[]>([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState<any>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showSignConfirmModal, setShowSignConfirmModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isApiConnected, setIsApiConnected] = useState(false);
  const [connectionDetails, setConnectionDetails] = useState<any>(null);
  const [showDiagnosticPanel, setShowDiagnosticPanel] = useState(false);
  
  // === SEARCH AND FILTER STATE ===
  const [searchFilters, setSearchFilters] = useState({
    fromDate: '2025-08-12',
    toDate: '2025-08-27',
    declarationType: '',
    paymentType: '',
    dataSource: '',
    status: '-3',
    feeGroup: '',
    companyCode: '',
    declarationNumber: '',
    notificationNumber: ''
  });
  const [companies, setCompanies] = useState<any[]>([]);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  
  const totalRecords = filteredData.length;
  
  const { showError, showSuccess, showInfo } = useNotification();
  // === STATE CHỌN CHỮ KÝ SỐ ===
  const [availableCertificates, setAvailableCertificates] = useState<ChuKySoInfo[]>([]);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [selectedCertificateSerial, setSelectedCertificateSerial] = useState<string>('');

  const handleViewNote = (rowData: any) => {
    setSelectedRowData(rowData);
    setShowDetailModal(true);
  };

  // === NOTIFICATION HANDLER ===
  const handleGetNotification = async (row: any) => {
    try {
      setLoading(true);
      showInfo('Đang lấy thông báo phí...', 'Xử lý');
      
      console.log('📄 Getting notification for declaration:', row.id);
      
      // Mock API call for getting notification
      // In production, this would call actual notification API
      setTimeout(() => {
        // Update the notification status
        setFilteredData(prevData =>
          prevData.map(item =>
            item.id === row.id
              ? { ...item, thongBao: 'Đã lấy' }
              : item
          )
        );
        setAllData(prevData =>
          prevData.map(item =>
            item.id === row.id
              ? { ...item, thongBao: 'Đã lấy' }
              : item
          )
        );
        
        showSuccess('Đã lấy thông báo thành công!', 'Thành công');
        console.log('✅ Notification retrieved successfully for item:', row.id);
        setLoading(false);
      }, 1500);
      
    } catch (error: any) {
      console.error('💥 Get notification failed:', error);
      showError(`Lỗi lấy thông báo: ${error.message}`, 'Lỗi');
      setLoading(false);
    }
  };

  // === SAVE NEW DECLARATION HANDLER ===
  const handleSaveNewDeclaration = async (newDeclarationData: any) => {
    try {
      setLoading(true);
      showInfo('Đang lưu tờ khai mới...', 'Lưu dữ liệu');
      
      console.log('💾 Saving new declaration:', newDeclarationData);
      
      // TODO: Call actual API create endpoint when available
      // const response = await CrmApiService.createFeeDeclaration(newDeclarationData);
      
      // For now, add to local state (mock implementation)
      const newDeclaration = {
        id: newDeclarationData.id,
        soToKhai: newDeclarationData.customsDeclarationNumber || `AUTO-${Date.now()}`,
        ngayToKhai: newDeclarationData.customsDeclarationDate || new Date().toISOString().split('T')[0],
        tenDoanhNghiep: newDeclarationData.companyName,
        doanhNghiepKB: newDeclarationData.companyName,
        doanhNghiepXNK: newDeclarationData.companyName, // Sử dụng cùng tên công ty
        maDoanhNghiep: newDeclarationData.companyTaxCode,
        diaChi: newDeclarationData.companyAddress,
        maHQ: newDeclarationData.customsDeclarationNumber || `${Math.floor(100000000 + Math.random() * 900000000)}`,
        ngayHQ: newDeclarationData.customsDeclarationDate || new Date().toISOString().split('T')[0],
        ngayPhi: newDeclarationData.feeDeclarationDate,
        loai: 'Hàng container',
        thongBao: 'Chưa lấy',
        soTB: newDeclarationData.feeDeclarationReceiptNumber || `TB-${Date.now()}`,
        trangThai: newDeclarationData.status || 'Thêm mới',
        thanhTien: newDeclarationData.totalFeeAmount || 0,
        ghiChu: newDeclarationData.notes || '',
        createdAt: new Date().toISOString()
      };
      
      // Add to filteredData and allData
      setFilteredData(prevDeclarations => [newDeclaration, ...prevDeclarations]);
      setAllData(prevDeclarations => [newDeclaration, ...prevDeclarations]);
      
      showSuccess('Đã lưu tờ khai mới thành công!', 'Thành công');
      console.log('✅ New declaration saved successfully:', newDeclaration);
      
    } catch (error: any) {
      console.error('💥 Save new declaration failed:', error);
      showError(`Lỗi lưu tờ khai: ${error?.message || 'Unknown error'}`, 'Lỗi');
      throw error; // Re-throw để modal có thể handle
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (itemId: number, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredData.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleDigitalSign = () => {
    if (selectedItems.length === 0) {
      showError('Vui lòng chọn ít nhất một tờ khai để ký số!', 'Lỗi');
      return;
    }
    setShowSignConfirmModal(true);
  };

  const handleConfirmDigitalSign = async () => {
    try {
      setLoading(true);
      console.log('🔐 Starting digital signature process for items:', selectedItems);
      // Tải danh sách chứng chỉ và mở modal lựa chọn
      const certificatesResult = await CrmApiService.getDanhSachChuKySo();
      if (certificatesResult.status !== 200 || !certificatesResult.data || certificatesResult.data.length === 0) {
        throw new Error('Không có chứng chỉ số nào khả dụng. Vui lòng cấu hình chứng chỉ số trước.');
      }
      setAvailableCertificates(certificatesResult.data);
      setSelectedCertificateSerial(certificatesResult.data[0]?.serialNumber || '');
      setShowCertificateModal(true);
      setShowSignConfirmModal(false);
    } catch (error: any) {
      console.error('💥 Digital signature failed:', error);
      showError(`Lỗi ký số: ${error.message}`, 'Lỗi');
    } finally {
      setLoading(false);
    }
  };

  // Thực hiện ký số sau khi người dùng chọn chứng thư
  const handleSignWithSelectedCertificate = async () => {
    if (!selectedCertificateSerial) {
      showError('Vui lòng chọn một chứng thư số để ký.', 'Lỗi');
      return;
    }
    try {
      setLoading(true);
      const results = await Promise.all(
        selectedItems.map((declarationId) => {
          const signData = { toKhaiId: declarationId, lanKy: 1, serialNumber: selectedCertificateSerial };
          return CrmApiService.kyTenSoToKhai(signData);
        })
      );
      const successCount = results.filter(r => r && (r as any).status === 200).length;
      if (successCount === selectedItems.length) {
        setFilteredData(prev => prev.map(item => selectedItems.includes(item.id) ? { ...item, trangThai: 'Đã ký số' } : item));
        setAllData(prev => prev.map(item => selectedItems.includes(item.id) ? { ...item, trangThai: 'Đã ký số' } : item));
        showSuccess(`Ký số thành công ${selectedItems.length} tờ khai!`, 'Thành công');
      } else {
        showError('Một số tờ khai ký không thành công. Vui lòng thử lại.', 'Lỗi');
      }
    } catch (error: any) {
      console.error('💥 Digital signature after selection failed:', error);
      showError(`Lỗi ký số: ${error.message}`, 'Lỗi');
    } finally {
      setLoading(false);
      setShowCertificateModal(false);
      setSelectedItems([]);
    }
  };

  // Helper: Tên hiển thị chứng thư (override cho demo/test)
  const getCertificateDisplayName = (cert: ChuKySoInfo) => {
    const cn = cert.subject?.includes('CN=')
      ? cert.subject.split('CN=')[1]?.split(',')[0]
      : (cert.subject || 'Certificate');
    if ((cn || '').trim().toLowerCase() === 'test tpb') {
      return 'Công ty TNHH Vận Tải Biển Đông';
    }
    return cn || 'Certificate';
  };

  // === SEARCH AND FILTER FUNCTIONS ===
  
  const handleFilterChange = (field: string, value: string) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      showInfo('Đang tìm kiếm...', 'Xử lý');

      const searchParams: CrmFeeDeclarationSearchParams = {
        page: 0,
        size: 100,
        sortBy: 'createdAt',
        sortDir: 'desc',
        fromDate: searchFilters.fromDate,
        toDate: searchFilters.toDate,
        declarationNumber: searchFilters.declarationNumber || undefined,
        status: searchFilters.status !== '-3' ? searchFilters.status : undefined
      };

      const response = await CrmApiService.searchFeeDeclarations(searchParams);
      
      if (response && response.data) {
        const transformedData = transformApiDataToDisplayFormat(response.data.content || response.data);
        setFilteredData(transformedData);
        setAllData(transformedData);
        showSuccess(`Tìm thấy ${transformedData.length} tờ khai phù hợp`, 'Kết quả');
      } else {
        setFilteredData([]);
        showInfo('Không tìm thấy dữ liệu phù hợp', 'Kết quả');
      }
    } catch (error: any) {
      console.error('🔍 Search failed:', error);
      showError(`Lỗi tìm kiếm: ${error.message}`, 'Lỗi');
      // Fallback to showing all data
      setFilteredData(allData);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSearch = () => {
    setSearchFilters({
      fromDate: '2025-08-12',
      toDate: '2025-08-27',
      declarationType: '',
      paymentType: '',
      dataSource: '',
      status: '-3',
      feeGroup: '',
      companyCode: '',
      declarationNumber: '',
      notificationNumber: ''
    });
    setFilteredData(allData);
  };

  // === LOAD SUPPORTING DATA ===
  
  const loadSupportingData = async () => {
    try {
      // Load companies for dropdown
      const companiesResponse = await CrmApiService.getAllCompanies();
      if (companiesResponse && companiesResponse.data) {
        setCompanies(companiesResponse.data);
      }

      // Load fee types for dropdown - temporarily disabled  
      // const feeTypesResponse = await CrmApiService.getAllFeeTypes();
      // if (feeTypesResponse && feeTypesResponse.data) {
      //   setFeeTypes(feeTypesResponse.data);
      // }
    } catch (error) {
      console.warn('⚠️ Failed to load supporting data:', error);
      // Non-critical error, continue with empty arrays
    }
  };

  // Transform API data to display format
  const transformApiDataToDisplayFormat = (apiData: any[]) => {
    return apiData.map((item: any, index: number) => ({
      id: item.id,
      doanhNghiepKB: item.companyName || item.tenDoanhNghiepKhaiPhi || 'Công ty TNHH Test',
      doanhNghiepXNK: item.companyName || item.tenDoanhNghiepXuatNhapKhau || 'Công ty TNHH Test',
      maHQ: item.declarationNumber || item.soToKhai || `${Math.floor(100000000 + Math.random() * 900000000)}`,
      ngayHQ: item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : new Date().toLocaleDateString('vi-VN'),
      ngayPhi: item.updatedAt ? new Date(item.updatedAt).toLocaleDateString('vi-VN') : new Date().toLocaleDateString('vi-VN'),
      loai: item.feeType || item.loaiToKhai || 'Chưa ký',
      thongBao: item.status === 'COMPLETED' ? 'Đã lấy' : `TB${item.id || (index + 25)}`,
      soTB: `TB${item.id || (index + 25)}`,
      trangThai: getStatusDisplay(item.status || item.trangThai),
      thanhTien: item.feeAmount || item.tongTienPhi || 500000,
      // Additional fields from backend
      maDoanhNghiepKhaiPhi: item.maDoanhNghiepKhaiPhi || '0201399999',
      nguonTK: item.nguonTK,
      rawData: item // Keep original data for detail view
    }));
  };

  // Load fee declarations from CRM API
  const loadFeeDeclarations = async () => {
    try {
      setLoading(true);
      setError(null);

      // Test API connection first with enhanced diagnostics
      console.log('🔗 Testing CRM API connection...');
      const connectionResult = await CrmApiService.testConnection(10000); // 10 second timeout
      setIsApiConnected(connectionResult.connected);
      setConnectionDetails(connectionResult.details);

      // Kết nối với CRM API thật  
      if (connectionResult.connected) {
        console.log('✅ CRM API connected, loading fee declarations...');
        
        // Load fee declarations from CRM API
        const searchParams: CrmFeeDeclarationSearchParams = {
          page: 0,
          size: 20,
          sortBy: 'createdAt',
          sortDir: 'desc'
        };
        
        const response = await CrmApiService.searchFeeDeclarations(searchParams);
        
        if (response && response.data) {
          // Transform CRM data to display format using new function
          const transformedData = transformApiDataToDisplayFormat(response.data.content || response.data);
          
          setFilteredData(transformedData);
          setAllData(transformedData);
          console.log(`✅ Đã tải ${transformedData.length} tờ khai từ CRM API`);
        } else {
          throw new Error('Invalid response format from CRM API');
        }
      } else {
        console.warn('❌ CRM API not available, using fallback mock data');
        
        // Fallback to mock data
        setFilteredData([
          {
            id: 1,
            doanhNghiepKB: "Công ty TNHH Xuất Nhập Khẩu ABC",
            doanhNghiepXNK: "Công ty TNHH Xuất Nhập Khẩu ABC",
            tenDoanhNghiep: "Công ty TNHH Xuất Nhập Khẩu ABC",
            maDoanhNghiep: "0201392117",
            soToKhai: "123456789",
            maHQ: "100200300",
            ngayHQ: "08/09/2025",
            ngayToKhai: "08/09/2025",
            ngayPhi: "08/09/2025",
            loai: "Lấy thông báo",
            loaiHinhKinhDoanh: "Container", 
            thongBao: "TB25",
            soTB: "TB25",
            trangThai: "Mới tạo",
            thanhTien: 12500000,
            ghiChu: "Tờ khai phí container xuất khẩu",
            createdAt: "2025-09-08T08:00:00.000Z"
          },
          {
            id: 2,
            doanhNghiepKB: "Công ty TNHH Test",
            doanhNghiepXNK: "Công ty TNHH Test", 
            tenDoanhNghiep: "Công ty TNHH Test",
            maDoanhNghiep: "0201398888",
            soToKhai: "234567890",
            maHQ: "200300400",
            ngayHQ: "08/09/2025",
            ngayToKhai: "08/09/2025", 
            ngayPhi: "08/09/2025",
            loai: "Chưa ký",
            loaiHinhKinhDoanh: "Container",
            thongBao: "TB26",
            soTB: "TB26",
            trangThai: "Đã ký", 
            thanhTien: 500000,
            ghiChu: "Tờ khai phí container nhập khẩu",
            createdAt: "2025-09-08T09:00:00.000Z"
          },
          {
            id: 3,
            doanhNghiepKB: "Công ty TNHH Test",
            doanhNghiepXNK: "Công ty TNHH Test",
            tenDoanhNghiep: "Công ty TNHH Test", 
            maDoanhNghiep: "0201399999",
            soToKhai: "345678901",
            maHQ: "345678901",
            ngayHQ: "08/09/2025",
            ngayToKhai: "08/09/2025",
            ngayPhi: "08/09/2025", 
            loai: "Chưa ký",
            loaiHinhKinhDoanh: "Container",
            thongBao: "TB25",
            soTB: "TB25", 
            trangThai: "Mới tạo",
            thanhTien: 500000,
            ghiChu: "Tờ khai phí container",
            createdAt: "2025-09-08T10:00:00.000Z"
          },
          {
            id: 4,
            doanhNghiepKB: "Công ty TNHH Test",
            doanhNghiepXNK: "Công ty TNHH Test",
            tenDoanhNghiep: "Công ty TNHH Test", 
            maDoanhNghiep: "0201399999",
            soToKhai: "456789012",
            maHQ: "300400500",
            ngayHQ: "08/09/2025",
            ngayToKhai: "08/09/2025",
            ngayPhi: "08/09/2025", 
            loai: "Chưa ký",
            loaiHinhKinhDoanh: "Container",
            thongBao: "TB16",
            soTB: "TB16", 
            trangThai: "Mới tạo",
            thanhTien: 0,
            ghiChu: "Tờ khai phí container",
            createdAt: "2025-09-08T11:00:00.000Z"
          },
          {
            id: 5,
            doanhNghiepKB: "Công ty TNHH Test",
            doanhNghiepXNK: "Công ty TNHH Test",
            tenDoanhNghiep: "Công ty TNHH Test", 
            maDoanhNghiep: "0201399999",
            soToKhai: "567890123",
            maHQ: "567890123",
            ngayHQ: "08/09/2025",
            ngayToKhai: "08/09/2025",
            ngayPhi: "08/09/2025", 
            loai: "Chưa ký",
            loaiHinhKinhDoanh: "Container",
            thongBao: "TB34",
            soTB: "TB34", 
            trangThai: "Mới tạo",
            thanhTien: 500000,
            ghiChu: "Tờ khai phí container",
            createdAt: "2025-09-08T12:00:00.000Z"
          },
          {
            id: 6,
            doanhNghiepKB: "Công ty TNHH Test",
            doanhNghiepXNK: "Công ty TNHH Test",
            tenDoanhNghiep: "Công ty TNHH Test", 
            maDoanhNghiep: "0201399999",
            soToKhai: "678901234",
            maHQ: "678901234",
            ngayHQ: "08/09/2025",
            ngayToKhai: "08/09/2025",
            ngayPhi: "08/09/2025", 
            loai: "Chưa ký",
            loaiHinhKinhDoanh: "Container",
            thongBao: "TB29",
            soTB: "TB29", 
            trangThai: "Mới tạo",
            thanhTien: 500000,
            ghiChu: "Tờ khai phí container",
            createdAt: "2025-09-08T13:00:00.000Z"
          },
          {
            id: 7,
            doanhNghiepKB: "Công ty TNHH Test",
            doanhNghiepXNK: "Công ty TNHH Test",
            tenDoanhNghiep: "Công ty TNHH Test", 
            maDoanhNghiep: "0201399999",
            soToKhai: "789012345",
            maHQ: "789012345",
            ngayHQ: "08/09/2025",
            ngayToKhai: "08/09/2025",
            ngayPhi: "08/09/2025", 
            loai: "Chưa ký",
            loaiHinhKinhDoanh: "Container",
            thongBao: "TB32",
            soTB: "TB32", 
            trangThai: "Mới tạo",
            thanhTien: 500000,
            ghiChu: "Tờ khai phí container",
            createdAt: "2025-09-08T14:00:00.000Z"
          },
          {
            id: 8,
            doanhNghiepKB: "Công ty TNHH Xuất Nhập Khẩu ABC",
            doanhNghiepXNK: "Công ty TNHH Xuất Nhập Khẩu ABC",
            tenDoanhNghiep: "Công ty TNHH Xuất Nhập Khẩu ABC", 
            maDoanhNghiep: "0201392117",
            soToKhai: "890123456",
            maHQ: "400500600",
            ngayHQ: "08/09/2025",
            ngayToKhai: "08/09/2025",
            ngayPhi: "08/09/2025", 
            loai: "Chưa ký",
            loaiHinhKinhDoanh: "Container",
            thongBao: "TB1",
            soTB: "TB1", 
            trangThai: "Đã ký",
            thanhTien: 2500000,
            ghiChu: "Tờ khai phí container xuất khẩu",
            createdAt: "2025-09-08T15:00:00.000Z"
          },
          {
            id: 9,
            doanhNghiepKB: "Công ty TNHH Test",
            doanhNghiepXNK: "Công ty TNHH Test",
            tenDoanhNghiep: "Công ty TNHH Test", 
            maDoanhNghiep: "0201399999",
            soToKhai: "901234567",
            maHQ: "901234567",
            ngayHQ: "08/09/2025",
            ngayToKhai: "08/09/2025",
            ngayPhi: "08/09/2025", 
            loai: "Chưa ký",
            loaiHinhKinhDoanh: "Container",
            thongBao: "TB36",
            soTB: "TB36", 
            trangThai: "Mới tạo",
            thanhTien: 500000,
            ghiChu: "Tờ khai phí container",
            createdAt: "2025-09-08T16:00:00.000Z"
          },
          {
            id: 10,
            doanhNghiepKB: "Công ty TNHH Test",
            doanhNghiepXNK: "Công ty TNHH Test",
            tenDoanhNghiep: "Công ty TNHH Test", 
            maDoanhNghiep: "0201399999",
            soToKhai: "012345678",
            maHQ: "012345678",
            ngayHQ: "08/09/2025",
            ngayToKhai: "08/09/2025",
            ngayPhi: "08/09/2025", 
            loai: "Chưa ký",
            loaiHinhKinhDoanh: "Container",
            thongBao: "TB30",
            soTB: "TB30", 
            trangThai: "Mới tạo",
            thanhTien: 500000,
            ghiChu: "Tờ khai phí container",
            createdAt: "2025-09-08T17:00:00.000Z"
          }
        ]);
      }
    } catch (error: any) {
      console.error('💥 Failed to load fee declarations:', error);
      setError(error?.message || 'Failed to load fee declarations');
      showError(`Lỗi tải dữ liệu: ${error.message}`, 'Lỗi');
      
      // Fallback to mock data on error
      setFilteredData([
        {
          id: 1,
          doanhNghiepKB: "Công ty TNHH Xuất Nhập Khẩu ABC",
          doanhNghiepXNK: "Công ty TNHH Xuất Nhập Khẩu ABC",
          tenDoanhNghiep: "Công ty TNHH Xuất Nhập Khẩu ABC",
          maDoanhNghiep: "0201392117",
          soToKhai: "111222333",
          maHQ: "500600700",
          ngayHQ: "08/09/2025",
          ngayToKhai: "08/09/2025",
          ngayPhi: "08/09/2025",
          loai: "Lấy thông báo",
          loaiHinhKinhDoanh: "Container", 
          thongBao: "TB25",
          soTB: "TB25",
          trangThai: "Mới tạo",
          thanhTien: 12500000,
          ghiChu: "Dữ liệu mẫu khi có lỗi API",
          createdAt: "2025-09-08T08:00:00.000Z"
        },
        {
          id: 2,
          doanhNghiepKB: "Công ty TNHH Test",
          doanhNghiepXNK: "Công ty TNHH Test",
          tenDoanhNghiep: "Công ty TNHH Test",
          maDoanhNghiep: "0201398888",
          soToKhai: "444555666",
          maHQ: "444555666",
          ngayHQ: "08/09/2025",
          ngayToKhai: "08/09/2025",
          ngayPhi: "08/09/2025",
          loai: "Chưa ký",
          loaiHinhKinhDoanh: "Container", 
          thongBao: "TB26",
          soTB: "TB26",
          trangThai: "Đã ký",
          thanhTien: 500000,
          ghiChu: "Dữ liệu mẫu khi có lỗi API",
          createdAt: "2025-09-08T09:00:00.000Z"
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to display status
  const getStatusDisplay = (status: string) => {
    const statusMap: Record<string, string> = {
      'DRAFT': 'Mới tạo',
      'SUBMITTED': 'Đã ký',
      'APPROVED': 'Đã ký',
      'REJECTED': 'Mới tạo',
      'COMPLETED': 'Đã ký',
      'CANCELLED': 'Mới tạo',
      'NEW': 'Mới tạo',
      'SIGNED': 'Đã ký',
      'PENDING': 'Mới tạo',
    };
    return statusMap[status] || (status ? 'Mới tạo' : 'Mới tạo');
  };

  useEffect(() => {
    const initializeData = async () => {
      // Load supporting data first (companies, fee types)
      await loadSupportingData();
      
      // Then load main data
      await loadFeeDeclarations();
    };
    
    initializeData();
  }, []);

  return (
    <div className="w-full text-[14px] relative">
      <div className="card-body">
        {/* Enhanced API Status Bar - Hidden per user request */}
        {false && (
        <div className="bg-gray-50 -m-[10px] mb-[5px] p-[8px] border-b border-[#e6e6e6]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  loading ? 'bg-yellow-500 animate-pulse' : 
                  isApiConnected ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className="text-sm font-medium">
                  CRM API: {
                    loading ? 'Đang kiểm tra...' :
                    isApiConnected ? 'Kết nối' : 'Không kết nối'
                  }
                </span>
                <span className="text-xs text-gray-500">
                  (10.14.122.24:8081)
                </span>
                {connectionDetails && (
                  <span className="text-xs text-blue-600 cursor-help" 
                        title={JSON.stringify(connectionDetails, null, 2)}>
                    ℹ️ Chi tiết
                  </span>
                )}
              </div>
              {error && (
                <div className="text-red-600 text-xs max-w-md truncate" title={error ?? ''}>
                  Lỗi: {error}
                </div>
              )}
              {connectionDetails && !isApiConnected && (
                <div className="text-orange-600 text-xs">
                  {connectionDetails.endpoints?.[0]?.error || 'Connection failed'}
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {connectionDetails?.networkInfo?.onLine === false && (
                <span className="text-red-600 text-xs">⚠️ Offline</span>
              )}
              {!isApiConnected && (
                <button
                  onClick={() => setShowDiagnosticPanel(true)}
                  className="btn btn-sm btn-outline-warning rounded text-xs px-2 py-1"
                  title="Chẩn đoán kết nối"
                >
                  🔧 Chẩn đoán
                </button>
              )}
              <button
                onClick={loadFeeDeclarations}
                disabled={loading}
                className="btn btn-sm btn-outline-secondary rounded text-xs px-2 py-1"
              >
                {loading ? '🔄' : '🔁'} Tải lại
              </button>
            </div>
          </div>
          
          {/* Connection Details (Debug Mode) */}
          {connectionDetails && !isApiConnected && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs">
              <div className="font-semibold text-red-800 mb-1">🔍 Thông tin debug:</div>
              <div className="space-y-1">
                {connectionDetails.endpoints?.map((endpoint: any, index: number) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-gray-600">{endpoint.name}:</span>
                    <span className={endpoint.success ? 'text-green-600' : 'text-red-600'}>
                      {endpoint.success ? '✅ OK' : `❌ ${endpoint.error}`} 
                      ({endpoint.duration}ms)
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-2 pt-2 border-t border-red-200 text-gray-600">
                <div><strong>Khắc phục:</strong></div>
                <div>1. Kiểm tra server CRM có đang chạy không</div>
                <div>2. Kiểm tra network và firewall</div>
                <div>3. Xem Swagger: http://10.14.122.24:8081/PHT_BE/swagger-ui/index.html</div>
              </div>
            </div>
          )}
        </div>
        )}

        <div className="bg-white -m-[10px] mb-[10px] p-[10px] pb-[5px] border-b border-[#e6e6e6]">
          <div className="inline-block">
            {/* Main Action Buttons */}
            <div className="mb-2 flex items-center gap-1">
              <button
                type="button"
                className="btn btn-success btn-padding rounded flex items-center"
                onClick={handleDigitalSign}
                disabled={loading}
              >
                <PencilSquareIcon className="w-4 h-4" />
                &nbsp;Ký số tờ khai
              </button>
              <button
                className="btn btn-info btn-padding rounded flex items-center"
                type="button"
                onClick={() => setShowFeeInfoModal(true)}
              >
                <PlusCircleIcon className="w-4 h-4 " />
                &nbsp;Thêm mới
              </button>
              <button
                className="btn btn-warning btn-padding rounded flex items-center"
                type="button"
                onClick={() => setShowCompanyModal(true)}
              >
                🏢&nbsp;Quản lý công ty
              </button>
              <button
                className="btn btn-primary btn-padding rounded flex items-center"
                type="button"
                onClick={async () => {
                  try {
                    showInfo('Đang tạo thông báo phí...', 'Xử lý');
                    // TODO: Implement create notification
                    showSuccess('Chức năng đang phát triển', 'Thông báo');
                  } catch (error: any) {
                    showError(`Lỗi: ${error.message}`, 'Lỗi');
                  }
                }}
              >
                📋&nbsp;Tạo thông báo phí
              </button>
            </div>
            
            {/* Secondary Action Buttons */}
            <div className="mb-2 flex items-center gap-1">
              <button
                className="btn btn-outline-primary btn-sm rounded flex items-center"
                type="button"
                onClick={async () => {
                  try {
                    showInfo('Đang xuất báo cáo...', 'Xử lý');
                    const today = new Date().toISOString().split('T')[0];
                    await CrmApiService.getDailyReports(today);
                    showSuccess('Xuất báo cáo thành công!', 'Thành công');
                  } catch (error: any) {
                    showError(`Lỗi xuất báo cáo: ${error.message}`, 'Lỗi');
                  }
                }}
              >
                📊&nbsp;Báo cáo ngày
              </button>
              <button
                className="btn btn-outline-secondary btn-sm rounded flex items-center"
                type="button"
                onClick={loadFeeDeclarations}
                disabled={loading}
              >
                {loading ? '🔄' : '🔁'}&nbsp;Làm mới dữ liệu
              </button>
              <button
                className="btn btn-outline-info btn-sm rounded flex items-center"
                type="button"
                onClick={async () => {
                  try {
                    const companies = await CrmApiService.getAllCompanies();
                    showInfo(`Tìm thấy ${companies.data?.length || 0} công ty`, 'Thông tin');
                  } catch (error: any) {
                    showError(`Lỗi: ${error.message}`, 'Lỗi');
                  }
                }}
              >
                🔍&nbsp;Kiểm tra kết nối
              </button>
            </div>
            
            <i className="pt-[5px] inline-block text-gray-600">
              (Tích chọn tờ khai bên dưới để ký số • {totalRecords} tờ khai • {selectedItems.length} đã chọn)
            </i>
          </div>
          <div className="text-right float-right">
            Ngày khai phí, Từ:&nbsp;
            <div className="inline-block input-group">
              <input
                type="date"
                name="fromDate"
                value={searchFilters.fromDate}
                onChange={(e) => handleFilterChange('fromDate', e.target.value)}
                className="border px-2 pt-1 focus:bg-white item-search"
              />
            </div>
            <div className="inline-block input-group">
              <input
                type="date"
                name="toDate"
                value={searchFilters.toDate}
                onChange={(e) => handleFilterChange('toDate', e.target.value)}
                className="border px-2 pt-1 focus:bg-white item-search"
              />
            </div>
            <select 
              name="LOAI_TOKHAI" 
              className="item-search"
              value={searchFilters.declarationType}
              onChange={(e) => handleFilterChange('declarationType', e.target.value)}
            >
              <option value="">--Loại tờ khai--</option>
              <option value="100">1. Hàng container</option>
              <option value="101">2. Hàng rời, lỏng, kiện</option>
              <option value="102">3. Hàng container CFS</option>
            </select>
            <select 
              name="LOAI_THANH_TOAN" 
              className="item-search"
              value={searchFilters.paymentType}
              onChange={(e) => handleFilterChange('paymentType', e.target.value)}
            >
              <option value="">--Thanh toán--</option>
              <option value="CK">Chuyển khoản ngân hàng</option>
              <option value="EC">Thanh toán bằng tài khoản ngân hàng</option>
              <option value="QR">Thanh toán bằng mã QR</option>
              <option value="TM">Tiền mặt</option>
            </select>
            <select 
              name="LOAI_DULIEU" 
              className="item-search"
              value={searchFilters.dataSource}
              onChange={(e) => handleFilterChange('dataSource', e.target.value)}
            >
              <option value="">--Nguồn khai--</option>
              <option value="WEBSITE">Từ website</option>
              <option value="WEBSERVICE">Từ phần mềm eCus</option>
            </select>
            <select 
              name="TRANG_THAI_TOKHAI" 
              className="item-search width127px"
              value={searchFilters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="-3">--Trạng thái tờ khai--</option>
              <option value="0">1. Thêm mới</option>
              <option value="1">2. Đã ký số</option>
              <option value="2">3. Đã có thông báo phí</option>
              <option value="3">4. Đã có biên lai</option>
              <option value="-1">5. Tờ khai hủy(chưa có biên lai)</option>
              <option value="-2">6. Biên lai hủy</option>
            </select>
            <br />
            <select 
              name="NHOM_LOAIHINH" 
              className="item-search w-[242px]"
              value={searchFilters.feeGroup}
              onChange={(e) => handleFilterChange('feeGroup', e.target.value)}
            >
              <option value="">-- Nhóm loại phí --</option>
              <option value="TP001">
                TP001 - Hàng tạm nhập tái xuất; Hàng tái xuất tạm nhập; Hàng quá cảnh
              </option>
              <option value="TP002">
                TP002 - Hàng hóa nhập khẩu, xuất khẩu mở tờ khai ngoài TP.HCM
              </option>
              <option value="TP003">
                TP003 - Hàng hóa nhập khẩu, xuất khẩu mở tờ khai tại TP.HCM
              </option>
              <option value="TP004">
                TP004 - Hàng gửi kho ngoại quan; Hàng chuyển khẩu được đưa vào khu vực kho bãi thuộc các cảng biển thành phố
              </option>
            </select>
            <input
              name="MA_DV"
              placeholder="Mã doanh nghiệp"
              className="item-search width127px form-control"
              value={searchFilters.companyCode}
              onChange={(e) => handleFilterChange('companyCode', e.target.value)}
            />
            <input
              name="SO_TK"
              placeholder="Số TK"
              className="item-search width127px form-control"
              value={searchFilters.declarationNumber}
              onChange={(e) => handleFilterChange('declarationNumber', e.target.value)}
            />
            <input
              name="SO_THONG_BAO"
              placeholder="Số thông báo"
              className="item-search width127px form-control"
              value={searchFilters.notificationNumber}
              onChange={(e) => handleFilterChange('notificationNumber', e.target.value)}
            />
            <button 
              className="btn btn-primary width127px item-search rounded pt-[4px] mr-2"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? '🔄' : '🔍'}&nbsp;Tìm kiếm
            </button>
            <button 
              className="btn btn-secondary width127px item-search rounded pt-[4px]"
              onClick={handleResetSearch}
              disabled={loading}
              style={{
                backgroundColor: 'rgb(40, 129, 255)',
                borderColor: 'rgb(40, 129, 255)',
                color: 'white',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = 'rgb(30, 109, 235)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = 'rgb(40, 129, 255)';
                  e.currentTarget.style.transform = 'translateY(0px)';
                }
              }}
            >
              🔄&nbsp;Reset
            </button>
          </div>
          <div className="clear-both"></div>
        </div>
        <div className="frame-body">
          <table className="w-full min-w-[1700px]" id="TBLDANHSACH">
            <thead>
              <tr>
                <th className="sticky-header w-[50px] table-header">STT</th>
                <th className="sticky-header w-[50px] table-header">
                  <label>
                    <input 
                      type="checkbox" 
                      name="CHECKBOX_ALL" 
                      checked={selectedItems.length === filteredData.length && filteredData.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                    <span className="lbl color-key"></span>
                  </label>
                </th>
                <th className="sticky-header w-[50px] table-header">#</th>
                <th className="sticky-header table-header">Doanh nghiệp</th>
                <th className="sticky-header w-[100px] table-header">
                  TK hải quan
                </th>
                <th className="sticky-header w-[100px] table-header">
                  Ngày TK HQ
                </th>
                <th className="sticky-header w-[120px] table-header">
                  Ngày khai phí
                </th>
                <th className="sticky-header w-[100px] table-header">
                  Loại tờ khai
                </th>
                <th className="sticky-header w-[120px] table-header">
                  Lấy thông báo
                </th>
                <th className="sticky-header table-header">Số thông báo</th>
                <th className="sticky-header table-header">Trạng thái</th>
                <th className="sticky-header w-[100px]">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={11} className="text-center text-blue-600">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : (
                filteredData.map((row, idx) => (
                  <tr
                    key={row.id}
                    className={`h-[60px] ${
                      idx % 2 === 0 ? "bg-white" : "bg-blue-50"
                    } hover:bg-blue-100`}
                  >
                    <td className="text-center">{idx + 1}</td>
                    <td className="text-center">
                      <input 
                        type="checkbox" 
                        name={`CHECKBOX_${row.id}`}
                        checked={selectedItems.includes(row.id)}
                        onChange={(e) => handleCheckboxChange(row.id, e.target.checked)}
                      />
                    </td>
                    <td className="text-center">
                      <button
                        onClick={() => handleViewNote(row)}
                        className="text-blue-600 hover:text-blue-800 cursor-pointer p-1 rounded hover:bg-blue-50"
                        title="Xem chi tiết"
                      >
                        <i className="fas fa-sticky-note"></i>
                      </button>
                    </td>
                    <td>{row.doanhNghiepKB || row.doanhNghiepXNK || 'Công ty TNHH Test'}</td>
                    <td>{row.maHQ}</td>
                    <td>{row.ngayHQ}</td>
                    <td>{row.ngayPhi}</td>
                    <td>{row.loai}</td>
                    <td className="text-center">
                      {row.trangThai === 'Đã ký số' ? (
                        <button
                          onClick={() => handleGetNotification(row)}
                          disabled={loading || row.thongBao === 'Đã lấy'}
                          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                            row.thongBao === 'Đã lấy'
                              ? 'bg-green-100 text-green-800 border border-green-300 cursor-not-allowed'
                              : 'bg-blue-500 text-white border border-blue-600 hover:bg-blue-600 cursor-pointer'
                          }`}
                        >
                          {row.thongBao === 'Đã lấy' ? 'Đã lấy' : 'Lấy thông báo'}
                        </button>
                      ) : (
                        <span className="text-gray-500 text-xs">
                          {row.thongBao}
                        </span>
                      )}
                    </td>
                    <td>{row.soTB}</td>
                    <td className="text-center">
                      <span 
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          row.trangThai === 'Đã ký số' 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                            : row.trangThai === 'Hoàn thành'
                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                            : row.trangThai === 'Thêm mới'
                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                            : row.trangThai === 'Đang xử lý'
                            ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                            : row.trangThai === 'Chưa ký số'
                            ? 'bg-orange-100 text-orange-800 border border-orange-300'
                            : 'bg-gray-100 text-gray-800 border border-gray-300'
                        }`}
                      >
                        {row.trangThai}
                      </span>
                    </td>
                    <td className="text-right">
                      {row.thanhTien.toLocaleString()} đ
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Fixed Pagination */}
        <div className="sticky bottom-0 z-10 bg-gray-100 border-t border-gray-300 px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="text-sm text-gray-600">
            Hiển thị 1-{totalRecords} trong tổng số {totalRecords} bản ghi
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              ‹ Trước
            </Button>
            <span className="px-3 py-1 bg-blue-500 text-white text-sm rounded">
              1
            </span>
            <Button variant="outline" size="sm" disabled>
              Sau ›
            </Button>
          </div>
        </div>
      </div>
      {showFeeInfoModal && (
        <div className="absolute inset-0 z-10 bg-white shadow-lg h-[86vh]">
          <FeeInformationFormModal 
            onClose={() => setShowFeeInfoModal(false)} 
            onSave={handleSaveNewDeclaration}
          />
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedRowData && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            width: '800px',
            maxWidth: '95vw',
            maxHeight: '95vh',
            borderRadius: '12px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '20px 24px',
              borderBottom: '2px solid #e5e7eb',
              backgroundColor: '#f8fafc'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                marginRight: '16px'
              }}>
                <i className="fas fa-info-circle" style={{ color: 'white', fontSize: '18px' }}></i>
              </div>
              <h3 style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: '700',
                color: '#1f2937',
                letterSpacing: '0.5px'
              }}>
                Chi Tiết Thông Tin Tờ Khai
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  fontSize: '16px',
                  color: '#ef4444',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#ef4444';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                  e.currentTarget.style.color = '#ef4444';
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ 
              padding: '24px',
              maxHeight: 'calc(95vh - 120px)',
              overflowY: 'auto'
            }}>
              {/* Info Cards Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px',
                marginBottom: '24px'
              }}>
                {/* Left Column */}
                <div style={{
                  background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid #b3e5fc'
                }}>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#0369a1',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <i className="fas fa-building mr-2"></i>
                    Thông Tin Doanh Nghiệp
                  </h4>
                  
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Doanh nghiệp:</span>
                      <div style={{ fontSize: '14px', color: '#1e293b', fontWeight: '600', marginTop: '2px' }}>
                        {selectedRowData.doanhNghiepKB || selectedRowData.doanhNghiepXNK || 'Công ty TNHH Test'}
                      </div>
                    </div>
                    
                    <div>
                      <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Mã doanh nghiệp:</span>
                      <div style={{ fontSize: '14px', color: '#1e293b', fontWeight: '600', marginTop: '2px' }}>
                        {selectedRowData.maDoanhNghiep || '0201399999'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div style={{
                  background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid #bbf7d0'
                }}>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#059669',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <i className="fas fa-file-alt mr-2"></i>
                    Thông Tin Tờ Khai
                  </h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Mã hải quan:</span>
                      <div style={{ fontSize: '14px', color: '#1e293b', fontWeight: '600', marginTop: '2px' }}>
                        {selectedRowData.maHQ}
                      </div>
                    </div>
                    
                    <div>
                      <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Loại tờ khai:</span>
                      <div style={{ fontSize: '14px', color: '#1e293b', fontWeight: '600', marginTop: '2px' }}>
                        {selectedRowData.loai}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details Table */}
              <div style={{
                background: '#ffffff',
                borderRadius: '12px',
                border: '2px solid #e5e7eb',
                overflow: 'hidden'
              }}>
                <div style={{
                  background: 'linear-gradient(90deg, #1f2937 0%, #374151 100%)',
                  padding: '16px 20px',
                  color: 'white'
                }}>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <i className="fas fa-list-alt mr-2"></i>
                    Chi Tiết Thông Tin
                  </h4>
                </div>

                <div style={{ padding: '20px' }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px'
                  }}>
                    <div style={{ padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
                      <span style={{ fontSize: '12px', color: '#6b7280', display: 'block' }}>ID:</span>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>{selectedRowData.id}</span>
                    </div>

                    <div style={{ padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
                      <span style={{ fontSize: '12px', color: '#6b7280', display: 'block' }}>Ngày HQ:</span>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>{selectedRowData.ngayHQ}</span>
                    </div>

                    <div style={{ padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
                      <span style={{ fontSize: '12px', color: '#6b7280', display: 'block' }}>Ngày phí:</span>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>{selectedRowData.ngayPhi}</span>
                    </div>

                    <div style={{ padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
                      <span style={{ fontSize: '12px', color: '#6b7280', display: 'block' }}>Thông báo:</span>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>{selectedRowData.thongBao}</span>
                    </div>

                    <div style={{ padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
                      <span style={{ fontSize: '12px', color: '#6b7280', display: 'block' }}>Số TB:</span>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>{selectedRowData.soTB}</span>
                    </div>

                    <div style={{ padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
                      <span style={{ fontSize: '12px', color: '#6b7280', display: 'block' }}>Trạng thái:</span>
                      <span style={{ 
                        fontSize: '14px', 
                        fontWeight: '600', 
                        color: selectedRowData.trangThai === 'Hoàn thành' ? '#059669' : '#d97706',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        background: selectedRowData.trangThai === 'Hoàn thành' ? '#ecfccb' : '#fef3c7'
                      }}>
                        {selectedRowData.trangThai}
                      </span>
                    </div>


                    <div style={{ padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
                      <span style={{ fontSize: '12px', color: '#6b7280', display: 'block' }}>Thành tiền:</span>
                      <span style={{ fontSize: '16px', fontWeight: '700', color: '#dc2626' }}>
                        {selectedRowData.thanhTien?.toLocaleString()} đ
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              borderTop: '1px solid #e5e7eb',
              padding: '16px 24px',
              backgroundColor: '#f8fafc',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                onClick={() => setShowDetailModal(false)}
                style={{
                  backgroundColor: '#6b7280',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#4b5563';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#6b7280';
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Digital Sign Confirmation Modal */}
      {showSignConfirmModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            width: '500px',
            maxWidth: '90vw',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            position: 'relative',
            border: '2px solid #2563eb'
          }}>
            {/* Modal Header */}
            <div style={{
              background: 'linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%)',
              padding: '12px 20px',
              color: 'white',
              borderRadius: '6px 6px 0 0'
            }}>
              <h3 style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: '600',
                textAlign: 'center'
              }}>
                THÔNG BÁO
              </h3>
            </div>

            {/* Modal Content */}
            <div style={{ 
              padding: '20px',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '14px',
                color: '#374151',
                lineHeight: '1.6',
                marginBottom: '24px'
              }}>
                Bạn có chắc chắn muốn ký số các tờ khai đang chọn lên hệ thống không?
                <br />
                <span style={{ fontWeight: '600', color: '#dc2626' }}>
                  Chú ý: Sau khi tờ khai đã được ký số sẽ bạn sẽ không thể thay đổi thông tin được nữa.
                </span>
              </div>

              <div style={{
                fontSize: '13px',
                color: '#6b7280',
                marginBottom: '20px',
                fontStyle: 'italic'
              }}>
                Số lượng tờ khai được chọn: <strong>{selectedItems.length}</strong>
              </div>

              {/* Action Buttons */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center',
                gap: '12px'
              }}>
                <button
                  onClick={handleConfirmDigitalSign}
                  style={{
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px 20px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#1d4ed8';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#2563eb';
                  }}
                >
                  <i className="fas fa-signature"></i>
                  Thực hiện ký số
                </button>

                <button
                  onClick={() => setShowSignConfirmModal(false)}
                  style={{
                    backgroundColor: '#6b7280',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px 20px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#4b5563';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#6b7280';
                  }}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Selection Modal */}
      {showCertificateModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{ backgroundColor: '#fff', width: '560px', maxWidth: '95vw', borderRadius: '10px', boxShadow: '0 10px 30px rgba(0,0,0,0.25)' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, textAlign: 'center', color: '#111827' }}>Danh sách chữ ký số</h3>
            </div>
            <div style={{ padding: '16px 18px', maxHeight: '60vh', overflowY: 'auto' }}>
              {availableCertificates.length === 0 ? (
                <div className="text-center text-gray-600">Không tìm thấy chứng thư số.</div>
              ) : (
                <div>
                  <div className="text-sm text-gray-600 mb-2">Chọn chữ ký số để thực hiện ký tờ khai đã chọn.</div>
                  <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                    {availableCertificates.map((cert, idx) => {
                      const name = getCertificateDisplayName(cert);
                      return (
                        <label key={cert.serialNumber || idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 12px', borderBottom: idx < availableCertificates.length - 1 ? '1px solid #f3f4f6' : 'none', cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name="certificate"
                            value={cert.serialNumber}
                            checked={selectedCertificateSerial === cert.serialNumber}
                            onChange={() => setSelectedCertificateSerial(cert.serialNumber)}
                            style={{ marginTop: '3px' }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, color: '#111827' }}>{name}</div>
                            <div style={{ fontSize: '12px', color: '#374151' }}>Serial: {cert.serialNumber}</div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>Issuer: {cert.issuer}</div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>Valid: {cert.validFrom} → {cert.validTo}</div>
                          </div>
                        </label>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
            <div style={{ padding: '12px 18px', borderTop: '1px solid #e5e7eb', background: '#f9fafb', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => { setShowCertificateModal(false); setSelectedCertificateSerial(''); }}
                style={{ backgroundColor: '#6b7280', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 16px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}
              >Đóng</button>
              <button
                onClick={handleSignWithSelectedCertificate}
                disabled={!selectedCertificateSerial || loading}
                style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 16px', fontSize: '14px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}
              >Thực hiện ký số</button>
            </div>
          </div>
        </div>
      )}

      {/* Network Diagnostic Panel */}
      {showDiagnosticPanel && (
        <NetworkDiagnosticPanel onClose={() => setShowDiagnosticPanel(false)} />
      )}

      {/* Company Management Modal */}
      {showCompanyModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            width: '900px',
            maxWidth: '95vw',
            maxHeight: '90vh',
            borderRadius: '12px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '20px 24px',
              borderBottom: '2px solid #e5e7eb',
              backgroundColor: '#f8fafc'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                marginRight: '16px'
              }}>
                <i className="fas fa-building" style={{ color: 'white', fontSize: '18px' }}></i>
              </div>
              <h3 style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: '700',
                color: '#1f2937',
                letterSpacing: '0.5px'
              }}>
                Quản Lý Công Ty
              </h3>
              <button
                onClick={() => setShowCompanyModal(false)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  fontSize: '16px',
                  color: '#ef4444',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#ef4444';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                  e.currentTarget.style.color = '#ef4444';
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ 
              padding: '24px',
              maxHeight: 'calc(90vh - 120px)',
              overflowY: 'auto'
            }}>
              {/* Company List */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px'
                }}>
                  <h4 style={{ margin: 0, fontSize: '18px', color: '#374151' }}>
                    Danh Sách Công Ty ({companies.length})
                  </h4>
                  <button
                    onClick={async () => {
                      try {
                        showInfo('Đang tải danh sách công ty...', 'Xử lý');
                        const response = await CrmApiService.getAllCompanies();
                        if (response && response.data) {
                          setCompanies(response.data);
                          showSuccess(`Đã tải ${response.data.length} công ty`, 'Thành công');
                        }
                      } catch (error: any) {
                        showError(`Lỗi tải công ty: ${error.message}`, 'Lỗi');
                      }
                    }}
                    style={{
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 16px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    🔄 Làm mới
                  </button>
                </div>

                {/* Companies Table */}
                <div style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f9fafb' }}>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>ID</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Tên Công Ty</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Mã Số Thuế</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Trạng Thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {companies.length > 0 ? (
                        companies.slice(0, 10).map((company: any, index: number) => (
                          <tr key={company.id || index} style={{
                            borderBottom: index < Math.min(companies.length, 10) - 1 ? '1px solid #f3f4f6' : 'none'
                          }}>
                            <td style={{ padding: '12px' }}>{company.id || '-'}</td>
                            <td style={{ padding: '12px', fontWeight: '500' }}>{company.companyName || company.tenCongTy || 'Công ty TNHH Test'}</td>
                            <td style={{ padding: '12px' }}>{company.taxCode || company.maSoThue || '0201399999'}</td>
                            <td style={{ padding: '12px' }}>
                              <span style={{
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontWeight: '500',
                                backgroundColor: company.status === 'ACTIVE' ? '#d1fae5' : '#fee2e2',
                                color: company.status === 'ACTIVE' ? '#065f46' : '#991b1b'
                              }}>
                                {company.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>
                            Chưa có dữ liệu công ty. Nhấn "Làm mới" để tải từ server.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {companies.length > 10 && (
                  <p style={{ marginTop: '12px', fontSize: '14px', color: '#6b7280', textAlign: 'center' }}>
                    Hiển thị 10/{companies.length} công ty đầu tiên
                  </p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              borderTop: '1px solid #e5e7eb',
              padding: '16px 24px',
              backgroundColor: '#f8fafc',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                onClick={() => setShowCompanyModal(false)}
                style={{
                  backgroundColor: '#6b7280',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#4b5563';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#6b7280';
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

export default Declare;
