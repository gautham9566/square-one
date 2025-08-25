import React, { useState, useEffect, lazy, Suspense } from 'react';
// Demo-only styles. This file contains the design system used only on /demo.
import '../styles/demo.css';
import Button from '../components/ui/Button';
import Input, { SearchInput, DateInput, LocationInput } from '../components/ui/Input';
import Card, { CardHeader, CardTitle, CardDescription, CardBody, CardFooter, FlightCard, TripCard } from '../components/ui/Card';
import Badge, { StatusBadge, FlightStatusBadge, CountBadge } from '../components/ui/Badge';

// Lazy load heavy components
const SeatMap = lazy(() => import('../components/SeatMap'));
const FlightSearchResults = lazy(() => import('../components/FlightSearchResults'));

const DemoPage = () => {
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    // Swap favicon to demo logo while on /demo
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/svg+xml';
    link.rel = 'icon';
    link.href = '/demo-vite.svg';
    document.getElementsByTagName('head')[0].appendChild(link);

    return () => {
      // Restore to blank favicon when leaving /demo
      const blankLink = document.querySelector("link[rel*='icon']");
      if (blankLink) {
        blankLink.href = '/vite.svg';
      }
    };
  }, []);
  
  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'buttons', label: 'Buttons' },
    { id: 'inputs', label: 'Inputs' },
    { id: 'cards', label: 'Cards' },
    { id: 'badges', label: 'Badges' },
    { id: 'flight-search', label: 'Flight Search' },
    { id: 'seat-map', label: 'Seat Map' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-semibold text-neutral-900">Airline Management UI Demo</h1>
            <div className="flex items-center gap-4">
              <Badge variant="primary">v1.0.0</Badge>
              <span className="text-sm text-neutral-600">Consistent Design System</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-neutral-200 sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8 overflow-x-auto py-4">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`whitespace-nowrap pb-2 border-b-2 transition-colors ${
                  activeSection === section.id
                    ? 'border-flight-primary text-flight-primary font-medium'
                    : 'border-transparent text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Section */}
        {activeSection === 'overview' && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle size="xl">Airline Management Design System</CardTitle>
                <CardDescription>
                  A consistent UI design system for the airline management application with flight booking and admin themes.
                </CardDescription>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-4">Flight Booking Theme</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-flight-primary rounded-lg"></div>
                        <div>
                          <div className="font-medium">Primary Blue</div>
                          <div className="text-sm text-neutral-600">#0066ff</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-flight-bg rounded-lg"></div>
                        <div>
                          <div className="font-medium">Sky Blue Background</div>
                          <div className="text-sm text-neutral-600">#87CEEB</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-4">Admin Theme</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-admin-primary rounded-lg"></div>
                        <div>
                          <div className="font-medium">Admin Purple</div>
                          <div className="text-sm text-neutral-600">#6366f1</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-admin-sidebar rounded-lg"></div>
                        <div>
                          <div className="font-medium">Sidebar Purple</div>
                          <div className="text-sm text-neutral-600">#4c1d95</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            <div className="grid grid-cols-3 gap-6">
              <Card variant="flight" hover>
                <div className="text-center">
                  <div className="text-3xl font-bold text-flight-primary">245</div>
                  <div className="text-sm text-neutral-600 mt-1">Active Flights</div>
                </div>
              </Card>
              
              <Card variant="admin" hover>
                <div className="text-center">
                  <div className="text-3xl font-bold text-admin-primary">1,234</div>
                  <div className="text-sm text-neutral-600 mt-1">Total Bookings</div>
                </div>
              </Card>
              
              <Card variant="elevated" hover>
                <div className="text-center">
                  <div className="text-3xl font-bold text-status-completed">98.5%</div>
                  <div className="text-sm text-neutral-600 mt-1">On-Time Rate</div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Buttons Section */}
        {activeSection === 'buttons' && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Button Components</CardTitle>
                <CardDescription>Various button styles for different use cases</CardDescription>
              </CardHeader>
              <CardBody className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-neutral-700 mb-3">Flight Booking Buttons</h4>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="primary">Search Flight</Button>
                    <Button variant="bookNow">Book Now</Button>
                    <Button variant="secondary">Cancel</Button>
                    <Button variant="outline">View Details</Button>
                    <Button variant="ghost">Skip</Button>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-neutral-700 mb-3">Admin Buttons</h4>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="admin">Save Changes</Button>
                    <Button variant="adminOutline">Edit</Button>
                    <Button variant="addOptions">Add Options</Button>
                    <Button variant="addOptionsPrimary">+ Add Options</Button>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-neutral-700 mb-3">Status Buttons</h4>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="success">Confirm</Button>
                    <Button variant="danger">Delete</Button>
                    <Button variant="warning">Pending</Button>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-neutral-700 mb-3">Button Sizes</h4>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button size="xs">Extra Small</Button>
                    <Button size="sm">Small</Button>
                    <Button size="md">Medium</Button>
                    <Button size="lg">Large</Button>
                    <Button size="xl">Extra Large</Button>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-neutral-700 mb-3">Button States</h4>
                  <div className="flex flex-wrap gap-3">
                    <Button loading>Loading</Button>
                    <Button disabled>Disabled</Button>
                    <Button fullWidth>Full Width Button</Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {/* Inputs Section */}
        {activeSection === 'inputs' && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Input Components</CardTitle>
                <CardDescription>Form inputs with consistent styling</CardDescription>
              </CardHeader>
              <CardBody className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <Input label="Default Input" placeholder="Enter text..." />
                  <Input label="Required Input" placeholder="This field is required" required />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <LocationInput label="From" placeholder="City or Airport" />
                  <LocationInput label="To" placeholder="City or Airport" />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <DateInput label="Departure Date" />
                  <DateInput label="Return Date" />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <SearchInput placeholder="Search flights..." />
                  <Input label="Disabled Input" placeholder="Cannot edit" disabled />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <Input 
                    label="Input with Error" 
                    placeholder="Enter email" 
                    error="Please enter a valid email address"
                  />
                  <Input 
                    label="Input with Helper Text" 
                    placeholder="Enter password" 
                    helperText="Must be at least 8 characters"
                  />
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {/* Cards Section */}
        {activeSection === 'cards' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Default Card</CardTitle>
                  <CardDescription>A basic card with header and body</CardDescription>
                </CardHeader>
                <CardBody>
                  <p className="text-neutral-600">
                    This is a default card component with standard styling and shadow.
                  </p>
                </CardBody>
                <CardFooter>
                  <Button variant="primary">Action</Button>
                </CardFooter>
              </Card>
              
              <Card variant="admin">
                <CardHeader>
                  <CardTitle>Admin Card</CardTitle>
                  <CardDescription>Card styled for admin interface</CardDescription>
                </CardHeader>
                <CardBody>
                  <p className="text-neutral-600">
                    This card uses the admin theme styling with purple accents.
                  </p>
                </CardBody>
                <CardFooter>
                  <Button variant="admin">Save</Button>
                </CardFooter>
              </Card>
            </div>
            
            <FlightCard
              airline="Pakistan International Airlines"
              departureTime="20:00"
              arrivalTime="24:00"
              departureCode="DAC"
              arrivalCode="CXB"
              duration="4h"
              stops="Non stop"
              price={499}
              currency="PKR"
              onBook={() => console.log('Booking flight')}
            />
            
            <div className="grid grid-cols-3 gap-6">
              <TripCard
                tripId="#4589039"
                date="20 Dec 2024"
                from="New Delhi"
                to="Kuala Lumpur"
                progress={[
                  { completed: true },
                  { completed: true },
                  { completed: false },
                  { completed: false },
                  { completed: false },
                ]}
                onAddOptions={() => console.log('Add options')}
              />
              
              <TripCard
                tripId="#4589040"
                date="22 Dec 2024"
                from="Kuala Lumpur"
                to="LAC Pulau"
                progress={[
                  { completed: true },
                  { completed: true },
                  { completed: true },
                  { completed: false },
                  { completed: false },
                ]}
                onAddOptions={() => console.log('Add options')}
              />
              
              <TripCard
                tripId="#4589041"
                date="26 Dec 2024"
                from="LAC Pulau"
                to="New Delhi"
                progress={[
                  { completed: true },
                  { completed: true },
                  { completed: true },
                  { completed: true },
                  { completed: false },
                ]}
                onAddOptions={() => console.log('Add options')}
              />
            </div>
          </div>
        )}

        {/* Badges Section */}
        {activeSection === 'badges' && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Badge Components</CardTitle>
                <CardDescription>Status indicators and labels</CardDescription>
              </CardHeader>
              <CardBody className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-neutral-700 mb-3">Default Badges</h4>
                  <div className="flex flex-wrap gap-3">
                    <Badge>Default</Badge>
                    <Badge variant="primary">Primary</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="admin">Admin</Badge>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-neutral-700 mb-3">Status Badges</h4>
                  <div className="flex flex-wrap gap-3">
                    <StatusBadge status="Pending" />
                    <StatusBadge status="Completed" />
                    <StatusBadge status="Refunded" />
                    <StatusBadge status="Cancelled" />
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-neutral-700 mb-3">Flight Status Badges</h4>
                  <div className="flex flex-wrap gap-3">
                    <FlightStatusBadge status="On Time" />
                    <FlightStatusBadge status="Delayed" />
                    <FlightStatusBadge status="Boarding" />
                    <FlightStatusBadge status="Departed" />
                    <FlightStatusBadge status="Cancelled" />
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-neutral-700 mb-3">Badge Sizes</h4>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge size="xs">Extra Small</Badge>
                    <Badge size="sm">Small</Badge>
                    <Badge size="default">Default</Badge>
                    <Badge size="lg">Large</Badge>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-neutral-700 mb-3">Special Badges</h4>
                  <div className="flex flex-wrap gap-3">
                    <CountBadge count={5} />
                    <CountBadge count={99} />
                    <CountBadge count={150} />
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="outlinePrimary">Outline Primary</Badge>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {/* Flight Search Section */}
        {activeSection === 'flight-search' && (
          <div className="-mx-4 sm:-mx-6 lg:-mx-8">
            <Suspense fallback={<div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>}>
              <FlightSearchResults />
            </Suspense>
          </div>
        )}

        {/* Seat Map Section */}
        {activeSection === 'seat-map' && (
          <Suspense fallback={<div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>}>
            <SeatMap
              rows={10}
              seatsPerRow={6}
              unavailableSeats={['28', '29', '30', '31', '32', '33', '34', '35']}
              selectedSeats={['26', '27']}
              onSeatSelect={(seatId, selectedSeats) => {
                console.log('Seat selected:', seatId);
                console.log('All selected seats:', selectedSeats);
              }}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default DemoPage;
