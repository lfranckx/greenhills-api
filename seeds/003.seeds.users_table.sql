BEGIN;

TRUNCATE
    users
    RESTART IDENTITY CASCADE;

INSERT INTO users (username, password, location_id)
VALUES
    ('test_greenhills', '$2a$12$RCqiK9BWqDMdiMT7ztQrdOgez2VFifUD8YNbGMkbGhAoEIjFLBTxK', 1),
    ('test_woussickett', '$2a$12$RCqiK9BWqDMdiMT7ztQrdOgez2VFifUD8YNbGMkbGhAoEIjFLBTxK', 2);

    -- hashed password $2a$12$RCqiK9BWqDMdiMT7ztQrdOgez2VFifUD8YNbGMkbGhAoEIjFLBTxK