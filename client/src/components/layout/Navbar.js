import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";
import logo from "../../lib/images/cartoonOrangeTabby.png";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-brand">
          <img
            src={logo}
            alt="Mind Managed Logo"
            className="navbar-logo"
            style={{ maxHeight: "35px", height: "35px" }}
          />
          <Link to="/">Mind Managed</Link>
        </div>
        <div className="navbar-menu">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="navbar-item">
                Dashboard
              </Link>
              <span className="navbar-item">Welcome, {user?.name}</span>
              <button onClick={handleLogout} className="btn btn-secondary">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-item">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
