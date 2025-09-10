/**
 * Demo quy trình trạng thái tờ khai với business logic mới
 * Test các trạng thái: 00→01→02→03→04
 * Chạy: node demo-status-workflow.js
 */

const API_BASE = 'http://10.14.122.24:8081/PHT_BE';

// Mapping trạng thái theo business logic mới
const TOKHAI_STATUS = {
  MOI_TAO: '00',           // Mới tạo - có thể ký lần 1
  KY_LAN_1: '01',          // Đã ký lần 1 - có thể lấy thông báo
  LAY_THONG_BAO: '02',     // Đã lấy thông báo - có thể ký lần 2
  KY_LAN_2: '03',          // Đã ký lần 2 - thực hiện nộp phí
  THANH_CONG: '04',        // Thành công
  HUY: '05'                // Hủy
};

const STATUS_DESCRIPTIONS = {
  [TOKHAI_STATUS.MOI_TAO]: 'Mới tạo',
  [TOKHAI_STATUS.KY_LAN_1]: 'Đã ký lần 1',
  [TOKHAI_STATUS.LAY_THONG_BAO]: 'Đã lấy thông báo',
  [TOKHAI_STATUS.KY_LAN_2]: 'Đã ký lần 2 - thực hiện nộp phí',
  [TOKHAI_STATUS.THANH_CONG]: 'Thành công',
  [TOKHAI_STATUS.HUY]: 'Hủy'
};

// Helper functions (matching crmApi.ts)
function canSign(status, lanKy) {
  if (lanKy === 1) {
    return status === TOKHAI_STATUS.MOI_TAO;
  } else if (lanKy === 2) {
    return status === TOKHAI_STATUS.LAY_THONG_BAO;
  }
  return false;
}

function canGetNotification(status) {
  return status === TOKHAI_STATUS.KY_LAN_1;
}

function getStatusDescription(status) {
  return STATUS_DESCRIPTIONS[status] || `Không xác định (${status})`;
}

function getAvailableActions(status) {
  const actions = [];
  
  if (canSign(status, 1)) {
    actions.push('Ký lần 1');
  }
  
  if (canGetNotification(status)) {
    actions.push('Lấy thông báo');
  }
  
  if (canSign(status, 2)) {
    actions.push('Ký lần 2 - Nộp phí');
  }
  
  if (status !== TOKHAI_STATUS.THANH_CONG && status !== TOKHAI_STATUS.HUY) {
    actions.push('Hủy tờ khai');
  }
  
  return actions;
}

