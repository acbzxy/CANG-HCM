# Troubleshooting Guide - Hệ Thống Thu Phí TPHCM

## 🚨 Màn Hình Trắng (White Screen) 

Nếu bạn gặp màn hình trắng khi truy cập trang quản lý tờ khai phí, hãy làm theo các bước sau:

### Bước 1: Kiểm tra Console
1. Mở Developer Tools (F12)
2. Chuyển sang tab Console
3. Kiểm tra có lỗi JavaScript nào không

### Bước 2: Kích hoạt Debug Mode
1. Thêm `?debug=true` vào URL: `http://localhost:3000/fee-declaration/manage?debug=true`
2. Hoặc mở Console và gõ: `window.debug.enableDebug()`
3. Trang sẽ hiển thị thông tin debug ở đầu trang

### Bước 3: Kiểm tra Backend
```bash
# Kiểm tra backend có chạy không
npm run check-backend

# Hoặc kiểm tra thủ công
curl http://localhost:8080/api/fee-declarations?page=0&size=1
```

### Bước 4: Khắc phục các vấn đề thường gặp

#### Backend không chạy
```bash
cd spring-boot-api
mvn spring-boot:run
```

#### CORS Error
Nếu thấy lỗi CORS trong console:
1. Kiểm tra backend có cấu hình CORS đúng không
2. Đảm bảo frontend chạy trên port 3000 hoặc 5173

#### Network Error
1. Kiểm tra backend URL trong `src/utils/feeDeclarationApi.ts`
2. Đảm bảo URL đúng: `http://localhost:8080/api`

### Bước 5: Sử dụng Mock Data
Nếu backend không hoạt động, hệ thống sẽ tự động chuyển sang mock data.
Kiểm tra console để xem có thông báo fallback không.

## 🔧 Debug Tools

### Browser Console Commands
```javascript
// Kích hoạt debug mode
window.debug.enableDebug()

// Tắt debug mode  
window.debug.disableDebug()

// Test backend connection
window.testBackend()

// Test CORS
window.testCORS()

// Log debug info
window.debug.log('Test message', {data: 'example'})
```

### URL Debug Parameters
- `?debug=true` - Kích hoạt debug mode
- `?debug=error` - Test error boundary

## 🚀 Development Scripts

```bash
# Chạy với debug mode
npm run dev-debug

# Kiểm tra backend
npm run check-backend

# Chạy bình thường
npm run dev
```

## 📋 Checklist Troubleshooting

- [ ] Backend Spring Boot đã chạy (port 8080)
- [ ] Frontend React đã chạy (port 3000/5173)  
- [ ] Console không có lỗi JavaScript
- [ ] Network tab không có failed requests
- [ ] CORS headers được cấu hình đúng
- [ ] API endpoints trả về dữ liệu hợp lệ

## 🆘 Liên Hệ Hỗ Trợ

Nếu vẫn gặp vấn đề:
1. Chụp ảnh màn hình console errors
2. Gửi log từ debug mode
3. Mô tả các bước đã thực hiện
4. Liên hệ team phát triển

## 📚 Tài Liệu Liên Quan

- [README.md](./README.md) - Hướng dẫn cài đặt
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Hướng dẫn development
- [Backend API Documentation](../spring-boot-api/README.md) - API docs
