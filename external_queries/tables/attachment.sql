-- Table Definition
CREATE TABLE if not exists public.attachment (
    id integer DEFAULT nextval('attachment_id_seq'),
    base64_data bytea, 
    name varchar,
    PRIMARY KEY ("id")
);

CREATE SEQUENCE attachment_id_seq START 1;