import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

type AddPassengerForm = Omit<Passenger, "passengerId">;

export default function Passengers({
  flightId,
  onBack,
}: {
  flightId: number;
  onBack: () => void;
}) {
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filterMissing, setFilterMissing] = useState(false);
  const [newPassenger, setNewPassenger] = useState<AddPassengerForm>({
    name: "",
    dob: "",
    passportNumber: "",
    address: "",
    email: "",
    phone: "",
    seatNumber: undefined,
    checkInStatus: "N",
    wheelChair: "N",
    infant: "N",
  });

  const navigate = useNavigate();

  const fetchPassengers = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:9092/api/admin/flights/${flightId}/passengers`
      );
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Invalid response format");

      const normalized = data.map((p: any) => ({
        passengerId: p.passengerId,
        name: p.name,
        dob: p.dob ?? p.date_of_birth ?? "",
        passportNumber: p.passportNumber ?? p.passport_number ?? "",
        address: p.address ?? "",
        email: p.email ?? p.email_id ?? "",
        phone: p.phone ?? "",
        seatNumber: p.seatNumber ?? p.seat_number,
        checkInStatus: p.checkInStatus ?? p.check_in_status ?? "N",
        wheelChair: p.wheelChair ?? p.wheel_chair ?? "N",
        infant: p.infant ?? "N",
      }));
      setPassengers(normalized);
      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch passengers.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPassengers();
  }, [flightId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewPassenger({ ...newPassenger, [name]: value });
  };

  const handleAddPassenger = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:9092/api/admin/flights/${flightId}/passengers/add`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...newPassenger, flightId }),
        }
      );
      if (!res.ok) throw new Error("Failed to add passenger");
      setShowForm(false);
      setNewPassenger({
        name: "",
        dob: "",
        passportNumber: "",
        address: "",
        email: "",
        phone: "",
        seatNumber: undefined,
        checkInStatus: "N",
        wheelChair: "N",
        infant: "N",
      });
      fetchPassengers();
    } catch (err) {
      console.error(err);
      alert("Failed to add passenger");
    }
  };

  const displayedPassengers = filterMissing
    ? passengers.filter((p) => !p.passportNumber || !p.address || !p.dob)
    : passengers;

  if (loading) return <h2>Loading passengers...</h2>;
  if (error) return <h2 className="text-red-500">{error}</h2>;

  return (
    <div className="p-4">
      <button
        onClick={onBack}
        className="mb-4 px-3 py-1 border rounded-lg bg-gray-200 hover:bg-gray-300"
      >
        ⬅ Back
      </button>

      <h1 className="text-2xl font-bold mb-4">Passengers</h1>

      <button
        onClick={() => setFilterMissing(!filterMissing)}
        className="mb-4 px-4 py-2 border rounded-lg bg-yellow-200 hover:bg-yellow-300"
      >
        {filterMissing ? "Show All Passengers" : "Show Missing Mandatory Details"}
      </button>

      <div className="space-y-2 mb-6">
        {displayedPassengers.map((p) => (
          <button
            key={p.passengerId}
            className="w-full text-left border rounded-lg p-3 bg-white hover:bg-gray-100"
            onClick={() =>
              navigate(`/passenger/${flightId}/${p.passengerId}`)
            }
          >
            👤 {p.name} (ID: {p.passengerId}) — Seat{" "}
            {p.seatNumber ?? "Unassigned"}
          </button>
        ))}
      </div>

      <button
        onClick={() => setShowForm(!showForm)}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        {showForm ? "Cancel" : "➕ Add Passenger"}
      </button>

      {showForm && (
        <form
          onSubmit={handleAddPassenger}
          className="mt-4 space-y-3 border p-4 rounded-lg bg-gray-50"
        >
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={newPassenger.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="date"
            name="dob"
            value={newPassenger.dob}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="passportNumber"
            placeholder="Passport Number"
            value={newPassenger.passportNumber}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={newPassenger.address}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newPassenger.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={newPassenger.phone}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <input
            type="number"
            name="seatNumber"
            placeholder="Seat Number"
            value={newPassenger.seatNumber ?? ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <select
            name="checkInStatus"
            value={newPassenger.checkInStatus}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="N">Not Checked In</option>
            <option value="Y">Checked In</option>
          </select>
          <select
            name="wheelChair"
            value={newPassenger.wheelChair}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="N">No Wheelchair</option>
            <option value="Y">Wheelchair Needed</option>
          </select>
          <select
            name="infant"
            value={newPassenger.infant}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="N">No Infant</option>
            <option value="Y">Infant</option>
          </select>

          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            ✅ Add Passenger
          </button>
        </form>
      )}
    </div>
  );
}
