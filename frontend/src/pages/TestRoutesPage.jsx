import { useState, useEffect } from 'react'
import * as routeService from '../services/routeService'
import authService from '../services/authService'
import Layout from '../components/Layout'
import Card, { CardHeader, CardTitle, CardBody } from '../components/ui/Card'
import Button from '../components/ui/Button'

export default function TestRoutesPage() {
  const [routes, setRoutes] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [apiTest, setApiTest] = useState(null)

  async function testDirectAPI() {
    setLoading(true)
    setApiTest(null)
    try {
      console.log('Testing direct API call...')
      
      // Check if we have a token
      const token = authService.getToken()
      console.log('Token available:', !!token)
      
      const response = await fetch('http://localhost:8090/flights/routes', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      })
      
      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }
      
      const data = await response.json()
      console.log('Direct API response:', data)
      setApiTest(`Success: ${JSON.stringify(data, null, 2)}`)
      
      // Now test with route service
      const serviceResult = await routeService.list()
      console.log('Route service result:', serviceResult)
      setRoutes(serviceResult)
      
    } catch (err) {
      console.error('API test failed:', err)
      setError(err.message)
      setApiTest(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    testDirectAPI()
  }, [])

  return (
    <Layout title="Test Routes API">
      <div className="max-w-4xl mx-auto p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Routes API Connection Test</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <Button onClick={testDirectAPI} loading={loading}>
                Test API Connection
              </Button>
              
              {apiTest && (
                <div className="p-4 bg-gray-100 rounded">
                  <h4 className="font-semibold mb-2">API Test Result:</h4>
                  <pre className="text-sm whitespace-pre-wrap">{apiTest}</pre>
                </div>
              )}
              
              {error && (
                <div className="text-red-500">
                  <strong>Error:</strong> {error}
                </div>
              )}
              
              {!loading && routes.length > 0 && (
                <div>
                  <p><strong>Total routes:</strong> {routes.length}</p>
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Available Routes:</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {routes.slice(0, 5).map((route, index) => (
                        <div key={index} className="border p-2 rounded text-sm">
                          <div><strong>Code:</strong> {route.routeCode}</div>
                          <div><strong>From:</strong> {route.departureCity} ({route.departureAirport})</div>
                          <div><strong>To:</strong> {route.arrivalCity} ({route.arrivalAirport})</div>
                          <div><strong>Status:</strong> {route.status}</div>
                        </div>
                      ))}
                      {routes.length > 5 && (
                        <div className="text-gray-500 text-sm">
                          ... and {routes.length - 5} more routes
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </Layout>
  )
}
