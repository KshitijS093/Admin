import React, { useEffect, useState } from "react";

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

type Flight = {
  flightId: number;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
};

export default function ManagePassengers({
  flightId,
  onBack,
}: {
  flightId: number;
  onBack: () => void;
}) {
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [selectedPassenger, setSelectedPassenger] = useState<Passenger | null>(null);
  const [flight, setFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filterMissing, setFilterMissing] = useState(false);
  const [formData, setFormData] = useState<AddPassengerForm>({
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

  // Fetch passengers and flight
  const fetchPassengers = async () => {
    try {
      setLoading(true);
      const [pRes, fRes] = await Promise.all([
        fetch(`http://localhost:9092/api/admin/flights/${flightId}/passengers`),
        fetch(`http://localhost:9092/api/admin/flights/${flightId}`),
      ]);

      if (!pRes.ok || !fRes.ok) throw new Error("Failed to fetch data");

      const pData = await pRes.json();
      const fData = await fRes.json();

      const normalized = Array.isArray(pData)
        ? pData.map((p: any) => ({
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
          }))
        : [];

      setPassengers(normalized);
      setFlight(fData);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load passengers or flight");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPassengers();
  }, [flightId]);

  const handleSelectPassenger = (p: Passenger) => {
    setSelectedPassenger(p);
    setFormData({ ...p });
    setShowForm(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddPassenger = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:9092/api/admin/flights/${flightId}/passengers/add`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, flightId }),
        }
      );
      if (!res.ok) throw new Error("Failed to add passenger");
      setShowForm(false);
      setFormData({
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

  const handleUpdatePassenger = async () => {
    if (!selectedPassenger) return;
    try {
      const res = await fetch(
        `http://localhost:9092/api/admin/flights/${flightId}/passengers/${selectedPassenger.passengerId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      if (!res.ok) throw new Error("Update failed");
      alert("Passenger updated successfully");
      fetchPassengers();
      setSelectedPassenger({ ...formData, passengerId: selectedPassenger.passengerId });
    } catch (err) {
      console.error(err);
      alert("Failed to update passenger");
    }
  };

  const handleDeletePassenger = async () => {
    if (!selectedPassenger) return;
    if (!window.confirm("Are you sure you want to delete this passenger?")) return;

    try {
      const res = await fetch(
        `http://localhost:9092/api/admin/flights/${flightId}/passengers/${selectedPassenger.passengerId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Delete failed");
      alert("Passenger deleted successfully");
      setSelectedPassenger(null);
      fetchPassengers();
    } catch (err) {
      console.error(err);
      alert("Failed to delete passenger");
    }
  };

  const displayedPassengers = filterMissing
    ? passengers.filter((p) => !p.passportNumber || !p.address || !p.dob)
    : passengers;

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2 className="text-red-500">{error}</h2>;

  return (
    <div className="p-4 flex gap-6">
      {/* Passenger List */}
      <div className="w-1/3">
        <button
          onClick={onBack}
          className="mb-4 px-3 py-1 border rounded-lg bg-gray-200 hover:bg-gray-300"
        >
          ⬅ Back
        </button>

        <h2 className="text-xl font-bold mb-2">Passengers</h2>

        <button
          onClick={() => setFilterMissing(!filterMissing)}
          className="mb-4 px-2 py-1 border rounded bg-yellow-200 hover:bg-yellow-300"
        >
          {filterMissing ? "Show All" : "Show Missing Details"}
        </button>

        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {displayedPassengers.map((p) => (
            <button
              key={p.passengerId}
              className={`w-full text-left border rounded-lg p-2 hover:bg-gray-100 ${
                selectedPassenger?.passengerId === p.passengerId ? "bg-gray-200" : "bg-white"
              }`}
              onClick={() => handleSelectPassenger(p)}
            >
              {p.name} — Seat {p.seatNumber ?? "Unassigned"}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            setSelectedPassenger(null);
            setShowForm(true);
            setFormData({
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
          }}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
        >
          ➕ Add Passenger
        </button>
      </div>

      {/* Passenger Details / Add Form */}
      <div className="w-2/3 border p-4 rounded-lg bg-gray-50">
        {showForm ? (
          <>
            <h2 className="text-lg font-bold mb-2">Add New Passenger</h2>
            <form className="space-y-2" onSubmit={handleAddPassenger}>
              {Object.entries(formData).map(([key, value]) =>
                key !== "passengerId" ? (
                  <input
                    key={key}
                    name={key}
                    value={value ?? ""}
                    onChange={handleChange}
                    placeholder={key}
                    className="w-full border p-2 rounded"
                  />
                ) : null
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                ✅ Add Passenger
              </button>
            </form>
          </>
        ) : selectedPassenger ? (
          <>
            <h2 className="text-lg font-bold mb-2">{selectedPassenger.name}</h2>
            <p className="mb-2">
              Flight: {flight?.flightNumber} ({flight?.origin} → {flight?.destination})
            </p>

            <div className="space-y-1">
              {Object.entries(formData).map(([key, value]) =>
              key !== "passengerId" ? (
                <div key={key} className="flex items-center gap-2">
                  <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                  <input
                    name={key}
                    value={value ?? ""}
                    onChange={handleChange}
                    className="border p-1 rounded flex-1"
                  />
                </div>
              ) : null
            )}

            </div>

            <div className="flex gap-2 mt-2">
              <button
                onClick={handleUpdatePassenger}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Update
              </button>
              <button
                onClick={handleDeletePassenger}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </>
        ) : (
          <h2 className="text-gray-500">No Passenger Selected</h2>
        )}
      </div>
    </div>
  );
}
