/**
 * Test script to verify CRM API connection
 * Run with: node test-crm-api.js
 */

const CRM_API_BASE_URL = 'http://10.14.122.24:8081/CRM_BE';

// Test endpoints
const testEndpoints = [
  `${CRM_API_BASE_URL}/actuator/health`,
  `${CRM_API_BASE_URL}/api/fee-declarations`,
  `${CRM_API_BASE_URL}/api/companies`,
  `${CRM_API_BASE_URL}/swagger-ui/index.html`
];

/**
 * Test a single endpoint
 */
async function testEndpoint(url) {
  try {
    console.log(`\n🔗 Testing: ${url}`);
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CRM-API-Test/1.0'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeout);
    
    console.log(`✅ Status: ${response.status} ${response.statusText}`);
    console.log(`📄 Content-Type: ${response.headers.get('content-type')}`);
    
    if (response.ok) {
      // Try to get response data
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          const data = await response.json();
          console.log(`📊 Response data:`, JSON.stringify(data, null, 2));
        } catch (e) {
          console.log('⚠️  Failed to parse JSON response');
        }
      } else {
        const text = await response.text();
        console.log(`📄 Response text (first 200 chars): ${text.substring(0, 200)}...`);
      }
      return true;
    } else {
      console.log(`❌ Request failed with status: ${response.status}`);
      return false;
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('⏰ Request timed out (10s)');
    } else {
      console.log(`💥 Error: ${error.message}`);
    }
    return false;
  }
}

/**
 * Test all endpoints
 */
async function testCrmApi() {
  console.log('🚀 Starting CRM API Connection Test');
  console.log(`🎯 Target: ${CRM_API_BASE_URL}`);
  console.log('=' .repeat(50));
  
  let passedTests = 0;
  let totalTests = testEndpoints.length;
  
  for (const endpoint of testEndpoints) {
    const success = await testEndpoint(endpoint);
    if (success) passedTests++;
    
    // Add delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n' + '=' .repeat(50));
  console.log(`📊 Test Results: ${passedTests}/${totalTests} endpoints accessible`);
  
  if (passedTests > 0) {
    console.log('✅ CRM API server appears to be running and accessible');
    console.log('🎯 You can proceed with frontend integration');
  } else {
    console.log('❌ CRM API server is not accessible');
    console.log('🔧 Check:');
    console.log('   1. Server is running on 10.14.122.24:8081');
    console.log('   2. Network connectivity');
    console.log('   3. Firewall settings');
    console.log('   4. CORS configuration on server');
  }
  
  console.log('\n📖 Swagger Documentation:');
  console.log(`   ${CRM_API_BASE_URL}/swagger-ui/index.html`);
}

// Run the test
testCrmApi().catch(error => {
  console.error('💥 Test script failed:', error);
  process.exit(1);
});

