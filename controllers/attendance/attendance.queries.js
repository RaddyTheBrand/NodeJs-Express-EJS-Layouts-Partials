const getAttendanceQuery = `
    SELECT 
        id,
        document_number,
        employee_nik,
        TO_CHAR(datetime, 'dd/mm/yyyy HH24:MI:SS') as datetime,
        geolocation,
        notes,
        initcap(status) as status
    FROM attendance where employee_nik = ANY ($1)
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
    ($1, decode($2, 'base64'))
    returning id
`

const updateAttendanceQuery = `
    UPDATE attendance set status = $1 where id = $2
`

module.exports = {
    getAttendanceQuery, createAttendanceQuery, createAttachmentQuery, 
    updateAttendanceQuery
}