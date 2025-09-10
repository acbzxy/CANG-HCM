// Debug script to test in browser console
console.log('🔍 Testing API integration in browser...');

async function testInBrowser() {
  try {
    console.log('📡 Testing API call...');
    
    const response = await fetch('/api/tokhai-thongtin/all', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    console.log('📊 Response status:', response.status);
    
    if (!response.ok) {
      console.error('❌ API Error:', response.status, response.statusText);
      return;
    }
    
    const responseData = await response.json();
    console.log('✅ API Response received:', responseData);
    
    // Extract data from the wrapped response
    const data = responseData.data || [];
    console.log('📦 Extracted data length:', data.length);
    
    // Filter out placeholder data
    const realDataRecords = data.filter(record => 
      record.soToKhai !== 'string' && 
      record.tenDoanhNghiepKhaiPhi !== 'string' &&
      record.maDoanhNghiepKhaiPhi !== 'string'
    );
    
    console.log('📊 Real data records (after filtering):', realDataRecords.length);
    
    if (realDataRecords.length > 0) {
      console.log('✅ Real data found:');
      realDataRecords.slice(0, 3).forEach((record, index) => {
        console.log(`Record ${index + 1}:`, {
          id: record.id,
          soToKhai: record.soToKhai,
          tenDoanhNghiepKhaiPhi: record.tenDoanhNghiepKhaiPhi,
          maDoanhNghiepKhaiPhi: record.maDoanhNghiepKhaiPhi,
          tongTienPhi: record.tongTienPhi,
          trangThai: record.trangThai,
          trangThaiNganHang: record.trangThaiNganHang
        });
      });
      
      console.log('🎉 API integration working in browser!');
    } else {
      console.log('⚠️ No real data found');
    }
    
  } catch (error) {
    console.error('💥 Error in browser test:', error);
  }
}

// Run the test
testInBrowser();

