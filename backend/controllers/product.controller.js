import cloudinary from "../lib/cloudinary.js"
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

export const createProduct = async (req,res) => {
    try{
        const { name, description, price, image, category } = req.body

        let cloudinaryResponse = null

        if(image){
            cloudinaryResponse = await cloudinary.uploader.upload(image, {folder: "products"})
        }

        const product = await Product.create({
            name,
            description,
            price,
            image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
            category
        })

        res.status(201).json( product )
    }catch(error){
        console.log("Error in createProduct controller", error.message)
        res.status(500).json({ message: "Internal Server error",error: error.message })
    }
}

export const deleteProduct = async (req,res) => {
    try{
        const product = await Product.findById(req.params.id)

        if(!product){
            return res.status(404).json({ message: "Product not found" })
        }

        if(product.image){
            const publicId = product.image.split("/").pop().split(".")[0] //This will get the id of the image so that we can delete it

            try{
                await cloudinary.uploader.destroy(`products/${publicId}`)
                console.log("deleted the image from cloudinary")
            }catch(error){
                console.log("Error in deleting the image from cloudinary", error)
            }
        }

        await Product.findByIdAndDelete(req.params.id)

        res.status(200).json({ message: "Product deleted successfully" })
    }catch(error){
        console.log("Error in deleting product controller", error.message)
        res.status(500).json({ message: "Internal server error", error: error.message })
    }
}

export const getRecommendedProducts = async (req,res) => {
    try{
        const products = await Product.aggregate([
            {
                $sample: {size:3}
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    image: 1,
                    price: 1
                }
            }
        ])
        res.status(200).json(products)
    }catch(error){
        console.log("Error in getRecommendation controller", error.message)
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}

export const getProductsByCategory = async (req,res) => {
    const {category} = req.params
    try{
        const products = await Product.find({ category })
        res.status(200).json(products)
    }catch(error){
        console.log("Error in get Products by category controller", error.message)
        res.status(500).json({ message: "Internal server error", error : error.message })
    }
}

export const toggleFeaturedProduct = async (req,res) => {
    try{
        const product = await Product.findById(req.params.id)
        if(product){
            product.isFeatured = !product.isFeatured
            const updatedProduct = await product.save();
            // update the cache
            await updateFeaturedProductsCache();
            res.json(updatedProduct)
        }else{
            res.status(404).json({ message: "Product Not Found" })
        }

    }catch(error){
        console.log("Error in toggleFeatureProduct controller", error.message)
        res.status(500).json({ message: "Internal server error", error: error.message})
    }
}

async function updateFeaturedProductsCache(){
    try{
        //The Lean() method is used to return plain javaScript objects instead of full Mongoose documents.
        //This can significantly improve perfomance

        const featuredProducts = await Product.find({ isFeatured:true }).lean();
        await redis.set("featured_products",JSON.stringify(featuredProducts))
    }catch(error){
        console.log("Error in Update cache function")
    }
}