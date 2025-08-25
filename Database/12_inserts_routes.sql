-- INSERT DUMMY DATA: Routes
INSERT INTO routes (
    route_code, departure_city, departure_airport, arrival_city, arrival_airport, 
    distance_km, estimated_duration, status
) VALUES (
    'NYC-LON', 'New York', 'JFK', 'London', 'LHR', 5567, 420, 'ACTIVE'
);

INSERT INTO routes (
    route_code, departure_city, departure_airport, arrival_city, arrival_airport, 
    distance_km, estimated_duration, status
) VALUES (
    'PAR-TOK', 'Paris', 'CDG', 'Tokyo', 'NRT', 9712, 840, 'ACTIVE'
);

INSERT INTO routes (
    route_code, departure_city, departure_airport, arrival_city, arrival_airport, 
    distance_km, estimated_duration, status
) VALUES (
    'LAX-SYD', 'Los Angeles', 'LAX', 'Sydney', 'SYD', 12051, 900, 'ACTIVE'
);

INSERT INTO routes (route_code, departure_city, departure_airport, arrival_city, arrival_airport, distance_km, estimated_duration, status) VALUES
('JFK-LHR', 'New York', 'JFK', 'London', 'LHR', 5567, 420, 'ACTIVE');

INSERT INTO routes (route_code, departure_city, departure_airport, arrival_city, arrival_airport, distance_km, estimated_duration, status) VALUES
('LAX-SYD', 'Los Angeles', 'LAX', 'Sydney', 'SYD', 12051, 900, 'ACTIVE');

INSERT INTO routes (route_code, departure_city, departure_airport, arrival_city, arrival_airport, distance_km, estimated_duration, status) VALUES
('SFO-NRT', 'San Francisco', 'SFO', 'Tokyo', 'NRT', 8270, 660, 'ACTIVE');

INSERT INTO routes (route_code, departure_city, departure_airport, arrival_city, arrival_airport, distance_km, estimated_duration, status) VALUES
('CDG-JFK', 'Paris', 'CDG', 'New York', 'JFK', 5840, 435, 'ACTIVE');

INSERT INTO routes (route_code, departure_city, departure_airport, arrival_city, arrival_airport, distance_km, estimated_duration, status) VALUES
('DXB-JFK', 'Dubai', 'DXB', 'New York', 'JFK', 11000, 780, 'ACTIVE');

INSERT INTO routes (route_code, departure_city, departure_airport, arrival_city, arrival_airport, distance_km, estimated_duration, status) VALUES
('SIN-LHR', 'Singapore', 'SIN', 'London', 'LHR', 10860, 720, 'ACTIVE');

INSERT INTO routes (route_code, departure_city, departure_airport, arrival_city, arrival_airport, distance_km, estimated_duration, status) VALUES
('HND-SFO', 'Tokyo', 'HND', 'San Francisco', 'SFO', 8200, 650, 'ACTIVE');

INSERT INTO routes (route_code, departure_city, departure_airport, arrival_city, arrival_airport, distance_km, estimated_duration, status) VALUES
('GRU-EZE', 'Sao Paulo', 'GRU', 'Buenos Aires', 'EZE', 1690, 150, 'ACTIVE');

INSERT INTO routes (route_code, departure_city, departure_airport, arrival_city, arrival_airport, distance_km, estimated_duration, status) VALUES
('FRA-DXB', 'Frankfurt', 'FRA', 'Dubai', 'DXB', 5240, 360, 'ACTIVE');

INSERT INTO routes (route_code, departure_city, departure_airport, arrival_city, arrival_airport, distance_km, estimated_duration, status) VALUES
('YYZ-LHR', 'Toronto', 'YYZ', 'London', 'LHR', 5670, 430, 'ACTIVE');

INSERT INTO routes (route_code, departure_city, departure_airport, arrival_city, arrival_airport, distance_km, estimated_duration, status) VALUES
('ORD-DEL', 'Chicago', 'ORD', 'Delhi', 'DEL', 11940, 780, 'ACTIVE');

INSERT INTO routes (route_code, departure_city, departure_airport, arrival_city, arrival_airport, distance_km, estimated_duration, status) VALUES
('BOM-SIN', 'Mumbai', 'BOM', 'Singapore', 'SIN', 3900, 270, 'ACTIVE');

INSERT INTO routes (route_code, departure_city, departure_airport, arrival_city, arrival_airport, distance_km, estimated_duration, status) VALUES
('MEX-JFK', 'Mexico City', 'MEX', 'New York', 'JFK', 3510, 240, 'ACTIVE');

INSERT INTO routes (route_code, departure_city, departure_airport, arrival_city, arrival_airport, distance_km, estimated_duration, status) VALUES
('AMS-JNB', 'Amsterdam', 'AMS', 'Johannesburg', 'JNB', 9250, 600, 'ACTIVE');

INSERT INTO routes (route_code, departure_city, departure_airport, arrival_city, arrival_airport, distance_km, estimated_duration, status) VALUES
('BCN-ATH', 'Barcelona', 'BCN', 'Athens', 'ATH', 2000, 130, 'ACTIVE');

INSERT INTO routes (route_code, departure_city, departure_airport, arrival_city, arrival_airport, distance_km, estimated_duration, status) VALUES
('CPT-LHR', 'Cape Town', 'CPT', 'London', 'LHR', 9680, 610, 'ACTIVE');

INSERT INTO routes (route_code, departure_city, departure_airport, arrival_city, arrival_airport, distance_km, estimated_duration, status) VALUES
('ICN-SYD', 'Seoul', 'ICN', 'Sydney', 'SYD', 7780, 520, 'ACTIVE');

INSERT INTO routes (route_code, departure_city, departure_airport, arrival_city, arrival_airport, distance_km, estimated_duration, status) VALUES
('MEL-AKL', 'Melbourne', 'MEL', 'Auckland', 'AKL', 2130, 140, 'ACTIVE');

INSERT INTO routes (route_code, departure_city, departure_airport, arrival_city, arrival_airport, distance_km, estimated_duration, status) VALUES
('DUB-LHR', 'Dublin', 'DUB', 'London', 'LHR', 463, 55, 'ACTIVE');

INSERT INTO routes (route_code, departure_city, departure_airport, arrival_city, arrival_airport, distance_km, estimated_duration, status) VALUES
('SVO-LED', 'Moscow', 'SVO', 'St. Petersburg', 'LED', 705, 95, 'INACTIVE');