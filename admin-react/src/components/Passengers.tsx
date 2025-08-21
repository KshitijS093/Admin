import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
      <motion.nav className="navbar" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
			<div className="navbar-left">
				<h1 className="navbar-title">Passengers</h1>
				<p className="navbar-subtitle">View and manage passengers</p>
			</div>
			<div className="navbar-right">
				<button onClick={onBack} className="btn-back">⬅️ Back</button>
			</div>
		</motion.nav>
      <div className="mt-4 flex items-center gap-2">
        <button onClick={() => setFilterMissing(!filterMissing)} className="filter-button">
          {filterMissing ? "Show All Passengers" : "Show Missing Mandatory Details"}
        </button>
      </div>

      {/* Passengers Table */}
      <motion.div className="table-card mt-4" initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}>
        <div className="table-toolbar">
          <h3 className="table-title">Existing Passengers</h3>
          <div className="table-actions">
            <button onClick={() => setShowForm(true)} className="btn-add">➕ Add Passenger</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <motion.table className="styled-table" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Name</th>
                <th>Seat</th>
                <th>Check-In</th>
                <th>Wheelchair</th>
                <th>Infant</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {displayedPassengers.map((p, idx) => (
                  <motion.tr
                    key={p.passengerId}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ delay: idx * 0.05, duration: 0.35 }}
                    className="cursor-pointer"
                    onClick={() => navigate(`/passenger/${flightId}/${p.passengerId}`)}
                  >
                    <td>{idx + 1}</td>
                    <td>{p.name}</td>
                    <td>{p.seatNumber ?? "Unassigned"}</td>
                    <td><span className={`badge ${p.checkInStatus === "Y" ? "badge-yes" : "badge-no"}`}>{p.checkInStatus === "Y" ? "Yes" : "No"}</span></td>
                    <td><span className={`badge ${p.wheelChair === "Y" ? "badge-yes" : "badge-no"}`}>{p.wheelChair === "Y" ? "Yes" : "No"}</span></td>
                    <td><span className={`badge ${p.infant === "Y" ? "badge-yes" : "badge-no"}`}>{p.infant === "Y" ? "Yes" : "No"}</span></td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </motion.table>
        </div>
      </motion.div>

      {/* Add Passenger Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="modal-container">
            <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowForm(false)} />
            <motion.form key="add-passenger-form" onSubmit={handleAddPassenger} className="modal" role="dialog" aria-modal="true" aria-labelledby="add-passenger-title" initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.98 }} transition={{ type: "spring", stiffness: 260, damping: 22 }}>
              <div className="modal-header">
                <h3 id="add-passenger-title" className="modal-title">Add Passenger</h3>
                <button type="button" aria-label="Close" className="modal-close" onClick={() => setShowForm(false)}>×</button>
              </div>
              <div className="modal-body space-y-2">
                <input type="text" name="name" placeholder="Full Name" value={newPassenger.name} onChange={handleChange} className="w-full border rounded px-2 py-1" required />
                <input type="date" name="dob" value={newPassenger.dob} onChange={handleChange} className="w-full border rounded px-2 py-1" />
                <input type="text" name="passportNumber" placeholder="Passport Number" value={newPassenger.passportNumber} onChange={handleChange} className="w-full border rounded px-2 py-1" />
                <input type="text" name="address" placeholder="Address" value={newPassenger.address} onChange={handleChange} className="w-full border rounded px-2 py-1" />
                <input type="email" name="email" placeholder="Email" value={newPassenger.email} onChange={handleChange} className="w-full border rounded px-2 py-1" />
                <input type="text" name="phone" placeholder="Phone" value={newPassenger.phone} onChange={handleChange} className="w-full border rounded px-2 py-1" />
                <input type="number" name="seatNumber" placeholder="Seat Number" value={newPassenger.seatNumber ?? ""} onChange={handleChange} className="w-full border rounded px-2 py-1" />
                <select name="checkInStatus" value={newPassenger.checkInStatus} onChange={handleChange} className="w-full border rounded px-2 py-1">
                  <option value="N">Not Checked In</option>
                  <option value="Y">Checked In</option>
                </select>
                <select name="wheelChair" value={newPassenger.wheelChair} onChange={handleChange} className="w-full border rounded px-2 py-1">
                  <option value="N">No Wheelchair</option>
                  <option value="Y">Wheelchair Needed</option>
                </select>
                <select name="infant" value={newPassenger.infant} onChange={handleChange} className="w-full border rounded px-2 py-1">
                  <option value="N">No Infant</option>
                  <option value="Y">Infant</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-add">✅ Add Passenger</button>
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
