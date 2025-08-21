import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Landing.css";
import "./Services.css";

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
    <div className="p-4">
      <motion.nav className="navbar" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="navbar-left">
          <h1 className="navbar-title">Passengers</h1>
          <p className="navbar-subtitle">Manage passengers for this flight</p>
        </div>
        <div className="navbar-right">
          <button onClick={onBack} className="btn-back">⬅️ Back</button>
        </div>
      </motion.nav>

      <div className="flex gap-6 mt-4">
        {/* Passenger List */}
        <div className="w-1/3">
          <h2 className="text-xl font-bold mb-2">Passengers</h2>

          <button
            onClick={() => setFilterMissing(!filterMissing)}
            className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            {filterMissing ? "Show All" : "Show Missing Details"}
          </button>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            <AnimatePresence>
              {displayedPassengers.map((p, idx) => (
                <motion.button
                  key={p.passengerId}
                  className={`block w-full text-left border rounded p-3 hover:bg-gray-100 ${
                    selectedPassenger?.passengerId === p.passengerId ? "bg-gray-200" : "bg-white"
                  }`}
                  onClick={() => handleSelectPassenger(p)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: idx * 0.08, duration: 0.4 }}
                >
                  👤 {p.name} — Seat {p.seatNumber ?? "Unassigned"}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
          <div className="flex flex-col items-center w-full">
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
              className="mt-4 btn-add w-full"
            >
              ➕ Add Passenger
            </button>
          </div>
        </div>

        {/* Passenger Details / Add Form */}
        <div className="w-2/3">
          <AnimatePresence>
            {showForm && (
              <motion.div
                key="add-passenger"
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="p-6 rounded-2xl border border-indigo-100 shadow-xl bg-gradient-to-br from-white to-indigo-50/60 backdrop-blur-sm space-y-3"
              >
                <h2 className="text-lg font-bold">Add New Passenger</h2>
                <form className="space-y-2" onSubmit={handleAddPassenger}>
                  {Object.entries(formData).map(([key, value]) =>
                    key !== "passengerId" ? (
                      <input
                        key={key}
                        name={key}
                        value={value ?? ""}
                        onChange={handleChange}
                        placeholder={key}
                        className="w-full border rounded px-2 py-1"
                      />
                    ) : null
                  )}
                  <div className="flex gap-2 mt-2">
                    <button type="submit" className="btn-add">✅ Add Passenger</button>
                    <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
                  </div>
                </form>
              </motion.div>
            )}

            {!showForm && selectedPassenger && (
              <motion.div
                key={selectedPassenger.passengerId}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="p-6 rounded-2xl border border-indigo-100 shadow-xl bg-gradient-to-br from-white to-indigo-50/60 backdrop-blur-sm space-y-2 min-h-[220px]"
              >
                <h2 className="text-lg font-bold">{selectedPassenger.name}</h2>
                <p className="mb-2">Flight: {flight?.flightNumber} ({flight?.origin} → {flight?.destination})</p>
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
                  <button onClick={handleUpdatePassenger} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Update</button>
                  <button onClick={handleDeletePassenger} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
