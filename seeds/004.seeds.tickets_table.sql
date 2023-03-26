BEGIN;

TRUNCATE
    tickets
    RESTART IDENTITY CASCADE;

INSERT INTO tickets (custom_message, employee_name, employee_id, location_id, date_created, date_modified)
VALUES
    ('This is a test! This should be in the Green Hills table!', 'Max Yellstrom', 1, 1, '2023-03-20 22:40:54.144672', null),
    ('This is a test! This should be in the Green Hills table!', 'Kennedy Miller', 2, 1, '2023-02-21 22:40:54.144672', null),
    ('This is a test! This should be in the Green Hills table!', 'Joe Hough', 3, 1, '2023-04-10 21:43:54.144672', null),
    ('This is a test! This should be in the Green Hills table!', 'Gavin Brugnone', 4, 1, '2023-03-24 11:10:01.092331', null),
    ('This is a test! This should be in the Green Hills table!', 'Addy Myers', 5, 1, '2023-01-22 11:10:01.092331', null),
    ('This is a test! This should be in the Green Hills table!', 'Outings Events', 6, 1, '2023-01-27 10:13:01.092331', null),
    ('This is a test! This should be in the Woussickett table!', 'Sharon Lynch', 7, 2, '2023-01-25 11:35:01.092331', null),
    ('This is a test! This should be in the Woussickett table!', 'Brooks Webb', 8, 2, '2023-01-12 16:10:01.092331', null),
    ('This is a test! This should be in the Woussickett table!', 'Heidi Maines', 9, 2, '2023-01-09 11:10:01.092331', null),
    ('This is a test! This should be in the Woussickett table!', 'Alvin Hulse', 10, 2, '2023-01-02 17:45:32.092331', null),
    ('This is a test! This should be in the Woussickett table!', 'Ryan Kurt', 11, 2, '2023-01-01 08:12:43.092331', null),
    ('This is a test! This should be in the Woussickett table!', 'Josh Grimm', 12, 2, '2023-01-01 08:12:43.092331', null),
    ('This is a test! This should be in the Woussickett table!', 'BK Kalies', 13, 2, '2023-01-07 13:42:09.092331', null),
    ('This is a test! This should be in the Woussickett table!', 'Outings Events', 14, 2, '2023-01-04 09:56:58.092331', null);