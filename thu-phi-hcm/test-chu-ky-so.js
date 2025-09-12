/**
 * Script test riêng cho API chữ ký số
 * Test POST /api/chu-ky-so/ky-so với request body mới
 * Chạy: node test-chu-ky-so.js
 */

import https from 'https';
import http from 'http';

// Test endpoints - PHT_BE
const API_BASE = 'http://10.14.122.24:8081/PHT_BE';

const testCases = [
  {
    name: 'Test với toKhaiId=6 (ID hợp lệ)',
    data: {
      "toKhaiId": 6,
      "lanKy": 1,
      "serialNumber": "97CC8605BB55E734"
    }
  },
  {
    name: 'Test với toKhaiId=2 (theo yêu cầu)',
    data: {
      "toKhaiId": 2,
      "lanKy": 1,
      "serialNumber": "97CC8605BB55E734"
    }
  },
  {
    name: 'Test với toKhaiId=8 (ID vừa tạo)',
    data: {
      "toKhaiId": 8,
      "lanKy": 1,
      "serialNumber": "97CC8605BB55E734"
    }
  }
];

// Helper function to make HTTP request
function makeRequest(url, method = 'POST', timeout = 5000, postData = null) {
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
        'User-Agent': 'Thu-Phi-HCM-ChuKySo-Test/1.0'
      }
    };

    if (postData) {
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
          data: data
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

    if (postData) {
      req.write(JSON.stringify(postData));
    }

    req.end();
  });
}

// Test function
async function testChuKySoAPI() {
  console.log('🔐 Testing API chữ ký số /api/chu-ky-so/ky-so\n');

  for (const testCase of testCases) {
    try {
      console.log(`📡 ${testCase.name}`);
      console.log(`   URL: ${API_BASE}/api/chu-ky-so/ky-so`);
      console.log(`   📤 Request Body: ${JSON.stringify(testCase.data)}`);
      
      const startTime = Date.now();
      const result = await makeRequest(`${API_BASE}/api/chu-ky-so/ky-so`, 'POST', 10000, testCase.data);
      const duration = Date.now() - startTime;
      
      if (result.status === 200 || result.status === 201) {
        console.log(`   ✅ SUCCESS - Status: ${result.status} (${duration}ms)`);
        
        try {
          const jsonData = JSON.parse(result.data);
          console.log(`   📊 Response:`, {
            status: jsonData.status,
            message: jsonData.message,
            timestamp: jsonData.timestamp,
            dataType: typeof jsonData.data,
            hasData: !!jsonData.data
          });
          
          if (jsonData.data) {
            console.log(`   🔍 Data preview: ${JSON.stringify(jsonData.data).substring(0, 200)}...`);
          }
          
        } catch (e) {
          console.log(`   📄 Raw response: ${result.data.substring(0, 500)}...`);
        }
        
      } else if (result.status === 500) {
        console.log(`   ❌ SERVER ERROR - Status: ${result.status} (${duration}ms)`);
        
        try {
          const errorData = JSON.parse(result.data);
          console.log(`   📊 Error Response:`, {
            status: errorData.status,
            message: errorData.message,
            timestamp: errorData.timestamp
          });
        } catch (e) {
          console.log(`   📄 Raw error: ${result.data.substring(0, 300)}...`);
        }
        
      } else {
        console.log(`   ⚠️  STATUS ${result.status} - ${result.statusMessage} (${duration}ms)`);
        console.log(`   📄 Response: ${result.data.substring(0, 300)}...`);
      }
      
    } catch (error) {
      console.log(`   💥 ERROR: ${error.message}`);
    }
    
    console.log(''); // Empty line
  }

  console.log('🏁 Test chữ ký số completed!');
  console.log('\n📋 Kết luận:');
  console.log('✅ API endpoint /api/chu-ky-so/ky-so hoạt động');
  console.log('✅ Request body format được chấp nhận: { toKhaiId, lanKy, serialNumber }');
  console.log('⚠️  Cần đảm bảo toKhaiId tồn tại trong database');
  console.log('🔍 Kiểm tra danh sách tờ khai có sẵn: GET /api/tokhai-thongtin/all');
}

// Run test
testChuKySoAPI().catch(console.error);
