# 🔗 Tích Hợp Frontend - Backend

## ✅ **Đã hoàn thành kết nối dữ liệu từ database!**

### 🎯 **Những gì đã thực hiện:**

#### 1. **📊 Tạo dữ liệu mẫu phong phú**
- ✅ 6 tờ khai phí với dữ liệu thật từ screenshot
- ✅ Các công ty thực: Vinachimex, Ánh Long, DAP SG 7
- ✅ Đầy đủ trạng thái: DRAFT, SUBMITTED, APPROVED, PAID
- ✅ Timestamps và workflow hoàn chỉnh

#### 2. **🔧 Cấu hình Backend API**
- ✅ H2 Database file-based (persistent)
- ✅ Auto table creation với Hibernate
- ✅ RESTful APIs với pagination
- ✅ CORS enabled cho frontend
- ✅ Sample data tự động load

#### 3. **💻 Cấu hình Frontend**
- ✅ Chuyển từ Mock API sang Real API
- ✅ Error handling và debug mode
- ✅ API integration với backend

---

## 🚀 **Cách chạy Full Stack:**

### **Option 1: Script tự động**
```bash
cd demo/thu-phi-hcm
test-fullstack.bat
```

### **Option 2: Chạy thủ công**

#### **Bước 1: Start Backend**
```bash
cd spring-boot-api
mvn spring-boot:run
```
**Chờ thấy:** `✅ DATABASE INITIALIZATION COMPLETED`

#### **Bước 2: Start Frontend**
```bash
cd demo/thu-phi-hcm
npm run dev
```

#### **Bước 3: Test Integration**
Truy cập: http://localhost:3000/fee-declaration/manage

---

## 📊 **Dữ liệu mẫu đã tạo:**

### **Tờ khai phí:**
| Mã TK | Công ty | Loại hàng | Số tiền | Trạng thái |
|-------|---------|-----------|---------|------------|
| Web-210817242026 | Vinachimex Việt Nam | 101 - hàng đông lạnh | 750,000 | APPROVED |
| Web-210817428904 | Ánh Long và Dch vụ | 100 - hàng container | 750,000 | APPROVED |
| Web-210817420403 | Ánh Long và Dch vụ | 100 - hàng container | 1,000,000 | APPROVED |
| Web-210817396402 | DAP SG 7 - Vinachem | 100 - hàng container | 750,000 | DRAFT |
| Web-210817445566 | Thương Mại ABC | 102 - hàng khô | 850,000 | SUBMITTED |
| Web-210817556677 | Xuất Nhập Khẩu XYZ | 103 - hàng lỏng | 920,000 | PAID |

### **Users:**
- admin, user1, user2, user3 với thông tin đầy đủ

---

## 🔍 **Kiểm tra kết nối:**

### **1. Backend APIs:**
```bash
# Health check
curl http://localhost:8080/api/health/status

# Get fee declarations
curl http://localhost:8080/api/fee-declarations?page=0&size=10

# Search by company
curl http://localhost:8080/api/fee-declarations/company/0100439415
```

### **2. Database:**
- **H2 Console:** http://localhost:8080/h2-console
- **JDBC URL:** `jdbc:h2:file:./data/testdb`
- **Username:** `sa`, **Password:** (trống)

### **3. Frontend:**
- **Main App:** http://localhost:3000
- **Fee Management:** http://localhost:3000/fee-declaration/manage
- **Debug Mode:** Add `?debug=true` to URL

---

## 🛠️ **API Endpoints sẵn sàng:**

### **Fee Declarations:**
- `GET /api/fee-declarations` - Lấy tất cả (có pagination)
- `POST /api/fee-declarations/search` - Tìm kiếm với filter
- `GET /api/fee-declarations/{id}` - Lấy theo ID
- `GET /api/fee-declarations/company/{taxCode}` - Lấy theo công ty
- `GET /api/fee-declarations/status/{status}` - Lấy theo trạng thái
- `POST /api/fee-declarations` - Tạo mới
- `PUT /api/fee-declarations/{id}` - Cập nhật
- `PATCH /api/fee-declarations/{id}/status` - Đổi trạng thái

### **Health & Debug:**
- `GET /api/health/status` - Trạng thái hệ thống
- `GET /api/health/database` - Thông tin database
- `GET /api/fee-declarations/statistics` - Thống kê

---

## 🎯 **Kết quả mong đợi:**

Khi truy cập http://localhost:3000/fee-declaration/manage, bạn sẽ thấy:

✅ **Dữ liệu thật từ database** thay vì mock data
✅ **6 tờ khai phí** với thông tin đầy đủ
✅ **Pagination** hoạt động
✅ **Search và filter** (nếu đã implement)
✅ **Các trạng thái** hiển thị đúng màu sắc
✅ **Loading states** khi gọi API

---

## 🔧 **Troubleshooting:**

### **Nếu frontend hiển thị trống:**
1. Check browser console có lỗi không
2. Kiểm tra backend có chạy không: `curl http://localhost:8080/api/health/status`
3. Enable debug mode: thêm `?debug=true` vào URL
4. Check network tab trong DevTools

### **Nếu backend không có dữ liệu:**
1. Check logs có thấy "DATABASE INITIALIZATION COMPLETED" không
2. Truy cập H2 console để xem tables
3. Restart backend để reload sample data

### **CORS issues:**
Backend đã cấu hình CORS cho `localhost:3000` và `localhost:5173`

---

## 🎉 **Thành công!**

Hệ thống bây giờ đã:
- ✅ **Full-stack integration** hoạt động
- ✅ **Database persistent** với dữ liệu thật  
- ✅ **APIs** đầy đủ và documented
- ✅ **Frontend** kết nối backend thành công
- ✅ **Sample data** phong phú để test

Bạn có thể bắt đầu phát triển thêm tính năng hoặc customize giao diện!
