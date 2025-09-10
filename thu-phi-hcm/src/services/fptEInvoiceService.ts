export interface FPTEInvoiceUser {
  username: string;
  password: string;
}

export interface FPTEInvoiceItem {
  line: number;
  type: string;
  vrt: string;
  code: string;
  name: string;
  unit: string;
  price: number;
  quantity: number;
  perdiscount: number;
  amtdiscount: number;
  amount: number;
  vat: number;
  total: number;
}

export interface FPTEInvoiceRequest {
  lang: string;
  user: FPTEInvoiceUser;
  toKhaiId: number | null;
  inv: {
    sid: string;
    idt: string;
    type: string;
    form: string;
    serial: string;
    seq: string;
    ma_cqthu: string;
    bname: string;
    btax: string;
    btel: string;
    bmail: string;
    idnumber: string;
    note: string;
    sumv: number;
    sum: number;
    vatv: number;
    vat: number;
    word: string;
    totalv: number;
    total: number;
    tradeamount: number;
    discount: string;
    type_ref: number;
    notsendmail: number;
    sendfile: number;
    sec: string;
    paym: string;
    items: FPTEInvoiceItem[];
    stax: string;
  };
}

export interface FPTEInvoiceResponse {
  success: boolean;
  data?: {
    id: string;
    status: number;
    message?: string;
    base64Data?: string;
    base64Image?: string;
    image?: string;
    pdf?: string;
  };
  error?: string;
}

export interface FPTEInvoiceSearchRequest {
  stax: string;
  type: string;
  sid: string;
  user: {
    username: string;
    password: string;
  };
  toKhaiId: number;
}

export interface FPTEInvoiceUpdateStatusRequest {
  id: number;
}


class FPTEInvoiceService {
  private baseUrl = '/api';

  async createICR(request: FPTEInvoiceRequest): Promise<FPTEInvoiceResponse> {
    try {
      console.log('🔍 FPT E-Invoice API Request:', request);
      
      const response = await fetch(`${this.baseUrl}/fpt-einvoice/create-icr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      console.log('🔍 FPT E-Invoice API Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔍 FPT E-Invoice API Error:', errorText);
        return {
          success: false,
          error: `HTTP ${response.status}: ${errorText}`
        };
      }

      const responseData = await response.json();
      console.log('🔍 FPT E-Invoice API Response data:', responseData);

      return {
        success: true,
        data: responseData
      };
    } catch (error) {
      console.error('🔍 FPT E-Invoice API Exception:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }


  async searchICR(request: FPTEInvoiceSearchRequest): Promise<FPTEInvoiceResponse> {
    try {
      console.log('🔍 FPT E-Invoice Search API Request:', request);
      
      const response = await fetch(`${this.baseUrl}/fpt-einvoice/search-icr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      console.log('🔍 FPT E-Invoice Search API Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔍 FPT E-Invoice Search API Error:', errorText);
        return {
          success: false,
          error: `HTTP ${response.status}: ${errorText}`
        };
      }

      const responseData = await response.json();
      console.log('🔍 FPT E-Invoice Search API Response data:', responseData);

      return {
        success: true,
        data: responseData
      };
    } catch (error) {
      console.error('🔍 FPT E-Invoice Search API Exception:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async updateTrangThaiPhatHanh(request: FPTEInvoiceUpdateStatusRequest): Promise<FPTEInvoiceResponse> {
    try {
      console.log('🔍 FPT E-Invoice Update Status API Request:', request);
      
      const response = await fetch(`${this.baseUrl}/fpt-einvoice/update-trang-thai-phat-hanh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      console.log('🔍 FPT E-Invoice Update Status API Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔍 FPT E-Invoice Update Status API Error:', errorText);
        return {
          success: false,
          error: `HTTP ${response.status}: ${errorText}`
        };
      }

      const responseData = await response.json();
      console.log('🔍 FPT E-Invoice Update Status API Response data:', responseData);

      return {
        success: true,
        data: responseData
      };
    } catch (error) {
      console.error('🔍 FPT E-Invoice Update Status API Exception:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export const fptEInvoiceService = new FPTEInvoiceService();

