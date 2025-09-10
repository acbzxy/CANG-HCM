/**
 * Test ký số với các trạng thái có thể ký: "00", "NEW", "Mới tạo"
 */

const API_BASE = 'http://10.14.122.24:8081/PHT_BE';

async function testSignableStatuses() {
  try {
    console.log('🔍 Test ký số với các trạng thái có thể ký...');
    console.log('═'.repeat(70));
    
    // Lấy danh sách tờ khai
    const listResponse = await fetch(`${API_BASE}/api/tokhai-thongtin/all`);
    const listData = await listResponse.json();
    
    // Tìm tờ khai với các status có thể ký
    const signableStatuses = ['00', 'NEW', 'Mới tạo'];
    const signableRecords = listData.data.filter(r => signableStatuses.includes(r.trangThai));
    
    console.log(`📊 Tìm thấy ${signableRecords.length} tờ khai có thể ký số:`);
    signableRecords.forEach((r, idx) => {
      console.log(`   ${idx + 1}. ID=${r.id} | Status="${r.trangThai}" | ${r.tenDoanhNghiepKhaiPhi}`);
    });
    
    if (signableRecords.length === 0) {
      console.log('❌ Không có tờ khai nào với status có thể ký');
      return;
    }
    
    // Test ký số với từng record
    for (const record of signableRecords.slice(0, 3)) { // Test max 3 records
      console.log(`\n🎯 TEST KÝ SỐ - ID=${record.id}, Status="${record.trangThai}"`);
      console.log('─'.repeat(60));
      
      const signData = {
        toKhaiId: record.id,
        chuKySoId: "DIGITAL_CERTIFICATE_TEST_001",
        matKhau: "testpassword123"
      };
      
      console.log(`📤 Request Body:`, JSON.stringify(signData, null, 2));
      
      try {
        const signResponse = await fetch(`${API_BASE}/api/chu-ky-so/ky-so`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(signData)
        });
        
        const signResult = await signResponse.json();
        console.log(`📡 Response Status: ${signResponse.status}`);
        
        if (signResponse.status === 200) {
          console.log('✅ KÝ SỐ THÀNH CÔNG! 🎉');
          console.log(`   📊 API Status: ${signResult.status}`);
          console.log(`   📄 Message: ${signResult.message}`);
          console.log(`   ⏱️  Execution Time: ${signResult.executionTime}ms`);
          console.log(`   🔍 Request ID: ${signResult.requestId || 'N/A'}`);
          
          if (signResult.data && Object.keys(signResult.data).length > 0) {
            console.log(`   📊 Signed Data:`, JSON.stringify(signResult.data, null, 2));
          } else {
            console.log(`   📊 Signed Data: {} (Success - Empty response expected)`);
          }
          
          // Verify the signature by getting the record again
          console.log(`\n🔍 Verify ký số - Lấy lại record:`);
          const verifyResponse = await fetch(`${API_BASE}/api/tokhai-thongtin/${record.id}`);
          const verifyData = await verifyResponse.json();
          
          if (verifyData.data) {
            console.log(`   📊 Current Status: "${verifyData.data.trangThai}"`);
            console.log(`   🔐 Signature 1: ${verifyData.data.kylan1Xml ? 'Present' : 'Not found'}`);
            console.log(`   🔐 Signature 2: ${verifyData.data.kylan2Xml ? 'Present' : 'Not found'}`);
            
            if (verifyData.data.kylan1Xml) {
              console.log(`   📝 Signature Length: ${verifyData.data.kylan1Xml.length} characters`);
            }
          }
          
          break; // Found working status, stop testing
          
        } else {
          console.log(`❌ Ký số thất bại:`);
          console.log(`   📄 Message: ${signResult.message}`);
          console.log(`   📝 Error: ${signResult.error || 'N/A'}`);
          if (signResult.errors) {
            console.log(`   📝 Errors:`, signResult.errors);
          }
        }
        
      } catch (error) {
        console.log(`💥 Network Error: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('💥 Main Error:', error.message);
  }
}

testSignableStatuses();
