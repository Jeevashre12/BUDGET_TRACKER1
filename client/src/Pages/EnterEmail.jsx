import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const EnterEmail = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setIsLoading(true);
    
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/send-verify-otp', { email });
      
      if (data.success) {
        toast.success('OTP sent to your email!');
        navigate('/email-verify', { state: { email } });
      } else {
        toast.error(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.');
      console.error('Error sending OTP:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0' style={{
      background: 'linear-gradient(135deg, #f5e6d3 0%, #e8d5c4 50%, #d4c4b7 100%)',
      backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
    }}>
      <div className='bg-white/90 backdrop-blur-sm p-10 rounded-2xl shadow-xl w-full sm:w-96 text-sm border border-white/20'>
        <h2 className='text-3xl font-semibold text-[#5a4a42] text-center mb-3'>
          Enter Your Email
        </h2>
        <p className='text-center text-sm mb-6 text-[#8b7355]'>
          We'll send a verification code to your email address.
        </p>

        <form onSubmit={handleSubmit}>
          <div className='mb-6 flex items-center gap-3 w-full px-5 py-3 rounded-full bg-[#f8f4f0] border border-[#e7ddd6]'>
            <input 
              onChange={e => setEmail(e.target.value)} 
              value={email} 
              type='email' 
              placeholder='Enter your email address' 
              required 
              disabled={isLoading}
              className='flex-1 bg-transparent border-none outline-none text-[#5a4a42] placeholder-[#a89b8c] disabled:opacity-50' 
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-3 rounded-full font-semibold transition-all duration-200 ${
              isLoading 
                ? 'bg-[#d4c4b7] cursor-not-allowed text-[#8b7355]' 
                : 'bg-gradient-to-r from-[#5a4a42] to-[#8b7355] text-white hover:from-[#4a3d37] hover:to-[#7a6b5a] shadow-lg'
            }`}
          >
            {isLoading ? (
              <div className='flex items-center justify-center gap-2'>
                <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                Sending OTP...
              </div>
            ) : (
              'Send Verification Code'
            )}
          </button>
        </form>

        <div className='mt-6 text-center'>
          <button 
            onClick={() => navigate('/')}
            className='text-[#8b7355] hover:text-[#5a4a42] transition-colors'
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnterEmail;
