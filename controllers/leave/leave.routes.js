const express = require("express")
const router = express.Router()

const controller = require("./leave.controller")

router.get('/u1', controller.getLeave)
router.get('/u2', controller.getLeaveManagers)
router.get('/:id', controller.getLeaveDetail)
router.post('/', controller.createLeave)
router.patch('/', controller.approvalLeave)

module.exports = router