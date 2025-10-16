import User from '../models/user.model.js'

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

        res.status(201).json({ user, message: "User created successfully" })
        
    }catch(error){
        res.status(500).json({ message: "Internal server Error" })
    }
    
}

export const login = async (req,res) => {
    res.send("Login route called")
}

export const logout = async (req,res) => {
    res.send("Logout route called")
}