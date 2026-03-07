import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import TokenService from "../../services/Token/TokenService";

import "./Navbar.css";

export default function Navbar() {
  var navigate = useNavigate();

  const { isAuth, isAdmin, currentUser, logout } = useContext(AuthContext);

  let authButtons;
  let adminActionButtons;

  function handleLogout() {
    logout();
    navigate("/");
  }

  if (!isAuth) {
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
      <>
        {currentUser && (
          <div className="nav-user-badge">
            <div className="nav-user-avatar">{currentUser?.avatar}</div>
            <div className="nav-user-info">
              <span className="nav-user-name">{currentUser?.name}</span>
              <span className="nav-user-balance">
                ${currentUser?.balance ?? 0}
              </span>
            </div>
            <div className="nav-user-divider" />
            <span className="nav-user-arrow">▾</span>
          </div>
        )}

        <button className="nav-logout" onClick={handleLogout}>
          Logout
        </button>
      </>
    );
  }

  if (isAuth && isAdmin) {
    adminActionButtons = (
      <li>
        <Link to="/manage-users">
          <span>Manage User</span>
        </Link>
      </li>
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
        {adminActionButtons}
        <li>
          <Link to="/history">
            <span>History</span>
          </Link>
        </li>
      </ul>
      <div className="nav-auth">{authButtons}</div>
    </nav>
  );
}
