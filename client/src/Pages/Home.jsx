import React, { useEffect } from "react";
import Header from "../components/Header";
import { assets } from "../assets/assets";
import "./Home.css";

const Home = () => {
  useEffect(() => {
    // Ensure the page content is loaded when navigating back to Home
    document.title = "Home - Budget Tracker";
  }, []);

  return (
    <div
      className="home min-h-screen bg-[#1c1b29]"
      style={{ backgroundImage: `url(${assets.bg})` }}
    >
      <Header />
      <div className="flex flex-col items-center justify-center text-center text-gray-300 py-20">
        <h1 className="text-4xl font-bold mb-4">Welcome to Your Home Page</h1>
        <p className="text-lg">
          Explore features and manage your budget effortlessly.
        </p>
      </div>
    </div>
  );
};

export default Home;
