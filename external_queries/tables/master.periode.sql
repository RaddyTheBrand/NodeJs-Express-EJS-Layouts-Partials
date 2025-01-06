-- Table Definition
CREATE TABLE if not exists public.master_periode (
    id varchar,
    name varchar,
    start_date date,
    end_date date,
    is_lock Default false,
    PRIMARY KEY ("nik")
);

INSERT INTO master_period (id, name, start_date, end_date, is_lock)
VALUES
(1, '01/2024', '2024-12-01', '2024-12-31', is_lock);