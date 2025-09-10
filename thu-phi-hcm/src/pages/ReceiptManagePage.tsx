import React, { useState, useEffect } from 'react';
import { ReceiptService, Receipt, ReceiptSearchParams, PageResponse } from '../utils/receiptApi';
import { useNotification } from '../context/NotificationContext';

const ReceiptManagePage: React.FC = () => {
  const { showSuccess, showError } = useNotification();
  
  const [filterData, setFilterData] = useState({
    fromDate: '',
    toDate: '',
    payment: '',
    status: '',
    template: '01BLP0-001',
    signNumber: '',
    businessCode: '',
    declarationNumber: '',
    notificationNumber: '',
    receiptNumber: '',
    searchCode: ''
  });

  // State for real receipt data
  const [receiptData, setReceiptData] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  });

  // Mock data for fallback (keeping original structure)
  const [mockReceiptData] = useState([
    {
      id: 1,
      declarationHQ: '1357806765T9',
      dateTKNO: '16/08/2021',
      tkFeePayment: '210916596548',
      declarationType: 'Hàng cont',
      codeSymbol: '',
      receiptNumber: '0000000',
      receiptDate: '23/08/2021',
      business: 'K50422406/9 - Công Ty Cổ Phần DAP Số 2 - Việt Nam',
      status: 'Mới',
      totalAmount: 500000,
      issued: true
    },
    {
      id: 2,
      declarationHQ: '1356679909',
      dateTKNO: '16/08/2021',
      tkFeePayment: '210916442593',
      declarationType: 'Hàng cont',
      codeSymbol: '',
      receiptNumber: '0000000',
      receiptDate: '23/08/2021',
      business: 'G200736420 - Công ty CP Cảng Dịch vụ dầu khí Định Vũ (PTSC)',
      status: 'Mới',
      totalAmount: 1500000,
      issued: true
    },
    {
      id: 3,
      declarationHQ: '1356768759T0',
      dateTKNO: '16/08/2021',
      tkFeePayment: '210916442594',
      declarationType: 'Hàng cont',
      codeSymbol: '',
      receiptNumber: '0000000',
      receiptDate: '23/08/2021',
      business: 'G200736420 - Công ty CP Cảng Dịch vụ dầu khí Định Vũ (PTSC)',
      status: 'Mới',
      totalAmount: 2000000,
      issued: false
    },
    {
      id: 4,
      declarationHQ: '1357986759B0',
      dateTKNO: '16/08/2021',
      tkFeePayment: '210916442596',
      declarationType: 'Hàng cont',
      codeSymbol: '',
      receiptNumber: '0000000',
      receiptDate: '23/08/2021',
      business: 'G200736420 - Công ty CP Cảng Dịch vụ dầu khí Định Vũ (PTSC)',
      status: 'Mới',
      totalAmount: 250000,
      issued: false
    },
    {
      id: 5,
      declarationHQ: '1357856759B9',
      dateTKNO: '16/08/2021',
      tkFeePayment: '210916815549',
      declarationType: 'Hàng cont',
      codeSymbol: 'C1BLP0-001/AA-2 1E',
      receiptNumber: '0000276',
      receiptDate: '21/08/2021',
      business: 'K514633163 - CÔNG TY TNHH DELIFNETS VIỆT NAM',
      status: 'Phát hành',
      totalAmount: 750000,
      issued: true
    },
    {
      id: 6,
      declarationHQ: '1344235356S',
      dateTKNO: '16/08/2021',
      tkFeePayment: '210916815970',
      declarationType: 'Hàng cont',
      codeSymbol: 'C1BLP0-001/AA-2 1E',
      receiptNumber: '0000274',
      receiptDate: '21/08/2021',
      business: 'K514633163 - CÔNG TY TNHH DELIFNETS VIỆT NAM',
      status: 'Phát hành',
      totalAmount: 500000,
      issued: true
    },
    {
      id: 7,
      declarationHQ: '1356758290G',
      dateTKNO: '16/08/2021',
      tkFeePayment: '210916442596',
      declarationType: 'Hàng cont',
      codeSymbol: 'C1BLP0-001/AA-2 1E',
      receiptNumber: '0000273',
      receiptDate: '21/08/2021',
      business: 'G200736420 - Công ty CP Cảng Dịch vụ dầu khí Định Vũ (PTSC)',
      status: 'Phát hành',
      totalAmount: 1000000,
      issued: true
    },
    {
      id: 8,
      declarationHQ: '10797148070G3',
      dateTKNO: '17/08/2021',
      tkFeePayment: '21081760823',
      declarationType: 'Hàng cont',
      codeSymbol: 'C1BLP0-001/AA-2 1E',
      receiptNumber: '0000272',
      receiptDate: '21/08/2021',
      business: 'K50422406/9 - Công Ty Cổ Phần DAP Số 2 - Việt Nam',
      status: 'Phát hành',
      totalAmount: 750000,
      issued: true
    }
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const itemsPerPage = 10;

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    loadReceipts({
      page: newPage - 1, // API uses 0-based indexing
      size: itemsPerPage
    });
  };

  // Load receipts from API
  const loadReceipts = async (searchParams: ReceiptSearchParams = {}) => {
    try {
      setLoading(true);
      console.log('Loading receipts with params:', searchParams);
      
      // Use real API
      const response = await ReceiptService.getAllReceipts(
        searchParams.page || 0,
        searchParams.size || 10,
        searchParams.sortBy || 'receiptDate',
        searchParams.sortDir || 'desc'
      );
      
      console.log('Full API response:', response);
      
      // Handle both wrapped (ApiResponse) and direct PageResponse
      let pageData;
      if (response.success && response.data) {
        // Wrapped in ApiResponse
        pageData = response.data;
        console.log('Using wrapped response data');
      } else if (response.content) {
        // Direct PageResponse from backend (like FeeDeclarationService)
        pageData = response;
        console.log('Using direct PageResponse');
      } else {
        console.warn('API response not successful, using mock data');
        console.log('Response structure:', Object.keys(response));
        // Fallback to mock data
        setReceiptData(mockReceiptData as any);
        setPagination({
          page: 0,
          size: 10,
          totalElements: mockReceiptData.length,
          totalPages: Math.ceil(mockReceiptData.length / 10)
        });
        return;
      }
      
      console.log('Receipts loaded successfully:', pageData);
      setReceiptData(pageData.content);
      setPagination({
        page: pageData.number,
        size: pageData.size,
        totalElements: pageData.totalElements,
        totalPages: pageData.totalPages
      });
    } catch (error) {
      console.error('Error loading receipts:', error);
      console.error('Error details:', error);
      showError('Không thể tải danh sách biên lai. Kiểm tra backend có đang chạy không?');
      
      // Fallback to mock data
      setReceiptData(mockReceiptData as any);
      setPagination({
        page: 0,
        size: 10,
        totalElements: mockReceiptData.length,
        totalPages: Math.ceil(mockReceiptData.length / 10)
      });
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadReceipts();
  }, []);

  const handleFilterChange = (field: string, value: string) => {
    setFilterData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    const searchParams: ReceiptSearchParams = {
      page: 0,
      size: pagination.size
    };

    // Add filters if they have values
    if (filterData.fromDate) {
      searchParams.fromDate = filterData.fromDate;
    }
    if (filterData.toDate) {
      searchParams.toDate = filterData.toDate;
    }
    if (filterData.status) {
      searchParams.status = filterData.status;
    }
    if (filterData.payment) {
      searchParams.paymentMethod = filterData.payment;
    }
    if (filterData.receiptNumber) {
      searchParams.receiptNumber = filterData.receiptNumber;
    }

    loadReceipts(searchParams);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(receiptData.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  // Use server-side pagination
  const totalPages = pagination.totalPages;
  const currentData = receiptData; // Already paginated from server

  // Map API data to display format
  const mappedData = currentData.map(receipt => ({
    id: receipt.id || 0,
    declarationHQ: receipt.feeDeclarationId?.toString() || '',
    dateTKNO: receipt.receiptDate || '',
    tkFeePayment: receipt.receiptCode || '',
    declarationType: 'Hàng cont', // Default value
    codeSymbol: receipt.receiptNumber || '',
    receiptNumber: receipt.receiptNumber || '',
    receiptDate: receipt.receiptDate || '',
    business: receipt.payerName || '',
    status: receipt.status === 'ISSUED' ? 'Phát hành' : 
            receipt.status === 'DRAFT' ? 'Bản nháp' : 
            receipt.status === 'CANCELLED' ? 'Đã hủy' : 'Mới',
    totalAmount: receipt.totalAmount || 0,
    issued: receipt.status === 'ISSUED'
  }));

  // Tính tổng tiền
  const totalIssuedAmount = mappedData
    .filter(item => item.issued)
    .reduce((sum, item) => sum + item.totalAmount, 0);
    
  const totalNotIssuedAmount = receiptData
    .filter(item => !item.issued)
    .reduce((sum, item) => sum + item.totalAmount, 0);

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f8f9fa', 
      minHeight: 'calc(100vh - 60px)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        
        {/* Header */}
        <div style={{
          padding: '20px',
          backgroundColor: '#f8f9fc',
          borderBottom: '2px solid #e9ecef',
          display: 'flex',
          alignItems: 'center'
        }}>
          <button 
            onClick={() => {
              // Add issue receipt functionality here
              alert('Phát hành biên lai cho các mục đã chọn');
            }}
            style={{
              backgroundColor: '#0db14b',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#0aa038';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#0db14b';
            }}
          >
            <i className="fas fa-receipt" style={{ marginRight: '8px' }}></i>
            Phát hành biên lai
          </button>
          
          <div style={{ 
            marginLeft: '20px',
            fontSize: '14px',
            color: '#666',
            fontStyle: 'italic'
          }}>
            Tích chọn các biên lai bạn cần để phát hành nhóm biên lai
          </div>
        </div>

        {/* Filter Section */}
        <div style={{
          padding: '20px',
          backgroundColor: '#f8f9fc',
          borderBottom: '2px solid #e9ecef'
        }}>
          {/* First Row */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '15px',
            alignItems: 'end',
            marginBottom: '15px',
            flexWrap: 'wrap'
          }}>
            <div style={{ minWidth: '140px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: '500', 
                color: '#495057',
                fontSize: '12px'
              }}>
                Ngày biên lai, từ:
              </label>
              <input
                type="date"
                value={filterData.fromDate}
                onChange={(e) => handleFilterChange('fromDate', e.target.value)}
                style={{
                  width: '100%',
                  padding: '5px 8px',
                  border: '1px solid #ced4da',
                  borderRadius: '3px',
                  fontSize: '12px'
                }}
              />
            </div>

            <div style={{ minWidth: '140px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: '500', 
                color: '#495057',
                fontSize: '12px'
              }}>
                Đến:
              </label>
              <input
                type="date"
                value={filterData.toDate}
                onChange={(e) => handleFilterChange('toDate', e.target.value)}
                style={{
                  width: '100%',
                  padding: '5px 8px',
                  border: '1px solid #ced4da',
                  borderRadius: '3px',
                  fontSize: '12px'
                }}
              />
            </div>

            <div style={{ minWidth: '120px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: '500', 
                color: '#495057',
                fontSize: '12px'
              }}>
                Thanh toán:
              </label>
              <select
                value={filterData.payment}
                onChange={(e) => handleFilterChange('payment', e.target.value)}
                style={{
                  width: '100%',
                  padding: '5px 8px',
                  border: '1px solid #ced4da',
                  borderRadius: '3px',
                  fontSize: '12px'
                }}
              >
                <option value="">-- Thanh toán --</option>
                <option value="paid">Đã thanh toán</option>
                <option value="unpaid">Chưa thanh toán</option>
                <option value="partial">Thanh toán một phần</option>
              </select>
            </div>

            <div style={{ minWidth: '120px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: '500', 
                color: '#495057',
                fontSize: '12px'
              }}>
                Trạng thái:
              </label>
              <select
                value={filterData.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                style={{
                  width: '100%',
                  padding: '5px 8px',
                  border: '1px solid #ced4da',
                  borderRadius: '3px',
                  fontSize: '12px'
                }}
              >
                <option value="">-- Trạng thái bt --</option>
                <option value="new">Mới</option>
                <option value="issued">Phát hành</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>

            <div style={{ minWidth: '120px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: '500', 
                color: '#495057',
                fontSize: '12px'
              }}>
                Mẫu:
              </label>
              <input
                type="text"
                value={filterData.template}
                onChange={(e) => handleFilterChange('template', e.target.value)}
                placeholder="01BLP0-001"
                style={{
                  width: '100%',
                  padding: '5px 8px',
                  border: '1px solid #ced4da',
                  borderRadius: '3px',
                  fontSize: '12px'
                }}
              />
            </div>

            <div style={{ minWidth: '120px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: '500', 
                color: '#495057',
                fontSize: '12px'
              }}>
                Kí hiệu biên lai:
              </label>
              <input
                type="text"
                value={filterData.signNumber}
                onChange={(e) => handleFilterChange('signNumber', e.target.value)}
                placeholder="Kí hiệu biên lai"
                style={{
                  width: '100%',
                  padding: '5px 8px',
                  border: '1px solid #ced4da',
                  borderRadius: '3px',
                  fontSize: '12px'
                }}
              />
            </div>
          </div>

          {/* Second Row */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '15px',
            alignItems: 'end',
            flexWrap: 'wrap'
          }}>
            <div style={{ 
              minWidth: '200px',
              display: 'flex',
              alignItems: 'end',
              paddingBottom: '8px'
            }}>
              <span style={{ 
                fontSize: '12px',
                color: '#495057',
                fontWeight: '500',
                fontStyle: 'italic'
              }}>
                ( Có 22/22 lâm phí - Trang 2: 1 ):
              </span>
            </div>

            <div style={{ minWidth: '120px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: '500', 
                color: '#495057',
                fontSize: '12px'
              }}>
                Mã doanh nghiệp:
              </label>
              <input
                type="text"
                value={filterData.businessCode}
                onChange={(e) => handleFilterChange('businessCode', e.target.value)}
                placeholder="Mã doanh nghiệp"
                style={{
                  width: '100%',
                  padding: '5px 8px',
                  border: '1px solid #ced4da',
                  borderRadius: '3px',
                  fontSize: '12px'
                }}
              />
            </div>

            <div style={{ minWidth: '100px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: '500', 
                color: '#495057',
                fontSize: '12px'
              }}>
                Số tờ khai:
              </label>
              <input
                type="text"
                value={filterData.declarationNumber}
                onChange={(e) => handleFilterChange('declarationNumber', e.target.value)}
                placeholder="Số tờ khai"
                style={{
                  width: '100%',
                  padding: '5px 8px',
                  border: '1px solid #ced4da',
                  borderRadius: '3px',
                  fontSize: '12px'
                }}
              />
            </div>

            <div style={{ minWidth: '100px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: '500', 
                color: '#495057',
                fontSize: '12px'
              }}>
                Số thông báo:
              </label>
              <input
                type="text"
                value={filterData.notificationNumber}
                onChange={(e) => handleFilterChange('notificationNumber', e.target.value)}
                placeholder="Số thông báo"
                style={{
                  width: '100%',
                  padding: '5px 8px',
                  border: '1px solid #ced4da',
                  borderRadius: '3px',
                  fontSize: '12px'
                }}
              />
            </div>

            <div style={{ minWidth: '100px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: '500', 
                color: '#495057',
                fontSize: '12px'
              }}>
                Số biên lai:
              </label>
              <input
                type="text"
                value={filterData.receiptNumber}
                onChange={(e) => handleFilterChange('receiptNumber', e.target.value)}
                placeholder="Số biên lai"
                style={{
                  width: '100%',
                  padding: '5px 8px',
                  border: '1px solid #ced4da',
                  borderRadius: '3px',
                  fontSize: '12px'
                }}
              />
            </div>

            <div style={{ minWidth: '100px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: '500', 
                color: '#495057',
                fontSize: '12px'
              }}>
                Mã tra cứu:
              </label>
              <input
                type="text"
                value={filterData.searchCode}
                onChange={(e) => handleFilterChange('searchCode', e.target.value)}
                placeholder="Mã tra cứu"
                style={{
                  width: '100%',
                  padding: '5px 8px',
                  border: '1px solid #ced4da',
                  borderRadius: '3px',
                  fontSize: '12px'
                }}
              />
            </div>

            <div>
              <button
                onClick={handleSearch}
                style={{
                  padding: '6px 20px',
                  backgroundColor: '#0066b3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  minHeight: '32px'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#004d8a';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#0066b3';
                }}
              >
                <i className="fas fa-search" style={{ marginRight: '8px' }}></i>
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div style={{ padding: '20px', overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: 'white',
            fontSize: '12px'
          }}>
            <thead>
              <tr style={{ 
                backgroundColor: '#f8f9fa',
                borderBottom: '2px solid #dee2e6'
              }}>
                <th style={{ 
                  padding: '10px 8px', 
                  textAlign: 'center', 
                  fontWeight: '600', 
                  color: '#495057', 
                  fontSize: '12px',
                  width: '40px'
                }}>
                  <input
                    type="checkbox"
                    checked={selectedItems.length === receiptData.length}
                    onChange={handleSelectAll}
                    style={{ cursor: 'pointer' }}
                  />
                </th>
                <th style={{ padding: '10px 8px', textAlign: 'center', fontWeight: '600', color: '#495057', fontSize: '12px', width: '40px' }}>
                  <i className="fas fa-cog"></i>
                </th>
                <th style={{ padding: '10px 8px', textAlign: 'center', fontWeight: '600', color: '#495057', fontSize: '12px', width: '50px' }}>STT</th>
                <th style={{ padding: '10px 8px', textAlign: 'left', fontWeight: '600', color: '#495057', fontSize: '12px' }}>Tờ khai HQ</th>
                <th style={{ padding: '10px 8px', textAlign: 'center', fontWeight: '600', color: '#495057', fontSize: '12px' }}>Ngày TKNO</th>
                <th style={{ padding: '10px 8px', textAlign: 'left', fontWeight: '600', color: '#495057', fontSize: '12px' }}>TK Nộp Phí</th>
                <th style={{ padding: '10px 8px', textAlign: 'left', fontWeight: '600', color: '#495057', fontSize: '12px' }}>Loại tờ khai</th>
                <th style={{ padding: '10px 8px', textAlign: 'left', fontWeight: '600', color: '#495057', fontSize: '12px' }}>Mã, ký hiệu</th>
                <th style={{ padding: '10px 8px', textAlign: 'left', fontWeight: '600', color: '#495057', fontSize: '12px' }}>Số biên lai</th>
                <th style={{ padding: '10px 8px', textAlign: 'center', fontWeight: '600', color: '#495057', fontSize: '12px' }}>Ngày biên lai</th>
                <th style={{ padding: '10px 8px', textAlign: 'left', fontWeight: '600', color: '#495057', fontSize: '12px' }}>Doanh nghiệp</th>
                <th style={{ padding: '10px 8px', textAlign: 'center', fontWeight: '600', color: '#495057', fontSize: '12px' }}>Trạng thái</th>
                <th style={{ padding: '10px 8px', textAlign: 'right', fontWeight: '600', color: '#495057', fontSize: '12px' }}>Tổng tiền (VNĐ)</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                      <div style={{ 
                        width: '20px', 
                        height: '20px', 
                        border: '2px solid #f3f3f3',
                        borderTop: '2px solid #007bff',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                      Đang tải dữ liệu...
                    </div>
                  </td>
                </tr>
              ) : mappedData.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '20px', color: '#6c757d' }}>
                    Không có dữ liệu biên lai
                  </td>
                </tr>
              ) : (
                mappedData.map((item, index) => (
                <tr key={item.id} style={{ 
                  borderBottom: '1px solid #dee2e6',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '8px', textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      style={{ cursor: 'pointer' }}
                    />
                  </td>
                  <td style={{ padding: '8px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '4px' }}>
                      <i className="fas fa-edit" style={{ 
                        color: '#0066b3', 
                        cursor: 'pointer',
                        fontSize: '11px'
                      }} title="Sửa"></i>
                    </div>
                  </td>
                  <td style={{ padding: '8px', textAlign: 'center', fontSize: '12px' }}>
                    {((currentPage - 1) * itemsPerPage) + index + 1}
                  </td>
                  <td style={{ padding: '8px', fontSize: '12px', fontWeight: '500' }}>
                    {item.declarationHQ}
                  </td>
                  <td style={{ padding: '8px', textAlign: 'center', fontSize: '12px' }}>
                    {item.dateTKNO}
                  </td>
                  <td style={{ padding: '8px', fontSize: '12px' }}>
                    {item.tkFeePayment}
                  </td>
                  <td style={{ padding: '8px', fontSize: '12px' }}>
                    {item.declarationType}
                  </td>
                  <td style={{ padding: '8px', fontSize: '12px' }}>
                    {item.codeSymbol}
                  </td>
                  <td style={{ padding: '8px', fontSize: '12px', fontWeight: '500' }}>
                    {item.receiptNumber}
                  </td>
                  <td style={{ padding: '8px', textAlign: 'center', fontSize: '12px' }}>
                    {item.receiptDate}
                  </td>
                  <td style={{ padding: '8px', fontSize: '12px' }}>
                    {item.business}
                  </td>
                  <td style={{ padding: '8px', textAlign: 'center', fontSize: '11px' }}>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontWeight: '500',
                      backgroundColor: 
                        item.status === 'Phát hành' ? '#d4edda' :
                        item.status === 'Mới' ? '#fff3cd' : '#f8d7da',
                      color: 
                        item.status === 'Phát hành' ? '#155724' :
                        item.status === 'Mới' ? '#856404' : '#721c24'
                    }}>
                      <i className={`fas fa-${item.status === 'Phát hành' ? 'check-circle' : 'exclamation-circle'}`} 
                         style={{ marginRight: '4px' }}></i>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: '8px', textAlign: 'right', fontSize: '12px', fontWeight: '600' }}>
                    {item.totalAmount.toLocaleString('vi-VN')}
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Summary Row */}
          <div style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '5px',
            border: '1px solid #dee2e6'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: '30px',
              fontSize: '13px',
              fontWeight: '600'
            }}>
              <span style={{ color: '#155724' }}>
                Tổng tiền: Phát hành: {totalIssuedAmount.toLocaleString('vi-VN')} đ
              </span>
              <span style={{ color: '#856404' }}>
                Chưa phát hành: {totalNotIssuedAmount.toLocaleString('vi-VN')} đ
              </span>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderTop: '1px solid #dee2e6'
        }}>
          <div style={{ fontSize: '13px', color: '#6c757d' }}>
            Hiển thị {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, pagination.totalElements)} của {pagination.totalElements} bản ghi
          </div>
          
          <div style={{ display: 'flex', gap: '5px' }}>
            <button
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              style={{
                padding: '6px 12px',
                border: '1px solid #dee2e6',
                backgroundColor: currentPage === 1 ? '#e9ecef' : 'white',
                color: currentPage === 1 ? '#6c757d' : '#495057',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                borderRadius: '3px',
                fontSize: '13px'
              }}
            >
              Trước
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                style={{
                  padding: '6px 12px',
                  border: '1px solid #dee2e6',
                  backgroundColor: currentPage === i + 1 ? '#0066b3' : 'white',
                  color: currentPage === i + 1 ? 'white' : '#495057',
                  cursor: 'pointer',
                  borderRadius: '3px',
                  fontSize: '13px',
                  minWidth: '32px'
                }}
              >
                {i + 1}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{
                padding: '6px 12px',
                border: '1px solid #dee2e6',
                backgroundColor: currentPage === totalPages ? '#e9ecef' : 'white',
                color: currentPage === totalPages ? '#6c757d' : '#495057',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                borderRadius: '3px',
                fontSize: '13px'
              }}
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptManagePage;
