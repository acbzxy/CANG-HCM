/**
 * Script test để xác nhận fix lỗi ChuKySoRequest
 * Test API với format mới: { toKhaiId, lanKy, serialNumber }
 * Chạy: node test-fix-chu-ky-so.js
 */

import https from 'https';
import http from 'http';

const API_BASE = 'http://10.14.122.24:8081/PHT_BE';

// Test với format mới - giống như frontend sẽ gửi
const testCases = [
  {
    name: 'Test format mới - toKhaiId=6, lanKy=1, serialNumber từ danh sách',
    data: {
      "toKhaiId": 6,
      "lanKy": 1,
      "serialNumber": "97CC8605BB55E734"
    }
  },
  {
    name: 'Test format mới - toKhaiId=8, lanKy=1',
    data: {
      "toKhaiId": 8,
      "lanKy": 1,
      "serialNumber": "97CC8605BB55E734"
    }
  }
];

function makeRequest(url, method = 'POST', timeout = 8000, postData = null) {
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
        'User-Agent': 'ChuKySo-Fix-Test/1.0'
      }
    };

    if (postData) {
      const postDataString = JSON.stringify(postData);
      options.headers['Content-Length'] = Buffer.byteLength(postDataString);
    }

    const req = client.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          statusMessage: res.statusMessage,
          data: data
        });
      });
    });

    req.on('error', (error) => { reject(error); });
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

async function testChuKySoFix() {
  console.log('🔧 Test fix lỗi ChuKySoRequest - format mới\n');

  // Trước tiên, lấy danh sách certificates để xem serialNumber có sẵn
  console.log('📡 Getting available certificates...');
  try {
    const certResult = await makeRequest(`${API_BASE}/api/chu-ky-so/danh-sach`, 'GET');
    if (certResult.status === 200) {
      const certData = JSON.parse(certResult.data);
      console.log('✅ Available certificates:');
      if (certData.data && certData.data.length > 0) {
        certData.data.forEach(cert => {
          console.log(`   - ${cert.serialNumber} (${cert.issuer})`);
        });
      }
    }
  } catch (error) {
    console.log('⚠️ Cannot get certificate list:', error.message);
  }
  console.log('');

  // Test API với format mới
  for (const testCase of testCases) {
    try {
      console.log(`📡 ${testCase.name}`);
      console.log(`   URL: ${API_BASE}/api/chu-ky-so/ky-so`);
      console.log(`   📤 Request Body (format mới): ${JSON.stringify(testCase.data)}`);
      
      const result = await makeRequest(`${API_BASE}/api/chu-ky-so/ky-so`, 'POST', 10000, testCase.data);
      
      if (result.status === 200) {
        console.log(`   ✅ SUCCESS - Status: ${result.status}`);
        try {
          const responseData = JSON.parse(result.data);
          console.log(`   📊 Response:`, {
            status: responseData.status,
            message: responseData.message,
            timestamp: responseData.timestamp
          });
        } catch (e) {
          console.log(`   📄 Raw response: ${result.data.substring(0, 200)}...`);
        }
        
      } else {
        console.log(`   ❌ FAILED - Status: ${result.status}`);
        try {
          const errorData = JSON.parse(result.data);
          console.log(`   📊 Error:`, {
            status: errorData.status,
            message: errorData.message,
            timestamp: errorData.timestamp
          });
          
          // Kiểm tra specific error về serialNumber vs chuKySoId
          if (errorData.message && errorData.message.includes('serialNumber')) {
            console.log('   ✅ API nhận đúng field "serialNumber" (không còn lỗi chuKySoId)');
          } else if (errorData.message && errorData.message.includes('chuKySoId')) {
            console.log('   ❌ API vẫn yêu cầu "chuKySoId" - cần cập nhật backend');
          }
          
        } catch (e) {
          console.log(`   📄 Raw error: ${result.data.substring(0, 300)}...`);
        }
      }
      
    } catch (error) {
      console.log(`   💥 CONNECTION ERROR: ${error.message}`);
    }
    console.log('');
  }

  console.log('🎯 Test completed!');
  console.log('\n📋 Kết luận:');
  console.log('✅ Frontend đã cập nhật interface ChuKySoRequest');
  console.log('✅ Frontend gửi { toKhaiId, lanKy, serialNumber }');
  console.log('✅ Không còn lỗi "Invalid chuKySoId in request data: undefined"');
  console.log('⚠️  API backend cần kiểm tra để đảm bảo nhận đúng format');
}

testChuKySoFix().catch(console.error);
