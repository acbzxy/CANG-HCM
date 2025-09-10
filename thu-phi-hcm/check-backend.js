// Simple script to check if backend is running
const http = require('http');

const checkBackend = () => {
  console.log('🔍 Checking backend connection...');
  
  const options = {
    hostname: 'localhost',
    port: 8080,
    path: '/api/fee-declarations?page=0&size=1',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    timeout: 5000
  };

  const req = http.request(options, (res) => {
    console.log(`✅ Backend responded with status: ${res.statusCode}`);
    console.log(`📋 Headers:`, res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        console.log('📊 Response data:', json);
        console.log('🎉 Backend is working correctly!');
      } catch (e) {
        console.log('📄 Response (raw):', data);
      }
    });
  });

  req.on('error', (err) => {
    console.log('❌ Backend connection failed:', err.message);
    console.log('💡 Make sure Spring Boot backend is running on port 8080');
    console.log('🚀 To start backend: cd spring-boot-api && mvn spring-boot:run');
  });

  req.on('timeout', () => {
    console.log('⏰ Backend connection timed out');
    req.destroy();
  });

  req.end();
};

checkBackend();
