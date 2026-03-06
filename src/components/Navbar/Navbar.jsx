import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import TokenService from "../../services/Token/TokenService";

import "./Navbar.css";

export default function Navbar() {
  var navigate = useNavigate();

  const { isAuthenticated, logout } = useContext(AuthContext);

  let authButtons;

  function handleLogout() {
    logout();
    navigate("/");
  }

  if (!isAuthenticated) {
    authButtons = (
      <>
        <Link to="/login">
          <button className="nav-login">Login</button>
        </Link>
        <Link to="/register">
          <button className="nav-signup">Register</button>
        </Link>
      </>
    );
  } else {
    authButtons = (
      <button className="nav-logout" onClick={handleLogout}>
        Logout
      </button>
    );
  }

  return (
    <nav className="nav">
      <Link to="/">
        <div className="logo">
          sms<span>verify</span>
        </div>
      </Link>

      <ul className="nav-links">
        <li>
          <a href="#">Services</a>
        </li>
        <li>
          <a href="#">Pricing</a>
        </li>
        <Link to="/history">
          <span>History</span>
        </Link>
        <li></li>
      </ul>
      <div className="nav-auth">{authButtons}</div>
    </nav>
  );
}
