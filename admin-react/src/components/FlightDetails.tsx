import { useState } from "react";
import Passengers from "./ManagePassengers";
import Ancillary from "./Ancillary";
import Meals from "./Meals";
import ShopItems from "./ShopItems";

type Flight = {
  flightId: number;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  origin: string;
  destination: string;
  aircraftId: number;
};

type Props = {
  flight: Flight;
  onBack: () => void;
};

export default function FlightDetails({ flight, onBack }: Props) {
  const [activeTab, setActiveTab] = useState<string>("");

  return (
    <div className="container py-5">
      {/* Back Button */}
      <div className="mb-4">
        <button onClick={onBack} className="btn btn-outline-secondary">
          ⬅️ Back to Flights
        </button>
      </div>

      {/* Flight Heading */}
      <h2 className="text-center text-primary mb-3">✈️ Flight {flight.flightNumber}</h2>

      {/* Flight Info Card */}
      <div className="card mb-5 shadow-sm">
        <div className="card-body">
          <p><strong>🗺️ Route:</strong> {flight.origin} → {flight.destination}</p>
          <p><strong>🕒 Departure:</strong> {new Date(flight.departureTime).toLocaleString()}</p>
          <p><strong>🕓 Arrival:</strong> {new Date(flight.arrivalTime).toLocaleString()}</p>
        </div>
      </div>

      {/* Square Button Grid */}
      {activeTab === "" && (
        <div className="row g-4 justify-content-center">
          <div className="col-6 col-md-3 d-grid">
            <button
              className="btn btn-info btn-lg"
              onClick={() => setActiveTab("passengers")}
            >
              👥 Passengers
            </button>
          </div>
          <div className="col-6 col-md-3 d-grid">
            <button
              className="btn btn-warning btn-lg"
              onClick={() => setActiveTab("ancillary")}
            >
              🛄 Ancillary
            </button>
          </div>
          <div className="col-6 col-md-3 d-grid">
            <button
              className="btn btn-success btn-lg"
              onClick={() => setActiveTab("meals")}
            >
              🍴 Meals
            </button>
          </div>
          <div className="col-6 col-md-3 d-grid">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => setActiveTab("shop")}
            >
              🛍️ Shop
            </button>
          </div>
        </div>
      )}

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === "passengers" && (
          <Passengers flightId={flight.flightId} onBack={() => setActiveTab("")} />
        )}
        {activeTab === "ancillary" && (
          <Ancillary flightId={flight.flightId} onBack={() => setActiveTab("")} />
        )}
        {activeTab === "meals" && (
          <Meals flightId={flight.flightId} onBack={() => setActiveTab("")} />
        )}
        {activeTab === "shop" && (
          <ShopItems flightId={flight.flightId} onBack={() => setActiveTab("")} />
        )}
      </div>
    </div>
  );
}
