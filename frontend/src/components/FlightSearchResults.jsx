import React, { useState } from 'react';
import { FlightCard } from './ui/Card';
import Button from './ui/Button';
import Input, { LocationInput, DateInput } from './ui/Input';

const FlightSearchResults = ({ 
  flights = [],
  onBookFlight,
  className = ''
}) => {
  const [searchParams, setSearchParams] = useState({
    from: 'Dhaka',
    to: "Cox's Bazar",
    departureDate: '2024-03-20',
    returnDate: '2024-03-28',
    passengers: '1 Room, 2 Traveler',
    tripType: 'oneWay',
    classType: '1 Adult',
    economyType: 'Economy'
  });

  const [activeTab, setActiveTab] = useState('cheapest');

  // Mock flight data if no flights provided
  const mockFlights = [
    {
      id: 1,
      airline: 'PIA',
      logo: '/api/placeholder/50/50',
      departureTime: '20:00',
      arrivalTime: '24:00',
      departureCode: 'DAC',
      arrivalCode: 'CXB',
      duration: '4h',
      stops: 'Non stop',
      price: 499,
      currency: 'PAK'
    },
    {
      id: 2,
      airline: 'Air Arabia',
      logo: '/api/placeholder/50/50',
      departureTime: '15:00',
      arrivalTime: '12:00',
      departureCode: 'DAC',
      arrivalCode: 'CXB',
      duration: '4h 30min',
      stops: 'Non stop',
      price: 320,
      currency: 'PAK'
    },
    {
      id: 3,
      airline: 'Air Sial',
      logo: '/api/placeholder/50/50',
      departureTime: '13:00',
      arrivalTime: '20:00',
      departureCode: 'DAC',
      arrivalCode: 'CXB',
      duration: '6h',
      stops: 'Non stop',
      price: 400,
      currency: 'PAK'
    }
  ];

  const displayFlights = flights.length > 0 ? flights : mockFlights;

  const handleSearch = () => {
    console.log('Searching with params:', searchParams);
  };

  const handleBookFlight = (flight) => {
    if (onBookFlight) {
      onBookFlight(flight);
    } else {
      console.log('Booking flight:', flight);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b from-flight-bg to-blue-200 ${className}`}>
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container-flight py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-flight-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <h1 className="text-xl font-semibold text-neutral-900">Flight Booking</h1>
            </div>
            
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-2 text-neutral-700 hover:text-neutral-900">
                <span>Customer Support</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <button className="text-neutral-700 hover:text-neutral-900">Explore</button>
              
              <button className="flex items-center gap-2">
                <img src="/api/placeholder/24/16" alt="USA" className="w-6 h-4 rounded" />
                <span className="text-neutral-700">USA</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-neutral-300"></div>
                <span className="text-neutral-700">HR Rumen</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Form */}
      <div className="container-flight py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="grid grid-cols-5 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">From</label>
              <LocationInput
                value={searchParams.from}
                onChange={(e) => setSearchParams({...searchParams, from: e.target.value})}
                placeholder="City or Airport"
              />
              <div className="text-xs text-neutral-500 mt-1">Dac, Hazrat Shahjalal Interna...</div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">To</label>
              <LocationInput
                value={searchParams.to}
                onChange={(e) => setSearchParams({...searchParams, to: e.target.value})}
                placeholder="City or Airport"
              />
              <div className="text-xs text-neutral-500 mt-1">CXB, Cox's Bazar Airport</div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Departure Date</label>
              <DateInput
                value={searchParams.departureDate}
                onChange={(e) => setSearchParams({...searchParams, departureDate: e.target.value})}
              />
              <div className="text-xs text-neutral-500 mt-1">Sunday</div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Return Date</label>
              <DateInput
                value={searchParams.returnDate}
                onChange={(e) => setSearchParams({...searchParams, returnDate: e.target.value})}
              />
              <div className="text-xs text-neutral-500 mt-1">Friday</div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Room & Traveler</label>
              <Input
                value={searchParams.passengers}
                onChange={(e) => setSearchParams({...searchParams, passengers: e.target.value})}
                placeholder="Passengers"
              />
              <div className="text-xs text-neutral-500 mt-1">2 Adult</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="tripType"
                  value="oneWay"
                  checked={searchParams.tripType === 'oneWay'}
                  onChange={(e) => setSearchParams({...searchParams, tripType: e.target.value})}
                  className="w-4 h-4 text-flight-primary focus:ring-flight-primary"
                />
                <span className="text-sm text-neutral-700">One Way</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="tripType"
                  value="return"
                  checked={searchParams.tripType === 'return'}
                  onChange={(e) => setSearchParams({...searchParams, tripType: e.target.value})}
                  className="w-4 h-4 text-flight-primary focus:ring-flight-primary"
                />
                <span className="text-sm text-neutral-700">Return</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="tripType"
                  value="multiCity"
                  checked={searchParams.tripType === 'multiCity'}
                  onChange={(e) => setSearchParams({...searchParams, tripType: e.target.value})}
                  className="w-4 h-4 text-flight-primary focus:ring-flight-primary"
                />
                <span className="text-sm text-neutral-700">Multi City</span>
              </label>
              
              <select 
                value={searchParams.classType}
                onChange={(e) => setSearchParams({...searchParams, classType: e.target.value})}
                className="px-3 py-1.5 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-flight-primary focus:border-transparent"
              >
                <option>1 Adult</option>
                <option>2 Adults</option>
                <option>3 Adults</option>
              </select>
              
              <select 
                value={searchParams.economyType}
                onChange={(e) => setSearchParams({...searchParams, economyType: e.target.value})}
                className="px-3 py-1.5 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-flight-primary focus:border-transparent"
              >
                <option>Economy</option>
                <option>Business</option>
                <option>First Class</option>
              </select>
            </div>
            
            <Button variant="primary" onClick={handleSearch} className="px-8">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search Flight
            </Button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="container-flight pb-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Tabs */}
          <div className="flex items-center gap-8 mb-6">
            <button
              onClick={() => setActiveTab('cheapest')}
              className={`pb-2 border-b-2 transition-colors ${
                activeTab === 'cheapest' 
                  ? 'border-flight-primary text-flight-primary font-medium' 
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <div className="text-lg">Cheapest</div>
              <div className="text-sm text-neutral-500">Enjoy trip with the most affordable flight available!</div>
            </button>
            
            <button
              onClick={() => setActiveTab('fastest')}
              className={`pb-2 border-b-2 transition-colors ${
                activeTab === 'fastest' 
                  ? 'border-flight-primary text-flight-primary font-medium' 
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <div className="text-lg">Fastest</div>
              <div className="text-sm text-neutral-500">Get quickest flight to your destination!</div>
            </button>
          </div>

          {/* Flight Time Display */}
          <div className="flex items-center justify-end gap-8 mb-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-neutral-900">39:20</div>
              <div className="text-sm text-neutral-500">min sec</div>
            </div>
            
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-neutral-700">+99 568 568 565412</span>
            </div>
            
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-neutral-700">tripbookingpk@gmail.com</span>
            </div>
          </div>

          {/* Search Results Info */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">
              Select your departing flight to "Cox's Bazar"
            </h2>
            <p className="text-sm text-neutral-600">4 Results found for you</p>
          </div>

          {/* Flight Cards */}
          <div className="space-y-4">
            {displayFlights.map((flight) => (
              <FlightCard
                key={flight.id}
                {...flight}
                onBook={() => handleBookFlight(flight)}
              />
            ))}
          </div>
          
          {/* View More */}
          <div className="flex justify-center mt-6">
            <Button variant="ghost" className="text-flight-primary">
              View details
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightSearchResults;
