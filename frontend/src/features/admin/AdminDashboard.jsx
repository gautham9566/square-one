import { useNavigate, useLocation } from 'react-router-dom'
import React from 'react'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const location = useLocation()

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
    }
  ]

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

            {/* Simple System Status */}
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                System Status
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-green-600 font-semibold">Database</div>
                  <div className="text-sm text-green-700">Online</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-green-600 font-semibold">API Services</div>
                  <div className="text-sm text-green-700">Active</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-yellow-600 font-semibold">Backup</div>
                  <div className="text-sm text-yellow-700">Scheduled</div>
                </div>
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  )
}
