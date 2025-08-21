package com.oracle.admin.returners;

public class SeatInfo {
    private Integer seatNumber;
    private String Name;
    private Integer passenger_id;
    public Integer getPassenger_id() {
		return passenger_id;
	}
	public void setPassenger_id(Integer passenger_id) {
		this.passenger_id = passenger_id;
	}
	public String getName() {
        return Name;
    }
    public Integer getSeatNumber() {
        return seatNumber;
    }
    public void setName(String name) {
        Name = name;
    }
    public void setSeatNumber(Integer seatNumber) {
        this.seatNumber = seatNumber;
    }
}
