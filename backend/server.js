import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import cors from 'cors'

import authRoutes from './routes/auth.route.js'
import productRoutes from './routes/product.route.js'
import cartRoutes from './routes/cart.route.js'
import couponRoutes from './routes/coupon.route.js'
import paymentRoutes from './routes/payment.route.js'
import analyticsRoutes from './routes/analytics.route.js'

import { connectDB } from './lib/db.js';

dotenv.config();

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json({limit:"10mb"})) // Allows you to parse the body of the request
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/coupons", couponRoutes)
app.use("/api/payments", paymentRoutes)
app.use("/api/analytics", analyticsRoutes)

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