/**
 * Demo sử dụng API GET /api/tokhai-thongtin/all 
 * Method: getAllToKhaiThongTin()
 * Chạy: node demo-get-all.js
 */

import { CrmApiService } from './src/utils/crmApi.js'

async function demoGetAllToKhai() {
  console.log('🚀 Demo GET All Tờ khai thông tin - PHT_BE API\n')
  
  try {
    console.log('📞 Gọi API: CrmApiService.getAllToKhaiThongTin()')
    
    const response = await CrmApiService.getAllToKhaiThongTin()
    
    // Kiểm tra loại response
    if ('errors' in response) {
      // Đây là ApiErrorResponse
      console.log('❌ API trả về lỗi:')
      console.log('🔍 Status:', response.status)
      console.log('🔍 Message:', response.message) 
      console.log('🔍 Request ID:', response.requestId)
      console.log('🔍 Execution Time:', response.executionTime + 'ms')
      console.log('🔍 Errors:', response.errors)
      console.log('🔍 Error:', response.error)
      
    } else {
      // Đây là ApiDataResponse
      console.log('✅ API trả về thành công:')
      console.log('🔍 Status:', response.status)
      console.log('🔍 Message:', response.message)
      console.log('🔍 Request ID:', response.requestId)
      console.log('🔍 Execution Time:', response.executionTime + 'ms')
      console.log('🔍 Timestamp:', response.timestamp)
      console.log('🔍 Path:', response.path)
      console.log('📊 Total Records:', Array.isArray(response.data) ? response.data.length : 0)
      
      // Hiển thị 3 record đầu tiên nếu có
      if (Array.isArray(response.data) && response.data.length > 0) {
        console.log('\n📋 Sample Records:')
        response.data.slice(0, 3).forEach((record, index) => {
          console.log(`   ${index + 1}. ID: ${record.id || 'N/A'}, Số tờ khai: ${record.soToKhai || 'N/A'}`)
          console.log(`      Công ty: ${record.tenDoanhNghiepKhaiPhi || 'N/A'}`)
          console.log(`      Tổng tiền: ${record.tongTienPhi || 0} VNĐ`)
          console.log(`      Trạng thái: ${record.trangThai || 'N/A'}`)
          console.log('')
        })
      }
    }
    
  } catch (error) {
    console.error('💥 Lỗi khi gọi API:', error.message)
  }
}

// Chạy demo
demoGetAllToKhai().catch(console.error)
