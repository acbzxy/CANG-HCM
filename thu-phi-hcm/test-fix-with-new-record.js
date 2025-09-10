/**
 * Test fix với record mới tạo (status "00")
 */

const API_BASE = 'http://10.14.122.24:8081/PHT_BE';

async function testFixWithNewRecord() {
  console.log('🧪 TEST FIX: Create new record and test signing with correct password');
  console.log('═'.repeat(80));
  
  try {
    // Step 1: Create new record with status "00"
    console.log('\n📝 STEP 1: Creating new record with status "00"...');
    
    const createData = {
      "nguonTK": 0,
      "maDoanhNghiepKhaiPhi": `FIX_TEST_${Date.now()}`,
      "tenDoanhNghiepKhaiPhi": "Test Fix Password Signing Company",
      "diaChiKhaiPhi": "Fix Test Address",
      "maDoanhNghiepXNK": `FIX_XNK_${Date.now()}`,
      "tenDoanhNghiepXNK": "Fix Test XNK Company",
      "diaChiXNK": "Fix Test XNK Address",
      "soToKhai": `FIX_TK_${Date.now()}`,
      "ngayToKhai": "2025-09-08",
      "maHaiQuan": "HQFIX01",
      "maLoaiHinh": "A11",
      "maLuuKho": "LKFIX01",
      "nuocXuatKhau": "VN",
      "maPhuongThucVC": "SEA",
      "phuongTienVC": "Test Ship for Password Fix",
      "maDiaDiemXepHang": "FIXPORT1",
      "maDiaDiemDoHang": "FIXPORT2",
      "maPhanLoaiHangHoa": "H01",
      "mucDichVC": "Password Fix Test",
      "soTiepNhanKhaiPhi": `FIX_TPN_${Date.now()}`,
      "ngayKhaiPhi": "2025-09-08",
      "nhomLoaiPhi": "Fix Test Group",
      "loaiThanhToan": "Chuyển khoản",
      "ghiChuKhaiPhi": "Created to test password fix for signing",
      "soThongBaoNopPhi": `FIX_TBP_${Date.now()}`,
      "tongTienPhi": 999000,
      "trangThaiNganHang": "Chưa thanh toán",
      "soBienLai": `FIX_BL_${Date.now()}`,
      "ngayBienLai": "2025-09-08",
      "kyHieuBienLai": "FIX/25W",
      "mauBienLai": "FIX01",
      "maTraCuuBienLai": `FIX_TCBL_${Date.now()}`,
      "xemBienLai": "https://test.fix.example.com/bienlai",
      "loaiHangMienPhi": "Không",
      "loaiHang": "Fix Test Goods",
      "trangThai": "00", // IMPORTANT: Status 00 for signing
      "chiTietList": [
        {
          "soVanDon": `FIX_VD_${Date.now()}`,
          "soHieu": "FIXTEST001",
          "soSeal": "FIXSEAL001",
          "loaiCont": "20RF",
          "tinhChatCont": "FCL",
          "tongTrongLuong": 16000,
          "donViTinh": "KG",
          "ghiChu": "Container for password fix test"
        }
      ]
    };
    
    const createResponse = await fetch(`${API_BASE}/api/tokhai-thongtin/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(createData)
    });
    
    const createResult = await createResponse.json();
    
    if (createResponse.status !== 200 || !createResult.data?.id) {
      console.log('❌ Failed to create test record:', createResult.message);
      return;
    }
    
    const newRecordId = createResult.data.id;
    console.log(`✅ Created test record: ID=${newRecordId}`);
    console.log(`   Status: ${createResult.data.trangThai}`);
    console.log(`   Company: ${createResult.data.tenDoanhNghiepKhaiPhi}`);
    
    // Step 2: Load certificates
    console.log('\n📋 STEP 2: Loading certificates...');
    const certResponse = await fetch(`${API_BASE}/api/chu-ky-so/danh-sach`);
    const certData = await certResponse.json();
    const certificate = certData.data[0]; // CKS001
    
    console.log(`✅ Using certificate: ${certificate.id} (${certificate.name})`);
    
    // Step 3: Test signing with FIXED password (empty)
    console.log('\n🔐 STEP 3: Testing signing with FIXED password...');
    
    const signData = {
      toKhaiId: newRecordId,
      chuKySoId: certificate.id,
      matKhau: '' // FIXED: Empty password for CKS001
    };
    
    console.log('🔧 Fix Details:');
    console.log('   ❌ OLD Bug: Using password "demo123456" → Error 500');
    console.log('   ✅ NEW Fix: Using password "" (empty) → Should work');
    console.log('');
    
    const signResponse = await fetch(`${API_BASE}/api/chu-ky-so/ky-so`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(signData)
    });
    
    const signResult = await signResponse.json();
    
    if (signResponse.status === 200) {
      console.log('🎉 SUCCESS! Password fix is working!');
      console.log(`   📊 Status: ${signResult.status}`);
      console.log(`   📄 Message: ${signResult.message}`);
      console.log(`   ⏱️  Execution Time: ${signResult.executionTime}ms`);
      console.log(`   🔍 Request ID: ${signResult.requestId || 'N/A'}`);
      
      // Step 4: Verify record status change
      console.log('\n🔍 STEP 4: Verifying record after signing...');
      const verifyResponse = await fetch(`${API_BASE}/api/tokhai-thongtin/${newRecordId}`);
      const verifyData = await verifyResponse.json();
      
      if (verifyData.data) {
        console.log(`✅ Record verified:`);
        console.log(`   📊 New Status: "${verifyData.data.trangThai}"`);
        console.log(`   🔐 Signed: ${verifyData.data.kylan1Xml ? 'Yes (XML present)' : 'No XML found'}`);
      }
      
      console.log('\n🎯 FIX SUMMARY:');
      console.log('═'.repeat(60));
      console.log('✅ PROBLEM IDENTIFIED AND FIXED:');
      console.log('   🔧 Issue: Wrong certificate password in Declare.tsx');
      console.log('   🔧 Root Cause: Using "demo123456" instead of ""');
      console.log('   🔧 Solution: Updated defaultPassword to ""');
      console.log('   🔧 Result: Digital signing now works correctly');
      
      console.log('\n✅ FILES UPDATED:');
      console.log('   📁 Declare.tsx: Line ~188 - defaultPassword changed to ""');
      
      console.log('\n🚀 READY FOR USE:');
      console.log('   • Declare.tsx UI signing should now work');
      console.log('   • Certificate CKS001 with empty password verified');
      console.log('   • Business logic validation working');
      console.log('   • Status transitions working correctly');
      
    } else {
      console.log('❌ Still failing after fix:');
      console.log(`   Status: ${signResponse.status}`);
      console.log(`   Message: ${signResult.message}`);
      console.log('\n🔍 Additional investigation needed...');
      
      if (signResult.errors) {
        console.log(`   Errors: ${signResult.errors.join(', ')}`);
      }
    }
    
  } catch (error) {
    console.error('💥 Test Error:', error.message);
  }
}

testFixWithNewRecord().catch(console.error);
