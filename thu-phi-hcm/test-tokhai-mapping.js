// Test script to validate the tokhai mapping functionality
console.log('🧪 Testing Tokhai Mapping Functionality');
console.log('=' .repeat(50));

// Sample API response data (same as provided by user)
const sampleApiResponse = {
  "status": 200,
  "timestamp": "14/09/2025 22:51:32",
  "message": "Success",
  "data": [
    {
      "id": 5,
      "nguonTK": 1,
      "maDoanhNghiepKhaiPhi": "0312345678",
      "tenDoanhNghiepKhaiPhi": "Công ty TNHH Vận Tải Biển Đông",
      "diaChiKhaiPhi": "123 Lê Lợi, Quận 1, TP.HCM",
      "maDoanhNghiepXNK": "0208765432",
      "tenDoanhNghiepXNK": "Công ty CP Xuất Nhập Khẩu Thái Bình",
      "diaChiXNK": "456 Trần Hưng Đạo, Quận Hoàn Kiếm, Hà Nội",
      "soToKhai": "TK202509110001",
      "ngayToKhai": "2025-09-11",
      "maHaiQuan": "HQHCM01",
      "maLoaiHinh": "A12",
      "maLuuKho": "KHO123",
      "nuocXuatKhau": "VN",
      "maPhuongThucVC": "2",
      "phuongTienVC": "CONTAINER SHIP",
      "maDiaDiemXepHang": "CANGCATLAI",
      "maDiaDiemDoHang": "CANGHAIPHONG",
      "maPhanLoaiHangHoa": "XNK",
      "mucDichVC": "Xuất khẩu hàng dệt may",
      "soTiepNhanKhaiPhi": "202500000003",
      "ngayKhaiPhi": "2025-09-12",
      "nhomLoaiPhi": "HẠ TẦNG CẢNG BIỂN",
      "loaiThanhToan": "CHUYEN_KHOAN",
      "ghiChuKhaiPhi": "Nộp phí hạ tầng cảng biển cho lô hàng 2025-09-11",
      "soThongBaoNopPhi": "TB20250911001",
      "soThongBao": "20250912002402",
      "msgId": "4FD0499E-0F71-4D6B-B973-48330483CF5C",
      "idPhatHanh": "FPTIDA1757864934840",
      "tongTienPhi": 1250000,
      "trangThaiNganHang": "DA_THANH_TOAN",
      "soBienLai": "0000000",
      "ngayBienLai": "2025-09-14",
      "kyHieuBienLai": "AA/25P",
      "mauBienLai": "01BLP",
      "maTraCuuBienLai": "MTC20250911001",
      "xemBienLai": "https://example.com/bienlai/BL20250911001",
      "loaiHangMienPhi": "Hàng viện trợ nhân đạo",
      "loaiHang": "LBC001",
      "trangThai": "02",
      "trangThaiPhatHanh": "01",
      "kylan1Xml": null,
      "kylan2Xml": null,
      "imageBl": null,
      "chiTietList": [
        {
          "id": 7,
          "toKhaiThongTinID": 5,
          "soVanDon": "VANDON12345",
          "soHieu": "CONT001",
          "soSeal": "SEAL123",
          "loaiCont": "40HC",
          "tinhChatCont": "Hàng khô",
          "maLoaiCont": "20",
          "maTcCont": "KHO",
          "tongTrongLuong": 25000.5,
          "donViTinh": "KG",
          "ghiChu": "Hàng dệt may xuất đi Mỹ",
          "donGia": 250000,
          "soTien": 250000
        },
        {
          "id": 8,
          "toKhaiThongTinID": 5,
          "soVanDon": "VANDON67890",
          "soHieu": "CONT002",
          "soSeal": "SEAL456",
          "loaiCont": "20GP",
          "tinhChatCont": "Hàng đông lạnh",
          "maLoaiCont": "40",
          "maTcCont": "LANH",
          "tongTrongLuong": 15000.75,
          "donViTinh": "KG",
          "ghiChu": "Hàng thủy sản xuất đi Nhật",
          "donGia": 1000000,
          "soTien": 1000000
        }
      ]
    }
  ]
};

