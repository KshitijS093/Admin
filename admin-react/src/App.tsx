import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Flights from "./components/Flights";
import FlightDetails from "./components/FlightDetails";
import Passengers from "./components/Passengers";
import Ancillary from "./components/Ancillary";
import Meals from "./components/Meals";
import ShopItems from "./components/ShopItems";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Flights />} />
        <Route path="/flight/:flightId" element={<FlightDetails />} />
        <Route path="/flight/:flightId/passengers" element={<PassengersWrapper />} />
        <Route path="/flight/:flightId/ancillary" element={<AncillaryWrapper />} />
        <Route path="/flight/:flightId/meals" element={<MealsWrapper />} />
        <Route path="/flight/:flightId/shop" element={<ShopWrapper />} />
        <Route path="/passenger/:flightId/:passengerId" element={<PassengerDetailsLazy />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;

// Lightweight wrappers to extract route params and feed into existing components
import { useParams, useNavigate } from "react-router-dom";
import PassengerDetails from "./components/PassengerDetails";

function useFlightIdNumber(): number {
  const params = useParams();
  const id = Number(params.flightId);
  return Number.isFinite(id) ? id : 0;
}

function PassengersWrapper() {
  const flightId = useFlightIdNumber();
  const navigate = useNavigate();
  return <Passengers flightId={flightId} onBack={() => navigate(-1)} />;
}

function AncillaryWrapper() {
  const flightId = useFlightIdNumber();
  const navigate = useNavigate();
  return <Ancillary flightId={flightId} onBack={() => navigate(-1)} />;
}

function MealsWrapper() {
  const flightId = useFlightIdNumber();
  const navigate = useNavigate();
  return <Meals flightId={flightId} onBack={() => navigate(-1)} />;
}

function ShopWrapper() {
  const flightId = useFlightIdNumber();
  const navigate = useNavigate();
  return <ShopItems flightId={flightId} onBack={() => navigate(-1)} />;
}

function PassengerDetailsLazy() {
  return <PassengerDetails />;
}
