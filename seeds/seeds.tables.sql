BEGIN;

TRUNCATE
    tickets,
    employees,
    users
    RESTART IDENTITY CASCADE;

INSERT INTO users (username, password)
VALUES
    ('golf_greenhills', 'Par71'),
    ('golf_woussickett', 'Par71');

INSERT INTO locations (name, address)
VALUES
    ('Green Hills', '1959 South Main Street, Clyde, Ohio 43410'),
    ('Woussickett', '6311 W Mason Rd, Sandusky, Ohio 44870');

INSERT INTO employees (employee_name, employee_score, location_id)
    VALUES
        ('Max Yellstrom', 0, 1),
        ('Kennedy Miller', 0, 1),
        ('Joe Hough', 0, 1),
        ('Gavin Brugnone', 0, 1),
        ('Addy Myers', 0, 1),
        ('Outings', 0, 1),
        ('Sharon Lynch', 0, 2),
        ('Brooks Webb', 0, 2),
        ('Heidi Maines', 0, 2),
        ('Alvin Hulse', 0, 2),
        ('Ryan Kurt', 0, 2),
        ('Josh Grimm', 0, 2),
        ('BK Kalies', 0, 2);

COMMIT;