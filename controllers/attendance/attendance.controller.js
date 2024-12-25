
const { hrisPool: pool } = require("../../db/connection");
const { 
    getAttendanceQuery, createAttendanceQuery, createAttachmentQuery, updateAttendanceQuery
} = require("./attendance.queries")

const getAttendance = async (req, res) => {
    try {
        // Check if atasan
        const attendances = await pool.query(getAttendanceQuery, ['00000001'])
        res.json({'result': attendances.rows})
    } catch (error) {
        console.log(error)
        res.statusCode = 400
        res.json({'result': error})  
    }
}

const createAttendance = async(req, res) => {
    try {
        const nik = req.nik 
        const binary = req.body.binary

        const attachment = await pool.query(createAttachmentQuery, [1, 'a.jpeg', binary])
        
        const currentTime = new Date()
        
        await pool.query(createAttendance, ['2024/01', nik, currentTime, attachment.rows[0].id,'waiting'])
        
        res.statusCode = 200
        res.json({'result': 'Absen berhasil diajukan'})  
    
    } catch (error) {
        console.log(error)
        res.statusCode = 400
        res.json({'result': error})  
    }
}

const approvalAttendance = async(req, res) => {
    try {
        const attendanceId = req.params.id
        const state = req.query.state
        if (state === 'approve' || 'reject'){
            await pool.query(updateAttendanceQuery, [attendanceId, state])
        }
    } catch (error) {
        console.log(error)
        res.statusCode = 400
        res.json({'result': error})  
    }
}

module.exports = {
    getAttendance,
    createAttendance,
    approvalAttendance
}