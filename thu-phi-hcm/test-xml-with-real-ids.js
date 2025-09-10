/**
 * Test XML Generate với ID thật từ hệ thống
 */

const API_BASE = 'http://10.14.122.24:8081/PHT_BE';

async function testXmlWithRealIds() {
  try {
    console.log('🔍 Testing XML Generate với ID thật từ hệ thống:');
    console.log('═'.repeat(60));
    
    // 1. Lấy danh sách tờ khai có sẵn
    console.log('📋 Step 1: Lấy danh sách tờ khai...');
    const listResponse = await fetch(`${API_BASE}/api/tokhai-thongtin/all`);
    const listData = await listResponse.json();
    
    if (listData.data && listData.data.length > 0) {
      // Lấy vài ID đầu tiên
      const testRecords = listData.data.slice(0, 5);
      console.log(`✅ Found ${testRecords.length} records to test:`);
      testRecords.forEach((record, idx) => {
        console.log(`   ${idx + 1}. ID=${record.id} | Status="${record.trangThai}" | ${record.tenDoanhNghiepKhaiPhi}`);
      });
      
      console.log('\n📄 Step 2: Test XML Generate...');
      
      // Test với từng record
      for (const record of testRecords) {
        console.log(`\n🎯 Testing ID=${record.id} (Status: "${record.trangThai}"):`);
        console.log('─'.repeat(50));
        
        const xmlData = {
          toKhaiId: record.id,
          lanKy: 1
        };
        
        try {
          const xmlResponse = await fetch(`${API_BASE}/api/xml-generate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(xmlData)
          });
          
          console.log(`📡 Response Status: ${xmlResponse.status}`);
          const xmlResult = await xmlResponse.json();
          
          if (xmlResponse.status === 200) {
            console.log('✅ XML Generate SUCCESS!');
            console.log(`   📊 Status: ${xmlResult.status}`);
            console.log(`   📄 Message: ${xmlResult.message}`);
            console.log(`   ⏱️  Execution Time: ${xmlResult.executionTime}ms`);
            
            if (xmlResult.data) {
              if (typeof xmlResult.data === 'string' && xmlResult.data.length > 0) {
                console.log(`   📄 XML Length: ${xmlResult.data.length} characters`);
                if (xmlResult.data.startsWith('<?xml')) {
                  console.log(`   ✅ Valid XML Format`);
                  console.log(`   📄 XML Preview: ${xmlResult.data.substring(0, 150)}...`);
                } else {
                  console.log(`   📄 Content Preview: ${xmlResult.data.substring(0, 100)}...`);
                }
              } else if (typeof xmlResult.data === 'object') {
                console.log(`   📄 XML Data Object:`, Object.keys(xmlResult.data));
              }
            }
            
            break; // Found working example, stop testing
            
          } else if (xmlResponse.status === 404) {
            console.log('❌ Not Found (404)');
            if (xmlResult.message) {
              console.log(`   📄 Message: ${xmlResult.message}`);
            }
          } else if (xmlResponse.status === 400) {
            console.log('❌ Bad Request (400)');
            console.log(`   📄 Message: ${xmlResult.message || 'N/A'}`);
            if (xmlResult.errors) {
              console.log(`   📝 Errors:`, xmlResult.errors);
            }
          } else if (xmlResponse.status === 500) {
            console.log('❌ Server Error (500)');
            console.log(`   📄 Message: ${xmlResult.message || 'N/A'}`);
          } else {
            console.log(`❌ Unexpected Status: ${xmlResponse.status}`);
            console.log(`   📄 Response:`, xmlResult);
          }
          
        } catch (error) {
          console.log(`💥 Error testing ID=${record.id}: ${error.message}`);
        }
      }
      
    } else {
      console.log('❌ No tờ khai records found to test');
    }
    
  } catch (error) {
    console.error('💥 Main Error:', error.message);
  }
  
  console.log('\n🎯 API Status Summary:');
  console.log('✅ POST /api/xml-generate endpoint tested with real IDs');
  console.log('📄 This API likely requires specific conditions:');
  console.log('   • Tờ khai must exist (✅ checked)');
  console.log('   • Tờ khai must be digitally signed');
  console.log('   • Tờ khai must be in correct status');
  console.log('   • Endpoint may not be fully implemented yet');
  
  console.log('\n📋 Next steps for investigation:');
  console.log('1. Check if endpoint /api/xml-generate exists in Swagger UI');
  console.log('2. Verify required status for XML generation');
  console.log('3. Test with digitally signed declarations');
  console.log('4. Confirm API implementation with backend team');
}

testXmlWithRealIds();
