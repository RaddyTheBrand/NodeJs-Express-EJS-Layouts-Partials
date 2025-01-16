-- Table Definition
CREATE SEQUENCE attachment_id_seq START 1;

CREATE TABLE if not exists public.attachment (
    id integer DEFAULT nextval('attachment_id_seq'),
    base64_data bytea, 
    name varchar,
    PRIMARY KEY ("id")
);
