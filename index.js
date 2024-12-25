// Imports
require("dotenv").config();
const express = require('express')

const app = express()

const attendanceRoutes = require('./controllers/attendance/attendance.routes')
app.use('/hris', attendanceRoutes)

const port = 5000

// Listen on Port 5000
app.listen(port, () => console.info(`App listening on port ${port}`))