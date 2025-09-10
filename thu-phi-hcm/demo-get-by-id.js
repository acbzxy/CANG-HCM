/**
 * Demo sử dụng API GET /api/tokhai-thongtin/{id}
 * Sử dụng trực tiếp fetch API để test endpoint
 * Chạy: node demo-get-by-id.js
 */

// PHT_BE API configuration
const API_BASE = 'http://10.14.122.24:8081/PHT_BE'

// Helper function to make API request
async function makeApiGetById(id) {
  try {
    const url = `${API_BASE}/api/tokhai-thongtin/${id}`
    console.log(`📞 API Request: GET ${url}`)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'Thu-Phi-HCM-Demo/1.0'
      }
    })
    
    console.log(`📡 Response Status: ${response.status}`)
    
    const data = await response.json()
    
    return {
      status: response.status,
      statusText: response.statusText,
      data: data
    }
    
  } catch (error) {
    return {
      status: 500,
      statusText: 'Network Error',
      error: error.message
    }
  }
}

async function demoGetToKhaiById() {
  console.log('🚀 Demo GET Tờ khai thông tin by ID - PHT_BE API\n')
  
  // Test với các ID khác nhau để demo các trường hợp
  const testIds = [1, 3, 999, -1, 0]
  
  for (const testId of testIds) {
    console.log(`\n📞 Test với ID: ${testId}`)
    
    try {
      const response = await makeApiGetById(testId)
      
      if (response.status === 200) {
        // Success response
        console.log('✅ API trả về thành công:')
        console.log('🔍 Status:', response.data.status || response.status)
        console.log('🔍 Message:', response.data.message || 'Success')
        console.log('🔍 Request ID:', response.data.requestId || 'N/A')
        console.log('🔍 Execution Time:', (response.data.executionTime || 0) + 'ms')
        console.log('🔍 Timestamp:', response.data.timestamp || 'N/A')
        console.log('🔍 Path:', response.data.path || 'N/A')
        
        // Hiển thị thông tin tờ khai
        if (response.data.data) {
          const toKhai = response.data.data
          console.log('📋 Thông tin tờ khai:')
          console.log('   🆔 ID:', toKhai.id || 'N/A')
          console.log('   📄 Số tờ khai:', toKhai.soToKhai || 'N/A')
          console.log('   🏢 Công ty:', toKhai.tenDoanhNghiepKhaiPhi || 'N/A')
          console.log('   💰 Tổng tiền:', toKhai.tongTienPhi || 0, 'VNĐ')
          console.log('   📊 Trạng thái:', toKhai.trangThai || 'N/A')
          console.log('   📅 Ngày tờ khai:', toKhai.ngayToKhai || 'N/A')
          
          // Hiển thị chi tiết nếu có
          if (toKhai.chiTietList && toKhai.chiTietList.length > 0) {
            console.log('   📦 Chi tiết:', toKhai.chiTietList.length, 'item(s)')
            toKhai.chiTietList.slice(0, 2).forEach((item, idx) => {
              console.log(`      ${idx + 1}. Vận đơn: ${item.soVanDon || 'N/A'}, Container: ${item.loaiCont || 'N/A'}`)
            })
          }
        }
        
      } else if (response.status === 404) {
        // Not Found response
        console.log('🔍 Không tìm thấy:')
        console.log('🔍 Status:', response.status)
        console.log('🔍 Message:', response.data.message || 'Not Found')
        console.log('🔍 Request ID:', response.data.requestId || 'N/A')
        console.log('🔍 Path:', response.data.path || 'N/A')
        console.log('📝 Loại lỗi: Not Found - Tờ khai không tồn tại')
        
        if (response.data.errors && response.data.errors.length > 0) {
          console.log('🔍 Errors:', response.data.errors)
        }
        
      } else if (response.status >= 400) {
        // Error response
        console.log('❌ API trả về lỗi:')
        console.log('🔍 Status:', response.status)
        console.log('🔍 Message:', response.data.message || response.statusText)
        console.log('🔍 Request ID:', response.data.requestId || 'N/A')
        console.log('🔍 Path:', response.data.path || 'N/A')
        
        if (response.data.errors && response.data.errors.length > 0) {
          console.log('🔍 Errors:', response.data.errors)
        }
        if (response.data.error) {
          console.log('🔍 Error:', response.data.error)
        }
        
        // Phân loại lỗi
        if (response.status === 400) {
          console.log('📝 Loại lỗi: Validation Error - Invalid ID parameter')
        } else if (response.status === 500) {
          console.log('📝 Loại lỗi: Server Error - Lỗi hệ thống')
        }
      }
      
    } catch (error) {
      console.error('💥 Exception khi gọi API:', error.message)
    }
    
    console.log('─'.repeat(60))
  }
  
  console.log('\n🎯 Summary:')
  console.log('✅ GET /api/tokhai-thongtin/{id} endpoint supports:')
  console.log('   🔹 200: Success - ApiDataResponse<ToKhaiThongTinResponse>')
  console.log('   🔹 404: Not Found - Tờ khai không tồn tại')
  console.log('   🔹 500: Server Error - Lỗi hệ thống')
  console.log('   🔹 Method getToKhaiThongTinById() có client validation cho ID parameter')
}

// Chạy demo
demoGetToKhaiById().catch(console.error)
