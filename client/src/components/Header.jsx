import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import './Header.css';

const Header = () => {
  const { userData } = useContext(AppContext);

  return (
    <div className="header">
      <img src={assets.header} alt="User" className="header-img" />
      <h1 className="header-title">
        Hello {userData ? userData.name : 'Budget Enthusiast'}!
      </h1>
      <h2 className="header-subtitle">Welcome to Budget Tracker</h2>
      <p className="header-text">
        Manage your finances, track expenses, and achieve your financial goals. Need help? Explore our tools!
      </p>
      <button className="header-btn">Get Started</button>
    </div>
  );
};

export default Header;
