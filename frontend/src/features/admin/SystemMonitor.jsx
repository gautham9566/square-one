import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import healthService from '../../services/healthService'

export default function SystemMonitor() {
  const navigate = useNavigate()
  const [systemHealth, setSystemHealth] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(10000) // 10 seconds
  const [lastUpdated, setLastUpdated] = useState(null)

  // Function to fetch system health
  const fetchSystemHealth = async () => {
    try {
      setLoading(true)
      setError(null)
      const healthData = await healthService.getSystemMetrics()
      setSystemHealth(healthData)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Failed to fetch system health:', error)
      setError(error.message)
      setSystemHealth(null)
    } finally {
      setLoading(false)
    }
  }

  // Set up auto-refresh
  useEffect(() => {
    fetchSystemHealth()

    let interval = null
    if (autoRefresh) {
      interval = setInterval(fetchSystemHealth, refreshInterval)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoRefresh, refreshInterval])

  // Manual refresh
  const handleRefresh = () => {
    fetchSystemHealth()
  }

  // Toggle auto-refresh
  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh)
  }

  // Change refresh interval
  const handleIntervalChange = (newInterval) => {
    setRefreshInterval(newInterval)
  }

  // Get status color class
  const getStatusColorClass = (status) => {
    switch (status) {
      case 'UP': return 'text-green-600 bg-green-50 border-green-200'
      case 'PARTIAL': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'DOWN': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
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
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/admin')}
            className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">System Monitor</h1>
        </div>
        
        {/* Controls */}
        <div className="flex items-center space-x-4">
          {/* Auto-refresh toggle */}
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={toggleAutoRefresh}
              className="mr-2"
            />
            <span className="text-sm text-gray-600">Auto-refresh</span>
          </label>
          
          {/* Refresh interval selector */}
          {autoRefresh && (
            <select
              value={refreshInterval}
              onChange={(e) => handleIntervalChange(Number(e.target.value))}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value={5000}>5s</option>
              <option value={10000}>10s</option>
              <option value={30000}>30s</option>
              <option value={60000}>1m</option>
            </select>
          )}
          
          {/* Manual refresh button */}
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded transition-colors"
          >
            {loading ? (
              <span className="inline-block animate-spin">⟳</span>
            ) : (
              'Refresh'
            )}
          </button>
        </div>
      </div>

      {/* Last Updated */}
      {lastUpdated && (
        <div className="mb-4 text-sm text-gray-600">
          Last updated: {lastUpdated.toLocaleString()}
          {autoRefresh && (
            <span className="ml-2 text-green-600">
              (Auto-refreshing every {refreshInterval / 1000}s)
            </span>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <span className="text-red-600 text-xl mr-3">❌</span>
            <div>
              <h3 className="text-red-800 font-semibold">Error fetching system status</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && !systemHealth && (
        <div className="text-center py-12">
          <span className="inline-block animate-spin text-4xl text-blue-600">⟳</span>
          <p className="mt-4 text-gray-600">Loading system status...</p>
        </div>
      )}

      {/* System Health Dashboard */}
      {systemHealth && (
        <div className="space-y-6">
          {/* Overall Status Card */}
          <div className={`p-6 rounded-lg border-2 ${getStatusColorClass(systemHealth.health.overall.status)}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-4xl mr-4">
                  {getStatusIcon(systemHealth.health.overall.status)}
                </span>
                <div>
                  <h2 className="text-2xl font-bold">
                    Overall System Status: {systemHealth.health.overall.status}
                  </h2>
                  <p className="text-lg opacity-80">
                    {systemHealth.health.overall.upServices}/{systemHealth.health.overall.totalServices} services operational 
                    ({systemHealth.health.overall.upPercentage}%)
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm opacity-80">Average Response Time</div>
                <div className="text-2xl font-bold">
                  {Math.round(systemHealth.metrics.averageResponseTime)}ms
                </div>
              </div>
            </div>
          </div>

          {/* Services Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {systemHealth.health.services.map((service, index) => (
              <div key={index} className={`p-4 rounded-lg border ${getStatusColorClass(service.status)}`}>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg">{service.name}</h3>
                  <span className="text-2xl">{getStatusIcon(service.status)}</span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="font-semibold">{service.status}</span>
                  </div>
                  
                  {service.status === 'UP' ? (
                    <>
                      <div className="flex justify-between">
                        <span>Response Time:</span>
                        <span className="font-semibold">{service.responseTime}ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Check Type:</span>
                        <span className="font-semibold capitalize">{service.endpoint || 'health'}</span>
                      </div>
                    </>
                  ) : (
                    <div>
                      <span>Error:</span>
                      <div className="font-mono text-xs bg-white bg-opacity-50 p-2 rounded mt-1">
                        {service.error || 'Service unavailable'}
                      </div>
                      {service.endpoint && (
                        <div className="text-xs mt-1">
                          Check type: {service.endpoint}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Service Discovery Details */}
          <div className="bg-white rounded-lg p-6 shadow border">
            <h2 className="text-xl font-semibold mb-4">Service Discovery (Eureka)</h2>
            
            <div className="mb-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span>Registered Services: {systemHealth.discovery.totalRegistered}</span>
                <span className={`px-3 py-1 rounded text-sm font-semibold ${systemHealth.discovery.totalRegistered > 0 ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                  {systemHealth.discovery.totalRegistered > 0 ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {systemHealth.discovery.services.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Instance ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Port
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {systemHealth.discovery.services.map((service, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {service.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                          {service.instanceId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${service.status === 'UP' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {service.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {service.port}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* System Metrics */}
          <div className="bg-white rounded-lg p-6 shadow border">
            <h2 className="text-xl font-semibold mb-4">System Metrics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {systemHealth.health.overall.upPercentage}%
                </div>
                <div className="text-blue-800">System Uptime</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(systemHealth.metrics.averageResponseTime)}ms
                </div>
                <div className="text-purple-800">Avg Response</div>
              </div>
              
              <div className="text-center p-4 bg-indigo-50 rounded-lg">
                <div className="text-2xl font-bold text-indigo-600">
                  {systemHealth.discovery.totalRegistered}
                </div>
                <div className="text-indigo-800">Services Registered</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
