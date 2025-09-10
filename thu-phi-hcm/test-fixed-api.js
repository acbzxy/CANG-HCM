/**
 * Script test để kiểm tra PHT_BE API endpoints
 * Test GET /api/tokhai-thongtin/all và POST /api/tokhai-thongtin/create
 * Hỗ trợ ApiDataResponse và ApiErrorResponse format
 * Chạy: node test-fixed-api.js
 */

import https from 'https';
import http from 'http';

// Test endpoints - cập nhật thành PHT_BE
const API_BASE = 'http://10.14.122.24:8081/PHT_BE';
const testEndpoints = [
  { 
    url: `${API_BASE}/api/tokhai-thongtin/all`,
    name: 'GET All Tờ khai thông tin - PHT_BE API',
    method: 'GET'
  },
  { 
    url: `${API_BASE}/api/tokhai-thongtin/1`,
    name: 'GET Tờ khai by ID - PHT_BE API (ID=1)',
    method: 'GET'
  },
  { 
    url: `${API_BASE}/api/tokhai-thongtin/999`,
    name: 'GET Tờ khai by ID - PHT_BE API (ID=999 - Test 404)',
    method: 'GET'
  },
  {
    url: `${API_BASE}/api/tokhai-thongtin/update-status`,
    name: 'PUT Update Status - PHT_BE API',
    method: 'PUT',
    data: {
      "id": 1,
      "trangThai": "02"
    }
  },
  {
    url: `${API_BASE}/api/chu-ky-so/ky-so`,
    name: 'POST Chữ ký số - PHT_BE API (Valid)',
    method: 'POST',
    data: {
      "toKhaiId": 1,
      "chuKySoId": "DIGITAL_CERT_001",
      "matKhau": "test123456"
    }
  },
  {
    url: `${API_BASE}/api/chu-ky-so/ky-so`,
    name: 'POST Chữ ký số - PHT_BE API (Invalid ID)',
    method: 'POST',
    data: {
      "toKhaiId": 0,
      "chuKySoId": "DIGITAL_CERT_001",
      "matKhau": "test123456"
    }
  },
  {
    url: `${API_BASE}/api/chu-ky-so/danh-sach`,
    name: 'GET Danh sách chữ ký số - PHT_BE API',
    method: 'GET'
  },
  {
    url: `${API_BASE}/api/xml-generate`,
    name: 'POST XML Generate - PHT_BE API (Valid)',
    method: 'POST',
    data: {
      "toKhaiId": 1,
      "lanKy": 1
    }
  },
  {
    url: `${API_BASE}/api/xml-generate`,
    name: 'POST XML Generate - PHT_BE API (Invalid ID)',
    method: 'POST',
    data: {
      "toKhaiId": 0,
      "lanKy": 1
    }
  },
  {
    url: `${API_BASE}/api/tokhai-thongtin/create`,
    name: 'Tờ khai thông tin - Create (POST)',
    method: 'POST',
    data: {
      "nguonTK": 0,
      "maDoanhNghiepKhaiPhi": "MST123456789",
      "tenDoanhNghiepKhaiPhi": "Công ty TNHH Test",
      "diaChiKhaiPhi": "123 Đường Test, Q1, TP.HCM",
      "maDoanhNghiepXNK": "XNK123456789",
      "tenDoanhNghiepXNK": "Công ty XNK Test",
      "diaChiXNK": "456 Đường XNK, Q3, TP.HCM",
      "soToKhai": "TK2025090800001",
      "ngayToKhai": "2025-09-08",
      "maHaiQuan": "HQ001",
      "maLoaiHinh": "LH001",
      "maLuuKho": "LK001",
      "nuocXuatKhau": "VN",
      "maPhuongThucVC": "PT001",
      "phuongTienVC": "Container",
      "maDiaDiemXepHang": "DD001",
      "maDiaDiemDoHang": "DD002",
      "maPhanLoaiHangHoa": "PL001",
      "mucDichVC": "Xuất khẩu",
      "soTiepNhanKhaiPhi": "TN001",
      "ngayKhaiPhi": "2025-09-08",
      "nhomLoaiPhi": "Phí cảng",
      "loaiThanhToan": "Chuyển khoản",
      "ghiChuKhaiPhi": "Test tạo tờ khai",
      "soThongBaoNopPhi": "TB001",
      "tongTienPhi": 500000,
      "trangThaiNganHang": "Chưa thanh toán",
      "soBienLai": "BL001",
      "ngayBienLai": "2025-09-08",
      "kyHieuBienLai": "KH001",
      "mauBienLai": "MB001",
      "maTraCuuBienLai": "TC001",
      "xemBienLai": "URL_BIEN_LAI",
      "loaiHangMienPhi": "",
      "loaiHang": "Container",
      "trangThai": "Mới tạo",
      "chiTietList": [
        {
          "soVanDon": "VD001",
          "soHieu": "SH001",
          "soSeal": "SEAL001",
          "loaiCont": "20RF",
          "tinhChatCont": "FCL",
          "tongTrongLuong": 15000,
          "donViTinh": "KG",
          "ghiChu": "Hàng điện tử"
        }
      ]
    }
  },
  { 
    url: `${API_BASE}/swagger-ui/index.html`,
    name: 'Swagger UI',
    method: 'GET'
  }
];
// Helper function to make HTTP request
function makeRequest(url, method = 'GET', timeout = 5000, postData = null) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: method,
      timeout: timeout,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'Thu-Phi-HCM-Test/1.0'
      }
    };

    // Add Content-Length for POST and PUT requests
    if (postData && (method === 'POST' || method === 'PUT')) {
      const postDataString = JSON.stringify(postData);
      options.headers['Content-Length'] = Buffer.byteLength(postDataString);
    }

    const req = client.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve({
          status: res.statusCode,
          statusMessage: res.statusMessage,
          headers: res.headers,
          data: data.substring(0, 1000) // Increase limit for POST responses
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    // Write POST/PUT data if provided
    if (postData && (method === 'POST' || method === 'PUT')) {
      req.write(JSON.stringify(postData));
    }

    req.end();
  });
}

