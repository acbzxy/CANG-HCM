// Test backend connectivity
export const testBackendConnection = async () => {
  const backendUrl = 'http://localhost:8080';
  
  try {
    console.log('Testing backend connection...');
    
    // Test basic connectivity
    const response = await fetch(`${backendUrl}/api/fee-declarations?page=0&size=1`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Backend response:', data);
    
    return {
      success: true,
      message: 'Backend connection successful',
      data
    };
    
  } catch (error) {
    console.error('Backend connection failed:', error);
    return {
      success: false,
      message: `Backend connection failed: ${(error as Error).message}`,
      error
    };
  }
};

// Test CORS
export const testCORS = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/fee-declarations', {
      method: 'OPTIONS'
    });
    
    const corsHeaders = {
      'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
      'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
    };
    
    console.log('CORS Headers:', corsHeaders);
    return corsHeaders;
    
  } catch (error) {
    console.error('CORS test failed:', error);
    return null;
  }
};

// Add to window for easy testing
if (typeof window !== 'undefined') {
  (window as any).testBackend = testBackendConnection;
  (window as any).testCORS = testCORS;
}
