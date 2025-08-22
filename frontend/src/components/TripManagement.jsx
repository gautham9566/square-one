// Trip management component similar to the reference image
import React, { useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import Badge from './ui/Badge';

const TripCard = ({ 
  trip,
  onAddOptions,
  onEditTrip,
  onCancelTrip
}) => {
  const {
    tripId,
    from,
    to,
    date,
    flightIcon,
    trainIcon,
    busIcon,
    status = 'confirmed'
  } = trip;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'danger';
      default: return 'default';
    }
  };

  const getTransportIcon = () => {
    if (flightIcon) return '✈️';
    if (trainIcon) return '🚄';
    if (busIcon) return '🚌';
    return '✈️';
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-lg">
      <div className="flex items-center justify-between">
        {/* Trip Icon and Details */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
            {getTransportIcon()}
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-sm font-medium text-gray-500">Trip Id</span>
              <Badge variant="outline" size="sm">#{tripId}</Badge>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="font-medium">{from}</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <div className="w-8 h-0.5 bg-gray-300"></div>
                <div className="w-0 h-0 border-l-4 border-l-blue-500 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
                <div className="w-8 h-0.5 bg-gray-300"></div>
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              </div>
              <span className="font-medium">{to}</span>
            </div>
          </div>
        </div>

        {/* Date and Status */}
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">Date</p>
            <p className="text-lg font-semibold text-gray-900">{formatDate(date)}</p>
          </div>
          <div className="text-center">
            <Badge variant={getStatusColor(status)} size="md">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>
        </div>

        {/* Action Button */}
        <div>
          <Button 
            variant="primary" 
            size="md"
            onClick={() => onAddOptions(trip)}
            className="min-w-[120px]"
          >
            Add Options
          </Button>
        </div>
      </div>
    </Card>
  );
};

const TripManagement = ({ 
  trips = [],
  onAddOptions,
  onEditTrip,
  onCancelTrip,
  title = "Manage booking process"
}) => {
  const [view, setView] = useState('my'); // 'my' or 'admin'

  const groupTripsByStatus = (trips) => {
    return {
      confirmed: trips.filter(trip => trip.status === 'confirmed'),
      pending: trips.filter(trip => trip.status === 'pending'),
      cancelled: trips.filter(trip => trip.status === 'cancelled')
    };
  };

  const groupedTrips = groupTripsByStatus(trips);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-sm">👤</span>
            </div>
            <span className="text-sm font-medium text-gray-700">Jayjyoti</span>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 w-fit">
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
              view === 'my'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setView('my')}
          >
            My View
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
              view === 'admin'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setView('admin')}
          >
            Admin View
          </button>
        </div>
      </div>

      {/* Navigation Sidebar */}
      <div className="flex space-x-8">
        <div className="w-64 space-y-2">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Navigation</h3>
            <nav className="space-y-2">
              {[
                { icon: '📊', label: 'Dashboard', active: false },
                { icon: '✈️', label: 'Trips', active: true },
                { icon: '📈', label: 'Reports', active: false },
                { icon: '💳', label: 'Advances', active: false },
                { icon: '🏢', label: 'Corporate Cards', active: false },
                { icon: '💰', label: 'Budgets', active: false },
                { icon: '📊', label: 'Analytics', active: false },
                { icon: '⚙️', label: 'My Settings', active: false }
              ].map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                    item.active
                      ? 'bg-purple-100 text-purple-700 font-medium'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{trips.length}</p>
                <p className="text-sm text-gray-500">Total Trips</p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{groupedTrips.confirmed.length}</p>
                <p className="text-sm text-gray-500">Confirmed Trips</p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-600">{groupedTrips.pending.length}</p>
                <p className="text-sm text-gray-500">Pending Trips</p>
              </div>
            </Card>
          </div>

          {/* Trip Cards */}
          <div className="space-y-4">
            {trips.length === 0 ? (
              <Card className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">✈️</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No trips found</h3>
                <p className="text-gray-500 mb-4">Start planning your next adventure</p>
                <Button variant="primary">Create New Trip</Button>
              </Card>
            ) : (
              trips.map((trip, index) => (
                <TripCard
                  key={trip.tripId || index}
                  trip={trip}
                  onAddOptions={onAddOptions}
                  onEditTrip={onEditTrip}
                  onCancelTrip={onCancelTrip}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripManagement;
export { TripCard };
