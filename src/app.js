const express = require("express")
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/auth.routes')

const app = express()

app.get('/', (req, res) => {
    res.send('Helloooooo')
})

app.use(express.json()) // to read json data coming from postman / frontend
app.use(cookieParser())

app.use('/auth', authRoutes)

module.exports = app