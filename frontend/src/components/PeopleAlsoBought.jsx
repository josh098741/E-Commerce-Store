import axios from "../lib/axios"
import LoadingSpinner from "./LoadingSinner"
import ProductCard from "./ProductCard"
import React,{ useState, useEffect } from 'react'
import toast from 'react-hot-toast'

function PeopleAlsoBought(){

    const [recommendations, setRecommendations] = useState([])
    const [isLoading, setIsLoadding] = useState(true)


    useEffect(() => {
        const fetchRecommendations = async () => {
            try{
                // backend route is '/products/recommendation' (singular)
                const res = await axios.get("/products/recommendation")
                setRecommendations(res.data)
            }catch(error){
                toast.error(error?.response?.data?.message || "An error occured in getting recomendations")
            }finally{
                setIsLoadding(false)
            }
            
        }
        fetchRecommendations()
    },[])

    if(isLoading) return <LoadingSpinner />

    return(
        <div className="mt-8 ">
            <h3 className="text-2xl font-semibold text-emerald-400">
                People Also Bought
            </h3>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {
                    recommendations.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))
                }
            </div>
        </div>
    )
}


export default PeopleAlsoBought