const getLeaveQuery = `
    SELECT
        l.id,
        l.document_number,
        l.employee_nik,
        e.name,
        TO_CHAR(l.start_date, 'dd/mm/yyyy') as start_date,
        TO_CHAR(l.end_date, 'dd/mm/yyyy') as end_date,
        initcap(l.type) as type,
        initcap(l.status) as status
    FROM leave l join employee e on l.employee_nik = e.nik where l.employee_nik = ANY ($1)
`

const getLeaveDetailQuery = `
    SELECT
        l.id,
        l.document_number,
        l.employee_nik,
        e.name,
        TO_CHAR(l.start_date, 'dd/mm/yyyy') as start_date,
        TO_CHAR(l.end_date, 'dd/mm/yyyy') as end_date,
        initcap(l.type) as type,
        initcap(l.status) as status,
        l.notes
    FROM leave l join employee e on l.employee_nik = e.nik where l.id = $1
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
    getLeaveDetailQuery,
    createLeaveQuery,
    updateLeaveQuery
}