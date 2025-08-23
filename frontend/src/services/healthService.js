const API_BASE = 'http://localhost:8090'

// All requests go through the API Gateway to avoid CORS issues
const SERVICE_CONFIGS = {
  'API Gateway': { 
    healthPath: '/actuator/health',
    simplePath: '/',
    direct: true // API Gateway is accessed directly
  },
  'Eureka Server': { 
    healthPath: '/eureka/actuator/health',
    simplePath: '/eureka/',
    fallbackDirect: 'http://localhost:8761' // Fallback to direct access
  },
  'Authentication': { 
    healthPath: '/backend1/actuator/health',
    simplePath: '/backend1/'
  },
  'Flights': { 
    healthPath: '/flights/actuator/health',
    simplePath: '/flights/'
  },
  'Passengers': { 
    healthPath: '/passengers/actuator/health',
    simplePath: '/passengers/'
  },
  'User Management': { 
    healthPath: '/usermanagement/actuator/health',
    simplePath: '/usermanagement/'
  },
  'Service Management': { 
    healthPath: '/service-management/actuator/health',
    simplePath: '/service-management/'
  },
  'Travel History': { 
    healthPath: '/travel-history/actuator/health',
    simplePath: '/travel-history/'
  }
}

// Check health of a single service (route through API Gateway to avoid CORS)
async function checkServiceHealth(serviceName) {
  const startTime = Date.now()
  const config = SERVICE_CONFIGS[serviceName]
  
  if (!config) {
    return {
      name: serviceName,
      status: 'DOWN',
      responseTime: 0,
      error: 'Service configuration not found'
    }
  }
  
  // Build the health URL
  let healthUrl
  if (config.direct) {
    healthUrl = `${API_BASE}${config.healthPath}`
  } else if (serviceName === 'Eureka Server' && config.fallbackDirect) {
    // Try direct access for Eureka first
    healthUrl = `${config.fallbackDirect}/actuator/health`
  } else {
    healthUrl = `${API_BASE}${config.healthPath}`
  }
  
  // First try the health endpoint
  try {
    const response = await fetch(healthUrl, {
      method: 'GET',
      timeout: 8000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    
    const responseTime = Date.now() - startTime
    
    if (response.ok) {
      try {
        const data = await response.json()
        return {
          name: serviceName,
          status: data.status === 'UP' ? 'UP' : 'DOWN',
          responseTime,
          details: data,
          endpoint: 'health'
        }
      } catch (jsonError) {
        // Response OK but not JSON - service is up
        return {
          name: serviceName,
          status: 'UP',
          responseTime,
          details: { status: 'Service responding (non-JSON)' },
          endpoint: 'health'
        }
      }
    } else if (response.status === 404 || response.status === 401 || response.status === 403) {
      // Health endpoint not available, try simple endpoint
      return await checkSimpleEndpoint(serviceName, startTime)
    } else {
      // Service error
      return {
        name: serviceName,
        status: 'PARTIAL',
        responseTime,
        error: `HTTP ${response.status}: ${response.statusText}`,
        endpoint: 'health'
      }
    }
  } catch (error) {
    // If health check fails, try simple endpoint
    if (serviceName === 'Eureka Server' && config.fallbackDirect) {
      // Try gateway route for Eureka as fallback
      try {
        const gatewayHealthUrl = `${API_BASE}${config.healthPath}`
        const response = await fetch(gatewayHealthUrl, {
          method: 'GET',
          timeout: 5000,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        })
        
        const responseTime = Date.now() - startTime
        if (response.ok) {
          const data = await response.json()
          return {
            name: serviceName,
            status: data.status === 'UP' ? 'UP' : 'DOWN',
            responseTime,
            details: data,
            endpoint: 'health-gateway'
          }
        }
      } catch (gatewayError) {
        // Continue to simple endpoint check
      }
    }
    
    return await checkSimpleEndpoint(serviceName, startTime)
  }
}

// Check simple endpoint (just test if service is responding through gateway)
async function checkSimpleEndpoint(serviceName, startTime) {
  const config = SERVICE_CONFIGS[serviceName]
  
  let simpleUrl
  if (config.direct) {
    simpleUrl = `${API_BASE}${config.simplePath}`
  } else if (serviceName === 'Eureka Server' && config.fallbackDirect) {
    // Try direct access for Eureka
    simpleUrl = config.fallbackDirect
  } else {
    simpleUrl = `${API_BASE}${config.simplePath}`
  }
  
  try {
    const response = await fetch(simpleUrl, {
      method: 'GET',
      timeout: 5000,
      headers: {
        'Accept': '*/*'
      }
    })
    
    const responseTime = Date.now() - startTime
    
    // Any response (even 404, 401, etc.) means the service is up
    if (response.status < 500) {
      return {
        name: serviceName,
        status: 'UP',
        responseTime,
        details: { status: 'Service responding', httpStatus: response.status },
        endpoint: 'simple'
      }
    } else {
      return {
        name: serviceName,
        status: 'PARTIAL',
        responseTime,
        error: `HTTP ${response.status}: ${response.statusText}`,
        endpoint: 'simple'
      }
    }
  } catch (error) {
    // If direct Eureka fails, try through gateway
    if (serviceName === 'Eureka Server' && config.fallbackDirect && simpleUrl === config.fallbackDirect) {
      try {
        const gatewayUrl = `${API_BASE}${config.simplePath}`
        const response = await fetch(gatewayUrl, {
          method: 'GET',
          timeout: 5000
        })
        
        const responseTime = Date.now() - startTime
        if (response.status < 500) {
          return {
            name: serviceName,
            status: 'UP',
            responseTime,
            details: { status: 'Service responding via gateway', httpStatus: response.status },
            endpoint: 'simple-gateway'
          }
        }
      } catch (gatewayError) {
        // Fall through to error response
      }
    }
    
    return {
      name: serviceName,
      status: 'DOWN',
      responseTime: Date.now() - startTime,
      error: error.message,
      endpoint: 'simple'
    }
  }
}

// Check health of all services
export async function checkAllServicesHealth() {
  const healthChecks = Object.keys(SERVICE_CONFIGS).map(serviceName =>
    checkServiceHealth(serviceName)
  )
  
  const results = await Promise.all(healthChecks)
  
  // Calculate overall system status
  const upServices = results.filter(r => r.status === 'UP').length
  const partialServices = results.filter(r => r.status === 'PARTIAL').length
  const totalServices = results.length
  const upPercentage = Math.round((upServices / totalServices) * 100)
  const availablePercentage = Math.round(((upServices + partialServices) / totalServices) * 100)
  
  let overallStatus = 'DOWN'
  if (upPercentage === 100) {
    overallStatus = 'UP'
  } else if (availablePercentage >= 70) {
    overallStatus = 'PARTIAL'
  }
  
  return {
    overall: {
      status: overallStatus,
      upServices,
      totalServices,
      upPercentage,
      availablePercentage
    },
    services: results
  }
}

// Get Eureka registered services (try gateway first, then direct)
export async function getRegisteredServices() {
  // Try through API Gateway first
  try {
    const response = await fetch(`${API_BASE}/eureka/apps`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      return parseEurekaResponse(data)
    }
  } catch (error) {
    console.warn('Failed to fetch Eureka services through gateway, trying direct:', error.message)
  }
  
  // Fallback to direct Eureka access
  try {
    const response = await fetch('http://localhost:8761/eureka/apps', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })
    
    if (!response.ok) {
      // If JSON endpoint fails, try simple endpoint
      if (response.status === 404) {
        const simpleResponse = await fetch('http://localhost:8761', {
          method: 'GET'
        })
        if (simpleResponse.ok) {
          // Eureka is running but in different mode
          return [{
            name: 'EUREKA-SERVER',
            instanceId: 'eureka-server',
            status: 'UP',
            homePageUrl: 'http://localhost:8761',
            healthCheckUrl: 'http://localhost:8761/actuator/health',
            port: '8761'
          }]
        }
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    return parseEurekaResponse(data)
  } catch (error) {
    console.error('Failed to fetch Eureka services:', error)
    return []
  }
}

// Parse Eureka response data
function parseEurekaResponse(data) {
  const services = []
  
  if (data.applications && data.applications.application) {
    const apps = Array.isArray(data.applications.application) 
      ? data.applications.application 
      : [data.applications.application]
      
    apps.forEach(app => {
      const instances = Array.isArray(app.instance) ? app.instance : [app.instance]
      instances.forEach(instance => {
        services.push({
          name: app.name,
          instanceId: instance.instanceId,
          status: instance.status,
          homePageUrl: instance.homePageUrl,
          healthCheckUrl: instance.healthCheckUrl,
          port: instance.port ? instance.port.$ : 'N/A'
        })
      })
    })
  }
  
  return services
}

// Get system metrics and statistics
export async function getSystemMetrics() {
  const healthData = await checkAllServicesHealth()
  const registeredServices = await getRegisteredServices()
  
  return {
    timestamp: new Date().toISOString(),
    health: healthData,
    discovery: {
      totalRegistered: registeredServices.length,
      services: registeredServices
    },
    metrics: {
      averageResponseTime: healthData.services.reduce((sum, service) => 
        sum + (service.responseTime || 0), 0) / healthData.services.length
    }
  }
}

export default {
  checkAllServicesHealth,
  getRegisteredServices,
  getSystemMetrics,
  checkServiceHealth
}
