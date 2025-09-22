import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

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
            getUserData().catch(() => console.log('Could not fetch user data, but account was created'));
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
            getUserData().catch(() => console.log('Could not fetch user data, but login was successful'));
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
      className='flex items-center justify-center min-h-screen bg-[#1c1b29] w-full overflow-hidden'
    >
      {/* Animation Section */}
      <div className='w-1/2 h-screen flex items-center justify-center bg-[#2e2d3a]'>
        <DotLottieReact
         src="https://lottie.host/47b41151-b490-4e72-b5ea-59c7ca0ad724/EdJ8BI9nf1.lottie"
          loop
          autoplay
          style={{ width: '80%', height: '150%', imageRendering: 'auto' }}
        />
        <div className='absolute bottom-10 text-center text-gray-300'>
         
        </div>
      </div>

      {/* Form Section */}
      <div className='w-1/2 h-screen flex items-center justify-center bg-[#1c1b29]'>
        <div className='p-12 rounded-3xl shadow-2xl w-full sm:w-96 text-sm border border-gray-600'>
          <h2 className='text-4xl font-bold text-gray-300 text-center mb-4'>
            {state === 'Sign up' ? 'Create an account' : 'Login'}
          </h2>
          <p className='text-center text-sm mb-8 text-gray-400'>
            {state === 'Sign up'
              ? 'Already have an account? '
              : 'Don’t have an account? '}
            <span
              onClick={() => setState(state === 'Sign up' ? 'Login' : 'Sign up')}
              className='text-purple-500 cursor-pointer underline'
            >
              {state === 'Sign up' ? 'Log In' : 'Sign Up'}
            </span>
          </p>

          <form onSubmit={onSubmitHandler} className='space-y-6'>
            {state === 'Sign up' && (
              <div className='mb-6'>
                <label className='block text-gray-400 mb-2'>Full Name</label>
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type='text'
                  placeholder='Enter your full name'
                  required
                  disabled={isLoading}
                  className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-md bg-[#2e2d3a] text-gray-300'
                />
              </div>
            )}

            <div className='mb-6'>
              <label className='block text-gray-400 mb-2'>Email</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type='email'
                placeholder='Enter your email'
                required
                disabled={isLoading}
                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-md bg-[#2e2d3a] text-gray-300'
              />
            </div>

            <div className='mb-6'>
              <label className='block text-gray-400 mb-2'>Password</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type='password'
                placeholder='Enter your password'
                required
                disabled={isLoading}
                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-md bg-[#2e2d3a] text-gray-300'
              />
            </div>

            <p
              onClick={() => !isLoading && navigate('/reset-password')}
              className={`text-sm text-purple-500 cursor-pointer hover:underline transition-colors ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Forgot Password?
            </p>

            <button
              type='submit'
              disabled={isLoading}
              className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 shadow-lg ${
                isLoading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
              }`}
            >
              {isLoading ? (
                <div className='flex items-center justify-center gap-2'>
                  <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                  {state === 'Sign up' ? 'Signing Up...' : 'Logging In...'}
                </div>
              ) : (
                state === 'Sign up' ? 'Create Account' : 'Log In'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
