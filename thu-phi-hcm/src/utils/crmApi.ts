import type { ApiResponse } from '../types'

// CRM API Base URL - backend server
const CRM_API_BASE_URL = 'http://10.14.122.24:8081/PHT_BE'

// CRM API endpoints - CẬP NHẬT từ PHT_BE backend
const CRM_ENDPOINTS = {
  // === TỜ KHAI THÔNG TIN CHÍNH ===
  TOKHAI_THONGTIN: `${CRM_API_BASE_URL}/api/tokhai-thongtin`,
  TOKHAI_THONGTIN_ALL: `${CRM_API_BASE_URL}/api/tokhai-thongtin/all`,
  TOKHAI_THONGTIN_CREATE: `${CRM_API_BASE_URL}/api/tokhai-thongtin/create`,
  TOKHAI_THONGTIN_UPDATE_STATUS: `${CRM_API_BASE_URL}/api/tokhai-thongtin/update-status`,
  
  // === CHỮ KÝ SỐ ===
  CHU_KY_SO_KY_SO: `${CRM_API_BASE_URL}/api/chu-ky-so/ky-so`,
  CHU_KY_SO_DANH_SACH: `${CRM_API_BASE_URL}/api/chu-ky-so/danh-sach`,
  
  // === XML GENERATION ===
  XML_GENERATE: `${CRM_API_BASE_URL}/api/xml-generate`,
  
  // === DOANH NGHIỆP / COMPANIES ===
  COMPANIES: `${CRM_API_BASE_URL}/api/companies`,
  COMPANIES_ALL: `${CRM_API_BASE_URL}/api/companies/all`,
  COMPANIES_CREATE: `${CRM_API_BASE_URL}/api/companies/create`,
  COMPANIES_UPDATE: `${CRM_API_BASE_URL}/api/companies/update`,
  COMPANIES_DELETE: `${CRM_API_BASE_URL}/api/companies/delete`,
  COMPANIES_SEARCH: `${CRM_API_BASE_URL}/api/companies/search`,
  
  // === THÔNG BÁO PHÍ ===
  THONG_BAO_PHI: `${CRM_API_BASE_URL}/api/thong-bao-phi`,
  THONG_BAO_PHI_ALL: `${CRM_API_BASE_URL}/api/thong-bao-phi/all`,
  THONG_BAO_PHI_CREATE: `${CRM_API_BASE_URL}/api/thong-bao-phi/create`,
  THONG_BAO_PHI_UPDATE: `${CRM_API_BASE_URL}/api/thong-bao-phi/update`,
  TOKHAI_THONGTIN_NOTIFICATION: `${CRM_API_BASE_URL}/api/tokhai-thongtin/notification`,
  
  // === BIÊN LAI / RECEIPTS ===
  BIEN_LAI: `${CRM_API_BASE_URL}/api/bien-lai`,
  BIEN_LAI_ALL: `${CRM_API_BASE_URL}/api/bien-lai/all`,
  BIEN_LAI_CREATE: `${CRM_API_BASE_URL}/api/bien-lai/create`,
  BIEN_LAI_UPDATE: `${CRM_API_BASE_URL}/api/bien-lai/update`,
  BIEN_LAI_DELETE: `${CRM_API_BASE_URL}/api/bien-lai/delete`,
  
  // === THANH TOÁN / PAYMENTS ===
  PAYMENTS: `${CRM_API_BASE_URL}/api/payments`,
  PAYMENTS_ALL: `${CRM_API_BASE_URL}/api/payments/all`,
  PAYMENTS_CREATE: `${CRM_API_BASE_URL}/api/payments/create`,
  PAYMENTS_UPDATE_STATUS: `${CRM_API_BASE_URL}/api/payments/update-status`,
  PAYMENTS_SEARCH: `${CRM_API_BASE_URL}/api/payments/search`,
  
  // === LOẠI PHÍ / FEE TYPES ===
  FEE_TYPES: `${CRM_API_BASE_URL}/api/fee-types`,
  FEE_TYPES_ALL: `${CRM_API_BASE_URL}/api/fee-types/all`,
  FEE_TYPES_CREATE: `${CRM_API_BASE_URL}/api/fee-types/create`,
  
  // === LOẠI BIỂU CƯỚC / TARIFF TYPES ===
  TARIFF_TYPES: `${CRM_API_BASE_URL}/api/loai-bieu-cuoc`,
  TARIFF_TYPES_ALL: `${CRM_API_BASE_URL}/api/loai-bieu-cuoc/all`,
  TARIFF_TYPES_CREATE: `${CRM_API_BASE_URL}/api/loai-bieu-cuoc/create`,
  TARIFF_TYPES_UPDATE: `${CRM_API_BASE_URL}/api/loai-bieu-cuoc/update`,
  TARIFF_TYPES_DELETE: `${CRM_API_BASE_URL}/api/loai-bieu-cuoc/delete`,
  
  // === BIỂU CƯỚC / TARIFFS ===
  TARIFFS: `${CRM_API_BASE_URL}/api/bieu-cuoc`,
  TARIFFS_ALL: `${CRM_API_BASE_URL}/api/bieu-cuoc/all`,
  TARIFFS_CREATE: `${CRM_API_BASE_URL}/api/bieu-cuoc/create`,
  TARIFFS_UPDATE: `${CRM_API_BASE_URL}/api/bieu-cuoc/update`,
  TARIFFS_DELETE: `${CRM_API_BASE_URL}/api/bieu-cuoc/delete`,
  
  // === CHỮ KÝ SỐ / DIGITAL SIGNATURE ===
  DIGITAL_SIGNATURE: `${CRM_API_BASE_URL}/api/digital-signature`,
  DIGITAL_SIGNATURE_SIGN: `${CRM_API_BASE_URL}/api/digital-signature/sign`,
  DIGITAL_SIGNATURE_VERIFY: `${CRM_API_BASE_URL}/api/digital-signature/verify`,
  
  // === BÁO CÁO / REPORTS ===
  REPORTS: `${CRM_API_BASE_URL}/api/reports`,
  REPORTS_DAILY: `${CRM_API_BASE_URL}/api/reports/daily`,
  REPORTS_SUMMARY: `${CRM_API_BASE_URL}/api/reports/summary`,
  REPORTS_EXPORT: `${CRM_API_BASE_URL}/api/reports/export`,
  
  // === XÁC THỰC / AUTHENTICATION ===
  AUTH_LOGIN: `${CRM_API_BASE_URL}/api/auth/login`,
  AUTH_LOGOUT: `${CRM_API_BASE_URL}/api/auth/logout`,
  AUTH_REFRESH: `${CRM_API_BASE_URL}/api/auth/refresh-token`,
  AUTH_VALIDATE: `${CRM_API_BASE_URL}/api/auth/validate`,
  
  // === NGƯỜI DÙNG / USER MANAGEMENT ===
  USERS: `${CRM_API_BASE_URL}/api/users`,
  USERS_ALL: `${CRM_API_BASE_URL}/api/users/all`,
  USERS_CREATE: `${CRM_API_BASE_URL}/api/users/create`,
  USERS_UPDATE: `${CRM_API_BASE_URL}/api/users/update`,
  USERS_DELETE: `${CRM_API_BASE_URL}/api/users/delete`,
  USERS_PROFILE: `${CRM_API_BASE_URL}/api/users/profile`,
  
  // === LEGACY COMPATIBILITY ===
  FEE_DECLARATIONS: `${CRM_API_BASE_URL}/api/tokhai-thongtin/all`, // redirect to real endpoint
  RECEIPTS: `${CRM_API_BASE_URL}/api/bien-lai/all`, // redirect to real endpoint
}

// Request headers helper
const getHeaders = (includeAuth = true): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
  
  // Add authorization token if available
  if (includeAuth) {
    const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken')
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }
  
  return headers
}

