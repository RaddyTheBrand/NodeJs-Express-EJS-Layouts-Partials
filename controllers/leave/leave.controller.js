const { hrisPool: pool } = require("../../db/connection");

const {
    getLeaveQuery,
    createLeaveQuery,
    updateLeaveQuery
} = require('./leave.queries')

const getLeave = async (req, res) => {
    try {
        let leaves = []
        if (req.is_atasan){
            const rawNiks = await pool.query('SELECT nik from employee')
            const allNik = []
            rawNiks.rows.map(function(data){
                allNik.push(data.nik)
            })

            leaves = await pool.query(getLeaveQuery, [allNik])
        } else {
            leaves = await pool.query(getLeaveQuery, [req.nik])
        }
        res.json({'result': leaves.rows})
    } catch (error) {
        console.log(error)
        res.statusCode = 400
        res.json({'result': error})  
    }
}

const createLeave = async (req, res) => {
    
    try {
        const startDate = req.body.startDate
        const endDate = req.body.endDate
        const leaveType = req.body.leaveType


        if(startDate && endDate){
            const isValidStartDate = new Date(startDate)
            const isValidEndDate = new Date(endDate)
        } else {
            throw 'Invalid start & end date'
        }
        if (!['ijin', 'sakit'].includes(leaveType)){
            throw 'Invalid leave type'
        }
        
        const isLeaveExist = await pool.query('select id from leave where start_date <= $1 and end_date >= $2 and nik = $3', [endDate, startDate])
        
        if (isLeaveExist.rowCount > 0) {
            throw 'Ada dokumen ijin yang overlap'
        }

        const currentTime = new Date()

        const nik = req.nik

        const leaveId = await pool.query(createLeaveQuery, [nik, startDate, endDate, leaveType, 'waiting'])

        const documentNumber = `IJIN/${currentTime.getFullYear()}/${leaveId.rows[0].id}`

        await pool.query(`UPDATE leave set document_number = '${documentNumber}' where id = ${leaveId.rows[0].id}`)

        res.statusCode = 200
        res.json({'result': {'message': 'Ijin berhasil diajukan', 'id':leaveId.rows[0].id }})  
    
    } catch (error) {
        console.log(error)
        res.statusCode = 400
        res.json({'result': error})  
    }
}

const approvalLeave = async (req , res) => {
    try {
        const leaveId = req.body.id
        const status = req.body.status

        const isLeaveExist = await pool.query('select status from leave where id = $1', [leaveId])

        if (isLeaveExist.rowCount == 0){
            throw 'Ijin tidak ditemukan'
        }

        if (isLeaveExist.rows[0].status !== 'waiting'){
            throw 'Tidak dapat approve / reject dokumen yang belum pending'
        }

        if (status === 'approve' || 'reject'){
            await pool.query(updateLeaveQuery, [status, leaveId])
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
    getLeave,
    createLeave,
    approvalLeave
}