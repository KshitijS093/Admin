package com.oracle.admin.entity;

public class FlightPassengerAncillary {
    private Integer flightId;
    private Integer passengerId;
    private Integer serviceId;

    public FlightPassengerAncillary() {}

    public FlightPassengerAncillary(Integer flightId, Integer passengerId, Integer serviceId) {
        this.flightId = flightId;
        this.passengerId = passengerId;
        this.serviceId = serviceId;
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

    public Integer getServiceId() {
        return serviceId;
    }

    public void setServiceId(Integer serviceId) {
        this.serviceId = serviceId;
    }

    @Override
    public String toString() {
        return "FlightPassengerAncillary{" +
                "flightId=" + flightId +
                ", passengerId=" + passengerId +
                ", serviceId=" + serviceId +
                '}';
    }
}
