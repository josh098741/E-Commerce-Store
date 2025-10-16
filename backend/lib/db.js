import mongoose from 'mongoose'

export const connectDB = async (req,res) => {
    try{
        const connection = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Mongo DB conneected successfully: ${connection.connection.host}`)
    }catch(error){
        console.error("Error in connecting to the database",error.message)
        process.exit(1)
    }
}