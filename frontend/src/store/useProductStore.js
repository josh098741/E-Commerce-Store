import { create } from "zustand";
import toast from 'react-hot-toast';
import axios from "../lib/axios";

export const useProductStore = create((set) => ({
    products: [],
    loading: false,

    setProducts: (products) => set({ products }),

    createProduct: async (productData) => {
        set({ loading:true })
        try{
            const res = await axios.post("/products",productData)
            set((prevState) => ({
                products: [...prevState.products, res.data],
                loading: false
            }))
            toast.success("Product created Successfully")
        }catch(error){
            toast.error(error?.response?.data?.error || "Something went Wrong")
            set({ loading: false })
        }
    },

    fetchAllProducts: async () => {
        set({ loading: true })
        try{
            const response = await axios.get("/products")
            set({ products: response.data.products, loading: false })
        }catch(error){
            toast.error(error?.response?.data?.error || "Something went wrong in fetching")
            set({ error: "Failed to fetch products", loading: false })
        }
    },

    fetchProductsByCategory: async (category) => {
        set({ loading:true })
        try{
            const response = await axios.get(`/products/category/${category}`)
            set({ products: response.data.products, loading: false })
        }catch(error){
            set({ error: "Failed to fetch products",loading: false })
            toast.error(error.response.data.error || "Failed to fetch products")
        }
    },

    deleteProduct: async (productId) => {
        set({ loading: false })
        try{
            await axios.delete(`/products/${productId}`)
            set((prevProducts) => ({
                products: prevProducts.products.filter((product) =>
                    product._id !== productId
                ),
                loading: false
            }))
        }catch(error){
            set({ loading: false })
            toast.error(error.response.data.error || "Failed to delete Product")
        }
    },

    toggleFeaturedProduct: async (productId) => {
        set({ loading: true })
        try{
            const response = await axios.patch(`/products/${productId}`)

            //This will update the is Featured property of the product in the store
            set((prevProducts) => ({
                products: prevProducts.products.map((product) => 
                    product._id === productId ? {...product, isFeatured: response.data.isFeatured} : product
                ),
                loading: false
            }))
        }catch(error){
            set({ loading: false })
            toast.error(error?.response?.data?.error || "Failed to update product")
        }
    },

    fetchFeaturedProducts: async () => {
        set({ loading: true })
        try{
            const response = await axios.get("/products/featured")
            set({ products: response.data,loading: false })
        }catch(error){
            console.log("Error fetching featured products:", error)
            set({ error: "Failed to fetch products",loading: false })
        }
    }
    
}))