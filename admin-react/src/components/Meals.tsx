import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
      <button
        onClick={onBack}
        className="mb-4 px-4 py-2 border rounded bg-gray-200 hover:bg-gray-300"
      >
        ⬅️ Back
      </button>

      <h2 className="text-xl font-semibold mb-2">Meals</h2>

      {!addingNew && (
        <button
          onClick={() => { resetForm(); setAddingNew(true); }}
          className="mb-4 px-4 py-2 border rounded bg-green-200 hover:bg-green-300"
        >
          ➕ Add New Meal
        </button>
      )}

      {addingNew && (
        <div className="mb-4 p-4 border rounded bg-gray-50 space-y-2">
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
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-200 rounded hover:bg-blue-300"
            >
              Add Meal
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

      <div className="space-y-2">
        <AnimatePresence>
          {meals.map((meal, idx) => (
            <motion.button
              key={meal.mealId}
              className="block w-full text-left border rounded p-3 hover:bg-gray-100"
              onClick={() => setSelectedMeal(selectedMeal === meal ? null : meal)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
            >
              {meal.name} — <em>{meal.type}</em>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {selectedMeal && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
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
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-200 rounded hover:bg-blue-300"
                >
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
        </div>
      )}
    </div>
  );
}
