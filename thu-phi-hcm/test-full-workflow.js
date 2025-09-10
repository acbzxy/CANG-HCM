/**
 * Test luồng hoạt động đầy đủ của API Tờ khai thông tin
 * Workflow: Create → Get All → Get by ID → Update Status → Verify
 * Chạy: node test-full-workflow.js
 */

import https from 'https';
import http from 'http';

// PHT_BE API configuration
const API_BASE = 'http://10.14.122.24:8081/PHT_BE';

// Helper function để gọi API
function makeApiRequest(url, method = 'GET', postData = null) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: method,
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'Thu-Phi-HCM-Workflow-Test/1.0'
      }
    };

    if (postData && (method === 'POST' || method === 'PUT')) {
      const postDataString = JSON.stringify(postData);
      options.headers['Content-Length'] = Buffer.byteLength(postDataString);
    }

    const req = client.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            statusText: res.statusMessage,
            data: jsonData
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            statusText: res.statusMessage,
            data: data,
            parseError: e.message
          });
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (postData && (method === 'POST' || method === 'PUT')) {
      req.write(JSON.stringify(postData));
    }

    req.end();
  });
}

// Test workflow functions
async function testFullWorkflow() {
  console.log('🚀 Testing Full API Workflow - PHT_BE Backend');
  console.log('📍 Base URL:', API_BASE);
  console.log('═'.repeat(80));
  
  let createdRecordId = null;
  let testResults = {
    create: false,
    getAll: false,
    getById: false,
    updateStatus: false,
    verifyUpdate: false
  };
  
  try {
    // Step 1: CREATE - Tạo tờ khai mới
    console.log('\n📝 STEP 1: CREATE - Tạo tờ khai thông tin mới');
    console.log('─'.repeat(60));
    
    const createData = {
      "nguonTK": 0,
      "maDoanhNghiepKhaiPhi": `TEST${Date.now()}`,
      "tenDoanhNghiepKhaiPhi": "Công ty TNHH Test Workflow",
      "diaChiKhaiPhi": "123 Test Street, Test City",
      "maDoanhNghiepXNK": `XNK${Date.now()}`,
      "tenDoanhNghiepXNK": "Công ty XNK Test Workflow", 
      "diaChiXNK": "456 XNK Street, XNK City",
      "soToKhai": `TK${Date.now()}`,
      "ngayToKhai": "2025-09-08",
      "maHaiQuan": "HQTEST01",
      "maLoaiHinh": "A11",
      "maLuuKho": "LKTEST01",
      "nuocXuatKhau": "VN",
      "maPhuongThucVC": "SEA",
      "phuongTienVC": "Test Container Ship",
      "maDiaDiemXepHang": "TESTPORT1",
      "maDiaDiemDoHang": "TESTPORT2",
      "maPhanLoaiHangHoa": "H01",
      "mucDichVC": "Test Business",
      "soTiepNhanKhaiPhi": `TPN${Date.now()}`,
      "ngayKhaiPhi": "2025-09-08",
      "nhomLoaiPhi": "Test Fee Group",
      "loaiThanhToan": "Chuyển khoản",
      "ghiChuKhaiPhi": "Workflow test - Created by automation",
      "soThongBaoNopPhi": `TBP${Date.now()}`,
      "tongTienPhi": 1000000,
      "trangThaiNganHang": "Chưa thanh toán",
      "soBienLai": `BL${Date.now()}`,
      "ngayBienLai": "2025-09-08",
      "kyHieuBienLai": "TEST/25W",
      "mauBienLai": "TEST01",
      "maTraCuuBienLai": `TCBL${Date.now()}`,
      "xemBienLai": "https://test.example.com/bienlai",
      "loaiHangMienPhi": "Không",
      "loaiHang": "Test Goods",
      "trangThai": "01",
      "chiTietList": [
        {
          "soVanDon": `VD${Date.now()}`,
          "soHieu": "TESTCONT001",
          "soSeal": "TESTSEAL001",
          "loaiCont": "20RF",
          "tinhChatCont": "FCL",
          "tongTrongLuong": 15000,
          "donViTinh": "KG",
          "ghiChu": "Test container workflow"
        }
      ]
    };
    
    console.log(`📤 Creating tờ khai: ${createData.tenDoanhNghiepKhaiPhi}`);
    const createResult = await makeApiRequest(
      `${API_BASE}/api/tokhai-thongtin/create`,
      'POST',
      createData
    );
    
    if (createResult.status === 200 && createResult.data.data?.id) {
      createdRecordId = createResult.data.data.id;
      testResults.create = true;
      console.log(`✅ CREATE Success: ID=${createdRecordId}`);
      console.log(`   📊 Response: ${createResult.data.message}`);
      console.log(`   ⏱️  Execution Time: ${createResult.data.executionTime || 0}ms`);
    } else {
      console.log(`❌ CREATE Failed: Status=${createResult.status}`);
      console.log(`   📄 Response: ${JSON.stringify(createResult.data).substring(0, 200)}...`);
      return testResults; // Stop if create fails
    }
    
    // Step 2: GET ALL - Kiểm tra record có trong danh sách
    console.log('\n📋 STEP 2: GET ALL - Kiểm tra danh sách tờ khai');
    console.log('─'.repeat(60));
    
    const getAllResult = await makeApiRequest(`${API_BASE}/api/tokhai-thongtin/all`);
    
    if (getAllResult.status === 200) {
      const records = getAllResult.data.data || [];
      const foundRecord = records.find(r => r.id === createdRecordId);
      
      if (foundRecord) {
        testResults.getAll = true;
        console.log(`✅ GET ALL Success: Found record ID=${createdRecordId}`);
        console.log(`   📊 Total records: ${records.length}`);
        console.log(`   📄 Record name: ${foundRecord.tenDoanhNghiepKhaiPhi}`);
      } else {
        console.log(`⚠️  GET ALL Warning: Created record not found in list`);
        console.log(`   📊 Total records: ${records.length}`);
        console.log(`   🔍 Looking for ID: ${createdRecordId}`);
      }
    } else {
      console.log(`❌ GET ALL Failed: Status=${getAllResult.status}`);
    }
    
    // Step 3: GET BY ID - Lấy chi tiết record vừa tạo
    console.log('\n🔍 STEP 3: GET BY ID - Lấy chi tiết theo ID');
    console.log('─'.repeat(60));
    
    const getByIdResult = await makeApiRequest(`${API_BASE}/api/tokhai-thongtin/${createdRecordId}`);
    
    if (getByIdResult.status === 200 && getByIdResult.data.data) {
      testResults.getById = true;
      const record = getByIdResult.data.data;
      console.log(`✅ GET BY ID Success: ID=${createdRecordId}`);
      console.log(`   🏢 Công ty: ${record.tenDoanhNghiepKhaiPhi}`);
      console.log(`   📄 Số tờ khai: ${record.soToKhai}`);
      console.log(`   📊 Trạng thái hiện tại: ${record.trangThai}`);
      console.log(`   💰 Tổng tiền: ${record.tongTienPhi} VNĐ`);
      console.log(`   📦 Chi tiết: ${record.chiTietList?.length || 0} item(s)`);
    } else {
      console.log(`❌ GET BY ID Failed: Status=${getByIdResult.status}`);
      if (getByIdResult.data.message) {
        console.log(`   📄 Error: ${getByIdResult.data.message}`);
      }
    }
    
    // Step 4: UPDATE STATUS - Cập nhật trạng thái
    console.log('\n🔄 STEP 4: UPDATE STATUS - Cập nhật trạng thái tờ khai');
    console.log('─'.repeat(60));
    
    const updateData = {
      id: createdRecordId,
      trangThai: "02" // Change from "01" to "02"
    };
    
    console.log(`📤 Updating status: ID=${createdRecordId}, New Status="02"`);
    const updateResult = await makeApiRequest(
      `${API_BASE}/api/tokhai-thongtin/update-status`,
      'PUT',
      updateData
    );
    
    if (updateResult.status === 200) {
      testResults.updateStatus = true;
      console.log(`✅ UPDATE STATUS Success`);
      console.log(`   📊 Response: ${updateResult.data.message}`);
      console.log(`   ⏱️  Execution Time: ${updateResult.data.executionTime || 0}ms`);
      
      // Show updated record info if available
      if (updateResult.data.data?.trangThai) {
        console.log(`   📊 New Status: ${updateResult.data.data.trangThai}`);
      }
    } else {
      console.log(`❌ UPDATE STATUS Failed: Status=${updateResult.status}`);
      if (updateResult.data.message) {
        console.log(`   📄 Error: ${updateResult.data.message}`);
      }
    }
    
    // Step 5: VERIFY UPDATE - Kiểm tra cập nhật thành công
    console.log('\n✅ STEP 5: VERIFY UPDATE - Xác nhận cập nhật');
    console.log('─'.repeat(60));
    
    const verifyResult = await makeApiRequest(`${API_BASE}/api/tokhai-thongtin/${createdRecordId}`);
    
    if (verifyResult.status === 200 && verifyResult.data.data) {
      const updatedRecord = verifyResult.data.data;
      const expectedStatus = "02";
      
      if (updatedRecord.trangThai === expectedStatus) {
        testResults.verifyUpdate = true;
        console.log(`✅ VERIFY Success: Status updated correctly`);
        console.log(`   📊 Expected: "${expectedStatus}" → Actual: "${updatedRecord.trangThai}"`);
      } else {
        console.log(`⚠️  VERIFY Warning: Status not updated as expected`);
        console.log(`   📊 Expected: "${expectedStatus}" → Actual: "${updatedRecord.trangThai}"`);
      }
    } else {
      console.log(`❌ VERIFY Failed: Cannot retrieve updated record`);
    }
    
  } catch (error) {
    console.log(`💥 Workflow Error: ${error.message}`);
  }
  
  // Final Results Summary
  console.log('\n🎯 WORKFLOW TEST RESULTS');
  console.log('═'.repeat(80));
  
  const steps = [
    { name: 'CREATE', status: testResults.create, desc: 'Tạo tờ khai mới' },
    { name: 'GET ALL', status: testResults.getAll, desc: 'Lấy danh sách tờ khai' },
    { name: 'GET BY ID', status: testResults.getById, desc: 'Lấy chi tiết theo ID' },
    { name: 'UPDATE STATUS', status: testResults.updateStatus, desc: 'Cập nhật trạng thái' },
    { name: 'VERIFY UPDATE', status: testResults.verifyUpdate, desc: 'Xác nhận cập nhật' }
  ];
  
  let passedTests = 0;
  steps.forEach(step => {
    const icon = step.status ? '✅' : '❌';
    console.log(`${icon} ${step.name.padEnd(15)} | ${step.desc}`);
    if (step.status) passedTests++;
  });
  
  console.log('─'.repeat(80));
  console.log(`📊 Overall Result: ${passedTests}/${steps.length} tests passed`);
  
  if (passedTests === steps.length) {
    console.log('🎉 WORKFLOW TEST: ALL PASSED - API hoạt động hoàn hảo!');
  } else if (passedTests >= 3) {
    console.log('⚠️  WORKFLOW TEST: MOSTLY PASSED - Có vài vấn đề nhỏ cần kiểm tra');
  } else {
    console.log('❌ WORKFLOW TEST: FAILED - Có lỗi nghiêm trọng cần sửa');
  }
  
  if (createdRecordId) {
    console.log(`📝 Test Record Created: ID=${createdRecordId} (có thể dùng để test thêm)`);
  }
  
  return testResults;
}

// Run the full workflow test
testFullWorkflow().catch(console.error);
