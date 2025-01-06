-- Table Definition
CREATE TABLE if not exists public.employee (
    name varchar,
    password varchar,
    nik varchar,
    is_atasan bool Default false,
    is_hr bool Default false
    PRIMARY KEY ("nik")
);

INSERT INTO employee (name, password, nik, is_atasan_bool, is_hr)
VALUES
('Dummy A', '123', 'asdasd', '22123113', True, False);

INSERT INTO employee (name, password, nik, is_atasan_bool)
VALUES
('Dummy A', '123', 'asdasd', '22123113', True, False);