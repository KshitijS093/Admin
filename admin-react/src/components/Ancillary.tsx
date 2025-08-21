import { useEffect, useState } from "react";

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
    <div className="p-4 max-w-xl mx-auto">
      <button
        onClick={onBack}
        className="mb-4 px-4 py-2 border rounded-lg bg-gray-200 hover:bg-gray-300"
      >
        ⬅️ Back to Flight Options
      </button>

      <h2 className="text-xl font-semibold mb-2">Ancillary Services</h2>

      {/* List of services */}
      <div className="space-y-2 mb-4">
        {ancillaryServices.length === 0 ? (
          <p>No ancillary services found.</p>
        ) : (
          ancillaryServices.map((s) => (
            <button
              key={s.serviceId}
              onClick={() => handleSelect(s)}
              className={`block w-full text-left border rounded-lg p-2 hover:bg-gray-100 ${
                selectedService?.serviceId === s.serviceId ? "bg-gray-200" : "bg-white"
              }`}
            >
              🛄 {s.name} (ID: {s.serviceId})
            </button>
          ))
        )}
      </div>

      {/* Selected service details */}
      {selectedService && (
        <div className="border p-4 rounded-lg mb-4 bg-gray-50 space-y-3">
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
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
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
        </div>
      )}

      {/* Add New Service Button */}
      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mb-4"
        >
          ➕ Add New Service
        </button>
      )}

      {/* Add New Service Form */}
      {showAddForm && (
        <div className="border p-4 rounded-lg bg-gray-50 space-y-3">
          <h3 className="font-semibold">Add New Service</h3>
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
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Add Service
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
