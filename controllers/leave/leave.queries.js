const getLeaveQuery = `
    SELECT 
        document_number,
        employee_nik,
        TO_CHAR(start_date, 'dd/mm/yyyy') as start_date,
        TO_CHAR(end_date, 'dd/mm/yyyy') as end_date,
        type,
        status
    FROM leave where employee_nik = ANY ($1) order by start_date desc
`


const createLeaveQuery = `
    INSERT into leave 
    (employee_nik, start_date, end_date, type, status)
    VALUES
    ($1, $2, $3, $4, $5)
    returning id
`

const updateLeaveQuery = `
    UPDATE leave set status = $1 where id = $2
`

module.exports = {
    getLeaveQuery,
    createLeaveQuery,
    updateLeaveQuery
}