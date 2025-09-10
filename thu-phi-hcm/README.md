# Hệ Thống Thu Phí TPHCM - React Application

Ứng dụng React hiện đại cho Hệ thống thu phí sử dụng kết cấu hạ tầng, công trình dịch vụ, tiện ích công cộng trong khu vực cửa khẩu cảng biển trên địa bàn Thành Phố Hồ Chí Minh.

## 🚀 Tính Năng Chính

- **🔐 Hệ thống đăng nhập/đăng ký** với xác thực và captcha
- **📊 Dashboard** với thông tin tổng quan và navigation
- **💳 Quản lý nộp phí** (tạo tờ khai, ký số điện tử, thanh toán)
- **🔍 Tra cứu biên lai điện tử** 
- **👤 Quản lý tài khoản** và đổi mật khẩu
- **📚 Hướng dẫn sử dụng** với tài liệu và video
- **📱 Responsive design** - tương thích mọi thiết bị
- **🎨 UI/UX hiện đại** với Tailwind CSS

## 🛠️ Công Nghệ Sử Dụng

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Icons**: Heroicons
- **State Management**: React Context API
- **Form Handling**: Custom hooks với validation

## 📦 Cài Đặt và Chạy

### Yêu cầu hệ thống
- Node.js >= 16.0.0
- npm hoặc yarn

### Cài đặt dependencies
```bash
cd thu-phi-hcm
npm install
```

### Chạy ứng dụng development
```bash
npm run dev
```

Ứng dụng sẽ chạy tại: http://localhost:3000

### Build cho production
```bash
npm run build
```

### Preview build
```bash
npm run preview
```

## 🔑 Tài Khoản Demo

### Tài khoản Dev Environment
- **Username**: `devadmin`
- **Password**: `dev123456`
- **Captcha**: `dev` (bỏ qua validation)

### Tài khoản thường
- **Username**: Bất kỳ (ví dụ: `0109844160`)
- **Password**: Bất kỳ
- **Captcha**: Nhập bất kỳ

## 📁 Cấu Trúc Dự Án

```
thu-phi-hcm/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── layout/        # Layout components (Header, Sidebar, Footer)
│   │   └── ui/            # UI components (Button, Input, Card)
│   ├── context/           # React Context (Auth, Notification)
│   ├── hooks/             # Custom hooks
│   ├── pages/             # Page components
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Main App component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite configuration
└── README.md             # Documentation
```

## 🎯 Tính Năng Chi Tiết

### 1. Trang Welcome `/welcome`
- Landing page với design hiện đại
- Thông tin tổng quan về hệ thống
- Links đến đăng nhập và tra cứu biên lai

### 2. Đăng Nhập `/login`
- Form đăng nhập với validation
- Captcha verification
- Auto-fill cho dev credentials (double-click username)
- Remember me functionality

### 3. Dashboard `/dashboard`
- Hero section với thông tin tổng quan
- Quick actions cho các chức năng chính
- Thông báo mới nhất
- Thông tin liên hệ

### 4. Module Nộp Phí `/payment`
- Tạo tờ khai phí mới
- Danh sách tờ khai đã tạo
- Ký số điện tử
- Hướng dẫn thanh toán qua các ngân hàng

### 5. Quản Lý Tài Khoản `/account`
- Thông tin cơ bản
- Thông tin doanh nghiệp
- Liên hệ hỗ trợ
- Lưu ý bảo mật

### 6. Đổi Mật Khẩu `/password`
- Form đổi mật khẩu với validation
- Password strength indicator
- Security tips
- Support information

### 7. Hướng Dẫn `/guide`
- Hướng dẫn cài đặt môi trường
- Video tutorials
- Tài liệu PDF
- Hướng dẫn thanh toán
- Thông tin liên hệ

### 8. Tra Cứu Biên Lai `/receipt-lookup`
- Form tra cứu với mã nhận biên lai
- Captcha verification
- Thông tin hỗ trợ

## 🔧 Development

### Scripts có sẵn
- `npm run dev` - Chạy development server
- `npm run build` - Build cho production
- `npm run preview` - Preview production build
- `npm run lint` - Chạy ESLint

### Custom Hooks
- `useAuth()` - Quản lý authentication state
- `useNotification()` - Quản lý notifications

### Context Providers
- `AuthProvider` - Authentication context
- `NotificationProvider` - Notification system

## 🎨 UI Components

### Layout Components
- `Header` - Top navigation bar
- `Sidebar` - Side navigation menu
- `Footer` - Bottom footer
- `Layout` - Main layout wrapper

### UI Components
- `Button` - Various button variants
- `Input` - Form input with validation
- `Card` - Content containers
- `NotificationContainer` - Toast notifications

## 📱 Responsive Design

Ứng dụng được thiết kế responsive với breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔒 Authentication Flow

1. User visits `/welcome`
2. Clicks "Đăng nhập" → redirects to `/login`
3. Enters credentials and submits
4. On success → redirects to `/dashboard`
5. Protected routes check authentication status
6. Logout clears session and redirects to `/welcome`

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

### Traditional Hosting
```bash
npm run build
# Upload dist/ folder to your web server
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

Copyright © 2025 - Công Ty TNHH Phát Triển Công Nghệ Thái Sơn

## 📞 Support

- **Hotline**: 1900 1286
- **Email**: thuphihatang@tphcm.gov.vn
- **Thời gian hỗ trợ**: 7:30 - 17:30 (Thứ 2 - Thứ 6)

---

**Chú ý**: Đây là phiên bản demo/development. Các tính năng backend và API endpoints cần được implement trong môi trường production.
