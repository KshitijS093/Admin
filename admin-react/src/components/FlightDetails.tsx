import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, easeOut } from "framer-motion";
import "./Landing.css";

type Flight = {
  flightId: number;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime?: string;
  arrivalTime?: string;
  aircraftId?: number;
};

export default function FlightDetails() {
  const { flightId } = useParams();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!flightId) return;
    setLoading(true);
    fetch(`http://localhost:9092/api/admin/flights/${flightId}`)
      .then((res) => res.json())
      .then((data) => setFlight(data))
      .finally(() => setLoading(false));
  }, [flightId]);

  const containerVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { duration: 0.8, staggerChildren: 0.2 },
      },
    }),
    []
  );

  const itemVariants = useMemo(
    () => ({
      hidden: { y: 30, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.6, ease: easeOut },
      },
    }),
    []
  );

  const buttonVariants = useMemo(
    () => ({
      hidden: { scale: 0.8, opacity: 0 },
      visible: { scale: 1, opacity: 1, transition: { duration: 0.5, ease: easeOut } },
      hover: { scale: 1.05, transition: { duration: 0.2 } },
      tap: { scale: 0.95, transition: { duration: 0.1 } },
    }),
    []
  );

  const formatFromISO = (iso?: string) => {
    if (!iso) return { date: "N/A", time: "N/A" };
    const d = new Date(iso);
    if (isNaN(d.getTime())) return { date: "N/A", time: "N/A" };
    return {
      date: d.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }),
      time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }),
    };
  };

  const dep = flight ? formatFromISO(flight.departureTime) : { date: "Loading...", time: "Loading..." };
  const arr = flight ? formatFromISO(flight.arrivalTime) : { date: "Loading...", time: "Loading..." };

  return (
    <motion.div className="landing-page" variants={containerVariants} initial="hidden" animate="visible">
      <motion.nav className="navbar" variants={itemVariants} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="navbar-left">
          <h1 className="navbar-title">Admin Services</h1>
          <p className="navbar-subtitle">Manage meals, shop, ancillary and passengers.</p>
        </div>
      </motion.nav>

      <motion.div className="illustration-section" variants={itemVariants}>
        <motion.div className="flight-details-card" variants={itemVariants} whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
          <h3 className="flight-number">{loading ? "Loading Flight..." : flight ? `Flight ${flight.flightNumber}` : "Flight Not Found"}</h3>
          <div className="flight-route">{loading ? "Loading route..." : flight ? `${flight.origin} → ${flight.destination}` : "-"}</div>
          <div className="flight-info">
            <div className="departure-info">
              <div className="departure-label" style={{ fontWeight: 'bold' }}>Departure Time</div>
              <div className="date">{dep.date}</div>
              <div className="time">{dep.time}</div>
            </div>
            <div className="aircraft-info">
              <div className="aircraft-label" style={{ fontWeight: 'bold' }}>Aircraft</div>
              <div className="aircraft-id">{flight?.aircraftId ? `ID ${flight.aircraftId}` : "N/A"}</div>
            </div>
            <div className="arrival-info">
              <div className="arrival-label" style={{ fontWeight: 'bold' }}>Arrival Time</div>
              <div className="date">{arr.date}</div>
              <div className="time">{arr.time}</div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {!loading && flight && (
        <motion.div className="service-buttons" variants={itemVariants}>
          <Link to={`/flight/${flight.flightId}/meals`} className="service-link">
            <motion.div className="service-button meal-button" variants={buttonVariants} whileHover="hover" whileTap="tap">
              <div className="service-icon">
                <svg viewBox="0 0 24 24" fill="white" width="32" height="32">
                  <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/>
                </svg>
              </div>
              <span className="service-text">Meal</span>
            </motion.div>
          </Link>

          <Link to={`/flight/${flight.flightId}/shop`} className="service-link">
            <motion.div className="service-button shop-button" variants={buttonVariants} whileHover="hover" whileTap="tap">
              <div className="service-icon">
                <svg viewBox="0 0 24 24" fill="white" width="32" height="32">
                  <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
              </div>
              <span className="service-text">Shop</span>
            </motion.div>
          </Link>

          <Link to={`/flight/${flight.flightId}/ancillary`} className="service-link">
            <motion.div className="service-button ancillary-button" variants={buttonVariants} whileHover="hover" whileTap="tap">
              <div className="service-icon">
                <svg viewBox="0 0 24 24" fill="white" width="32" height="32">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
              </div>
              <span className="service-text">Ancillary</span>
            </motion.div>
          </Link>

          <Link to={`/flight/${flight.flightId}/passengers`} className="service-link">
            <motion.div className="service-button passengers-button" variants={buttonVariants} whileHover="hover" whileTap="tap">
              <div className="service-icon">
                <svg viewBox="0 0 24 24" fill="white" width="32" height="32">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zM8 11c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                </svg>
              </div>
              <span className="service-text">Passengers</span>
            </motion.div>
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
}
