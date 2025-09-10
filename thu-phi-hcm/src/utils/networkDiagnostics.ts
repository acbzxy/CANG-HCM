/**
 * Network diagnostic utilities for troubleshooting CRM API connection issues
 */

export interface NetworkDiagnosticResult {
  timestamp: string
  tests: {
    name: string
    status: 'pass' | 'fail' | 'warning'
    message: string
    details?: any
  }[]
  recommendations: string[]
  summary: {
    passed: number
    failed: number
    warnings: number
  }
}

export class NetworkDiagnostics {
  private static readonly CRM_BASE_URL = 'http://10.14.122.24:8081/CRM_BE'

  /**
   * Run comprehensive network diagnostics
   */
  static async runDiagnostics(): Promise<NetworkDiagnosticResult> {
    const result: NetworkDiagnosticResult = {
      timestamp: new Date().toISOString(),
      tests: [],
      recommendations: [],
      summary: { passed: 0, failed: 0, warnings: 0 }
    }

    console.log('🔧 Running Network Diagnostics...')

    // Test 1: Browser network status
    await this.testNetworkStatus(result)

    // Test 2: DNS resolution (basic)
    await this.testDNSResolution(result)

    // Test 3: Basic connectivity (ping equivalent)
    await this.testBasicConnectivity(result)

    // Test 4: HTTP connectivity  
    await this.testHttpConnectivity(result)

    // Test 5: CORS compliance
    await this.testCORSCompliance(result)

    // Test 6: Swagger UI accessibility
    await this.testSwaggerUI(result)

    // Generate recommendations
    this.generateRecommendations(result)

    // Calculate summary
    result.tests.forEach(test => {
      switch (test.status) {
        case 'pass': result.summary.passed++; break
        case 'fail': result.summary.failed++; break
        case 'warning': result.summary.warnings++; break
      }
    })

    console.log('🔧 Network Diagnostics Complete:', result)
    return result
  }

  private static async testNetworkStatus(result: NetworkDiagnosticResult) {
    try {
      const onLine = navigator.onLine
      const connectionType = (navigator as any).connection?.effectiveType || 'unknown'
      
      result.tests.push({
        name: 'Browser Network Status',
        status: onLine ? 'pass' : 'fail',
        message: onLine ? 'Browser reports online' : 'Browser reports offline',
        details: { onLine, connectionType }
      })
    } catch (error) {
      result.tests.push({
        name: 'Browser Network Status',
        status: 'warning',
        message: 'Could not determine network status',
        details: { error: (error as Error).message }
      })
    }
  }

  private static async testDNSResolution(result: NetworkDiagnosticResult) {
    try {
      // Try to resolve the hostname by making a simple request
      const controller = new AbortController()
      setTimeout(() => controller.abort(), 3000)

      const response = await fetch(`${this.CRM_BASE_URL}/favicon.ico`, {
        method: 'HEAD',
        mode: 'no-cors',
        signal: controller.signal
      })

      result.tests.push({
        name: 'DNS Resolution',
        status: 'pass',
        message: 'Hostname resolved successfully',
        details: { hostname: '10.14.122.24' }
      })
    } catch (error: any) {
      const status = error.name === 'AbortError' ? 'warning' : 'fail'
      result.tests.push({
        name: 'DNS Resolution',
        status,
        message: error.name === 'AbortError' ? 'DNS resolution timeout' : 'DNS resolution failed',
        details: { error: error.message }
      })
    }
  }

  private static async testBasicConnectivity(result: NetworkDiagnosticResult) {
    try {
      const startTime = Date.now()
      const controller = new AbortController()
      setTimeout(() => controller.abort(), 5000)

      await fetch(`${this.CRM_BASE_URL}/actuator/health`, {
        method: 'HEAD',
        mode: 'no-cors',
        signal: controller.signal
      })

      const duration = Date.now() - startTime
      result.tests.push({
        name: 'Basic Connectivity',
        status: duration < 3000 ? 'pass' : 'warning',
        message: `Server reachable in ${duration}ms`,
        details: { duration, endpoint: 'actuator/health' }
      })
    } catch (error: any) {
      let status: 'fail' | 'warning' = 'fail'
      let message = 'Server not reachable'

      if (error.name === 'AbortError') {
        status = 'warning'
        message = 'Connection timeout (5s)'
      } else if (error.message.includes('CORS')) {
        status = 'warning'
        message = 'Server reachable but CORS blocked'
      }

      result.tests.push({
        name: 'Basic Connectivity',
        status,
        message,
        details: { error: error.message }
      })
    }
  }

