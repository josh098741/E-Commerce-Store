import express from 'express'
import dotenv from 'dotenv'

import authRoutes from './routes/auth.route.js'
import { connectDB } from './lib/db.js';

dotenv.config();

const app = express()
const PORT = process.env.PORT || 5000

app.use("/api/auth",authRoutes)

const start = async () => {
    try{
        await connectDB()
        app.listen(PORT, () => {
            console.log("Server is running on http://localhost:" + PORT)
        }) 
    }catch(error){
        console.log("Failed to connect to the server")
    }
}

start()