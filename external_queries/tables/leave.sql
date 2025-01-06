-- Table Definition
CREATE TABLE if not exists public.leave (
    id integer DEFAULT nextval('attendance_id_seq'), 
    document_number varchar,
    employee_nik varchar REFERENCES employee (nik),
    start_date date,
    end_date date,
    type varchar,
    status varchar,
    PRIMARY KEY ("id")
);

INSERT INTO leave (document_number, employee_nik, start_date, end_date, type, status)
VALUES
('IJIN/01', '00000001', '2024-12-01', '2024-12-01', 'sakit', 'draft');

INSERT INTO leave (document_number, employee_nik, start_date, end_date, type, status)
VALUES
('IJIN/02', '00000001', '2024-12-01', '2024-12-01', 'ijin', 'draft');

CREATE SEQUENCE leave_id_seq START 1;