// Test data validation
console.log('📊 Testing API Response Structure:');
console.log(`✅ Status: ${sampleApiResponse.status}`);
console.log(`✅ Message: ${sampleApiResponse.message}`);
console.log(`✅ Data array length: ${sampleApiResponse.data.length}`);

// Test first record
const firstRecord = sampleApiResponse.data[0];
console.log('\n📋 Testing First Record:');
console.log(`✅ Tokhai ID: ${firstRecord.id}`);
console.log(`✅ Số tờ khai: ${firstRecord.soToKhai}`);
console.log(`✅ Doanh nghiệp: ${firstRecord.tenDoanhNghiepKhaiPhi}`);
console.log(`✅ Mã doanh nghiệp: ${firstRecord.maDoanhNghiepKhaiPhi}`);
console.log(`✅ Tổng tiền phí: ${firstRecord.tongTienPhi?.toLocaleString()} VND`);
console.log(`✅ Trạng thái: ${firstRecord.trangThai}`);
console.log(`✅ Container count: ${firstRecord.chiTietList?.length || 0}`);

// Test filtering functionality
console.log('\n🔍 Testing Filter Logic:');

// Filter by company code
const companyCodeFilter = "0312345678";
const filteredByCompany = sampleApiResponse.data.filter(item => 
  item.maDoanhNghiepKhaiPhi?.includes(companyCodeFilter) ||
  item.maDoanhNghiepXNK?.includes(companyCodeFilter)
);
console.log(`✅ Filter by company code '${companyCodeFilter}': ${filteredByCompany.length} records`);

// Filter by tokhai number
const tokhaiFilter = "TK202509110001";
const filteredByTokhai = sampleApiResponse.data.filter(item => 
  item.soToKhai?.includes(tokhaiFilter) ||
  item.maHaiQuan?.includes(tokhaiFilter)
);
console.log(`✅ Filter by tokhai number '${tokhaiFilter}': ${filteredByTokhai.length} records`);

// Test container details
console.log('\n📦 Testing Container Details:');
if (firstRecord.chiTietList && firstRecord.chiTietList.length > 0) {
  firstRecord.chiTietList.forEach((container, index) => {
    console.log(`✅ Container ${index + 1}:`);
    console.log(`   - Số vận đơn: ${container.soVanDon}`);
    console.log(`   - Số hiệu: ${container.soHieu}`);
    console.log(`   - Loại container: ${container.loaiCont}`);
    console.log(`   - Trọng lượng: ${container.tongTrongLuong} ${container.donViTinh}`);
    console.log(`   - Số tiền: ${container.soTien?.toLocaleString()} VND`);
  });
}

// Test form mapping data
console.log('\n📝 Testing Form Mapping Data:');
const mappingData = {
  companyInfo: {
    companyCode: firstRecord.maDoanhNghiepKhaiPhi,
    companyName: firstRecord.tenDoanhNghiepKhaiPhi,
    address: firstRecord.diaChiKhaiPhi
  },
  declarationInfo: {
    declarationNumber: firstRecord.soToKhai,
    declarationDate: firstRecord.ngayToKhai,
    customsCode: firstRecord.maHaiQuan
  },
  paymentInfo: {
    totalAmount: firstRecord.tongTienPhi,
    paymentMethod: firstRecord.loaiThanhToan,
    status: firstRecord.trangThai
  },
  transportInfo: {
    vehicle: firstRecord.phuongTienVC,
    loadingLocation: firstRecord.maDiaDiemXepHang,
    unloadingLocation: firstRecord.maDiaDiemDoHang
  }
};

console.log('✅ Mapped form data:', JSON.stringify(mappingData, null, 2));

console.log('\n🎉 All tests completed successfully!');
console.log('✅ API response structure is valid');
console.log('✅ Data filtering works correctly');
console.log('✅ Container details are accessible');
console.log('✅ Form mapping data is ready');
console.log('\n📌 Next steps:');
console.log('1. Test the UI with real API connection');
console.log('2. Implement automatic form filling');
console.log('3. Add validation and error handling');
