//Imports
require('dotenv').config()
const cors = require('cors')
const mongoose = require('mongoose')

//Setting up express server
const express = require('express')
const app = express()

//Initializing database
mongoose.connect(process.env.DB_ACCESS, () => console.log('DB connected'))

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send('hi')
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))