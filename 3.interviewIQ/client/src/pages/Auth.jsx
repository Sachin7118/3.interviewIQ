import React, { useState } from 'react'
import { BsRobot } from "react-icons/bs";
import { IoSparkles } from "react-icons/io5";
import { motion } from "motion/react"
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../utils/firebase';
import axios from 'axios';
import { ServerUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function Auth({isModel = false}) {
    const dispatch = useDispatch()
    const [mode, setMode] = useState('login')
    const [formData, setFormData] = useState({ name: '', email: '', password: '' })
    const [error, setError] = useState('')

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleEmailAuth = async (e) => {
        e.preventDefault()
        setError('')

        try {
            const endpoint = mode === 'signup' ? '/api/auth/signup' : '/api/auth/login'
            const payload = mode === 'signup'
                ? {
                    name: formData.name || formData.email.split('@')[0],
                    email: formData.email,
                    password: formData.password
                }
                : {
                    email: formData.email,
                    password: formData.password
                }

            const result = await axios.post(ServerUrl + endpoint, payload, { withCredentials: true })
            dispatch(setUserData(result.data))
        } catch (err) {
            console.error('Email auth failed:', err)
            setError(err?.response?.data?.message || 'Login failed. Please try again.')
            dispatch(setUserData(null))
        }
    }

    const handleGoogleAuth = async () => {
        try {
            const response = await signInWithPopup(auth, provider);
            const user = response.user;
            const name = user.displayName;
            const email = user.email;

            if (!email) {
                throw new Error("Google account email is missing.");
            }

            const result = await axios.post(
                ServerUrl + "/api/auth/google",
                { name, email },
                { withCredentials: true }
            );

            dispatch(setUserData(result.data));
        } catch (error) {
            console.error("Google login failed:", error);
            dispatch(setUserData(null));
        }
    }
  return (
    <div className={`
      w-full 
      ${isModel ? "py-4" : "min-h-screen bg-[#f3f3f3] flex items-center justify-center px-6 py-20"}
    `}>
        <motion.div 
        initial={{opacity:0 , y:-40}} 
        animate={{opacity:1 , y:0}} 
        transition={{duration:1.05}}
        className={`
        w-full 
        ${isModel ? "max-w-md p-8 rounded-3xl" : "max-w-lg p-12 rounded-[32px]"}
        bg-white shadow-2xl border border-gray-200
      `}>
            <div className='flex items-center justify-center gap-3 mb-6'>
                <div className='bg-black text-white p-2 rounded-lg'>
                    <BsRobot size={18}/>

                </div>
                <h2 className='font-semibold text-lg'>InterviewIQ.AI</h2>
            </div>

            <h1 className='text-2xl md:text-3xl font-semibold text-center leading-snug mb-4'>
                Continue with
                <span className='bg-green-100 text-green-600 px-3 py-1 rounded-full inline-flex items-center gap-2'>
                    <IoSparkles size={16}/>
                    AI Smart Interview

                </span>
            </h1>

            <p className='text-gray-500 text-center text-sm md:text-base leading-relaxed mb-8'>
                Sign in to start AI-powered mock interviews,
        track your progress, and unlock detailed performance insights.
            </p>

            <div className='mb-4 flex gap-2 rounded-full bg-gray-100 p-1'>
                <button
                    type='button'
                    onClick={() => setMode('login')}
                    className={`flex-1 rounded-full px-3 py-2 text-sm font-medium ${mode === 'login' ? 'bg-black text-white' : 'text-gray-600'}`}
                >
                    Login
                </button>
                <button
                    type='button'
                    onClick={() => setMode('signup')}
                    className={`flex-1 rounded-full px-3 py-2 text-sm font-medium ${mode === 'signup' ? 'bg-black text-white' : 'text-gray-600'}`}
                >
                    Sign up
                </button>
            </div>

            <form onSubmit={handleEmailAuth} className='space-y-4'>
                {mode === 'signup' && (
                    <input
                        type='text'
                        name='name'
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder='Full name'
                        className='w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-black'
                    />
                )}

                <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder='Email address'
                    required
                    className='w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-black'
                />

                <input
                    type='password'
                    name='password'
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder='Password'
                    required
                    className='w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-black'
                />

                {error && <p className='text-red-500 text-sm'>{error}</p>}

                <button
                    type='submit'
                    className='w-full bg-black text-white py-3 rounded-full font-medium'
                >
                    {mode === 'signup' ? 'Create account' : 'Login with email'}
                </button>
            </form>

            <div className='my-6 flex items-center gap-3'>
                <div className='h-px flex-1 bg-gray-200' />
                <span className='text-xs uppercase tracking-[0.2em] text-gray-400'>or</span>
                <div className='h-px flex-1 bg-gray-200' />
            </div>

            <motion.button 
            onClick={handleGoogleAuth}
            whileHover={{opacity:0.9 , scale:1.03}}
            whileTap={{opacity:1 , scale:0.98}}
            className='w-full flex items-center justify-center gap-3 py-3 bg-black text-white rounded-full shadow-md '>
                <FcGoogle size={20}/>
                Continue with Google

   
            </motion.button>
        </motion.div>

      
    </div>
  )
}

export default Auth