  private static async testHttpConnectivity(result: NetworkDiagnosticResult) {
    try {
      const startTime = Date.now()
      const controller = new AbortController()
      setTimeout(() => controller.abort(), 8000)

      const response = await fetch(`${this.CRM_BASE_URL}/actuator/health`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      })

      const duration = Date.now() - startTime
      const status = response.ok ? 'pass' : 'warning'

      result.tests.push({
        name: 'HTTP Connectivity',
        status,
        message: response.ok 
          ? `HTTP ${response.status} OK (${duration}ms)` 
          : `HTTP ${response.status} ${response.statusText}`,
        details: {
          status: response.status,
          statusText: response.statusText,
          duration,
          headers: Object.fromEntries(response.headers.entries())
        }
      })
    } catch (error: any) {
      let status: 'fail' | 'warning' = 'fail'
      let message = 'HTTP request failed'

      if (error.name === 'AbortError') {
        status = 'warning'
        message = 'HTTP request timeout (8s)'
      }

      result.tests.push({
        name: 'HTTP Connectivity',
        status,
        message,
        details: { error: error.message }
      })
    }
  }

  private static async testCORSCompliance(result: NetworkDiagnosticResult) {
    try {
      const response = await fetch(`${this.CRM_BASE_URL}/actuator/health`, {
        method: 'OPTIONS',
        headers: {
          'Origin': window.location.origin,
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'Content-Type'
        }
      })

      const corsHeaders = {
        allowOrigin: response.headers.get('Access-Control-Allow-Origin'),
        allowMethods: response.headers.get('Access-Control-Allow-Methods'),
        allowHeaders: response.headers.get('Access-Control-Allow-Headers')
      }

      const hasCORS = corsHeaders.allowOrigin !== null
      
      result.tests.push({
        name: 'CORS Compliance',
        status: hasCORS ? 'pass' : 'warning',
        message: hasCORS ? 'CORS headers present' : 'CORS headers missing',
        details: corsHeaders
      })
    } catch (error: any) {
      result.tests.push({
        name: 'CORS Compliance',
        status: 'warning',
        message: 'CORS preflight failed',
        details: { error: error.message }
      })
    }
  }

  private static async testSwaggerUI(result: NetworkDiagnosticResult) {
    try {
      const controller = new AbortController()
      setTimeout(() => controller.abort(), 5000)

      const response = await fetch(`${this.CRM_BASE_URL}/swagger-ui/index.html`, {
        method: 'HEAD',
        signal: controller.signal
      })

      result.tests.push({
        name: 'Swagger UI Access',
        status: response.ok ? 'pass' : 'warning',
        message: response.ok ? 'Swagger UI accessible' : `Swagger UI returned ${response.status}`,
        details: { status: response.status, url: `${this.CRM_BASE_URL}/swagger-ui/index.html` }
      })
    } catch (error: any) {
      result.tests.push({
        name: 'Swagger UI Access',
        status: 'warning',
        message: 'Swagger UI not accessible',
        details: { error: error.message }
      })
    }
  }

  private static generateRecommendations(result: NetworkDiagnosticResult) {
    const failedTests = result.tests.filter(t => t.status === 'fail')
    const warningTests = result.tests.filter(t => t.status === 'warning')

    if (failedTests.some(t => t.name === 'Browser Network Status')) {
      result.recommendations.push('Kiểm tra kết nối internet của thiết bị')
    }

    if (failedTests.some(t => t.name === 'DNS Resolution')) {
      result.recommendations.push('Kiểm tra cấu hình DNS hoặc sử dụng IP trực tiếp')
    }

    if (failedTests.some(t => t.name === 'Basic Connectivity')) {
      result.recommendations.push('Kiểm tra server CRM có đang chạy tại 10.14.122.24:8081')
      result.recommendations.push('Kiểm tra firewall và network security groups')
    }

    if (warningTests.some(t => t.name === 'CORS Compliance')) {
      result.recommendations.push('Cấu hình CORS trên server để allow origin: ' + window.location.origin)
    }

    if (failedTests.some(t => t.name === 'HTTP Connectivity')) {
      result.recommendations.push('Kiểm tra HTTP service và port binding trên server')
    }

    if (warningTests.some(t => t.name === 'Swagger UI Access')) {
      result.recommendations.push('Truy cập trực tiếp Swagger UI để kiểm tra API documentation')
    }

    if (result.recommendations.length === 0) {
      result.recommendations.push('Tất cả các test đã pass - có thể là vấn đề tạm thời')
      result.recommendations.push('Thử refresh trang hoặc đợi một chút rồi thử lại')
    }
  }
}

export default NetworkDiagnostics

