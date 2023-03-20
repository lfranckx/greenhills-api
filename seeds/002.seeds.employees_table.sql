BEGIN;

TRUNCATE
    employees
    RESTART IDENTITY CASCADE;

INSERT INTO employees (name, score, location_id)
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