const express = require("express")
const router = express.Router()

const controller = require("./employee.controller")

router.post('/login', controller.login)

module.exports = router