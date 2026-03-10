//React
import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

//Context
import { AuthContext } from "../../context/AuthContext";

//Css
import "./Navbar.css";

export default function Navbar() {
  var navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuth, isAdmin, currentUser, logout } = useContext(AuthContext);

  let authButtons;
  let authActionButtons;
  let adminActionButtons;

  function handleLogout() {
    logout();
    navigate("/");
  }

  const handleNavClick = () => {
    setMenuOpen(false);
    navigate("/");
  };

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
                ${Math.trunc(currentUser.balance * 10000) / 10000}
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
          <span onClick={() => handleNavClick()}>Manage User</span>
        </Link>
      </li>
    );
  }

  if (isAuth) {
    authActionButtons = (
      <li>
        <Link to="/history">
          <span onClick={() => handleNavClick()}>History</span>
        </Link>
      </li>
    );
  }

  return (
    <nav className={`nav${menuOpen ? " open" : ""}`}>
      <div className="nav-inner">
        <Link to="/">
          <div className="logo">
            <span>Easy</span>otps
          </div>
        </Link>

        <div
          className={`hamburger${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </div>
      </div>

      <ul className="nav-links">
        <li>
          <a href="#Services" onClick={() => handleNavClick()}>
            Services
          </a>
        </li>
        <li>
          <a href="#how-it-works" onClick={() => handleNavClick()}>
            How it works
          </a>
        </li>
        <li>
          <a href="#why-us" onClick={() => handleNavClick()}>
            Why us
          </a>
        </li>
        {adminActionButtons}
        {authActionButtons}
      </ul>
      <div className="nav-auth">{authButtons}</div>
    </nav>
  );
}
