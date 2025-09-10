# Hướng Dẫn Cài Đặt

## Yêu Cầu Hệ Thống

### 1. Node.js và npm
Tải và cài đặt Node.js từ [nodejs.org](https://nodejs.org/)
- **Node.js**: >= 16.0.0
- **npm**: >= 8.0.0 (đi kèm với Node.js)

Kiểm tra phiên bản:
```bash
node --version
npm --version
```

### 2. Git (Tùy chọn)
Tải từ [git-scm.com](https://git-scm.com/) để quản lý source code.

## Cài Đặt Dự Án

### 1. Điều hướng đến thư mục dự án
```bash
cd thu-phi-hcm
```

### 2. Cài đặt dependencies
```bash
npm install
```

**Lưu ý**: Quá trình này có thể mất 2-5 phút tùy thuộc vào tốc độ internet.

### 3. Khởi chạy development server
```bash
npm run dev
```

Ứng dụng sẽ chạy tại: **http://localhost:3000**

## Tài Khoản Demo

### Dev Environment
- **Username**: `devadmin`
- **Password**: `dev123456`
- **Mẹo**: Double-click vào ô username để tự động điền thông tin

### Tài khoản thường
- **Username**: Bất kỳ (ví dụ: `0109844160`)
- **Password**: Bất kỳ
- **Captcha**: Nhập bất kỳ

## Tính Năng Chính

✅ **Trang Welcome** - Landing page hiện đại
✅ **Đăng nhập/Đăng ký** - Với validation và captcha
✅ **Dashboard** - Tổng quan hệ thống
✅ **Module nộp phí** - Tạo tờ khai, ký số, thanh toán
✅ **Tra cứu biên lai** - Lookup biên lai điện tử
✅ **Quản lý tài khoản** - Profile và đổi mật khẩu
✅ **Hướng dẫn** - Video và tài liệu
✅ **Responsive design** - Mobile friendly

## Lệnh Có Sẵn

```bash
# Chạy development server
npm run dev

# Build cho production
npm run build

# Preview production build
npm run preview

# Chạy ESLint
npm run lint
```

## Cấu Trúc Website

```
/ (Welcome Page)
├── /login (Đăng nhập)
├── /receipt-lookup (Tra cứu biên lai)
└── Sau khi đăng nhập:
    ├── /dashboard (Trang chủ)
    ├── /payment (Nộp phí)
    ├── /account (Tài khoản)
    ├── /password (Đổi mật khẩu)
    └── /guide (Hướng dẫn)
```

## Troubleshooting

### Lỗi khi cài đặt npm
```bash
# Xóa cache và cài lại
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Port 3000 đã được sử dụng
```bash
# Sử dụng port khác
npm run dev -- --port 3001
```

### Lỗi TypeScript
```bash
# Kiểm tra lỗi TypeScript
npx tsc --noEmit
```

## Browser Support

- **Chrome**: >= 90
- **Firefox**: >= 88
- **Safari**: >= 14
- **Edge**: >= 90

## Production Deployment

### Vercel (Recommended)
1. Tạo tài khoản tại [vercel.com](https://vercel.com)
2. Kết nối repository
3. Deploy tự động

### Netlify
1. Build project: `npm run build`
2. Upload thư mục `dist/` lên [netlify.com](https://netlify.com)

### Traditional Hosting
1. Build project: `npm run build`
2. Upload thư mục `dist/` lên web server

## Liên Hệ Hỗ Trợ

- **Hotline**: 1900 1286
- **Email**: thuphihatang@tphcm.gov.vn
- **GitHub Issues**: [Tạo issue mới](https://github.com/your-repo/issues)

---

**Lưu ý**: Đây là phiên bản demo với mock data. Để sử dụng trong production, cần kết nối với backend API thực tế.
