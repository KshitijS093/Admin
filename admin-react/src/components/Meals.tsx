import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Landing.css";
import "./Services.css";

type MealType = {
  mealId: number;
  name: string;
  type: string;
  description: string;
};

type Props = {
  flightId: number;
  onBack: () => void;
};

export default function Meals({ flightId, onBack }: Props) {
  const [meals, setMeals] = useState<MealType[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<MealType | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [editingMeal, setEditingMeal] = useState<MealType | null>(null);

  const [name, setName] = useState("");
  const [type, setType] = useState("Veg");
  const [description, setDescription] = useState("");

  const baseUrl = "http://localhost:9092/api/admin";

  const fetchMeals = () => {
    fetch(`${baseUrl}/flights/${flightId}/meals`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch meals");
        return res.json();
      })
      .then((data) => setMeals(data))
      .catch((err) => console.error("Fetch meals failed:", err));
  };

  useEffect(() => {
    fetchMeals();
  }, [flightId]);

  const resetForm = () => {
    setName("");
    setType("Veg");
    setDescription("");
    setEditingMeal(null);
    setAddingNew(false);
  };

  const handleSubmit = () => {
  if (!name.trim() || !description.trim()) {
    alert("Please fill all fields");
    return;
  }

  const payload = editingMeal
    ? { mealId: editingMeal.mealId, name, type, description } // include mealId when updating
    : { name, type, description }; // add new meal

  const url = editingMeal
    ? `${baseUrl}/flights/${flightId}/meals/update/`
    : `${baseUrl}/flights/${flightId}/meals/add`;
  const method: "POST" | "PUT" = editingMeal ? "PUT" : "POST";

  fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then((res) => res.text())
    .then(() => {
      fetchMeals();
      resetForm();
      if (editingMeal) setSelectedMeal(null);
    })
    .catch((err) => console.error("Add/Update failed:", err));
};


  const handleEdit = (meal: MealType) => {
    setEditingMeal(meal);
    setName(meal.name);
    setType(meal.type);
    setDescription(meal.description);
    setSelectedMeal(meal);
    setAddingNew(false);
  };

  const handleDelete = (mealId: number) => {
    if (!confirm("Are you sure?")) return;

    fetch(`${baseUrl}/flights/${flightId}/meals/${mealId}`, { method: "DELETE" })
      .then((res) => res.text())
      .then(() => {
        fetchMeals();
        setSelectedMeal(null);
      })
      .catch((err) => console.error("Delete failed:", err));
  };

  return (
    <div className="p-4">
      <motion.nav className="navbar" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
			<div className="navbar-left">
				<h1 className="navbar-title">Meals</h1>
				<p className="navbar-subtitle">Manage meals for this flight</p>
			</div>
			<div className="navbar-right">
				<button onClick={onBack} className="btn-back">⬅️ Back</button>
			</div>
		</motion.nav>

      {/* Existing Meals Table Card */}
      <motion.div
        className="table-card mt-4"
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <div className="table-toolbar">
          <h3 className="table-title">Existing Meals</h3>
          <div className="table-actions">
            {!addingNew && (
              <button
                onClick={() => { resetForm(); setAddingNew(true); }}
                className="btn-add"
              >
                ➕ Add New Meal
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <motion.table
            className="styled-table"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Name</th>
                <th>Type</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {meals.map((meal, idx) => (
                  <motion.tr
                    key={meal.mealId}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ delay: idx * 0.05, duration: 0.35 }}
                    onClick={() => setSelectedMeal(selectedMeal === meal ? null : meal)}
                    className="cursor-pointer"
                  >
                    <td>{idx + 1}</td>
                    <td>{meal.name}</td>
                    <td>
                      <span className={`badge ${meal.type === "Veg" ? "badge-veg" : meal.type === "Non-Veg" ? "badge-nonveg" : "badge-special"}`}>{meal.type}</span>
                    </td>
                    <td className="max-w-[420px] truncate" title={meal.description}>{meal.description}</td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </motion.table>
        </div>
      </motion.div>

      {/* Add New Meal Modal */}
      <AnimatePresence>
        {addingNew && (
          <div className="modal-container">
            <motion.div
              key="modal-backdrop"
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={resetForm}
            />
            <motion.div
              key="modal-content"
              role="dialog"
              aria-modal="true"
              aria-labelledby="add-meal-title"
              className={`modal ${type === "Veg" ? "modal-veg" : type === "Non-Veg" ? "modal-nonveg" : "modal-special"}`}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
            >
              <div className="modal-header">
                <h3 id="add-meal-title" className="modal-title">Add New Meal</h3>
                <button aria-label="Close" className="modal-close" onClick={resetForm}>×</button>
              </div>
              <div className="modal-body">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block mb-1 font-medium">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full border rounded px-2 py-1"
                    >
                      <option value="Veg">Veg</option>
                      <option value="Non-Veg">Non-Veg</option>
                      <option value="Special">Special</option>
                    </select>
                    <div className="mt-1">
                      <span className={`badge ${type === "Veg" ? "badge-veg" : type === "Non-Veg" ? "badge-nonveg" : "badge-special"}`}>{type}</span>
                    </div>
                  </div>
                  <div className="md:col-span-3">
                    <label className="block mb-1 font-medium">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full border rounded px-2 py-1 min-h-[90px]"
                    />
                  </div>
                </div>
              </div>
              <div className="modal-actions">
                <button onClick={handleSubmit} className="btn-add">Save Meal</button>
                <button onClick={resetForm} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {selectedMeal && (
        <AnimatePresence>
          <motion.div
            key={selectedMeal.mealId}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="mt-4 p-6 rounded-2xl border border-indigo-100 shadow-xl bg-gradient-to-br from-white to-indigo-50/60 backdrop-blur-sm max-w-2xl w-full mx-auto min-h-[220px]"
          >
            {editingMeal === selectedMeal ? (
              <div className="space-y-2">
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
                  <label className="block mb-1">Type:</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="Veg">Veg</option>
                    <option value="Non-Veg">Non-Veg</option>
                    <option value="Special">Special</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Description:</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  <button onClick={handleSubmit} className="btn-add">
                    Update Meal
                  </button>
                  <button
                    onClick={() => setEditingMeal(null)}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-semibold">{selectedMeal.name}</h3>
                <p>
                  <strong>Type:</strong> {selectedMeal.type}
                </p>
                <p>
                  <strong>Description:</strong> {selectedMeal.description}
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleEdit(selectedMeal)}
                    className="px-4 py-2 bg-yellow-200 rounded hover:bg-yellow-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(selectedMeal.mealId)}
                    className="px-4 py-2 bg-red-200 rounded hover:bg-red-300"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setSelectedMeal(null)}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
