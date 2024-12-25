-- Table Definition
CREATE TABLE if not exists public.attendance (
    document_number varchar,
    employee_nik varchar integer REFERENCES employee (nik),
    datetime timestamp,
    attachment_id integer REFERENCES attachment (id),
    status varchar,
    PRIMARY KEY ("document_number")
);

INSERT INTO attendance (document_number, employee_nik, datetime, status)
VALUES
('ABS/01', 00000001, '2024-12-01 07:08:00', 'draft');


INSERT INTO attendance (document_number, employee_nik, datetime, status)
VALUES
('ABS/01', 00000002, '2024-12-01 07:08:00', 'waiting_approval');
