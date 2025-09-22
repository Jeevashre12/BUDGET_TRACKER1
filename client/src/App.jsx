import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import About from './Pages/About';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './Pages/Login';
import EmailVerify from './Pages/EmailVerify';
import ResetPassword from './Pages/ResetPassword';
import AdminLogin from './Pages/AdminLogin';
import AdminDashboard from './Pages/AdminDashboard';
import EnterEmail from './Pages/EnterEmail';

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { AppContextProvider } from './context/AppContext.jsx';
import Navbar from './components/Navbar.jsx';

const App = () => {
  return (
    <AppContextProvider>
      <div className="page-container">
        <ToastContainer />
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route
            path='/my-recipes'
            element={
              <ProtectedRoute>
                <div>My Recipes</div>
              </ProtectedRoute>
            }
          />
          <Route path='/login' element={<Login />} />
          <Route path='/email-verify' element={<EmailVerify />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          <Route path='/admin/login' element={<AdminLogin />} />
          <Route path='/admin/dashboard' element={<AdminDashboard />} />
          <Route path='/enter-email' element={<EnterEmail />} />
          <Route path='/home' element={<Home />} />
        </Routes>
      </div>
    </AppContextProvider>
  );
};

export default App;
