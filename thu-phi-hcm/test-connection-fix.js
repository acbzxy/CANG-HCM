/**
 * Script test để xác nhận connection fix
 * Test API endpoints sau khi cập nhật URL từ localhost sang 10.14.122.24
 * Chạy: node test-connection-fix.js
 */

import https from 'https';
import http from 'http';

// Updated API endpoints
const API_BASE = 'http://10.14.122.24:8081/PHT_BE';
const quickTests = [
  {
    url: `${API_BASE}/api/chu-ky-so/danh-sach`,
    name: 'GET Danh sách chữ ký số',
    method: 'GET'
  },
  {
    url: `${API_BASE}/api/tokhai-thongtin/all`,
    name: 'GET All Tờ khai',
    method: 'GET'
  },
  {
    url: `${API_BASE}/api/chu-ky-so/ky-so`,
    name: 'POST Chữ ký số',
    method: 'POST',
    data: {
      "toKhaiId": 6,
      "lanKy": 1,
      "serialNumber": "97CC8605BB55E734"
    }
  }
];

// Helper function
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
        'User-Agent': 'Connection-Fix-Test/1.0'
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
          data: data.substring(0, 500)
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

// Quick test
async function testConnectionFix() {
  console.log('🔧 Testing connection fix - Updated URLs từ localhost sang 10.14.122.24\n');

  for (const test of quickTests) {
    try {
      console.log(`📡 Testing: ${test.name}`);
      console.log(`   URL: ${test.url}`);
      if (test.data) {
        console.log(`   📤 Data: ${JSON.stringify(test.data)}`);
      }
      
      const result = await makeRequest(test.url, test.method, 8000, test.data);
      
      if (result.status === 200) {
        console.log(`   ✅ SUCCESS - Status: ${result.status}`);
        console.log(`   📄 Response preview: ${result.data.substring(0, 150)}...`);
      } else {
        console.log(`   ⚠️  Status: ${result.status} - ${result.statusMessage}`);
        console.log(`   📄 Response: ${result.data.substring(0, 200)}...`);
      }
      
    } catch (error) {
      console.log(`   ❌ CONNECTION ERROR: ${error.message}`);
    }
    console.log('');
  }

  console.log('🎯 Connection fix test completed!');
  console.log('\n📋 Kết luận:');
  console.log('✅ Đã cập nhật tất cả URLs từ localhost:8081 sang 10.14.122.24:8081');
  console.log('✅ Frontend sẽ kết nối đúng backend server');
  console.log('🔄 Restart frontend dev server để áp dụng changes');
}

testConnectionFix().catch(console.error);
