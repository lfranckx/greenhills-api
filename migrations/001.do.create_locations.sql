CREATE TABLE locations (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name TEXT NOT NULL UNIQUE,
    address TEXT NOT NULL
);