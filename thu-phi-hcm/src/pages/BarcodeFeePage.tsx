import React, { useState } from 'react'

interface BarcodeData {
  id: number
  stt: number
  tkNopPhi: string
  loaiToKhai: string
  tkHaiQuan: string
  doanhNghiep: string
  ngayNhapTK: string
  trangThai: string
  soTien: string
  tbNopPhi: string
  action: string
}

const BarcodeFeePage: React.FC = () => {
  // Sample data
  const [barcodeData] = useState<BarcodeData[]>([
    {
      id: 1,
      stt: 1,
      tkNopPhi: '230817241626',
      loaiToKhai: '101 - Năng lượng mặt trời',
      tkHaiQuan: '13686769960',
      doanhNghiep: '0166424415 - Công ty TNHH Vina Kingdom Việt Nam',
      ngayNhapTK: '17/08/2023',
      trangThai: 'Có hiển thị',
      soTien: '750.000',
      tbNopPhi: 'Lấy thông báo undefined_files 0233',
      action: 'view'
    },
    {
      id: 2,
      stt: 2,
      tkNopPhi: '230817241627',
      loaiToKhai: '102 - Điện gió',
      tkHaiQuan: '13686769961',
      doanhNghiep: '0166424416 - Công ty TNHH Green Energy Vietnam',
      ngayNhapTK: '18/08/2023',
      trangThai: 'Chờ xử lý',
      soTien: '1.200.000',
      tbNopPhi: 'Lấy thông báo undefined_files 0234',
      action: 'view'
    },
    {
      id: 3,
      stt: 3,
      tkNopPhi: '230817241628',
      loaiToKhai: '103 - Thủy điện',
      tkHaiQuan: '13686769962',
      doanhNghiep: '0166424417 - Công ty TNHH Hydro Power Corp',
      ngayNhapTK: '19/08/2023',
      trangThai: 'Đã nộp phí',
      soTien: '2.500.000',
      tbNopPhi: 'Lấy thông báo undefined_files 0235',
      action: 'view'
    }
  ])

  // Filter states
  const [filterData, setFilterData] = useState({
    maToKhai: '',
    tenDoanhNghiep: '',
    tuNgay: '',
    denNgay: '',
    trangThai: ''
  })

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(barcodeData.length / itemsPerPage)

  const handleFilterChange = (field: string, value: string) => {
    setFilterData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSearch = () => {
    console.log('Searching with filters:', filterData)
  }

  const handleCreateReceipt = () => {
    console.log('Tạo & phát hành biên lai...')
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>

      {/* Filter Section */}
      <div style={{
        background: 'white',
        borderRadius: '8px',
        padding: '20px',
        marginTop: '20px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '15px',
          marginBottom: '15px'
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' }}>
              Mã tờ khai
            </label>
            <input
              type="text"
              value={filterData.maToKhai}
              onChange={(e) => handleFilterChange('maToKhai', e.target.value)}
              placeholder="Nhập mã tờ khai"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' }}>
              Tên doanh nghiệp
            </label>
            <input
              type="text"
              value={filterData.tenDoanhNghiep}
              onChange={(e) => handleFilterChange('tenDoanhNghiep', e.target.value)}
              placeholder="Nhập tên doanh nghiệp"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' }}>
              Từ ngày
            </label>
            <input
              type="date"
              value={filterData.tuNgay}
              onChange={(e) => handleFilterChange('tuNgay', e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' }}>
              Đến ngày
            </label>
            <input
              type="date"
              value={filterData.denNgay}
              onChange={(e) => handleFilterChange('denNgay', e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' }}>
              Trạng thái
            </label>
            <select
              value={filterData.trangThai}
              onChange={(e) => handleFilterChange('trangThai', e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              <option value="">Tất cả</option>
              <option value="cho-xu-ly">Chờ xử lý</option>
              <option value="da-nop-phi">Đã nộp phí</option>
              <option value="da-huy">Đã hủy</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            onClick={handleSearch}
            style={{
              background: '#0066b3',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            <i className="fas fa-search" style={{ marginRight: '8px' }}></i>
            Tìm kiếm
          </button>
          
          <button
            onClick={handleCreateReceipt}
            style={{
              background: '#0db14b',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            <i className="fas fa-plus-circle" style={{ marginRight: '8px' }}></i>
            Tạo & phát hành biên lai
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div style={{
        background: 'white',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #e9ecef' }}>
                <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '600', color: '#2c3e50', width: '40px' }}>#</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '600', color: '#2c3e50', width: '60px' }}>STT</th>
                <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600', color: '#2c3e50' }}>TK nộp phí</th>
                <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600', color: '#2c3e50' }}>Loại tờ khai</th>
                <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600', color: '#2c3e50' }}>TK hải quan</th>
                <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600', color: '#2c3e50' }}>Doanh nghiệp</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '600', color: '#2c3e50' }}>Ngày nhập TK</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '600', color: '#2c3e50' }}>Trạng thái</th>
                <th style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '600', color: '#2c3e50' }}>Số tiền</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '600', color: '#2c3e50' }}>TB nộp phí</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '600', color: '#2c3e50', width: '40px' }}>#</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '600', color: '#2c3e50', width: '60px' }}>Icon</th>
              </tr>
            </thead>
            <tbody>
              {barcodeData.map((item, index) => (
                <tr key={item.id} style={{ 
                  borderBottom: '1px solid #e9ecef',
                  backgroundColor: index % 2 === 0 ? '#fff' : '#f8f9fa'
                }}>
                  <td style={{ padding: '12px 8px', textAlign: 'center', color: '#0066b3', fontWeight: '500' }}>{item.id}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'center' }}>{item.stt}</td>
                  <td style={{ padding: '12px 8px', color: '#0066b3', fontWeight: '500' }}>{item.tkNopPhi}</td>
                  <td style={{ padding: '12px 8px' }}>{item.loaiToKhai}</td>
                  <td style={{ padding: '12px 8px', color: '#0066b3' }}>{item.tkHaiQuan}</td>
                  <td style={{ padding: '12px 8px' }}>{item.doanhNghiep}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'center' }}>{item.ngayNhapTK}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      background: item.trangThai === 'Đã nộp phí' ? '#d4edda' : item.trangThai === 'Có hiển thị' ? '#d1ecf1' : '#fff3cd',
                      color: item.trangThai === 'Đã nộp phí' ? '#155724' : item.trangThai === 'Có hiển thị' ? '#0c5460' : '#856404'
                    }}>
                      {item.trangThai}
                    </span>
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '500' }}>{item.soTien}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                    <button
                      style={{
                        background: '#0db14b',
                        color: 'white',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                      onClick={() => console.log('Lấy thông báo:', item.id)}
                    >
                      <i className="fas fa-check" style={{ marginRight: '6px' }}></i>
                      Lấy thông báo
                    </button>
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                    <button
                      style={{
                        background: '#0066b3',
                        color: 'white',
                        border: 'none',
                        padding: '6px 8px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                    <i className="fas fa-sticky-note" style={{ color: '#f36f21', fontSize: '16px', cursor: 'pointer' }}></i>
                  </td>
                </tr>
              ))}
              {/* Tổng tiền row */}
              <tr style={{ 
                borderTop: '2px solid #0066b3',
                backgroundColor: '#f8f9fa',
                fontWeight: 'bold'
              }}>
                <td colSpan={8} style={{ padding: '12px 8px', textAlign: 'right', color: '#0066b3' }}>
                  Tổng tiền
                </td>
                <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: 'bold', color: '#0066b3' }}>
                  {barcodeData.reduce((total, item) => {
                    const amount = parseInt(item.soTien.replace(/\./g, ''));
                    return total + amount;
                  }, 0).toLocaleString('vi-VN')}
                </td>
                <td colSpan={3} style={{ padding: '12px 8px' }}></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginTop: '20px',
          paddingTop: '20px',
          borderTop: '1px solid #e9ecef'
        }}>
          <div style={{ color: '#666', fontSize: '14px' }}>
            Hiển thị {barcodeData.length} / {barcodeData.length} bản ghi
          </div>
          
          <div style={{ display: 'flex', gap: '5px' }}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              style={{
                padding: '8px 12px',
                border: '1px solid #ddd',
                background: currentPage === 1 ? '#f8f9fa' : 'white',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                borderRadius: '4px'
              }}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  background: currentPage === index + 1 ? '#0066b3' : 'white',
                  color: currentPage === index + 1 ? 'white' : '#333',
                  cursor: 'pointer',
                  borderRadius: '4px'
                }}
              >
                {index + 1}
              </button>
            ))}
            
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              style={{
                padding: '8px 12px',
                border: '1px solid #ddd',
                background: currentPage === totalPages ? '#f8f9fa' : 'white',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                borderRadius: '4px'
              }}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BarcodeFeePage
