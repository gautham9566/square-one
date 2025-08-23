import { useNavigate, useLocation } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import healthService from '../../services/healthService'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const [systemHealth, setSystemHealth] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)

  const atAdminRoot = location.pathname.replace(/\/$/, '') === '/admin'

  const quickActions = [
    { 
      title: 'Manage Passengers', 
      description: 'View and manage passenger information',
      onClick: () => navigate('passengers') 
    },
    { 
      title: 'Manage Flights', 
      description: 'Schedule flights and manage aircraft', 
      onClick: () => navigate('flights') 
    },
    { 
      title: 'Manage Routes', 
      description: 'Create and modify flight routes', 
      onClick: () => navigate('routes') 
    },
    { 
      title: 'Travel History', 
      description: 'View passenger travel records', 
      onClick: () => navigate('travel-history') 
    },
    { 
      title: 'User Management', 
      description: 'Manage staff accounts and permissions', 
      onClick: () => navigate('users') 
    },
    { 
      title: 'System Monitor', 
      description: 'Real-time system health and performance monitoring', 
      onClick: () => navigate('system-monitor') 
    }
  ]

  // Function to fetch system health
  const fetchSystemHealth = async () => {
    try {
      setLoading(true)
      const healthData = await healthService.getSystemMetrics()
      setSystemHealth(healthData)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Failed to fetch system health:', error)
      setSystemHealth(null)
    } finally {
      setLoading(false)
    }
  }

  // Initial load and set up polling
  useEffect(() => {
    if (atAdminRoot) {
      fetchSystemHealth()
      
      // Poll every 30 seconds for real-time updates
      const interval = setInterval(fetchSystemHealth, 30000)
      
      return () => clearInterval(interval)
    }
  }, [atAdminRoot])

  // Manual refresh function
  const handleRefresh = () => {
    fetchSystemHealth()
  }

  // Get status color based on service status
  const getStatusColor = (status) => {
    switch (status) {
      case 'UP': return 'green'
      case 'PARTIAL': return 'yellow'
      case 'DOWN': return 'red'
      default: return 'gray'
    }
  }

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'UP': return '✅'
      case 'PARTIAL': return '⚠️'
      case 'DOWN': return '❌'
      default: return '❓'
    }
  }

  return (
    <div>
      {atAdminRoot && (
        <>
                    <div className="max-w-4xl mx-auto px-6 py-8">
            
            {/* Simplified Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {quickActions.map((action, idx) => (
                <div 
                  key={idx} 
                  className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow cursor-pointer" 
                  onClick={action.onClick}
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {action.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {action.description}
                  </p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors">
                    Open →
                  </button>
                </div>
              ))}
            </div>

            {/* Real-time System Status */}
            <div className="bg-white rounded-lg p-6 shadow-sm border mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  System Status
                  {loading && (
                    <span className="ml-2 text-sm text-blue-600">
                      <span className="inline-block animate-spin">⟳</span> Updating...
                    </span>
                  )}
                </h2>
                <div className="flex items-center space-x-3">
                  {lastUpdated && (
                    <span className="text-sm text-gray-500">
                      Last updated: {lastUpdated.toLocaleTimeString()}
                    </span>
                  )}
                  <button
                    onClick={handleRefresh}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Refresh
                  </button>
                </div>
              </div>
              
              {systemHealth ? (
                <>
                  {/* Overall Status */}
                  <div className={`p-4 rounded-lg mb-6 ${systemHealth.health.overall.status === 'UP' ? 'bg-green-50' : 
                    systemHealth.health.overall.status === 'PARTIAL' ? 'bg-yellow-50' : 'bg-red-50'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">
                          {getStatusIcon(systemHealth.health.overall.status)}
                        </span>
                        <div>
                          <h3 className={`text-lg font-semibold ${getStatusColor(systemHealth.health.overall.status) === 'green' ? 'text-green-800' :
                            getStatusColor(systemHealth.health.overall.status) === 'yellow' ? 'text-yellow-800' : 'text-red-800'}`}>
                            Overall System Status: {systemHealth.health.overall.status}
                          </h3>
                          <p className={`text-sm ${getStatusColor(systemHealth.health.overall.status) === 'green' ? 'text-green-700' :
                            getStatusColor(systemHealth.health.overall.status) === 'yellow' ? 'text-yellow-700' : 'text-red-700'}`}>
                            {systemHealth.health.overall.upServices}/{systemHealth.health.overall.totalServices} services operational 
                            ({systemHealth.health.overall.upPercentage}%)
                          </p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(systemHealth.health.overall.status) === 'green' ? 'bg-green-200 text-green-800' :
                        getStatusColor(systemHealth.health.overall.status) === 'yellow' ? 'bg-yellow-200 text-yellow-800' : 'bg-red-200 text-red-800'}`}>
                        Avg Response: {Math.round(systemHealth.metrics.averageResponseTime)}ms
                      </div>
                    </div>
                  </div>

                  {/* Services Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {systemHealth.health.services.map((service, index) => (
                      <div key={index} className={`p-4 rounded-lg border ${service.status === 'UP' ? 'bg-green-50 border-green-200' : 
                        service.status === 'PARTIAL' ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`font-semibold text-sm ${service.status === 'UP' ? 'text-green-800' : 
                            service.status === 'PARTIAL' ? 'text-yellow-800' : 'text-red-800'}`}>
                            {service.name}
                          </span>
                          <span className="text-lg">
                            {service.status === 'UP' ? '✅' : service.status === 'PARTIAL' ? '⚠️' : '❌'}
                          </span>
                        </div>
                        <div className={`text-xs ${service.status === 'UP' ? 'text-green-700' : service.status === 'PARTIAL' ? 'text-yellow-700' : 'text-red-700'}`}>
                          {service.status === 'UP' ? (
                            <>Response: {service.responseTime}ms ({service.endpoint || 'health'})</>
                          ) : service.status === 'PARTIAL' ? (
                            <>Partial: {service.error || 'Limited functionality'}</>
                          ) : (
                            <>Error: {service.error || 'Service unavailable'}</>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Service Discovery Status */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Service Discovery</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Registered Services: {systemHealth.discovery.totalRegistered}
                      </span>
                      <span className={`text-sm px-2 py-1 rounded ${systemHealth.discovery.totalRegistered > 0 ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                        {systemHealth.discovery.totalRegistered > 0 ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    {systemHealth.discovery.services.length > 0 && (
                      <div className="mt-2">
                        <details className="text-sm">
                          <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                            View registered services ({systemHealth.discovery.services.length})
                          </summary>
                          <div className="mt-2 space-y-1">
                            {systemHealth.discovery.services.map((service, index) => (
                              <div key={index} className="flex justify-between items-center py-1 px-2 bg-white rounded">
                                <span className="font-medium">{service.name}</span>
                                <span className={`text-xs px-2 py-1 rounded ${service.status === 'UP' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                  {service.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        </details>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-500 mb-2">
                    {loading ? (
                      <>
                        <span className="inline-block animate-spin text-xl">⟳</span>
                        <p className="mt-2">Loading system status...</p>
                      </>
                    ) : (
                      <>
                        <span className="text-xl">❌</span>
                        <p className="mt-2">Unable to fetch system status</p>
                        <button
                          onClick={handleRefresh}
                          className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors"
                        >
                          Try Again
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>
        </>
      )}
    </div>
  )
}
