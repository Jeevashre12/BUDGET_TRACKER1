import React from "react";
import Header from "../components/Header";
import { assets } from "../assets/assets";
import "./Home.css";

const Home = () => {
  return (
    <div className="home" style={{ backgroundImage: `url(${assets.bg})` }}>
      <Header />
    </div>
  );
};

export default Home;
