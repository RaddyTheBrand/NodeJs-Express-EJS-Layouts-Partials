
const { hrisPool: pool } = require("../../db/connection");
const { 
    loginQuery
} = require("./employee.queries")

const login = async (req, res) => {
    try {
        const username = req.body.username
        const password = req.body.password
        const isLoginValid = await pool.query(loginQuery, [username, password])
        if (isLoginValid.rowCount == 0){
            throw 'Invalid Username and / or password'
        }
        const result = {
            'isAtasan': isLoginValid.rows[0].is_atasan,
            'isHr': isLoginValid.rows[0].is_hr,
            'nik': isLoginValid.rows[0].nik,
            'name': isLoginValid.rows[0].name
        }
        res.statusCode = 200
        res.json({'result': result})
    } catch (error) {
        console.log(error)
        res.statusCode = 400
        res.json({'result': error})  
    }
}
module.exports = {
    login
}