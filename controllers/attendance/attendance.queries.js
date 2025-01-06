const getAttendanceQuery = `
    SELECT 
        document_number,
        employee_nik,
        TO_CHAR(datetime, 'dd/mm/yyyy HH24:MI:SS')
    FROM attendance where employee_nik = ANY ($1) order by datetime desc
`

const createAttendanceQuery = `
    INSERT into attendance 
    (employee_nik, datetime, status, attachment_id)
    VALUES
    ($1, $2, $3, $4)
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