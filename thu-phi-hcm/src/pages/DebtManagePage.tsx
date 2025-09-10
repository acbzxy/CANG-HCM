import React, { useState } from 'react';

const DebtManagePage: React.FC = () => {
  const [filterData, setFilterData] = useState({
    fromDate: '',
    toDate: '',
    payment: '',
    businessCode: '',
    debtNotificationNumber: ''
  });

  const [debtData] = useState([
    {
      id: 1,
      debtNotificationNumber: 'TB001/2024',
      businessCode: 'DN001',
      businessName: 'CÔNG TY TNHH ABC',
      address: '123 Nguyễn Văn Linh, Q.7, TP.HCM',
      debtDate: '15/01/2024',
      totalDebtAmount: 5000000,
      status: 'Chưa thanh toán'
    },
    {
      id: 2,
      debtNotificationNumber: 'TB002/2024',
      businessCode: 'DN002',
      businessName: 'CÔNG TY CỔ PHẦN XYZ',
      address: '456 Lê Văn Việt, Q.9, TP.HCM',
      debtDate: '16/01/2024',
      totalDebtAmount: 3500000,
      status: 'Đã thanh toán một phần'
    },
    {
      id: 3,
      debtNotificationNumber: 'TB003/2024',
      businessCode: 'DN003',
      businessName: 'DOANH NGHIỆP TƯ NHÂN 123',
      address: '789 Võ Văn Kiệt, Q.5, TP.HCM',
      debtDate: '17/01/2024',
      totalDebtAmount: 2800000,
      status: 'Đã thanh toán'
    },
    {
      id: 4,
      debtNotificationNumber: 'TB004/2024',
      businessCode: 'DN004',
      businessName: 'CÔNG TY TNHH DEF',
      address: '321 Điện Biên Phủ, Q.3, TP.HCM',
      debtDate: '18/01/2024',
      totalDebtAmount: 4200000,
      status: 'Chưa thanh toán'
    },
    {
      id: 5,
      debtNotificationNumber: 'TB005/2024',
      businessCode: 'DN005',
      businessName: 'CÔNG TY CỔ PHẦN GHI',
      address: '654 Cách Mạng Tháng Tám, Q.10, TP.HCM',
      debtDate: '19/01/2024',
      totalDebtAmount: 6700000,
      status: 'Quá hạn'
    }
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleFilterChange = (field: string, value: string) => {
    setFilterData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    console.log('Tìm kiếm với filter:', filterData);
  };

  const totalPages = Math.ceil(debtData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = debtData.slice(startIndex, startIndex + itemsPerPage);

  // Tính tổng tiền nợ phí
  const totalDebtAmount = debtData.reduce((sum, item) => sum + item.totalDebtAmount, 0);

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f8f9fa', 
      minHeight: 'calc(100vh - 60px)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {/* Filter Section */}
        <div style={{
          padding: '20px',
          backgroundColor: '#f8f9fc',
          borderBottom: '2px solid #e9ecef'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            alignItems: 'end'
          }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: '500', 
                color: '#495057' 
              }}>
                Từ ngày:
              </label>
              <input
                type="date"
                value={filterData.fromDate}
                onChange={(e) => handleFilterChange('fromDate', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: '500', 
                color: '#495057' 
              }}>
                Đến ngày:
              </label>
              <input
                type="date"
                value={filterData.toDate}
                onChange={(e) => handleFilterChange('toDate', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: '500', 
                color: '#495057' 
              }}>
                Thanh toán:
              </label>
              <select
                value={filterData.payment}
                onChange={(e) => handleFilterChange('payment', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                <option value="">Tất cả</option>
                <option value="paid">Đã thanh toán</option>
                <option value="unpaid">Chưa thanh toán</option>
                <option value="partial">Thanh toán một phần</option>
                <option value="overdue">Quá hạn</option>
              </select>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: '500', 
                color: '#495057' 
              }}>
                Mã doanh nghiệp:
              </label>
              <input
                type="text"
                value={filterData.businessCode}
                onChange={(e) => handleFilterChange('businessCode', e.target.value)}
                placeholder="Nhập mã doanh nghiệp"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: '500', 
                color: '#495057' 
              }}>
                Số thông báo nợ phí:
              </label>
              <input
                type="text"
                value={filterData.debtNotificationNumber}
                onChange={(e) => handleFilterChange('debtNotificationNumber', e.target.value)}
                placeholder="Nhập số thông báo"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <button
                onClick={handleSearch}
                style={{
                  width: '100%',
                  padding: '10px 20px',
                  backgroundColor: '#0066b3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#004d87';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#0066b3';
                  e.currentTarget.style.transform = 'translateY(0)';
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
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <thead>
              <tr style={{ 
                backgroundColor: '#f8f9fa',
                borderBottom: '2px solid #dee2e6'
              }}>
                <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '600', color: '#495057', fontSize: '13px' }}>STT</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '600', color: '#495057', fontSize: '13px' }}>#</th>
                <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600', color: '#495057', fontSize: '13px' }}>Số TB nợ phí</th>
                <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600', color: '#495057', fontSize: '13px' }}>Mã DN</th>
                <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600', color: '#495057', fontSize: '13px' }}>Tên DN</th>
                <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600', color: '#495057', fontSize: '13px' }}>Địa chỉ</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '600', color: '#495057', fontSize: '13px' }}>Ngày nợ phí</th>
                <th style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '600', color: '#495057', fontSize: '13px' }}>Tổng tiền nợ phí</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '600', color: '#495057', fontSize: '13px' }}>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, index) => (
                <tr key={item.id} style={{ 
                  borderBottom: '1px solid #dee2e6',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '12px 8px', textAlign: 'center', fontSize: '13px' }}>
                    {startIndex + index + 1}
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                      <i className="fas fa-eye" style={{ 
                        color: '#0066b3', 
                        cursor: 'pointer',
                        padding: '4px',
                        borderRadius: '3px',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#0066b3';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#0066b3';
                      }}
                      title="Xem chi tiết"
                      ></i>
                      <i className="fas fa-download" style={{ 
                        color: '#28a745', 
                        cursor: 'pointer',
                        padding: '4px',
                        borderRadius: '3px',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#28a745';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#28a745';
                      }}
                      title="Tải xuống"
                      ></i>
                    </div>
                  </td>
                  <td style={{ padding: '12px 8px', fontSize: '13px', fontWeight: '500' }}>
                    {item.debtNotificationNumber}
                  </td>
                  <td style={{ padding: '12px 8px', fontSize: '13px' }}>
                    {item.businessCode}
                  </td>
                  <td style={{ padding: '12px 8px', fontSize: '13px' }}>
                    {item.businessName}
                  </td>
                  <td style={{ padding: '12px 8px', fontSize: '13px' }}>
                    {item.address}
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'center', fontSize: '13px' }}>
                    {item.debtDate}
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#dc3545' }}>
                    {item.totalDebtAmount.toLocaleString('vi-VN')} đ
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'center', fontSize: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '500',
                      backgroundColor: 
                        item.status === 'Đã thanh toán' ? '#d4edda' :
                        item.status === 'Đã thanh toán một phần' ? '#fff3cd' :
                        item.status === 'Quá hạn' ? '#f8d7da' : '#e2e3e5',
                      color: 
                        item.status === 'Đã thanh toán' ? '#155724' :
                        item.status === 'Đã thanh toán một phần' ? '#856404' :
                        item.status === 'Quá hạn' ? '#721c24' : '#383d41'
                    }}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
              
              {/* Total Row */}
              <tr style={{ 
                backgroundColor: '#f1f3f4',
                borderTop: '2px solid #dee2e6',
                fontWeight: '600'
              }}>
                <td colSpan={7} style={{ 
                  padding: '12px 8px', 
                  textAlign: 'right', 
                  fontSize: '14px',
                  fontWeight: '700'
                }}>
                  Tổng cộng:
                </td>
                <td style={{ 
                  padding: '12px 8px', 
                  textAlign: 'right', 
                  fontSize: '14px', 
                  fontWeight: '700', 
                  color: '#dc3545'
                }}>
                  {totalDebtAmount.toLocaleString('vi-VN')} đ
                </td>
                <td style={{ padding: '12px 8px' }}></td>
              </tr>
            </tbody>
          </table>
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
          <div style={{ fontSize: '14px', color: '#6c757d' }}>
            Hiển thị {startIndex + 1} - {Math.min(startIndex + itemsPerPage, debtData.length)} của {debtData.length} bản ghi
          </div>
          
          <div style={{ display: 'flex', gap: '5px' }}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{
                padding: '6px 12px',
                border: '1px solid #dee2e6',
                backgroundColor: currentPage === 1 ? '#e9ecef' : 'white',
                color: currentPage === 1 ? '#6c757d' : '#495057',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              Trước
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                style={{
                  padding: '6px 12px',
                  border: '1px solid #dee2e6',
                  backgroundColor: currentPage === i + 1 ? '#0066b3' : 'white',
                  color: currentPage === i + 1 ? 'white' : '#495057',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  fontSize: '14px',
                  minWidth: '32px'
                }}
              >
                {i + 1}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{
                padding: '6px 12px',
                border: '1px solid #dee2e6',
                backgroundColor: currentPage === totalPages ? '#e9ecef' : 'white',
                color: currentPage === totalPages ? '#6c757d' : '#495057',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                borderRadius: '4px',
                fontSize: '14px'
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

export default DebtManagePage;
