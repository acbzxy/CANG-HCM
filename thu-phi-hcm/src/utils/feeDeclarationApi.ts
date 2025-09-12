import type { FeeDeclaration, ApiResponse } from '../types'
import { sleep } from './helpers'

// API Response wrapper structure
export interface ApiResponseWrapper<T> {
  status: string
  timestamp: string
  message: string
  data: T
}

// New API response structure for tokhai-thongtin endpoint
export interface TokhaiThongtinResponse {
  id: number
  nguonTK: number
  maDoanhNghiepKhaiPhi: string
  tenDoanhNghiepKhaiPhi: string
  diaChiKhaiPhi: string
  maDoanhNghiepXNK: string
  tenDoanhNghiepXNK: string
  diaChiXNK: string
  soToKhai: string
  ngayToKhai: string
  maHaiQuan: string
  maLoaiHinh: string
  maLuuKho: string
  nuocXuatKhau: string
  maPhuongThucVC: string
  phuongTienVC: string
  maDiaDiemXepHang: string
  maDiaDiemDoHang: string
  maPhanLoaiHangHoa: string
  mucDichVC: string
  soTiepNhanKhaiPhi: string
  ngayKhaiPhi: string
  nhomLoaiPhi: string
  loaiThanhToan: string
  ghiChuKhaiPhi: string
  soThongBaoNopPhi: string
  soThongBao: string | null
  msgId: string | null
  tongTienPhi: number
  trangThaiNganHang: string
  soBienLai: string
  ngayBienLai: string
  kyHieuBienLai: string
  mauBienLai: string
  maTraCuuBienLai: string
  xemBienLai: string
  loaiHangMienPhi: string
  loaiHang: string
  trangThai: string
  trangThaiPhatHanh?: string // '00' = Mới, '01' = Bản nháp, '02' = Phát hành, '03' = Đã hủy
  idPhatHanh?: string // ID phát hành từ FPT E-Invoice
  kylan1Xml: string | null
  kylan2Xml: string | null
  chiTietList: any[]
}

// API Base URL - Updated to use the new backend API with proxy
const API_BASE_URL = '/api'
// For new CRM API, use crmApi.ts

// Fee Declaration API endpoints
const ENDPOINTS = {
  FEE_DECLARATIONS: `${API_BASE_URL}/tokhai-thongtin/ds-nphi`,
  SEARCH: `${API_BASE_URL}/tokhai-thongtin/ds-nphi`,
  STATISTICS: `${API_BASE_URL}/tokhai-thongtin/statistics`,
  NEEDING_NOTIFICATION: `${API_BASE_URL}/tokhai-thongtin/needing-notification`,
}

// Fee Declaration Status mapping from backend to frontend
export const FEE_DECLARATION_STATUS_MAP = {
  'DRAFT': 'Mới',
  'SUBMITTED': 'Đã nộp',
  'SIGNED': 'Đã ký số',
  'NOTIFICATION_RECEIVED': 'Lý thông báo',
  'RECEIPT_CREATED': 'Đã tạo biên lai thành công',
  'PAID': 'Đã thanh toán',
  'CANCELLED': 'Đã hủy',
  'REJECTED': 'Bị từ chối'
}

// Payment Method mapping
export const PAYMENT_METHOD_MAP = {
  'BANK_TRANSFER': 'Chuyển khoản ngân hàng',
  'QR_CODE': 'Thanh toán bằng mã QR',
  'ECOM': 'Thanh toán bằng tài khoản ngân hàng',
  'CASH': 'Tiền mặt'
}

