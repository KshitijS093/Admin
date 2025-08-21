package com.oracle.admin.entity;

public class AncillaryService {
    private Integer flightId;
    private Integer serviceId;
    private String name;
    private String description;

    public AncillaryService() {}

    public AncillaryService(Integer flightId, Integer serviceId, String name, String description) {
        this.flightId = flightId;
        this.serviceId = serviceId;
        this.name = name;
        this.description = description;
    }

    public Integer getFlightId() {
        return flightId;
    }

    public void setFlightId(Integer flightId) {
        this.flightId = flightId;
    }

    public Integer getServiceId() {
        return serviceId;
    }

    public void setServiceId(Integer serviceId) {
        this.serviceId = serviceId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "AncillaryService{" +
                "flightId=" + flightId +
                ", serviceId=" + serviceId +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}
