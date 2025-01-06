const express = require("express")
const router = express.Router()

const controller = require("./leave.controller")

router.get('/', controller.getLeave)
router.post('/', controller.createLeave)
router.patch('/', controller.approvalLeave)

module.exports = router