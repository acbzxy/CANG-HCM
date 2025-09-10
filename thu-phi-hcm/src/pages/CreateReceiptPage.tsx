import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// import { ReceiptService } from '../utils/receiptApi';
import { fptEInvoiceService, FPTEInvoiceRequest, FPTEInvoiceSearchRequest, FPTEInvoiceUpdateStatusRequest } from '../services/fptEInvoiceService';
import { useNotification } from '../context/NotificationContext';

const CreateReceiptPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedFeeDeclaration = location.state?.selectedItem;
  const { showError, showSuccess, showInfo } = useNotification();

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

  // Map data from selected fee declaration
  React.useEffect(() => {
      if (selectedFeeDeclaration) {
        console.log('Mapping data from selected fee declaration:', selectedFeeDeclaration);
        console.log('🔍 toKhaiId (selectedFeeDeclaration.id):', selectedFeeDeclaration.id);
        console.log('🔍 trangThaiPhatHanh value:', selectedFeeDeclaration.trangThaiPhatHanh);
        console.log('🔍 trangThaiPhatHanh type:', typeof selectedFeeDeclaration.trangThaiPhatHanh);
        console.log('🔍 trangThaiPhatHanh === "01":', selectedFeeDeclaration.trangThaiPhatHanh === '01');
        console.log('🔍 trangThaiPhatHanh === "02":', selectedFeeDeclaration.trangThaiPhatHanh === '02');
        console.log('🔍 trangThaiPhatHanh === "03":', selectedFeeDeclaration.trangThaiPhatHanh === '03');
        console.log('🔍 trangThaiPhatHanh === "00":', selectedFeeDeclaration.trangThaiPhatHanh === '00');
        console.log('Current isSaved state:', isSaved);
        
        // Set current trangThaiPhatHanh
        const newTrangThaiPhatHanh = selectedFeeDeclaration.trangThaiPhatHanh || '00';
        console.log('🔍 Setting currentTrangThaiPhatHanh to:', newTrangThaiPhatHanh);
        setCurrentTrangThaiPhatHanh(newTrangThaiPhatHanh);
        
        // Map company information
      if (selectedFeeDeclaration.company) {
        setCompanyCode(selectedFeeDeclaration.company.taxCode || '');
        setCompanyName(selectedFeeDeclaration.company.companyName || '');
        setCompanyAddress(selectedFeeDeclaration.company.address || '');
        setReceivingCompanyCode(selectedFeeDeclaration.company.taxCode || '');
        setReceivingCompanyName(selectedFeeDeclaration.company.companyName || '');
        setPayerEmail(selectedFeeDeclaration.company.email || '');
        setPayerName(selectedFeeDeclaration.company.representativeName || selectedFeeDeclaration.company.companyName || '');
      }
      
      // Map declaration information
      if (selectedFeeDeclaration.declarationNumber) {
        setCustomsDeclarationNumber(selectedFeeDeclaration.declarationNumber);
      }
      
      if (selectedFeeDeclaration.arrivalDate) {
        setDeclarationDate(selectedFeeDeclaration.arrivalDate);
        setCustomsDeclarationDate(selectedFeeDeclaration.arrivalDate);
      }
      
      // Generate receipt code based on declaration number
      if (selectedFeeDeclaration.declarationNumber) {
        const receiptCodeGenerated = `BL${selectedFeeDeclaration.declarationNumber.slice(-4)}`;
        setReceiptCode(receiptCodeGenerated);
      }
      
      // Set current date for receipt
      setReceiptDate(new Date().toISOString().split('T')[0]);
      
      // Set notes with declaration info
      const notesText = `Biên lai cho tờ khai ${selectedFeeDeclaration.declarationNumber} - Tàu ${selectedFeeDeclaration.vesselName || 'N/A'}`;
      setNotes(notesText);
      
      // Check if there are existing receipts for this fee declaration
      // Use localStorage workaround since backend API is temporarily disabled
      checkExistingReceiptsFromLocalStorage(selectedFeeDeclaration.id);
      
      console.log('Data mapping completed');
    }
  }, [selectedFeeDeclaration]);

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
  const [receiptCode, setReceiptCode] = useState('');
  const [receiptNumber, setReceiptNumber] = useState('0000000');
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
  const [currentTrangThaiPhatHanh, setCurrentTrangThaiPhatHanh] = useState<string>('00');
  const [savedReceiptId, setSavedReceiptId] = useState<number | null>(null);
  // const [idPhatHanh, setIdPhatHanh] = useState<string>('');
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
    if (selectedFeeDeclaration) {
      // Generate fee details based on selected fee declaration
      const generatedFeeDetails = [
        {
          id: 1,
          content: `Phí cảng vụ cho tàu ${selectedFeeDeclaration.vesselName || 'N/A'}`,
          unit: 'Tàu',
          quantity: 1,
          price: Math.round((selectedFeeDeclaration.totalFeeAmount || 750000) * 0.6),
          total: Math.round((selectedFeeDeclaration.totalFeeAmount || 750000) * 0.6)
        },
        {
          id: 2,
          content: `Phí hoa tiêu - Container ${selectedFeeDeclaration.grossTonnage || 'N/A'} tấn`,
          unit: 'Container',
          quantity: 1,
          price: Math.round((selectedFeeDeclaration.totalFeeAmount || 750000) * 0.4),
          total: Math.round((selectedFeeDeclaration.totalFeeAmount || 750000) * 0.4)
        }
      ];
      
      setFeeDetails(generatedFeeDetails);
      console.log('Fee details updated:', generatedFeeDetails);
    }
  }, [selectedFeeDeclaration]);

  const totalAmount = feeDetails.reduce((sum, item) => sum + item.total, 0);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN');
  };

  const handleSave = async () => {
    console.log('=== handleSave clicked ===');
    console.log('receiptCode:', receiptCode);
    console.log('payerName:', payerName);
    console.log('payerEmail:', payerEmail);
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
        alert('Vui lòng nhập mã biên lai'); // Temporary alert for debugging
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
        alert('Vui lòng nhập email người nộp phí'); // Temporary alert for debugging
        showError('Vui lòng nhập email người nộp phí');
        return;
      }
      console.log('Validation passed: payerEmail =', payerEmail);

      // Call Backend E-Invoice API directly
      console.log('🔍 Calling Backend E-Invoice API...');
      const eInvoiceRequest = mapToFPTEInvoiceRequest();
      console.log('🔍 Backend E-Invoice request:', eInvoiceRequest);
      
      const eInvoiceResponse = await fptEInvoiceService.createICR(eInvoiceRequest);
      console.log('🔍 Backend E-Invoice response:', eInvoiceResponse);
      console.log('🔍 eInvoiceResponse.success:', eInvoiceResponse.success);
      console.log('🔍 eInvoiceResponse.data:', eInvoiceResponse.data);
      
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
  const mapToFPTEInvoiceRequest = (): FPTEInvoiceRequest => {
    const totalAmountValue = totalAmount || 0;
    const vatAmountValue = 0; // Will be calculated from items
    const grandTotal = totalAmountValue + vatAmountValue;
    
    // Generate unique sid and save to state
    const generatedSid = `FPTIDA${Date.now()}`;
    setCreatedSid(generatedSid);
    console.log('🔍 Generated sid:', generatedSid);
    
    console.log('🔍 Mapping to FPT E-Invoice request:');
    console.log('🔍 selectedFeeDeclaration.id (toKhaiId):', selectedFeeDeclaration?.id);
    console.log('🔍 companyName:', companyName);
    console.log('🔍 totalAmountValue:', totalAmountValue);
    
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
        username: "0318680861.MPOS",
        password: "Admin@123"
      },
      toKhaiId: selectedFeeDeclaration?.id || null, // Add toKhaiId from selected fee declaration
      inv: {
        sid: generatedSid, // Use generated sid
        idt: "",
        type: "01/MTT",
        form: "1",
        serial: "C25MAA",
        seq: "",
        ma_cqthu: "",
        bname: companyName,
        btax: '0318680861',
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
        paym: "TM",
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
        stax: '0318680861'
      }
    };
  };

  const handleIssueReceipt = async () => {
    if (currentTrangThaiPhatHanh !== '01') {
      showError('Chỉ có thể phát hành biên lai ở trạng thái bản nháp');
      return;
    }
    
    if (isIssuing) {
      console.log('Already issuing, ignoring click');
      return; // Prevent double-click
    }
    
    // Determine which sid to use based on status
    let sidToUse = '';
    if (currentTrangThaiPhatHanh === '00' as string) {
      // For 'Mới' status, use createdSid if exists (after save), otherwise generate new
      if (createdSid) {
        sidToUse = createdSid;
        console.log('🔍 Using createdSid after save for status', currentTrangThaiPhatHanh, ':', createdSid);
      } else {
        const generatedSid = `FPTIDA${Date.now()}`;
        setCreatedSid(generatedSid);
        sidToUse = generatedSid;
        console.log('🔍 Generated new sid for status', currentTrangThaiPhatHanh, ':', generatedSid);
      }
    } else if (currentTrangThaiPhatHanh === '01' as string) {
      // For 'Bản nháp' status, use createdSid if exists (after save), otherwise use idPhatHanh from database
      if (createdSid) {
        sidToUse = createdSid;
        console.log('🔍 Using createdSid after save for status', currentTrangThaiPhatHanh, ':', createdSid);
      } else {
        if (!selectedFeeDeclaration?.idPhatHanh) {
          showError('Không tìm thấy thông tin phát hành từ database.');
          return;
        }
        sidToUse = selectedFeeDeclaration.idPhatHanh;
        console.log('🔍 Using idPhatHanh from database for status', currentTrangThaiPhatHanh, ':', selectedFeeDeclaration.idPhatHanh);
      }
    } else {
      // For 'Phát hành' and 'Đã hủy' status, use idPhatHanh from database
      if (!selectedFeeDeclaration?.idPhatHanh) {
        showError('Không tìm thấy thông tin phát hành từ database.');
        return;
      }
      sidToUse = selectedFeeDeclaration.idPhatHanh;
      console.log('🔍 Using idPhatHanh from database for status', currentTrangThaiPhatHanh, ':', selectedFeeDeclaration.idPhatHanh);
    }
    
    try {
      setIsIssuing(true);
      showInfo('Đang xử lý phát hành biên lai...', 'Phát hành biên lai');
      console.log('Phát hành biên lai...');
      
      // Create search ICR request
      const searchRequest: FPTEInvoiceSearchRequest = {
        stax: "0318680861",
        type: "pdf",
        sid: sidToUse, // Use appropriate sid based on status
        user: {
          username: "0318680861.MPOS",
          password: "Admin@123"
        },
        toKhaiId: selectedFeeDeclaration?.id || 0
      };
      
      console.log('🔍 Search ICR Request:', searchRequest);
      
      const response = await fptEInvoiceService.searchICR(searchRequest);
      
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
        id: selectedFeeDeclaration?.id || 0
      };
      
      console.log('🔍 Update Status Request:', updateRequest);
      
      const response = await fptEInvoiceService.updateTrangThaiPhatHanh(updateRequest);
      
      if (response.success && response.data) {
        console.log('✅ Update Status successful:', response.data);
        
        // Update UI state
        setCurrentTrangThaiPhatHanh('02'); // Update to "Phát hành"
        
        // Update localStorage for backward compatibility
        if (selectedFeeDeclaration) {
          const existingUpdates = JSON.parse(localStorage.getItem('feeDeclarationUpdates') || '[]');
          const issuedUpdate = {
            id: selectedFeeDeclaration.id,
            newPaymentStatus: 'PAID',
            newDeclarationStatus: 'APPROVED', 
            receiptCreated: true,
            receiptStatus: 'ISSUED',
            receiptId: savedReceiptId,
            timestamp: new Date().toISOString()
          };
          
          const filteredUpdates = existingUpdates.filter((update: any) => update.id !== selectedFeeDeclaration.id);
          filteredUpdates.push(issuedUpdate);
          localStorage.setItem('feeDeclarationUpdates', JSON.stringify(filteredUpdates));
          
          // Also update issuedReceipts for backward compatibility
          const issuedReceipts = JSON.parse(localStorage.getItem('issuedReceipts') || '[]');
          if (!issuedReceipts.includes(selectedFeeDeclaration.id)) {
            issuedReceipts.push(selectedFeeDeclaration.id);
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
              console.log('🔍 Debug Issue Receipt button:', { 
                isSaved, 
                currentTrangThaiPhatHanh, 
                'currentTrangThaiPhatHanh === "01"': currentTrangThaiPhatHanh === '01',
                'isSaved && currentTrangThaiPhatHanh === "01"': isSaved && currentTrangThaiPhatHanh === '01'
              });
              return null;
            })()}
            {(currentTrangThaiPhatHanh === '00' || currentTrangThaiPhatHanh === '01') && (
              <button
                onClick={handleIssueReceipt}
                disabled={isIssuing || currentTrangThaiPhatHanh === '00'}
                style={{
                  backgroundColor: isIssuing ? '#9ca3af' : 
                                 currentTrangThaiPhatHanh === '00' ? '#9ca3af' : '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  cursor: (isIssuing || currentTrangThaiPhatHanh === '00') ? 'not-allowed' : 'pointer',
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
                ) : (
                  <>📄 Phát hành biên lai</>
                )}
              </button>
            )}
            
            {/* Show success message when receipt is issued */}
            {currentTrangThaiPhatHanh === '02' && (
              <div style={{
                backgroundColor: '#d4edda',
                color: '#155724',
                border: '1px solid #c3e6cb',
                padding: '10px 15px',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                ✅ Biên lai đã được phát hành thành công
              </div>
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
