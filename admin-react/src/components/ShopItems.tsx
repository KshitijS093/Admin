import { useEffect, useState } from "react";

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
    setFormItem({ item_id: 0, name: "", price: 0, available_onboard: "Y" });
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

    const isAdding = formItem?.item_id === 0;

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
      <button onClick={onBack} className="mb-4 px-4 py-2 border rounded bg-gray-200 hover:bg-gray-300">
        ⬅ Back
      </button>

      <h2 className="text-xl font-semibold mb-2">Shop Items</h2>

      <div className="space-y-2">
        {items.map((item) => (
          <button
            key={item.item_id}
            className="block w-full text-left border rounded p-3 hover:bg-gray-100"
            onClick={() => setSelectedItem(item)}
          >
            🛍 {item.name} — ₹{item.price} ({item.available_onboard === "Y" ? "Available" : "Not Available"})
          </button>
        ))}
      </div>

      {/* Add New Item button */}
      {!formItem && (
        <button
          onClick={openAddForm}
          className="mt-4 px-4 py-2 border rounded bg-green-200 hover:bg-green-300"
        >
          ➕ Add New Item
        </button>
      )}

      {/* Selected item details */}
      {selectedItem && !formItem && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <h3 className="text-lg font-semibold">{selectedItem.name}</h3>
          <p><strong>Price:</strong> ₹{selectedItem.price}</p>
          <p><strong>Available Onboard:</strong> {selectedItem.available_onboard === "Y" ? "Yes" : "No"}</p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => openEditForm(selectedItem)}
              className="px-4 py-2 bg-yellow-200 rounded hover:bg-yellow-300"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(selectedItem.item_id)}
              className="px-4 py-2 bg-red-200 rounded hover:bg-red-300"
            >
              Delete
            </button>
            <button
              onClick={() => setSelectedItem(null)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit form */}
      {formItem && (
        <div className="mt-4 p-4 border rounded bg-gray-50 space-y-2">
          <h3 className="text-lg font-semibold mb-2">{formItem.item_id === 0 ? "Add New Item" : "Edit Item"}</h3>

          <div>
            <label className="block mb-1">Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block mb-1">Price:</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block mb-1">Available Onboard:</label>
            <select
              value={available}
              onChange={(e) => setAvailable(e.target.value as "Y" | "N")}
              className="w-full border rounded px-2 py-1"
            >
              <option value="Y">Yes</option>
              <option value="N">No</option>
            </select>
          </div>
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-200 rounded hover:bg-blue-300"
            >
              {formItem.item_id === 0 ? "Add Item" : "Update Item"}
            </button>
            <button
              onClick={resetForm}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
