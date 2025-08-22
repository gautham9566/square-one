import { Link } from 'react-router-dom'

export default function PassengerList({ passengers, flights }) {
  function flightName(flightId) {
    const f = flights.find(x => x.id === flightId)
    return f ? `${f.name} (${f.route})` : 'Unknown'
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="p-2">Name</th>
            <th className="p-2">Flight</th>
            <th className="p-2">Seat</th>
            <th className="p-2">Ancillary Services</th>
            <th className="p-2">Passport</th>
            <th className="p-2">DOB</th>
            <th className="p-2">Address</th>
          </tr>
        </thead>
        <tbody>
          {passengers.map(p => (
            <tr key={p.id} className="border-b">
              <td className="p-2"><Link to={encodeURI(`/admin/passengers/${p.name}`)} className="text-indigo-600">{p.name}</Link></td>
              <td className="p-2">{flightName(p.flightId)}</td>
              <td className="p-2">{p.seat || '-'}</td>
              <td className="p-2">{(p.services || []).join(', ') || '-'}</td>
              <td className="p-2">{p.passportNumber || '-'}</td>
              <td className="p-2">{p.dateOfBirth || '-'}</td>
              <td className="p-2">{p.address || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
