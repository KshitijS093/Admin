package com.oracle.admin.controllers;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.oracle.admin.entity.AncillaryService;
import com.oracle.admin.entity.Flight;
import com.oracle.admin.entity.Meal;
import com.oracle.admin.entity.Passenger;
import com.oracle.admin.entity.ShopItem;
import com.oracle.admin.returners.FlightAndPassenger;
import com.oracle.admin.returners.SeatInfo;
import com.oracle.admin.services.AdminService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService service;

    // ================= Flights =================
    @GetMapping("/flights")
    public ResponseEntity<?> getAll() {
        try {
            System.out.println("inside all api call");
            List<Flight> flights=new ArrayList<Flight>();
            flights=service.getAll();
            for(Flight f : flights)
            {
                System.out.println(f.getFlightNumber());
            }
            return (ResponseEntity<?>) ResponseEntity.ok(flights);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to fetch flight details");
        }
    }

    @GetMapping("/flights/{id}")
    public ResponseEntity<?> getFlightById(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(service.getFlightById(id));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Flight not found with ID: " + id);
        }
    }

    // ================= Passengers =================
    @GetMapping("/flights/{flightId}/passengers")
    public ResponseEntity<?> getPassengers(@PathVariable Integer flightId) {
        try {
            List<FlightAndPassenger> passengers = service.getPassengers(flightId);
            return ResponseEntity.ok(passengers);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to fetch passengers");
        }
    }


    @GetMapping("/passengers/invalid")
    public ResponseEntity<?> getInvalidPassengers() {
        try {
            return ResponseEntity.ok(service.getInvalidPassengers());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to fetch invalid passengers");
        }
    }

    @GetMapping("/flights/{flightId}/passengers/{passengerId}")
    public ResponseEntity<?> getPassengerById(@PathVariable Integer flightId, @PathVariable Integer passengerId) {
        try {
            Passenger passenger = service.getPassengerById(flightId, passengerId);
            if (passenger != null) {
                return ResponseEntity.ok(passenger);
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Passenger not found");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error fetching passenger");
        }
    }

    @PostMapping("/flights/{flightId}/passengers/add")
    public ResponseEntity<?> addPassengerToFlight(@PathVariable Integer flightId,
                                                @RequestBody FlightAndPassenger dto) {
        try {
            dto.setFlightId(flightId); // ensure flightId comes from URL
            service.addPassenger(dto);
            return ResponseEntity.ok("Passenger added to flight successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to add passenger");
        }
    }


    @PutMapping("/flights/{flightId}/passengers/{passengerId}")
    public ResponseEntity<?> updatePassenger(
            @PathVariable Integer flightId,
            @PathVariable Integer passengerId,
            @RequestBody FlightAndPassenger dto) {
        try {
            dto.setFlightId(flightId);
            dto.setPassengerId(passengerId);

            int result = service.updatePassenger(dto);

            if (result == 1) {
                return ResponseEntity.ok("Passenger updated successfully");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Passenger not found or update failed");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to update passenger");
        }
    }


    @DeleteMapping("/flights/{flightId}/passengers/{passengerId}")
    public ResponseEntity<?> deletePassenger(
            @PathVariable Integer flightId,
            @PathVariable Integer passengerId) {
        try {
            int result = service.deletePassenger(passengerId, flightId);

            if (result == 1) {
                return ResponseEntity.ok("Passenger deleted successfully from flight and master records");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Passenger not found");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to delete passenger");
        }
}


    // ================= Meals =================
    @GetMapping("/flights/{flightId}/meals")
    public ResponseEntity<?> getAllMeals() {
        try {
            return ResponseEntity.ok(service.getAllMeals());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to fetch meals");
        }
    }

    @PostMapping("/flights/{flightId}/meals/add")
    public ResponseEntity<?> addMeal(@RequestBody Meal meal) {
        try {
            int result = service.addMeal(meal);
            return ResponseEntity.status(HttpStatus.CREATED).body("Meal added with result: " + result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to add meal");
        }
    }

    @PutMapping("/flights/{flightId}/meals/update/")
    public ResponseEntity<?> updateMeal(@RequestBody Meal meal) {
        try {
            int result = service.updateMeal(meal);
            return ResponseEntity.ok("Meal updated with result: " + result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to update meal");
        }
    }

    @DeleteMapping("/flights/{flightId}/meals/{id}")
    public ResponseEntity<?> deleteMeal(@PathVariable("id") Integer mealId) {
        try {
            int result = service.deleteMeal(mealId); // only mealId is used
            if (result > 0) {
                return ResponseEntity.ok("Meal deleted successfully with ID: " + mealId);
            } else {
                return ResponseEntity.status(404).body("Meal not found with ID: " + mealId);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to delete meal");
        }
    }



    // ================= Ancillary Services =================
    @GetMapping("/flights/{flightId}/ancillary")
    public ResponseEntity<?> getAllAncillaryServices(@PathVariable("flightId") int flightId) {
        try {
            return ResponseEntity.ok(service.getAllAncillaryServices(flightId));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to fetch ancillary services");
        }
    }


    @PostMapping("/flights/{flightId}/ancillary/add")
    public ResponseEntity<?> addAncillaryService(@RequestBody AncillaryService serviceObj) {
        try {
            int result = service.addAncillaryService(serviceObj);
            return ResponseEntity.status(HttpStatus.CREATED).body("Ancillary Service added with result: " + result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to add ancillary service");
        }
    }

    @PutMapping("/flights/{flightId}/ancillary/update")
    public ResponseEntity<?> updateAncillaryService(@RequestBody AncillaryService serviceObj) {
        try {
            int result = service.updateAncillaryService(serviceObj);
            return ResponseEntity.ok("Ancillary Service updated with result: " + result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to update ancillary service");
        }
    }

    @DeleteMapping("/flights/{flightId}/ancillary/{serviceId}")
    public ResponseEntity<?> deleteAncillaryService(@PathVariable Integer flightId, @PathVariable Integer serviceId) {
        try {
            int result = service.deleteAncillaryService(flightId, serviceId);
            return ResponseEntity.ok("Ancillary Service deleted with result: " + result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to delete ancillary service");
        }
    }

    // ================= Shop Items =================
    @GetMapping("/flights/{flightId}/shop")
    public ResponseEntity<?> getAllShopItems() {
        try {
            return ResponseEntity.ok(service.getAllShopItems());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to fetch shop items");
        }
    }

    @PostMapping("/flights/{flightId}/shop/add")
    public ResponseEntity<?> addShopItem(@RequestBody ShopItem item) {
        try {
            int result = service.addShopItem(item);
            return ResponseEntity.status(HttpStatus.CREATED).body("Shop Item added with result: " + result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to add shop item");
        }
    }

    @PutMapping("/flights/{flightId}/shop/update")
    public ResponseEntity<?> updateShopItem(@RequestBody ShopItem item) {
        try {
            int result = service.updateShopItem(item);
            return ResponseEntity.ok("Shop Item updated with result: " + result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to update shop item");
        }
    }

    @DeleteMapping("/flights/{flightId}/shop/{id}")
    public ResponseEntity<?> deleteShopItem(@PathVariable int id) {
        try {
            int result = service.deleteShopItem(id);
            return ResponseEntity.ok("Shop Item deleted with result: " + result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to delete shop item");
        }
    }
}