// Generic API request helper - Updated for PHT_BE API format
async function makeApiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const defaultOptions: RequestInit = {
      headers: getHeaders(),
      ...options
    }

    console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`)
    console.log('📤 Request options:', defaultOptions)

    const response = await fetch(url, defaultOptions)
    
    console.log(`📡 Response status: ${response.status}`)

    // Parse JSON response
    const data = await response.json()
    
    if (!response.ok) {
      // Handle PHT_BE API error response (400, 500)
      console.error('❌ PHT_BE API Error:', {
        status: data.status,
        message: data.message,
        requestId: data.requestId,
        errors: data.errors,
        error: data.error
      })
      
      // Create error with PHT_BE response data
      const error = new Error(data.message || `HTTP error! status: ${response.status}`)
      ;(error as any).response = data as ApiErrorResponse
      throw error
    }

    console.log('✅ PHT_BE API Response:', {
      status: data.status,
      message: data.message,
      requestId: data.requestId,
      executionTime: data.executionTime + 'ms'
    })
    
    return data
  } catch (error) {
    console.error('🚨 API Request failed:', error)
    throw error
  }
}

// Fee Declaration interfaces for CRM API
export interface CrmFeeDeclaration {
  id?: number
  declarationNumber: string
  companyId: number
  vesselName: string
  voyageNumber?: string
  portCode?: string
  feeType: string
  feeAmount: number
  currency?: string
  status: string
  paymentMethod?: string
  createdAt?: string
  updatedAt?: string
  notes?: string
}

export interface CrmFeeDeclarationCreateData {
  declarationNumber: string
  companyId: number
  companyTaxCode: string
  companyName: string
  vesselName: string
  voyageNumber?: string
  portCode?: string
  feeType: string
  feeAmount: number
  currency?: string
  paymentMethod?: string
  notes?: string
}

export interface CrmFeeDeclarationSearchParams {
  page?: number
  size?: number
  sortBy?: string
  sortDir?: string
  companyId?: number
  declarationNumber?: string
  vesselName?: string
  status?: string
  fromDate?: string
  toDate?: string
}

export interface CrmCompany {
  id?: number
  companyName: string
  taxCode: string
  address?: string
  phone?: string
  email?: string
  status?: string
}

// === INTERFACE MỚI TỪ PHT_BE BACKEND ===

// Interface cho API Response thành công
export interface ApiDataResponse<T = any> {
  status: number
  requestId: string
  timestamp: string
  startTime: number
  endTime: number
  executionTime: number
  message: string
  path: string
  data: T
}

// Interface cho API Response lỗi
export interface ApiErrorResponse {
  status: number
  requestId: string
  timestamp: string
  startTime: number
  endTime: number
  executionTime: number
  message: string
  path: string
  data: any
  errors?: string[]
  error?: string
}

// Interface cho chi tiết tờ khai
export interface ToKhaiChiTiet {
  soVanDon: string
  soHieu: string
  soSeal: string
  loaiCont: string
  tinhChatCont: string
  tongTrongLuong: number
  donViTinh: string
  ghiChu: string
}

// Interface cho tờ khai thông tin - Đầy đủ theo API spec
export interface ToKhaiThongTinRequest {
  nguonTK: number
  maDoanhNghiepKhaiPhi: string
  tenDoanhNghiepKhaiPhi: string
  diaChiKhaiPhi: string
  maDoanhNghiepXNK: string
  tenDoanhNghiepXNK: string
  diaChiXNK: string
  soToKhai: string
  ngayToKhai: string // format: "2025-09-08"
  maCrm: string
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
  ngayKhaiPhi: string // format: "2025-09-08"
  nhomLoaiPhi: string
  loaiThanhToan: string
  ghiChuKhaiPhi: string
  soThongBaoNopPhi: string
  tongTienPhi: number
  trangThaiNganHang: string
  soBienLai: string
  ngayBienLai: string // format: "2025-09-08"
  kyHieuBienLai: string
  mauBienLai: string
  maTraCuuBienLai: string
  xemBienLai: string
  loaiHangMienPhi: string
  loaiHang: string
  trangThai: string
  chiTietList: ToKhaiChiTiet[]
}

// Interface cho tờ khai response (data trả về từ API)
export interface ToKhaiThongTinResponse extends ToKhaiThongTinRequest {
  id?: number
  createdAt?: string
  updatedAt?: string
}

// Interface cho update status request
export interface UpdateToKhaiStatusRequest {
  id: number
  trangThai: string
}

// Interface cho chữ ký số request
export interface ChuKySoRequest {
  toKhaiId: number
  lanKy: number
  serialNumber: string
}

// Interface cho thông tin chứng chỉ số - Updated to match backend response
export interface ChuKySoInfo {
  serialNumber: string
  issuer: string
  subject: string
  cert: string
  validFrom: string
  validTo: string
}

// Interface cho XML Generate request
export interface XmlGenerateRequest {
  toKhaiId: number
  lanKy: number
}

// === TRẠNG THÁI TỜ KHAI CHO QUY TRÌNH CHỮ KÝ SỐ ===
export const TOKHAI_STATUS = {
  MOI_TAO: '00',           // Mới tạo - có thể ký lần 1
  KY_LAN_1: '01',          // Đã ký lần 1
  LAY_THONG_BAO: '02',     // Đã lấy thông báo - có thể ký lần 2
  KY_LAN_2: '03',          // Đã ký lần 2 - thực hiện nộp phí
  THANH_CONG: '04',        // Thành công
  HUY: '05'                // Hủy
} as const

export type ToKhaiStatusType = typeof TOKHAI_STATUS[keyof typeof TOKHAI_STATUS]

// Mapping trạng thái với mô tả
export const TOKHAI_STATUS_DESCRIPTIONS = {
  [TOKHAI_STATUS.MOI_TAO]: 'Mới tạo',
  [TOKHAI_STATUS.KY_LAN_1]: 'Đã ký lần 1', 
  [TOKHAI_STATUS.LAY_THONG_BAO]: 'Đã lấy thông báo',
  [TOKHAI_STATUS.KY_LAN_2]: 'Đã ký lần 2 - thực hiện nộp phí',
  [TOKHAI_STATUS.THANH_CONG]: 'Thành công',
  [TOKHAI_STATUS.HUY]: 'Hủy'
} as const

// Helper functions cho business logic
export class ToKhaiStatusHelper {
  
  /**
   * Kiểm tra tờ khai có thể ký số không
   * @param status Trạng thái hiện tại
   * @param lanKy Lần ký (1 hoặc 2)
   * @returns boolean
   */
  static canSign(status: string, lanKy: number): boolean {
    if (lanKy === 1) {
      // Ký lần 1: chỉ được phép khi trạng thái là "Mới tạo" (00)
      return status === TOKHAI_STATUS.MOI_TAO
    } else if (lanKy === 2) {
      // Ký lần 2: chỉ được phép khi đã lấy thông báo (02)
      return status === TOKHAI_STATUS.LAY_THONG_BAO
    }
    return false
  }
  
  /**
   * Lấy trạng thái tiếp theo sau khi ký số thành công
   * @param currentStatus Trạng thái hiện tại
   * @param lanKy Lần ký vừa thực hiện
   * @returns Trạng thái mới
   */
  static getNextStatus(currentStatus: string, lanKy: number): string {
    if (lanKy === 1 && currentStatus === TOKHAI_STATUS.MOI_TAO) {
      return TOKHAI_STATUS.KY_LAN_1
    } else if (lanKy === 2 && currentStatus === TOKHAI_STATUS.LAY_THONG_BAO) {
      return TOKHAI_STATUS.KY_LAN_2
    }
    return currentStatus // Không thay đổi nếu không hợp lệ
  }
  
  /**
   * Kiểm tra tờ khai có thể lấy thông báo không
   * @param status Trạng thái hiện tại
   * @returns boolean
   */
  static canGetNotification(status: string): boolean {
    return status === TOKHAI_STATUS.KY_LAN_1
  }
  
  /**
   * Kiểm tra tờ khai đã hoàn thành quy trình chưa
   * @param status Trạng thái hiện tại
   * @returns boolean
   */
  static isCompleted(status: string): boolean {
    return status === TOKHAI_STATUS.THANH_CONG
  }
  
  /**
   * Kiểm tra tờ khai đã bị hủy chưa
   * @param status Trạng thái hiện tại 
   * @returns boolean
   */
  static isCancelled(status: string): boolean {
    return status === TOKHAI_STATUS.HUY
  }
  
  /**
   * Lấy mô tả trạng thái
   * @param status Trạng thái
   * @returns Mô tả
   */
  static getStatusDescription(status: string): string {
    return TOKHAI_STATUS_DESCRIPTIONS[status as ToKhaiStatusType] || `Không xác định (${status})`
  }
  
  /**
   * Lấy danh sách các action có thể thực hiện
   * @param status Trạng thái hiện tại
   * @returns Array các action
   */
  static getAvailableActions(status: string): string[] {
    const actions: string[] = []
    
    if (this.canSign(status, 1)) {
      actions.push('Ký lần 1')
    }
    
    if (this.canGetNotification(status)) {
      actions.push('Lấy thông báo')
    }
    
    if (this.canSign(status, 2)) {
      actions.push('Ký lần 2 - Nộp phí')
    }
    
    if (!this.isCompleted(status) && !this.isCancelled(status)) {
      actions.push('Hủy tờ khai')
    }
    
    return actions
  }
}

export interface CrmThongBaoPhi {
  id?: number
  declarationId: number
  thongBaoSo: string
  ngayThongBao: string
  tongTienPhi: number
  trangThai: string
  ghiChu?: string
  createdAt?: string
  updatedAt?: string
}

export interface CrmBienLai {
  id?: number
  thongBaoPhiId: number
  bienLaiSo: string
  ngayBienLai: string
  soTien: number
  hinhThucThanhToan: string
  trangThai: string
  nguoiThu?: string
  ghiChu?: string
  createdAt?: string
  updatedAt?: string
}

export interface CrmPayment {
  id?: number
  bienLaiId?: number
  declarationId?: number
  paymentMethod: string
  paymentAmount: number
  paymentDate: string
  transactionId?: string
  bankCode?: string
  status: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

export interface CrmFeeType {
  id?: number
  feeCode: string
  feeName: string
  feeDescription?: string
  baseAmount?: number
  calculationMethod?: string
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export interface CrmTariffType {
  id?: number
  ma: string
  ten: string
  dienGiai?: string
  trangThai?: string
  ngayTao?: string
  ngayCapNhat?: string
  // Legacy fields for compatibility
  code?: string
  name?: string
  description?: string
  level?: string
  address?: string
  phone?: string
  fax?: string
  note?: string
  status?: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface CrmTariff {
  id?: number
  maBieuCuoc: string
  tenBieuCuoc: string
  nhomLoaiHinh: string
  loaiCont: string
  tinhChatCont: string
  dvt: string
  hang: string
  donGia: number
  loaiBc: string
  trangThai: string
  ngayTao?: string
  ngayCapNhat?: string
  // Legacy fields for compatibility
  bieuCuoc?: string
  bieuCuocThue?: string
  sort?: number
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface CrmDigitalSignature {
  id?: number
  declarationId: number
  signatureData: string
  algorithm: string
  timestamp: string
  signerName: string
  signerEmail?: string
  certificateInfo?: string
  isValid: boolean
  createdAt?: string
}

export interface CrmUser {
  id?: number
  username: string
  email: string
  fullName: string
  role: string
  department?: string
  isActive: boolean
  lastLogin?: string
  createdAt?: string
  updatedAt?: string
}

export interface CrmReport {
  id?: number
  reportType: string
  title: string
  description?: string
  parameters: any
  generatedDate: string
  generatedBy: number
  filePath?: string
  status: string
}

// === SEARCH PARAMS INTERFACES ===
export interface CrmCompanySearchParams {
  page?: number
  size?: number
  sortBy?: string
  sortDir?: string
  companyName?: string
  taxCode?: string
  status?: string
}

export interface CrmPaymentSearchParams {
  page?: number
  size?: number
  sortBy?: string
  sortDir?: string
  paymentMethod?: string
  status?: string
  fromDate?: string
  toDate?: string
  minAmount?: number
  maxAmount?: number
}

export interface CrmThongBaoPhiSearchParams {
  page?: number
  size?: number
  sortBy?: string
  sortDir?: string
  trangThai?: string
  fromDate?: string
  toDate?: string
  declarationId?: number
}

export interface CrmBienLaiSearchParams {
  page?: number
  size?: number
  sortBy?: string
  sortDir?: string
  trangThai?: string
  fromDate?: string
  toDate?: string
  hinhThucThanhToan?: string
}

// CRM API Service
export class CrmApiService {
  
  /**
   * Test kết nối API với nhiều endpoint và timeout
   */
  static async testConnection(timeoutMs = 5000): Promise<{ connected: boolean; details: any }> {
    const testEndpoints = [
      { 
        url: CRM_ENDPOINTS.TOKHAI_THONGTIN_ALL,
        name: 'Tờ khai thông tin - All',
        method: 'GET'
      },
      { 
        url: CRM_ENDPOINTS.COMPANIES_ALL,
        name: 'Companies - All', 
        method: 'GET'
      }
    ];

    const results: any[] = [];
    let connectedCount = 0;

    console.log('🔗 Testing API connection với timeout:', timeoutMs + 'ms');

    for (const endpoint of testEndpoints) {
      try {
        console.log(`📡 Testing: ${endpoint.name} - ${endpoint.url}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        const startTime = Date.now();
        const response = await fetch(endpoint.url, {
          method: endpoint.method,
          headers: getHeaders(false), // Test without auth first
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        const duration = Date.now() - startTime;
        
        const result: any = {
          endpoint: endpoint.name,
          url: endpoint.url,
          status: response.status,
          statusText: response.statusText,
          duration: duration,
          success: response.ok
        };

        if (response.ok) {
          connectedCount++;
          console.log(`✅ ${endpoint.name}: OK (${duration}ms)`);
          
          // Try to parse response data
          try {
            const data = await response.json();
            result.dataPreview = {
              status: data.status,
              message: data.message, 
              dataLength: Array.isArray(data.data) ? data.data.length : 0
            };
          } catch (e) {
            result.dataPreview = 'Non-JSON response';
          }
        } else {
          console.log(`❌ ${endpoint.name}: ${response.status} ${response.statusText}`);
          result.error = `HTTP ${response.status}`;
        }
        
        results.push(result);
        
      } catch (error: any) {
        console.log(`💥 ${endpoint.name}: ${error.message}`);
        results.push({
          endpoint: endpoint.name,
          url: endpoint.url,
          error: error.name === 'AbortError' ? 'Timeout' : error.message,
          success: false
        });
      }
    }

    const connected = connectedCount > 0;
    const details = {
      totalEndpoints: testEndpoints.length,
      connectedEndpoints: connectedCount,
      results: results,
      timestamp: new Date().toISOString()
    };

    console.log(`🏁 Connection test completed: ${connectedCount}/${testEndpoints.length} endpoints OK`);
    
    return { connected, details };
  }

  // testSingleEndpoint method đã xóa - sẽ map lại theo backend thực tế

  /**
   * Get all fee declarations - Đã implement cho trang Declare
   */
  static async getAllFeeDeclarations(
    page = 0,
    size = 10, 
    sortBy = 'createdAt',
    sortDir = 'desc'
  ): Promise<ApiDataResponse<ToKhaiThongTinResponse[]> | ApiResponse<any>> {
    try {
      console.log(`📋 Loading fee declarations - page: ${page}, size: ${size}`);
      
      const queryParams = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        sortBy,
        sortDir
      });
      
      const url = `${CRM_ENDPOINTS.TOKHAI_THONGTIN_ALL}?${queryParams.toString()}`;
      const response = await makeApiRequest<ApiDataResponse<ToKhaiThongTinResponse[]>>(url);
      
      console.log('✅ Fee declarations loaded successfully:', response);
      return response;
      
    } catch (error) {
      console.error('❌ Failed to load fee declarations:', error);
      
      // Return mock data if API fails (legacy format for compatibility)
      const mockResponse: ApiResponse<any> = {
        success: true,
        message: 'Mock data loaded (API unavailable)',
        data: [],
        timestamp: new Date().toISOString()
      };
      
      return mockResponse;
    }
  }

  /**
   * Search fee declarations - Đã implement cho trang Declare
   */
  static async searchFeeDeclarations(
    searchParams: CrmFeeDeclarationSearchParams
  ): Promise<ApiDataResponse<ToKhaiThongTinResponse[]> | ApiResponse<any>> {
    try {
      console.log('🔍 Searching fee declarations with params:', searchParams);
      
      const queryParams = new URLSearchParams();
      
      // Add search parameters
      if (searchParams.page !== undefined) queryParams.append('page', searchParams.page.toString());
      if (searchParams.size !== undefined) queryParams.append('size', searchParams.size.toString());
      if (searchParams.sortBy) queryParams.append('sortBy', searchParams.sortBy);
      if (searchParams.sortDir) queryParams.append('sortDir', searchParams.sortDir);
      if (searchParams.companyId) queryParams.append('companyId', searchParams.companyId.toString());
      if (searchParams.declarationNumber) queryParams.append('declarationNumber', searchParams.declarationNumber);
      if (searchParams.vesselName) queryParams.append('vesselName', searchParams.vesselName);
      if (searchParams.status) queryParams.append('status', searchParams.status);
      if (searchParams.fromDate) queryParams.append('fromDate', searchParams.fromDate);
      if (searchParams.toDate) queryParams.append('toDate', searchParams.toDate);
      
      const url = `${CRM_ENDPOINTS.TOKHAI_THONGTIN_ALL}?${queryParams.toString()}`;
      const response = await makeApiRequest<ApiDataResponse<ToKhaiThongTinResponse[]>>(url);
      
      console.log('✅ Fee declarations search completed:', response);
      return response;
      
    } catch (error) {
      console.error('❌ Failed to search fee declarations:', error);
      
      // Return empty result if search fails (legacy format for compatibility)
      const mockResponse: ApiResponse<any> = {
        success: false,
        message: 'Search failed - API unavailable',
        data: [],
        timestamp: new Date().toISOString()
      };
      
      return mockResponse;
    }
  }

  /**
   * Get fee declaration by ID - cập nhật sử dụng endpoint thực tế
   */
  static async getFeeDeclarationById(id: number): Promise<ApiResponse<CrmFeeDeclaration>> {
    const url = `${CRM_ENDPOINTS.TOKHAI_THONGTIN}/${id}`
    return makeApiRequest(url)
  }

  /**
   * Create new fee declaration - sử dụng interface cũ (legacy)
   */
  static async createFeeDeclaration(
    data: CrmFeeDeclarationCreateData
  ): Promise<ApiResponse<CrmFeeDeclaration>> {
    return makeApiRequest(CRM_ENDPOINTS.TOKHAI_THONGTIN_CREATE, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  /**
   * Tạo tờ khai thông tin mới theo định dạng PHT_BE - API chính thức
   */
  static async createToKhaiThongTin(
    data: ToKhaiThongTinRequest
  ): Promise<ApiDataResponse<ToKhaiThongTinResponse> | ApiErrorResponse> {
    try {
      console.log('🆕 Tạo tờ khai thông tin mới với dữ liệu:', data)
      
      const response = await makeApiRequest<ApiDataResponse<ToKhaiThongTinResponse>>(CRM_ENDPOINTS.TOKHAI_THONGTIN_CREATE, {
        method: 'POST',
        body: JSON.stringify(data)
      })
      
      console.log('✅ Tạo tờ khai thành công:', response)
      return response
      
    } catch (error: any) {
      console.error('❌ Lỗi tạo tờ khai:', error)
      
      // Nếu là HTTP error response, trả về error response structure
      if (error.response) {
        return error.response as ApiErrorResponse
      }
      
      // Nếu là network error hoặc lỗi khác, tạo error response
      const errorResponse: ApiErrorResponse = {
        status: 500,
        requestId: `error-${Date.now()}`,
        timestamp: new Date().toISOString(),
        startTime: Date.now(),
        endTime: Date.now(),
        executionTime: 0,
        message: 'Network error or unexpected error',
        path: '/api/tokhai-thongtin/create',
        data: {},
        error: error.message || 'Unknown error',
        errors: [error.message || 'Unknown error']
      }
      
      return errorResponse
    }
  }

  /**
   * Lấy danh sách tất cả tờ khai thông tin - PHT_BE API chính thức
   * GET /api/tokhai-thongtin/all - No parameters
   */
  static async getAllToKhaiThongTin(): Promise<ApiDataResponse<ToKhaiThongTinResponse[]> | ApiErrorResponse> {
    try {
      console.log('📋 Lấy danh sách tất cả tờ khai thông tin...')
      
      const response = await makeApiRequest<ApiDataResponse<ToKhaiThongTinResponse[]>>(CRM_ENDPOINTS.TOKHAI_THONGTIN_ALL, {
        method: 'GET'
      })
      
      console.log('✅ Lấy danh sách tờ khai thành công:', {
        status: response.status,
        message: response.message,
        requestId: response.requestId,
        executionTime: response.executionTime + 'ms',
        totalRecords: Array.isArray(response.data) ? response.data.length : 0
      })
      
      return response
      
    } catch (error: any) {
      console.error('❌ Lỗi lấy danh sách tờ khai:', error)
      
      // Nếu là HTTP error response, trả về error response structure  
      if (error.response) {
        return error.response as ApiErrorResponse
      }
      
      // Nếu là network error hoặc lỗi khác, tạo error response
      const errorResponse: ApiErrorResponse = {
        status: 500,
        requestId: `error-${Date.now()}`,
        timestamp: new Date().toISOString(),
        startTime: Date.now(),
        endTime: Date.now(),
        executionTime: 0,
        message: 'Network error or unexpected error',
        path: '/api/tokhai-thongtin/all',
        data: {},
        error: error.message || 'Unknown error',
        errors: [error.message || 'Unknown error']
      }
      
      return errorResponse
    }
  }

  /**
   * Lấy thông tin tờ khai theo ID - PHT_BE API chính thức
   * GET /api/tokhai-thongtin/{id} - Parameter: id (required)
   */
  static async getToKhaiThongTinById(id: number): Promise<ApiDataResponse<ToKhaiThongTinResponse> | ApiErrorResponse> {
    try {
      console.log(`🔍 Lấy thông tin tờ khai theo ID: ${id}`)
      
      // Validate ID parameter
      if (!id || id <= 0) {
        const validationError: ApiErrorResponse = {
          status: 400,
          requestId: `validation-${Date.now()}`,
          timestamp: new Date().toISOString(),
          startTime: Date.now(),
          endTime: Date.now(),
          executionTime: 0,
          message: 'Invalid ID parameter',
          path: `/api/tokhai-thongtin/${id}`,
          data: {},
          error: 'ID must be a positive integer',
          errors: ['Required field is not provided', 'ID must be greater than 0']
        }
        
        console.error('❌ Invalid ID parameter:', id)
        return validationError
      }
      
      const url = `${CRM_ENDPOINTS.TOKHAI_THONGTIN}/${id}`
      const response = await makeApiRequest<ApiDataResponse<ToKhaiThongTinResponse>>(url, {
        method: 'GET'
      })
      
      console.log('✅ Lấy thông tin tờ khai thành công:', {
        status: response.status,
        message: response.message,
        requestId: response.requestId,
        executionTime: response.executionTime + 'ms',
        recordId: response.data?.id || 'N/A'
      })
      
      return response
      
    } catch (error: any) {
      console.error('❌ Lỗi lấy thông tin tờ khai:', error)
      
      // Nếu là HTTP error response, trả về error response structure
      if (error.response) {
        return error.response as ApiErrorResponse
      }
      
      // Nếu là network error hoặc lỗi khác, tạo error response
      const errorResponse: ApiErrorResponse = {
        status: 500,
        requestId: `error-${Date.now()}`,
        timestamp: new Date().toISOString(),
        startTime: Date.now(),
        endTime: Date.now(),
        executionTime: 0,
        message: 'Network error or unexpected error',
        path: `/api/tokhai-thongtin/${id}`,
        data: {},
        error: error.message || 'Unknown error',
        errors: [error.message || 'Unknown error']
      }
      
      return errorResponse
    }
  }

  /**
   * Cập nhật trạng thái tờ khai thông tin - PHT_BE API chính thức
   * PUT /api/tokhai-thongtin/update-status - Request body: {id, trangThai}
   */
  static async updateToKhaiStatus(
    data: UpdateToKhaiStatusRequest
  ): Promise<ApiDataResponse<any> | ApiErrorResponse> {
    try {
      console.log('🔄 Cập nhật trạng thái tờ khai:', data)
      
      // Validate request data
      if (!data.id || data.id <= 0) {
        const validationError: ApiErrorResponse = {
          status: 400,
          requestId: `validation-${Date.now()}`,
          timestamp: new Date().toISOString(),
          startTime: Date.now(),
          endTime: Date.now(),
          executionTime: 0,
          message: 'Invalid request data',
          path: '/api/tokhai-thongtin/update-status',
          data: {},
          error: 'ID must be a positive integer',
          errors: ['ID is required', 'ID must be greater than 0']
        }
        
        console.error('❌ Invalid ID in request data:', data.id)
        return validationError
      }
      
      if (!data.trangThai || data.trangThai.trim().length === 0) {
        const validationError: ApiErrorResponse = {
          status: 400,
          requestId: `validation-${Date.now()}`,
          timestamp: new Date().toISOString(),
          startTime: Date.now(),
          endTime: Date.now(),
          executionTime: 0,
          message: 'Invalid request data',
          path: '/api/tokhai-thongtin/update-status',
          data: {},
          error: 'Status is required',
          errors: ['trangThai is required', 'trangThai cannot be empty']
        }
        
        console.error('❌ Invalid trangThai in request data:', data.trangThai)
        return validationError
      }
      
      const response = await makeApiRequest<ApiDataResponse<any>>(CRM_ENDPOINTS.TOKHAI_THONGTIN_UPDATE_STATUS, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
      
      console.log('✅ Cập nhật trạng thái tờ khai thành công:', {
        status: response.status,
        message: response.message,
        requestId: response.requestId,
        executionTime: response.executionTime + 'ms',
        updatedId: data.id,
        newStatus: data.trangThai
      })
      
      return response
      
    } catch (error: any) {
      console.error('❌ Lỗi cập nhật trạng thái tờ khai:', error)
      
      // Nếu là HTTP error response, trả về error response structure
      if (error.response) {
        return error.response as ApiErrorResponse
      }
      
      // Nếu là network error hoặc lỗi khác, tạo error response
      const errorResponse: ApiErrorResponse = {
        status: 500,
        requestId: `error-${Date.now()}`,
        timestamp: new Date().toISOString(),
        startTime: Date.now(),
        endTime: Date.now(),
        executionTime: 0,
        message: 'Network error or unexpected error',
        path: '/api/tokhai-thongtin/update-status',
        data: {},
        error: error.message || 'Unknown error',
        errors: [error.message || 'Unknown error']
      }
      
      return errorResponse
    }
  }

  /**
   * Lấy thông báo tờ khai
   * POST /api/tokhai-thongtin/notification
   * @param toKhaiId ID của tờ khai
   * @returns ApiDataResponse<{}> | ApiErrorResponse
   */
  static async layThongBaoToKhai(
    toKhaiId: string
  ): Promise<ApiDataResponse<any> | ApiErrorResponse> {
    try {
      console.log(`📄 Getting notification for tokhai: ${toKhaiId}`)
      
      const response = await makeApiRequest<ApiDataResponse<any>>(CRM_ENDPOINTS.TOKHAI_THONGTIN_NOTIFICATION, {
        method: 'POST',
        body: JSON.stringify({ toKhaiId })
      })
      
      console.log('✅ Lấy thông báo tờ khai thành công:', {
        status: response.status,
        message: response.message,
        requestId: response.requestId,
        executionTime: response.executionTime + 'ms',
        toKhaiId: toKhaiId
      })
      
      return response
      
    } catch (error: any) {
      console.error('❌ Lấy thông báo tờ khai thất bại:', error)
      return {
        status: 500,
        requestId: `error-${Date.now()}`,
        timestamp: new Date().toISOString(),
        startTime: Date.now(),
        endTime: Date.now(),
        executionTime: 0,
        message: 'Lỗi khi lấy thông báo tờ khai',
        path: '/api/tokhai-thongtin/notification',
        data: {},
        error: error.message || 'Unknown error',
        errors: [error.message || 'Unknown error']
      }
    }
  }

  /**
   * Ký số tờ khai thông tin - PHT_BE API chính thức
   * POST /api/chu-ky-so/ky-so
   * @param data ChuKySoRequest - toKhaiId, lanKy, serialNumber
   * @returns ApiDataResponse<{}> | ApiErrorResponse
   */
  static async kyTenSoToKhai(
    data: ChuKySoRequest
  ): Promise<ApiDataResponse<any> | ApiErrorResponse> {
    try {
      console.log('🔐 Ký số tờ khai:', { 
        toKhaiId: data.toKhaiId, 
        lanKy: data.lanKy,
        serialNumber: data.serialNumber
      })
      
      // Validate request data
      if (!data.toKhaiId || data.toKhaiId <= 0) {
        const validationError: ApiErrorResponse = {
          status: 400,
          requestId: `validation-${Date.now()}`,
          timestamp: new Date().toISOString(),
          startTime: Date.now(),
          endTime: Date.now(),
          executionTime: 0,
          message: 'Invalid request data',
          path: '/api/chu-ky-so/ky-so',
          data: {},
          error: 'toKhaiId must be a positive integer',
          errors: ['toKhaiId is required', 'toKhaiId must be greater than 0']
        }
        
        console.error('❌ Invalid toKhaiId in request data:', data.toKhaiId)
        return validationError
      }

      if (!data.serialNumber || data.serialNumber.trim() === '') {
        const validationError: ApiErrorResponse = {
          status: 400,
          requestId: `validation-${Date.now()}`,
          timestamp: new Date().toISOString(),
          startTime: Date.now(),
          endTime: Date.now(),
          executionTime: 0,
          message: 'Invalid request data',
          path: '/api/chu-ky-so/ky-so',
          data: {},
          error: 'serialNumber is required',
          errors: ['serialNumber is required', 'serialNumber cannot be empty']
        }
        
        console.error('❌ Invalid serialNumber in request data:', data.serialNumber)
        return validationError
      }

      if (!data.lanKy || data.lanKy <= 0) {
        const validationError: ApiErrorResponse = {
          status: 400,
          requestId: `validation-${Date.now()}`,
          timestamp: new Date().toISOString(),
          startTime: Date.now(),
          endTime: Date.now(),
          executionTime: 0,
          message: 'Invalid request data',
          path: '/api/chu-ky-so/ky-so',
          data: {},
          error: 'lanKy is required',
          errors: ['lanKy is required', 'lanKy must be greater than 0']
        }
        
        console.error('❌ Invalid lanKy in request data:', data.lanKy)
        return validationError
      }
      
      // Business Logic Validation: Check current status before signing
      console.log('🔍 Checking declaration status before signing...')
      const declarationResult = await this.getToKhaiThongTinById(data.toKhaiId)
      
      if (declarationResult.status !== 200 || !declarationResult.data) {
        const statusError: ApiErrorResponse = {
          status: 404,
          requestId: `status-check-${Date.now()}`,
          timestamp: new Date().toISOString(),
          startTime: Date.now(),
          endTime: Date.now(),
          executionTime: 0,
          message: 'Không tìm thấy tờ khai hoặc không thể kiểm tra trạng thái',
          path: '/api/chu-ky-so/ky-so',
          data: {},
          error: 'Declaration not found or status check failed',
          errors: ['Cannot verify declaration status before signing']
        }
        
        console.error('❌ Cannot verify declaration status:', data.toKhaiId)
        return statusError
      }
      
      const currentStatus = declarationResult.data.trangThai
      const statusDescription = ToKhaiStatusHelper.getStatusDescription(currentStatus)
      
      console.log(`📊 Current declaration status: "${currentStatus}" (${statusDescription})`)
      
      // Check if declaration can be signed
      if (!ToKhaiStatusHelper.canSign(currentStatus, data.lanKy)) {
        const businessLogicError: ApiErrorResponse = {
          status: 400,
          requestId: `business-logic-${Date.now()}`,
          timestamp: new Date().toISOString(),
          startTime: Date.now(),
          endTime: Date.now(),
          executionTime: 0,
          message: `Tờ khai không thể ký ${data.lanKy === 1 ? 'lần 1' : 'lần 2'} ở trạng thái hiện tại`,
          path: '/api/chu-ky-so/ky-so',
          data: {},
          error: 'Invalid status for signing',
          errors: [
            `Current status: "${currentStatus}" (${statusDescription})`,
            data.lanKy === 1 
              ? `Để ký lần 1, tờ khai phải ở trạng thái "${TOKHAI_STATUS.MOI_TAO}" (Mới tạo)`
              : `Để ký lần 2, tờ khai phải ở trạng thái "${TOKHAI_STATUS.LAY_THONG_BAO}" (Đã lấy thông báo)`,
            `Available actions: ${ToKhaiStatusHelper.getAvailableActions(currentStatus).join(', ')}`
          ]
        }
        
        console.error('❌ Business logic validation failed:', {
          currentStatus,
          statusDescription,
          lanKy: data.lanKy,
          canSign: ToKhaiStatusHelper.canSign(currentStatus, data.lanKy)
        })
        return businessLogicError
      }
      
      console.log(`✅ Status validation passed: Can sign declaration (lần ${data.lanKy})`)
      
      const response = await makeApiRequest<ApiDataResponse<any>>(CRM_ENDPOINTS.CHU_KY_SO_KY_SO, {
        method: 'POST',
        body: JSON.stringify(data)
      })
      
      console.log('✅ Ký số tờ khai thành công:', {
        status: response.status,
        message: response.message,
        requestId: response.requestId,
        executionTime: response.executionTime + 'ms',
        toKhaiId: data.toKhaiId
      })
      
      return response
      
    } catch (error: any) {
      console.error('❌ Lỗi ký số tờ khai:', error)
      
      // Nếu là HTTP error response, trả về error response structure
      if (error.response) {
        return error.response as ApiErrorResponse
      }
      
      // Tạo error response structure cho network errors
      const errorResponse: ApiErrorResponse = {
        status: 500,
        requestId: `error-${Date.now()}`,
        timestamp: new Date().toISOString(),
        startTime: Date.now(),
        endTime: Date.now(),
        executionTime: 0,
        message: 'Network error or unexpected error',
        path: '/api/chu-ky-so/ky-so',
        data: {},
        error: error.message || 'Unknown error',
        errors: [error.message || 'Unknown error']
      }
      
      return errorResponse
    }
  }

  /**
   * Lấy danh sách chữ ký số - PHT_BE API chính thức
   * GET /api/chu-ky-so/danh-sach
   * @returns ApiDataResponse<ChuKySoInfo[]> | ApiErrorResponse - Danh sách chứng chỉ số có sẵn
   */
  static async getDanhSachChuKySo(): Promise<ApiDataResponse<ChuKySoInfo[]> | ApiErrorResponse> {
    try {
      console.log('📋 Lấy danh sách chữ ký số...')
      
      const response = await makeApiRequest<ApiDataResponse<ChuKySoInfo[]>>(CRM_ENDPOINTS.CHU_KY_SO_DANH_SACH, {
        method: 'GET'
      })
      
      console.log('✅ Lấy danh sách chữ ký số thành công:', {
        status: response.status,
        message: response.message,
        requestId: response.requestId,
        executionTime: response.executionTime + 'ms'
      })
      
      // Log data preview if available
      if (response.data) {
        if (Array.isArray(response.data)) {
          console.log(`   📊 Total certificates: ${response.data.length}`)
          if (response.data.length > 0) {
            console.log(`   📄 Sample certificate:`, response.data[0])
          }
        } else {
          console.log(`   📊 Certificate data type:`, typeof response.data)
        }
      }
      
      return response
      
    } catch (error: any) {
      console.error('❌ Lỗi lấy danh sách chữ ký số:', error)
      
      // Nếu là HTTP error response, trả về error response structure
      if (error.response) {
        return error.response as ApiErrorResponse
      }
      
      // Tạo error response structure cho network errors
      const errorResponse: ApiErrorResponse = {
        status: 500,
        requestId: `error-${Date.now()}`,
        timestamp: new Date().toISOString(),
        startTime: Date.now(),
        endTime: Date.now(),
        executionTime: 0,
        message: 'Network error or unexpected error',
        path: '/api/chu-ky-so/danh-sach',
        data: {},
        error: error.message || 'Unknown error',
        errors: [error.message || 'Unknown error']
      }
      
      return errorResponse
    }
  }

  /**
   * Tạo XML từ tờ khai - PHT_BE API chính thức
   * POST /api/xml-generate
   * @param data XmlGenerateRequest - toKhaiId và lanKy
   * @returns ApiDataResponse<any> | ApiErrorResponse - Thông tin XML đã tạo
   */
  static async generateXml(
    data: XmlGenerateRequest
  ): Promise<ApiDataResponse<any> | ApiErrorResponse> {
    try {
      console.log('📄 Tạo XML từ tờ khai:', { toKhaiId: data.toKhaiId, lanKy: data.lanKy })
      
      // Validate request data
      if (!data.toKhaiId || data.toKhaiId <= 0) {
        const validationError: ApiErrorResponse = {
          status: 400,
          requestId: `validation-${Date.now()}`,
          timestamp: new Date().toISOString(),
          startTime: Date.now(),
          endTime: Date.now(),
          executionTime: 0,
          message: 'Invalid request data',
          path: '/api/xml-generate',
          data: {},
          error: 'toKhaiId must be a positive integer',
          errors: ['toKhaiId is required', 'toKhaiId must be greater than 0']
        }
        
        console.error('❌ Invalid toKhaiId in request data:', data.toKhaiId)
        return validationError
      }

      if (!data.lanKy || data.lanKy <= 0) {
        const validationError: ApiErrorResponse = {
          status: 400,
          requestId: `validation-${Date.now()}`,
          timestamp: new Date().toISOString(),
          startTime: Date.now(),
          endTime: Date.now(),
          executionTime: 0,
          message: 'Invalid request data',
          path: '/api/xml-generate',
          data: {},
          error: 'lanKy must be a positive integer',
          errors: ['lanKy is required', 'lanKy must be greater than 0']
        }
        
        console.error('❌ Invalid lanKy in request data:', data.lanKy)
        return validationError
      }
      
      const response = await makeApiRequest<ApiDataResponse<any>>(CRM_ENDPOINTS.XML_GENERATE, {
        method: 'POST',
        body: JSON.stringify(data)
      })
      
      console.log('✅ Tạo XML thành công:', {
        status: response.status,
        message: response.message,
        requestId: response.requestId,
        executionTime: response.executionTime + 'ms',
        toKhaiId: data.toKhaiId,
        lanKy: data.lanKy
      })
      
      // Log XML data preview if available
      if (response.data) {
        if (typeof response.data === 'string' && response.data.startsWith('<?xml')) {
          console.log(`   📄 XML Generated: ${response.data.length} characters`)
          console.log(`   📄 XML Preview: ${response.data.substring(0, 200)}...`)
        } else if (typeof response.data === 'object') {
          console.log(`   📄 XML Data Object:`, Object.keys(response.data))
        }
      }
      
      return response
      
    } catch (error: any) {
      console.error('❌ Lỗi tạo XML:', error)
      
      // Nếu là HTTP error response, trả về error response structure
      if (error.response) {
        return error.response as ApiErrorResponse
      }
      
      // Tạo error response structure cho network errors
      const errorResponse: ApiErrorResponse = {
        status: 500,
        requestId: `error-${Date.now()}`,
        timestamp: new Date().toISOString(),
        startTime: Date.now(),
        endTime: Date.now(),
        executionTime: 0,
        message: 'Network error or unexpected error',
        path: '/api/xml-generate',
        data: {},
        error: error.message || 'Unknown error',
        errors: [error.message || 'Unknown error']
      }
      
      return errorResponse
    }
  }

  /**
   * Update fee declaration - cập nhật sử dụng endpoint thực tế
   */
  static async updateFeeDeclaration(
    id: number,
    data: Partial<CrmFeeDeclarationCreateData>
  ): Promise<ApiResponse<CrmFeeDeclaration>> {
    // Sử dụng endpoint update-status từ Swagger UI
    return makeApiRequest(CRM_ENDPOINTS.TOKHAI_THONGTIN_UPDATE_STATUS, {
      method: 'PUT',
      body: JSON.stringify({ id, ...data })
    })
  }

  /**
   * Delete fee declaration
   */
  static async deleteFeeDeclaration(id: number): Promise<ApiResponse<void>> {
    const url = `${CRM_ENDPOINTS.FEE_DECLARATIONS}/${id}`
    return makeApiRequest(url, {
      method: 'DELETE'
    })
  }

  // getAllCompanies method đã xóa - sẽ map lại theo backend thực tế cho trang Declare

  /**
   * Get company by ID
   */
  static async getCompanyById(id: number): Promise<ApiResponse<CrmCompany>> {
    const url = `${CRM_ENDPOINTS.COMPANIES}/${id}`
    return makeApiRequest(url)
  }

  /**
   * Search companies by tax code
   */
  static async searchCompaniesByTaxCode(taxCode: string): Promise<ApiResponse<CrmCompany[]>> {
    const url = `${CRM_ENDPOINTS.COMPANIES}/search?taxCode=${encodeURIComponent(taxCode)}`
    return makeApiRequest(url)
  }


  // === COMPANIES API METHODS ===
  
  /**
   * Lấy tất cả danh sách công ty - Đã implement cho trang Declare
   */
  static async getAllCompanies(): Promise<ApiResponse<CrmCompany[]>> {
    try {
      console.log('🏢 Loading all companies...');
      const response = await makeApiRequest<ApiResponse<CrmCompany[]>>(CRM_ENDPOINTS.COMPANIES_ALL);
      console.log('✅ Companies loaded successfully:', response);
      return response;
      
    } catch (error) {
      console.error('❌ Failed to load companies:', error);
      
      // Return mock data if API fails
      const mockResponse: ApiResponse<CrmCompany[]> = {
        success: true,
        message: 'Mock companies loaded (API unavailable)',
        data: [
          {
            id: 1,
            companyName: 'Công ty TNHH ABC',
            taxCode: 'MST123456789',
            address: '123 Đường ABC, Q1, TP.HCM',
            phone: '0901234567',
            email: 'contact@abc.com',
            status: 'active'
          },
          {
            id: 2,
            companyName: 'Công ty XNK DEF',
            taxCode: 'XNK987654321', 
            address: '456 Đường DEF, Q3, TP.HCM',
            phone: '0909876543',
            email: 'info@def.com',
            status: 'active'
          }
        ],
        timestamp: new Date().toISOString()
      };
      
      return mockResponse;
    }
  }

  /**
   * Tìm kiếm công ty
   */
  static async searchCompanies(searchParams: CrmCompanySearchParams): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams()
    
    if (searchParams.page !== undefined) queryParams.append('page', searchParams.page.toString())
    if (searchParams.size !== undefined) queryParams.append('size', searchParams.size.toString())
    if (searchParams.sortBy) queryParams.append('sortBy', searchParams.sortBy)
    if (searchParams.sortDir) queryParams.append('sortDir', searchParams.sortDir)
    if (searchParams.companyName) queryParams.append('companyName', searchParams.companyName)
    if (searchParams.taxCode) queryParams.append('taxCode', searchParams.taxCode)
    if (searchParams.status) queryParams.append('status', searchParams.status)
    
    const url = `${CRM_ENDPOINTS.COMPANIES_SEARCH}?${queryParams.toString()}`
    return makeApiRequest(url)
  }

  /**
   * Tạo công ty mới
   */
  static async createCompany(data: Omit<CrmCompany, 'id'>): Promise<ApiResponse<CrmCompany>> {
    return makeApiRequest(CRM_ENDPOINTS.COMPANIES_CREATE, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  /**
   * Cập nhật thông tin công ty
   */
  static async updateCompany(id: number, data: Partial<CrmCompany>): Promise<ApiResponse<CrmCompany>> {
    return makeApiRequest(CRM_ENDPOINTS.COMPANIES_UPDATE, {
      method: 'PUT',
      body: JSON.stringify({ id, ...data })
    })
  }

  /**
   * Xóa công ty
   */
  static async deleteCompany(id: number): Promise<ApiResponse<void>> {
    return makeApiRequest(CRM_ENDPOINTS.COMPANIES_DELETE, {
      method: 'DELETE',
      body: JSON.stringify({ id })
    })
  }

  // === THÔNG BÁO PHÍ API METHODS ===

  /**
   * Lấy tất cả thông báo phí
   */
  static async getAllThongBaoPhi(): Promise<ApiResponse<CrmThongBaoPhi[]>> {
    return makeApiRequest(CRM_ENDPOINTS.THONG_BAO_PHI_ALL)
  }

  /**
   * Tạo thông báo phí
   */
  static async createThongBaoPhi(data: Omit<CrmThongBaoPhi, 'id'>): Promise<ApiResponse<CrmThongBaoPhi>> {
    return makeApiRequest(CRM_ENDPOINTS.THONG_BAO_PHI_CREATE, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  /**
   * Cập nhật thông báo phí
   */
  static async updateThongBaoPhi(id: number, data: Partial<CrmThongBaoPhi>): Promise<ApiResponse<CrmThongBaoPhi>> {
    return makeApiRequest(CRM_ENDPOINTS.THONG_BAO_PHI_UPDATE, {
      method: 'PUT',
      body: JSON.stringify({ id, ...data })
    })
  }

  // === BIÊN LAI API METHODS ===

  /**
   * Lấy tất cả biên lai
   */
  static async getAllBienLai(): Promise<ApiResponse<CrmBienLai[]>> {
    return makeApiRequest(CRM_ENDPOINTS.BIEN_LAI_ALL)
  }

  /**
   * Tạo biên lai mới
   */
  static async createBienLai(data: Omit<CrmBienLai, 'id'>): Promise<ApiResponse<CrmBienLai>> {
    return makeApiRequest(CRM_ENDPOINTS.BIEN_LAI_CREATE, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  /**
   * Cập nhật biên lai
   */
  static async updateBienLai(id: number, data: Partial<CrmBienLai>): Promise<ApiResponse<CrmBienLai>> {
    return makeApiRequest(CRM_ENDPOINTS.BIEN_LAI_UPDATE, {
      method: 'PUT',
      body: JSON.stringify({ id, ...data })
    })
  }

  /**
   * Xóa biên lai
   */
  static async deleteBienLai(id: number): Promise<ApiResponse<void>> {
    return makeApiRequest(CRM_ENDPOINTS.BIEN_LAI_DELETE, {
      method: 'DELETE',
      body: JSON.stringify({ id })
    })
  }

  // === PAYMENTS API METHODS ===

  /**
   * Lấy tất cả thanh toán
   */
  static async getAllPayments(): Promise<ApiResponse<CrmPayment[]>> {
    return makeApiRequest(CRM_ENDPOINTS.PAYMENTS_ALL)
  }

  /**
   * Tìm kiếm thanh toán
   */
  static async searchPayments(searchParams: CrmPaymentSearchParams): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams()
    
    if (searchParams.page !== undefined) queryParams.append('page', searchParams.page.toString())
    if (searchParams.size !== undefined) queryParams.append('size', searchParams.size.toString())
    if (searchParams.sortBy) queryParams.append('sortBy', searchParams.sortBy)
    if (searchParams.sortDir) queryParams.append('sortDir', searchParams.sortDir)
    if (searchParams.paymentMethod) queryParams.append('paymentMethod', searchParams.paymentMethod)
    if (searchParams.status) queryParams.append('status', searchParams.status)
    if (searchParams.fromDate) queryParams.append('fromDate', searchParams.fromDate)
    if (searchParams.toDate) queryParams.append('toDate', searchParams.toDate)
    if (searchParams.minAmount) queryParams.append('minAmount', searchParams.minAmount.toString())
    if (searchParams.maxAmount) queryParams.append('maxAmount', searchParams.maxAmount.toString())
    
    const url = `${CRM_ENDPOINTS.PAYMENTS_SEARCH}?${queryParams.toString()}`
    return makeApiRequest(url)
  }

  /**
   * Tạo thanh toán mới
   */
  static async createPayment(data: Omit<CrmPayment, 'id'>): Promise<ApiResponse<CrmPayment>> {
    return makeApiRequest(CRM_ENDPOINTS.PAYMENTS_CREATE, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  /**
   * Cập nhật trạng thái thanh toán
   */
  static async updatePaymentStatus(id: number, status: string): Promise<ApiResponse<CrmPayment>> {
    return makeApiRequest(CRM_ENDPOINTS.PAYMENTS_UPDATE_STATUS, {
      method: 'PUT',
      body: JSON.stringify({ id, status })
    })
  }

  // === FEE TYPES API METHODS ===

  /**
   * Lấy tất cả loại phí - Đã implement cho trang Declare
   */
  static async getAllFeeTypes(): Promise<ApiResponse<CrmFeeType[]>> {
    try {
      console.log('💰 Loading all fee types...');
      const response = await makeApiRequest<ApiResponse<CrmFeeType[]>>(CRM_ENDPOINTS.FEE_TYPES_ALL);
      console.log('✅ Fee types loaded successfully:', response);
      return response;
      
    } catch (error) {
      console.error('❌ Failed to load fee types:', error);
      
      // Return mock data if API fails
      const mockResponse: ApiResponse<CrmFeeType[]> = {
        success: true,
        message: 'Mock fee types loaded (API unavailable)',
        data: [
          {
            id: 1,
            feeCode: 'PHI_CANG',
            feeName: 'Phí cảng',
            feeDescription: 'Phí sử dụng cảng biển',
            baseAmount: 100000,
            calculationMethod: 'fixed',
            isActive: true
          },
          {
            id: 2,
            feeCode: 'PHI_LUUKHO',
            feeName: 'Phí lưu kho',
            feeDescription: 'Phí lưu trữ hàng hóa',
            baseAmount: 50000,
            calculationMethod: 'per_day',
            isActive: true
          },
          {
            id: 3,
            feeCode: 'PHI_HAIQUAN',
            feeName: 'Phí hải quan',
            feeDescription: 'Phí thủ tục hải quan',
            baseAmount: 200000,
            calculationMethod: 'percentage',
            isActive: true
          }
        ],
        timestamp: new Date().toISOString()
      };
      
      return mockResponse;
    }
  }

  /**
   * Tạo loại phí mới
   */
  static async createFeeType(data: Omit<CrmFeeType, 'id'>): Promise<ApiResponse<CrmFeeType>> {
    return makeApiRequest(CRM_ENDPOINTS.FEE_TYPES_CREATE, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  // === TARIFF TYPES API METHODS ===

  /**
   * Lấy tất cả loại biểu cước với phân trang và tìm kiếm
   */
  static async getAllTariffTypes(params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
    searchName?: string;
    searchCode?: string;
  }): Promise<ApiResponse<{
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    numberOfElements: number;
    totalElements: number;
    content: CrmTariffType[];
    searchKeyword: string;
    searchTime: number;
  }>> {
    console.log('📋 Using hardcoded tariff types data with params:', params);
    
    // Return hardcoded data immediately
    const hardcodedResponse: ApiResponse<{
      pageNumber: number;
      pageSize: number;
      totalPages: number;
      numberOfElements: number;
      totalElements: number;
      content: CrmTariffType[];
      searchKeyword: string;
      searchTime: number;
    }> = {
      success: true,
      message: 'Hardcoded tariff types data',
      data: {
        pageNumber: 0,
        pageSize: 10,
        totalPages: 1,
        numberOfElements: 3,
        totalElements: 3,
        content: [
          {
            id: 1,
            ma: 'LBC001',
            ten: 'HÀNG CONTAINER',
            dienGiai: 'HÀNG CONTAINER',
            trangThai: '1',
            ngayTao: '2025-09-12T04:52:26.446183',
            ngayCapNhat: '2025-09-12T04:52:26.446183'
          },
          {
            id: 2,
            ma: 'LBC002',
            ten: 'HÀNG RỜI, LỎNG, KIỆN',
            dienGiai: 'HÀNG RỜI, LỎNG, KIỆN',
            trangThai: '1',
            ngayTao: '2025-09-12T04:52:26.446183',
            ngayCapNhat: '2025-09-12T04:52:26.446183'
          },
          {
            id: 3,
            ma: 'LBC003',
            ten: 'HÀNG CONTAINER TÍNH TRỌNG LƯỢNG (không áp dụng cho CFS)',
            dienGiai: 'HÀNG CONTAINER TÍNH TRỌNG LƯỢNG (không áp dụng cho CFS)',
            trangThai: '1',
            ngayTao: '2025-09-12T04:52:26.446183',
            ngayCapNhat: '2025-09-12T04:52:26.446183'
          }
        ],
        searchKeyword: 'All records',
        searchTime: 0
      },
      timestamp: new Date().toISOString()
    };
    
    console.log('✅ Hardcoded tariff types loaded:', hardcodedResponse);
    return hardcodedResponse;
    
    /* Original API call code - commented out
    try {
      console.log('📋 Loading tariff types with params:', params);
      
      // Build query string
      const queryParams = new URLSearchParams();
      if (params?.page !== undefined) queryParams.append('page', params.page.toString());
      if (params?.size !== undefined) queryParams.append('size', params.size.toString());
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params?.sortDir) queryParams.append('sortDir', params.sortDir);
      if (params?.searchName) queryParams.append('searchName', params.searchName);
      if (params?.searchCode) queryParams.append('searchCode', params.searchCode);
      
      const url = queryParams.toString() 
        ? `${CRM_ENDPOINTS.TARIFF_TYPES_ALL}?${queryParams.toString()}`
        : CRM_ENDPOINTS.TARIFF_TYPES_ALL;
      
      console.log('📋 API URL:', url);
      
      const response = await makeApiRequest<ApiResponse<{
        pageNumber: number;
        pageSize: number;
        totalPages: number;
        numberOfElements: number;
        totalElements: number;
        content: CrmTariffType[];
        searchKeyword: string;
        searchTime: number;
      }>>(url);
      console.log('✅ Tariff types loaded successfully:', response);
      return response;
      
    } catch (error) {
      console.error('❌ Failed to load tariff types:', error);
      throw error;
    }
    */
  }

  // === TARIFFS API METHODS ===

  /**
   * Lấy tất cả biểu cước với phân trang và tìm kiếm
   */
  static async getAllTariffs(params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
    searchName?: string;
    searchCode?: string;
  }): Promise<ApiResponse<{
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    numberOfElements: number;
    totalElements: number;
    content: CrmTariff[];
    searchKeyword: string;
    searchTime: number;
  }>> {
    console.log('💰 Using hardcoded tariffs data with params:', params);
    
    // Return hardcoded data immediately
    const hardcodedResponse: ApiResponse<{
      pageNumber: number;
      pageSize: number;
      totalPages: number;
      numberOfElements: number;
      totalElements: number;
      content: CrmTariff[];
      searchKeyword: string;
      searchTime: number;
    }> = {
      success: true,
      message: 'Hardcoded tariffs data',
      data: {
        pageNumber: 0,
        pageSize: 10,
        totalPages: 1,
        numberOfElements: 6,
        totalElements: 6,
        content: [
          {
            id: 5,
            maBieuCuoc: 'BC001',
            tenBieuCuoc: 'Container 20 feet khô',
            nhomLoaiHinh: 'Xuất/Nhập khẩu',
            loaiCont: 'Container 20 feet',
            tinhChatCont: 'KHÔ',
            dvt: 'Cont',
            hang: 'Tổng hợp',
            donGia: 250000,
            loaiBc: 'LBC001',
            trangThai: '1',
            ngayTao: '2025-09-12T05:12:30.892245',
            ngayCapNhat: '2025-09-12T05:12:30.892245'
          },
          {
            id: 6,
            maBieuCuoc: 'BC002',
            tenBieuCuoc: 'Container 40 feet khô',
            nhomLoaiHinh: 'Xuất/Nhập khẩu',
            loaiCont: 'Container 40 feet',
            tinhChatCont: 'KHÔ',
            dvt: 'Cont',
            hang: 'Tổng hợp',
            donGia: 500000,
            loaiBc: 'LBC001',
            trangThai: '1',
            ngayTao: '2025-09-12T05:13:05.188429',
            ngayCapNhat: '2025-09-12T05:13:05.188429'
          },
          {
            id: 7,
            maBieuCuoc: 'BC003',
            tenBieuCuoc: 'Container 20 feet lạnh',
            nhomLoaiHinh: 'Xuất/Nhập khẩu',
            loaiCont: 'Container 20 feet',
            tinhChatCont: 'Container hàng lạnh',
            dvt: 'Cont',
            hang: 'Tổng hợp',
            donGia: 500000,
            loaiBc: 'LBC001',
            trangThai: '1',
            ngayTao: '2025-09-12T05:13:57.283298',
            ngayCapNhat: '2025-09-12T05:13:57.283298'
          },
          {
            id: 8,
            maBieuCuoc: 'BC004',
            tenBieuCuoc: 'Container 40 feet lạnh',
            nhomLoaiHinh: 'Xuất/Nhập khẩu',
            loaiCont: 'Container 40 feet',
            tinhChatCont: 'Container hàng lạnh',
            dvt: 'Cont',
            hang: 'Tổng hợp',
            donGia: 1000000,
            loaiBc: 'LBC001',
            trangThai: '1',
            ngayTao: '2025-09-12T05:14:22.56724',
            ngayCapNhat: '2025-09-12T05:14:22.56724'
          },
          {
            id: 9,
            maBieuCuoc: 'BC005',
            tenBieuCuoc: '',
            nhomLoaiHinh: 'Xuất/Nhập khẩu',
            loaiCont: '',
            tinhChatCont: '',
            dvt: '',
            hang: 'Tổng hợp',
            donGia: 15000,
            loaiBc: 'LBC002',
            trangThai: '1',
            ngayTao: '2025-09-12T05:29:25.833708',
            ngayCapNhat: '2025-09-12T05:29:25.833708'
          },
          {
            id: 10,
            maBieuCuoc: 'BC006',
            tenBieuCuoc: '',
            nhomLoaiHinh: 'Xuất/Nhập khẩu',
            loaiCont: '',
            tinhChatCont: '',
            dvt: '',
            hang: 'Tổng hợp',
            donGia: 15000,
            loaiBc: 'LBC003',
            trangThai: '1',
            ngayTao: '2025-09-12T05:30:12.566057',
            ngayCapNhat: '2025-09-12T05:30:12.566057'
          }
        ],
        searchKeyword: 'All records',
        searchTime: 0
      },
      timestamp: new Date().toISOString()
    };
    
    console.log('✅ Hardcoded tariffs loaded:', hardcodedResponse);
    return hardcodedResponse;
  }

  /**
   * Tạo biểu cước mới
   */
  static async createTariff(data: Omit<CrmTariff, 'id'>): Promise<ApiResponse<CrmTariff>> {
    try {
      console.log('💰 Creating tariff:', data);
      const response = await makeApiRequest<ApiResponse<CrmTariff>>(CRM_ENDPOINTS.TARIFFS_CREATE, {
        method: 'POST',
        body: JSON.stringify(data)
      });
      console.log('✅ Tariff created successfully:', response);
      return response;
      
    } catch (error) {
      console.error('❌ Failed to create tariff:', error);
      throw error;
    }
  }

  /**
   * Cập nhật biểu cước
   */
  static async updateTariff(id: number, data: Partial<CrmTariff>): Promise<ApiResponse<CrmTariff>> {
    try {
      console.log('💰 Updating tariff:', id, data);
      const response = await makeApiRequest<ApiResponse<CrmTariff>>(`${CRM_ENDPOINTS.TARIFFS_UPDATE}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      console.log('✅ Tariff updated successfully:', response);
      return response;
      
    } catch (error) {
      console.error('❌ Failed to update tariff:', error);
      throw error;
    }
  }

  /**
   * Xóa biểu cước
   */
  static async deleteTariff(id: number): Promise<ApiResponse<void>> {
    try {
      console.log('💰 Deleting tariff:', id);
      const response = await makeApiRequest<ApiResponse<void>>(`${CRM_ENDPOINTS.TARIFFS_DELETE}/${id}`, {
        method: 'DELETE',
        body: JSON.stringify({ id })
      });
      console.log('✅ Tariff deleted successfully:', response);
      return response;
      
    } catch (error) {
      console.error('❌ Failed to delete tariff:', error);
      throw error;
    }
  }

  /**
   * Tạo loại biểu cước mới
   */
  static async createTariffType(data: Omit<CrmTariffType, 'id'>): Promise<ApiResponse<CrmTariffType>> {
    try {
      console.log('📋 Creating tariff type:', data);
      const response = await makeApiRequest<ApiResponse<CrmTariffType>>(CRM_ENDPOINTS.TARIFF_TYPES_CREATE, {
        method: 'POST',
        body: JSON.stringify(data)
      });
      console.log('✅ Tariff type created successfully:', response);
      return response;
      
    } catch (error) {
      console.error('❌ Failed to create tariff type:', error);
      throw error;
    }
  }

  /**
   * Cập nhật loại biểu cước
   */
  static async updateTariffType(id: number, data: Partial<CrmTariffType>): Promise<ApiResponse<CrmTariffType>> {
    try {
      console.log('📋 Updating tariff type:', id, data);
      const response = await makeApiRequest<ApiResponse<CrmTariffType>>(`${CRM_ENDPOINTS.TARIFF_TYPES_UPDATE}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      console.log('✅ Tariff type updated successfully:', response);
      return response;
      
    } catch (error) {
      console.error('❌ Failed to update tariff type:', error);
      throw error;
    }
  }

  /**
   * Xóa loại biểu cước
   */
  static async deleteTariffType(id: number): Promise<ApiResponse<void>> {
    try {
      console.log('📋 Deleting tariff type:', id);
      const response = await makeApiRequest<ApiResponse<void>>(`${CRM_ENDPOINTS.TARIFF_TYPES_DELETE}/${id}`, {
        method: 'DELETE'
      });
      console.log('✅ Tariff type deleted successfully:', response);
      return response;
      
    } catch (error) {
      console.error('❌ Failed to delete tariff type:', error);
      throw error;
    }
  }

  // === DIGITAL SIGNATURE API METHODS ===

  // signDeclaration method đã được thay thế bằng kyTenSoToKhai() 
  // Sử dụng CrmApiService.kyTenSoToKhai() thay thế

  /**
   * Xác minh chữ ký số
   */
  static async verifySignature(signatureId: number): Promise<ApiResponse<any>> {
    return makeApiRequest(`${CRM_ENDPOINTS.DIGITAL_SIGNATURE_VERIFY}/${signatureId}`)
  }

  // === REPORTS API METHODS ===

  /**
   * Lấy báo cáo hàng ngày - CẦN MAP LẠI cho trang Declare
   */
  static async getDailyReports(_date: string): Promise<ApiResponse<CrmReport[]>> {
    // TODO: Map lại API báo cáo theo backend thực tế cho trang khai báo nộp phí
    throw new Error('API getDailyReports cần được map lại theo backend thực tế')
  }

  /**
   * Lấy báo cáo tổng hợp
   */
  static async getSummaryReports(fromDate: string, toDate: string): Promise<ApiResponse<any>> {
    const url = `${CRM_ENDPOINTS.REPORTS_SUMMARY}?fromDate=${fromDate}&toDate=${toDate}`
    return makeApiRequest(url)
  }

  /**
   * Xuất báo cáo
   */
  static async exportReport(reportType: string, parameters: any): Promise<ApiResponse<any>> {
    return makeApiRequest(CRM_ENDPOINTS.REPORTS_EXPORT, {
      method: 'POST',
      body: JSON.stringify({
        reportType,
        parameters
      })
    })
  }

  // === AUTHENTICATION API METHODS ===

  /**
   * Login to CRM system
   */
  static async login(username: string, password: string): Promise<ApiResponse<any>> {
    const loginData = { username, password }
    
    try {
      const response = await makeApiRequest<ApiResponse<any>>(CRM_ENDPOINTS.AUTH_LOGIN, {
        method: 'POST',
        body: JSON.stringify(loginData)
      })
      
      // Save auth token if provided
      if (response && (response as any).token) {
        sessionStorage.setItem('authToken', (response as any).token)
        console.log('✅ Auth token saved')
      }
      
      return response
    } catch (error) {
      console.error('❌ CRM Login failed:', error)
      throw error
    }
  }

  /**
   * Refresh auth token
   */
  static async refreshToken(): Promise<ApiResponse<any>> {
    return makeApiRequest(CRM_ENDPOINTS.AUTH_REFRESH, {
      method: 'POST'
    })
  }

  /**
   * Validate auth token
   */
  static async validateToken(): Promise<ApiResponse<any>> {
    return makeApiRequest(CRM_ENDPOINTS.AUTH_VALIDATE)
  }

  /**
   * Logout from CRM system
   */
  static async logout(): Promise<void> {
    try {
      await makeApiRequest(CRM_ENDPOINTS.AUTH_LOGOUT, {
        method: 'POST'
      })
    } catch (error) {
      console.warn('Logout API call failed, but clearing local session:', error)
    } finally {
      // Clear local auth data
      sessionStorage.removeItem('authToken')
      localStorage.removeItem('authToken')
    }
  }

  // === USER MANAGEMENT API METHODS ===

  /**
   * Lấy tất cả người dùng
   */
  static async getAllUsers(): Promise<ApiResponse<CrmUser[]>> {
    return makeApiRequest(CRM_ENDPOINTS.USERS_ALL)
  }

  /**
   * Lấy profile người dùng hiện tại
   */
  static async getUserProfile(): Promise<ApiResponse<CrmUser>> {
    return makeApiRequest(CRM_ENDPOINTS.USERS_PROFILE)
  }

  /**
   * Tạo người dùng mới
   */
  static async createUser(data: Omit<CrmUser, 'id'>): Promise<ApiResponse<CrmUser>> {
    return makeApiRequest(CRM_ENDPOINTS.USERS_CREATE, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  /**
   * Cập nhật thông tin người dùng
   */
  static async updateUser(id: number, data: Partial<CrmUser>): Promise<ApiResponse<CrmUser>> {
    return makeApiRequest(CRM_ENDPOINTS.USERS_UPDATE, {
      method: 'PUT',
      body: JSON.stringify({ id, ...data })
    })
  }

  /**
   * Xóa người dùng
   */
  static async deleteUser(id: number): Promise<ApiResponse<void>> {
    return makeApiRequest(CRM_ENDPOINTS.USERS_DELETE, {
      method: 'DELETE',
      body: JSON.stringify({ id })
    })
  }
}

// Export for backwards compatibility
export default CrmApiService