// Helper function to map TokhaiThongtinResponse to FeeDeclaration
export const mapTokhaiToFeeDeclaration = (tokhai: TokhaiThongtinResponse): FeeDeclaration | null => {
  // Skip records with placeholder data
  if (tokhai.soToKhai === 'string' || tokhai.tenDoanhNghiepKhaiPhi === 'string' || tokhai.maDoanhNghiepKhaiPhi === 'string') {
    console.log('🚫 Skipping record with placeholder data:', tokhai.id, tokhai.soToKhai, tokhai.tenDoanhNghiepKhaiPhi);
    return null; // Will be filtered out
  }
  
  return {
    id: tokhai.id,
    declarationNumber: tokhai.soToKhai || 'N/A',
    companyId: 1, // Default company ID
    company: {
      id: 1,
      companyName: tokhai.tenDoanhNghiepKhaiPhi || 'N/A',
      taxCode: tokhai.maDoanhNghiepKhaiPhi || 'N/A'
    },
    vesselName: tokhai.phuongTienVC || 'N/A',
    voyageNumber: tokhai.maHaiQuan || '',
    arrivalDate: tokhai.ngayToKhai || new Date().toISOString().split('T')[0],
    departureDate: undefined,
    portOfOrigin: tokhai.maDiaDiemXepHang,
    portOfDestination: tokhai.maDiaDiemDoHang,
    grossTonnage: 0,
    netTonnage: 0,
    totalFeeAmount: tokhai.tongTienPhi || 0,
    paidAmount: tokhai.trangThaiNganHang === 'Đã thanh toán' ? (tokhai.tongTienPhi || 0) : 0,
    remainingAmount: tokhai.trangThaiNganHang === 'Đã thanh toán' ? 0 : (tokhai.tongTienPhi || 0),
    paymentStatus: tokhai.trangThaiNganHang === 'Đã thanh toán' ? 'PAID' : 'PENDING',
    declarationStatus: mapTrangThaiToDeclarationStatus(tokhai.trangThai),
    trangThaiPhatHanh: tokhai.trangThaiPhatHanh || '00', // Default to '00' (Mới)
    idPhatHanh: tokhai.idPhatHanh, // ID phát hành từ FPT E-Invoice
    dueDate: undefined,
    paymentDate: tokhai.trangThaiNganHang === 'Đã thanh toán' ? tokhai.ngayBienLai : undefined,
    notes: tokhai.ghiChuKhaiPhi || '',
    createdAt: tokhai.ngayKhaiPhi || new Date().toISOString(),
    updatedAt: tokhai.ngayBienLai || new Date().toISOString()
  }
}

// Helper function to map Vietnamese status to English declaration status
const mapTrangThaiToDeclarationStatus = (trangThai: string): 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'CANCELLED' => {
  if (!trangThai) return 'DRAFT';
  
  switch (trangThai.toLowerCase()) {
    case 'mới tạo':
    case 'mới':
    case 'draft':
    case '01':
    case 'new':
      return 'DRAFT'
    case 'đã nộp':
    case 'submitted':
    case '02':
      return 'SUBMITTED'
    case 'đã duyệt':
    case 'approved':
    case '03':
      return 'APPROVED'
    case 'bị từ chối':
    case 'rejected':
    case '04':
      return 'REJECTED'
    case 'đã hủy':
    case 'cancelled':
    case '05':
      return 'CANCELLED'
    default:
      return 'DRAFT'
  }
}

// Fee Declaration Search Parameters
export interface FeeDeclarationSearchParams {
  // Backend API parameters
  companyId?: number
  declarationNumber?: string
  vesselName?: string
  paymentStatus?: string
  declarationStatus?: string
  fromDate?: string // YYYY-MM-DD format
  toDate?: string   // YYYY-MM-DD format
  
  // Pagination and sorting
  page?: number
  size?: number
  sortBy?: string
  sortDir?: string
  
  // Legacy parameters for backward compatibility
  companyTaxCode?: string
  companyName?: string
  customsDeclarationNumber?: string
  feeType?: string
  status?: string
  paymentMethod?: string
  feeGroupCode?: string
  createdBy?: string
  signatureCode?: string
  notificationStatus?: string
  digitalSignatureSigned?: boolean
}

// Fee Declaration Create Data
export interface FeeDeclarationCreateData {
  declarationNumber: string
  customsDeclarationNumber?: string
  companyTaxCode: string
  companyName: string
  vesselName?: string
  voyageNumber?: string
  portCode?: string
  feeType: string
  feeAmount: number
  currency?: string
  paymentMethod?: string
  notificationStatus?: string
  signatureCode?: string
  hashCode1?: string
  hashCode2?: string
  feeGroupCode?: string
  createdBy?: string
  digitalSignatureSigned?: boolean
  digitalSignatureCertificateSerial?: string
}

// Fee Declaration Update Data
export interface FeeDeclarationUpdateData {
  customsDeclarationNumber?: string
  companyName?: string
  vesselName?: string
  voyageNumber?: string
  portCode?: string
  feeType?: string
  feeAmount?: number
  currency?: string
  status?: string
  paymentMethod?: string
  notificationStatus?: string
  signatureCode?: string
  hashCode1?: string
  hashCode2?: string
  feeGroupCode?: string
  digitalSignatureSigned?: boolean
  digitalSignatureCertificateSerial?: string
}

// API Response wrapper
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
 * Fee Declaration API Service
 */
