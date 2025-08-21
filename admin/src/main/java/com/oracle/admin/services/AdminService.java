package com.oracle.admin.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.oracle.admin.entity.AncillaryService;
import com.oracle.admin.entity.Flight;
import com.oracle.admin.entity.Meal;
import com.oracle.admin.entity.Passenger;
import com.oracle.admin.entity.ShopItem;
import com.oracle.admin.inter.Methods;
import com.oracle.admin.returners.FlightAndPassenger;
import com.oracle.admin.returners.SeatInfo;

@Service
public class AdminService {

    @Autowired
    private Methods method;

    // ================= Flights =================
    public List<Flight> getAll() {
        return method.getAll();
    }

    public Flight getFlightById(Integer flightId) throws Exception {
        return method.getFlightById(flightId);
    }

    // ================= Passengers =================
    public List<FlightAndPassenger> getPassengers(Integer flightId) throws Exception {
        return method.getPassengers(flightId);
    }

    public List<Passenger> getInvalidPassengers() {
        return method.getInvalidPassengers();
    }

    public Passenger getPassengerById(Integer flightId, Integer passengerId) {
        return method.getPassengerById(flightId, passengerId);
    }

    public int addPassenger(FlightAndPassenger passenger) {
        return method.addPassenger(passenger);
    }

    public int updatePassenger(FlightAndPassenger passenger) {
        return method.updatePassenger(passenger);
    }

    public int deletePassenger(Integer passengerId , Integer flightId) {
        return method.deletePassenger(passengerId , flightId);
    }

    // ================= Meals =================
    public List<Meal> getAllMeals() {
        return method.getAllMeals();
    }

    public int addMeal(Meal meal) {
        return method.addMeal(meal);
    }

    public int updateMeal(Meal meal) {
        return method.updateMeal(meal);
    }

    public int deleteMeal(Integer mealId) {
        return method.deleteMeal(mealId);
    }

    // ================= Ancillary Services =================
    public List<AncillaryService> getAllAncillaryServices(int flight_id) {
        return method.getAllAncillaryServices(flight_id);
    }

    public int addAncillaryService(AncillaryService service) {
        return method.addAncillaryService(service);
    }

    public int updateAncillaryService(AncillaryService service) {
        return method.updateAncillaryService(service);
    }

    public int deleteAncillaryService(Integer flightId, Integer serviceId) {
        return method.deleteAncillaryService(flightId, serviceId);
    }

    // ================= Shop Items =================
    public List<ShopItem> getAllShopItems() {
        return method.getAllShopItems();
    }

    public int addShopItem(ShopItem item) {
        return method.addShopItem(item);
    }

    public int updateShopItem(ShopItem item) {
        return method.updateShopItem(item);
    }

    public int deleteShopItem(int itemId) {
        return method.deleteShopItem(itemId);
    }
}
