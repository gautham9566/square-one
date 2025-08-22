import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import * as flightService from '../../services/flightService'
import * as userService from '../../services/userService'
import * as passengerService from '../../services/passengerService'
import Layout from '../../components/Layout'
import Card, { CardHeader, CardTitle, CardBody, CardFooter } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import FlightSearchResults from '../../components/FlightSearchResults'
import SeatMap from '../../components/SeatMap'

export default function PassengerBooking() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const flightId = state?.flightId
  
  const [currentStep, setCurrentStep] = useState(1) // 1: Search/Select, 2: Passenger Info, 3: Seat Selection, 4: Payment
  const [flights, setFlights] = useState([])
  const [selectedFlight, setSelectedFlight] = useState(null)
  const [passengerUser, setPassengerUser] = useState(null)
  const [selectedSeats, setSelectedSeats] = useState([])
  const [loading, setLoading] = useState(false)

  const [searchForm, setSearchForm] = useState({
    from: '',
    to: '',
    departureDate: '',
    returnDate: '',
    passengers: 1,
    tripType: 'oneWay'
  })

  const [passengerForm, setPassengerForm] = useState({ 
    name: '', 
    email: '', 
    phoneNumber: '', 
    passportNumber: '', 
    dateOfBirth: '' 
  })

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      if (flightId) {
        const flight = await flightService.findById(flightId)
        setSelectedFlight(flight)
        setCurrentStep(2)
      } else {
        // Load mock flights for demo
        setFlights([
          {
            id: 1,
            airline: 'PIA',
            flightNumber: 'PK-499',
            departureTime: '2024-03-20T20:00:00',
            arrivalTime: '2024-03-21T00:00:00',
            departureCity: 'Dhaka',
            arrivalCity: 'Cox\'s Bazar',
            departureCode: 'DAC',
            arrivalCode: 'CXB',
            duration: 240,
            stops: 0,
            price: 499,
            availableSeats: 45
          },
          {
            id: 2,
            airline: 'Air Arabia',
            flightNumber: 'G9-320',
            departureTime: '2024-03-20T15:00:00',
            arrivalTime: '2024-03-20T20:00:00',
            departureCity: 'Dhaka',
            arrivalCity: 'Cox\'s Bazar',
            departureCode: 'DAC',
            arrivalCode: 'CXB',
            duration: 300,
            stops: 1,
            price: 320,
            availableSeats: 23
          },
          {
            id: 3,
            airline: 'Air Sial',
            flightNumber: 'PF-400',
            departureTime: '2024-03-20T13:00:00',
            arrivalTime: '2024-03-20T20:00:00',
            departureCity: 'Dhaka',
            arrivalCity: 'Cox\'s Bazar',
            departureCode: 'DAC',
            arrivalCode: 'CXB',
            duration: 420,
            stops: 0,
            price: 400,
            availableSeats: 67
          }
        ])
      }
      
      const users = await userService.listByRole('passenger')
      if (users && users.length > 0) {
        setPassengerUser(users[0])
        setPassengerForm({
          name: users[0].name || '',
          email: users[0].email || '',
          phoneNumber: users[0].phoneNumber || '',
          passportNumber: '',
          dateOfBirth: ''
        })
      }
    } catch (e) { 
      console.error(e) 
    }
  }

  const handleSearchChange = (e) => {
    setSearchForm({ ...searchForm, [e.target.name]: e.target.value })
  }

  const handlePassengerChange = (e) => {
    setPassengerForm({ ...passengerForm, [e.target.name]: e.target.value })
  }

  const handleFlightSelect = (flight) => {
    setSelectedFlight(flight)
    setCurrentStep(2)
  }

  const handleSeatSelect = (seatId, isSelected) => {
    if (isSelected) {
      setSelectedSeats([...selectedSeats, seatId])
    } else {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId))
    }
  }

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1)
  }

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSearchFlights = async () => {
    setLoading(true)
    // Mock search - in real app, this would call an API
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  const handleConfirmBooking = async () => {
    try {
      setLoading(true)
      const newPassenger = {
        flightId: selectedFlight.id,
        name: passengerForm.name,
        phoneNumber: passengerForm.phoneNumber,
        address: '',
        passportNumber: passengerForm.passportNumber,
        dateOfBirth: passengerForm.dateOfBirth,
        from: selectedFlight.departureCity,
        to: selectedFlight.arrivalCity,
        services: [],
        seat: selectedSeats[0] || null,
        checkedIn: false,
        wheelchair: false,
        infant: false,
      }
      const created = await passengerService.create(newPassenger)
      // optional: update flight available seats via flightService
      navigate('/passenger/confirm', { state: { passenger: created, flight: selectedFlight } })
    } catch (err) { 
      console.error('Failed to create passenger', err) 
    } finally {
      setLoading(false)
    }
  }

  const renderStepIndicator = () => {
    const steps = [
      { number: 1, title: 'Search Flights', completed: currentStep > 1 },
      { number: 2, title: 'Passenger Info', completed: currentStep > 2 },
      { number: 3, title: 'Select Seats', completed: currentStep > 3 },
      { number: 4, title: 'Payment', completed: false }
    ]

    return (
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              currentStep === step.number
                ? 'bg-blue-600 border-blue-600 text-white'
                : step.completed
                ? 'bg-green-600 border-green-600 text-white'
                : 'border-gray-300 text-gray-400'
            }`}>
              {step.completed ? '✓' : step.number}
            </div>
            <div className="ml-3">
              <p className={`text-sm font-medium ${
                currentStep === step.number ? 'text-blue-600' : 'text-gray-600'
              }`}>
                {step.title}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-16 h-0.5 mx-4 ${
                step.completed ? 'bg-green-600' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>
    )
  }

  const renderFlightSearch = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Search Flights</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              label="From"
              name="from"
              value={searchForm.from}
              onChange={handleSearchChange}
              placeholder="Departure city"
            />
            <Input
              label="To"
              name="to"
              value={searchForm.to}
              onChange={handleSearchChange}
              placeholder="Destination city"
            />
            <Input
              label="Departure Date"
              type="date"
              name="departureDate"
              value={searchForm.departureDate}
              onChange={handleSearchChange}
            />
            <Input
              label="Passengers"
              type="number"
              name="passengers"
              value={searchForm.passengers}
              onChange={handleSearchChange}
              min="1"
              max="9"
            />
          </div>
          <div className="mt-4 flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="tripType"
                value="oneWay"
                checked={searchForm.tripType === 'oneWay'}
                onChange={handleSearchChange}
                className="mr-2"
              />
              One Way
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="tripType"
                value="return"
                checked={searchForm.tripType === 'return'}
                onChange={handleSearchChange}
                className="mr-2"
              />
              Return
            </label>
          </div>
        </CardBody>
        <CardFooter>
          <Button
            variant="primary"
            onClick={handleSearchFlights}
            loading={loading}
          >
            Search Flights
          </Button>
        </CardFooter>
      </Card>

      <FlightSearchResults 
        flights={flights}
        onBookFlight={handleFlightSelect}
        loading={loading}
      />
    </div>
  )

  const renderPassengerInfo = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Passenger Information</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              name="name"
              value={passengerForm.name}
              onChange={handlePassengerChange}
              required
              placeholder="Enter full name"
            />
            <Input
              label="Email"
              type="email"
              name="email"
              value={passengerForm.email}
              onChange={handlePassengerChange}
              required
              placeholder="Enter email address"
            />
            <Input
              label="Phone Number"
              name="phoneNumber"
              value={passengerForm.phoneNumber}
              onChange={handlePassengerChange}
              required
              placeholder="Enter phone number"
            />
            <Input
              label="Passport Number"
              name="passportNumber"
              value={passengerForm.passportNumber}
              onChange={handlePassengerChange}
              required
              placeholder="Enter passport number"
            />
            <Input
              label="Date of Birth"
              type="date"
              name="dateOfBirth"
              value={passengerForm.dateOfBirth}
              onChange={handlePassengerChange}
              required
            />
          </div>
        </CardBody>
        <CardFooter>
          <div className="flex justify-between">
            <Button variant="outline" onClick={handlePrevStep}>
              Back
            </Button>
            <Button variant="primary" onClick={handleNextStep}>
              Continue
            </Button>
          </div>
        </CardFooter>
      </Card>

      {selectedFlight && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Flight</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-lg">{selectedFlight.airline}</p>
                  <p className="text-gray-600">{selectedFlight.flightNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">
                    ${selectedFlight.price}
                  </p>
                  <p className="text-sm text-gray-500">per person</p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  )

  const renderSeatSelection = () => (
    <div className="space-y-6">
      <SeatMap
        selectedSeats={selectedSeats}
        onSeatSelect={handleSeatSelect}
        unavailableSeats={['1A', '1B', '2C', '15F', '20A']} // Mock unavailable seats
      />
      
      <Card>
        <CardFooter>
          <div className="flex justify-between">
            <Button variant="outline" onClick={handlePrevStep}>
              Back
            </Button>
            <Button
              variant="primary"
              onClick={handleNextStep}
              disabled={selectedSeats.length === 0}
            >
              Continue to Payment
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )

  const renderPayment = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Summary</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Flight fare</span>
              <span>${selectedFlight?.price}</span>
            </div>
            <div className="flex justify-between">
              <span>Seat selection</span>
              <span>$25</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes & fees</span>
              <span>$45</span>
            </div>
            <hr />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${selectedFlight ? selectedFlight.price + 70 : 0}</span>
            </div>
          </div>
        </CardBody>
        <CardFooter>
          <div className="flex justify-between">
            <Button variant="outline" onClick={handlePrevStep}>
              Back
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmBooking}
              loading={loading}
            >
              Confirm Booking
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderFlightSearch()
      case 2:
        return renderPassengerInfo()
      case 3:
        return renderSeatSelection()
      case 4:
        return renderPayment()
      default:
        return renderFlightSearch()
    }
  }

  return (
    <Layout title="Book a Flight">
      <div className="max-w-4xl mx-auto space-y-6">
        {renderStepIndicator()}
        {renderCurrentStep()}
      </div>
    </Layout>
  )
}
