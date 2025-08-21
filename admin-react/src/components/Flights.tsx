import { useEffect, useState } from "react";
import FlightDetails from "./FlightDetails";
import './Flights.css';

type Flight = {
  flightId: number;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  aircraftId: number;
};

function FlightRow({ flight, onSelect }: { flight: Flight; onSelect: (f: Flight) => void }) {
  return (
    <tr onClick={() => onSelect(flight)} style={{ cursor: "pointer" }}>
      <td>{flight.flightId}</td>
      <td>{flight.flightNumber}</td>
      <td>{flight.origin}</td>
      <td>{flight.destination}</td>
      <td>{new Date(flight.departureTime).toLocaleString()}</td>
      <td>{new Date(flight.arrivalTime).toLocaleString()}</td>
    </tr>
  );
}

export default function Flights() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const res = await fetch("http://localhost:9092/api/admin/flights");
        const data = await res.json();
        setFlights(data);
      } catch (error) {
        console.error("Error fetching flights:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, []);

  if (loading) {
    return (
      <div className="admin-container">
        <p className="admin-subtext">Loading flights...</p>
      </div>
    );
  }

  if (!selectedFlight && flights.length === 0) {
    return (
      <div className="admin-container">
        <p className="admin-subtext">No flights found.</p>
      </div>
    );
  }

  // ✅ Show FlightDetails page when a flight is selected
  if (selectedFlight) {
    return <FlightDetails flight={selectedFlight} onBack={() => setSelectedFlight(null)} />;
  }

  // ✅ Default flight list view
  return (
    <div className="admin-container">
      <h1 className="admin-heading">Welcome Admin</h1>
      <p className="admin-subtext">Manage and monitor flights below</p>

      <div className="flight-table-wrapper">
        <table className="flight-table">
          <thead>
            <tr>
              <th>Flight ID</th>
              <th>Flight Number</th>
              <th>Origin</th>
              <th>Destination</th>
              <th>Departure</th>
              <th>Arrival</th>
            </tr>
          </thead>
          <tbody>
            {flights.map((flight) => (
              <FlightRow key={flight.flightId} flight={flight} onSelect={setSelectedFlight} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
