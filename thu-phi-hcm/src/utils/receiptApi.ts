import type { ApiResponse } from '../types'
import { sleep } from './helpers'

// API Base URL
const API_BASE_URL = 'http://localhost:8080/api'

// Receipt API endpoints
const ENDPOINTS = {
  RECEIPTS: `${API_BASE_URL}/receipts`,
  RECEIPT_BY_CODE: `${API_BASE_URL}/receipts/code`,
  RECEIPT_BY_FEE_DECLARATION: `${API_BASE_URL}/receipts/fee-declaration`,
  ISSUE_RECEIPT: `${API_BASE_URL}/receipts/{id}/issue`
}

// Receipt interfaces
export interface Receipt {
  id?: number
  receiptCode: string
  receiptNumber: string
  feeDeclarationId: number
  companyId: number
  payerName: string
  payerEmail: string
  payerIdNumber: string
  payerPhone?: string
  receiptDate: string
  paymentMethod: 'BANK_TRANSFER' | 'CASH' | 'QR_CODE' | 'ECOMMERCE'
  totalAmount: number
  status: 'DRAFT' | 'ISSUED' | 'CANCELLED' | 'PAID'
  issuedDate?: string
  storageLocationCode?: string
  stbNumber?: string
  declarationDate?: string
  customsDeclarationNumber?: string
  customsDeclarationDate?: string
  notes?: string
  samePayment?: boolean
  containerList?: boolean
  commonContainerDeclaration?: boolean
  attached?: boolean
  receiptDetails?: ReceiptDetail[]
  createdAt?: string
  updatedAt?: string
}

export interface ReceiptDetail {
  id?: number
  receiptId?: number
  content: string
  unit?: string
  quantity: number
  unitPrice: number
  totalAmount: number
  notes?: string
}

export interface ReceiptSearchParams {
  companyId?: number
  receiptCode?: string
  receiptNumber?: string
  status?: string
  paymentMethod?: string
  fromDate?: string
  toDate?: string
  page?: number
  size?: number
  sortBy?: string
  sortDir?: string
}

export interface PageResponse<T> {
  content: T[]
  pageable: {
    pageNumber: number
    pageSize: number
    sort: {
      sorted: boolean
      unsorted: boolean
      empty: boolean
    }
  }
  totalElements: number
  totalPages: number
  last: boolean
  first: boolean
  numberOfElements: number
  size: number
  number: number
  sort: {
    sorted: boolean
    unsorted: boolean
    empty: boolean
  }
  empty: boolean
}

/**
 * Receipt API Service
 */
export class ReceiptApiService {
  
  // Helper method for API requests
  private static async makeRequest<T>(
    url: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const defaultOptions: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }

      const response = await fetch(url, { ...defaultOptions, ...options })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  /**
   * Get all receipts with pagination
   */
  static async getAllReceipts(
    page = 0, 
    size = 10, 
    sortBy = 'receiptDate', 
    sortDir = 'desc'
  ): Promise<ApiResponse<PageResponse<Receipt>>> {
    const url = `${ENDPOINTS.RECEIPTS}?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`
    return this.makeRequest(url)
  }

