package com.oracle.admin.inter;

import java.util.List;

import com.oracle.admin.entity.AncillaryService;
import com.oracle.admin.entity.Flight;
import com.oracle.admin.entity.Meal;
import com.oracle.admin.entity.Passenger;
import com.oracle.admin.entity.ShopItem;
import com.oracle.admin.returners.FlightAndPassenger;
import com.oracle.admin.returners.SeatInfo;


public interface Methods {
public Flight getFlightById(Integer flightId) throws Exception ;
public List<Flight>getAll();
public List<FlightAndPassenger> getPassengers(Integer flightId);
public Passenger getPassengerById(Integer flightId, Integer passengerId);
public List<ShopItem> getAllShopItems();
public int deleteShopItem(int itemId);
public int updateShopItem(ShopItem item);
public int addShopItem(ShopItem item);
public List<AncillaryService> getAllAncillaryServices( int flight_id);
public int deleteAncillaryService(Integer flightId, Integer serviceId);
public int updateAncillaryService(AncillaryService service);
public int addAncillaryService(AncillaryService service);
public List<Meal> getAllMeals();
public int deleteMeal(Integer mealId);
public int updateMeal(Meal meal);
public int addMeal(Meal meal);
public List<Passenger> getInvalidPassengers();
public int deletePassenger(Integer passengerId, Integer flightId);
public int updatePassenger(FlightAndPassenger passenger);
public int addPassenger(FlightAndPassenger dto);
 } 