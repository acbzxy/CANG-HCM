/**
 * Demo API XML Generate - PHT_BE Backend
 * Test API tạo XML từ tờ khai thông tin
 * Chạy: node demo-xml-generate.js
 */

const API_BASE = 'http://10.14.122.24:8081/PHT_BE';

// Test cases để demo
const testCases = [
  {
    description: 'Valid XML generation - ID=1, lanKy=1 (First signature)',
    data: {
      "toKhaiId": 1,
      "lanKy": 1
    }
  },
  {
    description: 'Valid XML generation - ID=2, lanKy=1 (Different declaration)',
    data: {
      "toKhaiId": 2,
      "lanKy": 1
    }
  },
  {
    description: 'Second signature - ID=1, lanKy=2 (Second XML generation)',
    data: {
      "toKhaiId": 1,
      "lanKy": 2
    }
  },
  {
    description: 'Invalid toKhaiId - ID=0 (should return 400)',
    data: {
      "toKhaiId": 0,
      "lanKy": 1
    }
  },
  {
    description: 'Invalid lanKy - lanKy=0 (should return 400)',
    data: {
      "toKhaiId": 1,
      "lanKy": 0
    }
  },
  {
    description: 'Non-existent declaration - ID=999 (should return 404)',
    data: {
      "toKhaiId": 999,
      "lanKy": 1
    }
  }
];

async function callXmlGenerateAPI(testCase) {
  console.log(`📄 Test: ${testCase.description}`);
  console.log('─'.repeat(70));
  console.log(`📞 API Request: POST ${API_BASE}/api/xml-generate`);
  console.log(`📤 Request Body:`, JSON.stringify(testCase.data, null, 2));

  try {
    const response = await fetch(`${API_BASE}/api/xml-generate`, {
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
      console.log('✅ XML tạo thành công!');
      console.log(`🔍 API Status: ${result.status}`);
      console.log(`🔍 Message: ${result.message || 'N/A'}`);
      console.log(`🔍 Request ID: ${result.requestId || 'N/A'}`);
      console.log(`🔍 Execution Time: ${result.executionTime || 0}ms`);
      console.log(`🔍 Timestamp: ${result.timestamp || 'N/A'}`);
      console.log(`🔍 Path: ${result.path || 'N/A'}`);
      
      // Analyze XML data
      if (result.data) {
        console.log(`\n📄 XML Data Analysis:`);
        
        if (typeof result.data === 'string') {
          console.log(`   📊 Data Type: String`);
          console.log(`   📏 XML Length: ${result.data.length} characters`);
          
          if (result.data.startsWith('<?xml')) {
            console.log(`   ✅ Valid XML Format: Starts with <?xml`);
            
            // Extract XML root element
            const rootMatch = result.data.match(/<([^?\s>]+)/);
            if (rootMatch) {
              console.log(`   📋 Root Element: <${rootMatch[1]}>`);
            }
            
            // Show XML preview
            console.log(`   📄 XML Preview (first 300 chars):`);
            console.log(`   ${result.data.substring(0, 300)}...`);
            
            // Check for common XML elements
            const commonElements = ['Header', 'Data', 'ThongTinChungTu', 'Signature'];
            commonElements.forEach(element => {
              if (result.data.includes(`<${element}`)) {
                console.log(`   ✅ Contains <${element}> element`);
              }
            });
            
          } else {
            console.log(`   ⚠️  Non-XML String Format`);
            console.log(`   📄 Content Preview: ${result.data.substring(0, 200)}...`);
          }
          
        } else if (typeof result.data === 'object') {
          console.log(`   📊 Data Type: Object`);
          console.log(`   📋 Object Keys: ${Object.keys(result.data).join(', ')}`);
          console.log(`   📄 Object Content:`, JSON.stringify(result.data, null, 2));
        } else {
          console.log(`   📊 Data Type: ${typeof result.data}`);
          console.log(`   📄 Data Value:`, result.data);
        }
      } else {
        console.log(`\n📄 XML Data: null or undefined`);
      }
      
    } else {
      // Handle error responses (400, 404, 500)
      console.log('❌ XML generation failed:');
      console.log(`🔍 API Status: ${result.status}`);
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
        console.log(`📝 Có thể là: Dữ liệu request không hợp lệ hoặc trạng thái tờ khai không phù hợp`);
      } else if (response.status === 404) {
        console.log(`📝 Có thể là: Tờ khai với ID ${testCase.data.toKhaiId} không tồn tại`);
      } else if (response.status === 500) {
        console.log(`📝 Có thể là: Lỗi hệ thống khi tạo XML hoặc thiếu dữ liệu cần thiết`);
      }
    }

  } catch (error) {
    console.log('💥 Network Error:');
    console.log(`📝 Error: ${error.message}`);
  }

  console.log(''); // Empty line for separation
}

