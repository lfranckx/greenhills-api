BEGIN;

TRUNCATE
    users
    RESTART IDENTITY CASCADE;

INSERT INTO users (username, password, location_id)
VALUES
    ('test_greenhills', '$2a$12$WxamwYprWw1eiRWOd0g3leQzshomy.OFeo3AHtozPcsyXKbk3D4R2', 1),
    ('test_woussickett', '$2a$12$WxamwYprWw1eiRWOd0g3leQzshomy.OFeo3AHtozPcsyXKbk3D4R2', 2);

COMMIT;
    
-- hashed password $2a$12$WxamwYprWw1eiRWOd0g3leQzshomy.OFeo3AHtozPcsyXKbk3D4R2