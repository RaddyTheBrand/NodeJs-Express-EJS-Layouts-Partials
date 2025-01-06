const loginQuery = `
    SELECT nik, is_atasan, is_hr from employee where name = $1 and password = $2
`

module.exports = {
    loginQuery
}