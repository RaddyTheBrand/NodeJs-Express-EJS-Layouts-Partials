// Imports
require("dotenv").config();
const express = require('express')

const bodyParser = require("body-parser")
const app = express()

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const attendanceRoutes = require('./controllers/attendance/attendance.routes')
const employeeRoutes = require('./controllers/employee/employee.routes')
const leaveRoutes = require('./controllers/leave/leave.routes')

const { authAndOtorization } = require('./auth.middleware')

app.get("/", (req, res) => {
    res.send({
        "message": "Hello! This is our HRIS Application APIss",
    });
});

app.use('/hris/v1/employee', employeeRoutes)

app.use(authAndOtorization)

app.use('/hris/v1/attendance', attendanceRoutes)
app.use('/hris/v1/leave', leaveRoutes)

const port = 5000

// Listen on Port 5000

app.listen(port, () => console.info(`App listening on port ${port}`))