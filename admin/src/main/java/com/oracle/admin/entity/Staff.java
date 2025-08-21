package com.oracle.admin.entity;

public class Staff {
    private int staff_id;
    private String name;
    private String role;
    private String email;
    private String password;
    private int flight_id;

    // Default constructor
    public Staff() {
    }

    public Staff(int staff_id, String name, String role, String email, String password, int flight_id) {
        this.staff_id = staff_id;
        this.name = name;
        this.role = role;
        this.email = email;
        this.password = password;
        this.flight_id = flight_id;
    }

    public int getStaff_id() {
        return staff_id;
    }

    public void setStaff_id(int staff_id) {
        this.staff_id = staff_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public int getFlight_id() {
        return flight_id;
    }

    public void setFlight_id(int flight_id) {
        this.flight_id = flight_id;
    }
}