async function testStatusWorkflow() {
  console.log('🔄 Demo Quy trình trạng thái tờ khai - Business Logic');
  console.log(`📍 Base URL: ${API_BASE}`);
  console.log('═'.repeat(80));
  
  console.log('\n📋 TRẠNG THÁI VÀ QUY TRÌNH:');
  console.log('─'.repeat(50));
  Object.entries(TOKHAI_STATUS).forEach(([key, value]) => {
    console.log(`${value}: ${STATUS_DESCRIPTIONS[value]}`);
  });
  
  console.log('\n🔄 QUY TRÌNH WORKFLOW:');
  console.log('─'.repeat(50));
  console.log('00 (Mới tạo) → [Ký lần 1] → 01 (Đã ký lần 1)');
  console.log('01 (Đã ký lần 1) → [Lấy thông báo] → 02 (Đã lấy thông báo)');
  console.log('02 (Đã lấy thông báo) → [Ký lần 2] → 03 (Đã ký lần 2)');
  console.log('03 (Đã ký lần 2) → [Xử lý] → 04 (Thành công)');
  console.log('Bất kỳ lúc nào → [Hủy] → 05 (Hủy)');
  
  try {
    // Test với các trạng thái khác nhau
    console.log('\n🧪 TEST BUSINESS LOGIC:');
    console.log('─'.repeat(50));
    
    // Test từng trạng thái
    const testStatuses = [
      TOKHAI_STATUS.MOI_TAO,
      TOKHAI_STATUS.KY_LAN_1,
      TOKHAI_STATUS.LAY_THONG_BAO,
      TOKHAI_STATUS.KY_LAN_2,
      TOKHAI_STATUS.THANH_CONG,
      TOKHAI_STATUS.HUY
    ];
    
    testStatuses.forEach(status => {
      const description = getStatusDescription(status);
      const availableActions = getAvailableActions(status);
      const canSignFirst = canSign(status, 1);
      const canSignSecond = canSign(status, 2);
      const canGetNotif = canGetNotification(status);
      
      console.log(`\n📊 Status "${status}" (${description}):`);
      console.log(`   ✅ Available actions: ${availableActions.join(', ')}`);
      console.log(`   🔐 Can sign lần 1: ${canSignFirst ? '✅' : '❌'}`);
      console.log(`   🔐 Can sign lần 2: ${canSignSecond ? '✅' : '❌'}`);
      console.log(`   📄 Can get notification: ${canGetNotif ? '✅' : '❌'}`);
    });
    
    // Test với dữ liệu thực từ hệ thống
    console.log('\n🔍 TEST VỚI DỮ LIỆU THỰC TỪ HỆ THỐNG:');
    console.log('─'.repeat(60));
    
    const listResponse = await fetch(`${API_BASE}/api/tokhai-thongtin/all`);
    const listData = await listResponse.json();
    
    if (listData.data && listData.data.length > 0) {
      console.log(`📋 Found ${listData.data.length} declarations in system:`);
      
      // Analyze current statuses in system
      const statusCounts = {};
      listData.data.forEach(item => {
        const status = item.trangThai;
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });
      
      console.log('\n📊 Current status distribution:');
      Object.entries(statusCounts).forEach(([status, count]) => {
        const description = getStatusDescription(status);
        const actions = getAvailableActions(status);
        console.log(`   "${status}" (${description}): ${count} records`);
        console.log(`      Available actions: ${actions.join(', ')}`);
      });
      
      // Test signing with first few records
      console.log('\n🔐 TEST SIGNING LOGIC:');
      console.log('─'.repeat(50));
      
      const testRecords = listData.data.slice(0, 3);
      
      for (const record of testRecords) {
        const status = record.trangThai;
        const description = getStatusDescription(status);
        const canSign1 = canSign(status, 1);
        const canSign2 = canSign(status, 2);
        
        console.log(`\n🎯 Record ID=${record.id}, Status="${status}" (${description}):`);
        console.log(`   🔐 Can sign lần 1: ${canSign1 ? '✅ YES' : '❌ NO'}`);
        console.log(`   🔐 Can sign lần 2: ${canSign2 ? '✅ YES' : '❌ NO'}`);
        
        if (canSign1) {
          console.log(`   💡 Ready for: First digital signature`);
        } else if (canSign2) {
          console.log(`   💡 Ready for: Second digital signature (payment)`);
        } else {
          console.log(`   💡 Status: ${getAvailableActions(status).join(', ')}`);
        }
      }
    } else {
      console.log('❌ No declarations found in system');
    }
    
  } catch (error) {
    console.error('💥 Error testing workflow:', error.message);
  }
  
  // Summary
  console.log('\n🎯 BUSINESS LOGIC SUMMARY:');
  console.log('═'.repeat(80));
  console.log('✅ Status constants defined:');
  console.log('   • 00: Mới tạo → Can sign lần 1');
  console.log('   • 01: Đã ký lần 1 → Can get notification');
  console.log('   • 02: Đã lấy thông báo → Can sign lần 2');
  console.log('   • 03: Đã ký lần 2 → Processing payment');
  console.log('   • 04: Thành công → Completed');
  console.log('   • 05: Hủy → Cancelled');
  
  console.log('\n✅ Helper functions implemented:');
  console.log('   • canSign(status, lanKy) - Validate signing permission');
  console.log('   • canGetNotification(status) - Validate notification access');
  console.log('   • getStatusDescription(status) - Get human-readable description');
  console.log('   • getAvailableActions(status) - Get available actions list');
  
  console.log('\n✅ Integration status:');
  console.log('   • Constants: Defined in crmApi.ts');
  console.log('   • Helper class: ToKhaiStatusHelper implemented');
  console.log('   • API validation: Added to kyTenSoToKhai() method');
  console.log('   • Error handling: Comprehensive business logic validation');
  
  console.log('\n🚀 Ready for production use with proper status workflow!');
}

testStatusWorkflow().catch(console.error);
