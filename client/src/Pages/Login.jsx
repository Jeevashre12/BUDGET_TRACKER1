import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext);

  const [state, setState] = useState('Sign up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (isLoading) return; // prevent double clicks
    setIsLoading(true);

    try {
      if (state === 'Sign up') {
        // ---------- REGISTER ----------
        try {
          const { data } = await axios.post(
            backendUrl + '/api/auth/register',
            { name, email, password },
            { withCredentials: true, timeout: 10000 }
          );

          if (data.success) {
            setIsLoggedIn(true);
            navigate('/');
            toast.success('Account created successfully!');

            // Fetch user data
            getUserData().catch(() => {
              console.log('Could not fetch user data, but account was created');
            });
          } else {
            toast.error(data.message || 'Account creation failed');
          }
        } catch (error) {
          toast.error(error.response?.data?.message || 'Account creation failed. Please try again.');
          console.error('Registration error:', error);
        }
      } else {
        // ---------- LOGIN ----------
        try {
          const { data } = await axios.post(
            backendUrl + '/api/auth/login',
            { email, password },
            { withCredentials: true, timeout: 10000 }
          );

          if (data.success) {
            setIsLoggedIn(true);
            navigate('/');
            toast.success('Login successful!');

            // Fetch user data
            getUserData().catch(() => {
              console.log('Could not fetch user data, but login was successful');
            });
          } else {
            toast.error(data.message || 'Login failed');
          }
        } catch (error) {
          toast.error(error.response?.data?.message || 'Login failed. Please try again.');
          console.error('Login error:', error);
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Submit error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className='flex items-center justify-center min-h-screen px-6 sm:px-0'
      style={{
        background: 'linear-gradient(135deg, #f5e6d3 0%, #e8d5c4 50%, #d4c4b7 100%)',
        backgroundImage:
          'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
      }}
    >
      <div className='bg-white/90 backdrop-blur-sm p-10 rounded-2xl shadow-xl w-full sm:w-96 text-sm border border-white/20'>
        <h2 className='text-3xl font-semibold text-[#5a4a42] text-center mb-3'>
          {state === 'Sign up' ? 'Create Your Account' : 'Login to Your Account'}
        </h2>
        <p className='text-center text-sm mb-6 text-[#8b7355]'>
          {state === 'Sign up'
            ? 'Please fill in the details to create your account.'
            : 'Welcome back! Please login to continue.'}
        </p>

        <div className='my-4 flex items-center gap-2'>
          <div className='h-px bg-[#e7ddd6] flex-1' />
          <span className='text-[#8b7355] text-xs'>OR</span>
          <div className='h-px bg-[#e7ddd6] flex-1' />
        </div>

        <form onSubmit={onSubmitHandler}>
          {state === 'Sign up' && (
            <div className='mb-4 flex items-center gap-3 w-full px-5 py-3 rounded-full bg-[#f8f4f0] border border-[#e7ddd6]'>
              <img src={assets.person_icon} alt='' className='w-5 h-5 opacity-60' />
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type='text'
                placeholder='Full Name'
                required
                disabled={isLoading}
                className='flex-1 bg-transparent border-none outline-none text-[#5a4a42] placeholder-[#a89b8c] disabled:opacity-50'
              />
            </div>
          )}

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-3 rounded-full bg-[#f8f4f0] border border-[#e7ddd6]'>
            <img src={assets.mail_icon} alt='' className='w-5 h-5 opacity-60' />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type='email'
              placeholder='Email id'
              required
              disabled={isLoading}
              className='flex-1 bg-transparent border-none outline-none text-[#5a4a42] placeholder-[#a89b8c] disabled:opacity-50'
            />
          </div>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-3 rounded-full bg-[#f8f4f0] border border-[#e7ddd6]'>
            <img src={assets.lock_icon} alt='' className='w-5 h-5 opacity-60' />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type='password'
              placeholder='Password'
              required
              disabled={isLoading}
              className='flex-1 bg-transparent border-none outline-none text-[#5a4a42] placeholder-[#a89b8c] disabled:opacity-50'
            />
          </div>

          <p
            onClick={() => !isLoading && navigate('/reset-password')}
            className={`mb-4 text-[#8b7355] cursor-pointer hover:text-[#5a4a42] transition-colors ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Forget Password?
          </p>

          <button
            type='submit'
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
                {state === 'Sign up' ? 'Creating Account...' : 'Logging In...'}
              </div>
            ) : (
              state
            )}
          </button>
        </form>

        {state === 'Sign up' ? (
          <p className='text-gray-400 text-center text-xs mt-4'>
            Already have an account?{' '}
            <span
              onClick={() => !isLoading && setState('Login')}
              className={`text-blue-400 cursor-pointer underline ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Login here
            </span>
          </p>
        ) : (
          <p className='text-gray-400 text-center text-xs mt-4'>
            Don't have an account?{' '}
            <span
              onClick={() => !isLoading && setState('Sign up')}
              className={`text-blue-400 cursor-pointer underline ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Sign Up
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
