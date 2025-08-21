package com.oracle.admin.inter;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.oracle.admin.entity.AncillaryService;
import com.oracle.admin.entity.Flight;
import com.oracle.admin.entity.Meal;
import com.oracle.admin.entity.Passenger;
import com.oracle.admin.entity.ShopItem;
import com.oracle.admin.returners.FlightAndPassenger;
import com.oracle.admin.returners.SeatInfo;

import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;

// import java.util.ArrayList;
// import java.util.List;

@Service
public class MethodsImpl implements Methods {

        @Autowired
        private JdbcTemplate jdbcTemplate;

        @Override
        public List<Flight> getAll() {
            try {
                String sql = "SELECT * FROM flight";
                return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Flight.class));
            } catch (Exception e) {
                e.printStackTrace();
                return new ArrayList<>(); 
            }
        }

        @Override
    public Flight getFlightById(Integer flightId) {
        try {
            System.out.println(flightId);
            System.out.println("inside getFlightDetails");
            String sql = "SELECT * FROM flight WHERE flight_id = ?";
            return jdbcTemplate.queryForObject(sql, new Object[]{flightId}, (rs, rowNum) -> {
                Flight flight = new Flight();
                flight.setFlightId(rs.getInt("flight_id"));
                flight.setFlightNumber(rs.getString("flight_number"));
                flight.setDepartureDate(rs.getDate("departure_date"));
                flight.setDepartureTime(rs.getTimestamp("departure_time"));
                flight.setArrivalDate(rs.getDate("arrival_date"));
                flight.setArrivalTime(rs.getTimestamp("arrival_time"));
                flight.setOrigin(rs.getString("origin"));
                flight.setDestination(rs.getString("destination"));
                flight.setAircraftId(rs.getInt("aircraft_id"));
                return flight;
            });
        } catch (Exception e) {
            throw new RuntimeException("Flight not found with ID: " + flightId, e);
        }
    }

    @Override
    public List<FlightAndPassenger> getPassengers(Integer flightId) {
        try {
            String sql = """
                SELECT 
                    p.passenger_id,
                    p.name,
                    p.dob,
                    p.passport_number,
                    p.address,
                    p.email,
                    p.phone,
                    fp.flight_id,
                    fp.seat_number,
                    fp.check_in_status,
                    fp.wheel_chair,
                    fp.infant
                FROM passenger p
                JOIN flight_passenger fp 
                    ON p.passenger_id = fp.passenger_id
                WHERE fp.flight_id = ?
            """;

            return jdbcTemplate.query(sql, new Object[]{flightId}, (rs, rowNum) -> {
                FlightAndPassenger fap = new FlightAndPassenger();
                fap.setPassengerId(rs.getInt("passenger_id"));
                fap.setName(rs.getString("name"));
                fap.setDob(rs.getDate("dob"));
                fap.setPassportNumber(rs.getString("passport_number"));
                fap.setAddress(rs.getString("address"));
                fap.setEmail(rs.getString("email"));
                fap.setPhone(rs.getString("phone"));
                fap.setFlightId(rs.getInt("flight_id"));
                fap.setSeatNumber(rs.getInt("seat_number"));
                fap.setCheckInStatus(rs.getString("check_in_status"));
                fap.setWheelChair(rs.getString("wheel_chair"));
                fap.setInfant(rs.getString("infant"));
                return fap;
            });
        } catch (Exception e) {
            throw e;
        }
    }



    @Override
    public Passenger getPassengerById(Integer flightId, Integer passengerId) {
    try {
        String sql = """
            SELECT p.*
            FROM passenger p
            JOIN flight_passenger fp ON p.passenger_id = fp.passenger_id
            WHERE fp.flight_id = ? AND p.passenger_id = ?
        """;

        return jdbcTemplate.queryForObject(sql, new Object[]{flightId, passengerId}, (rs, rowNum) -> {
            Passenger passenger = new Passenger();
            passenger.setPassengerId(rs.getInt("passenger_id"));
            passenger.setName(rs.getString("name"));
            passenger.setDob(rs.getDate("dob"));
            passenger.setPassportNumber(rs.getString("passport_number"));
            passenger.setAddress(rs.getString("address"));
            passenger.setEmail(rs.getString("email"));
            passenger.setPhone(rs.getString("phone"));
            return passenger;
        });
    } catch (Exception e) {
        throw e;
    }
}

    @Override
    public int addPassenger(FlightAndPassenger dto) {
        try {
            // 1. Generate next passenger_id
            Integer nextId = jdbcTemplate.queryForObject(
                "SELECT NVL(MAX(passenger_id), 0) + 1 FROM passenger", Integer.class
            );
            dto.setPassengerId(nextId);

            // 2. Insert into passenger table
            String passengerSql = "INSERT INTO passenger (passenger_id, name, dob, passport_number, address, email, phone) " +
                                "VALUES (?, ?, ?, ?, ?, ?, ?)";
            jdbcTemplate.update(passengerSql,
                    dto.getPassengerId(),
                    dto.getName(),
                    dto.getDob(),
                    dto.getPassportNumber(),
                    dto.getAddress(),
                    dto.getEmail(),
                    dto.getPhone()
            );

            // 3. Insert into flight_passenger table
            String flightPassengerSql = "INSERT INTO flight_passenger " +
                                        "(flight_id, passenger_id, seat_number, check_in_status, wheel_chair, infant) " +
                                        "VALUES (?, ?, ?, ?, ?, ?)";
            jdbcTemplate.update(flightPassengerSql,
                    dto.getFlightId(),
                    dto.getPassengerId(),
                    dto.getSeatNumber(),
                    dto.getCheckInStatus(),
                    dto.getWheelChair(),
                    dto.getInfant()
            );

            return 1; // success
        } catch (Exception e) {
            e.printStackTrace();
            return 0; // failure
        }
    }







    @Override
    public int updatePassenger(FlightAndPassenger dto) {
        try {
            // Update passenger table
            String passengerSql = """
                UPDATE passenger
                SET name = ?, dob = ?, passport_number = ?, address = ?, email = ?, phone = ?
                WHERE passenger_id = ?
            """;

            int passengerResult = jdbcTemplate.update(passengerSql,
                    dto.getName(),
                    dto.getDob(),
                    dto.getPassportNumber(),
                    dto.getAddress(),
                    dto.getEmail(),
                    dto.getPhone(),
                    dto.getPassengerId());

            // Update flight_passenger table
            String flightPassengerSql = """
                UPDATE flight_passenger
                SET seat_number = ?, check_in_status = ?, wheel_chair = ?, infant = ?
                WHERE flight_id = ? AND passenger_id = ?
            """;

            int flightPassengerResult = jdbcTemplate.update(flightPassengerSql,
                    dto.getSeatNumber(),
                    dto.getCheckInStatus(),
                    dto.getWheelChair(),
                    dto.getInfant(),
                    dto.getFlightId(),
                    dto.getPassengerId());

            // return 1 only if both updates are successful
            return (passengerResult > 0 && flightPassengerResult > 0) ? 1 : 0;
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }


    @Override
    public int deletePassenger(Integer passengerId, Integer flightId) {
        try {
            // First delete from flight_passenger
            String flightPassengerSql = "DELETE FROM flight_passenger WHERE flight_id = ? AND passenger_id = ?";
            int flightResult = jdbcTemplate.update(flightPassengerSql, flightId, passengerId);

            // Then delete from passenger
            String passengerSql = "DELETE FROM passenger WHERE passenger_id = ?";
            int passengerResult = jdbcTemplate.update(passengerSql, passengerId);

            // return 1 only if passenger deletion succeeds (flight deletion may be 0 if not linked)
            return (passengerResult > 0) ? 1 : 0;
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }


    @Override
    public List<Passenger> getInvalidPassengers() {
    String sql = """
        SELECT passenger_id, name, dob, passport_number, address, email, phone
        FROM passenger
        WHERE passport_number IS NULL OR TRIM(passport_number) = ''
           OR address IS NULL OR TRIM(address) = ''
           OR dob IS NULL
    """;

    return jdbcTemplate.query(sql, (rs, rowNum) -> {
        Passenger passenger = new Passenger();
        passenger.setPassengerId(rs.getInt("passenger_id"));
        passenger.setName(rs.getString("name"));
        passenger.setDob(rs.getDate("dob"));
        passenger.setPassportNumber(rs.getString("passport_number"));
        passenger.setAddress(rs.getString("address"));
        passenger.setEmail(rs.getString("email"));
        passenger.setPhone(rs.getString("phone"));
        return passenger;
    });
    }

    @Override
    public int addMeal(Meal meal) {
    try {
        // Get next meal_id
        Integer maxId = jdbcTemplate.queryForObject(
            "SELECT NVL(MAX(meal_id), 0) FROM meal", Integer.class
        );
        int nextId = maxId + 1;

        String sql = """
            INSERT INTO meal (meal_id, name, type, description)
            VALUES (?, ?, ?, ?)
        """;
        return jdbcTemplate.update(sql,
                nextId,
                meal.getName(),
                meal.getType(),
                meal.getDescription()
        );
    } catch (Exception e) {
        e.printStackTrace();
        return 0;
    }
}
    @Override
    public int updateMeal(Meal meal) {
        String sql = """
            UPDATE meal
            SET name = ?, type = ?, description = ?
            WHERE meal_id = ?
        """;
        return jdbcTemplate.update(sql,
                meal.getName(),
                meal.getType(),
                meal.getDescription(),
                meal.getMealId()
        );
    }

    @Override
    public int deleteMeal(Integer mealId) {
        String sql = "DELETE FROM meal WHERE meal_id = ?";
        return jdbcTemplate.update(sql, mealId);
    }

    @Override
    public List<Meal> getAllMeals() {
        String sql = "SELECT meal_id, name, type, description FROM meal";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Meal meal = new Meal();
            meal.setMealId(rs.getInt("meal_id"));
            meal.setName(rs.getString("name"));
            meal.setType(rs.getString("type"));
            meal.setDescription(rs.getString("description"));
            return meal;
        });
    }

    @Override
    public int addAncillaryService(AncillaryService service) {
        try {
            // Get next service_id
            Integer maxId = jdbcTemplate.queryForObject(
                "SELECT NVL(MAX(service_id), 0) FROM ancillary_service", Integer.class
            );
            int nextId = maxId + 1;

            String sql = """
                INSERT INTO ancillary_service (flight_id, service_id, name, description)
                VALUES (?, ?, ?, ?)
            """;
            return jdbcTemplate.update(sql,
                    service.getFlightId(),
                    nextId,
                    service.getName(),
                    service.getDescription()
            );
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }


    @Override
    public int updateAncillaryService(AncillaryService service) {
        String sql = """
            UPDATE ancillary_service
            SET name = ?, description = ?
            WHERE flight_id = ? AND service_id = ?
        """;
        return jdbcTemplate.update(sql,
                service.getName(),
                service.getDescription(),
                service.getFlightId(),
                service.getServiceId()
        );
    }

    @Override
    public int deleteAncillaryService(Integer flightId, Integer serviceId) {
        String sql = "DELETE FROM ancillary_service WHERE flight_id = ? AND service_id = ?";
        return jdbcTemplate.update(sql, flightId, serviceId);
    }

    @Override
    public List<AncillaryService> getAllAncillaryServices(int flightId) {
        String sql = "SELECT flight_id, service_id, name, description " +
                    "FROM ancillary_service WHERE flight_id = ?";
        return jdbcTemplate.query(sql, new Object[]{flightId}, (rs, rowNum) -> {
            AncillaryService service = new AncillaryService();
            service.setFlightId(rs.getInt("flight_id"));
            service.setServiceId(rs.getInt("service_id"));
            service.setName(rs.getString("name"));
            service.setDescription(rs.getString("description"));
            return service;
        });
    }


    @Override
    public int addShopItem(ShopItem item) {
        try {
            // Get next item_id
            Integer maxId = jdbcTemplate.queryForObject(
                "SELECT NVL(MAX(item_id), 0) FROM shop_item", Integer.class
            );
            int nextId = maxId + 1;

            String sql = """
                INSERT INTO shop_item (item_id, name, price, available_onboard)
                VALUES (?, ?, ?, ?)
            """;
            return jdbcTemplate.update(sql,
                    nextId,
                    item.getName(),
                    item.getPrice(),
                    item.getAvailable_onboard()
            );
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    @Override
    public int updateShopItem(ShopItem item) {
        String sql = """
            UPDATE shop_item
            SET name = ?, price = ?, available_onboard = ?
            WHERE item_id = ?
        """;
        return jdbcTemplate.update(sql,
                item.getName(),
                item.getPrice(),
                item.getAvailable_onboard(),
                item.getItem_id()
        );
    }

    @Override
    public int deleteShopItem(int itemId) {
        String sql = "DELETE FROM shop_item WHERE item_id = ?";
        return jdbcTemplate.update(sql, itemId);
    }

    @Override
    public List<ShopItem> getAllShopItems() {
        String sql = "SELECT item_id, name, price, available_onboard FROM shop_item";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            ShopItem item = new ShopItem();
            item.setItem_id(rs.getInt("item_id"));
            item.setName(rs.getString("name"));
            item.setPrice(rs.getDouble("price"));
            item.setAvailable_onboard(rs.getString("available_onboard"));
            return item;
        });
    }
}
