import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { assets } from '../assets/assets'
import axios from 'axios';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const EmailVerify = () => {

  axios.defaults.withCredentials=true;
  const {backendUrl,isLoggedIn,userData,getUserData}=useContext(AppContext)
  const navigate = useNavigate();
  
  // Get email from navigation state or use user's email if logged in
  const location = useLocation();
  const email = userData?.email || location.state?.email;

    
  const inputRefs=React.useRef([])

  const handleInput=(e,index)=>{
    if(e.target.value.length>0 && index<inputRefs.current.length-1){
      inputRefs.current[index+1].focus();
    }
  }
  const handleKeyDown=(e,index)=>{
    if(e.key==='Backspace' && e.target.value==='' && index>0){
       inputRefs.current[index-1].focus();
    }
  }
  const handlePaste=(e)=>{
    const paste=e.clipboardData.getData('text')
    const pasteArray=paste.split('');
    pasteArray.forEach((char,index)=>{
      if(inputRefs.current[index]){
        inputRefs.current[index].value=char;
      }
    })
  }
const onSubmitHandler=async(e)=>{
  try{
    e.preventDefault();
    const otpArray=inputRefs.current.map(e=>e.value)
    const otp=otpArray.join('')
    if(otp.length !== 6){
      toast.error('Please enter the 6-digit code')
      return;
    }
    const{data}=await axios.post(backendUrl+'/api/auth/verify-account',{email, otp},{ withCredentials: true })
    if(data.success){
      toast.success(data.message)
      getUserData()
      navigate('/')
    }
    else{
      toast.error(data.message)
    }
  }
  catch(error){
    toast.error(error.message)
  }
}
useEffect(()=>{
  isLoggedIn && userData && userData.isAccountVerified && navigate('/')
},[isLoggedIn,userData])

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0' style={{
      background: 'linear-gradient(135deg, #f5e6d3 0%, #e8d5c4 50%, #d4c4b7 100%)',
      backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
    }}>
      <form onSubmit={onSubmitHandler} className='bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-96 text-sm border border-white/20'>
        <h1 className='text-[#5a4a42] text-2xl font-semibold text-center mb-4'>Email Verify OTP</h1>
        <p className='text-center mb-6 text-[#8b7355]'>Enter the 6-digit code sent to your email id.</p>
        <div className='flex justify-between mb-8' onPaste={handlePaste}>
          {Array(6).fill(0).map((_,index)=>(
            <input type='text'maxLength='1' key={index} required
            className='w-12 h-12 bg-[#f8f4f0] border border-[#e7ddd6] text-[#5a4a42] text-center text-xl rounded-md focus:outline-none focus:border-[#5a4a42]'
            ref={e=>inputRefs.current[index]=e}
            onInput={(e)=>handleInput(e,index)}
            onKeyDown={(e)=>handleKeyDown(e,index)}
            />
          ))}

        </div>
        <button className='w-full py-3 bg-gradient-to-r from-[#5a4a42] to-[#8b7355] text-white rounded-full hover:from-[#4a3d37] hover:to-[#7a6b5a] transition-all duration-200'>Verify email</button>
      </form>
    </div>
  )
}

export default EmailVerify
