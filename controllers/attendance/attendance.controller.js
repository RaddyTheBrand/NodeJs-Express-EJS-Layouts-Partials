const fs = require('node:fs');

const { hrisPool: pool } = require("../../db/connection");
const { 
    getAttendanceQuery, createAttendanceQuery, createAttachmentQuery, 
    updateAttendanceQuery, getAttendanceDetailQuery, getAttachmentQuery
} = require("./attendance.queries");
const { render } = require('ejs');

const getAttendance = async (req, res) => {
    try {
        let filteredQuery = getAttendanceQuery
        filteredQuery += ' order by datetime desc'
        const rawAttendances = await pool.query(getAttendanceQuery, [[req.nik]])
        const attendances = renderAttendances(rawAttendances.rows)
        res.json({'result': attendances})
    } catch (error) {
        console.log(error)
        res.statusCode = 400
        res.json({'result': error})  
    }
}

const getAttendanceManagers = async (req, res) => {
    try {
        if (!req.is_atasan){
            throw ('Anda tidak diperbolehkan untuk akses menu ini!.')    
        }
        const rawNiks = await pool.query('SELECT nik from employee')
        const allNik = []
        rawNiks.rows.map(function(data){
            allNik.push(data.nik)
        })
        let filteredQuery = getAttendanceQuery
        filteredQuery += " and status = 'waiting' order by datetime desc"
        const rawAttendances = await pool.query(filteredQuery, [[allNik]])
        const attendances = renderAttendances(rawAttendances.rows)
        res.json({'result': attendances})
    } catch (error) {
        console.log(error)
        res.statusCode = 400
        res.json({'result': error})  
    }
    
}

const getAttendanceDetail = async (req, res) => {
    try{
        
        const attendanceId = req.params.id
        const rawAttendanceDetail = await pool.query(getAttendanceDetailQuery, [attendanceId])
        const rawAttachment = await pool.query(getAttachmentQuery, [rawAttendanceDetail.rows[0].attachment_id])
        const attendanceDetail = renderAttendanceDetail(rawAttendanceDetail.rows[0], rawAttachment.rows[0])
        res.json({'result': attendanceDetail})
        
    } catch (error) {
        console.log(error)
        res.statusCode = 400
        res.json({'result': error})  
    }
}

function renderAttendances(rawAttendances){
    const attendances = []
    for (const attendance of rawAttendances){
        attendances.push({
            'Id': attendance.id,
            'EmployeeName': attendance.name,
            'DocumentNumber': attendance.document_number,
            'EmployeeNik': attendance.employee_nik,
            'Datetime': attendance.datetime,
            'Status': attendance.status
        })
    }
    return attendances
}

function renderAttendanceDetail(rawAttendanceDetail, attachment){
    return {
        'Id': rawAttendanceDetail.id,
        'DocumentNumber': rawAttendanceDetail.document_number,
        'EmployeeNik': rawAttendanceDetail.employee_nik,
        'EmployeeName': rawAttendanceDetail.name,
        'Datetime': rawAttendanceDetail.datetime,
        'Geolocation': rawAttendanceDetail.geolocation || '',
        'Notes': rawAttendanceDetail.notes || '',
        'Attachment': attachment.base64_data || '',
        'Status': rawAttendanceDetail.status
    }
}

const createAttendance = async(req, res) => {

    try {
        const attachment = req.body.attachment || false
        const geolocation = req.body.geolocation || false
        const notes = req.body.notes || false

        if (!geolocation){
            throw ('Lokasi anda tidak valid. Mohon untuk coba ajukan absensi lagi')
        }

        if (!notes){
            throw ('Mohon diisi notes terlebih dahulu')
        }

        const attachmentId = await pool.query(createAttachmentQuery, ['-', attachment])

        const currentTime = new Date()
        const nik = req.nik

        if (attachmentId){
            const attendanceId = await pool.query(createAttendanceQuery, [nik, currentTime, 'waiting', attachmentId.rows[0].id, geolocation, notes])
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
            throw 'Absensi tidak ditemukan'
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
    getAttendanceManagers,
    getAttendanceDetail
}