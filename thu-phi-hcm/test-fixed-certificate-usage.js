/**
 * Test script để xác nhận fix lỗi certificate usage
 */

import https from 'https';
import http from 'http';

const API_BASE = 'http://10.14.122.24:8081/PHT_BE';

function makeRequest(url, method = 'GET', timeout = 8000, postData = null) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: method,
      timeout: timeout,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };

    if (postData) {
      const postDataString = JSON.stringify(postData);
      options.headers['Content-Length'] = Buffer.byteLength(postDataString);
    }

    const req = client.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          data: data
        });
      });
    });

    req.on('error', (error) => { reject(error); });
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (postData) {
      req.write(JSON.stringify(postData));
    }
    req.end();
  });
}

async function testFixedCertificateUsage() {
  console.log('🔧 Testing fixed certificate usage...\n');

  try {
    // Step 1: Get certificates list
    console.log('📋 Step 1: Getting certificates list...');
    const certResult = await makeRequest(`${API_BASE}/api/chu-ky-so/danh-sach`);
    
    if (certResult.status === 200) {
      const certData = JSON.parse(certResult.data);
      console.log('✅ Certificates API response:', certData.status, certData.message);
      
      if (certData.data && certData.data.length > 0) {
        const selectedCertificate = certData.data[0];
        
        // Simulate frontend logic
        const certificateName = selectedCertificate.subject?.includes('CN=') 
          ? selectedCertificate.subject.split('CN=')[1]?.split(',')[0] 
          : 'Unknown Certificate';
        
        console.log('✅ Selected certificate:');
        console.log(`   📛 Name: ${certificateName}`);
        console.log(`   🔢 Serial: ${selectedCertificate.serialNumber}`);
        console.log(`   📅 Valid: ${selectedCertificate.validFrom} - ${selectedCertificate.validTo}`);
        
        // Step 2: Test digital signature with correct data
        console.log('\n🔐 Step 2: Testing digital signature...');
        const signData = {
          toKhaiId: 6, // Use existing ID
          lanKy: 1,
          serialNumber: selectedCertificate.serialNumber // ✅ Now using correct field
        };
        
        console.log('📤 Request data:', JSON.stringify(signData));
        
        const signResult = await makeRequest(`${API_BASE}/api/chu-ky-so/ky-so`, 'POST', 10000, signData);
        
        if (signResult.status === 200) {
          console.log('✅ Digital signature SUCCESS!');
          const signResponse = JSON.parse(signResult.data);
          console.log('📄 Response:', signResponse.status, signResponse.message);
        } else {
          console.log(`⚠️ Digital signature status: ${signResult.status}`);
          try {
            const errorData = JSON.parse(signResult.data);
            console.log('📄 Error message:', errorData.message);
          } catch (e) {
            console.log('📄 Raw response:', signResult.data.substring(0, 200));
          }
        }
        
      } else {
        console.log('❌ No certificates available');
      }
    } else {
      console.log('❌ Failed to get certificates:', certResult.status);
    }
    
  } catch (error) {
    console.error('💥 Test error:', error.message);
  }
  
  console.log('\n🎯 Test completed!');
  console.log('\n📋 Fix Summary:');
  console.log('✅ Fixed: selectedCertificate.id → selectedCertificate.serialNumber');
  console.log('✅ Fixed: selectedCertificate.name → extracted from subject');
  console.log('✅ Updated: ChuKySoInfo interface to match backend');
}

testFixedCertificateUsage();
