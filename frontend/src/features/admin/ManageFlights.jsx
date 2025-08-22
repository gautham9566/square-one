import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as service from '../../services/flightService'
import Card, { CardHeader, CardTitle, CardDescription, CardBody } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input, { SearchInput } from '../../components/ui/Input'
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell, TableActionCell, TableStatusCell } from '../../components/ui/Table'
import Badge, { StatusBadge } from '../../components/ui/Badge'



export default function ManageFlights() {
  const [flights, setFlights] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const nav = useNavigate()

  useEffect(() => {
    let mounted = true
    setLoading(true)
    service.list()
      .then(list => {
        if (mounted) {
          setFlights(list || [])
          setLoading(false)
        }
      })
      .catch(() => {
        if (mounted) {
          setFlights([])
          setLoading(false)
        }
      })
    return () => { mounted = false }
  }, [])

  const displayed = flights.filter(f => {
    if (!search) return true
    const q = search.toLowerCase()
    return (f.name?.toLowerCase().includes(q) || f.route?.toLowerCase().includes(q))
  })

  const getFlightStatus = (flight) => {
    if (!flight.date) return 'Draft'
    const flightDate = new Date(flight.date)
    const today = new Date()
    if (flightDate < today) return 'Completed'
    if (flightDate.toDateString() === today.toDateString()) return 'Active'
    return 'Scheduled'
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-neutral-200 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">Flight Management</h1>
              <p className="text-neutral-600 mt-1">Manage all flights and schedules</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="adminOutline" size="sm">
                Export Flights
              </Button>
              <Button variant="admin" size="sm" onClick={() => nav('/admin/flights/new')}>
                Add New Flight
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search and Filters */}
        <Card className="mb-6">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SearchInput
                  placeholder="Search flights by name or route..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-80"
                />
                <Badge variant="admin" size="sm">
                  {displayed.length} flights
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  Filter
                </Button>
                <Button variant="ghost" size="sm">
                  Sort
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Flights Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Flights</CardTitle>
            <CardDescription>Manage your flight schedules and details</CardDescription>
          </CardHeader>
          <CardBody className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-neutral-500">Loading flights...</div>
              </div>
            ) : displayed.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="text-neutral-500 mb-2">No flights found</div>
                <Button variant="admin" size="sm" onClick={() => nav('/admin/flights/new')}>
                  Create First Flight
                </Button>
              </div>
            ) : (
              <Table variant="admin">
                <TableHeader>
                  <TableRow>
                    <TableHead sortable>Flight Name</TableHead>
                    <TableHead sortable>Route</TableHead>
                    <TableHead sortable>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Services</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayed.map(flight => (
                    <TableRow key={flight.id} clickable>
                      <TableCell>
                        <Link
                          to={`/admin/flights/${flight.id}`}
                          className="font-medium text-admin-primary hover:text-admin-dark"
                        >
                          {flight.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className="text-neutral-600">{flight.route || '-'}</span>
                      </TableCell>
                      <TableCell>
                        {flight.date ? (
                          <span className="text-neutral-900">
                            {new Date(flight.date).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-neutral-400">Not scheduled</span>
                        )}
                      </TableCell>
                      <TableStatusCell status={getFlightStatus(flight)} />
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {(flight.services || []).slice(0, 2).map((service, idx) => (
                            <Badge key={idx} variant="outline" size="xs">
                              {service}
                            </Badge>
                          ))}
                          {(flight.services || []).length > 2 && (
                            <Badge variant="outline" size="xs">
                              +{(flight.services || []).length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableActionCell>
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => nav(`/admin/flights/${flight.id}`)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          className="text-status-refunded hover:text-red-700"
                        >
                          Delete
                        </Button>
                      </TableActionCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
