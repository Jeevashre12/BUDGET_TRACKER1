import React from "react";
import Header from "../components/Header";
import { assets } from "../assets/assets";
import "./Home.css";

const Home = () => {
  return (
    <div className="home">
      <div className="home-content">
        <h1>Hello Budget Enthusiast!</h1>
        <h2>Welcome to <span style={{ color: "#7a3cff" }}>Budget Tracker</span></h2>
        <p>Manage your finances, track expenses, and achieve your goals with ease.</p>
        <button>Get Started</button>
      </div>

      <div className="home-image">
        <img src={assets.image} alt="Finance illustration" />
      </div>
    </div>
  );
};

export default Home;
