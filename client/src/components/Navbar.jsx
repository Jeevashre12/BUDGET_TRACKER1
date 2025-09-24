import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate, NavLink } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import './Navbar.css'

const Navbar = () => {
  const navigate = useNavigate()
  const { userData, backendUrl, setUserData, setIsLoggedIn } = useContext(AppContext)

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true
      const { data } = await axios.post(backendUrl + '/api/auth/logout')
      if (data.success) {
        setIsLoggedIn(false)
        setUserData(false)
        navigate('/')
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="navbar">
      <div className="brand" onClick={() => navigate('/')}>
        <img src={assets.logo} alt="Logo" className="navbar-logo" />
        <span className="brand-name">Budget Tracker</span>
      </div>
      <div className="right-group">
        <div className="nav-links">
          <NavLink to="/home" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Home</NavLink>
          <NavLink to="/dashboard" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Dashboard</NavLink>
          <NavLink to="/transactions" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Transactions</NavLink>
          <NavLink to="/budgeting" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Budget</NavLink>
          <NavLink to="/reports" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Reports</NavLink>
        </div>
      {userData ? (
        <div className="user-avatar">
          {userData.name[0].toUpperCase()}
          <div className="dropdown">
            <ul>
              <li onClick={logout}>Logout</li>
            </ul>
          </div>
        </div>
      ) : (
        <button onClick={() => navigate('/login')} className="login-btn">
          Login <img src={assets.arrow_icon} alt="" />
        </button>
      )}
      </div>
    </div>
  )
}

export default Navbar
