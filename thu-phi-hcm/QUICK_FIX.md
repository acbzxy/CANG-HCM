# 🚀 QUICK FIX - Màn Hình Trắng

## Các bước khắc phục nhanh:

### 1. Kiểm tra Backend (Quan trọng nhất!)
```bash
cd spring-boot-api
mvn spring-boot:run
```

Đợi backend khởi động xong (thấy "Started SpringMvcApiApplication")

### 2. Kiểm tra kết nối
```bash
cd demo/thu-phi-hcm  
npm run check-backend
```

### 3. Chạy Frontend với Debug
```bash
npm run dev-debug
```

### 4. Truy cập với Debug Mode
Mở: `http://localhost:3000/fee-declaration/manage?debug=true`

### 5. Kiểm tra Console
- Mở F12 → Console
- Xem có lỗi gì không
- Tìm các log "[DEBUG]"

## ⚡ Khắc phục nhanh nhất:

1. **Backend chưa chạy**: Chạy `mvn spring-boot:run` trong thư mục `spring-boot-api`
2. **CORS Error**: Backend sẽ tự động xử lý CORS
3. **Network Error**: Kiểm tra URL `http://localhost:8080` có hoạt động không

## 🔍 Debug Commands:

Mở Console (F12) và gõ:
```javascript
// Test backend
window.testBackend()

// Bật debug mode  
window.debug.enableDebug()
```

## 📞 Nếu vẫn lỗi:

1. Chụp ảnh Console errors
2. Gửi log từ debug mode
3. Báo cáo kết quả của `npm run check-backend`
