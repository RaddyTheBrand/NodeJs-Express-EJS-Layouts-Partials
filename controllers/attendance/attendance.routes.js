const express = require("express")
const router = express.Router()

const controller = require("./attendance.controller")

router.get('/v1/attendance', controller.getAttendance)
router.post('/v1/attendance', controller.createAttendance)
router.patch('/v1/attendance', controller.approvalAttendance)


module.exports = router