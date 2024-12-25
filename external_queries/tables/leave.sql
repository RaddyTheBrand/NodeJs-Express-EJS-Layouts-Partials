-- Table Definition
CREATE TABLE if not exists public.leave (
    document_number varchar,
    employee_nik varchar integer REFERENCES employee (nik),
    start_date date,
    end_date date,
    type varchar,
    status varchar,
    PRIMARY KEY ("document_number")
);

INSERT INTO leave (document_number, employee_nik, start_date, end_date, status)
VALUES
('CUTI/01', 1, '2024-12-01', '2024-12-01', 'draft');


INSERT INTO leave (document_number, employee_nik, start_date, end_date, status)
VALUES
('CUTI/02', 2, '2024-12-01', '2024-12-01', 'draft');