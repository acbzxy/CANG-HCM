/**
 * Demo API Chữ ký số - PHT_BE Backend
 * Test các tính năng ký số tờ khai
 * Chạy: node demo-chu-ky-so.js
 */

const API_BASE = 'http://10.14.122.24:8081/PHT_BE';

// Test cases để demo
const testCases = [
  {
    description: 'Valid digital signature - ID=1, Certificate=DIGITAL_CERT_001',
    data: {
      "toKhaiId": 1,
      "chuKySoId": "DIGITAL_CERT_001",
      "matKhau": "test123456"
    }
  },
  {
    description: 'Valid digital signature - ID=3, Certificate=DIGITAL_CERT_ABC',
    data: {
      "toKhaiId": 3,
      "chuKySoId": "DIGITAL_CERT_ABC",
      "matKhau": "password123"
    }
  },
  {
    description: 'Invalid toKhaiId - ID=0 (should return 400)',
    data: {
      "toKhaiId": 0,
      "chuKySoId": "DIGITAL_CERT_001",
      "matKhau": "test123456"
    }
  },
  {
    description: 'Missing chuKySoId (should return 400)',
    data: {
      "toKhaiId": 1,
      "chuKySoId": "",
      "matKhau": "test123456"
    }
  },
  {
    description: 'Missing matKhau (should return 400)',
    data: {
      "toKhaiId": 1,
      "chuKySoId": "DIGITAL_CERT_001",
      "matKhau": ""
    }
  },
  {
    description: 'Non-existent toKhaiId - ID=999 (test backend behavior)',
    data: {
      "toKhaiId": 999,
      "chuKySoId": "DIGITAL_CERT_001",
      "matKhau": "test123456"
    }
  }
];

async function callDigitalSignAPI(testCase) {
  console.log(`📞 Test: ${testCase.description}`);
  console.log('─'.repeat(50));
  console.log(`📞 API Request: POST ${API_BASE}/api/chu-ky-so/ky-so`);
  console.log(`📤 Request Body:`, JSON.stringify(testCase.data, null, 2));

  try {
    const response = await fetch(`${API_BASE}/api/chu-ky-so/ky-so`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Thu-Phi-HCM-Demo/1.0'
      },
      body: JSON.stringify(testCase.data)
    });

    console.log(`📡 Response Status: ${response.status}`);

    const result = await response.json();
    
    if (response.status === 200) {
      console.log('✅ API trả về thành công:');
      console.log(`🔍 Status: ${result.status}`);
      console.log(`🔍 Message: ${result.message || 'N/A'}`);
      console.log(`🔍 Request ID: ${result.requestId || 'N/A'}`);
      console.log(`🔍 Execution Time: ${result.executionTime || 0}ms`);
      console.log(`🔍 Timestamp: ${result.timestamp || 'N/A'}`);
      console.log(`🔍 Path: ${result.path || 'N/A'}`);
      
      if (result.data && Object.keys(result.data).length > 0) {
        console.log(`📊 Response Data:`, JSON.stringify(result.data, null, 2));
      } else {
        console.log(`📊 Response Data: {} (empty object - expected for signature operation)`);
      }
    } else {
      // Handle error responses (400, 500)
      console.log('❌ Server Error:');
      console.log(`🔍 Status: ${result.status}`);
      console.log(`🔍 Message: ${result.message || 'N/A'}`);
      console.log(`🔍 Request ID: ${result.requestId || 'N/A'}`);
      console.log(`🔍 Path: ${result.path || 'N/A'}`);
      
      if (result.errors && result.errors.length > 0) {
        console.log(`📝 Errors:`, result.errors);
      }
      if (result.error) {
        console.log(`📝 Error Details: ${result.error}`);
      }
      
      // Additional context for common errors
      if (response.status === 400) {
        console.log(`📝 Có thể là: Dữ liệu không hợp lệ hoặc thiếu thông tin bắt buộc`);
      } else if (response.status === 500) {
        console.log(`📝 Có thể là: Tờ khai không tồn tại, chữ ký số không hợp lệ, hoặc lỗi hệ thống`);
      }
    }

  } catch (error) {
    console.log('💥 Network Error:');
    console.log(`📝 Error: ${error.message}`);
  }

  console.log(''); // Empty line for separation
}

async function runDemo() {
  console.log('🚀 Demo POST Chữ ký số - PHT_BE API');
  console.log(`📍 Base URL: ${API_BASE}`);
  console.log('═'.repeat(70));
  console.log('');

  // Run all test cases
  for (const testCase of testCases) {
    await callDigitalSignAPI(testCase);
  }

  // Summary
  console.log('🎯 Summary:');
  console.log('✅ POST /api/chu-ky-so/ky-so endpoint supports:');
  console.log('   🔹 200: Success - ApiDataResponse với data = {}');
  console.log('   🔹 400: Bad Request - Validation errors cho toKhaiId/chuKySoId/matKhau');
  console.log('   🔹 500: Server Error - Tờ khai không tồn tại hoặc lỗi ký số');
  console.log('   🔹 Request body: { "toKhaiId": number, "chuKySoId": string, "matKhau": string }');
  console.log('   🔹 Method kyTenSoToKhai() có full client validation');
}

// Run demo
runDemo().catch(console.error);
