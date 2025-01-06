-- Table Definition
CREATE TABLE if not exists public.attendance (
    id integer DEFAULT nextval('attendance_id_seq'), 
    document_number varchar,
    employee_nik varchar integer REFERENCES employee (nik),
    datetime timestamp,
    attachment_id integer REFERENCES attachment (id),
    status varchar,
    PRIMARY KEY ("id")
);

INSERT INTO attendance (document_number, employee_nik, datetime, status)
VALUES
('ATT/2024/1', '00000001', '2024-12-01 07:08:00', 'draft');


INSERT INTO attendance (document_number, employee_nik, datetime, status)
VALUES
('ATT/2024/2', '00000002', '2024-12-01 07:08:00', 'waiting_approval');

CREATE SEQUENCE attendance_id_seq START 1;