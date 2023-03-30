CREATE TABLE tickets (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    custom_message TEXT,
    employee_name TEXT NOT NULL,
    employee_id INTEGER REFERENCES employees(id) ON DELETE SET NULL,
    location_id INTEGER NOT NULL REFERENCES locations(id),
    date_created TYPE TIMESTAMP WITH TIME ZONE USING date_created AT TIME ZONE 'America/Chicago',
    date_modified TIMESTAMP
);