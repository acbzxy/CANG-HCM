/**
 * Tìm tờ khai có Status = "01" để test ký số
 */

const API_BASE = 'http://10.14.122.24:8081/PHT_BE';

async function findStatus01Records() {
  try {
    const response = await fetch(`${API_BASE}/api/tokhai-thongtin/all`);
    const data = await response.json();
    
    console.log('🔍 Tìm tờ khai có Status = "01" (có thể ký số):');
    console.log('═'.repeat(60));
    
    const status01Records = data.data.filter(r => r.trangThai === '01');
    
    if (status01Records.length > 0) {
      console.log(`✅ Tìm thấy ${status01Records.length} tờ khai có thể ký số:`);
      console.log('');
      
      status01Records.forEach((r, index) => {
        console.log(`${index + 1}. ID=${r.id} | Status: ${r.trangThai}`);
        console.log(`   🏢 Company: ${r.tenDoanhNghiepKhaiPhi}`);
        console.log(`   📄 Số TK: ${r.soToKhai}`);
        console.log(`   💰 Fee: ${r.tongTienPhi} VNĐ`);
        console.log('');
      });
      
      // Test ký số với record đầu tiên
      const firstRecord = status01Records[0];
      console.log(`🎯 Test ký số với ID=${firstRecord.id}:`);
      console.log('─'.repeat(50));
      
      const signData = {
        "toKhaiId": firstRecord.id,
        "chuKySoId": "TEST_DIGITAL_CERT_001",
        "matKhau": "test123456"
      };
      
      console.log(`📤 Request: POST /api/chu-ky-so/ky-so`);
      console.log(`   Body:`, JSON.stringify(signData, null, 2));
      
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
        console.log('✅ KÝ SỐ THÀNH CÔNG!');
        console.log(`   📊 Status: ${signResult.status}`);
        console.log(`   📄 Message: ${signResult.message}`);
        console.log(`   ⏱️  Execution Time: ${signResult.executionTime}ms`);
        console.log(`   🔍 Request ID: ${signResult.requestId || 'N/A'}`);
        console.log(`   📊 Data:`, JSON.stringify(signResult.data, null, 2));
      } else {
        console.log('❌ Ký số thất bại:');
        console.log(`   📄 Message: ${signResult.message}`);
        console.log(`   📝 Error: ${signResult.error || 'N/A'}`);
        if (signResult.errors) {
          console.log(`   📝 Errors:`, signResult.errors);
        }
      }
      
    } else {
      console.log('❌ Không tìm thấy tờ khai nào có Status = "01"');
      console.log('');
      console.log('📊 Phân bố trạng thái hiện có:');
      const statusCount = {};
      data.data.forEach(r => {
        statusCount[r.trangThai] = (statusCount[r.trangThai] || 0) + 1;
      });
      
      Object.entries(statusCount).forEach(([status, count]) => {
        console.log(`   Status "${status}": ${count} records`);
      });
    }
    
  } catch (error) {
    console.error('💥 Error:', error.message);
  }
}

findStatus01Records();
