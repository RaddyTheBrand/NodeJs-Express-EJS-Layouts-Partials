const { hrisPool: pool } = require("./db/connection");

const authAndOtorization = async (req, res, next) => {
    try{
        console.log('??', req.headers.nik)
        const isNikExist = await pool.query('SELECT nik, is_atasan from employee where nik = $1', [req.headers.nik])
        if (isNikExist.rowCount == 0 ){
            throw 'Tidak ditemukan data karyawan!'
        }
        req.nik = req.headers.nik
        req.is_atasan = isNikExist.rows[0].is_atasan
        next()
    } catch(error){
        console.log(error)
        res.statusCode = 401
        res.json({'result': error})  
    }
};

module.exports = {authAndOtorization}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   