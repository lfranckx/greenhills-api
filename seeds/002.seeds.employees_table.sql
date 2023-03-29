BEGIN;

TRUNCATE
    employees
    RESTART IDENTITY CASCADE;

INSERT INTO employees (order_number, name, score, location_id)
    VALUES
        (1, 'Outings Events', 0, 1),
        (2, 'Max Yellstrom', 0, 1),
        (3, 'Kennedy Miller', 0, 1),
        (4, 'Joe Hough', 0, 1),
        (5, 'Gavin Brugnone', 0, 1),
        (6, 'Addy Myers', 0, 1),
        (7, 'Outings Events', 0, 2),
        (8, 'Sharon Lynch', 0, 2),
        (9, 'Brooks Webb', 0, 2),
        (10, 'Heidi Maines', 0, 2),
        (11, 'Alvin Hulse', 0, 2),
        (12, 'Ryan Kurt', 0, 2),
        (13, 'Josh Grimm', 0, 2),
        (14, 'BK Kalies', 0, 2);

COMMIT;