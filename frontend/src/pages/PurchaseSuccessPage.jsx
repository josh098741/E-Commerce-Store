import { ArrowRight, CheckCircle, HandHeart } from "lucide-react"
import { useEffect, useState } from "react"
import toast from 'react-hot-toast'
import { Link } from "react-router-dom"
import { useCartStore } from "../store/useCartStore"
import axios from "../lib/axios"
import Confetti  from 'react-confetti'

function PurchaseSuccessPage(){

    const [isProcessing, setIsProcessing] = useState(true)
    const { clearCart } = useCartStore()
    const [error, setError] = useState(null)

    useEffect(() => {
        const handleCheckoutSuccess = async (sessionId) => {
            try {
                console.log('Processing checkout success with session:', sessionId);
                
                // First verify the payment with Stripe
                const response = await axios.post('/payments/checkout-success', {
                    sessionId
                });
                
                console.log('Payment verified:', response.data);
                
                // Then clear the cart
                await clearCart();
                
                toast.success('Thank you for your purchase!');
            } catch (error) {
                console.error('Error processing purchase:', error);
                setError(
                    error?.response?.data?.message || 
                    error.message || 
                    'Failed to process your purchase. Please contact support.'
                );
            } finally {
                setIsProcessing(false);
            }
        }

        const sessionId = new URLSearchParams(window.location.search).get('session_id');
        if (sessionId) {
            handleCheckoutSuccess(sessionId);
        } else {
            setIsProcessing(false);
            setError("No session ID found in the URL. Please try your purchase again.");
        }
    },[clearCart])

    if(isProcessing) return (
        <div className="h-screen flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
                <p className="text-emerald-400 text-lg">Processing your purchase...</p>
            </div>
        </div>
    );

    if(error) return (
        <div className="h-screen flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-6">
                <div className="text-red-500 text-center mb-4">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
                    <p className="text-gray-300">{error}</p>
                </div>
                <Link to="/" className="block w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded">
                    Return to Home
                </Link>
            </div>
        </div>
    );

    return(
        <div className="h-screen flex items-center justify-center px-4">

            <Confetti width={window.innerWidth} height={window.innerHeight} gravity={0.1} style={{zIndex:99}} numberOfPieces={700} recycle={false} />
            <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden relative z-10">
                <div className="p-6 sm:p-8">
                    <div className="flex justify-center">
                        <CheckCircle className="text-emerald-400 w-16 h-16 mb-4" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-center text-emerald-400 mb-2">
                        Purchase Successful
                    </h1>
                    <p className="text-gray-300 text-center mb-2">
                        Thank you for your order. {"We're"} processing it now
                    </p>
                    <p className="text-emerald-400 text-center text-sm mb-6">
                        Check your email for order details and updates
                    </p>
                    <div className="bg-gray-700 rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-400">Order number</span>
                            <span className="text-sm font-semibold text-emerald-400">#12345</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">Estimated Delivery</span>
                            <span className="text-sm font-semibold text-emerald-400">3-5 Business Days</span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center">
                            <HandHeart className="mr-2" size={18} />
                            Thanks for trusting us
                        </button>
                        <Link to={"/"}>
                            <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center">
                                Continue Shopping
                                <ArrowRight className="ml-2" size={18} />
                            </button>
                        </Link>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PurchaseSuccessPage