# 📋 HƯỚNG DẪN MAPPING HOÀN CHỈNH

## 🎯 **TỔNG QUAN**

Đã implement mapping từ API response `/tokhai-thongtin/all` vào tất cả các fields trong form khai báo phí.

## 🗂️ **CHI TIẾT MAPPING**

### **✅ 1. DOANH NGHIỆP KHAI PHÍ**
```typescript
companyTaxCode ← maDoanhNghiepKhaiPhi
companyName ← tenDoanhNghiepKhaiPhi  
companyAddress ← diaChiKhaiPhi
```

### **✅ 2. DOANH NGHIỆP XUẤT NHẬP KHẨU**
```typescript
importExportCompanyTaxCode ← maDoanhNghiepXNK
importExportCompanyName ← tenDoanhNghiepXNK
importExportCompanyAddress ← diaChiXNK
```

### **✅ 3. TỜ KHAI HẢI QUAN**
```typescript
customsDeclarationNumber ← soToKhai
customsDeclarationDate ← ngayToKhai
// Select fields (cần thêm name attributes):
// Mã Hải quan ← maHaiQuan
// Mã loại hình ← maLoaiHinh  
// Mã lưu kho/Dịch vụ ← maLuuKho
// Nước xuất khẩu ← nuocXuatKhau
```

### **✅ 4. TỜ KHAI PHÍ**
```typescript
feeDeclarationReceiptNumber ← soTiepNhanKhaiPhi
feeDeclarationDate ← ngayKhaiPhi
notes ← ghiChuKhaiPhi
// Select fields (cần thêm name attributes):
// Nhóm loại phí ← nhomLoaiPhi
// Loại thanh toán ← loaiThanhToan
```

### **📋 5. THÔNG TIN HÀNG HÓA TỜ KHAI** *(Cần thêm name attributes)*
```typescript
// Mã hiệu phương thức vận chuyển ← maPhuongThucVC
// Phương tiện vận chuyển ← phuongTienVC
// Mã địa điểm xếp hàng ← maDiaDiemXepHang
// Mã địa điểm dỡ hàng ← maDiaDiemDoHang
// Mã phân loại hàng hóa ← maPhanLoaiHangHoa
// Mục đích vận chuyển ← mucDichVC
```

### **💰 6. THÔNG TIN THU PHÍ** *(Read-only fields)*
```typescript
// Số thông báo nộp phí ← soTiepNhanKhaiPhi
// Trạng thái ngân hàng ← trangThaiNganHang
// Tổng tiền phí ← tongTienPhi
```

### **📦 7. DANH SÁCH CONTAINER** *(Từ chiTietList[0])*
```typescript
// STT: Tự tăng
// Số vận đơn ← soVanDon
// Số hiệu Container ← soHieu
// Số Seal ← soSeal
// Loại Cont ← loaiCont
// Tính chất Cont ← tinhChatCont
// Tổng trọng lượng ← tongTrongLuong
// ĐVT ← donViTinh
// Ghi chú ← ghiChu
```

## 🚀 **CÁCH SỬ DỤNG**

### **Test với Sample Data:**
1. **Nhấn nút "📊 Sample"** → Load 2 records test
2. **Chọn 1 record** → Nhấn "📝 Điền"
3. **Kiểm tra console logs** để xem mapping process

### **Test với API thật:**
1. **Nhấn "🔧 Debug"** → Kiểm tra API connection
2. **Nhập mã doanh nghiệp** (VD: `0312345678`)
3. **Nhấn "Lấy thông tin"** → Xem dữ liệu được load
4. **Chọn record và điền form**

### **Console Logs mong đợi:**
```
🖊️ Starting auto-fill form with data: {...}
🔍 Found form elements: ["companyTaxCode", "companyName", ...]
🏢 Filling DOANH NGHIỆP KHAI PHÍ fields...
✅ companyTaxCode: "" => "0312345678"
✅ companyName: "" => "Công ty TNHH Vận Tải Biển Đông"
🚢 Filling DOANH NGHIỆP XUẤT NHẬP KHẨU fields...
📋 Filling TỜ KHAI HẢI QUAN fields...
✅ customsDeclarationNumber: "" => "TK202509110001"
✅ customsDeclarationDate: "" => "2025-09-11"
💰 Filling TỜ KHAI PHÍ fields...
✅ feeDeclarationReceiptNumber: "" => "202500000003"
✅ notes: "" => "Nộp phí hạ tầng cảng biển..."
📦 Container details available: 1 containers
🎉 Form auto-fill completed successfully
```

## 🔧 **TRẠNG THÁI FIELDS**

### **✅ Đã implement (có name attributes):**
- Company info (6 fields)
- Import/Export company (3 fields)  
- Customs declaration (2 fields)
- Fee declaration (3 fields)
- **Total: 14 fields**

### **📋 Cần thêm name attributes:**
- Select dropdowns cho Hải quan info (4 fields)
- Select dropdowns cho Fee info (2 fields)
- Select dropdowns cho Cargo info (6 fields)
- Container table fields (8 fields per container)

### **📊 Read-only fields:**
- Payment info displays (9 fields)

## 🛠️ **NEXT STEPS**

1. **Test current mapping** với 14 fields đã implement
2. **Thêm name attributes** cho select dropdowns nếu cần
3. **Implement container table mapping** nếu cần
4. **Extend cho bulk cargo và CFS** nếu cần

## 📝 **SAMPLE DATA STRUCTURE**

```json
{
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
  "soTiepNhanKhaiPhi": "202500000003",
  "ngayKhaiPhi": "2025-09-12",
  "nhomLoaiPhi": "HẠ TẦNG CẢNG BIỂN",
  "loaiThanhToan": "CHUYEN_KHOAN",
  "ghiChuKhaiPhi": "Nộp phí hạ tầng cảng biển cho lô hàng 2025-09-11",
  "maPhuongThucVC": "2",
  "phuongTienVC": "CONTAINER SHIP",
  "maDiaDiemXepHang": "CANGCATLAI",
  "maDiaDiemDoHang": "CANGHAIPHONG",
  "maPhanLoaiHangHoa": "XNK",
  "mucDichVC": "Xuất khẩu hàng dệt may",
  "trangThaiNganHang": "DA_THANH_TOAN",
  "chiTietList": [
    {
      "soVanDon": "VANDON12345",
      "soHieu": "CONT001", 
      "soSeal": "SEAL123",
      "loaiCont": "40HC",
      "tinhChatCont": "Hàng khô",
      "tongTrongLuong": 25000.5,
      "donViTinh": "KG",
      "ghiChu": "Hàng dệt may xuất đi Mỹ"
    }
  ]
}
```

---
*Cập nhật lúc: $(date)*
