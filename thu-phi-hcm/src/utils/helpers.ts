import type { NotificationType } from '../types'

// Format currency (VND)
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}

// Format date
export const formatDate = (date: string | Date, options?: Intl.DateTimeFormatOptions): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }).format(dateObj)
}

// Format date time
export const formatDateTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(dateObj)
}

// Generate unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Validate email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate phone number (Vietnamese format)
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^(\+84|0)[1-9]\d{8,9}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

// Validate tax code (Vietnamese format)
export const isValidTaxCode = (taxCode: string): boolean => {
  const taxCodeRegex = /^\d{10}(-\d{3})?$/
  return taxCodeRegex.test(taxCode)
}

// Password strength checker
export const getPasswordStrength = (password: string) => {
  let score = 0
  const feedback: string[] = []

  if (password.length === 0) {
    return { score: 0, strength: 'none', feedback: ['Vui lòng nhập mật khẩu'] }
  }

  // Length check
  if (password.length >= 8) {
    score += 1
  } else {
    feedback.push('Mật khẩu phải có ít nhất 8 ký tự')
  }

  // Character variety checks
  if (/[a-z]/.test(password)) score += 1
  else feedback.push('Cần có ít nhất 1 chữ thường')

  if (/[A-Z]/.test(password)) score += 1
  else feedback.push('Cần có ít nhất 1 chữ hoa')

  if (/[0-9]/.test(password)) score += 1
  else feedback.push('Cần có ít nhất 1 số')

  if (/[^A-Za-z0-9]/.test(password)) score += 1
  else feedback.push('Cần có ít nhất 1 ký tự đặc biệt')

  // Determine strength
  let strength: string
  if (score <= 1) strength = 'weak'
  else if (score <= 3) strength = 'medium'
  else if (score <= 4) strength = 'strong'
  else strength = 'very-strong'

  return { score, strength, feedback }
}

// Truncate text
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substr(0, maxLength) + '...'
}

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Get initials from name
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

// Get notification icon based on type
export const getNotificationIcon = (type: NotificationType): string => {
  switch (type) {
    case 'success':
      return '✅'
    case 'error':
      return '❌'
    case 'warning':
      return '⚠️'
    case 'info':
    default:
      return 'ℹ️'
  }
}

// Copy to clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try {
      document.execCommand('copy')
      return true
    } catch (err) {
      return false
    } finally {
      document.body.removeChild(textArea)
    }
  }
}

// Download file
export const downloadFile = (url: string, filename: string): void => {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Sleep function for delays
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Check if device is mobile
export const isMobile = (): boolean => {
  return window.innerWidth <= 768
}

// Scroll to top
export const scrollToTop = (smooth = true): void => {
  window.scrollTo({
    top: 0,
    behavior: smooth ? 'smooth' : 'auto'
  })
}

// Get file extension
export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
}
