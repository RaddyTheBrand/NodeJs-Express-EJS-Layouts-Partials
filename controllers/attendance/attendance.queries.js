const getAttendanceQuery = `
    SELECT 
        a.id,
        e.name,
        a.document_number,
        a.employee_nik,
        TO_CHAR(a.datetime, 'dd/mm/yyyy HH24:MI:SS') as datetime,
        initcap(a.status) as status
    FROM attendance a JOIN employee e on a.employee_nik = e.nik
    where a.employee_nik = ANY ($1)
`

const getAttachmentQuery = `
    select base64_data from attachment where id = $1
`

 const getAttendanceDetailQuery = `
    SELECT 
        a.id,
        a.document_number,
        a.employee_nik,
        e.name,
        TO_CHAR(a.datetime, 'dd/mm/yyyy HH24:MI:SS') as datetime,
        initcap(a.status) as status,
        a.geolocation,
        a.notes,
        a.attachment_id
    FROM attendance a
    JOIN employee e on a.employee_nik = e.nik 
    where a.id = $1
 `

const createAttendanceQuery = `
    INSERT into attendance 
    (employee_nik, datetime, status, attachment_id, geolocation, notes)
    VALUES
    ($1, $2, $3, $4, $5, $6)
    returning id
`

const createAttachmentQuery = `
    INSERT into attachment
    (name, base64_data)
    VALUES 
    ($1, $2)
    returning id
`

const updateAttendanceQuery = `
    UPDATE attendance set status = $1 where id = $2
`

module.exports = {
    getAttendanceQuery, createAttendanceQuery, createAttachmentQuery, 
    updateAttendanceQuery, getAttachmentQuery, getAttendanceDetailQuery
}