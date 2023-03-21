BEGIN;

TRUNCATE
    users
    RESTART IDENTITY CASCADE;

INSERT INTO users (username, password)
VALUES
    ('golf_greenhills', 'Par71', 1),
    ('golf_woussickett', 'Par71', 2);

    -- hashed password $2a$12$RCqiK9BWqDMdiMT7ztQrdOgez2VFifUD8YNbGMkbGhAoEIjFLBTxK