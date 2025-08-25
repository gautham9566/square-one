-- INSERT DUMMY DATA: Flights
INSERT INTO flights (
    flight_name, flight_date, route, departure_time, arrival_time, 
    aircraft_type, total_seats, available_seats, services, service_subtypes, seat_map
) VALUES (
    'Flight 101', 
    DATE '2025-08-20', 
    'NYC-LON', 
    '08:00 AM', 
    '04:00 PM',
    'Boeing 747', 
    20, 
    17,
    '["Ancillary", "Meal", "Shopping"]',
    '{
        "Ancillary": ["Extra Baggage 5kg", "Extra Baggage 10kg", "Priority Boarding"],
        "Meal": ["Veg", "Non-Veg", "Vegan", "Gluten-Free"],
        "Shopping": ["Magazine", "Perfume", "Sunglasses", "Headphones"]
    }',
    '[{"number": 1, "isBooked": false}, {"number": 2, "isBooked": false}, {"number": 3, "isBooked": false}, 
      {"number": 4, "isBooked": false}, {"number": 5, "isBooked": false}, {"number": 6, "isBooked": false},
      {"number": 7, "isBooked": false}, {"number": 8, "isBooked": false}, {"number": 9, "isBooked": false},
      {"number": 10, "isBooked": false}, {"number": 11, "isBooked": false}, {"number": 12, "isBooked": true},
      {"number": 13, "isBooked": false}, {"number": 14, "isBooked": true}, {"number": 15, "isBooked": true},
      {"number": 16, "isBooked": false}, {"number": 17, "isBooked": false}, {"number": 18, "isBooked": false},
      {"number": 19, "isBooked": false}, {"number": 20, "isBooked": false}]'
);

INSERT INTO flights (
    flight_name, flight_date, route, departure_time, arrival_time, 
    aircraft_type, total_seats, available_seats, services, service_subtypes, seat_map
) VALUES (
    'Flight 202', 
    DATE '2025-08-21', 
    'PAR-TOK', 
    '09:00 AM', 
    '11:00 PM',
    'Airbus A380', 
    30, 
    28,
    '["Ancillary", "Meal"]',
    '{
        "Ancillary": ["Extra Baggage 5kg", "Priority Boarding"],
        "Meal": ["Veg", "Non-Veg", "Kosher"]
    }',
    '[{"number": 1, "isBooked": false}, {"number": 2, "isBooked": false}, {"number": 3, "isBooked": false},
      {"number": 4, "isBooked": false}, {"number": 5, "isBooked": false}, {"number": 6, "isBooked": false},
      {"number": 7, "isBooked": false}, {"number": 8, "isBooked": false}, {"number": 9, "isBooked": false},
      {"number": 10, "isBooked": true}, {"number": 11, "isBooked": true}, {"number": 12, "isBooked": false},
      {"number": 13, "isBooked": false}, {"number": 14, "isBooked": false}, {"number": 15, "isBooked": false},
      {"number": 16, "isBooked": false}, {"number": 17, "isBooked": false}, {"number": 18, "isBooked": false},
      {"number": 19, "isBooked": false}, {"number": 20, "isBooked": false}, {"number": 21, "isBooked": false},
      {"number": 22, "isBooked": false}, {"number": 23, "isBooked": false}, {"number": 24, "isBooked": false},
      {"number": 25, "isBooked": false}, {"number": 26, "isBooked": false}, {"number": 27, "isBooked": false},
      {"number": 28, "isBooked": false}, {"number": 29, "isBooked": false}, {"number": 30, "isBooked": false}]'
);

INSERT INTO flights (
    flight_name, flight_date, route, departure_time, arrival_time, 
    aircraft_type, total_seats, available_seats, services, service_subtypes, seat_map
) VALUES (
    'Flight 303', 
    DATE '2025-08-22', 
    'LAX-SYD', 
    '10:00 AM', 
    '06:00 AM',
    'Boeing 777', 
    30, 
    29,
    '["Shopping"]',
    '{
        "Shopping": ["Souvenir", "Duty-Free Liquor", "Travel Adapter"]
    }',
    '[{"number": 1, "isBooked": false}, {"number": 2, "isBooked": false}, {"number": 3, "isBooked": false},
      {"number": 4, "isBooked": false}, {"number": 5, "isBooked": true}, {"number": 6, "isBooked": false},
      {"number": 7, "isBooked": false}, {"number": 8, "isBooked": false}, {"number": 9, "isBooked": false},
      {"number": 10, "isBooked": false}, {"number": 11, "isBooked": false}, {"number": 12, "isBooked": false},
      {"number": 13, "isBooked": false}, {"number": 14, "isBooked": false}, {"number": 15, "isBooked": false},
      {"number": 16, "isBooked": false}, {"number": 17, "isBooked": false}, {"number": 18, "isBooked": false},
      {"number": 19, "isBooked": false}, {"number": 20, "isBooked": false}, {"number": 21, "isBooked": false},
      {"number": 22, "isBooked": false}, {"number": 23, "isBooked": false}, {"number": 24, "isBooked": false},
      {"number": 25, "isBooked": false}, {"number": 26, "isBooked": false}, {"number": 27, "isBooked": false},
      {"number": 28, "isBooked": false}, {"number": 29, "isBooked": false}, {"number": 30, "isBooked": false}]'
);