-- Drop existing tables if they exist (for clean setup)
BEGIN
   FOR c IN (SELECT table_name FROM user_tables WHERE table_name IN (
      'TRAVEL_HISTORY', 'PASSENGERS', 'FLIGHTS', 'USERS', 'ROUTES'
   )) LOOP
      EXECUTE IMMEDIATE 'DROP TABLE ' || c.table_name || ' CASCADE CONSTRAINTS';
   END LOOP;
END;
/