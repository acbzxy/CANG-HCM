// Application constants
export const APP_NAME = 'Hệ Thống Thu Phí TPHCM'
export const APP_VERSION = '1.0.0'

// API endpoints (mock)
export const API_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
  REGISTER: '/api/auth/register',
  CAPTCHA: '/api/captcha',
  PROFILE: '/api/user/profile',
  CHANGE_PASSWORD: '/api/user/change-password',
  DECLARATIONS: '/api/declarations',
  RECEIPTS: '/api/receipts',
  LOOKUP_RECEIPT: '/api/receipts/lookup',
} as const

// Local storage keys
export const STORAGE_KEYS = {
  USER: 'user',
  IS_LOGGED_IN: 'isLoggedIn',
  LOGIN_TIME: 'loginTime',
  USER_TYPE: 'userType',
  SIDEBAR_COLLAPSED: 'sidebarCollapsed',
  THEME: 'theme',
} as const

// Dev credentials
export const DEV_CREDENTIALS = {
  username: 'devadmin',
  password: 'dev123456',
  captcha: 'dev',
} as const

// Contact information
export const CONTACT_INFO = {
  hotline: '1900 1286',
  email: 'thuphihatang@tphcm.gov.vn',
  address: 'Số 167 - Lưu Hữu Phước - P.15 - Quận 8 - TP HCM',
  workingHours: '7:30 - 17:30 (Thứ 2 - Thứ 6)',
} as const

// Organization info
export const ORG_INFO = {
  department: 'Sở Xây Dựng',
  city: 'Thành phố Hồ Chí Minh',
  port: 'Cảng vụ đường thủy nội địa',
  company: 'Demo web thu phí',
} as const

// System settings
export const SYSTEM_SETTINGS = {
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  notificationDuration: 5000, // 5 seconds
  maxFileSize: 10 * 1024 * 1024, // 10MB
  supportedFileTypes: ['pdf', 'doc', 'docx', 'jpg', 'png'],
} as const

// Payment methods
export const PAYMENT_METHODS = [
  {
    id: 'vcb',
    name: 'Vietcombank',
    channels: ['VCB-iB@nking', 'VCB Digibank'],
    color: 'blue',
  },
  {
    id: 'vtb',
    name: 'VietinBank',
    channels: ['Tất cả các kênh VietinBank'],
    color: 'red',
  },
  {
    id: 'bidv',
    name: 'BIDV',
    channels: ['Tất cả các kênh BIDV'],
    color: 'green',
  },
  {
    id: 'qr',
    name: 'QR Code',
    channels: ['Quét mã QR', 'ECOM Banking'],
    color: 'purple',
  },
] as const
