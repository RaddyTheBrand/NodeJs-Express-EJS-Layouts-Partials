const express = require("express")
const router = express.Router()

// const multer  = require('multer')
// const upload = multer({ dest: 'uploads/' })

const controller = require("./attendance.controller")

router.get('/u1', controller.getAttendance)
router.get('/u2', controller.getAttendanceManagers)
// router.get('/u2', controller.getAttendanceDetail)
router.post('/', controller.createAttendance)
router.patch('/', controller.approvalAttendance)

module.exports = router