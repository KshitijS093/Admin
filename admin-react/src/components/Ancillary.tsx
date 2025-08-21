import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Landing.css";
import "./Services.css";

type AncillaryType = {
  flightId: number;
  serviceId: number;
  name: string;
  description: string;
};

type Props = {
  flightId: number;
  onBack: () => void;
};

export default function Ancillary({ flightId, onBack }: Props) {
  const [ancillaryServices, setAncillaryServices] = useState<AncillaryType[]>([]);
  const [selectedService, setSelectedService] = useState<AncillaryType | null>(null);
  const [editing, setEditing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<AncillaryType>>({
    name: "",
    description: "",
  });

  // Fetch all services
  const fetchServices = async () => {
    try {
      const res = await fetch(`http://localhost:9092/api/admin/flights/${flightId}/ancillary`);
      const data = await res.json();
      setAncillaryServices(data);
    } catch (err) {
      console.error("Error fetching ancillary services:", err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [flightId]);

  const handleSelect = (service: AncillaryType) => {
    setSelectedService(service);
    setFormData({ ...service });
    setEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAdd = async () => {
    if (!formData.name || !formData.description) return alert("Name and description required");
    try {
      const payload = { ...formData, flightId };
      const res = await fetch(`http://localhost:9092/api/admin/flights/${flightId}/ancillary/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        alert("Ancillary Service added!");
        setFormData({ name: "", description: "" });
        setShowAddForm(false);
        fetchServices();
      } else {
        alert("Failed to add service");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async () => {
    if (!selectedService) return;
    try {
      const payload = { ...formData, serviceId: selectedService.serviceId, flightId };
      const res = await fetch(`http://localhost:9092/api/admin/flights/${flightId}/ancillary/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        alert("Ancillary Service updated!");
        setEditing(false);
        fetchServices();
      } else {
        alert("Failed to update service");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!selectedService) return;
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      const res = await fetch(
        `http://localhost:9092/api/admin/flights/${flightId}/ancillary/${selectedService.serviceId}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        alert("Ancillary Service deleted!");
        setSelectedService(null);
        fetchServices();
      } else {
        alert("Failed to delete service");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <motion.nav className="navbar" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="navbar-left">
          <h1 className="navbar-title">Ancillary</h1>
          <p className="navbar-subtitle">Manage ancillary services</p>
        </div>
        <div className="navbar-right">
          <button onClick={onBack} className="btn-back">⬅️ Back</button>
        </div>
      </motion.nav>

      {/* Table of services */}
      <motion.div
        className="table-card mt-4"
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <div className="table-toolbar">
          <h3 className="table-title">Existing Services</h3>
          <div className="table-actions">
            {!showAddForm && (
              <button onClick={() => setShowAddForm(true)} className="btn-add">➕ Add New Service</button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <motion.table className="styled-table" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Name</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {ancillaryServices.map((s, idx) => (
                  <motion.tr
                    key={s.serviceId}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ delay: idx * 0.05, duration: 0.35 }}
                    onClick={() => handleSelect(s)}
                    className="cursor-pointer"
                  >
                    <td>{idx + 1}</td>
                    <td>{s.name}</td>
                    <td className="max-w-[520px] truncate" title={s.description}>{s.description}</td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </motion.table>
        </div>
      </motion.div>

      {/* Selected service details */}
      <AnimatePresence>
      {selectedService && (
        <motion.div
          key={selectedService.serviceId}
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="border p-6 rounded-2xl mb-4 border-indigo-100 shadow-xl bg-gradient-to-br from-white to-indigo-50/60 backdrop-blur-sm space-y-3 max-w-2xl w-full mx-auto min-h-[220px]"
        >
          <h3 className="font-semibold">Service Details</h3>
          {editing ? (
            <div className="space-y-2">
              <div>
                <label className="block mb-1 font-medium">Name</label>
                <input
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  placeholder="Service Name"
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Description</label>
                <textarea
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  placeholder="Description"
                  className="w-full border p-2 rounded"
                />
              </div>
              <div className="flex gap-2">
                <button onClick={handleUpdate} className="btn-add">
                  Update
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <p><strong>ID:</strong> {selectedService.serviceId}</p>
              <p><strong>Name:</strong> {selectedService.name}</p>
              <p><strong>Description:</strong> {selectedService.description}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
      {/* Add New Service Modal */}
      <AnimatePresence>
        {showAddForm && (
          <div className="modal-container">
            <motion.div
              key="modal-backdrop"
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowAddForm(false)}
            />
            <motion.div
              key="add-service-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="add-service-title"
              className="modal"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
            >
              <div className="modal-header">
                <h3 id="add-service-title" className="modal-title">Add New Service</h3>
                <button className="modal-close" aria-label="Close" onClick={() => setShowAddForm(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="space-y-2">
                  <div>
                    <label className="block mb-1 font-medium">Name</label>
                    <input name="name" value={formData.name || ""} onChange={handleChange} placeholder="Service Name" className="w-full border rounded px-2 py-1" />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Description</label>
                    <textarea name="description" value={formData.description || ""} onChange={handleChange} placeholder="Description" className="w-full border rounded px-2 py-1" />
                  </div>
                </div>
              </div>
              <div className="modal-actions">
                <button onClick={handleAdd} className="btn-add">Add Service</button>
                <button onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </AnimatePresence>
    </div>
  );
}
