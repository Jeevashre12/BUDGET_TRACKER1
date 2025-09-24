import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import './Header.css';

const Header = () => {
  const { userData } = useContext(AppContext);

  return (
    <header className="header">
      <h1 className="header-title">
        Hello {userData ? userData.name : 'Budget Enthusiast'}!
      </h1>
      <h2 className="header-subtitle">
        Welcome to <span>Budget Tracker</span>
      </h2>
      <p className="header-text">
        Manage your finances, track expenses, and achieve your goals with ease.
      </p>
      <button className="header-btn">Get Started</button>
    </header>
  );
};

export default Header;
