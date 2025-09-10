/**
 * Demo API Danh sách chữ ký số - PHT_BE Backend
 * Test API lấy danh sách chứng chỉ số có sẵn trong hệ thống
 * Chạy: node demo-danh-sach-chu-ky-so.js
 */

const API_BASE = 'http://10.14.122.24:8081/PHT_BE';

async function testGetCertificateList() {
  console.log('🚀 Demo GET Danh sách chữ ký số - PHT_BE API');
  console.log(`📍 Base URL: ${API_BASE}`);
  console.log('═'.repeat(70));
  console.log('');

  try {
    console.log('📋 TEST: Lấy danh sách chữ ký số');
    console.log('─'.repeat(50));
    console.log(`📞 API Request: GET ${API_BASE}/api/chu-ky-so/danh-sach`);
    console.log(`📤 No request body (GET method)`);

    const response = await fetch(`${API_BASE}/api/chu-ky-so/danh-sach`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Thu-Phi-HCM-Demo/1.0'
      }
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
      
      // Analyze data response
      console.log(`\n📊 Data Analysis:`);
      if (result.data) {
        if (Array.isArray(result.data)) {
          console.log(`   📚 Data Type: Array`);
          console.log(`   📊 Total Certificates: ${result.data.length}`);
          
          if (result.data.length > 0) {
            console.log(`   📄 Sample Certificate(s):`);
            
            // Show first few certificates
            result.data.slice(0, 3).forEach((cert, index) => {
              console.log(`   ${index + 1}. Certificate:`, JSON.stringify(cert, null, 4));
            });
            
            if (result.data.length > 3) {
              console.log(`   ... và ${result.data.length - 3} chứng chỉ khác`);
            }
            
            // Analyze certificate structure
            const firstCert = result.data[0];
            console.log(`\n   🔍 Certificate Structure Analysis:`);
            console.log(`      📋 Fields: ${Object.keys(firstCert).join(', ')}`);
            
            // Common certificate fields to check
            const commonFields = ['id', 'name', 'chuKySoId', 'serialNumber', 'issuer', 'validFrom', 'validTo', 'status', 'owner'];
            commonFields.forEach(field => {
              if (firstCert.hasOwnProperty(field)) {
                console.log(`      ✅ ${field}: ${firstCert[field]}`);
              }
            });
            
          } else {
            console.log(`   📄 Empty List: Không có chứng chỉ số nào trong hệ thống`);
          }
          
        } else if (typeof result.data === 'object') {
          console.log(`   📚 Data Type: Object`);
          console.log(`   📄 Certificate Object:`, JSON.stringify(result.data, null, 2));
          console.log(`   🔍 Object Keys: ${Object.keys(result.data).join(', ')}`);
        } else {
          console.log(`   📚 Data Type: ${typeof result.data}`);
          console.log(`   📄 Data Value:`, result.data);
        }
      } else {
        console.log(`   📄 Data: null or undefined`);
      }
      
    } else {
      // Handle error responses (500)
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
      
      // Context for common errors
      if (response.status === 500) {
        console.log(`📝 Có thể là: Hệ thống chữ ký số chưa được cấu hình hoặc lỗi database`);
      }
    }

  } catch (error) {
    console.log('💥 Network Error:');
    console.log(`📝 Error: ${error.message}`);
  }

  // Summary and usage
  console.log('\n🎯 Summary:');
  console.log('✅ GET /api/chu-ky-so/danh-sach endpoint:');
  console.log('   🔹 200: Success - ApiDataResponse với danh sách chứng chỉ số');
  console.log('   🔹 500: Server Error - Lỗi hệ thống hoặc chưa cấu hình');
  console.log('   🔹 No parameters required');
  console.log('   🔹 Method getDanhSachChuKySo() đã được implement');
  
  console.log('\n📖 Usage in Frontend:');
  console.log('```typescript');
  console.log('const certificates = await CrmApiService.getDanhSachChuKySo();');
  console.log('if (certificates.status === 200) {');
  console.log('  console.log("Available certificates:", certificates.data);');
  console.log('} else {');
  console.log('  console.error("Error:", certificates.message);');
  console.log('}');
  console.log('```');
}

// Run demo
testGetCertificateList().catch(console.error);
