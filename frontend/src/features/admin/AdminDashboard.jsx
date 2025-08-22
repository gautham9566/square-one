import { useNavigate, useLocation } from 'react-router-dom'
import React from 'react'
import Card, { CardHeader, CardTitle, CardDescription, CardBody } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import StatsCard from '../../components/StatsCard'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const location = useLocation()

  // show the three buttons only when at the admin root (not on nested /admin/* pages)
  const atAdminRoot = location.pathname.replace(/\/$/, '') === '/admin'

  // Mock data for dashboard stats
  const stats = [
    {
      title: 'Total Passengers',
      value: '1,248',
      subtitle: 'Active bookings',
      icon: '👥',
      trend: '+12% from last month',
      trendDirection: 'up',
      color: 'blue',
      onClick: () => navigate('passengers')
    },
    {
      title: 'Active Flights',
      value: '156',
      subtitle: 'Scheduled today',
      icon: '✈️',
      trend: '+5% from yesterday',
      trendDirection: 'up',
      color: 'green',
      onClick: () => navigate('flights')
    },
    {
      title: 'Routes Available',
      value: '48',
      subtitle: 'Domestic & International',
      icon: '🗺️',
      trend: '2 new routes',
      trendDirection: 'up',
      color: 'purple',
      onClick: () => navigate('routes')
    },
    {
      title: 'Revenue Today',
      value: '$125K',
      subtitle: 'From bookings',
      icon: '💰',
      trend: '+8% from yesterday',
      trendDirection: 'up',
      color: 'yellow'
    }
  ];

  const quickActions = [
    {
      title: 'Manage Passengers',
      description: 'View and manage passenger information, bookings, and travel history',
      icon: '👥',
      color: 'blue',
      onClick: () => navigate('passengers')
    },
    {
      title: 'Manage Flights',
      description: 'Schedule flights, update statuses, and manage aircraft assignments',
      icon: '✈️',
      color: 'green',
      onClick: () => navigate('flights')
    },
    {
      title: 'Manage Routes',
      description: 'Create and modify flight routes, airports, and destinations',
      icon: '🗺️',
      color: 'purple',
      onClick: () => navigate('routes')
    },
    {
      title: 'Travel History',
      description: 'View passenger travel records and analytics',
      icon: '📊',
      color: 'indigo',
      onClick: () => navigate('travel-history')
    },
    {
      title: 'User Management',
      description: 'Manage staff accounts, roles, and permissions',
      icon: '⚙️',
      color: 'red',
      onClick: () => navigate('users')
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {atAdminRoot ? (
        <>
          {/* Header Section */}
          <div className="bg-white shadow-sm border-b border-neutral-200 mb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-neutral-900">Admin Dashboard</h1>
                  <p className="text-neutral-600 mt-1">Manage your airline operations</p>
                </div>
                <div className="flex items-center gap-4">
                  <Button variant="adminOutline" size="sm">
                    Export Data
                  </Button>
                  <Button variant="admin" size="sm">
                    Add New Flight
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card
                  key={index}
                  variant="admin"
                  hover
                  className="cursor-pointer"
                  onClick={stat.onClick}
                >
                  <CardBody className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 rounded-lg bg-${stat.color}-500 flex items-center justify-center text-white text-xl`}>
                          {stat.icon}
                        </div>
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-medium text-neutral-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
                        {stat.subtitle && (
                          <p className="text-sm text-neutral-500">{stat.subtitle}</p>
                        )}
                        {stat.trend && (
                          <div className={`flex items-center mt-1 text-sm ${
                            stat.trendDirection === 'up' ? 'text-green-600' :
                            stat.trendDirection === 'down' ? 'text-red-600' : 'text-neutral-600'
                          }`}>
                            <span className="mr-1">
                              {stat.trendDirection === 'up' ? '↗' :
                               stat.trendDirection === 'down' ? '↘' : '→'}
                            </span>
                            <span>{stat.trend}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card variant="default">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your airline operations efficiently</CardDescription>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {quickActions.map((action, index) => (
                    <Card
                      key={index}
                      className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border border-neutral-200"
                      onClick={action.onClick}
                      hover
                    >
                      <CardBody className="p-4">
                        <div className="flex items-start space-x-4">
                          <div className={`w-12 h-12 rounded-lg bg-${action.color}-500 flex items-center justify-center text-white text-xl flex-shrink-0`}>
                            {action.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-neutral-900 mb-1">{action.title}</h3>
                            <p className="text-sm text-neutral-600 line-clamp-2">{action.description}</p>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Card variant="default">
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                  <CardDescription>Latest passenger bookings</CardDescription>
                </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  {[
                    { passenger: 'John Doe', flight: 'AA123', destination: 'New York', time: '2 mins ago' },
                    { passenger: 'Sarah Wilson', flight: 'BA456', destination: 'London', time: '15 mins ago' },
                    { passenger: 'Mike Johnson', flight: 'UA789', destination: 'Tokyo', time: '1 hour ago' }
                  ].map((booking, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-100">
                      <div>
                        <p className="font-medium text-neutral-900">{booking.passenger}</p>
                        <p className="text-sm text-neutral-600">{booking.flight} to {booking.destination}</p>
                      </div>
                      <span className="text-xs text-neutral-500">{booking.time}</span>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            <Card variant="default">
              <CardHeader>
                <CardTitle>System Alerts</CardTitle>
                <CardDescription>Important notifications</CardDescription>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  {[
                    { type: 'warning', message: 'Flight AA123 delayed by 30 minutes', time: '5 mins ago' },
                    { type: 'info', message: 'New passenger registered: Jane Smith', time: '10 mins ago' },
                    { type: 'success', message: 'Flight BA456 departed on time', time: '25 mins ago' }
                  ].map((alert, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-neutral-50 rounded-lg border border-neutral-100">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        alert.type === 'warning' ? 'bg-status-pending' :
                        alert.type === 'info' ? 'bg-flight-primary' : 'bg-status-completed'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm text-neutral-900">{alert.message}</p>
                        <span className="text-xs text-neutral-500">{alert.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
            </div>
          </div>
        </>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button variant="adminOutline" onClick={() => navigate('/admin')}>
            ← Back to Dashboard
          </Button>
        </div>
      )}
    </div>
  )
}
