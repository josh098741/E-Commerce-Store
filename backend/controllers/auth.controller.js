import { redis } from '../lib/redis.js'
import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'

const generateToken = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET,{
        expiresIn: "15m",
    })

    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET,{
        expiresIn: "7d",
    })

    return {accessToken, refreshToken}
}

const storeRefreshToken = async (userId,refreshToken) => {
    await redis.set(`refresh_token: ${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60)
}

const setCookies = (res,accessToken,refreshToken) => {

    res.cookie("accessToken", accessToken, {
        httpOnly: true, // prevent XSS attacks, cross site scripting
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", // prevents CSRF attack cross-site request forgery
        maxAge: 15 * 60 * 1000 //15 minutes
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

}

export const signup =  async (req,res) => {
    try{
        const {email,password,name} = req.body
         
        if(!email || !password || !name){
            return res.status(400).json({ message: "All input fields are required" })
        }

        const userExists = await User.findOne({ email })

        if(userExists){
            return res.status(400).json({message: "User Already exists"})
        }

        const user = await User.create({
            name,
            email,
            password
        })

        //Authentication
        const {accessToken, refreshToken} = generateToken(user._id)
        await storeRefreshToken(user._id,refreshToken)

        setCookies(res, accessToken, refreshToken)

        res.status(201).json({ user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }, message: "User created successfully" })

    }catch(error){
        console.log("Error in signup controller : ", error.message)
        res.status(500).json({ message: "Internal server Error" })
    }
    
}

export const login = async (req,res) => {
    try{
        const { email, password } = req.body

        const user = await User.findOne({ email })

        if(user && (await user.comparePassword(password))){

            const { accessToken, refreshToken } = generateToken(user._id)

            await storeRefreshToken(user._id, refreshToken)

            setCookies(res,accessToken,refreshToken)

            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            })
        } else {
            res.status(401).json({ message: 'Invalid email or password' })
        }
    }catch(error){
        console.log("Error in Login controller : ", error.message)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const logout = async (req,res) => {
    try{
        const refreshToken = req.cookies.refreshToken

        if(refreshToken){
            const decoded = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET)
            await redis.del(`refresh_token: ${decoded.userId}`)
        }

        res.clearCookie("accessToken")

        res.clearCookie("refreshToken")

        res.status(200).json({ message: "Logged out Successfully" })
    }catch(error){
        console.log("Error in logout controller : ", error.message)
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}

//this will recreate the access token
export const refreshToken = async (req,res) => {
    try{
        const refreshToken = req.cookies.refreshToken

        if(!refreshToken){
            return res.status(401).json({ message: "No refresh Token Provided" })
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

        const storedToken = await redis.get(`refresh_token: ${decoded.userId}`)

        if(storedToken !== refreshToken){
            return res.status(401).json({ message: "Invalid refresh Token" })
        }

        const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "15m"
        })

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        })

        res.status(200).json({ message: "Access Token re created successfully" })
    }catch(error){
        console.log("Error in the refresh Token",error.message)
        res.status(500).json({ message: "Internal Server Error",error: error.message })
    }
}