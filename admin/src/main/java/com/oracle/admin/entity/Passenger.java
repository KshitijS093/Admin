package com.oracle.admin.entity;

import java.sql.Date;

public class Passenger {
    private Integer passengerId;
    private String name;
    private Date dob;
    private String passportNumber;
    private String address;
    private String email;
    private String phone;

    public Passenger() {}

    public Passenger(Integer passengerId, String name, Date dob, String passportNumber,
                     String address, String email, String phone) {
        this.passengerId = passengerId;
        this.name = name;
        this.dob = dob;
        this.passportNumber = passportNumber;
        this.address = address;
        this.email = email;
        this.phone = phone;
    }

    public Integer getPassengerId() {
        return passengerId;
    }

    public void setPassengerId(Integer passengerId) {
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

    @Override
    public String toString() {
        return "Passenger{" +
                "passengerId=" + passengerId +
                ", name='" + name + '\'' +
                ", dob=" + dob +
                ", passportNumber='" + passportNumber + '\'' +
                ", address='" + address + '\'' +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                '}';
    }
}
