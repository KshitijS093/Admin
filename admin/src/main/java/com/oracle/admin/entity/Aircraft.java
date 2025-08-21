package com.oracle.admin.entity;

public class Aircraft {
    private Integer aircraftId;    // Use Integer, IDs often nullable before DB persistence
    private String model;
    private Integer totalSeats;

    public Aircraft() {}

    public Aircraft(Integer aircraftId, String model, Integer totalSeats) {
        this.aircraftId = aircraftId;
        this.model = model;
        this.totalSeats = totalSeats;
    }

    public Integer getAircraftId() {
        return aircraftId;
    }

    public void setAircraftId(Integer aircraftId) {
        this.aircraftId = aircraftId;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public Integer getTotalSeats() {
        return totalSeats;
    }

    public void setTotalSeats(Integer totalSeats) {
        this.totalSeats = totalSeats;
    }

    @Override
    public String toString() {
        return "Aircraft{" +
                "aircraftId=" + aircraftId +
                ", model='" + model + '\'' +
                ", totalSeats=" + totalSeats +
                '}';
    }
}
