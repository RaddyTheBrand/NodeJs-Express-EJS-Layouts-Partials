const { hrisPool: pool } = require("../../db/connection");

const {
    getLeaveQuery, createLeaveQuery, updateLeaveQuery,
    getLeaveDetailQuery
} = require('./leave.queries')

const getLeave = async (req, res) => {
    try {
        const rawLeaves = await pool.query(getLeaveQuery, [[req.nik]])
        const leaves = renderLeaves(rawLeaves.rows)
        res.json({'result': leaves})
    } catch (error) {
        console.log(error)
        res.statusCode = 400
        res.json({'result': error})  
    }
}

const getLeaveManagers = async(req, res) => {
    try {
        if (!req.is_atasan){
            throw ('Anda tidak diperbolehkan untuk akses menu ini!.')    
        }
        const rawNiks = await pool.query('SELECT nik from employee')
        const allNik = []
        rawNiks.rows.map(function(data){
            allNik.push(data.nik)
        })
        let filteredQuery = getLeaveQuery
        filteredQuery += " and status = 'waiting' order by l.start_date desc"
        const rawLeaves = await pool.query(filteredQuery, [[allNik]])
        console.log(rawLeaves.rows)
        const leaves = renderLeaves(rawLeaves.rows)
        res.json({'result': leaves})
    } catch (error) {
        console.log(error)
        res.statusCode = 400
        res.json({'result': error})  
    }
}

const getLeaveDetail = async(req, res) =>{
    try{
        const leaveId = req.params.id
        const rawLeaveDetail = await pool.query(getLeaveDetailQuery, [leaveId])
        const leaveDetail = renderLeaveDetail(rawLeaveDetail.rows[0])
        res.json({'result': leaveDetail})
        
    } catch (error) {
        console.log(error)
        res.statusCode = 400
        res.json({'result': error})  
    }
}

function renderLeaves(rawLeaves){
    const leaves = []
    for (const leave of rawLeaves){
        leaves.push({
            'Id': leave.id,
            'DocumentNumber': leave.document_number,
            'EmployeeNik': leave.employee_nik,
            'StartDate': leave.start_date,
            'EndDate': leave.end_date,
            "EmployeeName": leave.name,
            'Status': leave.status
        })
    }
    return leaves
}

function renderLeaveDetail(rawLeaveDetail){
    return {
        'Id': rawLeaveDetail.id,
        'DocumentNumber': rawLeaveDetail.document_number,
        'EmployeeNik': rawLeaveDetail.employee_nik,
        'StartDate': rawLeaveDetail.start_date,
        'EndDate': rawLeaveDetail.end_date,
        'EmployeeName': rawLeaveDetail.name,
        'Notes': rawLeaveDetail.notes || '',
        'Status': rawLeaveDetail.status,
        'Type': rawLeaveDetail.type,
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
    getLeaveManagers,
    getLeaveDetail,
    createLeave,
    approvalLeave
}