async function runDemo() {
  console.log('🚀 Demo POST XML Generate - PHT_BE API');
  console.log(`📍 Base URL: ${API_BASE}`);
  console.log('═'.repeat(80));
  console.log('');
  console.log('📋 XML Generation Process:');
  console.log('   1️⃣ Create tờ khai (POST /api/tokhai-thongtin/create)');
  console.log('   2️⃣ Digital sign (POST /api/chu-ky-so/ky-so)');
  console.log('   3️⃣ Generate XML (POST /api/xml-generate) ← Testing this');
  console.log('   4️⃣ Submit to customs system');
  console.log('');

  // Run all test cases
  for (const testCase of testCases) {
    await callXmlGenerateAPI(testCase);
  }

  // Summary
  console.log('🎯 Summary:');
  console.log('✅ POST /api/xml-generate endpoint:');
  console.log('   🔹 200: Success - XML tạo thành công với data chứa XML content');
  console.log('   🔹 400: Bad Request - toKhaiId/lanKy không hợp lệ hoặc trạng thái không phù hợp');
  console.log('   🔹 404: Not Found - Tờ khai không tồn tại');
  console.log('   🔹 500: Server Error - Lỗi hệ thống khi tạo XML');
  console.log('   🔹 Request body: { "toKhaiId": number, "lanKy": number }');
  console.log('   🔹 Method generateXml() có full client validation');
  
  console.log('\n📖 Usage in Frontend:');
  console.log('```typescript');
  console.log('const xmlResult = await CrmApiService.generateXml({');
  console.log('  toKhaiId: 1,');
  console.log('  lanKy: 1  // First signature');
  console.log('});');
  console.log('');
  console.log('if (xmlResult.status === 200) {');
  console.log('  const xmlContent = xmlResult.data;');
  console.log('  console.log("XML generated successfully:", xmlContent);');
  console.log('  // Save or submit XML to customs system');
  console.log('} else {');
  console.log('  console.error("XML generation failed:", xmlResult.message);');
  console.log('}');
  console.log('```');

  console.log('\n🔄 Workflow Integration:');
  console.log('```typescript');
  console.log('// Complete workflow example');
  console.log('const workflow = async (declarationData) => {');
  console.log('  // 1. Create declaration');
  console.log('  const created = await CrmApiService.createToKhaiThongTin(declarationData);');
  console.log('  ');
  console.log('  // 2. Digital sign');
  console.log('  await CrmApiService.kyTenSoToKhai({');
  console.log('    toKhaiId: created.data.id,');
  console.log('    chuKySoId: "CERT001",');
  console.log('    matKhau: "password"');
  console.log('  });');
  console.log('  ');
  console.log('  // 3. Generate XML');
  console.log('  const xml = await CrmApiService.generateXml({');
  console.log('    toKhaiId: created.data.id,');
  console.log('    lanKy: 1');
  console.log('  });');
  console.log('  ');
  console.log('  return xml.data; // XML content ready for submission');
  console.log('};');
  console.log('```');
}

// Run demo
runDemo().catch(console.error);
