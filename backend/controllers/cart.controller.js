

export const getCartProducts = async (req,res) => {}

export const addToCart = async (req,res) => {
    try{
        const { productId } = req.body

        const user = req.user

        const existingItem = user.cartItems.find( item => item.id === productId)

        if(existingItem){
            existingItem.quantity += 1
        }else{
            user.cartItems.push(productId)
        }

        await user.save()

        res.status(200).json(user.cartItems)
    }catch(error){

        console.log("Error in Add To Cart Controller", error.message)

        res.status(500).json({ message: "Internal Server error", error: error.message })
    }
}

export const removeAllFromCart = async (req,res) => {
    try{
        const { productId } = req.body

        const user = req.user

        if(!productId){
            user.cartItems = []
        }else{
            user.cartItems = user.cartItems.filter((item) => item.id !== productId)
        }

        await user.save();

        res.status(200).json(user.cartItems)
    }catch(error){
        res.status(500).json({ message: "Internal server error",error: error.message })
    }
}

export const updateQuantity = async (req,res) => {
    try{
        const { id:productId } = req.params

        const { quantity } = req.body

        const user = req.user

        const existingItem = user.cartItems.find(item => item.id === productId)

        if(existingItem){
            if(quantity === 0){
                user.cartItems = user.cartItems.filter((item) => item.id !== productId)
                await user.save()
                return res.status(200).json(user.cartItems)
            }
            existingItem.quantity = quantity
            await user.save()
            res.status(200).json(user.cartItems)
        }else{
            res.status(404).json({ message: "Product Not Found" })
        }

    }catch(error){
        console.log("Error in update quantity controller",error.message)
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}