// Test function
async function testAPI() {
  console.log('🔍 Testing CRM API endpoints...\n');

  for (const endpoint of testEndpoints) {
    try {
      console.log(`📡 Testing: ${endpoint.name}`);
      console.log(`   URL: ${endpoint.url}`);
      if ((endpoint.method === 'POST' || endpoint.method === 'PUT') && endpoint.data) {
        console.log(`   📤 ${endpoint.method} Data: ${JSON.stringify(endpoint.data).substring(0, 200)}...`);
      }
      
      const startTime = Date.now();
      const result = await makeRequest(endpoint.url, endpoint.method, 10000, endpoint.data);
      const duration = Date.now() - startTime;
      
       if (result.status === 200 || result.status === 201) {
         console.log(`   ✅ SUCCESS - Status: ${result.status} (${duration}ms)`);
         if (endpoint.name.includes('Tờ khai')) {
           // Parse JSON to show PHT_BE API response structure
           try {
             const jsonData = JSON.parse(result.data);
             console.log(`   📊 PHT_BE Response:`, {
               status: jsonData.status,
               message: jsonData.message,
               requestId: jsonData.requestId,
               executionTime: jsonData.executionTime + 'ms',
               dataType: Array.isArray(jsonData.data) ? 'Array' : typeof jsonData.data,
               dataLength: Array.isArray(jsonData.data) ? jsonData.data.length : 0,
               recordId: jsonData.data?.id || 'N/A'
             });
             
             // Hiển thị thông tin error nếu có
             if (jsonData.errors && jsonData.errors.length > 0) {
               console.log(`   ⚠️  Errors: ${jsonData.errors.join(', ')}`);
             }
           } catch (e) {
             console.log(`   📄 Raw response: ${result.data.substring(0, 200)}...`);
           }
         }
       } else if (result.status === 404) {
         console.log(`   🔍 NOT FOUND - Status: ${result.status} (${duration}ms)`);
         
         // Try to parse 404 error response from PHT_BE API
         try {
           const errorData = JSON.parse(result.data);
           console.log(`   📊 PHT_BE 404 Response:`, {
             status: errorData.status,
             message: errorData.message,
             requestId: errorData.requestId,
             path: errorData.path,
             errors: errorData.errors || [],
             error: errorData.error
           });
         } catch (e) {
           console.log(`   📄 HTML 404 response (endpoint not implemented or ID not found)`);
           console.log(`   📄 Raw response: ${result.data.substring(0, 150)}...`);
         }
       } else {
         console.log(`   ❌ FAILED - Status: ${result.status} ${result.statusMessage} (${duration}ms)`);
         
         // Try to parse error response from PHT_BE API
         try {
           const errorData = JSON.parse(result.data);
           console.log(`   📊 PHT_BE Error Response:`, {
             status: errorData.status,
             message: errorData.message,
             requestId: errorData.requestId,
             path: errorData.path,
             errors: errorData.errors || [],
             error: errorData.error
           });
         } catch (e) {
           console.log(`   📄 Raw response: ${result.data.substring(0, 300)}...`);
         }
       }
      
    } catch (error) {
      console.log(`   💥 ERROR: ${error.message}`);
    }
    
    console.log(''); // Empty line
  }

  console.log('🏁 Test completed!');
   console.log('\n🎯 Next steps if API works:');
   console.log('1. ✅ GET /api/tokhai-thongtin/all - Load danh sách tờ khai');
   console.log('2. ✅ POST /api/tokhai-thongtin/create - Tạo tờ khai mới');
   console.log('3. 📱 Open browser: http://localhost:5173');
   console.log('4. 🔍 Navigate to Declare page and test form submission');
   console.log('5. 📊 Check if API integration works properly');
}

// Run test
testAPI().catch(console.error);
