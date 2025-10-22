import { useState } from 'react'
import { Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, ArrowRight, Loader } from 'lucide-react'
import { motion } from 'framer-motion'
import { useUserStore } from '../store/useUserStore';

function SignUpPage(){

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const { signup, loading } = useUserStore()

    const handleSubmit = (event) => {
        event.preventDefault()
        console.log("called here")
        signup(formData)
    }

    return(
        <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <motion.div 
            className='sm:mx-auto sm:w-full sm:max-w-md'
            initial={{ opacity: 0, y:-20 }}
            animate={{ opacity: 1, y:0 }}
            transition={{ duration: 0.8 }}
            >
                <h2 className="mt-6 text-center text-3xl font-extrabold text-emerald-400">Create Your Account</h2>
            </motion.div>
            <motion.div
            className="mt-8 sm:mx-auto sm:w-full sm:max-w-md" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0  }}
            transition={{ duration: 0.8 }}
            >
                <div className='bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10'>
                    <form onSubmit={handleSubmit} className="space-y-6" >
                        <div>
                            <label htmlFor='name' className="block text-sm font-medium text-gray-300">
                                Full name
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <User className="h-5 w-5 text-gray-500" />
                                </div>
                                <input 
                                type="text"
                                id="name"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className='block w-full px-3 py-3 pl-10 bg-gray-700 border border-gray-600 rounded-md shaddow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm' 
                                placeholder="John Doe"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor='email' className="block text-sm font-medium text-gray-300">
                                Email address
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <Mail className="h-5 w-5 text-gray-500" />
                                </div>
                                <input 
                                type="email"
                                id="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className='block w-full px-3 py-3 pl-10 bg-gray-700 border border-gray-600 rounded-md shaddow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm' 
                                placeholder="johndoe@gmail.com"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor='password' className="block text-sm font-medium text-gray-300">
                                Password
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <Lock className="h-5 w-5 text-gray-500" />
                                </div>
                                <input 
                                type="password"
                                id="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className='block w-full px-3 py-3 pl-10 bg-gray-700 border border-gray-600 rounded-md shaddow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm' 
                                placeholder="**********"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor='confirmPassword' className="block text-sm font-medium text-gray-300">
                                Confirm Password
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <Lock className="h-5 w-5 text-gray-500" />
                                </div>
                                <input 
                                type="password"
                                id="confirmPassword"
                                required
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className='block w-full px-3 py-3 pl-10 bg-gray-700 border border-gray-600 rounded-md shaddow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm' 
                                placeholder="**********"
                                />
                            </div>
                        </div>
                        <button
                        type="submit"
                        disabled={loading}
                        className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50'
                        >
                            {
                                loading ? (
                                    <>
                                        <Loader className='animate-spin w-5 h-5 mr-2' aria-hidden="true" />
                                        Loading...
                                    </>
                                ): (
                                    <>
                                        <UserPlus className="mr-2 h-5 w-5" />
                                        Sign Up
                                    </>   
                                )
                            }
                        </button>
                    </form>
                    <p className="mt-8 text-center text-sm text-gray-400">
                        Already have an account?{" "}
                        <Link to="/login" className="font-medium text-emerald-400 hover:text-emerald-300">
                            Login Here <ArrowRight className="inline h-4 w-4" />
                        </Link>
                    </p>
                </div>

            </motion.div>
        </div>
    );
}

export default SignUpPage