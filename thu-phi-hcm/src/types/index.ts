// User and Authentication types
export interface User {
  id: string
  username: string
  email: string
  fullName: string
  companyName: string
  taxCode: string
  phone: string
  address: string
  userType: 'enterprise' | 'agent' | 'individual' | 'dev' | 'custom' | 'admin_custom'
  status: 'active' | 'inactive' | 'locked'
  createdAt: string
  lastLoginAt?: string
}

export interface LoginCredentials {
  username: string
  password: string
  captcha: string
  rememberMe?: boolean
}

export interface RegisterData {
  username: string
  password: string
  confirmPassword: string
  fullName: string
  email: string
  phone: string
  mobile?: string
  address: string
  accountType: 'enterprise' | 'agent' | 'individual'
  enableDigitalSignature?: boolean
  note?: string
}

// Notification types
export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  title?: string
  message: string
  duration?: number
  autoClose?: boolean
}

// Navigation types
export interface NavItem {
  id: string
  label: string
  path: string
  icon: string
  children?: NavItem[]
  badge?: string
}

// Payment and Fee types
export interface FeeDeclaration {
  id: number
  declarationNumber: string
  companyId: number
  company: {
    id: number
    companyName: string
    taxCode: string
  }
  vesselName: string
  voyageNumber?: string
  arrivalDate: string
  departureDate?: string
  portOfOrigin?: string
  portOfDestination?: string
  grossTonnage: number
  netTonnage: number
  totalFeeAmount: number
  paidAmount: number
  remainingAmount: number
  paymentStatus: 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE'
  declarationStatus: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
  trangThaiPhatHanh?: string // '00' = Mới, '01' = Bản nháp, '02' = Phát hành, '03' = Đã hủy
  idPhatHanh?: string // ID phát hành từ FPT E-Invoice
  dueDate?: string
  paymentDate?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Receipt {
  id: string
  receiptCode: string
  declarationId: string
  amount: number
  currency: 'VND' | 'USD'
  paymentMethod: 'bank_transfer' | 'qr_code' | 'ecom'
  bankName?: string
  transactionId?: string
  issuedAt: string
  status: 'issued' | 'cancelled'
}

// Guide and Help types
export interface GuideDocument {
  id: string
  title: string
  description: string
  type: 'pdf' | 'doc' | 'video' | 'link'
  url: string
  category: 'installation' | 'declaration' | 'payment' | 'signature' | 'general'
  isNew?: boolean
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]>
  timestamp?: string
}

// Form validation types
export interface ValidationError {
  field: string
  message: string
}

export interface FormState<T> {
  values: T
  errors: Record<keyof T, string>
  touched: Record<keyof T, boolean>
  isSubmitting: boolean
  isValid: boolean
}

// Theme and UI types
export interface ThemeConfig {
  primaryColor: string
  secondaryColor: string
  sidebarCollapsed: boolean
  darkMode: boolean
}

// System notification types
export interface SystemNotification {
  id: string
  title: string
  content: string
  type: 'maintenance' | 'update' | 'announcement'
  isActive: boolean
  startDate?: string
  endDate?: string
  priority: 'low' | 'medium' | 'high'
}
