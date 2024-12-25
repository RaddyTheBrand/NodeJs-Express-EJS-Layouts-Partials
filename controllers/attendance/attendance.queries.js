const getAttendanceQuery = `
    SELECT 
        document_number,
        employee_nik,
        TO_CHAR(datetime, 'dd/mm/yyyy HH24:MI:SS')
    FROM attendance where employee_nik in ($1) order by datetime desc
`

const createAttendanceQuery = `
    INSERT into attendance 
    (document_number, employee_nik, datetime, state)
    VALUES
    ($1, $2, $3, $4)
    RETURNING ID
`

const createAttachmentQuery = `
    INSERT into attachment
    (id, name, binary)
    VALUES 
    ($1, $2, $3)
`

const updateAttendanceQuery = `
    UPDATE attendance set state = $1 where id = $2
`

module.exports = {
    getAttendanceQuery, createAttendanceQuery, createAttachmentQuery, updateAttendanceQuery
}