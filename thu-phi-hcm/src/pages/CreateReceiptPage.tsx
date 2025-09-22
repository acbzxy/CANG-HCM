import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// import { ReceiptService } from '../utils/receiptApi';
import { fptEInvoiceService, FPTEInvoiceRequest, FPTEInvoiceSearchRequest, FPTEInvoiceUpdateStatusRequest } from '../services/fptEInvoiceService';
import { useNotification } from '../context/NotificationContext';

const CreateReceiptPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedItem = location.state?.selectedItem; // Can be either fee declaration or receipt data
  const isEditMode = location.state?.isEditMode || false;
  const passedToKhaiId = location.state?.toKhaiId; // toKhaiId passed from parent component
  const passedTrangThaiPhatHanh = location.state?.trangThaiPhatHanh; // trangThaiPhatHanh passed from parent component
  const { showError, showSuccess, showInfo } = useNotification();
  
  // Log the received data
  React.useEffect(() => {
    if (selectedItem) {
      console.log('🗂️ ===== RECEIPT PAGE RECEIVED DATA =====');
      console.log('🗂️ selectedItem:', selectedItem);
      console.log('🗂️ isEditMode:', isEditMode);
      console.log('🗂️ Data type:', isEditMode ? 'Receipt data' : 'Fee declaration data');
      console.log('🗂️ selectedItem.ghiChu:', selectedItem.ghiChu);
      console.log('🗂️ passedTrangThaiPhatHanh:', passedTrangThaiPhatHanh);
      console.log('🗂️ passedToKhaiId:', passedToKhaiId);
      console.log('🗂️ ===== TRẠNG THÁI PHÁT HÀNH DEBUG =====');
      console.log('🗂️ Initial currentTrangThaiPhatHanh:', currentTrangThaiPhatHanh);
      console.log('🗂️ Source - passedTrangThaiPhatHanh:', passedTrangThaiPhatHanh);
      console.log('🗂️ ===== END TRẠNG THÁI PHÁT HÀNH DEBUG =====');
      console.log('🗂️ selectedItem.ghiChu type:', typeof selectedItem.ghiChu);
      console.log('🗂️ selectedItem.ghiChu length:', selectedItem.ghiChu?.length);
      console.log('🗂️ selectedItem.ndungTp:', selectedItem.ndungTp);
      console.log('🗂️ selectedItem.ndungTp type:', typeof selectedItem.ndungTp);
      console.log('🗂️ selectedItem.ndungTp length:', selectedItem.ndungTp?.length);
      console.log('🗂️ All selectedItem keys:', Object.keys(selectedItem));
      console.log('🗂️ selectedItem with ghiChu:', selectedItem.ghiChu);
      console.log('🗂️ selectedItem with ndungTp:', selectedItem.ndungTp);
      console.log('🗂️ selectedItem with noiDung:', selectedItem.noiDung);
      console.log('🗂️ selectedItem with moTa:', selectedItem.moTa);
    } else {
      console.log('🗂️ No selectedItem data received');
    }
  }, [selectedItem, isEditMode]);

  // Effect to handle passedTrangThaiPhatHanh changes
  React.useEffect(() => {
    if (passedTrangThaiPhatHanh) {
      console.log('🗂️ ===== UPDATING TRẠNG THÁI PHÁT HÀNH =====');
      console.log('🗂️ passedTrangThaiPhatHanh changed to:', passedTrangThaiPhatHanh);
      console.log('🗂️ Current currentTrangThaiPhatHanh:', currentTrangThaiPhatHanh);
      setCurrentTrangThaiPhatHanh(passedTrangThaiPhatHanh);
      console.log('🗂️ Updated currentTrangThaiPhatHanh to:', passedTrangThaiPhatHanh);
      console.log('🗂️ ===== END UPDATING TRẠNG THÁI PHÁT HÀNH =====');
    }
  }, [passedTrangThaiPhatHanh]);

  // Effect to handle passedToKhaiId changes
  React.useEffect(() => {
    if (passedToKhaiId) {
      console.log('🗂️ ===== UPDATING TOKHAIID =====');
      console.log('🗂️ passedToKhaiId changed to:', passedToKhaiId);
      console.log('🗂️ Current toKhaiId:', toKhaiId);
      setToKhaiId(passedToKhaiId);
      console.log('🗂️ Updated toKhaiId to:', passedToKhaiId);
      console.log('🗂️ ===== END UPDATING TOKHAIID =====');
    }
  }, [passedToKhaiId]);

  // Load systemReceiptId and idPhatHanh from localStorage on component mount
  React.useEffect(() => {
    const savedSystemReceiptId = localStorage.getItem('systemReceiptId');
    if (savedSystemReceiptId && !systemReceiptId) {
      setSystemReceiptId(parseInt(savedSystemReceiptId));
      console.log('🗂️ Loaded systemReceiptId from localStorage:', savedSystemReceiptId);
    }
    
    const savedIdPhatHanh = localStorage.getItem('idPhatHanh');
    if (savedIdPhatHanh && !idPhatHanh) {
      setIdPhatHanh(savedIdPhatHanh);
      console.log('🗂️ Loaded idPhatHanh from localStorage:', savedIdPhatHanh);
    }
  }, []);

  // Add CSS for loading spinner animation
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Map data from selected item (either fee declaration or receipt data)
  React.useEffect(() => {
    if (selectedItem) {
      console.log('🗂️ ===== RECEIPT MAPPING DEBUG =====');
      console.log('🗂️ Full selectedItem object:', JSON.stringify(selectedItem, null, 2));
      console.log('🗂️ isEditMode:', isEditMode);
      
      if (isEditMode) {
        // Handle receipt data (from /api/bien-lai/{id})
        console.log('🗂️ Processing receipt data...');
        
        // Load receipt data into form
        setReceiptCode(selectedItem.maBl || '');
        setReceiptNumber(selectedItem.soBl || '');
        setReceiptDate(selectedItem.ngayBl ? selectedItem.ngayBl.split('T')[0] : '');
        setPaymentMethod(selectedItem.hthucTtoan || 'Chuyển khoản');
        setNotes(selectedItem.ghiChu || '');
        setStbNumber(selectedItem.stb || '');
        setDeclarationDate(selectedItem.ngayNop ? selectedItem.ngayNop.split('T')[0] : '');
        setCustomsDeclarationNumber(selectedItem.soTk || '');
        setCustomsDeclarationDate(selectedItem.ngayTk ? selectedItem.ngayTk.split('T')[0] : '');
        setStorageLocationCode(selectedItem.maKho || '');
        
        // Load company information
        setCompanyCode(selectedItem.mst || '');
        setCompanyName(selectedItem.tenDvi || '');
        setCompanyAddress(selectedItem.diaChi || '');
        setPayerEmail(selectedItem.email || '');
        setPayerIdNumber(selectedItem.sdt || '');
        
        // Load fee details
        if (selectedItem.chiTietList && selectedItem.chiTietList.length > 0) {
          console.log('🗂️ DEBUG: EDIT MODE - Loading fee details from receipt data');
          console.log('🗂️ DEBUG: EDIT MODE - isEditMode:', isEditMode);
          console.log('🗂️ DEBUG: EDIT MODE - selectedItem.idPhatHanh:', selectedItem.idPhatHanh);
          console.log('🗂️ DEBUG: EDIT MODE - selectedItem keys:', Object.keys(selectedItem));
          console.log('🗂️ DEBUG: EDIT MODE - Has idPhatHanh?', 'idPhatHanh' in selectedItem);
          
          const mappedFeeDetails = selectedItem.chiTietList.map((chiTiet: any, index: number) => {
            const content = chiTiet.ndungTp || `Chi tiết phí ${index + 1}`;
            console.log(`🗂️ DEBUG: EDIT MODE - Chi tiết ${index + 1} content:`, content);
            console.log(`🗂️ DEBUG: EDIT MODE - chiTiet.ndungTp:`, chiTiet.ndungTp);
            return {
              id: chiTiet.id || index + 1,
              content: content,
              unit: chiTiet.dvt || '',
              quantity: chiTiet.soLuong || 1,
              price: chiTiet.donGia || 0,
              total: chiTiet.soTien || 0
            };
          });
          setFeeDetails(mappedFeeDetails);
          console.log('🗂️ Loaded fee details from receipt data:', mappedFeeDetails);
          console.log('🗂️ First chiTiet item:', selectedItem.chiTietList[0]);
        }
        
        // Set system receipt ID and saved state
        if (selectedItem.id) {
          setSystemReceiptId(selectedItem.id);
          setIsSaved(true);
          // Use passedTrangThaiPhatHanh if available, otherwise default to '01' for edit mode
          const newTrangThaiPhatHanh = passedTrangThaiPhatHanh || '01';
          setCurrentTrangThaiPhatHanh(newTrangThaiPhatHanh);
          console.log('🗂️ Set systemReceiptId:', selectedItem.id);
          console.log('🗂️ Set isSaved: true');
          console.log('🗂️ Set currentTrangThaiPhatHanh:', newTrangThaiPhatHanh);
          console.log('🗂️ Source - passedTrangThaiPhatHanh:', passedTrangThaiPhatHanh);
        }
        
        // For edit mode, use passedToKhaiId from parent component
        if (passedToKhaiId) {
          setToKhaiId(passedToKhaiId);
          console.log('🗂️ Set toKhaiId from parent:', passedToKhaiId);
        } else {
          console.log('🗂️ Warning: No toKhaiId passed from parent component');
        }
        
        // Set idPhatHanh from selectedItem for edit mode
        if (selectedItem.idPhatHanh) {
          setIdPhatHanh(selectedItem.idPhatHanh);
          console.log('🗂️ Set idPhatHanh from selectedItem:', selectedItem.idPhatHanh);
        } else {
          console.log('🗂️ Warning: No idPhatHanh in selectedItem');
        }
        
      } else {
        // Handle fee declaration data (from /api/tokhai-thongtin/{id})
        console.log('🗂️ Processing fee declaration data...');
        
        // Set current trangThaiPhatHanh - prioritize passedTrangThaiPhatHanh from parent
        const newTrangThaiPhatHanh = passedTrangThaiPhatHanh || selectedItem.trangThaiPhatHanh || '00';
        console.log('🔍 Setting currentTrangThaiPhatHanh to:', newTrangThaiPhatHanh);
        console.log('🔍 Source - passedTrangThaiPhatHanh:', passedTrangThaiPhatHanh);
        console.log('🔍 Source - selectedItem.trangThaiPhatHanh:', selectedItem.trangThaiPhatHanh);
        setCurrentTrangThaiPhatHanh(newTrangThaiPhatHanh);
        
        // Set toKhaiId from fee declaration data
        if (selectedItem.id) {
          setToKhaiId(selectedItem.id);
          console.log('🗂️ Set toKhaiId:', selectedItem.id);
        }
        
        // Map company information from API response
        if (selectedItem.maDoanhNghiepKhaiPhi) {
          setCompanyCode(selectedItem.maDoanhNghiepKhaiPhi || '');
          setCompanyName(selectedItem.tenDoanhNghiepKhaiPhi || '');
          setCompanyAddress(selectedItem.diaChiKhaiPhi || '');
          setReceivingCompanyCode(selectedItem.maDoanhNghiepXNK || selectedItem.maDoanhNghiepKhaiPhi || '');
          setReceivingCompanyName(selectedItem.tenDoanhNghiepXNK || selectedItem.tenDoanhNghiepKhaiPhi || '');
          setPayerEmail(''); // API doesn't provide email
          setPayerName(selectedItem.tenDoanhNghiepKhaiPhi || '');
        } else if (selectedItem.company) {
          // Fallback to old structure
          setCompanyCode(selectedItem.company.taxCode || '');
          setCompanyName(selectedItem.company.companyName || '');
          setCompanyAddress(selectedItem.company.address || '');
          setReceivingCompanyCode(selectedItem.company.taxCode || '');
          setReceivingCompanyName(selectedItem.company.companyName || '');
          setPayerEmail(selectedItem.company.email || '');
          setPayerName(selectedItem.company.representativeName || selectedItem.company.companyName || '');
        }
        
        // Map declaration information from API response
        if (selectedItem.soToKhai) {
          setCustomsDeclarationNumber(selectedItem.soToKhai);
        } else if (selectedItem.declarationNumber) {
          setCustomsDeclarationNumber(selectedItem.declarationNumber);
        }
        
        if (selectedItem.ngayToKhai) {
          setDeclarationDate(selectedItem.ngayToKhai);
          setCustomsDeclarationDate(selectedItem.ngayToKhai);
        } else if (selectedItem.arrivalDate) {
          setDeclarationDate(selectedItem.arrivalDate);
          setCustomsDeclarationDate(selectedItem.arrivalDate);
        }
        
        // Generate receipt code based on declaration number
        const declarationNumber = selectedItem.soToKhai || selectedItem.declarationNumber;
        if (declarationNumber) {
          const lastFourDigits = declarationNumber.slice(-4);
          const receiptCodeGenerated = `BL${lastFourDigits.padStart(6, '0')}`;
          setReceiptCode(receiptCodeGenerated);
        }
        
        // Set current date for receipt
        setReceiptDate(new Date().toISOString().split('T')[0]);
        
        // Set notes with declaration info
        // Set notes from ghiChu field (nội dung thu phí)
        setNotes(selectedItem.ghiChu || '');
        
        // Check if there are existing receipts for this fee declaration
        checkExistingReceiptsFromLocalStorage(selectedItem.id);
      }
      
      console.log('Data mapping completed');
    }
  }, [selectedItem, isEditMode]);


  // Function to check existing receipts from localStorage (workaround)
  const checkExistingReceiptsFromLocalStorage = (feeDeclarationId: number) => {
    try {
      console.log('Checking localStorage for existing receipts for fee declaration:', feeDeclarationId);
      
      // Check localStorage for receipt updates (new array format)
      const feeDeclarationUpdates = JSON.parse(localStorage.getItem('feeDeclarationUpdates') || '[]');
      const issuedReceipts = JSON.parse(localStorage.getItem('issuedReceipts') || '[]');
      
      console.log('feeDeclarationUpdates:', feeDeclarationUpdates);
      console.log('issuedReceipts:', issuedReceipts);
      
      // Find update for this specific fee declaration
      const updateForThisDeclaration = feeDeclarationUpdates.find((update: any) => 
        update.id === feeDeclarationId && update.receiptCreated
      );
      
      console.log('updateForThisDeclaration:', updateForThisDeclaration);
      
      if (updateForThisDeclaration) {
        console.log('Found existing receipt info in localStorage:', updateForThisDeclaration);
        
        // Set receipt state based on localStorage data
        setIsSaved(true);
        console.log('✅ Set isSaved = true from localStorage update');
        console.log('✅ New isSaved state:', true);
        setSavedReceiptId(updateForThisDeclaration.receiptId || Date.now()); // Use stored receipt ID
        
        // Load system receipt ID if available
        if (updateForThisDeclaration.systemReceiptId) {
          setSystemReceiptId(updateForThisDeclaration.systemReceiptId);
          console.log('✅ Loaded systemReceiptId from localStorage:', updateForThisDeclaration.systemReceiptId);
        }
        
        // Load idPhatHanh from localStorage if available
        // if (updateForThisDeclaration.idPhatHanh) {
        //   setIdPhatHanh(updateForThisDeclaration.idPhatHanh);
        //   console.log('✅ Loaded idPhatHanh from localStorage:', updateForThisDeclaration.idPhatHanh);
        // }
        
        // Check if receipt was issued
        const hasIssuedReceipt = issuedReceipts.some((receipt: any) => 
          receipt.feeDeclarationId === feeDeclarationId
        );
        
        if (hasIssuedReceipt || updateForThisDeclaration.receiptStatus === 'ISSUED') {
          // setReceiptStatus('ISSUED');
          console.log('Receipt already issued - showing issued state');
        } else {
          // setReceiptStatus('DRAFT');
          console.log('Draft receipt found - showing issue receipt button');
        }
        
        return;
      }
      
      // Fallback: Check old single-record format for backward compatibility
      const legacyUpdate = JSON.parse(localStorage.getItem('feeDeclarationUpdated') || '{}');
      if (legacyUpdate.id === feeDeclarationId && legacyUpdate.receiptCreated) {
        console.log('Found legacy receipt info:', legacyUpdate);
        setIsSaved(true);
        setSavedReceiptId(legacyUpdate.receiptId || Date.now());
        // setReceiptStatus(legacyUpdate.receiptStatus || 'DRAFT');
        return;
      }
      
      console.log('No existing receipts found for fee declaration:', feeDeclarationId);
    } catch (error) {
      console.error('Error checking localStorage for existing receipts:', error);
    }
  };

  // Function to check and load existing receipts (API version - disabled)
  // const checkExistingReceipts = async (_feeDeclarationId: number) => {
  //   try {
  //     console.log('Checking existing receipts for fee declaration:', _feeDeclarationId);
  //     const response = await ReceiptService.getReceiptsByFeeDeclarationId(_feeDeclarationId);
  //     
  //     if (response.success && response.data && response.data.length > 0) {
  //       const existingReceipt = response.data[0]; // Get the first (latest) receipt
  //       console.log('Found existing receipt:', existingReceipt);
  //       
  //       // Load receipt data into form
  //       setReceiptCode(existingReceipt.receiptCode || '');
  //       setReceiptNumber(existingReceipt.receiptNumber || '');
  //       setReceiptDate(existingReceipt.receiptDate || '');
  //       setPayerName(existingReceipt.payerName || '');
  //       setPayerEmail(existingReceipt.payerEmail || '');
  //       // setPayerPhone(existingReceipt.payerPhone || '');
  //       setPayerIdNumber(existingReceipt.payerIdNumber || '');
  //       setPaymentMethod(existingReceipt.paymentMethod || 'CASH');
  //       setNotes(existingReceipt.notes || '');
  //       
  //       // Load receipt details
  //       if (existingReceipt.receiptDetails) {
  //         setFeeDetails(existingReceipt.receiptDetails.map((detail, index) => ({
  //           id: index + 1,
  //           content: detail.content || '',
  //           quantity: detail.quantity || 0,
  //           unit: detail.unit || '',
  //           price: detail.unitPrice || 0,
  //           total: detail.totalAmount || 0
  //         })));
  //       }
  //       
  //       // Set receipt state
  //       setIsSaved(true);
  //       setSavedReceiptId(existingReceipt.id!);
  //       setReceiptStatus(existingReceipt.status || 'DRAFT');
  //       
  //       console.log('Loaded existing receipt with status:', existingReceipt.status);
  //     } else {
  //       console.log('No existing receipts found for fee declaration:', _feeDeclarationId);
  //     }
  //   } catch (error) {
  //     console.error('Error checking existing receipts:', error);
  //     // Don't show error to user as this is just a check
  //   }
  // };

  // Form states
  const [receiptCode, setReceiptCode] = useState('BL000001');
  const [receiptNumber, setReceiptNumber] = useState('000000001');
  const [paymentMethod, setPaymentMethod] = useState('Chuyển khoản');
  const [receiptDate, setReceiptDate] = useState('2021-08-21');
  const [notes, setNotes] = useState('');
  const [storageLocationCode, setStorageLocationCode] = useState('Q214A81');
  const [stbNumber, setStbNumber] = useState('2149180185649');
  const [declarationDate, setDeclarationDate] = useState('2021-08-16');
  const [customsDeclarationNumber, setCustomsDeclarationNumber] = useState('1357487692765');
  const [customsDeclarationDate, setCustomsDeclarationDate] = useState('2021-08-16');

  // Company information states
  const [companyCode, setCompanyCode] = useState('0314308155');
  const [companyName, setCompanyName] = useState('CÔNG TY TNHH DELVNETS VIETNAM');
  const [companyAddress, setCompanyAddress] = useState('Tầng 5, Cao ốc Vạn Phúc Số 25 Nguyễn Thị Điều - Phường 06 - Quận 3 - TP Hồ Chí Minh');
  const [receivingCompanyCode, setReceivingCompanyCode] = useState('0314308155');
  const [receivingCompanyName, setReceivingCompanyName] = useState('CÔNG TY TNHH DELVNETS VIETNAM');
  const [payerName, setPayerName] = useState('0314308153');
  const [payerEmail, setPayerEmail] = useState('logistics.hq@delvnetsvietnam.com');
  const [payerIdNumber, setPayerIdNumber] = useState('036734867');

  // Checkbox states
  const [samePayment, setSamePayment] = useState(false);
  const [containerList, setContainerList] = useState(false);
  const [commonContainerDeclaration, setCommonContainerDeclaration] = useState(false);
  const [attached, setAttached] = useState(false);

  // Save state
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isIssuing, setIsIssuing] = useState(false);
  // const [receiptStatus, setReceiptStatus] = useState<'DRAFT' | 'ISSUED' | 'CANCELLED' | 'PAID'>('DRAFT');
  const [currentTrangThaiPhatHanh, setCurrentTrangThaiPhatHanh] = useState<string>(passedTrangThaiPhatHanh || '00');
  const [savedReceiptId, setSavedReceiptId] = useState<number | null>(null);
  const [systemReceiptId, setSystemReceiptId] = useState<number | null>(null); // ID từ hệ thống biên lai
  const [toKhaiId, setToKhaiId] = useState<number | null>(null); // ID của tờ khai
  const [idPhatHanh, setIdPhatHanh] = useState<string>(''); // ID phát hành
  const [createdSid, setCreatedSid] = useState<string>('');
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [receiptImageBase64, setReceiptImageBase64] = useState<string>('');

  // Fee details - will be populated from selected fee declaration
  const [feeDetails, setFeeDetails] = useState([
    {
      id: 1,
      content: 'Cảng-Đã thành, phí hỗ trợ phí biên tờ khai (1355430545&4)',
      unit: '',
      quantity: 1,
      price: 250000,
      total: 250000
    },
    {
      id: 2,
      content: 'TH001_C404-Container 40 feet',
      unit: '',
      quantity: 1,
      price: 500000,
      total: 500000
    }
  ]);

  // Update fee details when selected fee declaration changes
  React.useEffect(() => {
    if (selectedItem) {
      // Map fee details from chiTietList if available, otherwise generate default
      console.log('🗂️ Checking chiTietList condition...');
      console.log('🗂️ chiTietList exists:', !!selectedItem.chiTietList);
      console.log('🗂️ chiTietList length:', selectedItem.chiTietList?.length);
      console.log('🗂️ chiTietList > 0:', (selectedItem.chiTietList?.length || 0) > 0);
      
      // Check if we have valid chiTietList data
      const hasValidChiTietList = selectedItem.chiTietList && 
                                 Array.isArray(selectedItem.chiTietList) && 
                                 selectedItem.chiTietList.length > 0;
      
      console.log('🗂️ hasValidChiTietList:', hasValidChiTietList);
      
      if (hasValidChiTietList) {
        console.log('🗂️ ✅ Mapping chiTietList:', selectedItem.chiTietList);
        console.log('🗂️ First chiTiet item:', selectedItem.chiTietList[0]);
        console.log('🗂️ First chiTiet ghiChu:', selectedItem.chiTietList[0]?.ghiChu);
        console.log('🗂️ First chiTiet ghiChuKhaiPhi:', selectedItem.chiTietList[0]?.ghiChuKhaiPhi);
        console.log('🗂️ DEBUG: CREATE MODE - selectedItem.ghiChu for mapping:', selectedItem.ghiChu);
        console.log('🗂️ DEBUG: CREATE MODE - selectedItem.ndungTp for mapping:', selectedItem.ndungTp);
        console.log('🗂️ DEBUG: CREATE MODE - isEditMode:', isEditMode);
        console.log('🗂️ DEBUG: CREATE MODE - Full selectedItem structure:', JSON.stringify(selectedItem, null, 2));
        const mappedFeeDetails = selectedItem.chiTietList.map((chiTiet: any, index: number) => {
          console.log(`🗂️ DEBUG: CREATE MODE - chiTiet ${index + 1} structure:`, JSON.stringify(chiTiet, null, 2));
          // Thử nhiều trường khác nhau để lấy nội dung thu phí
          const content = selectedItem.ghiChu || 
                         selectedItem.ndungTp || 
                         selectedItem.noiDung || 
                         selectedItem.moTa || 
                         selectedItem.tenNoiDung ||
                         chiTiet.ghiChu ||
                         chiTiet.ndungTp ||
                         chiTiet.noiDung ||
                         chiTiet.moTa ||
                         `Chi tiết phí ${index + 1}`;
          console.log(`🗂️ DEBUG: CREATE MODE - Chi tiết ${index + 1} content:`, content);
          console.log(`🗂️ DEBUG: CREATE MODE - Fallback tried - ghiChu: ${selectedItem.ghiChu}, ndungTp: ${selectedItem.ndungTp}, noiDung: ${selectedItem.noiDung}`);
          console.log(`🗂️ DEBUG: CREATE MODE - chiTiet fields - ghiChu: ${chiTiet.ghiChu}, ndungTp: ${chiTiet.ndungTp}, noiDung: ${chiTiet.noiDung}`);
          return {
            id: index + 1,
            content: content, // Lấy từ ghiChu của tờ khai (create mode)
            unit: chiTiet.donViTinh || chiTiet.dvt || chiTiet.unit || '',
            quantity: chiTiet.tongTrongLuong || chiTiet.soLuong || 1,
            price: chiTiet.soTien || chiTiet.thanhTien || 0,
            total: chiTiet.soTien || chiTiet.thanhTien || 0
          };
        });
        
        setFeeDetails(mappedFeeDetails);
        console.log('🗂️ ✅ Fee details mapped from chiTietList:', mappedFeeDetails);
        console.log('🗂️ ✅ Total mapped items:', mappedFeeDetails.length);
      } else {
        // Fallback to generated fee details if no chiTietList
        console.log('🗂️ ❌ No chiTietList found, generating default fee details');
        console.log('🗂️ Reason: chiTietList is', selectedItem.chiTietList);
        const totalAmount = selectedItem.tongTienPhi || selectedItem.totalFeeAmount || 750000;
        console.log('🗂️ Using totalAmount:', totalAmount);
        const vesselName = selectedItem.phuongTienVC || selectedItem.vesselName || 'N/A';
        const generatedFeeDetails = [
          {
            id: 1,
            content: `Phí cảng vụ cho tàu ${vesselName}`,
            unit: 'Tàu',
            quantity: 1,
            price: Math.round(totalAmount * 0.6),
            total: Math.round(totalAmount * 0.6)
          },
          {
            id: 2,
            content: `Phí hoa tiêu - Container ${selectedItem.grossTonnage || 'N/A'} tấn`,
            unit: 'Container',
            quantity: 1,
            price: Math.round(totalAmount * 0.4),
            total: Math.round(totalAmount * 0.4)
          }
        ];
        
        setFeeDetails(generatedFeeDetails);
        console.log('Fee details generated (fallback):', generatedFeeDetails);
      }
    }
  }, [selectedItem]);

  const totalAmount = feeDetails.reduce((sum, item) => sum + item.total, 0);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN');
  };

  // Function to save receipt data to system
  const saveReceiptToSystem = async (sidToUse?: string) => {
    try {
      // Với trạng thái phát hành 01 (Bản nháp), chỉ update thôi
      // Chỉ tạo mới khi chưa có systemReceiptId (lần đầu tạo)
      const isUpdate = systemReceiptId !== null;
      
      // Validation: Với trạng thái 01, phải có systemReceiptId để update
      if (currentTrangThaiPhatHanh === '01' && !systemReceiptId) {
        throw new Error('Trạng thái Bản nháp (01) yêu cầu phải có ID biên lai để update');
      }
      
      const apiEndpoint = isUpdate ? '/api/bien-lai/update' : '/api/bien-lai/create';
      
      console.log(`🔍 Calling ${apiEndpoint} API...`);
      console.log('🔍 Is update mode:', isUpdate);
      console.log('🔍 Current trangThaiPhatHanh:', currentTrangThaiPhatHanh);
      console.log('🔍 System receipt ID:', systemReceiptId);
      console.log('🔍 toKhaiId:', selectedItem?.id);
      console.log('🔍 Logic: systemReceiptId !== null =', systemReceiptId !== null);
      
      // Use createdSid as idPhatHanh for both create and update operations
      // Use passed sid or existing createdSid or generate new one
      let finalIdPhatHanh = sidToUse || createdSid;
      
      if (!finalIdPhatHanh) {
        finalIdPhatHanh = `FPTIDA${Date.now()}`;
        setCreatedSid(finalIdPhatHanh);
        console.log('🔍 Generated new idPhatHanh:', finalIdPhatHanh);
      } else {
        console.log('🔍 Using idPhatHanh:', finalIdPhatHanh);
        console.log('🔍 Source - sidToUse:', sidToUse);
        console.log('🔍 Source - createdSid:', createdSid);
      }
      
      console.log('🔍 Final idPhatHanh:', finalIdPhatHanh);
      console.log('🔍 Operation type:', isUpdate ? 'UPDATE' : 'CREATE');
      console.log('🔍 ===== ID PHÁT HÀNH CONSISTENCY CHECK =====');
      console.log('🔍 FPT E-Invoice API will use sid:', sidToUse || createdSid);
      console.log('🔍 Bien-lai API will use idPhatHanh:', finalIdPhatHanh);
      console.log('🔍 Are they the same?', (sidToUse || createdSid) === finalIdPhatHanh);
      console.log('🔍 ===== END CONSISTENCY CHECK =====');
      
      const baseData = {
        mst: companyCode,
        tenDvi: companyName,
        diaChi: companyAddress,
        email: payerEmail,
        sdt: payerIdNumber,
        maBl: receiptCode,
        soBl: receiptNumber,
        hthucTtoan: paymentMethod,
        ngayBl: new Date(receiptDate).toISOString(),
        loaiCtiet: "01", // Default type
        ghiChu: notes,
        stb: stbNumber,
        ngayNop: new Date().toISOString(),
        soTk: customsDeclarationNumber,
        ngayTk: new Date(customsDeclarationDate).toISOString(),
        maKho: storageLocationCode,
        toKhaiId: toKhaiId || 0, // Use toKhaiId state
        idPhatHanh: finalIdPhatHanh, // Add idPhatHanh
        chiTietList: feeDetails.map(detail => ({
          id: detail.id || 0, // Include ID for update
          ndungTp: detail.content,
          dvt: detail.unit,
          soLuong: detail.quantity,
          donGia: detail.price,
          soTien: detail.total
        }))
      };

      // Add specific fields based on create/update
      const receiptData = isUpdate 
        ? {
            ...baseData,
            id: systemReceiptId,
            nguoiSua: "System"
          }
        : {
            ...baseData,
            nguoiTao: "System"
          };

      console.log('🔍 Receipt data to save:', receiptData);
      console.log('🔍 chiTietList mapping:', receiptData.chiTietList);
      console.log('🔍 API endpoint:', apiEndpoint);
      console.log('🔍 Request method:', isUpdate ? 'PUT' : 'POST');
      console.log('🔍 Request body:', JSON.stringify(receiptData, null, 2));
      console.log('🔍 idPhatHanh in request:', receiptData.idPhatHanh);
      console.log('🔍 Operation:', isUpdate ? 'UPDATE' : 'CREATE');

      const response = await fetch(apiEndpoint, {
        method: isUpdate ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(receiptData)
      });

      console.log('🔍 Response status:', response.status);
      console.log('🔍 Response ok:', response.ok);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log('🔍 Error response data:', errorData);
        console.log('🔍 Error response text:', await response.text().catch(() => 'No text'));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(`✅ Receipt ${isUpdate ? 'updated' : 'created'} in system successfully:`, result);
      
      // If it's a create operation, save the returned ID
      if (!isUpdate && result.id) {
        setSystemReceiptId(result.id);
        console.log('✅ Saved system receipt ID:', result.id);
        
        // Also save to localStorage for persistence
        localStorage.setItem('systemReceiptId', result.id.toString());
        console.log('✅ Saved system receipt ID to localStorage:', result.id);
        
        // Save idPhatHanh to localStorage for later use
        localStorage.setItem('idPhatHanh', finalIdPhatHanh);
        console.log('✅ Saved idPhatHanh to localStorage:', finalIdPhatHanh);
      }
      
    } catch (error) {
      console.error('❌ Error saving receipt to system:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : 'Unknown'
      });
      // Don't show error to user as this is additional save
      // The main E-Invoice save was already successful
    }
  };

  const handleSave = async () => {
    console.log('=== handleSave clicked ===');
    console.log('receiptCode:', receiptCode);
    console.log('payerName:', payerName);
    console.log('payerEmail:', payerEmail);
    
    // Generate sid once for this save operation
    let currentSid = createdSid;
    if (!createdSid) {
      currentSid = `FPTIDA${Date.now()}`;
      setCreatedSid(currentSid);
      console.log('🔍 Generated new sid for save operation:', currentSid);
    } else {
      console.log('🔍 Using existing sid for save operation:', currentSid);
    }
    
    try {
      setIsSaving(true);
      
      // Validate status - allow save when status is '00' (Mới) or '01' (Bản nháp)
      if (currentTrangThaiPhatHanh !== '00' && currentTrangThaiPhatHanh !== '01') {
        console.log('Validation failed: currentTrangThaiPhatHanh is not "00" or "01"', currentTrangThaiPhatHanh);
        showError('Chỉ có thể lưu biên lai ở trạng thái "Mới" hoặc "Bản nháp"');
        return;
      }
      console.log('Validation passed: currentTrangThaiPhatHanh =', currentTrangThaiPhatHanh);
      
      // Validate required fields
      if (!receiptCode.trim()) {
        console.log('Validation failed: receiptCode is empty');
        showError('Vui lòng nhập mã biên lai');
        return;
      }
      console.log('Validation passed: receiptCode =', receiptCode);
      
      if (!payerName.trim()) {
        console.log('Validation failed: payerName is empty');
        showError('Vui lòng nhập tên người nộp phí');
        return;
      }
      console.log('Validation passed: payerName =', payerName);
      
      if (!payerEmail.trim()) {
        console.log('Validation failed: payerEmail is empty');
        showError('Vui lòng nhập email người nộp phí');
        return;
      }
      console.log('Validation passed: payerEmail =', payerEmail);
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(payerEmail.trim())) {
        console.log('Validation failed: payerEmail format is invalid');
        showError('Vui lòng nhập địa chỉ email hợp lệ');
        return;
      }
      console.log('Validation passed: payerEmail format is valid');

      // Call Backend E-Invoice API directly
      console.log('🔍 Calling Backend E-Invoice API...');
      const eInvoiceRequest = mapToFPTEInvoiceRequest(currentSid);
      console.log('🔍 Backend E-Invoice request:', eInvoiceRequest);
      console.log('🔍 ===== SID CONSISTENCY CHECK =====');
      console.log('🔍 FPT E-Invoice API sid:', eInvoiceRequest.inv.sid);
      console.log('🔍 Bien-lai API will use idPhatHanh:', currentSid);
      console.log('🔍 Are they the same?', eInvoiceRequest.inv.sid === currentSid);
      console.log('🔍 ===== END SID CONSISTENCY CHECK =====');
      
      const eInvoiceResponse = await fptEInvoiceService.createICR(eInvoiceRequest);
      console.log('🔍 Backend E-Invoice response:', eInvoiceResponse);
      console.log('🔍 eInvoiceResponse.success:', eInvoiceResponse.success);
      console.log('🔍 eInvoiceResponse.data:', eInvoiceResponse.data);
      
      // Check if backend is not available
      if (!eInvoiceResponse.success && eInvoiceResponse.error?.includes('HTTP')) {
        console.log('❌ Backend server not available, using mock fallback');
        
        // Use mock fallback for development
        const mockResponse = {
          success: true,
          data: {
            id: Date.now().toString(),
            status: 6,
            message: 'Mock receipt created successfully'
          }
        };
        
        console.log('🔍 Using mock response:', mockResponse);
        
        // Process mock response as if it were real
        const responseData = mockResponse.data;
        console.log('✅ Mock E-Invoice created successfully, status:', responseData.status);
        
        if (responseData.status === 6) {
          // Success - set states
          console.log('🎉 SUCCESS: Mock responseData.status === 6, showing success message');
          setIsSaved(true);
          console.log('✅ Set isSaved = true from Mock E-Invoice success');
          setSavedReceiptId(parseInt(responseData.id) || Date.now());
          
          // Only update to "Bản nháp" if currently "Mới"
          if (currentTrangThaiPhatHanh === '00') {
            setCurrentTrangThaiPhatHanh('01'); // Update to "Bản nháp" after successful save
          }
          console.log('🔔 Calling showSuccess with message: Lưu biên lai thành công! (Mock)');
          showSuccess('Lưu biên lai thành công! (Chế độ phát triển)', 'Lưu biên lai');
          console.log('🔔 showSuccess called successfully');
          
          // Store mock data for later use
          localStorage.setItem('eInvoiceData', JSON.stringify(responseData));
          
          // Call additional API to save receipt data (even in mock mode)
          await saveReceiptToSystem(currentSid);
          
          // Update localStorage with system receipt ID (mock mode)
          if (systemReceiptId) {
            const existingUpdates = JSON.parse(localStorage.getItem('feeDeclarationUpdates') || '[]');
            const updatedUpdates = existingUpdates.map((update: any) => 
              update.id === selectedItem?.id 
                ? { ...update, systemReceiptId: systemReceiptId }
                : update
            );
            localStorage.setItem('feeDeclarationUpdates', JSON.stringify(updatedUpdates));
            console.log('✅ Updated localStorage with systemReceiptId (mock):', systemReceiptId);
          }
          
          // Auto-generate receipt code for next time
          if (responseData.id) {
            const nextNumber = parseInt(receiptNumber) + 1;
            setReceiptNumber(String(nextNumber).padStart(7, '0'));
          }
        }
        return;
      }
      
      if (eInvoiceResponse.success && eInvoiceResponse.data) {
        const responseData = eInvoiceResponse.data;
        console.log('✅ E-Invoice created successfully, status:', responseData.status);
        
        if (responseData.status === 6) {
          // Success - set states
          console.log('🎉 SUCCESS: responseData.status === 6, showing success message');
          setIsSaved(true);
          console.log('✅ Set isSaved = true from E-Invoice success');
          setSavedReceiptId(parseInt(responseData.id) || Date.now());
          // Lưu idPhatHanh từ response để sử dụng cho search-icr
          // if (responseData.idPhatHanh) {
          //   setIdPhatHanh(responseData.idPhatHanh);
          //   console.log('✅ Saved idPhatHanh:', responseData.idPhatHanh);
          // }
          // setReceiptStatus('DRAFT');
          // Only update to "Bản nháp" if currently "Mới"
          if (currentTrangThaiPhatHanh === '00') {
            setCurrentTrangThaiPhatHanh('01'); // Update to "Bản nháp" after successful save
          }
          console.log('🔔 Calling showSuccess with message: Lưu biên lai thành công!');
          showSuccess('Lưu biên lai thành công!', 'Lưu biên lai');
          console.log('🔔 showSuccess called successfully');
          
          // Store E-Invoice data for later use
          localStorage.setItem('eInvoiceData', JSON.stringify(responseData));
          
          // Call additional API to save receipt data
          await saveReceiptToSystem(currentSid);
          
          // Update localStorage with system receipt ID
          if (systemReceiptId) {
            const existingUpdates = JSON.parse(localStorage.getItem('feeDeclarationUpdates') || '[]');
            const updatedUpdates = existingUpdates.map((update: any) => 
              update.id === selectedItem?.id 
                ? { ...update, systemReceiptId: systemReceiptId }
                : update
            );
            localStorage.setItem('feeDeclarationUpdates', JSON.stringify(updatedUpdates));
            console.log('✅ Updated localStorage with systemReceiptId:', systemReceiptId);
          }
          
          // Auto-generate receipt code for next time
          if (responseData.id) {
            const nextNumber = parseInt(receiptNumber) + 1;
            setReceiptNumber(String(nextNumber).padStart(7, '0'));
          }
        } else {
          showError('Tạo hóa đơn điện tử thất bại. Status: ' + responseData.status);
        }
      } else {
        showError('Lỗi tạo hóa đơn điện tử: ' + (eInvoiceResponse.error || 'Unknown error'));
      }
      
    } catch (error) {
      console.error('Error saving receipt:', error);
      showError('Có lỗi xảy ra khi lưu biên lai: ' + (error as Error).message);
    } finally {
      console.log('Finally block: setting isSaving to false');
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    navigate(-1); // Go back to previous page
  };

  // Map form data to FPT E-Invoice format
  const mapToFPTEInvoiceRequest = (sidToUse?: string): FPTEInvoiceRequest => {
    const totalAmountValue = totalAmount || 0;
    const vatAmountValue = 0; // Will be calculated from items
    const grandTotal = totalAmountValue + vatAmountValue;
    
    // Use passed sid or existing createdSid or generate new one
    const finalSid = sidToUse || createdSid || `FPTIDA${Date.now()}`;
    if (!sidToUse && !createdSid) {
      setCreatedSid(finalSid);
      console.log('🔍 Generated new sid:', finalSid);
    } else {
      console.log('🔍 Using sid:', finalSid);
    }
    
    console.log('🔍 Mapping to FPT E-Invoice request:');
    console.log('🔍 selectedItem.id (toKhaiId):', selectedItem?.id);
    console.log('🔍 companyName:', companyName);
    console.log('🔍 totalAmountValue:', totalAmountValue);
    console.log('🔍 ===== TOKHAIID DEBUG IN MAP REQUEST =====');
    console.log('🔍 toKhaiId state:', toKhaiId);
    console.log('🔍 selectedItem.id:', selectedItem?.id);
    console.log('🔍 passedToKhaiId:', passedToKhaiId);
    console.log('🔍 Final toKhaiId in request:', toKhaiId);
    console.log('🔍 ===== END TOKHAIID DEBUG =====');
    
    // Convert number to Vietnamese words (simplified)
    const numberToWords = (num: number): string => {
      // This is a simplified version - you might want to use a proper library
      const units = ['', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
      const tens = ['', '', 'hai mươi', 'ba mươi', 'bốn mươi', 'năm mươi', 'sáu mươi', 'bảy mươi', 'tám mươi', 'chín mươi'];
      const hundreds = ['', 'một trăm', 'hai trăm', 'ba trăm', 'bốn trăm', 'năm trăm', 'sáu trăm', 'bảy trăm', 'tám trăm', 'chín trăm'];
      
      if (num === 0) return 'không';
      if (num < 10) return units[num];
      if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + units[num % 10] : '');
      if (num < 1000) return hundreds[Math.floor(num / 100)] + (num % 100 ? ' ' + numberToWords(num % 100) : '');
      
      return num.toString() + ' đồng';
    };

    return {
      lang: "vi",
      user: {
        username: "0304126484.bl",
        password: "Api@123456"
      },
      toKhaiId: toKhaiId, // Use toKhaiId state
      inv: {
        sid: finalSid, // Use consistent sid
        idt: "",
        type: "01/MTT",
        form: "1",
        serial: "C25MTT",
       // aun: 1,                         // << thêm: bạn tự cấp số từ MTT
       // seq: receiptCode,
        seq: "",
        ma_cqthu: "",
        bname: companyName,
        btax: '0304126484',
        btel: '',
        bmail: '',
        idnumber: '',
        note: notes,
        sumv: totalAmountValue,
        sum: totalAmountValue,
        vatv: vatAmountValue,
        vat: vatAmountValue,
        word: numberToWords(grandTotal),
        totalv: grandTotal,
        total: grandTotal,
        tradeamount: 0,
        discount: "",
        type_ref: 1,
        notsendmail: 1,
        sendfile: 1,
        sec: "",
        paym: "CK",
        items: feeDetails.map((detail, index) => ({
          line: index + 1,
          type: "",
          vrt: "10", // 10% VAT
          code: `HH${index + 1}`,
          name: detail.content,
          unit: detail.unit,
          price: detail.price,
          quantity: detail.quantity,
          perdiscount: 0,
          amtdiscount: 0,
          amount: detail.total,
          vat: Math.round(detail.total * 0.1), // 10% VAT
          total: detail.total + Math.round(detail.total * 0.1)
        })),
        stax: '0304126484'
      }
    };
  };

  const handleIssueReceipt = async () => {
    console.log('🔍 ===== HANDLE ISSUE RECEIPT CLICKED =====');
    console.log('🔍 currentTrangThaiPhatHanh:', currentTrangThaiPhatHanh);
    console.log('🔍 currentTrangThaiPhatHanh !== "01":', currentTrangThaiPhatHanh !== '01');
    console.log('🔍 isIssuing:', isIssuing);
    console.log('🔍 ===== END HANDLE ISSUE RECEIPT DEBUG =====');
    
    if (currentTrangThaiPhatHanh !== '01') {
      console.log('🔍 ❌ Cannot issue receipt - not in draft status');
      showError('Chỉ có thể phát hành biên lai ở trạng thái bản nháp');
      return;
    }
    
    if (isIssuing) {
      console.log('Already issuing, ignoring click');
      return; // Prevent double-click
    }
    
    // Determine which sid to use based on status
    let sidToUse = '';
    console.log('🔍 DEBUG: createdSid:', createdSid);
    console.log('🔍 DEBUG: currentTrangThaiPhatHanh:', currentTrangThaiPhatHanh);
    console.log('🔍 DEBUG: selectedItem:', selectedItem);
    
    if (currentTrangThaiPhatHanh === '00' as string) {
      // For 'Mới' status, use createdSid (should exist after save)
      if (createdSid) {
        sidToUse = createdSid;
        console.log('🔍 Using createdSid for status', currentTrangThaiPhatHanh, ':', createdSid);
      } else {
        console.log('🔍 ❌ No createdSid found for status', currentTrangThaiPhatHanh);
        showError('Vui lòng lưu biên lai trước khi phát hành');
        return;
      }
    } else if (currentTrangThaiPhatHanh === '01' as string) {
      // For 'Bản nháp' status, use createdSid if exists (after save), otherwise use idPhatHanh from database
      if (createdSid) {
        sidToUse = createdSid;
        console.log('🔍 Using createdSid after save for status', currentTrangThaiPhatHanh, ':', createdSid);
      } else {
        
        console.log('🔍 DEBUG: idPhatHanh from state:', idPhatHanh);
        console.log('🔍 DEBUG: selectedItem for idPhatHanh:', selectedItem);
        console.log('🔍 DEBUG: selectedItem.idPhatHanh:', selectedItem?.idPhatHanh);
        console.log('🔍 DEBUG: selectedItem keys:', selectedItem ? Object.keys(selectedItem) : 'selectedItem is null');
        
        // Use idPhatHanh from state first, then fallback to selectedItem
        const finalIdPhatHanh = idPhatHanh || selectedItem?.idPhatHanh;
        if (!finalIdPhatHanh) {
          console.log('🔍 ❌ Missing idPhatHanh in both state and selectedItem');
          showError('Không tìm thấy thông tin phát hành từ database.');
          return;
        }
        sidToUse = finalIdPhatHanh;
        console.log('🔍 Using idPhatHanh for status', currentTrangThaiPhatHanh, ':', finalIdPhatHanh);
      }
    } else {
      // For 'Phát hành' and 'Đã hủy' status, use idPhatHanh from database
      console.log('🔍 DEBUG: selectedItem for idPhatHanh (other status):', selectedItem);
      console.log('🔍 DEBUG: selectedItem.idPhatHanh (other status):', selectedItem?.idPhatHanh);
      console.log('🔍 DEBUG: selectedItem keys (other status):', selectedItem ? Object.keys(selectedItem) : 'selectedItem is null');
      if (!selectedItem?.idPhatHanh) {
        console.log('🔍 ❌ Missing idPhatHanh in selectedItem (other status)');
        showError('Không tìm thấy thông tin phát hành từ database.');
        return;
      }
      sidToUse = selectedItem.idPhatHanh;
      console.log('🔍 Using idPhatHanh from database for status', currentTrangThaiPhatHanh, ':', selectedItem.idPhatHanh);
    }
    
    try {
      setIsIssuing(true);
      showInfo('Đang xử lý phát hành biên lai...', 'Phát hành biên lai');
      console.log('Phát hành biên lai...');
      
      // Create search ICR request
      const searchRequest: FPTEInvoiceSearchRequest = {
        stax: "0304126484",
        type: "pdf",
        sid: sidToUse, // Use appropriate sid based on status
        user: {
          username: "0304126484.bl",
          password: "Api@123456"
        },
        toKhaiId: toKhaiId || 0
      };
      
      console.log('🔍 Search ICR Request:', searchRequest);
      console.log('🔍 ===== TOKHAIID DEBUG IN ISSUE RECEIPT =====');
      console.log('🔍 toKhaiId state:', toKhaiId);
      console.log('🔍 selectedItem.id:', selectedItem?.id);
      console.log('🔍 passedToKhaiId:', passedToKhaiId);
      console.log('🔍 Final toKhaiId in request:', toKhaiId || 0);
      console.log('🔍 ===== END TOKHAIID DEBUG =====');
      
      const response = await fptEInvoiceService.searchICR(searchRequest);
      
      // Check if backend is not available for search
      if (!response.success && response.error?.includes('HTTP')) {
        console.log('❌ Backend server not available for search, using mock fallback');
        
        // Use mock search response for development
        const mockSearchResponse = {
          success: true,
          data: {
            base64Data: 'data:application/pdf;base64,JVBERi0xLjQKJcfsj6IKNSAwIG9iago8PAovVHlwZSAvUGFnZQovUGFyZW50IDMgMCBSCi9NZWRpYUJveCBbMCAwIDU5NSA4NDJdCi9SZXNvdXJjZXMgPDwKL0ZvbnQgPDwKL0YxIDIgMCBSCj4+Cj4+Ci9Db250ZW50cyA0IDAgUgo+PgplbmRvYmoKNiAwIG9iago8PAovVHlwZSAvRm9udAovU3VidHlwZSAvVHlwZTEKL0Jhc2VGb250IC9IZWx2ZXRpY2EKPj4KZW5kb2JqCjcgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFs1IDAgUl0KL0NvdW50IDEKPj4KZW5kb2JqCjggMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDcgMCBSCj4+CmVuZG9iagp4cmVmCjAgOQowMDAwMDAwMDAwIDY1NTM1IGYKMDAwMDAwMDAwOSAwMDAwMCBuCjAwMDAwMDAwNTggMDAwMDAgbgowMDAwMDAwMTE1IDAwMDAwIG4KMDAwMDAwMDI2OCAwMDAwMCBuCjAwMDAwMDAzMjUgMDAwMDAgbgowMDAwMDAwNDE0IDAwMDAwIG4KMDAwMDAwMDUwMyAwMDAwMCBuCjAwMDAwMDA1NjIgMDAwMDAgbgp0cmFpbGVyCjw8Ci9TaXplIDkKL1Jvb3QgOCAwIFIKPj4Kc3RhcnR4cmVmCjY1NQolJUVPRgo=',
            message: 'Mock PDF generated successfully'
          }
        };
        
        console.log('🔍 Using mock search response:', mockSearchResponse);
        
        // Process mock search response
        const searchData = mockSearchResponse.data;
        if (searchData.base64Data) {
          setReceiptImageBase64(searchData.base64Data);
          console.log('✅ Mock Base64 PDF extracted');
        }
        
        // Show receipt modal
        setShowReceiptModal(true);
        return;
      }
      
      if (response.success && response.data) {
        console.log('✅ Search ICR successful:', response.data);
        
        // Store search response data
        localStorage.setItem('searchICRData', JSON.stringify(response.data));
        
        // Extract base64 PDF from response
        if (response.data.base64Data || response.data.base64Image || response.data.image || response.data.pdf) {
          const base64Data = response.data.base64Data || response.data.base64Image || response.data.image || response.data.pdf;
          if (base64Data) {
            setReceiptImageBase64(base64Data);
            console.log('✅ Base64 PDF extracted from base64Data:', base64Data ? 'Yes' : 'No');
            console.log('🔍 Base64 data length:', base64Data.length);
          }
        }
        
        // Show receipt modal instead of changing status immediately
        setShowReceiptModal(true);
      } else {
        showError('Lỗi phát hành biên lai: ' + (response.error || 'Unknown error'));
      }
      
    } catch (error) {
      console.error('Error issuing receipt:', error);
      showError('Lỗi phát hành biên lai: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsIssuing(false);
    }
  };

  const handleCloseReceiptModal = () => {
    setShowReceiptModal(false);
  };


  const handleShowConfirmation = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmIssue = async () => {
    setShowConfirmModal(false);
    
    try {
      // Call API to update trang thai phat hanh
      const updateRequest: FPTEInvoiceUpdateStatusRequest = {
        id: toKhaiId || selectedItem?.id || 0
      };
      
      console.log('🔍 Update Status Request:', updateRequest);
      console.log('🔍 Debug - toKhaiId:', toKhaiId);
      console.log('🔍 Debug - selectedItem.id:', selectedItem?.id);
      console.log('🔍 Debug - passedToKhaiId:', passedToKhaiId);
      console.log('🔍 Debug - Final id:', toKhaiId || selectedItem?.id || 0);
      console.log('🔍 Debug - selectedItem keys:', selectedItem ? Object.keys(selectedItem) : 'selectedItem is null');
      
      const response = await fptEInvoiceService.updateTrangThaiPhatHanh(updateRequest);
      
      if (response.success && response.data) {
        console.log('✅ Update Status successful:', response.data);
        
        // Update UI state
        setCurrentTrangThaiPhatHanh('02'); // Update to "Phát hành"
        
        // Update localStorage for backward compatibility
        if (selectedItem) {
          const existingUpdates = JSON.parse(localStorage.getItem('feeDeclarationUpdates') || '[]');
          const issuedUpdate = {
            id: selectedItem.id,
            newPaymentStatus: 'PAID',
            newDeclarationStatus: 'APPROVED', 
            receiptCreated: true,
            receiptStatus: 'ISSUED',
            receiptId: savedReceiptId,
            timestamp: new Date().toISOString()
          };
          
          const filteredUpdates = existingUpdates.filter((update: any) => update.id !== selectedItem.id);
          filteredUpdates.push(issuedUpdate);
          localStorage.setItem('feeDeclarationUpdates', JSON.stringify(filteredUpdates));
          
          // Also update issuedReceipts for backward compatibility
          const issuedReceipts = JSON.parse(localStorage.getItem('issuedReceipts') || '[]');
          if (!issuedReceipts.includes(selectedItem.id)) {
            issuedReceipts.push(selectedItem.id);
            localStorage.setItem('issuedReceipts', JSON.stringify(issuedReceipts));
          }
          
          // Keep backward compatibility
          localStorage.setItem('feeDeclarationUpdated', JSON.stringify(issuedUpdate));
        }
        
        setShowReceiptModal(false);
        showSuccess('Biên lai đã được phát hành thành công!', 'Phát hành biên lai');
        
        // Navigate về trang quản lý tờ khai
        setTimeout(() => {
          navigate('/fee-declaration/manage');
        }, 1500); // Delay navigation để user có thể thấy thông báo
      } else {
        showError('Lỗi cập nhật trạng thái phát hành: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating status:', error);
      showError('Lỗi cập nhật trạng thái phát hành: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleCancelIssue = () => {
    setShowConfirmModal(false);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        
        {/* Company Information Section */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ 
            margin: '0 0 15px 0', 
            fontSize: '14px', 
            fontWeight: 'bold', 
            color: '#333',
            borderLeft: '3px solid #007bff',
            paddingLeft: '10px'
          }}>
            ▶ Đơn vị, doanh nghiệp nộp phí
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '13px' }}>
            <div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '500' }}>
                  Đơn vị được ủy quyền:
                </label>
                <input
                  type="text"
                  value={companyCode}
                  onChange={(e) => setCompanyCode(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '12px',
                    color: '#007bff',
                    fontWeight: 'bold'
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '500' }}>
                  Địa chỉ đơn vị được ủy quyền:
                </label>
                <textarea
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '12px',
                    resize: 'vertical'
                  }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '500' }}>
                    Đơn vị trên tờ khai:
                  </label>
                  <input
                    type="text"
                    value={receivingCompanyCode}
                    onChange={(e) => setReceivingCompanyCode(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={receivingCompanyName}
                    onChange={(e) => setReceivingCompanyName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '12px',
                      color: '#007bff',
                      fontWeight: 'bold',
                      marginTop: '22px' // Align with the input on the left
                    }}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '500' }}>
                  Tên người nộp phí:
                </label>
                <input
                  type="text"
                  value={payerName}
                  onChange={(e) => setPayerName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '500' }}>
                  Email nộp phí:
                </label>
                <input
                  type="email"
                  value={payerEmail}
                  onChange={(e) => setPayerEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '500' }}>
                  Số cmt/điện thoại:
                </label>
                <input
                  type="text"
                  value={payerIdNumber}
                  onChange={(e) => setPayerIdNumber(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Receipt Information Section */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ 
            margin: '0 0 15px 0', 
            fontSize: '14px', 
            fontWeight: 'bold', 
            color: '#333',
            borderLeft: '3px solid #007bff',
            paddingLeft: '10px'
          }}>
            ▶ Thông tin biên lai thu phí
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '500' }}>
                  Mã số biên lai:
                </label>
                <input
                  type="text"
                  value={receiptCode}
                  onChange={(e) => setReceiptCode(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '500' }}>
                  Hình thức thanh toán:
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                >
                  <option value="Chuyển khoản">Chuyển khoản</option>
                  <option value="Tiền mặt">Tiền mặt</option>
                  <option value="Thẻ">Thẻ</option>
                </select>
              </div>
            </div>
            
            <div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '500' }}>
                  Số biên lai:
                </label>
                <input
                  type="text"
                  value={receiptNumber}
                  onChange={(e) => setReceiptNumber(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '500' }}>
                  Ngày biên lai:
                </label>
                <input
                  type="date"
                  value={receiptDate}
                  onChange={(e) => setReceiptDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                />
              </div>
            </div>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '500' }}>
              Ghi chú:
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              style={{
                width: '100%',
                padding: '6px 8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '12px',
                resize: 'vertical'
              }}
              placeholder="Nhập ghi chú..."
            />
          </div>
        </div>

        {/* Declaration Information Section */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ 
            margin: '0 0 15px 0', 
            fontSize: '14px', 
            fontWeight: 'bold', 
            color: '#333',
            borderLeft: '3px solid #007bff',
            paddingLeft: '10px'
          }}>
            ▶ Thông tin tờ khai
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '500' }}>
                STB nhập nộp phí:
              </label>
              <input
                type="text"
                value={stbNumber}
                onChange={(e) => setStbNumber(e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '500' }}>
                Ngày tờ khai nộp phí:
              </label>
              <input
                type="date"
                value={declarationDate}
                onChange={(e) => setDeclarationDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '500' }}>
                Mã địa điểm lưu kho:
              </label>
              <input
                type="text"
                value={storageLocationCode}
                onChange={(e) => setStorageLocationCode(e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}
              />
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginTop: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '500' }}>
                Số tờ khai HQ:
              </label>
              <input
                type="text"
                value={customsDeclarationNumber}
                onChange={(e) => setCustomsDeclarationNumber(e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '500' }}>
                Ngày tờ khai HQ:
              </label>
              <input
                type="date"
                value={customsDeclarationDate}
                onChange={(e) => setCustomsDeclarationDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'end' }}>
              <button
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#17a2b8',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Xem thêm...
              </button>
            </div>
          </div>
        </div>

        {/* Fee Details Section */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ 
            margin: '0 0 15px 0', 
            fontSize: '14px', 
            fontWeight: 'bold', 
            color: '#333',
            borderLeft: '3px solid #007bff',
            paddingLeft: '10px'
          }}>
            ▶ Chi tiết biên lai thu phí
          </h3>
          
          {/* Checkboxes */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '15px', fontSize: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={samePayment}
                onChange={(e) => setSamePayment(e.target.checked)}
                style={{ marginRight: '5px' }}
              />
              Nộp cùng thu phí
            </label>
            
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={containerList}
                onChange={(e) => setContainerList(e.target.checked)}
                style={{ marginRight: '5px' }}
              />
              Danh sách Container
            </label>
            
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={commonContainerDeclaration}
                onChange={(e) => setCommonContainerDeclaration(e.target.checked)}
                style={{ marginRight: '5px' }}
              />
              Danh sách tờ khai chung Container
            </label>
            
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={attached}
                onChange={(e) => setAttached(e.target.checked)}
                style={{ marginRight: '5px' }}
              />
              Đính kèm
            </label>
          </div>
          
          {/* Fee Details Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center', fontSize: '12px', width: '60px' }}>
                  STT
                </th>
                <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left', fontSize: '12px' }}>
                  Nội dung thu phí
                </th>
                <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center', fontSize: '12px', width: '80px' }}>
                  ĐVT
                </th>
                <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center', fontSize: '12px', width: '100px' }}>
                  Số lượng
                </th>
                <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'right', fontSize: '12px', width: '120px' }}>
                  Đơn giá
                </th>
                <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'right', fontSize: '12px', width: '120px' }}>
                  Thành tiền
                </th>
              </tr>
            </thead>
            <tbody>
              {feeDetails.map((item, index) => (
                <tr key={item.id}>
                  <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '12px' }}>
                    {index + 1}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', fontSize: '12px' }}>
                    {item.content}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '12px' }}>
                    {item.unit}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '12px' }}>
                    {item.quantity}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right', fontSize: '12px' }}>
                    {formatCurrency(item.price)}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right', fontSize: '12px' }}>
                    {formatCurrency(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total Amount */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          marginBottom: '20px',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          TỔNG TIỀN: {formatCurrency(totalAmount)}
        </div>

        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid #eee',
          paddingTop: '20px'
        }}>
          {/* Left side - Status and Issue Receipt button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {/* Status indicator */}
            {(() => {
              console.log('🔍 Debug Status indicator:', { 
                isSaved, 
                currentTrangThaiPhatHanh,
                'isSaved condition': isSaved
              });
              return null;
            })()}
            {(
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                borderRadius: '4px',
                backgroundColor: currentTrangThaiPhatHanh === '01' ? '#fef3c7' : 
                                currentTrangThaiPhatHanh === '02' ? '#d1fae5' : 
                                currentTrangThaiPhatHanh === '03' ? '#fee2e2' : '#f3f4f6',
                color: currentTrangThaiPhatHanh === '01' ? '#92400e' : 
                       currentTrangThaiPhatHanh === '02' ? '#065f46' : 
                       currentTrangThaiPhatHanh === '03' ? '#991b1b' : '#374151',
                fontSize: '12px',
                fontWeight: '500',
                border: `1px solid ${currentTrangThaiPhatHanh === '01' ? '#fbbf24' : 
                                   currentTrangThaiPhatHanh === '02' ? '#10b981' : 
                                   currentTrangThaiPhatHanh === '03' ? '#ef4444' : '#9ca3af'}`
              }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: currentTrangThaiPhatHanh === '01' ? '#f59e0b' : 
                                  currentTrangThaiPhatHanh === '02' ? '#10b981' : 
                                  currentTrangThaiPhatHanh === '03' ? '#ef4444' : '#6b7280'
                }}></span>
                Trạng thái: {currentTrangThaiPhatHanh === '02' ? 'Phát hành' : 
                           currentTrangThaiPhatHanh === '01' ? 'Bản nháp' : 
                           currentTrangThaiPhatHanh === '03' ? 'Đã hủy' : 'Mới'}
              </div>
            )}
            
            {/* Issue Receipt button */}
            {(() => {
              console.log('🔍 ===== TRẠNG THÁI PHÁT HÀNH DEBUG =====');
              console.log('🔍 isSaved:', isSaved);
              console.log('🔍 currentTrangThaiPhatHanh:', currentTrangThaiPhatHanh);
              console.log('🔍 currentTrangThaiPhatHanh type:', typeof currentTrangThaiPhatHanh);
              console.log('🔍 currentTrangThaiPhatHanh === "00":', currentTrangThaiPhatHanh === '00');
              console.log('🔍 currentTrangThaiPhatHanh === "01":', currentTrangThaiPhatHanh === '01');
              console.log('🔍 currentTrangThaiPhatHanh === "02":', currentTrangThaiPhatHanh === '02');
              console.log('🔍 isIssuing:', isIssuing);
              console.log('🔍 systemReceiptId:', systemReceiptId);
              console.log('🔍 toKhaiId:', toKhaiId);
              console.log('🔍 selectedItem:', selectedItem);
              console.log('🔍 isEditMode:', isEditMode);
              console.log('🔍 ===== END TRẠNG THÁI PHÁT HÀNH DEBUG =====');
              return null;
            })()}
            {(currentTrangThaiPhatHanh === '00' || currentTrangThaiPhatHanh === '01' || currentTrangThaiPhatHanh === '02') && (
              <button
                onClick={handleIssueReceipt}
                disabled={isIssuing || currentTrangThaiPhatHanh === '00' || currentTrangThaiPhatHanh === '02'}
                style={{
                  backgroundColor: isIssuing ? '#9ca3af' : 
                                 currentTrangThaiPhatHanh === '00' ? '#9ca3af' : 
                                 currentTrangThaiPhatHanh === '02' ? '#6b7280' : '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  cursor: (isIssuing || currentTrangThaiPhatHanh === '00' || currentTrangThaiPhatHanh === '02') ? 'not-allowed' : 'pointer',
                  fontSize: '13px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {isIssuing ? (
                  <>
                    <span style={{ 
                      width: '12px', 
                      height: '12px', 
                      border: '2px solid #fff',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></span>
                    Đang phát hành...
                  </>
                ) : currentTrangThaiPhatHanh === '00' ? (
                  <>🚫 Phát hành biên lai</>
                ) : currentTrangThaiPhatHanh === '02' ? (
                  <>✅ Đã phát hành biên lai</>
                ) : (
                  <>📄 Phát hành biên lai</>
                )}
              </button>
            )}
            
          </div>

          {/* Right side - Save and Close buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleSave}
              disabled={isSaving || (currentTrangThaiPhatHanh !== '00' && currentTrangThaiPhatHanh !== '01')}
              style={{
                backgroundColor: isSaving ? '#9ca3af' : 
                               (currentTrangThaiPhatHanh !== '00' && currentTrangThaiPhatHanh !== '01') ? '#9ca3af' : '#3b82f6',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: (isSaving || (currentTrangThaiPhatHanh !== '00' && currentTrangThaiPhatHanh !== '01')) ? 'not-allowed' : 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {isSaving ? (
                <>
                  <span style={{ 
                    width: '12px', 
                    height: '12px', 
                    border: '2px solid #fff',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></span>
                  Đang lưu...
                </>
              ) : (isSaved && currentTrangThaiPhatHanh === '01') ? (
                '✅ Đã lưu'
              ) : (currentTrangThaiPhatHanh !== '00' && currentTrangThaiPhatHanh !== '01') ? (
                '🚫 Không thể lưu'
              ) : (
                '💾 Lưu lại'
              )}
            </button>
            
            <button
              onClick={handleClose}
              style={{
                backgroundColor: '#6b7280',
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

      {/* Receipt Modal */}
      {showReceiptModal && (
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
            padding: '0',
            maxWidth: '900px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto',
            fontFamily: 'Times New Roman, serif'
          }}>
            {/* Modal Header */}
            <div style={{ backgroundColor: 'white' }}>
              {/* Title Section */}
              <div style={{
                padding: '15px 20px 10px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}>
                <div>
                  <h4 style={{ 
                    margin: '0 0 5px 0', 
                    fontSize: '16px', 
                    fontWeight: 'bold',
                    color: '#333',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ color: '#ff6600' }}>⚠</span>
                    Phát hành biên lai điện tử
                  </h4>
                  <p style={{ 
                    margin: '0', 
                    fontSize: '13px', 
                    color: '#666',
                    fontStyle: 'italic'
                  }}>
                    Biên lai sẽ được phát hành sau khi điền đủ thông tin và bấm "Phát hành biên lai"
                  </p>
                </div>
                <button
                  onClick={handleCloseReceiptModal}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#999',
                    padding: '0',
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ×
                </button>
              </div>
              
              {/* Header Bar */}
              <div style={{
                backgroundColor: '#1e3a5f',
                color: 'white',
                padding: '8px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '13px',
                fontWeight: '500'
              }}>
                <select 
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid #aaa',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '3px',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  <option value="goc" style={{ color: 'black' }}>Biên lai gốc</option>
                  <option value="ban-chinh" style={{ color: 'black' }}>Biên lai bản chính</option>
                  <option value="ban-sao" style={{ color: 'black' }}>Biên lai bản sao</option>
                </select>
                
                <button
                  onClick={handleShowConfirmation}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid #aaa',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '3px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: '500'
                  }}
                  onMouseOver={(e) => {
                    (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                  onMouseOut={(e) => {
                    (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
                  }}
                >
                  <i className="fas fa-print"></i>
                  Phát hành biên lai
                </button>
              </div>
            </div>

            {/* Receipt Content */}
            <div style={{ 
              padding: '20px',
              border: '2px solid #000',
              margin: '20px',
              backgroundColor: 'white'
            }}>
              {/* Receipt Header */}
             

              {/* Title */}
              

              {/* Company Info */}

                

              {/* Fee Details Table */}
             

              {/* Footer signature area - as per image */}

              {/* Receipt PDF */}
              {receiptImageBase64 && (
                <div style={{ 
                  marginTop: '20px',
                  textAlign: 'center'
                }}>
                  <iframe
                    src={receiptImageBase64.startsWith('data:') ? receiptImageBase64 : `data:application/pdf;base64,${receiptImageBase64}`}
                    style={{
                      width: '100%',
                      height: '600px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                    title="Receipt PDF"
                  />
                </div>
              )}
              
            </div>

            {/* Modal Footer */}
            <div style={{ 
              padding: '15px 20px', 
              borderTop: '1px solid #ddd',
              textAlign: 'right',
              backgroundColor: '#f8f9fa'
            }}>
              <button
                onClick={handleCloseReceiptModal}
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

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 1001,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '0',
            width: '450px',
            maxWidth: '90%',
            fontFamily: 'Arial, sans-serif',
            border: '2px solid #000'
          }}>
            {/* Header */}
            <div style={{
              backgroundColor: '#f0f0f0',
              padding: '12px 20px',
              borderBottom: '1px solid #ccc',
              textAlign: 'center',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#333'
            }}>
              THÔNG BÁO
            </div>

            {/* Content */}
            <div style={{
              padding: '30px 20px',
              textAlign: 'center'
            }}>
              <div style={{
                marginBottom: '25px',
                fontSize: '15px',
                color: '#333'
              }}>
                Bạn có chắc chắn muốn phát hành biên lai điện tử này không?
              </div>

              {/* Buttons */}
              <div style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'center',
                marginTop: '15px'
              }}>
                <button
                  onClick={handleConfirmIssue}
                  style={{
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    minWidth: '120px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <i className="fas fa-print"></i>
                  Phát hành
                </button>
                <button
                  onClick={handleCancelIssue}
                  style={{
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    minWidth: '100px'
                  }}
                >
                  ✕ Không
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateReceiptPage;
