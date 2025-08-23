// Simple test service to verify API Gateway connectivity
const API_BASE = 'http://localhost:8090'

export async function testGatewayConnection() {
  try {
    console.log('Testing API Gateway connection...')
    
    // Test 1: Basic gateway health check
    const healthResponse = await fetch(`${API_BASE}/actuator/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    
    console.log('Gateway health response:', healthResponse.status, healthResponse.statusText)
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json()
      console.log('Gateway health data:', healthData)
    }
    
    // Test 2: Try to reach a backend service through gateway
    const backendResponse = await fetch(`${API_BASE}/backend1/actuator/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })
    
    console.log('Backend1 through gateway:', backendResponse.status, backendResponse.statusText)
    
    return {
      gatewayHealth: healthResponse.ok,
      backendAccess: backendResponse.ok || backendResponse.status === 404, // 404 is still connectivity
      gatewayStatus: healthResponse.status,
      backendStatus: backendResponse.status
    }
    
  } catch (error) {
    console.error('Gateway connection test failed:', error)
    return {
      gatewayHealth: false,
      backendAccess: false,
      error: error.message
    }
  }
}

export default { testGatewayConnection }
