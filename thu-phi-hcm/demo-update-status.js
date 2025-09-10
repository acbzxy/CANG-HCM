/**
 * Demo sử dụng API PUT /api/tokhai-thongtin/update-status
 * Sử dụng trực tiếp fetch API để test endpoint
 * Chạy: node demo-update-status.js
 */

// PHT_BE API configuration
const API_BASE = 'http://10.14.122.24:8081/PHT_BE'

// Helper function to make API request
async function makeApiUpdateStatus(updateData) {
  try {
    const url = `${API_BASE}/api/tokhai-thongtin/update-status`
    console.log(`📞 API Request: PUT ${url}`)
    console.log(`📤 Request Body:`, JSON.stringify(updateData, null, 2))
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'Thu-Phi-HCM-Demo/1.0'
      },
      body: JSON.stringify(updateData)
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

async function demoUpdateToKhaiStatus() {
  console.log('🚀 Demo PUT Update Status - PHT_BE API\n')
  
  // Test với các request khác nhau để demo các trường hợp
  const testRequests = [
    {
      name: 'Valid update - ID=1, Status="02"',
      data: { id: 1, trangThai: "02" }
    },
    {
      name: 'Valid update - ID=3, Status="03"',
      data: { id: 3, trangThai: "03" }
    },
    {
      name: 'Invalid ID - ID=0',
      data: { id: 0, trangThai: "02" }
    },
    {
      name: 'Invalid ID - ID=999 (không tồn tại)',
      data: { id: 999, trangThai: "02" }
    },
    {
      name: 'Empty status',
      data: { id: 1, trangThai: "" }
    },
    {
      name: 'Missing status field',
      data: { id: 1 }
    }
  ]
  
  for (const testCase of testRequests) {
    console.log(`\n📞 Test: ${testCase.name}`)
    console.log('─'.repeat(50))
    
    try {
      const response = await makeApiUpdateStatus(testCase.data)
      
      if (response.status === 200) {
        // Success response
        console.log('✅ API trả về thành công:')
        console.log('🔍 Status:', response.data.status || response.status)
        console.log('🔍 Message:', response.data.message || 'Success')
        console.log('🔍 Request ID:', response.data.requestId || 'N/A')
        console.log('🔍 Execution Time:', (response.data.executionTime || 0) + 'ms')
        console.log('🔍 Timestamp:', response.data.timestamp || 'N/A')
        console.log('🔍 Path:', response.data.path || 'N/A')
        
        // Hiển thị data response nếu có
        if (response.data.data) {
          console.log('📊 Response Data:', JSON.stringify(response.data.data, null, 2))
        }
        
      } else if (response.status === 400) {
        // Bad Request response  
        console.log('⚠️  Validation Error:')
        console.log('🔍 Status:', response.status)
        console.log('🔍 Message:', response.data.message || 'Bad Request')
        console.log('🔍 Request ID:', response.data.requestId || 'N/A')
        console.log('🔍 Path:', response.data.path || 'N/A')
        
        if (response.data.errors && response.data.errors.length > 0) {
          console.log('🔍 Validation Errors:', response.data.errors)
        }
        if (response.data.error) {
          console.log('🔍 Error Detail:', response.data.error)
        }
        
      } else if (response.status >= 500) {
        // Server Error response
        console.log('❌ Server Error:')
        console.log('🔍 Status:', response.status)
        console.log('🔍 Message:', response.data.message || response.statusText)
        console.log('🔍 Request ID:', response.data.requestId || 'N/A')
        console.log('🔍 Path:', response.data.path || 'N/A')
        
        if (response.data.errors && response.data.errors.length > 0) {
          console.log('🔍 Server Errors:', response.data.errors)
        }
        if (response.data.error) {
          console.log('🔍 Error Detail:', response.data.error)
        }
        
        console.log('📝 Có thể là: Tờ khai không tồn tại hoặc lỗi hệ thống')
        
      } else {
        // Other status codes
        console.log(`🔍 Unexpected Status: ${response.status}`)
        console.log('📄 Response:', JSON.stringify(response.data, null, 2))
      }
      
    } catch (error) {
      console.error('💥 Exception khi gọi API:', error.message)
    }
    
    console.log('') // Empty line between tests
  }
  
  console.log('\n🎯 Summary:')
  console.log('✅ PUT /api/tokhai-thongtin/update-status endpoint supports:')
  console.log('   🔹 200: Success - ApiDataResponse')
  console.log('   🔹 400: Bad Request - Validation errors')
  console.log('   🔹 500: Server Error - Tờ khai không tồn tại hoặc lỗi hệ thống')
  console.log('   🔹 Request body: { "id": number, "trangThai": string }')
  console.log('   🔹 Method updateToKhaiStatus() có full client validation')
}

// Chạy demo
demoUpdateToKhaiStatus().catch(console.error)