  static async getReceiptsByFeeDeclarationId(feeDeclarationId: number): Promise<ApiResponse<Receipt[]>> {
    try {
      const response = await fetch(`${ENDPOINTS.RECEIPTS}/by-fee-declaration/${feeDeclarationId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          // No receipts found for this fee declaration
          return {
            success: true,
            message: 'No receipts found',
            data: [],
            timestamp: new Date().toISOString()
          };
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const receipts = await response.json();
      return {
        success: true,
        message: 'Receipts retrieved successfully',
        data: receipts,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting receipts by fee declaration ID:', error);
      throw error;
    }
  }

  /**
   * Search receipts with filters
   */
  static async searchReceipts(
    searchParams: ReceiptSearchParams
  ): Promise<ApiResponse<PageResponse<Receipt>>> {
    // Build query parameters
    const queryParams = new URLSearchParams()
    
    if (searchParams.companyId) queryParams.append('companyId', searchParams.companyId.toString())
    if (searchParams.receiptCode) queryParams.append('receiptCode', searchParams.receiptCode)
    if (searchParams.receiptNumber) queryParams.append('receiptNumber', searchParams.receiptNumber)
    if (searchParams.status) queryParams.append('status', searchParams.status)
    if (searchParams.paymentMethod) queryParams.append('paymentMethod', searchParams.paymentMethod)
    if (searchParams.fromDate) queryParams.append('fromDate', searchParams.fromDate)
    if (searchParams.toDate) queryParams.append('toDate', searchParams.toDate)
    if (searchParams.page !== undefined) queryParams.append('page', searchParams.page.toString())
    if (searchParams.size !== undefined) queryParams.append('size', searchParams.size.toString())
    if (searchParams.sortBy) queryParams.append('sortBy', searchParams.sortBy)
    if (searchParams.sortDir) queryParams.append('sortDir', searchParams.sortDir)
    
    const url = `${ENDPOINTS.RECEIPTS}?${queryParams.toString()}`
    return this.makeRequest(url)
  }

  /**
   * Get receipt by ID
   */
  static async getReceiptById(id: number): Promise<ApiResponse<Receipt>> {
    const url = `${ENDPOINTS.RECEIPTS}/${id}`
    return this.makeRequest(url)
  }

  /**
   * Get receipt by code
   */
  static async getReceiptByCode(receiptCode: string): Promise<ApiResponse<Receipt>> {
    const url = `${ENDPOINTS.RECEIPT_BY_CODE}/${receiptCode}`
    return this.makeRequest(url)
  }

  /**
   * Get receipts by fee declaration
   */
  static async getReceiptsByFeeDeclaration(feeDeclarationId: number): Promise<ApiResponse<Receipt[]>> {
    const url = `${ENDPOINTS.RECEIPT_BY_FEE_DECLARATION}/${feeDeclarationId}`
    return this.makeRequest(url)
  }

  /**
   * Create new receipt
   */
  static async createReceipt(receipt: Receipt): Promise<ApiResponse<Receipt>> {
    console.log('=== ReceiptApiService.createReceipt called ===');
    console.log('URL:', ENDPOINTS.RECEIPTS);
    console.log('Receipt data:', receipt);
    
    try {
      const response = await fetch(ENDPOINTS.RECEIPTS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(receipt)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // Backend returns ReceiptDto directly, not wrapped in ApiResponse
      const receiptData = await response.json();
      console.log('Raw API response:', receiptData);

      // Wrap in ApiResponse format for frontend consistency
      const result: ApiResponse<Receipt> = {
        success: true,
        message: 'Receipt created successfully',
        data: receiptData,
        timestamp: new Date().toISOString()
      };

      console.log('Wrapped response:', result);
      return result;
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  }

  /**
   * Update receipt
   */
  static async updateReceipt(id: number, receipt: Receipt): Promise<ApiResponse<Receipt>> {
    const url = `${ENDPOINTS.RECEIPTS}/${id}`
    return this.makeRequest(url, {
      method: 'PUT',
      body: JSON.stringify(receipt)
    })
  }

  /**
   * Issue receipt (change status from DRAFT to ISSUED)
   */
  static async issueReceipt(id: number): Promise<ApiResponse<Receipt>> {
    try {
      const url = `${ENDPOINTS.RECEIPTS}/${id}/issue`
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // Backend returns ReceiptDto directly, not wrapped in ApiResponse
      const receiptData = await response.json();

      // Wrap in ApiResponse format for frontend consistency
      const result: ApiResponse<Receipt> = {
        success: true,
        message: 'Receipt issued successfully',
        data: receiptData,
        timestamp: new Date().toISOString()
      };

      return result;
    } catch (error) {
      console.error('Issue receipt failed:', error);
      throw error;
    }
  }

  /**
   * Delete receipt
   */
  static async deleteReceipt(id: number): Promise<ApiResponse<void>> {
    const url = `${ENDPOINTS.RECEIPTS}/${id}`
    return this.makeRequest(url, {
      method: 'DELETE'
    })
  }
}

// Mock API fallback (for development when backend is not available)
export class MockReceiptApiService {
  
  private static async delay(ms = 1000): Promise<void> {
    await sleep(ms)
  }

  private static generateMockData(): Receipt[] {
    return [
      {
        id: 1,
        receiptCode: 'BL2024001',
        receiptNumber: '0000001',
        feeDeclarationId: 1,
        companyId: 1,
        payerName: 'Nguyễn Văn A',
        payerEmail: 'nguyenvana@saigonshipping.com',
        payerIdNumber: '123456789',
        payerPhone: '0901234567',
        receiptDate: '2024-01-20',
        paymentMethod: 'BANK_TRANSFER',
        totalAmount: 2800000,
        status: 'ISSUED',
        issuedDate: '2024-01-20T10:30:00',
        storageLocationCode: 'Q214A81',
        stbNumber: '2149180185649',
        declarationDate: '2024-01-15',
        customsDeclarationNumber: '1357487692765',
        customsDeclarationDate: '2024-01-15',
        notes: 'Biên lai cho tờ khai TK2024001',
        samePayment: false,
        containerList: true,
        commonContainerDeclaration: false,
        attached: false,
        receiptDetails: [
          {
            id: 1,
            content: 'Phí cảng vụ cho tàu MV Sài Gòn Star',
            unit: 'Tàu',
            quantity: 1,
            unitPrice: 500000,
            totalAmount: 500000,
            notes: 'Phí cảng vụ'
          },
          {
            id: 2,
            content: 'Phí hoa tiêu dẫn tàu vào cảng',
            unit: 'Chuyến',
            quantity: 2,
            unitPrice: 800000,
            totalAmount: 1600000,
            notes: 'Phí hoa tiêu'
          },
          {
            id: 3,
            content: 'Phí lai dắt tàu',
            unit: 'Giờ',
            quantity: 1,
            unitPrice: 700000,
            totalAmount: 700000,
            notes: 'Phí lai dắt'
          }
        ],
        createdAt: '2024-01-20T08:00:00',
        updatedAt: '2024-01-20T10:30:00'
      },
      {
        id: 2,
        receiptCode: 'BL2024002',
        receiptNumber: '0000002',
        feeDeclarationId: 2,
        companyId: 2,
        payerName: 'Trần Thị B',
        payerEmail: 'tranthib@sealogistics.vn',
        payerIdNumber: '987654321',
        payerPhone: '0912345678',
        receiptDate: '2024-01-21',
        paymentMethod: 'BANK_TRANSFER',
        totalAmount: 3500000,
        status: 'DRAFT',
        storageLocationCode: 'Q315B92',
        stbNumber: '3149280285750',
        declarationDate: '2024-01-19',
        customsDeclarationNumber: '2468579302876',
        customsDeclarationDate: '2024-01-19',
        notes: 'Biên lai cho tờ khai TK2024002 - Bản nháp',
        samePayment: true,
        containerList: false,
        commonContainerDeclaration: true,
        attached: true,
        receiptDetails: [],
        createdAt: '2024-01-21T09:00:00',
        updatedAt: '2024-01-21T09:00:00'
      }
    ]
  }

  static async getAllReceipts(): Promise<ApiResponse<PageResponse<Receipt>>> {
    await this.delay()
    
    const mockData = this.generateMockData()
    const pageResponse: PageResponse<Receipt> = {
      content: mockData,
      pageable: {
        pageNumber: 0,
        pageSize: 10,
        sort: { sorted: true, unsorted: false, empty: false }
      },
      totalElements: mockData.length,
      totalPages: 1,
      last: true,
      first: true,
      numberOfElements: mockData.length,
      size: 10,
      number: 0,
      sort: { sorted: true, unsorted: false, empty: false },
      empty: false
    }

    return {
      success: true,
      message: 'Receipts retrieved successfully',
      data: pageResponse,
      timestamp: new Date().toISOString()
    }
  }

  static async createReceipt(receipt: Receipt): Promise<ApiResponse<Receipt>> {
    await this.delay(500)
    
    const newReceipt: Receipt = {
      ...receipt,
      id: Date.now(), // Simple ID generation for mock
      receiptNumber: receipt.receiptNumber || '0000003',
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return {
      success: true,
      message: 'Receipt created successfully',
      data: newReceipt,
      timestamp: new Date().toISOString()
    }
  }

  static async issueReceipt(id: number): Promise<ApiResponse<Receipt>> {
    await this.delay(500)
    
    const mockData = this.generateMockData()
    const receipt = mockData.find(r => r.id === id)
    
    if (!receipt) {
      throw new Error('Receipt not found')
    }

    const issuedReceipt: Receipt = {
      ...receipt,
      status: 'ISSUED',
      issuedDate: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return {
      success: true,
      message: 'Receipt issued successfully',
      data: issuedReceipt,
      timestamp: new Date().toISOString()
    }
  }
}

// Export the service to use based on environment
// Switch to real API service now that backend is ready
export const ReceiptService = ReceiptApiService;
