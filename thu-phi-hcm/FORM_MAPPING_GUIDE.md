# 📋 HƯỚNG DẪN MAPPING API RESPONSE VÀO FORM

## 🎯 **TỔNG QUAN**

Tài liệu này mô tả cách mapping dữ liệu từ API response `/tokhai-thongtin/all` vào các trường form trong component `FeeInformationFormModal`.

## 📊 **CẤU TRÚC API RESPONSE**

### API Endpoint
```
GET http://10.14.122.24:8081/PHT_BE/api/tokhai-thongtin/all
```

### Response Structure
```json
{
  "status": 200,
  "timestamp": "14/09/2025 22:51:32",
  "message": "Success",
  "data": [
    {
      "id": 5,
      "maDoanhNghiepKhaiPhi": "0312345678",
      "tenDoanhNghiepKhaiPhi": "Công ty TNHH Vận Tải Biển Đông",
      "diaChiKhaiPhi": "123 Lê Lợi, Quận 1, TP.HCM",
      "maDoanhNghiepXNK": "0208765432",
      "tenDoanhNghiepXNK": "Công ty CP Xuất Nhập Khẩu Thái Bình",
      "diaChiXNK": "456 Trần Hưng Đạo, Quận Hoàn Kiếm, Hà Nội",
      "soToKhai": "TK202509110001",
      "ngayToKhai": "2025-09-11",
      "tongTienPhi": 1250000,
      "trangThai": "02",
      "trangThaiPhatHanh": "01",
      // ... more fields
    }
  ]
}
```

## 🗂️ **MAPPING FIELDS**

### **1. DOANH NGHIỆP KHAI PHÍ**

| Form Field Name | API Response Field | Mô tả |
|---|---|---|
| `companyTaxCode` | `maDoanhNghiepKhaiPhi` | Mã số thuế doanh nghiệp khai phí |
| `companyName` | `tenDoanhNghiepKhaiPhi` | Tên doanh nghiệp khai phí |
| `companyAddress` | `diaChiKhaiPhi` | Địa chỉ doanh nghiệp khai phí |

**Ví dụ mapping:**
```typescript
// API Response
{
  "maDoanhNghiepKhaiPhi": "0312345678",
  "tenDoanhNghiepKhaiPhi": "Công ty TNHH Vận Tải Biển Đông", 
  "diaChiKhaiPhi": "123 Lê Lợi, Quận 1, TP.HCM"
}

// Form Fields
companyTaxCode.value = "0312345678"
companyName.value = "Công ty TNHH Vận Tải Biển Đông"
companyAddress.value = "123 Lê Lợi, Quận 1, TP.HCM"
```

### **2. DOANH NGHIỆP XUẤT NHẬP KHẨU**

| Form Field Name | API Response Field | Mô tả |
|---|---|---|
| `importExportCompanyTaxCode` | `maDoanhNghiepXNK` | Mã số thuế doanh nghiệp XNK |
| `importExportCompanyName` | `tenDoanhNghiepXNK` | Tên doanh nghiệp XNK |
| `importExportCompanyAddress` | `diaChiXNK` | Địa chỉ doanh nghiệp XNK |

**Ví dụ mapping:**
```typescript
// API Response
{
  "maDoanhNghiepXNK": "0208765432",
  "tenDoanhNghiepXNK": "Công ty CP Xuất Nhập Khẩu Thái Bình",
  "diaChiXNK": "456 Trần Hưng Đạo, Quận Hoàn Kiếm, Hà Nội"
}

// Form Fields
importExportCompanyTaxCode.value = "0208765432"
importExportCompanyName.value = "Công ty CP Xuất Nhập Khẩu Thái Bình" 
importExportCompanyAddress.value = "456 Trần Hưng Đạo, Quận Hoàn Kiếm, Hà Nội"
```

## 🔧 **IMPLEMENTATION**

