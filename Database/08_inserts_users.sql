-- INSERT DUMMY DATA: Users
INSERT INTO users (username, password, role, name, email, phone_number, flight_id) VALUES
    ('admin1', 'adminpass', 'admin', 'Alice', NULL, NULL, NULL);
INSERT INTO users (username, password, role, name, flight_id) VALUES
    ('inflight1', 'inflightpass', 'inflightStaff', 'Charlie Inflight', 1);
INSERT INTO users (username, password, role, name, flight_id) VALUES
    ('checkin1', 'checkinpass', 'checkinStaff', 'Diana Checkin', 2);
INSERT INTO users (username, password, role, name, email, phone_number) VALUES
    ('passenger1', 'passpass', 'passenger', 'Sam Traveler', 'sam@example.com', '999-888-7777');