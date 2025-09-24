import {
  ArrowLeftCircleIcon,
  ChevronDoubleRightIcon,
  MagnifyingGlassIcon,
  WindowIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import React, { useState } from "react";
import FeeDeclarationForm from "./FeeDeclarationForm";
import CargoTabs from "./FeeDeclaretionFooterTable";
import { useNotification } from "../../../../context/NotificationContext";
import { useAuth } from "../../../../context/AuthContext";
import { FeeDeclarationApiService, type TokhaiThongtinResponse, type TokhaiThongtinCreateRequest, type TokhaiThongtinChiTietCreateRequest } from "../../../../utils/feeDeclarationApi";

interface FeeInformationFormModalProps {
  onClose: () => void;
  onSave?: (data: any) => void;
  mode?: 'create' | 'view';
  initialData?: TokhaiThongtinResponse | any;
  asPopup?: boolean;
}

export default function FeeInformationFormModal({ onClose, onSave, mode = 'create', initialData, asPopup = false }: FeeInformationFormModalProps) {
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isManualDeclaration, setIsManualDeclaration] = useState(false);
  const [companyCode, setCompanyCode] = useState("");
  const [customsDeclarationNumber, setCustomsDeclarationNumber] = useState("");
  const [fetchedData, setFetchedData] = useState<TokhaiThongtinResponse[]>([]);
  const [selectedTokhai, setSelectedTokhai] = useState<TokhaiThongtinResponse | null>(null);
  const [showSelectedData, setShowSelectedData] = useState(false);
  const { showSuccess, showError, showInfo } = useNotification();
  const { user } = useAuth();
  const modalRootRef = React.useRef<HTMLDivElement | null>(null);

  // Hàm xác định bước hiện tại dựa trên trạng thái
  const getCurrentStep = () => {
    if (mode === 'view' && initialData) {
      const status = initialData.trangThai || '';
      console.log('🔍 Checking status for progress bar:', status);
      
      if (status === 'Đã ký số' || status === '01') {
        return 2; // Kích hoạt bước 2 khi đã ký số
      } else if (status === 'Đã lấy thông báo' || status === 'Đã lấy' || status === '02') {
        return 3; // Kích hoạt bước 3 khi đã lấy thông báo
      } else if (status === 'Đã tính phí' || status === '03' || status === 'Đã ký lần 2') {
        return 3; // Kích hoạt bước 3 khi đã tính phí hoặc đã ký lần 2
      } else if (status === 'Hoàn thành' || status === '04') {
        return 5; // Kích hoạt bước 5 khi hoàn thành
      } else if (status === 'Đang xử lý') {
        return 4; // Kích hoạt bước 4 khi đang xử lý
      }
    }
    return 1; // Mặc định là bước 1
  };

  const currentStep = getCurrentStep();

  // Hàm tạo style cho từng bước
  const getStepStyle = (stepNumber: number) => {
    const isActive = stepNumber <= currentStep;
    const isCurrentStep = stepNumber === currentStep;
    
    if (isActive) {
      // Bước 1 và bước 2 luôn giữ màu xanh dương gradient
      if (stepNumber === 1 || stepNumber === 2) {
        return {
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)',
          className: 'text-white'
        };
      }
      // Các bước khác (3, 4, 5)
      return {
        background: isCurrentStep 
          ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)' 
          : 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
        className: 'text-white'
      };
    } else {
      return {
        background: '#9ca3af',
        className: 'text-white'
      };
    }
  };

  // Hàm tạo style cho số bước
  const getStepNumberStyle = (stepNumber: number) => {
    const isActive = stepNumber <= currentStep;
    
    if (isActive) {
      return 'bg-white text-black';
    } else {
      return 'bg-gray-500 text-white';
    }
  };

  // Debug effect to monitor fetchedData changes
  React.useEffect(() => {
    console.log('🔄 fetchedData state changed:', {
      length: fetchedData.length,
      data: fetchedData
    });
  }, [fetchedData]);

  // Debug effect to monitor progress bar changes
  React.useEffect(() => {
    if (mode === 'view' && initialData) {
      console.log('🎯 Progress bar info:', {
        mode,
        status: initialData.trangThai,
        currentStep,
        initialData
      });
    }
  }, [mode, initialData, currentStep]);

  // Auto-fill company code from logged-in user
  React.useEffect(() => {
    if (user?.taxCode && !companyCode) {
      console.log('🏢 Auto-filling company code from logged-in user:', user.taxCode);
      setCompanyCode(user.taxCode);
    }
  }, [user, companyCode]);

  // View-only mode initializer (does not affect default 'create' usage)
  React.useEffect(() => {
    if (mode === 'view' && initialData) {
      try {
        setIsManualDeclaration(true);
        setSelectedTokhai(initialData as any);
        setShowSelectedData(true);
        // Try auto-fill when data is ready without showing error if state not yet set
        const tryAutoFill = (attempt: number) => {
          if (selectedTokhai) {
            handleAutoFillForm();
            return;
          }
          if (attempt < 10) {
            setTimeout(() => tryAutoFill(attempt + 1), 100);
          }
        };
        setTimeout(() => {
          tryAutoFill(0);
          // Lock inputs in view mode (only inside this modal)
          const container = modalRootRef.current;
          if (container) {
            const selectors = 'input, select, textarea, button';
            container.querySelectorAll(selectors).forEach((el) => {
              const element = el as HTMLInputElement;
              const isCloseBtn = element.getAttribute('data-allow-click') === 'true';
              if (isCloseBtn) return;
              if (element.tagName === 'BUTTON') {
                (element as HTMLButtonElement).disabled = true;
              } else {
                element.readOnly = true;
                element.disabled = true;
              }
            });
          }
        }, 250);
      } catch (e) {
        console.error('❌ Failed to init view mode:', e);
      }
    }
    // Cleanup: re-enable controls when unmount or mode changes
    return () => {
      const container = modalRootRef.current;
      if (container) {
        const selectors = 'input, select, textarea, button';
        container.querySelectorAll(selectors).forEach((el) => {
          const element = el as HTMLInputElement;
          if (element.tagName === 'BUTTON') {
            (element as HTMLButtonElement).disabled = false;
          } else {
            element.readOnly = false;
            element.disabled = false;
          }
        });
      }
    };
  }, [mode, initialData]);
  
  const handleCancelDeclaration = () => {
    setShowCancelConfirmModal(true);
  };

  const handleConfirmCancel = () => {
    // Handle cancel declaration logic
    console.log('Hủy tờ khai');
    setShowCancelConfirmModal(false);
    onClose();
  };

  const handleSignDeclaration = async () => {
    try {
      // Handle digital signature logic
      console.log('🔐 Bắt đầu ký số tờ khai (khai báo nộp phí)');
      
      // Simulate digital signature process
      console.log('⏳ Simulating signature process...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success popup only
      console.log('✅ Calling showSuccess notification...');
      showSuccess('Ký số tờ khai thành công!', 'Thành công');
      console.log('🎉 Digital signature completed successfully');
    } catch (error) {
      console.error('❌ Error during digital signature:', error);
      showError('Có lỗi xảy ra khi ký số tờ khai', 'Lỗi');
    }
  };

  const handleFeeOptionChange = (option: 'customs' | 'manual') => {
    setIsManualDeclaration(option === 'manual');
  };

  const handleGetInformation = async () => {
    try {
      setLoading(true);
      
      // Clear previous data first
      console.log('🧹 Clearing previous data...');
      setFetchedData([]);
      setSelectedTokhai(null);
      setShowSelectedData(false);
      
      showInfo('Đang lấy thông tin từ hệ thống...', 'Xử lý');
      
      console.log('🔍 Fetching tokhai information with params:', {
        companyCode,
        customsDeclarationNumber,
        companyCodeTrimmed: companyCode.trim(),
        customsDeclarationTrimmed: customsDeclarationNumber.trim(),
        companyCodeLength: companyCode.length,
        customsDeclarationLength: customsDeclarationNumber.length
      });
      
      // Call the API to get hai quan thong tin
      console.log('🌐 Calling API getHaiQuanThongTin...');
      let data: TokhaiThongtinResponse[];
      
      try {
        data = await FeeDeclarationApiService.getHaiQuanThongTin({
          soToKhaiHaiQuan: customsDeclarationNumber.trim() || undefined,
          maDoanhNghiep: companyCode.trim() || undefined
        });
        console.log('✅ Successfully called new API /hai-quan/lay-thong-tin');
      } catch (apiError) {
        console.warn('⚠️ New API failed, falling back to old API:', apiError);
        console.log('🔄 Falling back to getAllToKhaiThongTin...');
        
        // Fallback to old API
        data = await FeeDeclarationApiService.getAllToKhaiThongTin();
        
        // Apply frontend filtering for fallback
        if (companyCode.trim()) {
          data = data.filter(item => {
            const code1Match = item.maDoanhNghiepKhaiPhi?.includes(companyCode.trim());
            const code2Match = item.maDoanhNghiepXNK?.includes(companyCode.trim());
            return code1Match || code2Match;
          });
        }
        
        if (customsDeclarationNumber.trim()) {
          data = data.filter(item => {
            const tokhaiMatch = item.soToKhai?.includes(customsDeclarationNumber.trim());
            const haiquanMatch = item.maHaiQuan?.includes(customsDeclarationNumber.trim());
            return tokhaiMatch || haiquanMatch;
          });
        }
        
        console.log('✅ Fallback API completed with frontend filtering');
      }
      console.log('🌐 API call completed!');
      console.log('📊 Raw API Response:', data);
      console.log('📊 Data type:', typeof data);
      console.log('📊 Is Array:', Array.isArray(data));
      console.log('📊 Data length:', data?.length);
      
      // Check if API returned valid data and normalize to array
      let normalizedData: TokhaiThongtinResponse[];
      
      if (!data) {
        console.error('❌ Invalid API response - null or undefined:', data);
        showError('Dữ liệu trả về từ API không hợp lệ', 'Lỗi API');
        return;
      }
      
      if (Array.isArray(data)) {
        // API returned array (old format)
        normalizedData = data;
        console.log('✅ API returned array format:', normalizedData.length, 'items');
      } else if (typeof data === 'object' && data !== null && 'id' in data) {
        // API returned single object (new format)
        normalizedData = [data as TokhaiThongtinResponse];
        console.log('✅ API returned single object format, normalized to array:', normalizedData.length, 'item');
      } else {
        console.error('❌ Invalid API response format:', data);
        showError('Dữ liệu trả về từ API không đúng định dạng', 'Lỗi API');
        return;
      }
      
      if (normalizedData.length === 0) {
        console.warn('⚠️ API returned empty data');
        showInfo('Không có dữ liệu tờ khai nào trong hệ thống', 'Thông báo');
        return;
      }
      
      // Check for null maDoanhNghiepKhaiPhi
      const hasNullCompanyData = normalizedData.some(item => 
        !item.maDoanhNghiepKhaiPhi || item.maDoanhNghiepKhaiPhi === 'null' || item.maDoanhNghiepKhaiPhi === ''
      );
      
      if (hasNullCompanyData) {
        console.warn('⚠️ API returned data with null maDoanhNghiepKhaiPhi');
        showError('Không tìm thấy tờ khai trên cổng Hải Quan', 'Lỗi');
        return;
      }
      
      // API already returns filtered data based on parameters
      console.log('📋 API Response Summary:', {
        hasCompanyCode: !!companyCode.trim(),
        hasCustomsDeclaration: !!customsDeclarationNumber.trim(),
        companyCodeValue: companyCode.trim(),
        customsDeclarationValue: customsDeclarationNumber.trim(),
        returnedDataCount: normalizedData.length
      });
      
      console.log('🎯 Setting fetchedData state...');
      console.log('📊 State before setFetchedData:', fetchedData.length);
      console.log('📊 Normalized data to set:', normalizedData);
      
      setFetchedData(normalizedData);
      
      // Debug: Check if data has chiTietList
      normalizedData.forEach((item, index) => {
        console.log(`🔍 Item ${index + 1} chiTietList check:`, {
          hasChiTietList: !!item.chiTietList,
          chiTietListLength: item.chiTietList?.length || 0,
          chiTietList: item.chiTietList
        });
      });
      
      // Force multiple delays to check state updates
      setTimeout(() => {
        console.log('🎯 After 100ms - State should be updated');
        console.log('🎯 fetchedData.length now:', fetchedData.length);
      }, 100);
      
      setTimeout(() => {
        console.log('🎯 After 500ms - Final check');
        console.log('🎯 fetchedData.length now:', fetchedData.length);
      }, 500);
      
      console.log('🎯 Final result summary:', {
        returnedCount: normalizedData.length,
        hasCompanyFilter: !!companyCode.trim(),
        hasTokhaiFilter: !!customsDeclarationNumber.trim()
      });
      
      if (normalizedData.length > 0) {
        const filterApplied = companyCode.trim() || customsDeclarationNumber.trim();
        const message = filterApplied 
          ? `Tìm thấy ${normalizedData.length} tờ khai phù hợp với bộ lọc`
          : `Đã tải ${normalizedData.length} tờ khai từ hệ thống`;
        
        showSuccess(message, 'Thành công');
        console.log('✅ Found tokhai data:', normalizedData);
        
        // Show quick actions
        if (normalizedData.length === 1) {
          console.log('💡 Only one result found - auto-selecting and populating container data');
          // Auto-select the single result and populate container data
          const singleTokhai = normalizedData[0];
          setSelectedTokhai(singleTokhai);
          setShowSelectedData(true);
          
          // Auto-populate container data if available
          if (singleTokhai.chiTietList && singleTokhai.chiTietList.length > 0) {
            console.log('📦 Auto-populating container data for single result:', singleTokhai.chiTietList.length, 'containers');
            
            try {
              // Trigger container table population via custom event
              const containerEvent = new CustomEvent('populateContainers', {
                detail: {
                  containers: singleTokhai.chiTietList.map((container, index) => ({
                    id: container.id || index + 1,
                    stt: index + 1,
                    soVanDon: container.soVanDon || '',
                    soHieu: container.soHieu || '',
                    soSeal: container.soSeal || '',
                    loaiCont: container.maLoaiCont || '20',
                    tinhChatCont: container.maTcCont || 'KHO',
                    tongTrongLuong: container.tongTrongLuong || 0,
                    donViTinh: container.donViTinh || 'KG',
                    ghiChu: container.ghiChu || '',
                    maLoaiCont: container.maLoaiCont || '20',
                    maTcCont: container.maTcCont || 'KHO',
                    isEditing: true
                  }))
                }
              });
              window.dispatchEvent(containerEvent);
              console.log('📦 Auto-dispatched populateContainers event for single result');
            } catch (error) {
              console.error('❌ Error auto-populating container data:', error);
            }
          }
        } else if (normalizedData.length > 10) {
          console.log('💡 Many results found - consider adding more specific filters');
        }
      } else {
        showInfo('Không có dữ liệu tờ khai nào phù hợp với bộ lọc', 'Thông báo');
        console.log('⚠️ No data found with current filters');
      }
      
    } catch (error: any) {
      console.error('❌ Error fetching tokhai information:', error);
      
      // Check if it's the specific error about null maDoanhNghiepKhaiPhi
      if (error.message && error.message.includes('Không tìm thấy tờ khai trên cổng Hải Quan')) {
        showError(error.message, 'Lỗi');
      } else {
        showError('Có lỗi xảy ra khi lấy thông tin từ hệ thống', 'Lỗi');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTokhai = (tokhai: TokhaiThongtinResponse) => {
    setSelectedTokhai(tokhai);
    setShowSelectedData(true);
    
    // Clear the fetched data table to show selected data instead
    setFetchedData([]);
    
    showSuccess(`Đã chọn tờ khai: ${tokhai.soToKhai}`, 'Thành công');
    console.log('✅ Selected tokhai data:', tokhai);
    
    // TODO: Fill form with selected data
    // This would require integration with the FeeDeclarationForm component
  };

  const handleClearSelection = () => {
    setSelectedTokhai(null);
    setShowSelectedData(false);
    showInfo('Đã xóa lựa chọn', 'Thông báo');
  };

  // Sample data for testing
  const sampleData: TokhaiThongtinResponse[] = [
    {
      id: 1,
      nguonTK: 1,
      maDoanhNghiepKhaiPhi: '0304126484',
      tenDoanhNghiepKhaiPhi: 'Công ty TNHH Vận Tải Biển Đông',
      diaChiKhaiPhi: '167 Lưu Hữu Phước, Phường Phú Định, Thành phố Hồ Chí Minh, Việt Nam',
      maDoanhNghiepXNK: '0208765432',
      tenDoanhNghiepXNK: 'Công ty CP Xuất Nhập Khẩu Thái Bình',
      diaChiXNK: '456 Trần Hưng Đạo, Quận Hoàn Kiếm, Hà Nội',
      soToKhai: 'TK202509110001',
      ngayToKhai: '2025-09-11',
      maHaiQuan: 'HQHCM01',
      maLoaiHinh: 'A12',
      maLuuKho: 'KHO123',
      nuocXuatKhau: 'VN',
      maPhuongThucVC: '2',
      phuongTienVC: 'CONTAINER SHIP',
      maDiaDiemXepHang: 'CANGCATLAI',
      maDiaDiemDoHang: 'CANGHAIPHONG',
      maPhanLoaiHangHoa: 'XNK',
      mucDichVC: 'Xuất khẩu hàng dệt may',
      soTiepNhanKhaiPhi: '202500000003',
      ngayKhaiPhi: '2025-09-12',
      nhomLoaiPhi: 'HẠ TẦNG CẢNG BIỂN',
      loaiThanhToan: 'CHUYEN_KHOAN',
      ghiChuKhaiPhi: 'Nộp phí hạ tầng cảng biển cho lô hàng 2025-09-11',
      soThongBaoNopPhi: 'TB20250911001',
      soThongBao: '20250912002402',
      msgId: '4FD0499E-0F71-4D6B-B973-48330483CF5C',
      idPhatHanh: 'FPTIDA1757864934840',
      tongTienPhi: 1250000,
      trangThaiNganHang: 'DA_THANH_TOAN',
      soBienLai: '0000000',
      ngayBienLai: '2025-09-14',
      kyHieuBienLai: 'AA/25P',
      mauBienLai: '01BLP',
      maTraCuuBienLai: 'MTC20250911001',
      xemBienLai: 'https://example.com/bienlai/BL20250911001',
      loaiHangMienPhi: 'Hàng viện trợ nhân đạo',
      loaiHang: 'LBC001',
      trangThai: '02',
      trangThaiPhatHanh: '01',
      kylan1Xml: null,
      kylan2Xml: null,
      imageBl: null,
      chiTietList: [
        {
          id: 7,
          toKhaiThongTinID: 5,
          soVanDon: 'VANDON12345',
          soHieu: 'CONT001',
          soSeal: 'SEAL123',
          loaiCont: '40HC',
          tinhChatCont: 'KHO',
          maLoaiCont: '40',
          maTcCont: 'KHO',
          tongTrongLuong: 25000.5,
          donViTinh: 'KG',
          ghiChu: 'Hàng dệt may xuất đi Mỹ',
          donGia: 250000,
          soTien: 6250000
        },
        {
          id: 8,
          toKhaiThongTinID: 5,
          soVanDon: 'VANDON12346',
          soHieu: 'CONT002',
          soSeal: 'SEAL124',
          loaiCont: '20',
          tinhChatCont: 'LANH',
          maLoaiCont: '20',
          maTcCont: 'LANH',
          tongTrongLuong: 15000.0,
          donViTinh: 'KG',
          ghiChu: 'Hàng lạnh xuất đi Nhật',
          donGia: 300000,
          soTien: 4500000
        }
      ]
    }
  ] as unknown as TokhaiThongtinResponse[];

  const handleAutoFillForm = () => {
    if (!selectedTokhai) {
      // Trong chế độ view, tránh hiện lỗi vội; thử chờ selectedTokhai sẵn sàng
      if (mode === 'view') {
        setTimeout(() => {
          if (selectedTokhai) {
            handleAutoFillForm();
          } else {
            showError('Chưa chọn tờ khai để điền form', 'Lỗi');
          }
        }, 150);
        return;
      }
      showError('Chưa chọn tờ khai để điền form', 'Lỗi');
      return;
    }

    try {
      console.log('🖊️ Starting auto-fill form with data:', {
        // Company info
        maDoanhNghiepKhaiPhi: selectedTokhai.maDoanhNghiepKhaiPhi,
        tenDoanhNghiepKhaiPhi: selectedTokhai.tenDoanhNghiepKhaiPhi,
        diaChiKhaiPhi: selectedTokhai.diaChiKhaiPhi,
        maDoanhNghiepXNK: selectedTokhai.maDoanhNghiepXNK,
        tenDoanhNghiepXNK: selectedTokhai.tenDoanhNghiepXNK,
        diaChiXNK: selectedTokhai.diaChiXNK,
        // Customs declaration info
        soToKhai: selectedTokhai.soToKhai,
        ngayToKhai: selectedTokhai.ngayToKhai,
        maHaiQuan: selectedTokhai.maHaiQuan,
        maLoaiHinh: selectedTokhai.maLoaiHinh,
        maLuuKho: selectedTokhai.maLuuKho,
        nuocXuatKhau: selectedTokhai.nuocXuatKhau,
        // Fee declaration info
        soTiepNhanKhaiPhi: selectedTokhai.soTiepNhanKhaiPhi,
        ngayKhaiPhi: selectedTokhai.ngayKhaiPhi,
        nhomLoaiPhi: selectedTokhai.nhomLoaiPhi,
        loaiThanhToan: selectedTokhai.loaiThanhToan,
        ghiChuKhaiPhi: selectedTokhai.ghiChuKhaiPhi,
        // Cargo info
        maPhuongThucVC: selectedTokhai.maPhuongThucVC,
        phuongTienVC: selectedTokhai.phuongTienVC,
        maDiaDiemXepHang: selectedTokhai.maDiaDiemXepHang,
        maDiaDiemDoHang: selectedTokhai.maDiaDiemDoHang,
        maPhanLoaiHangHoa: selectedTokhai.maPhanLoaiHangHoa,
        mucDichVC: selectedTokhai.mucDichVC,
        // Payment info
        trangThaiNganHang: selectedTokhai.trangThaiNganHang
      });

      // Debug: Check if form elements exist
      console.log('🔍 Searching for form elements...');
      const allFormElements = document.querySelectorAll('input[name], select[name], textarea[name]');
      console.log('🔍 Found form elements:', Array.from(allFormElements).map(el => ({
        tag: el.tagName,
        name: el.getAttribute('name'),
        type: el.getAttribute('type'),
        value: (el as HTMLInputElement).value
      })));
      
      // Debug: Check specific form sections
      console.log('🔍 Checking form sections...');
      const formSections = document.querySelectorAll('.bg-white, .bg-gray-50, .bg-blue-50');
      console.log('🔍 Found form sections:', formSections.length);

      // Fill DOANH NGHIỆP KHAI PHÍ fields
      console.log('🏢 Filling DOANH NGHIỆP KHAI PHÍ fields...');
      const companyTaxCodeField = document.querySelector('input[name="companyTaxCode"]') as HTMLInputElement;
      const companyNameField = document.querySelector('input[name="companyName"]') as HTMLInputElement;
      const companyAddressField = document.querySelector('input[name="companyAddress"]') as HTMLInputElement;

      console.log('🔍 Company fields found:', {
        companyTaxCodeField: !!companyTaxCodeField,
        companyNameField: !!companyNameField,
        companyAddressField: !!companyAddressField
      });

      if (companyTaxCodeField) {
        const oldValue = companyTaxCodeField.value;
        companyTaxCodeField.value = selectedTokhai.maDoanhNghiepKhaiPhi || '';
        console.log('✅ companyTaxCode:', oldValue, '=>', companyTaxCodeField.value);
      } else {
        console.warn('❌ companyTaxCodeField not found');
      }

      if (companyNameField) {
        const oldValue = companyNameField.value;
        companyNameField.value = selectedTokhai.tenDoanhNghiepKhaiPhi || '';
        console.log('✅ companyName:', oldValue, '=>', companyNameField.value);
      } else {
        console.warn('❌ companyNameField not found');
      }

      if (companyAddressField) {
        const oldValue = companyAddressField.value;
        companyAddressField.value = selectedTokhai.diaChiKhaiPhi || '';
        console.log('✅ companyAddress:', oldValue, '=>', companyAddressField.value);
      } else {
        console.warn('❌ companyAddressField not found');
      }

      // Fill DOANH NGHIỆP XUẤT NHẬP KHẨU fields
      console.log('🚢 Filling DOANH NGHIỆP XUẤT NHẬP KHẨU fields...');
      const importExportTaxCodeField = document.querySelector('input[name="importExportCompanyTaxCode"]') as HTMLInputElement;
      const importExportNameField = document.querySelector('input[name="importExportCompanyName"]') as HTMLInputElement;
      const importExportAddressField = document.querySelector('input[name="importExportCompanyAddress"]') as HTMLInputElement;

      console.log('🔍 Import/Export fields found:', {
        importExportTaxCodeField: !!importExportTaxCodeField,
        importExportNameField: !!importExportNameField,
        importExportAddressField: !!importExportAddressField
      });

      if (importExportTaxCodeField) {
        const oldValue = importExportTaxCodeField.value;
        importExportTaxCodeField.value = selectedTokhai.maDoanhNghiepXNK || '';
        console.log('✅ importExportTaxCode:', oldValue, '=>', importExportTaxCodeField.value);
      } else {
        console.warn('❌ importExportTaxCodeField not found');
      }

      if (importExportNameField) {
        const oldValue = importExportNameField.value;
        importExportNameField.value = selectedTokhai.tenDoanhNghiepXNK || '';
        console.log('✅ importExportName:', oldValue, '=>', importExportNameField.value);
      } else {
        console.warn('❌ importExportNameField not found');
      }

      if (importExportAddressField) {
        const oldValue = importExportAddressField.value;
        importExportAddressField.value = selectedTokhai.diaChiXNK || '';
        console.log('✅ importExportAddress:', oldValue, '=>', importExportAddressField.value);
      } else {
        console.warn('❌ importExportAddressField not found');
      }

      // Fill TỜ KHAI HẢI QUAN fields
      console.log('📋 Filling TỜ KHAI HẢI QUAN fields...');
      const customsDeclarationNumberField = document.querySelector('input[name="customsDeclarationNumber"]') as HTMLInputElement;
      const customsDeclarationDateField = document.querySelector('input[name="customsDeclarationDate"]') as HTMLInputElement;

      if (customsDeclarationNumberField) {
        const oldValue = customsDeclarationNumberField.value;
        customsDeclarationNumberField.value = selectedTokhai.soToKhai || '';
        console.log('✅ customsDeclarationNumber:', oldValue, '=>', customsDeclarationNumberField.value);
      } else {
        console.warn('❌ customsDeclarationNumberField not found');
      }

      if (customsDeclarationDateField) {
        const oldValue = customsDeclarationDateField.value;
        // Convert date format from API (2025-09-11) to input format (2025-09-11)
        const dateValue = selectedTokhai.ngayToKhai || '';
        customsDeclarationDateField.value = dateValue;
        console.log('✅ customsDeclarationDate:', oldValue, '=>', customsDeclarationDateField.value);
      } else {
        console.warn('❌ customsDeclarationDateField not found');
      }

      // Fill TỜ KHAI PHÍ fields
      console.log('💰 Filling TỜ KHAI PHÍ fields...');
      const feeDeclarationReceiptNumberField = document.querySelector('input[name="feeDeclarationReceiptNumber"]') as HTMLInputElement;
      const feeDeclarationDateField = document.querySelector('input[name="feeDeclarationDate"]') as HTMLInputElement;
      const notesField = document.querySelector('textarea[name="notes"]') as HTMLTextAreaElement;

      // Map TỜ KHAI HẢI QUAN dropdown fields
      const maHaiQuanField = document.querySelector('select[name="maHaiQuan"]') as HTMLSelectElement;
      const maLoaiHinhField = document.querySelector('select[name="maLoaiHinh"]') as HTMLSelectElement;
      const maLuuKhoField = document.querySelector('select[name="maLuuKho"]') as HTMLSelectElement;
      const nuocXuatKhauField = document.querySelector('select[name="nuocXuatKhau"]') as HTMLSelectElement;

      // Map THÔNG TIN HÀNG HÓA TỜ KHAI dropdown fields
      const maPhuongThucVCField = document.querySelector('select[name="maPhuongThucVC"]') as HTMLSelectElement;
      const phuongTienVCField = document.querySelector('select[name="phuongTienVC"]') as HTMLSelectElement;
      const maDiaDiemXepHangField = document.querySelector('select[name="maDiaDiemXepHang"]') as HTMLSelectElement;
      const maDiaDiemDoHangField = document.querySelector('select[name="maDiaDiemDoHang"]') as HTMLSelectElement;
      const maPhanLoaiHangHoaField = document.querySelector('select[name="maPhanLoaiHangHoa"]') as HTMLSelectElement;
      const mucDichVCField = document.querySelector('select[name="mucDichVC"]') as HTMLSelectElement;

      // Map TỜ KHAI PHÍ dropdown fields
      const nhomLoaiPhiField = document.querySelector('select[name="nhomLoaiPhi"]') as HTMLSelectElement;

      if (feeDeclarationReceiptNumberField) {
        const oldValue = feeDeclarationReceiptNumberField.value;
        feeDeclarationReceiptNumberField.value = selectedTokhai.soTiepNhanKhaiPhi || '';
        console.log('✅ feeDeclarationReceiptNumber:', oldValue, '=>', feeDeclarationReceiptNumberField.value);
      } else {
        console.warn('❌ feeDeclarationReceiptNumberField not found');
      }

      if (feeDeclarationDateField) {
        const oldValue = feeDeclarationDateField.value;
        const dateValue = selectedTokhai.ngayKhaiPhi || '';
        feeDeclarationDateField.value = dateValue;
        console.log('✅ feeDeclarationDate:', oldValue, '=>', feeDeclarationDateField.value);
      } else {
        console.warn('❌ feeDeclarationDateField not found');
      }

      if (notesField) {
        const oldValue = notesField.value;
        notesField.value = selectedTokhai.ghiChuKhaiPhi || '';
        console.log('✅ notes:', oldValue, '=>', notesField.value);
      } else {
        console.warn('❌ notesField not found');
      }

      // Fill TỜ KHAI PHÍ dropdown fields
      console.log('💰 Filling TỜ KHAI PHÍ dropdown fields...');
      
      if (nhomLoaiPhiField) {
        const oldValue = nhomLoaiPhiField.value;
        nhomLoaiPhiField.value = selectedTokhai.nhomLoaiPhi || '';
        console.log('✅ nhomLoaiPhi:', oldValue, '=>', nhomLoaiPhiField.value);
      } else {
        console.warn('❌ nhomLoaiPhiField not found');
      }

      // Fill TỜ KHAI HẢI QUAN dropdown fields
      console.log('🏛️ Filling TỜ KHAI HẢI QUAN dropdown fields...');
      
      if (maHaiQuanField) {
        const oldValue = maHaiQuanField.value;
        maHaiQuanField.value = selectedTokhai.maHaiQuan || '';
        console.log('✅ maHaiQuan:', oldValue, '=>', maHaiQuanField.value);
      } else {
        console.warn('❌ maHaiQuanField not found');
      }

      if (maLoaiHinhField) {
        const oldValue = maLoaiHinhField.value;
        maLoaiHinhField.value = selectedTokhai.maLoaiHinh || '';
        console.log('✅ maLoaiHinh:', oldValue, '=>', maLoaiHinhField.value);
      } else {
        console.warn('❌ maLoaiHinhField not found');
      }

      if (maLuuKhoField) {
        const oldValue = maLuuKhoField.value;
        maLuuKhoField.value = selectedTokhai.maLuuKho || '';
        console.log('✅ maLuuKho:', oldValue, '=>', maLuuKhoField.value);
      } else {
        console.warn('❌ maLuuKhoField not found');
      }

      if (nuocXuatKhauField) {
        const oldValue = nuocXuatKhauField.value;
        nuocXuatKhauField.value = selectedTokhai.nuocXuatKhau || '';
        console.log('✅ nuocXuatKhau:', oldValue, '=>', nuocXuatKhauField.value);
      } else {
        console.warn('❌ nuocXuatKhauField not found');
      }

      // Fill THÔNG TIN HÀNG HÓA TỜ KHAI dropdown fields
      console.log('📦 Filling THÔNG TIN HÀNG HÓA TỜ KHAI dropdown fields...');
      
      if (maPhuongThucVCField) {
        const oldValue = maPhuongThucVCField.value;
        maPhuongThucVCField.value = selectedTokhai.maPhuongThucVC || '';
        console.log('✅ maPhuongThucVC:', oldValue, '=>', maPhuongThucVCField.value);
      } else {
        console.warn('❌ maPhuongThucVCField not found');
      }

      if (phuongTienVCField) {
        const oldValue = phuongTienVCField.value;
        phuongTienVCField.value = selectedTokhai.phuongTienVC || '';
        console.log('✅ phuongTienVC:', oldValue, '=>', phuongTienVCField.value);
      } else {
        console.warn('❌ phuongTienVCField not found');
      }

      if (maDiaDiemXepHangField) {
        const oldValue = maDiaDiemXepHangField.value;
        maDiaDiemXepHangField.value = selectedTokhai.maDiaDiemXepHang || '';
        console.log('✅ maDiaDiemXepHang:', oldValue, '=>', maDiaDiemXepHangField.value);
      } else {
        console.warn('❌ maDiaDiemXepHangField not found');
      }

      if (maDiaDiemDoHangField) {
        const oldValue = maDiaDiemDoHangField.value;
        maDiaDiemDoHangField.value = selectedTokhai.maDiaDiemDoHang || '';
        console.log('✅ maDiaDiemDoHang:', oldValue, '=>', maDiaDiemDoHangField.value);
      } else {
        console.warn('❌ maDiaDiemDoHangField not found');
      }

      if (maPhanLoaiHangHoaField) {
        const oldValue = maPhanLoaiHangHoaField.value;
        maPhanLoaiHangHoaField.value = selectedTokhai.maPhanLoaiHangHoa || '';
        console.log('✅ maPhanLoaiHangHoa:', oldValue, '=>', maPhanLoaiHangHoaField.value);
      } else {
        console.warn('❌ maPhanLoaiHangHoaField not found');
      }

      if (mucDichVCField) {
        const oldValue = mucDichVCField.value;
        mucDichVCField.value = selectedTokhai.mucDichVC || '';
        console.log('✅ mucDichVC:', oldValue, '=>', mucDichVCField.value);
      } else {
        console.warn('❌ mucDichVCField not found');
      }

      // Trigger change events to ensure form validation works
      console.log('🔄 Triggering change events for all filled fields...');
      const allFields = [
        companyTaxCodeField, companyNameField, companyAddressField, 
        importExportTaxCodeField, importExportNameField, importExportAddressField,
        customsDeclarationNumberField, customsDeclarationDateField,
        feeDeclarationReceiptNumberField, feeDeclarationDateField, notesField,
        nhomLoaiPhiField,
        maHaiQuanField, maLoaiHinhField, maLuuKhoField, nuocXuatKhauField,
        maPhuongThucVCField, phuongTienVCField, maDiaDiemXepHangField, maDiaDiemDoHangField,
        maPhanLoaiHangHoaField, mucDichVCField
      ];
      
      allFields.forEach((field, index) => {
        if (field) {
          field.dispatchEvent(new Event('change', { bubbles: true }));
          field.dispatchEvent(new Event('input', { bubbles: true }));
          field.dispatchEvent(new Event('blur', { bubbles: true }));
          console.log(`🔄 Events triggered for field ${index + 1}: ${field.name || field.tagName}`);
        }
      });

      // Map container details to table
      console.log('🔍 Checking chiTietList for selectedTokhai:', {
        hasChiTietList: !!selectedTokhai.chiTietList,
        chiTietListLength: selectedTokhai.chiTietList?.length || 0,
        chiTietList: selectedTokhai.chiTietList
      });
      
      if (selectedTokhai.chiTietList && selectedTokhai.chiTietList.length > 0) {
        console.log('📦 Container details available:', selectedTokhai.chiTietList.length, 'containers');
        console.log('📦 All container details:', selectedTokhai.chiTietList);
        
        try {
          // Trigger container table population via custom event
          const containerEvent = new CustomEvent('populateContainers', {
            detail: {
              containers: selectedTokhai.chiTietList.map((container, index) => ({
                id: container.id || index + 1,
                stt: index + 1,
                soVanDon: container.soVanDon || '',
                soHieu: container.soHieu || '',
                soSeal: container.soSeal || '',
                loaiCont: container.maLoaiCont || '20', // ✅ Map from maLoaiCont
                tinhChatCont: container.maTcCont || 'KHO', // ✅ Map from maTcCont
                tongTrongLuong: container.tongTrongLuong || 0,
                donViTinh: container.donViTinh || 'KG',
                ghiChu: container.ghiChu || '',
                maLoaiCont: container.maLoaiCont || '20',
                maTcCont: container.maTcCont || 'KHO',
                donGia: container.donGia || 0,
                soTien: container.soTien || 0,
                isEditing: true  // ✅ Set to true to show combo boxes
              }))
            }
          });
          
          window.dispatchEvent(containerEvent);
          console.log('📦 Dispatched container population event with', selectedTokhai.chiTietList.length, 'containers');
          
          // Log individual container mappings
          selectedTokhai.chiTietList.forEach((container, index) => {
            console.log(`📦 Container ${index + 1} mapping:`, {
              // Original API fields
              maLoaiCont: container.maLoaiCont,
              maTcCont: container.maTcCont,
              soVanDon: container.soVanDon,
              soHieu: container.soHieu,
              soSeal: container.soSeal,
              tongTrongLuong: container.tongTrongLuong,
              donViTinh: container.donViTinh,
              ghiChu: container.ghiChu,
              // Mapped fields for combo box
              loaiCont: container.maLoaiCont || '20',
              tinhChatCont: container.maTcCont || 'KHO'
            });
          });
          
        } catch (error) {
          console.error('❌ Error mapping container details:', error);
        }

        // Map data for other tabs based on the same chiTietList
        try {
          // Map to Roi Long Kien tab (same data structure, different view)
          const roiLongKienEvent = new CustomEvent('populateRoiLongKien', {
            detail: {
              roiLongKien: selectedTokhai.chiTietList.map((container, index) => ({
                id: container.id || index + 1,
                stt: index + 1,
                soVanDon: container.soVanDon || '',
                tongTrongLuong: container.tongTrongLuong || 0,
                donViTinh: container.donViTinh || '',
                ghiChu: container.ghiChu || '',
                isEditing: false
              }))
            }
          });
          window.dispatchEvent(roiLongKienEvent);
          console.log('📦 Dispatched roi long kien population event with', selectedTokhai.chiTietList.length, 'items');

          // Map to Container CFS tab (same data structure, different view)
          const containerCFSEvent = new CustomEvent('populateContainerCFS', {
            detail: {
              containerCFS: selectedTokhai.chiTietList.map((container, index) => ({
                id: container.id || index + 1,
                stt: index + 1,
                soHieu: container.soHieu || '',
                tongTrongLuong: container.tongTrongLuong || 0,
                donViTinh: container.donViTinh || '',
                ghiChu: container.ghiChu || '',
                isEditing: false
              }))
            }
          });
          window.dispatchEvent(containerCFSEvent);
          console.log('📦 Dispatched container CFS population event with', selectedTokhai.chiTietList.length, 'items');
        } catch (error) {
          console.error('❌ Error mapping other tabs:', error);
        }
      } else {
        console.log('📦 No container details available, creating sample data from main response');
        
        // Create sample container data from main response if chiTietList is empty
        const sampleContainerData = {
          id: selectedTokhai.id || 1,
          stt: 1,
          soVanDon: selectedTokhai.soToKhai || 'SAMPLE_VAN_DON',
          soHieu: 'SAMPLE_CONTAINER',
          soSeal: 'SAMPLE_SEAL',
          loaiCont: '20', // ✅ Default combo box value (matching API response)
          tinhChatCont: 'KHO', // ✅ Default combo box value (matching API response)
          tongTrongLuong: 25000,
          donViTinh: 'KG',
          ghiChu: `Container mẫu từ tờ khai ${selectedTokhai.soToKhai || 'N/A'}`,
          maLoaiCont: '20',
          maTcCont: 'KHO',
          donGia: 250000,
          soTien: 6250000,
          isEditing: true
        };
        
        console.log('📦 Created sample container data:', sampleContainerData);
        
        // Dispatch sample container data
        const containerEvent = new CustomEvent('populateContainers', {
          detail: { containers: [sampleContainerData] }
        });
        window.dispatchEvent(containerEvent);
        
        // Dispatch sample data for other tabs
        const roiLongKienEvent = new CustomEvent('populateRoiLongKien', {
          detail: { 
            roiLongKien: [{
              id: selectedTokhai.id || 1,
              stt: 1,
              soVanDon: selectedTokhai.soToKhai || 'SAMPLE_VAN_DON',
              tongTrongLuong: 25000,
              donViTinh: 'KG',
              ghiChu: `Hàng rời mẫu từ tờ khai ${selectedTokhai.soToKhai || 'N/A'}`,
              isEditing: false
            }]
          }
        });
        window.dispatchEvent(roiLongKienEvent);
        
        const containerCFSEvent = new CustomEvent('populateContainerCFS', {
          detail: { 
            containerCFS: [{
              id: selectedTokhai.id || 1,
              stt: 1,
              soHieu: 'SAMPLE_CONTAINER_CFS',
              tongTrongLuong: 25000,
              donViTinh: 'KG',
              ghiChu: `Container CFS mẫu từ tờ khai ${selectedTokhai.soToKhai || 'N/A'}`,
              isEditing: false
            }]
          }
        });
        window.dispatchEvent(containerCFSEvent);
        
        console.log('📦 Dispatched sample data for all tabs');
      }

      // Map tokhai lien quan data (using main tokhai data)
      try {
        const tokhaiLienQuanEvent = new CustomEvent('populateTokhaiLienQuan', {
          detail: {
            tokhaiLienQuan: [{
              id: selectedTokhai.id || 1,
              stt: 1,
              soToKhai: selectedTokhai.soToKhai || '',
              ngayToKhai: selectedTokhai.ngayToKhai || '',
              maLoaiHinh: selectedTokhai.maLoaiHinh || '',
              maHaiQuan: selectedTokhai.maHaiQuan || '',
              isEditing: false
            }]
          }
        });
        window.dispatchEvent(tokhaiLienQuanEvent);
        console.log('📦 Dispatched tokhai lien quan population event with main tokhai data');
      } catch (error) {
        console.error('❌ Error mapping tokhai lien quan:', error);
      }

      // Test mapping by trying to find all possible field names
      console.log('🧪 Testing field mapping...');
      const testFields = [
        'companyTaxCode', 'companyName', 'companyAddress',
        'importExportCompanyTaxCode', 'importExportCompanyName', 'importExportCompanyAddress',
        'customsDeclarationNumber', 'customsDeclarationDate',
        'feeDeclarationReceiptNumber', 'feeDeclarationDate', 'notes',
        'maHaiQuan', 'maLoaiHinh', 'maLuuKho', 'nuocXuatKhau',
        'maPhuongThucVC', 'phuongTienVC', 'maDiaDiemXepHang', 'maDiaDiemDoHang',
        'maPhanLoaiHangHoa', 'mucDichVC', 'nhomLoaiPhi'
      ];
      
      const foundFields: string[] = [];
      const missingFields: string[] = [];
      
      testFields.forEach(fieldName => {
        const field = document.querySelector(`[name="${fieldName}"]`);
        if (field) {
          foundFields.push(fieldName);
          console.log(`✅ Found field: ${fieldName}`, field);
        } else {
          missingFields.push(fieldName);
          console.log(`❌ Missing field: ${fieldName}`);
        }
      });
      
      console.log('📊 Field mapping summary:', {
        found: foundFields.length,
        missing: missingFields.length,
        foundFields,
        missingFields
      });

      showSuccess('Đã điền form tự động thành công!', 'Thành công');
      console.log('🎉 Form auto-fill completed successfully');
      
    } catch (error) {
      console.error('❌ Error auto-filling form:', error);
      showError('Có lỗi xảy ra khi điền form tự động', 'Lỗi');
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      console.log('💾 Lưu thông tin tờ khai...');
      
      // Thu thập dữ liệu từ form elements
      const formElement = document.querySelector('#feeDeclarationForm') as HTMLFormElement;
      if (!formElement) {
        throw new Error('Không tìm thấy form');
      }
      
      console.log('🔍 Form element found:', formElement);
      console.log('🔍 Form element ID:', formElement.id);
      console.log('🔍 Form element tagName:', formElement.tagName);
      
      // Thu thập dữ liệu chính từ form
      const companyTaxCodeInput = formElement.querySelector('input[name="companyTaxCode"]') as HTMLInputElement;
      const companyNameInput = formElement.querySelector('input[name="companyName"]') as HTMLInputElement;
      const companyAddressInput = formElement.querySelector('input[name="companyAddress"]') as HTMLInputElement;
      
      console.log('🔍 Form inputs found:');
      console.log('  - companyTaxCodeInput:', companyTaxCodeInput);
      console.log('  - companyNameInput:', companyNameInput);
      console.log('  - companyAddressInput:', companyAddressInput);
      console.log('  - companyTaxCode value:', companyTaxCodeInput?.value);
      console.log('  - companyName value:', companyNameInput?.value);
      console.log('  - companyAddress value:', companyAddressInput?.value);
      
      const formData = {
        // NGUỒN THÔNG TIN TỜ KHAI
        nguonTK: 1, // Default value
        
        // DOANH NGHIỆP KHAI PHÍ
        maDoanhNghiepKhaiPhi: companyTaxCodeInput?.value || '',
        tenDoanhNghiepKhaiPhi: companyNameInput?.value || '',
        diaChiKhaiPhi: companyAddressInput?.value || '',
        
        // DOANH NGHIỆP XNK
        maDoanhNghiepXNK: (formElement.querySelector('input[name="importExportCompanyTaxCode"]') as HTMLInputElement)?.value || '',
        tenDoanhNghiepXNK: (formElement.querySelector('input[name="importExportCompanyName"]') as HTMLInputElement)?.value || '',
        diaChiXNK: (formElement.querySelector('input[name="importExportCompanyAddress"]') as HTMLInputElement)?.value || '',
        
        // TỜ KHAI HẢI QUAN
        soToKhai: (formElement.querySelector('input[name="customsDeclarationNumber"]') as HTMLInputElement)?.value || '',
        ngayToKhai: (formElement.querySelector('input[name="customsDeclarationDate"]') as HTMLInputElement)?.value || '',
        maHaiQuan: (formElement.querySelector('select[name="maHaiQuan"]') as HTMLSelectElement)?.value || '',
        maLoaiHinh: (formElement.querySelector('select[name="maLoaiHinh"]') as HTMLSelectElement)?.value || '',
        maLuuKho: (formElement.querySelector('select[name="maLuuKho"]') as HTMLSelectElement)?.value || '',
        nuocXuatKhau: (formElement.querySelector('select[name="nuocXuatKhau"]') as HTMLSelectElement)?.value || '',
        
        // THÔNG TIN HÀNG HÓA
        maPhuongThucVC: (formElement.querySelector('select[name="maPhuongThucVC"]') as HTMLSelectElement)?.value || '',
        phuongTienVC: (formElement.querySelector('select[name="phuongTienVC"]') as HTMLSelectElement)?.value || '',
        maDiaDiemXepHang: (formElement.querySelector('select[name="maDiaDiemXepHang"]') as HTMLSelectElement)?.value || '',
        maDiaDiemDoHang: (formElement.querySelector('select[name="maDiaDiemDoHang"]') as HTMLSelectElement)?.value || '',
        maPhanLoaiHangHoa: (formElement.querySelector('select[name="maPhanLoaiHangHoa"]') as HTMLSelectElement)?.value || '',
        mucDichVC: (formElement.querySelector('select[name="mucDichVC"]') as HTMLSelectElement)?.value || '',
        
        // TỜ KHAI PHÍ
        nhomLoaiPhi: (formElement.querySelector('select[name="nhomLoaiPhi"]') as HTMLSelectElement)?.value || '',
        loaiThanhToan: (formElement.querySelector('select[name="loaiThanhToan"]') as HTMLSelectElement)?.value || '',
        ghiChuKhaiPhi: (formElement.querySelector('textarea[name="notes"]') as HTMLTextAreaElement)?.value || '',
        
        // THÔNG TIN THU PHÍ
        trangThaiNganHang: '00', // Default value
        tongTienPhi: 0, // Default value
        
        // DANH MỤC LOẠI HÀNG MIỄN PHÍ
        loaiHang: '', // Sẽ được gán từ radio button sau
        trangThai: '00', // Default value
        trangThaiPhatHanh: '00' // Default value
      };
      
      console.log('📤 Dữ liệu form thu thập được:', formData);
      console.log('📤 Dữ liệu form JSON:', JSON.stringify(formData, null, 2));
      
      // Validation cơ bản
      if (!formData.maDoanhNghiepKhaiPhi || !formData.tenDoanhNghiepKhaiPhi) {
        showError('Vui lòng nhập đầy đủ thông tin doanh nghiệp khai phí!', 'Thông tin thiếu');
        return;
      }
      
      if (!formData.soToKhai) {
        showError('Vui lòng nhập số tờ khai hải quan!', 'Thông tin thiếu');
        return;
      }
      
      // Thu thập dữ liệu chi tiết từ các tab
      const chiTietList: TokhaiThongtinChiTietCreateRequest[] = [];
      
      // Lấy giá trị radio button LOAI_TK_NP và map thành loai_hh
      const selectedCargoTypeRadio = formElement.querySelector('input[name="LOAI_TK_NP"]:checked') as HTMLInputElement;
      const selectedCargoTypeValue = selectedCargoTypeRadio?.value || '100';
      
      // Map giá trị radio button thành loai_hh
      let loai_hh = 'LBC001'; // Default
      switch (selectedCargoTypeValue) {
        case '100':
          loai_hh = 'LBC001'; // HÀNG CONTAINER
          break;
        case '101':
          loai_hh = 'LBC002'; // HÀNG RỜI, LỎNG, KIỆN
          break;
        case '102':
          loai_hh = 'LBC003'; // HÀNG CONTAINER TÍNH TRỌNG LƯỢNG
          break;
        default:
          loai_hh = 'LBC001';
      }
      
      console.log('📦 Thẻ loại hàng được chọn:', {
        radioValue: selectedCargoTypeValue,
        mappedLoaiHh: loai_hh,
        radioElement: selectedCargoTypeRadio
      });
      
      // Lấy dữ liệu từ container tab thông qua event system
      console.log('🔍 Requesting container data from CargoTabs...');
      console.log('🔍 Current window events:', window);
      
      // Tạo promise để chờ response
      const getContainerData = (): Promise<any> => {
        return new Promise((resolve) => {
          const handleResponse = (event: CustomEvent) => {
            console.log('📦 Received container data response:', event.detail);
            window.removeEventListener('containerDataResponse', handleResponse as EventListener);
            resolve(event.detail);
          };
          
          console.log('🔍 Adding event listener for containerDataResponse');
          window.addEventListener('containerDataResponse', handleResponse as EventListener);
          
          // Dispatch request event
          console.log('🔍 Dispatching getContainerData event');
          const requestEvent = new CustomEvent('getContainerData');
          window.dispatchEvent(requestEvent);
          
          // Timeout after 2 seconds
          setTimeout(() => {
            console.log('⏰ Timeout reached, removing event listener');
            window.removeEventListener('containerDataResponse', handleResponse as EventListener);
            resolve({ containers: [], roiLongKien: [], containerCFS: [], tokhaiLienQuan: [] });
          }, 2000);
        });
      };
      
      const containerData = await getContainerData();
      console.log('📦 Container data received:', containerData);
      console.log('📦 Container data type:', typeof containerData);
      console.log('📦 Container data keys:', Object.keys(containerData));
      console.log('📦 Container data containers:', containerData.containers);
      console.log('📦 Container data containers length:', containerData.containers?.length || 0);
      
      // Backup: Nếu event system không hoạt động, thu thập dữ liệu trực tiếp từ DOM
      if (!containerData.containers || containerData.containers.length === 0) {
        console.log('⚠️ Event system failed, trying DOM fallback...');
        const containerRows = document.querySelectorAll('#containerTable tbody tr');
        console.log('🔍 Found container rows via DOM:', containerRows.length);
        
        containerRows.forEach((row, index) => {
          const inputs = row.querySelectorAll('input');
          const selects = row.querySelectorAll('select');
          
          console.log(`📦 DOM Row ${index + 1} - Found ${inputs.length} inputs, ${selects.length} selects`);
          
          if (inputs.length >= 3 && selects.length >= 2) {
            const soVanDon = inputs[0]?.value || '';
            const soHieu = inputs[1]?.value || '';
            const soSeal = inputs[2]?.value || '';
            const loaiCont = selects[0]?.value || '';
            const tinhChatCont = selects[1]?.value || '';
            const ghiChu = inputs[inputs.length - 1]?.value || '';
            
            console.log(`📦 DOM Row ${index + 1} data:`, {
              soVanDon, soHieu, soSeal, loaiCont, tinhChatCont, ghiChu
            });
            
            if (soVanDon || soHieu) {
              chiTietList.push({
                soVanDon,
                soHieu,
                soSeal,
                loaiCont,
                tinhChatCont,
                maLoaiCont: loaiCont,
                maTcCont: tinhChatCont,
                tongTrongLuong: 0,
                donViTinh: 'KG',
                ghiChu
              });
            }
          }
        });
        
        console.log('📦 DOM fallback chiTietList:', chiTietList);
      }
      
      // Xử lý dữ liệu container
      if (containerData.containers && containerData.containers.length > 0) {
        containerData.containers.forEach((container: any, index: number) => {
          console.log(`📦 Container ${index + 1} data:`, {
            soVanDon: container.soVanDon,
            soHieu: container.soHieu,
            soSeal: container.soSeal,
            loaiCont: container.loaiCont,
            tinhChatCont: container.tinhChatCont,
            tongTrongLuong: container.tongTrongLuong,
            donViTinh: container.donViTinh,
            ghiChu: container.ghiChu
          });
          
          if (container.soVanDon || container.soHieu) {
            chiTietList.push({
              soVanDon: container.soVanDon || '',
              soHieu: container.soHieu || '',
              soSeal: container.soSeal || '',
              loaiCont: container.loaiCont || '',
              tinhChatCont: container.tinhChatCont || '',
              maLoaiCont: container.loaiCont || '',
              maTcCont: container.tinhChatCont || '',
              tongTrongLuong: container.tongTrongLuong || 0,
              donViTinh: container.donViTinh || '',
              ghiChu: container.ghiChu || ''
            });
          }
        });
      }
      
      console.log('📦 Chi tiết container:', chiTietList);
      console.log('📦 Chi tiết container length:', chiTietList.length);
      console.log('📦 Chi tiết container JSON:', JSON.stringify(chiTietList, null, 2));
      
      // Tạo request object
        const createRequest: TokhaiThongtinCreateRequest = {
          ...formData,
          loaiHang: loai_hh, // Thẻ loại hàng từ radio button (LBC001, LBC002, LBC003)
          chiTietList: chiTietList.length > 0 ? chiTietList : []
        };
      
      console.log('📦 Final chiTietList in request:', createRequest.chiTietList);
      console.log('📦 Final chiTietList length:', createRequest.chiTietList?.length || 0);
      
      console.log('📤 Request gửi lên API:', createRequest);
      console.log('📤 Request JSON string:', JSON.stringify(createRequest, null, 2));
      
      // Log chi tiết từng phần của request
      console.log('📋 Chi tiết request:');
      console.log('  - nguonTK:', createRequest.nguonTK);
      console.log('  - maDoanhNghiepKhaiPhi:', createRequest.maDoanhNghiepKhaiPhi);
      console.log('  - tenDoanhNghiepKhaiPhi:', createRequest.tenDoanhNghiepKhaiPhi);
      console.log('  - soToKhai:', createRequest.soToKhai);
      console.log('  - loaiHang (Thẻ loại hàng):', createRequest.loaiHang, '(mapped from radio button value:', selectedCargoTypeValue, ')');
      console.log('  - chiTietList length:', createRequest.chiTietList?.length || 0);
      if (createRequest.chiTietList && createRequest.chiTietList.length > 0) {
        createRequest.chiTietList.forEach((item, index) => {
          console.log(`  - chiTietList[${index}]:`, {
            soVanDon: item.soVanDon,
            soHieu: item.soHieu,
            soSeal: item.soSeal,
            loaiCont: item.loaiCont,
            tinhChatCont: item.tinhChatCont,
            maLoaiCont: item.maLoaiCont,
            maTcCont: item.maTcCont,
            tongTrongLuong: item.tongTrongLuong,
            donViTinh: item.donViTinh,
            ghiChu: item.ghiChu
          });
        });
      }
      
      // Gọi API tạo mới
      console.log('🚀 Calling API createTokhaiThongTin...');
      const createdTokhai = await FeeDeclarationApiService.createTokhaiThongTin(createRequest);
      
      console.log('✅ Tạo tờ khai thành công:', createdTokhai);
      
      // Gọi callback để thêm vào bảng (nếu có)
      if (onSave) {
        await onSave(createdTokhai);
      }
      
      showSuccess('Lưu thông tin tờ khai thành công!', 'Thành công');
      onClose();
      
    } catch (error: any) {
      console.error('💥 Lỗi lưu dữ liệu:', error);
      showError(`Lỗi lưu dữ liệu: ${error.message}`, 'Lỗi');
    } finally {
      setLoading(false);
    }
  };
  return (
    <motion.div ref={modalRootRef}
      className="w-full flex flex-col bg-white"
      initial={asPopup ? { opacity: 0, scale: 0.98 } : { x: "100%" }}
      animate={asPopup ? { opacity: 1, scale: 1 } : { x: 0 }}
      exit={asPopup ? { opacity: 0 } : { x: "100%" }}
      transition={{ type: "tween", duration: 0.25 }}
    >
      {/* Header */}
      <div className={asPopup ? "modal-header sticky top-0 w-full z-20 bg-white" : "modal-header fixed top-[85px] w-[calc(100%-45px)] z-20 bg-white"}>
        <h4 className="modal-title">
          <button
            onClick={onClose}
            className="btn btn-default text-blue-500 me-4 rounded"
            data-allow-click="true"
          >
            <ArrowLeftCircleIcon className="w-4 h-4" />
            Quay lại
          </button>
          <span className="font-semibold">Thông Tin Tờ Khai Phí</span>
        </h4>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleSave}
            disabled={loading || mode === 'view'}
            className="btn btn-default bg-blue-800 text-white rounded hover:bg-blue-900 transition-colors disabled:bg-gray-400"
          >
            <WindowIcon className="w-4 h-4 me-1" />
            {loading ? 'Đang lưu...' : 'Lưu lại'}
          </button>
          
        </div>
      </div>

      {/* Body */}
      <div className={asPopup ? "modal-body mt-[40px] pr-[15px] pb-[100px] pl-[15px] bg-[#E8EBEF] min-h-[278px] overflow-y-auto" : "modal-body mt-[40px] pr-[15px] pb-[100px] pl-[15px] bg-[#E8EBEF] min-h-[278px]"}>
        <div className="w-full">
          {/* Arrow Step Indicator */}
          <div className="flex items-center w-full mb-6 mt-[22px] rounded-full overflow-hidden">
            {/* Bước 1: Tạo Tờ Khai Phí */}
            <div 
              className={`relative h-10 flex items-center ${getStepStyle(1).className} font-bold text-sm px-4 shadow-lg flex-1`}
              style={{ 
                background: getStepStyle(1).background,
                clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)',
                marginRight: '3px',
                zIndex: 5
              }}
            >
              <div className="flex items-center space-x-2 justify-center w-full">
                 <div className={`w-6 h-6 rounded-full ${getStepNumberStyle(1)} flex items-center justify-center text-xs font-bold`}>
                   1
                 </div>
                <span className="text-sm font-medium">Tạo Tờ Khai Phí</span>
              </div>
            </div>
            
            {/* Bước 2: Ký Số Tờ Khai Báo Nộp Phí */}
            <div 
              className={`relative h-10 flex items-center ${getStepStyle(2).className} font-bold text-sm px-4 flex-1`}
              style={{
                background: getStepStyle(2).background,
                clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%, 20px 50%)',
                marginLeft: '-20px',
                marginRight: '3px',
                zIndex: 4
              }}
            >
              <div className="flex items-center space-x-2 justify-center w-full">
                <div className={`w-6 h-6 rounded-full ${getStepNumberStyle(2)} flex items-center justify-center text-xs font-bold`}>
                  2
                </div>
                <span className="text-sm font-medium">Ký Số Tờ Khai Báo Nộp Phí</span>
              </div>
            </div>
            
            {/* Bước 3: Lấy Thông Báo Phí */}
            <div 
              className={`relative h-10 flex items-center ${getStepStyle(3).className} font-bold text-sm px-4 flex-1`}
              style={{
                background: getStepStyle(3).background,
                clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%, 20px 50%)',
                marginLeft: '-20px',
                marginRight: '3px',
                zIndex: 3
              }}
            >
              <div className="flex items-center space-x-2 justify-center w-full">
                <div className={`w-6 h-6 rounded-full ${getStepNumberStyle(3)} flex items-center justify-center text-xs font-bold`}>
                  3
                </div>
                <span className="text-sm font-medium">Lấy Thông Báo Phí</span>
              </div>
            </div>
            
            {/* Bước 4: Thực Hiện Nộp Phí */}
            <div 
              className={`relative h-10 flex items-center ${getStepStyle(4).className} font-bold text-sm px-4 flex-1`}
              style={{
                background: getStepStyle(4).background,
                clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%, 20px 50%)',
                marginLeft: '-20px',
                marginRight: '3px',
                zIndex: 2
              }}
            >
              <div className="flex items-center space-x-2 justify-center w-full">
                <div className={`w-6 h-6 rounded-full ${getStepNumberStyle(4)} flex items-center justify-center text-xs font-bold`}>
                  4
                </div>
                <span className="text-sm font-medium">Thực Hiện Nộp Phí</span>
              </div>
            </div>
            
            {/* Bước 5: Hoàn Thành */}
            <div 
              className={`relative h-10 flex items-center ${getStepStyle(5).className} font-bold text-sm px-4 flex-1 rounded-r-full`}
              style={{
                background: getStepStyle(5).background,
                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 20px 50%)',
                marginLeft: '-20px',
                zIndex: 1
              }}
            >
              <div className="flex items-center space-x-2 justify-center w-full">
                <div className={`w-6 h-6 rounded-full ${getStepNumberStyle(5)} flex items-center justify-center text-xs font-bold`}>
                  5
                </div>
                <span className="text-sm font-medium">Hoàn Thành</span>
              </div>
            </div>
          </div>
        </div>

        <div className="data-master">
          <div className="font-bold uppercase mb-1">
            Nguồn thông tin tờ khai
          </div>
          <div className="item-frame flex items-center">
            <label className="flex items-center mr-6 cursor-pointer">
              <input
                type="radio"
                name="feeOption"
                defaultChecked
                onChange={() => handleFeeOptionChange('customs')}
                className="appearance-none w-4 h-4 border border-gray-400 rounded-full
                 checked:after:content-['✓'] checked:after:text-green-600 
                 checked:after:flex checked:after:items-center checked:after:justify-center 
                 checked:after:w-full checked:after:h-full bg-white"
              />
              <span className="ml-2 uppercase font-bold">Truy vấn thông tin từ Hải quan</span>
            </label>
            {!isManualDeclaration && (
              <div className="flex items-center mx-2">
                <ChevronDoubleRightIcon className="w-3  h-3" />
                <input
                  type="text"
                  className="border h-[33px] w-[120px] me-1"
                  value={companyCode}
                  onChange={(e) => setCompanyCode(e.target.value)}
                  placeholder={user?.taxCode || "VD: 0312345678"}
                  title={`Mã doanh nghiệp: ${user?.taxCode || 'Chưa đăng nhập'} - Nhập mã doanh nghiệp để lọc (để trống = hiển thị tất cả)`}
                />
                <input
                  type="text"
                  className="border h-[33px] w-[100px] me-1"
                  value={customsDeclarationNumber}
                  onChange={(e) => setCustomsDeclarationNumber(e.target.value)}
                  placeholder="VD: TK2025..."
                  title="Nhập số tờ khai hải quan để lọc (tùy chọn)"
                />
                <button 
                  className="btn btn-primary w-[130px] font-normal bg-[#deecf9] text-[#005a9e] rounded pt-[4px] hover:text-white disabled:opacity-50"
                  onClick={handleGetInformation}
                  disabled={loading}
                >
                  <MagnifyingGlassIcon className="w-3  h-3" />
                  &nbsp;{loading ? 'Đang lấy...' : 'Truy vấn'}
                </button>
                
                
                <span className="font-bold ms-4"> </span>
              </div>
            )}
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="feeOption"
                onChange={() => handleFeeOptionChange('manual')}
                className="appearance-none w-4 h-4 border border-gray-400 rounded-full
                 checked:after:content-['✓'] checked:after:text-green-600 
                 checked:after:flex checked:after:items-center checked:after:justify-center 
                 checked:after:w-full checked:after:h-full bg-white"
              />
              <span className="ml-2 uppercase font-bold">
                Khai báo tờ khai phí thủ công
              </span>
            </label>
          </div>

          {/* Display fetched data */}
          {(() => {
            console.log('🖼️ Rendering UI - fetchedData.length:', fetchedData.length);
            return null;
          })()}
          {fetchedData.length > 0 && (
            <div className="mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Kết quả tìm kiếm ({fetchedData.length} tờ khai)
                </h4>
                <div className="max-h-60 overflow-y-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-100 sticky top-0">
                      <tr>
                        <th className="text-left p-2 border">Số tờ khai</th>
                        <th className="text-left p-2 border">Doanh nghiệp</th>
                        <th className="text-left p-2 border">Ngày khai</th>
                        <th className="text-left p-2 border">Tổng tiền</th>
                        <th className="text-left p-2 border">Trạng thái</th>
                        <th className="text-center p-2 border">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fetchedData.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="p-2 border text-xs">{item.soToKhai}</td>
                          <td className="p-2 border text-xs">{item.tenDoanhNghiepKhaiPhi}</td>
                          <td className="p-2 border text-xs">{item.ngayToKhai}</td>
                          <td className="p-2 border text-xs">{item.tongTienPhi?.toLocaleString()} VND</td>
                          <td className="p-2 border text-xs">{item.trangThai}</td>
                          <td className="p-2 border text-center">
                            <div className="flex gap-1 justify-center">
                              <button
                                className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                                onClick={() => handleSelectTokhai(item)}
                              >
                                Chọn
                              </button>
                              <button
                                className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                                onClick={() => {
                                  // Directly fill form with this item data
                                  console.log('🖊️ Direct fill form with:', item);
                                  
                                  // Set temporary selected item for auto-fill function
                                  const originalSelected = selectedTokhai;
                                  setSelectedTokhai(item);
                                  
                                  // Use setTimeout to ensure state is updated
                                  setTimeout(() => {
                                    handleAutoFillForm();
                                    // Restore original selection
                                    setSelectedTokhai(originalSelected);
                                  }, 100);
                                }}
                              >
                                📝 Điền
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
          )}

          {/* Display selected tokhai details - hidden in view mode */}
          {showSelectedData && selectedTokhai && mode !== 'view' && (
            <div className="mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-semibold text-green-800">
                    📋 Thông tin tờ khai đã chọn
                  </h4>
                  <button
                    onClick={handleClearSelection}
                    className="text-red-600 hover:text-red-800 text-xs"
                  >
                    ✕ Xóa lựa chọn
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="space-y-2">
                      <div><strong>Số tờ khai:</strong> {selectedTokhai.soToKhai}</div>
                      <div><strong>Ngày tờ khai:</strong> {selectedTokhai.ngayToKhai}</div>
                      <div><strong>Doanh nghiệp khai phí:</strong> {selectedTokhai.tenDoanhNghiepKhaiPhi}</div>
                      <div><strong>Mã doanh nghiệp:</strong> {selectedTokhai.maDoanhNghiepKhaiPhi}</div>
                      <div><strong>Địa chỉ:</strong> {selectedTokhai.diaChiKhaiPhi}</div>
                      <div><strong>Mã hải quan:</strong> {selectedTokhai.maHaiQuan}</div>
                    </div>
                  </div>
                  <div>
                    <div className="space-y-2">
                      <div><strong>Tổng tiền phí:</strong> {selectedTokhai.tongTienPhi?.toLocaleString()} VND</div>
                      <div><strong>Trạng thái:</strong> {selectedTokhai.trangThai}</div>
                      <div><strong>Trạng thái ngân hàng:</strong> {selectedTokhai.trangThaiNganHang}</div>
                      <div><strong>Loại thanh toán:</strong> {selectedTokhai.loaiThanhToan}</div>
                      <div><strong>Phương tiện vận chuyển:</strong> {selectedTokhai.phuongTienVC}</div>
                      <div><strong>Ghi chú:</strong> {selectedTokhai.ghiChuKhaiPhi}</div>
                    </div>
                  </div>
                </div>

                {/* Container details */}
                {selectedTokhai.chiTietList && selectedTokhai.chiTietList.length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-xs font-semibold text-green-800 mb-2">📦 Chi tiết container:</h5>
                    <div className="max-h-32 overflow-y-auto">
                      <table className="w-full text-xs border">
                        <thead className="bg-green-100">
                          <tr>
                            <th className="border p-1 text-left">Số vận đơn</th>
                            <th className="border p-1 text-left">Số hiệu</th>
                            <th className="border p-1 text-left">Loại cont</th>
                            <th className="border p-1 text-left">Trọng lượng</th>
                            <th className="border p-1 text-left">Số tiền</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedTokhai.chiTietList.map((detail, index) => (
                            <tr key={index}>
                              <td className="border p-1">{detail.soVanDon}</td>
                              <td className="border p-1">{detail.soHieu}</td>
                              <td className="border p-1">{detail.loaiCont}</td>
                              <td className="border p-1">{detail.tongTrongLuong} {detail.donViTinh}</td>
                              <td className="border p-1">{detail.soTien?.toLocaleString()} VND</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="mt-3 flex gap-2">
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                    onClick={handleAutoFillForm}
                  >
                    📝 Tự động điền form
                  </button>
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                    onClick={() => {
                      // TODO: Implement edit logic
                      showInfo('Chức năng chỉnh sửa đang phát triển', 'Thông báo');
                    }}
                  >
                    ✏️ Chỉnh sửa
                  </button>
                </div>
              </div>
            </div>
          )}

          <FeeDeclarationForm />
          <CargoTabs />
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirmModal && (
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
          zIndex: 1001
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
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                <i className="fas fa-exclamation-triangle"></i>
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
                Bạn có chắc chắn muốn hủy tờ khai phí có số tờ khai hải quan 23243454354 không?
                <br />
                <span style={{ fontWeight: '600', color: '#dc2626' }}>
                  Lưu ý: cần xác nhận ký số điện tử để hủy tờ khai
                </span>
              </div>

              {/* Action Buttons */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center',
                gap: '12px'
              }}>
                <button
                  onClick={handleConfirmCancel}
                  style={{
                    backgroundColor: '#dc2626',
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
                    e.currentTarget.style.backgroundColor = '#b91c1c';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#dc2626';
                  }}
                >
                  <i className="fas fa-times"></i>
                  Hủy tờ khai
                </button>

                <button
                  onClick={() => setShowCancelConfirmModal(false)}
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
    </motion.div>
  );
}
