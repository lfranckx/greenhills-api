CREATE TABLE locations (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name TEXT NOT NULL UNIQUE,
    address TEXT NOT NULL
);

CREATE TABLE tickets (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    employee_name TEXT NOT NULL,
    custom_message TEXT,
    date_created TIMESTAMP NOT NULL DEFAULT CURRENT_DATE,
    date_modified TIMESTAMP,
    location_id INTEGER NOT NULL REFERENCES locations(id)
);

CREATE TABLE employees (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    employee_name TEXT NOT NULL,
    employee_score INTEGER NOT NULL,
    location_id INTEGER NOT NULL REFERENCES locations(id),
    date_created TIMESTAMP NOT NULL DEFAULT now(),
    date_modified TIMESTAMP
);

ALTER TABLE tickets
    ADD COLUMN
        employee_id INTEGER REFERENCES employees(id)
        ON DELETE SET NULL;

CREATE TABLE users (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    date_created TIMESTAMP NOT NULL DEFAULT now(),
    date_modified TIMESTAMP
);