-- INSERT DUMMY DATA: Travel History
INSERT INTO travel_history (
    passenger_id, flight_id, travel_date, origin, destination, seat,
    booking_reference, fare_class, status, distance_km, duration_min, notes
) VALUES (
    1, 1, DATE '2024-12-15', 'NYC', 'LON', '12A',
    'ABC123', 'Economy', 'Completed', 5567, 420, 'On-time arrival'
);

INSERT INTO travel_history (
    passenger_id, flight_id, travel_date, origin, destination, seat,
    booking_reference, fare_class, status, distance_km, duration_min, notes
) VALUES (
    2, 1, DATE '2025-01-10', 'NYC', 'LON', '14B',
    'DEF456', 'Economy', 'Completed', 5567, 430, 'Delayed due to weather'
);

INSERT INTO travel_history (
    passenger_id, flight_id, travel_date, origin, destination, seat,
    booking_reference, fare_class, status, distance_km, duration_min, notes
) VALUES (
    3, 1, DATE '2025-02-05', 'NYC', 'LON', '15C',
    'GHI789', 'Business', 'Completed', 5567, 415, 'Upgraded to Business'
);

INSERT INTO travel_history (
    passenger_id, flight_id, travel_date, origin, destination, seat,
    booking_reference, fare_class, status, distance_km, duration_min, notes
) VALUES (
    4, 2, DATE '2025-03-21', 'PAR', 'TOK', '10A',
    'JKL012', 'Economy', 'Completed', 9712, 840, NULL
);

INSERT INTO travel_history (
    passenger_id, flight_id, travel_date, origin, destination, seat,
    booking_reference, fare_class, status, distance_km, duration_min, notes
) VALUES (
    5, 2, DATE '2025-04-01', 'PAR', 'TOK', '11B',
    'MNO345', 'Premium Economy', 'Checked-in', 9712, 845, 'Checked in online'
);

INSERT INTO travel_history (
    passenger_id, flight_id, travel_date, origin, destination, seat,
    booking_reference, fare_class, status, distance_km, duration_min, notes
) VALUES (
    6, 3, DATE '2025-05-18', 'LAX', 'SYD', '5C',
    'PQR678', 'Economy', 'Cancelled', 12051, 900, 'Cancelled by airline'
);

INSERT INTO travel_history (
    passenger_id, flight_id, travel_date, origin, destination, seat,
    booking_reference, fare_class, status, distance_km, duration_min, notes
) VALUES (
    2, 3, DATE '2025-06-02', 'LAX', 'SYD', NULL,
    'STB999', 'Standby', 'Pending', 12051, 905, 'Standby passenger'
);

INSERT INTO travel_history (
    passenger_id, flight_id, travel_date, origin, destination, seat,
    booking_reference, fare_class, status, distance_km, duration_min, notes
) VALUES (
    1, 2, DATE '2025-12-10', 'PAR', 'TOK', '20C',
    'FUT2025', 'Economy', 'Booked', 9712, 840, 'Return trip'
);