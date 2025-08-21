package com.oracle.admin.entity;

public class FlightPassenger {
    private Integer flightId;
    private Integer passengerId;
    private Integer seatNumber; // Nullable
    private Character checkInStatus; // Use Character for nullable, else char
    private Character wheelChair;
    private Character infant;

    public FlightPassenger() {}

    public FlightPassenger(Integer flightId, Integer passengerId, Integer seatNumber,
                           Character checkInStatus, Character wheelChair, Character infant) {
        this.flightId = flightId;
        this.passengerId = passengerId;
        this.seatNumber = seatNumber;
        this.checkInStatus = checkInStatus;
        this.wheelChair = wheelChair;
        this.infant = infant;
    }

    public Integer getFlightId() {
        return flightId;
    }

    public void setFlightId(Integer flightId) {
        this.flightId = flightId;
    }

    public Integer getPassengerId() {
        return passengerId;
    }

    public void setPassengerId(Integer passengerId) {
        this.passengerId = passengerId;
    }

    public Integer getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(Integer seatNumber) {
        this.seatNumber = seatNumber;
    }

    public Character getCheckInStatus() {
        return checkInStatus;
    }

    public void setCheckInStatus(Character checkInStatus) {
        this.checkInStatus = checkInStatus;
    }

    public Character getWheelChair() {
        return wheelChair;
    }

    public void setWheelChair(Character wheelChair) {
        this.wheelChair = wheelChair;
    }

    public Character getInfant() {
        return infant;
    }

    public void setInfant(Character infant) {
        this.infant = infant;
    }

    @Override
    public String toString() {
        return "FlightPassenger{" +
                "flightId=" + flightId +
                ", passengerId=" + passengerId +
                ", seatNumber=" + seatNumber +
                ", checkInStatus=" + checkInStatus +
                ", wheelChair=" + wheelChair +
                ", infant=" + infant +
                '}';
    }
}
