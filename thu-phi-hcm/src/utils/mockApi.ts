import type { User, LoginCredentials, RegisterData, FeeDeclaration, Receipt } from '../types'
import { DEV_CREDENTIALS } from './constants'
import { sleep } from './helpers'

// Mock API responses
export class MockApi {
  // Simulate network delay
  private static async delay(ms = 1000): Promise<void> {
    await sleep(ms)
  }

  // Mock login
  static async login(credentials: LoginCredentials): Promise<User> {
    await this.delay()

    // Check dev credentials
    if (
      credentials.username === DEV_CREDENTIALS.username &&
      credentials.password === DEV_CREDENTIALS.password
    ) {
      return {
        id: 'dev-001',
        username: 'devadmin',
        email: 'dev@example.com',
        fullName: 'Dev Administrator',
        companyName: 'Development Company',
        taxCode: '0109844160',
        phone: '1900 1286',
        address: 'TP. Hồ Chí Minh',
        userType: 'dev',
        status: 'active',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      }
    }

    // Mock regular user
    if (credentials.username && credentials.password) {
      return {
        id: 'user-001',
        username: credentials.username,
        email: `${credentials.username}@example.com`,
        fullName: 'Công ty Demo TPHCM',
        companyName: 'Công ty Demo TPHCM',
        taxCode: credentials.username,
        phone: '1900 1286',
        address: 'TP. Hồ Chí Minh',
        userType: 'enterprise',
        status: 'active',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
        lastLoginAt: new Date().toISOString(),
      }
    }

    throw new Error('Tài khoản hoặc mật khẩu không đúng')
  }

  // Mock register
  static async register(data: RegisterData): Promise<User> {
    await this.delay(1500)

    // Simulate some validation
    if (data.username.length < 6) {
      throw new Error('Tài khoản phải có ít nhất 6 ký tự')
    }

    if (data.password !== data.confirmPassword) {
      throw new Error('Mật khẩu xác nhận không khớp')
    }

    // Mock successful registration
    return {
      id: `user-${Date.now()}`,
      username: data.username,
      email: data.email,
      fullName: data.fullName,
      companyName: data.fullName,
      taxCode: data.username,
      phone: data.phone,
      address: data.address,
      userType: data.accountType,
      status: 'active',
      createdAt: new Date().toISOString(),
    }
  }

  // Mock change password
  static async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await this.delay()

    if (currentPassword === newPassword) {
      throw new Error('Mật khẩu mới phải khác mật khẩu hiện tại')
    }

    if (newPassword.length < 6) {
      throw new Error('Mật khẩu mới phải có ít nhất 6 ký tự')
    }

    // Simulate success
    return
  }

  // Mock fee declarations
  static async getFeeDeclarations(): Promise<FeeDeclaration[]> {
    await this.delay()

    return [
      {
        id: 'decl-001',
        declarationNumber: 'DKP2025001',
        customsDeclarationNumber: 'HK2025001',
        companyTaxCode: '0109844160',
        companyName: 'Công ty Demo TPHCM',
        vesselName: 'MV DEMO SHIP',
        voyageNumber: 'V001',
        portCode: 'VNSGN',
        feeType: 'Phí cảng biển',
        feeAmount: 5000000,
        currency: 'VND',
        status: 'paid',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        submittedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        approvedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        paidAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        digitalSignature: {
          signed: true,
          signedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          certificateSerial: 'SN123456789',
        },
      },
      {
        id: 'decl-002',
        declarationNumber: 'DKP2025002',
        companyTaxCode: '0109844160',
        companyName: 'Công ty Demo TPHCM',
        vesselName: 'MV DEMO CARGO',
        voyageNumber: 'V002',
        portCode: 'VNSGN',
        feeType: 'Phí dịch vụ',
        feeAmount: 3200000,
        currency: 'VND',
        status: 'submitted',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        digitalSignature: {
          signed: true,
          signedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          certificateSerial: 'SN123456789',
        },
      },
      {
        id: 'decl-003',
        declarationNumber: 'DKP2025003',
        companyTaxCode: '0109844160',
        companyName: 'Công ty Demo TPHCM',
        feeType: 'Phí hạ tầng',
        feeAmount: 7500000,
        currency: 'VND',
        status: 'draft',
        createdAt: new Date().toISOString(),
        digitalSignature: {
          signed: false,
        },
      },
    ]
  }

  // Mock receipts
  static async getReceipts(): Promise<Receipt[]> {
    await this.delay()

    return [
      {
        id: 'receipt-001',
        receiptCode: 'BL2025001',
        declarationId: 'decl-001',
        amount: 5000000,
        currency: 'VND',
        paymentMethod: 'bank_transfer',
        bankName: 'Vietcombank',
        transactionId: 'VCB20250101001',
        issuedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'issued',
      },
    ]
  }

  // Mock receipt lookup
  static async lookupReceipt(receiptCode: string): Promise<Receipt | null> {
    await this.delay()

    if (receiptCode === 'BL2025001') {
      return {
        id: 'receipt-001',
        receiptCode: 'BL2025001',
        declarationId: 'decl-001',
        amount: 5000000,
        currency: 'VND',
        paymentMethod: 'bank_transfer',
        bankName: 'Vietcombank',
        transactionId: 'VCB20250101001',
        issuedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'issued',
      }
    }

    return null
  }

  // Mock file upload
  static async uploadFile(file: File): Promise<string> {
    await this.delay(2000)

    // Simulate upload and return URL
    return `/uploads/${file.name}`
  }

  // Mock system notifications
  static async getSystemNotifications() {
    await this.delay(500)

    return [
      {
        id: 'notif-001',
        title: 'Thông báo khóa tài khoản thu phí',
        content: 'Thông báo về việc khóa tài khoản thu phí đối với các doanh nghiệp không cập nhật thông tin.',
        type: 'announcement' as const,
        isActive: true,
        priority: 'high' as const,
      },
      {
        id: 'notif-002',
        title: 'Thay đổi địa chỉ email hỗ trợ',
        content: 'Địa chỉ email tiếp nhận phản hồi từ cộng đồng doanh nghiệp đã được thay đổi.',
        type: 'update' as const,
        isActive: true,
        priority: 'medium' as const,
      },
      {
        id: 'notif-003',
        title: 'Nâng cấp hệ thống định kỳ',
        content: 'Thông báo về việc bảo trì và nâng cấp hệ thống định kỳ hàng quý trong năm.',
        type: 'maintenance' as const,
        isActive: true,
        priority: 'low' as const,
      },
    ]
  }
}
