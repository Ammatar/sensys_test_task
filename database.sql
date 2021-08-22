-- Создание таблицы и ее схемы
create TABLE gps_coord(
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255),
    latitud DOUBLE PRECISION,
    longitud DOUBLE PRECISION,
    entrydate TIMESTAMP NOT NULL DEFAULT CURRENT_DATE
);