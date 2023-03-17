BEGIN;

TRUNCATE
    locations
    RESTART IDENTITY CASCADE;

INSERT INTO locations (name, address)
VALUES
    ('Green Hills', '1959 South Main Street, Clyde, Ohio 43410'),
    ('Woussickett', '6311 W Mason Rd, Sandusky, Ohio 44870');

COMMIT;