### **Auto-fill Function**
```typescript
const handleAutoFillForm = () => {
  if (!selectedTokhai) {
    showError('Chưa chọn tờ khai để điền form', 'Lỗi');
    return;
  }

  try {
    // Fill DOANH NGHIỆP KHAI PHÍ fields
    const companyTaxCodeField = document.querySelector('input[name="companyTaxCode"]') as HTMLInputElement;
    const companyNameField = document.querySelector('input[name="companyName"]') as HTMLInputElement;
    const companyAddressField = document.querySelector('input[name="companyAddress"]') as HTMLInputElement;

    if (companyTaxCodeField) {
      companyTaxCodeField.value = selectedTokhai.maDoanhNghiepKhaiPhi || '';
    }
    if (companyNameField) {
      companyNameField.value = selectedTokhai.tenDoanhNghiepKhaiPhi || '';
    }
    if (companyAddressField) {
      companyAddressField.value = selectedTokhai.diaChiKhaiPhi || '';
    }

    // Fill DOANH NGHIỆP XUẤT NHẬP KHẨU fields
    const importExportTaxCodeField = document.querySelector('input[name="importExportCompanyTaxCode"]') as HTMLInputElement;
    const importExportNameField = document.querySelector('input[name="importExportCompanyName"]') as HTMLInputElement;
    const importExportAddressField = document.querySelector('input[name="importExportCompanyAddress"]') as HTMLInputElement;

    if (importExportTaxCodeField) {
      importExportTaxCodeField.value = selectedTokhai.maDoanhNghiepXNK || '';
    }
    if (importExportNameField) {
      importExportNameField.value = selectedTokhai.tenDoanhNghiepXNK || '';
    }
    if (importExportAddressField) {
      importExportAddressField.value = selectedTokhai.diaChiXNK || '';
    }

    // Trigger change events
    [companyTaxCodeField, companyNameField, companyAddressField, 
     importExportTaxCodeField, importExportNameField, importExportAddressField].forEach(field => {
      if (field) {
        field.dispatchEvent(new Event('change', { bubbles: true }));
        field.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });

    showSuccess('Đã điền form tự động thành công!', 'Thành công');
    
  } catch (error) {
    console.error('❌ Error auto-filling form:', error);
    showError('Có lỗi xảy ra khi điền form tự động', 'Lỗi');
  }
};
```

## 🎮 **CÁCH SỬ DỤNG**

### **Bước 1: Lấy dữ liệu từ API**
1. Nhập mã doanh nghiệp vào input field
2. Nhấn nút **"Lấy thông tin"**
3. Hệ thống sẽ call API và hiển thị kết quả trong table

### **Bước 2: Chọn và điền form**
**Cách 1: Chọn rồi điền**
1. Nhấn nút **"Chọn"** trong table
2. Xem chi tiết tờ khai trong card
3. Nhấn nút **"📝 Tự động điền form"**

**Cách 2: Điền trực tiếp**
1. Nhấn nút **"📝 Điền"** ngay trong table row
2. Form sẽ được điền tự động ngay lập tức

### **Bước 3: Kiểm tra kết quả**
- Scroll xuống xem form đã được điền
- Kiểm tra các trường đã được mapping đúng
- Chỉnh sửa nếu cần thiết

## 🔍 **DEBUG & TROUBLESHOOTING**

### **Console Logs**
Khi auto-fill, check console logs:
```
🖊️ Auto-filling form with data: {...}
✅ Filled companyTaxCode: 0312345678
✅ Filled companyName: Công ty TNHH Vận Tải Biển Đông
✅ Filled companyAddress: 123 Lê Lợi, Quận 1, TP.HCM
✅ Filled importExportCompanyTaxCode: 0208765432
✅ Filled importExportCompanyName: Công ty CP Xuất Nhập Khẩu Thái Bình
✅ Filled importExportCompanyAddress: 456 Trần Hưng Đạo, Quận Hoàn Kiếm, Hà Nội
🎉 Form auto-fill completed successfully
```

### **Common Issues**

**🔸 Form fields không được điền:**
- Kiểm tra form đã render chưa
- Kiểm tra field names có đúng không
- Kiểm tra selectedTokhai có data không

**🔸 Data mapping sai:**
- Kiểm tra API response structure
- Kiểm tra field mapping trong code
- Kiểm tra null/undefined values

**🔸 Change events không trigger:**
- Đảm bảo dispatch events được gọi
- Kiểm tra form validation
- Kiểm tra React state updates

## 📈 **FUTURE ENHANCEMENTS**

### **Có thể mở rộng thêm:**
1. **More fields mapping:**
   - Tờ khai hải quan fields
   - Phương tiện vận chuyển
   - Thông tin hàng hóa
   - Container details

2. **Validation:**
   - Validate data trước khi fill
   - Show warnings cho invalid data
   - Auto-correct common formats

3. **User Experience:**
   - Confirmation dialogs
   - Undo/Redo functionality
   - Bulk operations
   - Save as templates

## 🔗 **RELATED FILES**

- `src/pages/payment/declare/components/FeeInformationFormModal.tsx` - Main implementation
- `src/pages/payment/declare/components/FeeDeclarationForm.tsx` - Form structure
- `src/utils/feeDeclarationApi.ts` - API service
- `vite.config.ts` - Proxy configuration
