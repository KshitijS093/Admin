package com.oracle.admin.returners;

import java.util.Date;

public class FlightAndPassenger {

    // From passenger table
    private int passengerId;
    private String name;
    private Date dob;
    private String passportNumber;
    private String address;
    private String email;
    private String phone;

    // From flight_passenger table
    private int flightId;
    private Integer seatNumber;
    private String checkInStatus; // 'Y' or 'N'
    private String wheelChair;    // 'Y' or 'N'
    private String infant;        // 'Y' or 'N'
    

    public FlightAndPassenger() {
	}

	public FlightAndPassenger(int passengerId, String name, Date dob, String passportNumber, String address, String email,
			String phone, int flightId, Integer seatNumber, String checkInStatus, String wheelChair, String infant) {
		this.passengerId = passengerId;
		this.name = name;
		this.dob = dob;
		this.passportNumber = passportNumber;
		this.address = address;
		this.email = email;
		this.phone = phone;
		this.flightId = flightId;
		this.seatNumber = seatNumber;
		this.checkInStatus = checkInStatus;
		this.wheelChair = wheelChair;
		this.infant = infant;
	}

	// Getters and Setters
    public int getPassengerId() {
        return passengerId;
    }

    public void setPassengerId(int passengerId) {
        this.passengerId = passengerId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Date getDob() {
        return dob;
    }

    public void setDob(Date dob) {
        this.dob = dob;
    }

    public String getPassportNumber() {
        return passportNumber;
    }

    public void setPassportNumber(String passportNumber) {
        this.passportNumber = passportNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public int getFlightId() {
        return flightId;
    }

    public void setFlightId(int flightId) {
        this.flightId = flightId;
    }

    public Integer getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(Integer seatNumber) {
        this.seatNumber = seatNumber;
    }

    public String getCheckInStatus() {
        return checkInStatus;
    }

    public void setCheckInStatus(String checkInStatus) {
        this.checkInStatus = checkInStatus;
    }

    public String getWheelChair() {
        return wheelChair;
    }

    public void setWheelChair(String wheelChair) {
        this.wheelChair = wheelChair;
    }

    public String getInfant() {
        return infant;
    }

    public void setInfant(String infant) {
        this.infant = infant;
    }
}
