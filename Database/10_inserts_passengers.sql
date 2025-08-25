-- INSERT DUMMY DATA: Passengers
INSERT INTO passengers (
    flight_id, name, phone_number, address, passport_number, date_of_birth,
    origin, destination, services, meal_type, meal_name, extra_baggage,
    shopping_items, seat, checked_in, wheelchair, infant
) VALUES (
    1, 'Alice Johnson', '123-456-7890', '123 Main St, New York, NY', 'A1234567', DATE '1990-04-15',
    'NYC', 'LON', '["Meal", "Ancillary"]', 'Veg', 'Biryani', 10,
    '[]', '1', 'Y', 'N', 'N'
);

INSERT INTO passengers (
    flight_id, name, phone_number, address, passport_number, date_of_birth,
    origin, destination, services, meal_type, meal_name, extra_baggage,
    shopping_items, seat, checked_in, wheelchair, infant
) VALUES (
    1, 'Bob Smith', '987-654-3210', '456 Elm St, Los Angeles, CA', NULL, NULL,
    'NYC', 'LON', '["Shopping"]', NULL, NULL, 0,
    '["Magazine", "Perfume"]', '2', 'Y', 'Y', 'N'
);

INSERT INTO passengers (
    flight_id, name, phone_number, address, passport_number, date_of_birth,
    origin, destination, services, meal_type, meal_name, extra_baggage,
    shopping_items, seat, checked_in, wheelchair, infant
) VALUES (
    1, 'Charlie Brown', '555-555-5555', '789 Oak St, Chicago, IL', 'B7654321', DATE '1985-11-05',
    'NYC', 'LON', '["Meal", "Shopping"]', 'Non-Veg', 'Burger', 0,
    '["Chocolates"]', '3', 'Y', 'N', 'Y'
);

INSERT INTO passengers (
    flight_id, name, phone_number, address, passport_number, date_of_birth,
    origin, destination, services, meal_type, meal_name, extra_baggage,
    shopping_items, seat, checked_in, wheelchair, infant
) VALUES (
    2, 'Diana Prince', '111-222-3333', '321 Maple St, Paris, FR', 'P9998887', DATE '1992-07-20',
    'PAR', 'TOK', '["Meal"]', 'Veg', 'Salad', 0,
    '[]', '1', 'Y', 'N', 'N'
);

INSERT INTO passengers (
    flight_id, name, phone_number, address, passport_number, date_of_birth,
    origin, destination, services, meal_type, meal_name, extra_baggage,
    shopping_items, seat, checked_in, wheelchair, infant
) VALUES (
    2, 'Ethan Hunt', '444-555-6666', '654 Pine St, Tokyo, JP', 'E5554443', DATE '1978-03-12',
    'PAR', 'TOK', '["Shopping"]', NULL, NULL, 0,
    '["Watch"]', '2', 'Y', 'N', 'N'
);

INSERT INTO passengers (
    flight_id, name, phone_number, address, passport_number, date_of_birth,
    origin, destination, services, meal_type, meal_name, extra_baggage,
    shopping_items, seat, checked_in, wheelchair, infant
) VALUES (
    3, 'Fiona Glenanne', '777-888-9999', '987 Birch St, Sydney, AU', NULL, NULL,
    'LAX', 'SYD', '["Ancillary"]', NULL, NULL, 15,
    '[]', '5', 'Y', 'Y', 'Y'
);