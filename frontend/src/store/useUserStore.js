import { create } from "zustand"
import axios from "../lib/axios"
import{ toast } from 'react-hot-toast'

export const useUserStore = create((set,get) => ({
    user: null,
    loading: false,
    checingAuth: true,

    signup: async (formData) => {
        set({ loading: true })
        const {name, email, password, confirmPassword} = formData

        if(password !== confirmPassword){
            return toast.error("Passwords do not Match")
        }

        try{
            const res = await axios.post("/auth/signup",{
                name,email,password
            })
            set({ user: res.data, loading: false })
        }catch(error){
            set({ loading: false })
            toast.error(error.response.data.message || "An error occured")
        }
    },

    login: async (email, password) => {
        set({ loading: true })
        try{
            const res = await axios.post("/auth/login",{ email, password })
            set({ user:res.data, loading: false })
        }catch(error){
            set({ loading: false })
            toast.error(error.response.data.message || "An error occurred")
        }
    },

    checkAuth: async () => {
        set({ checkingAuth: true })
        try{
            const response = await axios.get("/auth/profile")
            set({ user: response.data, checkingAuth: false })
        }catch{
            set({ checkingAuth: false, user: null })
        }
    },
    
    logout: async () => {
        try{
            await axios.post("/auth/logout")
            set({ user:null })
        }catch(error){
            toast.error(error.response?.data?.message || "Error during logout")
        }
    },
    refreshtoken: async () => {},

}))