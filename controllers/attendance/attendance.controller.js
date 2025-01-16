const fs = require('node:fs');

const { hrisPool: pool } = require("../../db/connection");
const { 
    getAttendanceQuery, createAttendanceQuery, createAttachmentQuery, updateAttendanceQuery,
} = require("./attendance.queries")

const getAttendance = async (req, res) => {
    try {
        let attendances = []
        if (req.is_atasan){
            const rawNiks = await pool.query('SELECT nik from employee')
            const allNik = []
            rawNiks.rows.map(function(data){
                allNik.push(data.nik)
            })
            attendances = await pool.query(getAttendanceQuery, [allNik])
        } else {
            attendances = await pool.query(getAttendanceQuery, [req.nik])
        }
        res.json({'result': attendances.rows})
    } catch (error) {
        console.log(error)
        res.statusCode = 400
        res.json({'result': error})  
    }
}

const postAttachment = async (req, res) => {

    try {
        const attachment = req.body.attachment

        const attachmentId = await pool.query(createAttachmentQuery, ['-', attachment])
        result['id'] = attachmentId.rows[0].id
        result['attachment'] = attachment

        res.json({'result': result})
    } catch (error) {
        console.log(error)
        res.statusCode = 400
        res.json({'result': error})  
    }   
}

const createAttendance = async(req, res) => {

    try {
        const attachmentId = req.body.attachmentId || null ;
    
        const currentTime = new Date()
        const nik = req.nik
        const isAttachmentExist = await pool.query('select id from attachment where id = $1', [attachmentId])
        if (isAttachmentExist.rowCount > 0){
            const attendanceId = await pool.query(createAttendanceQuery, [nik, currentTime, 'waiting', attachmentId])
            console.log(attendanceId.rows[0].id)
            const documentNumber = `ATT/${currentTime.getFullYear()}/${attendanceId.rows[0].id}`
            await pool.query(`UPDATE attendance set document_number = '${documentNumber}' where id = ${attendanceId.rows[0].id}`)
            res.statusCode = 200
            return res.json({'result': {'message': 'Absen berhasil diajukan', 'id':attendanceId.rows[0].id }})  
        } else {
            throw ('Lampiran gambar tidak valid. Mohon diajukan ulang!')    
        }
    } catch (error) {
        console.log(error)
        res.statusCode = 400
        res.json({'result': error})  
    }
}

const approvalAttendance = async(req, res) => {
    try {
        const attendanceId = req.body.id
        const status = req.body.status

        const isAttendanceExist = await pool.query('select status from attendance where id = $1', [attendanceId])

        if (isAttendanceExist.rowCount == 0){
            throw 'Ijin tidak ditemukan'
        }
        
        if (isAttendanceExist.rows[0].status !== 'waiting'){
            throw 'Tidak dapat approve / reject dokumen yang belum pending'
        }

        if (status === 'approve' || 'reject'){
            await pool.query(updateAttendanceQuery, [status, attendanceId])
        }
        else{
            throw 'Invalid request'
        }
        if (status === 'approve'){
            res.json({'result': 'Dokumen berhasil di approve'})
            res.statusCode = 200
        } else if ( status === 'reject') {
            res.json({'result': 'Dokumen berhasil di reject'})
            res.statusCode = 200
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
    approvalAttendance,
    postAttachment
}