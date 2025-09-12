/**
 * Script debug để xem cấu trúc dữ liệu chứng chỉ số
 */

import https from 'https';
import http from 'http';

const API_BASE = 'http://10.14.122.24:8081/PHT_BE';

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };

    const req = client.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => { 
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (e) {
          resolve({ error: 'Invalid JSON', raw: data });
        }
      });
    });

    req.on('error', (error) => { reject(error); });
    req.end();
  });
}

async function debugCertificates() {
  try {
    console.log('🔍 Debugging certificates API response structure...\n');
    
    const result = await makeRequest(`${API_BASE}/api/chu-ky-so/danh-sach`);
    
    console.log('📊 API Response Structure:');
    console.log('✅ Status:', result.status);
    console.log('✅ Message:', result.message);
    console.log('✅ Timestamp:', result.timestamp);
    console.log('✅ Data type:', typeof result.data);
    console.log('✅ Data is array:', Array.isArray(result.data));
    
    if (result.data && Array.isArray(result.data)) {
      console.log('✅ Number of certificates:', result.data.length);
      
      if (result.data.length > 0) {
        console.log('\n📄 First certificate details:');
        const firstCert = result.data[0];
        console.log('Available properties:', Object.keys(firstCert));
        console.log('\nFull certificate object:');
        console.log(JSON.stringify(firstCert, null, 2));
        
        console.log('\n🔍 Property Analysis:');
        console.log('- serialNumber:', firstCert.serialNumber);
        console.log('- issuer:', firstCert.issuer);
        console.log('- subject:', firstCert.subject);
        console.log('- cert:', firstCert.cert ? 'Present (length: ' + firstCert.cert.length + ')' : 'Missing');
        console.log('- validFrom:', firstCert.validFrom);
        console.log('- validTo:', firstCert.validTo);
        
        // Check what frontend expects vs what backend provides
        console.log('\n❌ Frontend expects but backend MISSING:');
        if (!firstCert.id) console.log('- id (frontend uses this as serialNumber)');
        if (!firstCert.name) console.log('- name (frontend uses this for display)');
        if (!firstCert.selected) console.log('- selected (frontend boolean flag)');
        
        console.log('\n✅ Backend provides but frontend interface missing:');
        if (firstCert.cert) console.log('- cert (certificate data)');
        if (firstCert.subject) console.log('- subject (certificate subject)');
      }
    } else {
      console.log('❌ No certificates data or invalid format');
    }
    
    console.log('\n💡 Suggested fix:');
    console.log('Update frontend to use:');
    console.log('- selectedCertificate.serialNumber instead of selectedCertificate.id');
    console.log('- selectedCertificate.subject or issuer instead of selectedCertificate.name');
    
  } catch (error) {
    console.error('💥 Error:', error.message);
  }
}

debugCertificates();
