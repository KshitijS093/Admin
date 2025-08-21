package com.oracle.admin.entity;


public class FlightPassengerMeal {
    private int flight_id;
    private int passenger_id;
    private int meal_id;

    // Default constructor
    public FlightPassengerMeal() {
    }

    // Parameterized constructor
    public FlightPassengerMeal(int flight_id, int passenger_id, int meal_id) {
        this.flight_id = flight_id;
        this.passenger_id = passenger_id;
        this.meal_id = meal_id;
    }

    // Getters and Setters
    public int getFlight_id() {
        return flight_id;
    }

    public void setFlight_id(int flight_id) {
        this.flight_id = flight_id;
    }

    public int getPassenger_id() {
        return passenger_id;
    }

    public void setPassenger_id(int passenger_id) {
        this.passenger_id = passenger_id;
    }

    public int getMeal_id() {
        return meal_id;
    }

    public void setMeal_id(int meal_id) {
        this.meal_id = meal_id;
    }
}
