import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Landing.css";
import "./Services.css";

type ShopItem = {
  item_id: number;
  name: string;
  price: number;
  available_onboard: "Y" | "N";
};

export default function ShopItems({ flightId, onBack }: { flightId: number; onBack: () => void }) {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [formItem, setFormItem] = useState<ShopItem | null>(null);
  const [addingNew, setAddingNew] = useState<boolean>(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [available, setAvailable] = useState<"Y" | "N">("Y");

  const baseUrl = "http://localhost:9092/api/admin";

  const fetchItems = () => {
    fetch(`${baseUrl}/flights/${flightId}/shop`)
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error("Fetch shop items failed:", err));
  };

  useEffect(() => {
    fetchItems();
  }, [flightId]);

  const resetForm = () => {
    setFormItem(null);
    setName("");
    setPrice(0);
    setAvailable("Y");
  };

  const openAddForm = () => {
    setAddingNew(true);
    setFormItem(null);
    setSelectedItem(null);
    setName("");
    setPrice(0);
    setAvailable("Y");
  };

  const openEditForm = (item: ShopItem) => {
    setFormItem(item);
    setName(item.name);
    setPrice(item.price);
    setAvailable(item.available_onboard);
  };

  const handleSubmit = () => {
    if (!name.trim() || price <= 0) {
      alert("Please fill all fields correctly");
      return;
    }

    const isAdding = addingNew;

    const url = isAdding
      ? `${baseUrl}/flights/${flightId}/shop/add`
      : `${baseUrl}/flights/${flightId}/shop/update`;

    const method: "POST" | "PUT" = isAdding ? "POST" : "PUT";

    const payload = isAdding
      ? { name, price, available_onboard: available }
      : { item_id: formItem?.item_id, name, price, available_onboard: available };

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.text())
      .then(() => {
        fetchItems();
        resetForm();
        setSelectedItem(null);
        setAddingNew(false);
      })
      .catch((err) => console.error("Add/Update failed:", err));
  };

  const handleDelete = (item_id: number) => {
    if (!confirm("Are you sure?")) return;

    fetch(`${baseUrl}/flights/${flightId}/shop/${item_id}`, { method: "DELETE" })
      .then((res) => res.text())
      .then(() => {
        fetchItems();
        setSelectedItem(null);
        resetForm();
      })
      .catch((err) => console.error("Delete failed:", err));
  };

  return (
    <div className="p-4">
      <motion.nav className="navbar" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="navbar-left">
          <h1 className="navbar-title">Shop</h1>
          <p className="navbar-subtitle">Manage onboard shop items</p>
        </div>
        <div className="navbar-right">
          <button onClick={onBack} className="btn-back">⬅️ Back</button>
        </div>
      </motion.nav>

      {/* Items Table */}
      <motion.div className="table-card mt-4" initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}>
        <div className="table-toolbar">
          <h3 className="table-title">Existing Items</h3>
          <div className="table-actions">
            <button onClick={openAddForm} className="btn-add">➕ Add New Item</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <motion.table className="styled-table" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Name</th>
                <th>Price</th>
                <th>Available</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {items.map((item, idx) => (
                  <motion.tr
                    key={item.item_id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ delay: idx * 0.05, duration: 0.35 }}
                    className="cursor-pointer"
                    onClick={() => setSelectedItem(item)}
                  >
                    <td>{idx + 1}</td>
                    <td>{item.name}</td>
                    <td>₹{item.price}</td>
                    <td><span className={`badge ${item.available_onboard === "Y" ? "badge-yes" : "badge-no"}`}>{item.available_onboard === "Y" ? "Yes" : "No"}</span></td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </motion.table>
        </div>
      </motion.div>

      {/* Selected item details */}
      <AnimatePresence>
      {selectedItem && !formItem && (
        <motion.div
          key={selectedItem.item_id}
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="mt-4 p-6 rounded-2xl border border-indigo-100 shadow-xl bg-gradient-to-br from-white to-indigo-50/60 backdrop-blur-sm max-w-2xl w-full mx-auto min-h-[220px]"
        >
          <h3 className="text-lg font-semibold">{selectedItem.name}</h3>
          <p><strong>Price:</strong> ₹{selectedItem.price}</p>
          <p><strong>Available Onboard:</strong> <span className={`badge ${selectedItem.available_onboard === "Y" ? "badge-yes" : "badge-no"}`}>{selectedItem.available_onboard === "Y" ? "Yes" : "No"}</span></p>
          <div className="flex gap-2 mt-2">
            <button onClick={() => openEditForm(selectedItem)} className="px-4 py-2 bg-yellow-200 rounded hover:bg-yellow-300">Edit</button>
            <button onClick={() => handleDelete(selectedItem.item_id)} className="px-4 py-2 bg-red-200 rounded hover:bg-red-300">Delete</button>
            <button onClick={() => setSelectedItem(null)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Close</button>
          </div>
        </motion.div>
      )}

      {/* Edit form */}
      {formItem && (
        <motion.div
          key={`edit-form-${formItem.item_id}`}
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="mt-4 p-6 rounded-2xl border border-indigo-100 shadow-xl bg-gradient-to-br from-white to-indigo-50/60 backdrop-blur-sm max-w-2xl w-full mx-auto space-y-2"
        >
          <h3 className="text-lg font-semibold mb-2">Edit Item</h3>
          <div>
            <label className="block mb-1">Name:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block mb-1">Price:</label>
            <input type="number" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block mb-1">Available Onboard:</label>
            <select value={available} onChange={(e) => setAvailable(e.target.value as "Y" | "N")} className="w-full border rounded px-2 py-1">
              <option value="Y">Yes</option>
              <option value="N">No</option>
            </select>
          </div>
          <div className="flex gap-2 mt-2">
            <button onClick={handleSubmit} className="btn-add">Update Item</button>
            <button onClick={resetForm} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
          </div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Add New Item Modal */}
      <AnimatePresence>
        {addingNew && (
          <div className="modal-container">
            <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAddingNew(false)} />
            <motion.div key="add-item-modal" role="dialog" aria-modal="true" aria-labelledby="add-item-title" className="modal" initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.98 }} transition={{ type: "spring", stiffness: 260, damping: 22 }}>
              <div className="modal-header">
                <h3 id="add-item-title" className="modal-title">Add New Item</h3>
                <button className="modal-close" aria-label="Close" onClick={() => setAddingNew(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1">Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded px-2 py-1" />
                  </div>
                  <div>
                    <label className="block mb-1">Price</label>
                    <input type="number" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} className="w-full border rounded px-2 py-1" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-1">Available Onboard</label>
                    <select value={available} onChange={(e) => setAvailable(e.target.value as "Y" | "N")} className="w-full border rounded px-2 py-1">
                      <option value="Y">Yes</option>
                      <option value="N">No</option>
                    </select>
                    <div className="mt-1"><span className={`badge ${available === "Y" ? "badge-yes" : "badge-no"}`}>{available === "Y" ? "Yes" : "No"}</span></div>
                  </div>
                </div>
              </div>
              <div className="modal-actions">
                <button onClick={handleSubmit} className="btn-add">Add Item</button>
                <button onClick={() => setAddingNew(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
