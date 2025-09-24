import React, { useState, useContext, useRef } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const { backendUrl } = useContext(AppContext);
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  const inputRefs = useRef([]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/send-reset-otp', { email });
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && setIsEmailSent(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onSubmitOTP = (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((el) => el.value);
    setOtp(otpArray.join(''));
    setIsOtpSubmitted(true);
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/reset-password', { email, otp, newPassword });
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && navigate('/login');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-[#1c1b29] w-full'>
      <div className='p-12 rounded-3xl shadow-2xl w-full sm:w-96 text-sm border border-gray-600'>
        <h2 className='text-4xl font-bold text-gray-300 text-center mb-4'>Reset Password</h2>

        {/* Email input */}
        {!isEmailSent && (
          <form onSubmit={onSubmitEmail} className='space-y-6'>
            <div className='mb-6'>
              <label className='block text-gray-400 mb-2'>Email</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type='email'
                placeholder='Enter your email'
                required
                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-md bg-[#2e2d3a] text-gray-300'
              />
            </div>

            <button
              type='submit'
              className='w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
            >
              Send OTP
            </button>
          </form>
        )}

        {/* OTP input */}
        {!isOtpSubmitted && isEmailSent && (
          <form onSubmit={onSubmitOTP} className="p-12 rounded-3xl shadow-2xl w-full sm:w-96 text-sm text-center border border-gray-600 bg-[#2e2d3a]">
            <h1 className="text-gray-300 text-3xl font-semibold mb-4">Enter OTP</h1>
            <p className="mb-8 text-gray-400 text-lg">Enter the 6-digit code sent to your email</p>

            <div className="flex justify-between mb-10" onPaste={handlePaste}>
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <input
                    type="text"
                    maxLength="1"
                    key={index}
                    required
                    className="w-14 h-14 border border-gray-600 rounded-lg text-gray-300 text-center text-2xl bg-[#1c1b29] focus:outline-none focus:ring-2 focus:ring-purple-500"
                    ref={(el) => (inputRefs.current[index] = el)}
                    onInput={(e) => handleInput(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  />
                ))}
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-lg font-semibold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-lg"
            >
              Verify OTP
            </button>
          </form>
        )}

        {/* New Password */}
        {isOtpSubmitted && isEmailSent && (
          <form onSubmit={onSubmitNewPassword} className="bg-white p-8 rounded-2xl shadow-xl w-96 text-sm text-center">
            <h1 className="text-gray-800 text-2xl font-semibold mb-2">New Password</h1>
            <p className="mb-6 text-gray-500">Enter your new password below</p>

            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full border border-gray-300">
              <input
                type="password"
                placeholder="Password"
                className="bg-transparent outline-none text-gray-700 w-full"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-[#6a4e42] to-[#9b7e6d] text-white rounded-full shadow-md"
            >
              Submit
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
