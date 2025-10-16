import { redis } from "../lib/redis.js"
import Product from "../models/product.model.js"

export const getAllProducts = async (req,res) => {
    try{

        const products = await Product.find({})//find all products
        res.status(200).json({ products })

    }catch(error){
        console.log("Error in get All products controller", error.message)
        res.status(500).json({ message: "Internal server Error", error: error.message })
    }
}

export const getFeaturedProducts = async (req,res) => {
    try{

        let featuredProducts =  await redis.get("featured_products")

        if(featuredProducts){
            return res.status(200).json(JSON.parse(featuredProducts))
        }

        //if not in redis we should fetch it from mongo db
        //.lean() is gonna return a plain javaScript object instead of a mongo db document which speeds perfomance
        featuredProducts = await Product.find({ isFeatured:true }).lean()

        if(!featuredProducts){
            return res.status(404).json({ message: "No Featured products found" })
        }

        //Store in redis for future quick access
        await redis.set("featured_products", JSON.stringify(featuredProducts))

        res.status(200).json({ featuredProducts })
    }catch(error){
        console.log("Error in the get Featured Products controller", error.message)
        res.status(500).json({message: "Internal Server Error"})
    }
}