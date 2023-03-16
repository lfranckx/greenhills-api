CREATE TABLE employees (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    employee_order_number INTEGER NOT NULL UNIQUE,
    employee_name TEXT NOT NULL,
    employee_score INTEGER NOT NULL,
    location_id INTEGER NOT NULL REFERENCES locations(id),
    date_created TIMESTAMP NOT NULL DEFAULT now(),
    date_modified TIMESTAMP
);

ALTER TABLE tickets
    ADD COLUMN
        employee_id INTEGER REFERENCES employees(id)
        ON DELETE SET NULL