package com.oracle.admin.entity;

public class FlightPassengerShopOrders {
    private  Integer flightId;
    private  Integer passengerId;
    private  Integer itemId;
    private  Integer quantity;

  public Integer getFlightId() {
      return flightId;
  }
  public Integer getItemId() {
      return itemId;
  }
  public Integer getPassengerId() {
      return passengerId;
  }
  public Integer getQuantity() {
      return quantity;
  }
  public void setFlightId(Integer flightId) {
      this.flightId = flightId;
  }
  public void setItemId(Integer itemId) {
      this.itemId = itemId;
  }
  public void setPassengerId(Integer passengerId) {
      this.passengerId = passengerId;
  }
  public void setQuantity(Integer quantity) {
      this.quantity = quantity;
  }
  
}

