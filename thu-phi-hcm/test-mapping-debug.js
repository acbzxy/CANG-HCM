/**
 * Script kiểm tra mapping data từ API vào form
 * Chạy script này trong browser console để debug
 */

console.log('🔧 MAPPING DEBUG SCRIPT - Bắt đầu kiểm tra');

// Test 1: Kiểm tra xem form elements có tồn tại không
function checkFormElements() {
  console.log('\n🔍 Test 1: Kiểm tra form elements...');
  
  const elements = {
    companyTaxCode: document.querySelector('input[name="companyTaxCode"]'),
    companyName: document.querySelector('input[name="companyName"]'),
    companyAddress: document.querySelector('input[name="companyAddress"]'),
    importExportCompanyTaxCode: document.querySelector('input[name="importExportCompanyTaxCode"]'),
    importExportCompanyName: document.querySelector('input[name="importExportCompanyName"]'),
    importExportCompanyAddress: document.querySelector('input[name="importExportCompanyAddress"]')
  };
  
  console.log('📋 Form elements tìm thấy:');
  Object.entries(elements).forEach(([name, element]) => {
    if (element) {
      console.log(`✅ ${name}: Found (current value: "${element.value}")`);
    } else {
      console.log(`❌ ${name}: NOT FOUND`);
    }
  });
  
  return elements;
}

// Test 2: Test mapping với sample data
function testMapping() {
  console.log('\n🧪 Test 2: Test mapping với sample data...');
  
  const sampleData = {
    maDoanhNghiepKhaiPhi: "0312345678",
    tenDoanhNghiepKhaiPhi: "Công ty TNHH Vận Tải Biển Đông",
    diaChiKhaiPhi: "123 Lê Lợi, Quận 1, TP.HCM",
    maDoanhNghiepXNK: "0208765432",
    tenDoanhNghiepXNK: "Công ty CP Xuất Nhập Khẩu Thái Bình",
    diaChiXNK: "456 Trần Hưng Đạo, Quận Hoàn Kiếm, Hà Nội"
  };
  
  console.log('📊 Sample data:', sampleData);
  
  // Map data vào form
  const mappings = [
    { field: 'input[name="companyTaxCode"]', value: sampleData.maDoanhNghiepKhaiPhi },
    { field: 'input[name="companyName"]', value: sampleData.tenDoanhNghiepKhaiPhi },
    { field: 'input[name="companyAddress"]', value: sampleData.diaChiKhaiPhi },
    { field: 'input[name="importExportCompanyTaxCode"]', value: sampleData.maDoanhNghiepXNK },
    { field: 'input[name="importExportCompanyName"]', value: sampleData.tenDoanhNghiepXNK },
    { field: 'input[name="importExportCompanyAddress"]', value: sampleData.diaChiXNK }
  ];
  
  console.log('🖊️ Bắt đầu mapping...');
  mappings.forEach(({ field, value }, index) => {
    const element = document.querySelector(field);
    if (element) {
      const oldValue = element.value;
      element.value = value || '';
      
      // Trigger events
      element.dispatchEvent(new Event('change', { bubbles: true }));
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('blur', { bubbles: true }));
      
      console.log(`✅ Mapping ${index + 1}: ${field} = "${oldValue}" => "${element.value}"`);
    } else {
      console.log(`❌ Mapping ${index + 1}: ${field} - Element not found`);
    }
  });
  
  console.log('🎉 Mapping hoàn thành!');
}

// Test 3: Kiểm tra API endpoint
async function testAPI() {
  console.log('\n🌐 Test 3: Kiểm tra API endpoint...');
  
  try {
    const response = await fetch('/api/tokhai-thongtin/all');
    console.log('📡 Response status:', response.status);
    console.log('📡 Response ok:', response.ok);
    
    if (response.ok) {
      const data = await response.json();
      console.log('📊 API Response data:', data);
      console.log('📊 Records count:', data.data?.length || 0);
      
      if (data.data && data.data.length > 0) {
        console.log('📋 First record mapping fields:');
        const firstRecord = data.data[0];
        console.log('  maDoanhNghiepKhaiPhi:', firstRecord.maDoanhNghiepKhaiPhi);
        console.log('  tenDoanhNghiepKhaiPhi:', firstRecord.tenDoanhNghiepKhaiPhi);
        console.log('  diaChiKhaiPhi:', firstRecord.diaChiKhaiPhi);
        console.log('  maDoanhNghiepXNK:', firstRecord.maDoanhNghiepXNK);
        console.log('  tenDoanhNghiepXNK:', firstRecord.tenDoanhNghiepXNK);
        console.log('  diaChiXNK:', firstRecord.diaChiXNK);
      }
    } else {
      const errorText = await response.text();
      console.error('❌ API Error:', errorText);
    }
  } catch (error) {
    console.error('❌ Network Error:', error);
  }
}

// Main function
async function runAllTests() {
  console.log('🚀 Chạy tất cả tests...\n');
  
  checkFormElements();
  await testAPI();
  testMapping();
  
  console.log('\n✅ Tất cả tests đã hoàn thành!');
  console.log('\n📝 Hướng dẫn:');
  console.log('1. Nếu form elements không tìm thấy => Kiểm tra FeeDeclarationForm component');
  console.log('2. Nếu API lỗi => Kiểm tra backend server và proxy config');
  console.log('3. Nếu mapping không hoạt động => Kiểm tra React state và event handlers');
}

// Chạy tests
runAllTests();

// Export functions for manual testing
window.debugMapping = {
  checkFormElements,
  testMapping,
  testAPI,
  runAllTests
};

console.log('\n💡 Có thể chạy manual tests:');
console.log('  window.debugMapping.checkFormElements()');
console.log('  window.debugMapping.testMapping()');
console.log('  window.debugMapping.testAPI()');
console.log('  window.debugMapping.runAllTests()');
