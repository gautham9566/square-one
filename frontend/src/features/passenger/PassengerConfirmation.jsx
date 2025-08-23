import { useLocation, useNavigate } from 'react-router-dom'
import '../../styles/demo.css'
import Button from '../../components/ui/Button'
import Card, { CardHeader, CardTitle, CardDescription, CardBody, CardFooter } from '../../components/ui/Card'
import Badge, { StatusBadge } from '../../components/ui/Badge'

export default function PassengerConfirmation() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const passenger = state?.passenger
  const flight = state?.flight

  if (!passenger || !flight) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Card>
          <CardBody className="text-center py-12">
            <div className="text-neutral-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg">No confirmation data found</p>
              <p className="text-sm">Please try booking again.</p>
            </div>
          </CardBody>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-semibold text-neutral-900">Booking Confirmation</h1>
            <div className="flex items-center gap-4">
              <Badge variant="success">Confirmed</Badge>
              <span className="text-sm text-neutral-600">Passenger Portal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Success Message */}
          <Card variant="flight">
            <CardBody className="text-center py-8">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <CardTitle size="xl" className="text-green-700 mb-2">Booking Confirmed!</CardTitle>
              <CardDescription className="text-lg">
                Congratulations! Your flight booking has been successfully confirmed.
              </CardDescription>
            </CardBody>
          </Card>

          {/* Passenger Details */}
          <Card>
            <CardHeader>
              <CardTitle>Passenger Information</CardTitle>
              <CardDescription>Booking details for your upcoming flight</CardDescription>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-neutral-700">Passenger Name</label>
                    <p className="text-lg font-semibold text-neutral-900">{passenger.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-700">Contact Number</label>
                    <p className="text-neutral-900">{passenger.phoneNumber}</p>
                  </div>
                  {passenger.seat && (
                    <div>
                      <label className="text-sm font-medium text-neutral-700">Seat Assignment</label>
                      <div className="flex items-center gap-2">
                        <Badge variant="primary" size="lg">{passenger.seat}</Badge>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  {passenger.passportNumber && (
                    <div>
                      <label className="text-sm font-medium text-neutral-700">Passport Number</label>
                      <p className="text-neutral-900">{passenger.passportNumber}</p>
                    </div>
                  )}
                  {passenger.dateOfBirth && (
                    <div>
                      <label className="text-sm font-medium text-neutral-700">Date of Birth</label>
                      <p className="text-neutral-900">{passenger.dateOfBirth}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-neutral-700">Booking Status</label>
                    <div className="mt-1">
                      <StatusBadge status="Confirmed">Confirmed</StatusBadge>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Flight Details */}
          <Card>
            <CardHeader>
              <CardTitle>Flight Information</CardTitle>
              <CardDescription>Your confirmed flight details</CardDescription>
            </CardHeader>
            <CardBody>
              <div className="bg-flight-bg rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-4">{flight.name}</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-neutral-700">Route:</span>
                        <span className="font-semibold">{flight.route}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-neutral-700">Date:</span>
                        <span className="font-semibold">{flight.date}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-neutral-700">Departure:</span>
                      <span className="font-semibold">{flight.departureTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-neutral-700">Arrival:</span>
                      <span className="font-semibold">{flight.arrivalTime}</span>
                    </div>
                    {flight.price && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-neutral-700">Total Paid:</span>
                        <span className="text-xl font-bold text-flight-primary">${flight.price}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Actions */}
          <Card>
            <CardBody>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={() => navigate('/passenger')}
                >
                  Back to Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => window.print()}
                >
                  Print Confirmation
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
              <CardDescription>Important information for your upcoming flight</CardDescription>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-flight-primary text-white flex items-center justify-center text-sm font-medium">1</div>
                  <div>
                    <h4 className="font-medium text-neutral-900">Check-in Online</h4>
                    <p className="text-sm text-neutral-600">Online check-in opens 24 hours before departure</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-flight-primary text-white flex items-center justify-center text-sm font-medium">2</div>
                  <div>
                    <h4 className="font-medium text-neutral-900">Arrive Early</h4>
                    <p className="text-sm text-neutral-600">Arrive at least 2 hours before domestic flights, 3 hours for international</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-flight-primary text-white flex items-center justify-center text-sm font-medium">3</div>
                  <div>
                    <h4 className="font-medium text-neutral-900">Bring Required Documents</h4>
                    <p className="text-sm text-neutral-600">Don't forget your ID and any required travel documents</p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
