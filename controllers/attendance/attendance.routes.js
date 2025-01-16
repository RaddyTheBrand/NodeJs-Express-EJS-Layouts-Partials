const express = require("express")
const router = express.Router()

// const multer  = require('multer')
// const upload = multer({ dest: 'uploads/' })

const controller = require("./attendance.controller")

router.get('/', controller.getAttendance)
router.post('/', controller.createAttendance)
router.patch('/', controller.approvalAttendance)
router.post('/upload', controller.postAttachment)


module.exports = router