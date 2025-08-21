package com.oracle.admin.entity;

public class ShopItem {
    private int item_id;
    private String name;
    private double price;
    private String available_onboard; // 'Y' or 'N'

    // Default constructor
    public ShopItem() {
    }

    // Parameterized constructor
    public ShopItem(int item_id, String name, double price, String available_onboard) {
        this.item_id = item_id;
        this.name = name;
        this.price = price;
        this.available_onboard = available_onboard;
    }

    // Getters and Setters
    public int getItem_id() {
        return item_id;
    }

    public void setItem_id(int item_id) {
        this.item_id = item_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getAvailable_onboard() {
        return available_onboard;
    }

    public void setAvailable_onboard(String available_onboard) {
        this.available_onboard = available_onboard;
    }
}

