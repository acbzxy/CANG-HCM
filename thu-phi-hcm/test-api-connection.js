// Test script to verify API connection to tokhai-thongtin/all endpoint
const API_URL = 'http://10.14.122.24:8081/PHT_BE/api/tokhai-thongtin/all';

async function testApiConnection() {
  console.log('🔍 Testing API connection to:', API_URL);
  console.log('=' .repeat(60));

  try {
    console.log('⏳ Sending request...');
    
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    console.log('📊 Response status:', response.status);
    console.log('📊 Response ok:', response.ok);
    console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', errorText);
      return;
    }

    const data = await response.json();
    console.log('✅ API Response received successfully!');
    console.log('📋 Response structure:', {
      status: data.status,
      message: data.message,
      timestamp: data.timestamp,
      dataLength: data.data ? data.data.length : 'No data array',
      dataType: typeof data.data
    });

    if (data.data && Array.isArray(data.data)) {
      console.log('📊 Sample data (first 3 records):');
      data.data.slice(0, 3).forEach((item, index) => {
        console.log(`  Record ${index + 1}:`, {
          id: item.id,
          soToKhai: item.soToKhai,
          tenDoanhNghiepKhaiPhi: item.tenDoanhNghiepKhaiPhi,
          maDoanhNghiepKhaiPhi: item.maDoanhNghiepKhaiPhi,
          tongTienPhi: item.tongTienPhi,
          trangThai: item.trangThai,
          ngayToKhai: item.ngayToKhai
        });
      });
      
      console.log(`\n📈 Total records: ${data.data.length}`);
    }

  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('🔧 Possible issues:');
    console.error('  - Server is not running');
    console.error('  - Network connectivity issues'); 
    console.error('  - CORS configuration');
    console.error('  - Firewall blocking the connection');
  }
}

// Run the test
testApiConnection();
