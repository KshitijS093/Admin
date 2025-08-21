import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type Passenger = {
  passengerId: number;
  name: string;
  dob?: string;
  passportNumber?: string;
  address?: string;
  email?: string;
  phone?: string;
  seatNumber?: number;
  checkInStatus?: string;
  wheelChair?: string;
  infant?: string;
};

export default function PassengerDetails() {
  const { flightId, passengerId } = useParams<{ flightId: string; passengerId: string }>();
  const [passenger, setPassenger] = useState<Passenger | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!flightId || !passengerId) return;

    fetch(`http://localhost:9092/api/admin/flights/${flightId}/passengers/${passengerId}`)
      .then((res) => res.json())
      .then((data) => {
        setPassenger(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [flightId, passengerId]);

  if (loading) return <h2>Loading passenger...</h2>;
  if (!passenger) return <h2>Passenger not found</h2>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-3 py-1 border rounded-lg bg-gray-200 hover:bg-gray-300"
      >
        ⬅ Back
      </button>

      <h1 className="text-2xl font-bold mb-4">{passenger.name}</h1>

      <p>DOB: {passenger.dob}</p>
      <p>Passport: {passenger.passportNumber}</p>
      <p>Address: {passenger.address}</p>
      <p>Email: {passenger.email}</p>
      <p>Phone: {passenger.phone}</p>
      <p>Seat: {passenger.seatNumber ?? "Unassigned"}</p>
      <p>Checked In: {passenger.checkInStatus}</p>
      <p>Wheelchair: {passenger.wheelChair}</p>
      <p>Infant: {passenger.infant}</p>
    </div>
  );
}
