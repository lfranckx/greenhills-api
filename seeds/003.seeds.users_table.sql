BEGIN;

TRUNCATE
    users,
    RESTART IDENTITY CASCADE;

INSERT INTO users (username, password)
VALUES
    ('golf_greenhills', 'Par71'),
    ('golf_woussickett', 'Par71');