//Imports
import dotenv from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose'
import express from 'express'
import Routes from './routes/LeagueRoutes.js'
dotenv.config()

//Setting up express server

const app = express()

//Initializing database
mongoose.connect(process.env.DB_ACCESS, () => console.log('DB connected'))

app.use(express.json())
app.use(cors())

//Routes

app.use('/', Routes)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))