export class FeeDeclarationApiService {
  
  // Helper method for API requests
  private static async makeRequest<T>(
    url: string, 
    options: RequestInit = {}
  ): Promise<T> {
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
   * Get all fee declarations with pagination
   */
  static async getAllFeeDeclarations(
    page = 0, 
    size = 10
  ): Promise<PageResponse<FeeDeclaration>> {
    try {
      // Use the new API endpoint directly
      const url = `${API_BASE_URL}/tokhai-thongtin/ds-nphi`
      console.log('Fetching data from:', url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const responseData: ApiResponseWrapper<TokhaiThongtinResponse[]> = await response.json()
      console.log('Raw API response:', responseData)
      
      // Extract data from the wrapped response
      const data: TokhaiThongtinResponse[] = responseData.data || []
      console.log('Extracted data:', data)
      
      // Map the new API response to FeeDeclaration format and filter out nulls
      const mappedData = data.map(mapTokhaiToFeeDeclaration).filter(item => item !== null)
      console.log('🔄 Mapped data length:', mappedData.length)
      console.log('🔄 Sample mapped data:', mappedData.slice(0, 2))
      
      // Create a PageResponse structure
      const pageResponse: PageResponse<FeeDeclaration> = {
        content: mappedData,
        pageable: {
          pageNumber: page,
          pageSize: size,
          sort: { sorted: true, unsorted: false, empty: false }
        },
        totalElements: mappedData.length,
        totalPages: Math.ceil(mappedData.length / size),
        last: true,
        first: true,
        numberOfElements: mappedData.length,
        size: size,
        number: page,
        sort: { sorted: true, unsorted: false, empty: false },
        empty: mappedData.length === 0
      }
      
      console.log('Mapped data:', pageResponse)
      return pageResponse
      
    } catch (error) {
      console.error('Error fetching fee declarations:', error)
      throw error
    }
  }

  /**
   * Search fee declarations with filters
   */
  static async searchFeeDeclarations(
    searchParams: FeeDeclarationSearchParams
  ): Promise<PageResponse<FeeDeclaration>> {
    try {
      // For now, use the same endpoint as getAllFeeDeclarations
      // In the future, you can implement search parameters if the API supports them
      const url = `${API_BASE_URL}/tokhai-thongtin/ds-nphi`
      console.log('Searching with params:', searchParams)
      console.log('Fetching data from:', url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const responseData: ApiResponseWrapper<TokhaiThongtinResponse[]> = await response.json()
      console.log('Raw API response for search:', responseData)
      
      // Extract data from the wrapped response
      const data: TokhaiThongtinResponse[] = responseData.data || []
      console.log('Extracted data for search:', data)
      
      // Apply client-side filtering if needed
      let filteredData = data
      console.log('🔄 Starting with', data.length, 'records');
      
      // Filter by date range if provided - DISABLED FOR DEBUG
      // if (searchParams.fromDate || searchParams.toDate) {
      //   console.log('🔄 Filtering by date range:', searchParams.fromDate, 'to', searchParams.toDate);
      //   filteredData = filteredData.filter(item => {
      //     const itemDate = new Date(item.ngayToKhai)
      //     const fromDate = searchParams.fromDate ? new Date(searchParams.fromDate) : null
      //     const toDate = searchParams.toDate ? new Date(searchParams.toDate) : null
      //     
      //     if (fromDate && itemDate < fromDate) return false
      //     if (toDate && itemDate > toDate) return false
      //     return true
      //   })
      //   console.log('🔄 After date filtering:', filteredData.length, 'records remain');
      // }
      
      // Filter by company tax code if provided - DISABLED FOR DEBUG
      // if (searchParams.companyTaxCode) {
      //   console.log('🔄 Filtering by company tax code:', searchParams.companyTaxCode);
      //   filteredData = filteredData.filter(item => 
      //     item.maDoanhNghiepKhaiPhi.includes(searchParams.companyTaxCode!)
      //   )
      //   console.log('🔄 After company tax code filtering:', filteredData.length, 'records remain');
      // }
      
      // Filter by declaration number if provided - DISABLED FOR DEBUG
      // if (searchParams.declarationNumber) {
      //   console.log('🔄 Filtering by declaration number:', searchParams.declarationNumber);
      //   filteredData = filteredData.filter(item => 
      //     item.soToKhai.includes(searchParams.declarationNumber!)
      //   )
      //   console.log('🔄 After declaration number filtering:', filteredData.length, 'records remain');
      // }
      
      // Map the filtered data to FeeDeclaration format and filter out nulls
      console.log('🔄 Mapping', filteredData.length, 'records...');
      const mappedData = filteredData.map(mapTokhaiToFeeDeclaration).filter(item => item !== null)
      console.log('🔄 Search mapped data length:', mappedData.length)
      console.log('🔄 Search sample mapped data:', mappedData.slice(0, 2))
      
      // Create a PageResponse structure
      const pageResponse: PageResponse<FeeDeclaration> = {
        content: mappedData,
        pageable: {
          pageNumber: searchParams.page || 0,
          pageSize: searchParams.size || 10,
          sort: { sorted: true, unsorted: false, empty: false }
        },
        totalElements: mappedData.length,
        totalPages: Math.ceil(mappedData.length / (searchParams.size || 10)),
        last: true,
        first: true,
        numberOfElements: mappedData.length,
        size: searchParams.size || 10,
        number: searchParams.page || 0,
        sort: { sorted: true, unsorted: false, empty: false },
        empty: mappedData.length === 0
      }
      
      console.log('Filtered and mapped data:', pageResponse)
      return pageResponse
      
    } catch (error) {
      console.error('Error searching fee declarations:', error)
      throw error
    }
  }

  /**
   * Get fee declaration by ID
   */
  static async getFeeDeclarationById(id: number): Promise<TokhaiThongtinResponse> {
    try {
      const url = `${API_BASE_URL}/tokhai-thongtin/${id}`
      console.log('Fetching fee declaration by ID:', id, 'from:', url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const responseData: ApiResponseWrapper<TokhaiThongtinResponse> = await response.json()
      console.log('Fee declaration by ID response:', responseData)
      
      if (responseData.data) {
        return responseData.data
      } else {
        throw new Error('No data in response')
      }
      
    } catch (error) {
      console.error('Error fetching fee declaration by ID:', error)
      throw error
    }
  }

  /**
   * Get fee declaration by declaration number
   */
  static async getFeeDeclarationByDeclarationNumber(
    declarationNumber: string
  ): Promise<ApiResponse<FeeDeclaration>> {
    const url = `${ENDPOINTS.FEE_DECLARATIONS}/declaration-number/${encodeURIComponent(declarationNumber)}`
    return this.makeRequest(url)
  }

  /**
   * Get fee declarations by company tax code
   */
  static async getFeeDeclarationsByCompanyTaxCode(
    companyTaxCode: string,
    page = 0,
    size = 10,
    sortBy = 'createdAt',
    sortDir = 'desc'
  ): Promise<ApiResponse<PageResponse<FeeDeclaration>>> {
    const url = `${ENDPOINTS.FEE_DECLARATIONS}/company/${encodeURIComponent(companyTaxCode)}?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`
    return this.makeRequest(url)
  }

  /**
   * Get fee declarations by status
   */
  static async getFeeDeclarationsByStatus(
    status: string,
    page = 0,
    size = 10,
    sortBy = 'createdAt',
    sortDir = 'desc'
  ): Promise<ApiResponse<PageResponse<FeeDeclaration>>> {
    const url = `${ENDPOINTS.FEE_DECLARATIONS}/status/${status}?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`
    return this.makeRequest(url)
  }

  /**
   * Create a new fee declaration
   */
  static async createFeeDeclaration(
    createData: FeeDeclarationCreateData
  ): Promise<ApiResponse<FeeDeclaration>> {
    return this.makeRequest(ENDPOINTS.FEE_DECLARATIONS, {
      method: 'POST',
      body: JSON.stringify(createData)
    })
  }

  /**
   * Update an existing fee declaration
   */
  static async updateFeeDeclaration(
    id: number,
    updateData: any
  ): Promise<ApiResponse<FeeDeclaration>> {
    try {
      const url = `${ENDPOINTS.FEE_DECLARATIONS}/${id}`
      console.log('Updating fee declaration:', id, updateData);
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // Backend returns FeeDeclarationDto directly, not wrapped in ApiResponse
      const feeDeclarationData = await response.json();
      console.log('Fee declaration updated:', feeDeclarationData);

      // Wrap in ApiResponse format for frontend consistency
      const result: ApiResponse<FeeDeclaration> = {
        success: true,
        message: 'Fee declaration updated successfully',
        data: feeDeclarationData,
        timestamp: new Date().toISOString()
      };

      return result;
    } catch (error) {
      console.error('Update fee declaration failed:', error);
      throw error;
    }
  }

  /**
   * Update fee declaration status
   */
  static async updateFeeDeclarationStatus(
    id: number,
    status: string
  ): Promise<ApiResponse<FeeDeclaration>> {
    const url = `${ENDPOINTS.FEE_DECLARATIONS}/${id}/status?status=${status}`
    return this.makeRequest(url, {
      method: 'PATCH'
    })
  }

  /**
   * Sign fee declaration digitally - ĐÃ XÓA, sẽ dùng CrmApiService
   */
  static async signFeeDeclaration(
    _id: number,
    _certificateSerial: string
  ): Promise<ApiResponse<FeeDeclaration>> {
    // TODO: Chuyển sang sử dụng CrmApiService.kyTenSoToKhai() cho trang khai báo nộp phí
    throw new Error('Method này đã deprecated, sử dụng CrmApiService.kyTenSoToKhai() thay thế')
  }

  /**
   * Delete a fee declaration
   */
  static async deleteFeeDeclaration(id: number): Promise<ApiResponse<void>> {
    const url = `${ENDPOINTS.FEE_DECLARATIONS}/${id}`
    return this.makeRequest(url, {
      method: 'DELETE'
    })
  }

  /**
   * Get fee declaration statistics
   */
  static async getFeeDeclarationStatistics(): Promise<ApiResponse<Record<string, any>>> {
    return this.makeRequest(ENDPOINTS.STATISTICS)
  }

  /**
   * Get fee declarations needing notification
   */
  static async getFeeDeclarationsNeedingNotification(): Promise<ApiResponse<FeeDeclaration[]>> {
    return this.makeRequest(ENDPOINTS.NEEDING_NOTIFICATION)
  }
}

// Legacy interface for mock data
interface LegacyFeeDeclaration {
  id: string;
  kyso: string;
  hash1: string;
  tkNopPhi: string;
  ngayTKNP: string;
  loaiToKhai: string;
  tkHaiQuan: string;
  doanhNghiep: string;
  trangThai: string;
  thongBao: string;
  hash2: string;
  tongTien: number;
}

// Mock API fallback (for development when backend is not available)
export class MockFeeDeclarationApiService {
  
  private static async delay(ms = 1000): Promise<void> {
    await sleep(ms)
  }
  
  // Convert legacy mock data to FeeDeclaration format
  private static convertLegacyToFeeDeclaration(legacy: LegacyFeeDeclaration): FeeDeclaration {
    return {
      id: parseInt(legacy.id),
      declarationNumber: legacy.tkNopPhi,
      companyId: 1,
      company: {
        id: 1,
        companyName: legacy.doanhNghiep.split('-')[1] || legacy.doanhNghiep,
        taxCode: legacy.doanhNghiep.split('-')[0] || '0123456789'
      },
      vesselName: 'MV Demo Vessel',
      voyageNumber: legacy.tkHaiQuan,
      arrivalDate: legacy.ngayTKNP.split('/').reverse().join('-'),
      grossTonnage: 15000,
      netTonnage: 12000,
      totalFeeAmount: legacy.tongTien,
      paidAmount: legacy.trangThai === 'Đã thanh toán' ? legacy.tongTien : 0,
      remainingAmount: legacy.trangThai === 'Đã thanh toán' ? 0 : legacy.tongTien,
      paymentStatus: legacy.trangThai === 'Đã thanh toán' ? 'PAID' : 'PENDING',
      declarationStatus: legacy.trangThai === 'Mới' ? 'DRAFT' : 'SUBMITTED',
      notes: legacy.thongBao,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }

  private static generateMockData(): LegacyFeeDeclaration[] {
    return [
      {
        id: '1',
        kyso: 'K001',
        hash1: 'A',
        tkNopPhi: 'Web-210817242026',
        ngayTKNP: '17/08/2021',
        loaiToKhai: '101 - hàng đông lại',
        tkHaiQuan: '1384376990463',
        doanhNghiep: '0100439415-Công Ty TNHH Vinachimex Việt Nam',
        trangThai: 'Lý thông báo',
        thongBao: 'Có thông báo',
        hash2: 'H1',
        tongTien: 750000
      },
      {
        id: '2',
        kyso: 'K002',
        hash1: 'B',
        tkNopPhi: 'Web-210817428904',
        ngayTKNP: '17/08/2021',
        loaiToKhai: '100 - hàng container',
        tkHaiQuan: '1208739190588',
        doanhNghiep: '0301245905-Công Ty TNHH Ánh Long và Dch vụ',
        trangThai: 'Lý thông báo',
        thongBao: 'Có thông báo',
        hash2: 'H2',
        tongTien: 750000
      },
      {
        id: '3',
        kyso: 'K003',
        hash1: 'C',
        tkNopPhi: 'Web-210817420403',
        ngayTKNP: '17/08/2021',
        loaiToKhai: '100 - hàng container',
        tkHaiQuan: '1208739190449',
        doanhNghiep: '0301245905-Công Ty TNHH Ánh Long và Dch vụ',
        trangThai: 'Lý thông báo',
        thongBao: 'Có thông báo',
        hash2: 'H3',
        tongTien: 1000000
      },
      {
        id: '4',
        kyso: 'K004',
        hash1: 'D',
        tkNopPhi: 'Web-210817396402',
        ngayTKNP: '17/08/2021',
        loaiToKhai: '100 - hàng container',
        tkHaiQuan: '1405231482593',
        doanhNghiep: '5905002089-Công Ty Cổ Phần DAP SG 7 - Vinachem',
        trangThai: 'Mới',
        thongBao: 'Có thông báo',
        hash2: 'H4',
        tongTien: 750000
      }
    ]
  }

  static async getAllFeeDeclarations(): Promise<ApiResponse<PageResponse<FeeDeclaration>>> {
    await this.delay()
    
    const legacyData = this.generateMockData()
    const mockData = legacyData.map(item => this.convertLegacyToFeeDeclaration(item))
    const pageResponse: PageResponse<FeeDeclaration> = {
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
      message: 'Fee declarations retrieved successfully',
      data: pageResponse,
      timestamp: new Date().toISOString()
    }
  }

  static async searchFeeDeclarations(
    searchParams: FeeDeclarationSearchParams
  ): Promise<ApiResponse<PageResponse<FeeDeclaration>>> {
    await this.delay()
    
    let legacyData = this.generateMockData()
    
    // Apply simple filters
    if (searchParams.companyTaxCode) {
      legacyData = legacyData.filter(item => 
        item.doanhNghiep.includes(searchParams.companyTaxCode!)
      )
    }
    
    if (searchParams.feeType) {
      legacyData = legacyData.filter(item => 
        item.loaiToKhai.includes(searchParams.feeType!)
      )
    }

    const mockData = legacyData.map(item => this.convertLegacyToFeeDeclaration(item))
    const pageResponse: PageResponse<FeeDeclaration> = {
      content: mockData,
      pageable: {
        pageNumber: searchParams.page || 0,
        pageSize: searchParams.size || 10,
        sort: { sorted: true, unsorted: false, empty: false }
      },
      totalElements: mockData.length,
      totalPages: Math.ceil(mockData.length / (searchParams.size || 10)),
      last: true,
      first: true,
      numberOfElements: mockData.length,
      size: searchParams.size || 10,
      number: searchParams.page || 0,
      sort: { sorted: true, unsorted: false, empty: false },
      empty: mockData.length === 0
    }

    return {
      success: true,
      message: 'Search completed successfully',
      data: pageResponse,
      timestamp: new Date().toISOString()
    }
  }
}

// Debug service that logs everything
export class DebugFeeDeclarationService {
  static async getAllFeeDeclarations(): Promise<any> {
    console.log('DebugFeeDeclarationService.getAllFeeDeclarations called');
    try {
      const result = await MockFeeDeclarationApiService.getAllFeeDeclarations();
      console.log('Mock service result:', result);
      return result;
    } catch (error) {
      console.error('Mock service error:', error);
      throw error;
    }
  }

  static async searchFeeDeclarations(searchParams: FeeDeclarationSearchParams): Promise<any> {
    console.log('DebugFeeDeclarationService.searchFeeDeclarations called with:', searchParams);
    try {
      // First try the real API
      try {
        console.log('Trying real API...');
        const realResult = await FeeDeclarationApiService.searchFeeDeclarations(searchParams);
        console.log('Real API result:', realResult);
        return realResult;
      } catch (apiError) {
        console.log('Real API failed, trying mock:', apiError);
        const mockResult = await MockFeeDeclarationApiService.searchFeeDeclarations(searchParams);
        console.log('Mock service result:', mockResult);
        return mockResult;
      }
    } catch (error) {
      console.error('All services failed:', error);
      throw error;
    }
  }
}

// Export the service to use based on environment
// Temporarily use mock service for testing
export const FeeDeclarationService = FeeDeclarationApiService;
