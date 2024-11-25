import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import VortexConnect from "./VortexConnect";

const Header = ({ onWalletConnect }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header>
      <div className="header-content">
        {/* Logo */}
        <div className="div-logo">
          <Link to="https://vortexdapp.com">
            <img
              src="https://i.imgur.com/XDHnW0R.png"
              alt="VortexLogo png"
              className="logo"
            />
          </Link>
        </div>

        {/* Burger Menu */}
        <div className="div-burger">
          <button className="burger-menu" onClick={toggleMenu}>
            &#9776;
          </button>
          <nav className={`menu ${isMenuOpen ? "open" : ""}`}>
            <Link to="/">Home</Link>
            <Link to="/factory">Launch</Link>
            <Link to="/staking">Stake</Link>
            <Link to="/tokens">Trade</Link>
            <a
              href="https://docs.vortexdapp.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Docs
            </a>
          </nav>
        </div>

        {/* VortexConnect */}
        <div className="div-button">
          <VortexConnect onConnect={onWalletConnect} />
        </div>
      </div>
    </header>
  );
};

export default Header;
