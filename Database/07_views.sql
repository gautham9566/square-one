-- VIEWS
CREATE OR REPLACE VIEW v_passenger_details AS
SELECT 
    p.passenger_id,
    p.name AS passenger_name,
    p.phone_number,
    p.passport_number,
    p.date_of_birth,
    p.seat,
    CASE WHEN p.checked_in = 'Y' THEN 'Yes' ELSE 'No' END AS checked_in_status,
    CASE WHEN p.wheelchair = 'Y' THEN 'Yes' ELSE 'No' END AS needs_wheelchair,
    CASE WHEN p.infant = 'Y' THEN 'Yes' ELSE 'No' END AS with_infant,
    p.meal_type,
    p.meal_name,
    p.extra_baggage,
    p.services,
    p.shopping_items,
    f.flight_name,
    f.flight_date,
    f.route,
    f.departure_time,
    f.arrival_time,
    f.aircraft_type
FROM 
    passengers p
JOIN 
    flights f ON p.flight_id = f.flight_id;

CREATE OR REPLACE VIEW v_flight_occupancy AS
SELECT 
    flight_id,
    flight_name,
    flight_date,
    route,
    total_seats,
    available_seats,
    (total_seats - available_seats) AS occupied_seats,
    ROUND(((total_seats - available_seats) * 100.0 / total_seats), 2) AS occupancy_percentage
FROM 
    flights;

CREATE OR REPLACE VIEW v_staff_assignments AS
SELECT 
    u.user_id,
    u.username,
    u.name AS staff_name,
    u.role,
    f.flight_name,
    f.flight_date,
    f.route
FROM 
    users u
LEFT JOIN 
    flights f ON u.flight_id = f.flight_id
WHERE 
    u.role IN ('inflightStaff', 'checkinStaff');

CREATE OR REPLACE VIEW v_travel_history_complete AS
SELECT 
    th.history_id,
    p.name AS passenger_name,
    f.flight_name,
    th.travel_date,
    th.origin,
    th.destination,
    th.seat,
    th.booking_reference,
    th.fare_class,
    th.status,
    th.distance_km,
    th.duration_min,
    th.notes
FROM 
    travel_history th
JOIN 
    passengers p ON th.passenger_id = p.passenger_id
JOIN 
    flights f ON th.flight_id = f.flight_id
ORDER BY 
    th.travel_date DESC;