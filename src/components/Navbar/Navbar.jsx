//React
import { useContext, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

//Context
import { AuthContext } from "../../context/AuthContext";

//Helper
import { FormatterHelper } from "../../helper/FormatterHelper";

//Skeltons
import { UserBadgeSkeleton } from "../Skeltons/User/UserBadge";

//Css
import "./Navbar.css";

export default function Navbar() {
  var navigate = useNavigate();
  var location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuth, isAdmin, currentUser, logout } = useContext(AuthContext);

  let authButtons;
  let authActionButtons;
  let adminActionButtons;

  function handleLogout() {
    logout();
    navigate("/");
  }

  const handleNavClick = (sectionId = null) => {
    setMenuOpen(false);

    if (sectionId) {
      // If we're not on home page, navigate there first then scroll
      if (location.pathname !== "/") {
        navigate("/");
        // Wait for navigation to complete, then scroll
        setTimeout(() => {
          document
            .getElementById(sectionId)
            ?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        // Already on home, just scroll
        document
          .getElementById(sectionId)
          ?.scrollIntoView({ behavior: "smooth" });
      }
    }
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
        {!currentUser ? (
          <UserBadgeSkeleton />
        ) : (
          <div className="nav-user-badge">
            <div className="nav-user-avatar">{currentUser.avatar}</div>

            <div className="nav-user-info">
              <span className="nav-user-name">{currentUser.name}</span>
              <span className="nav-user-balance">
                {FormatterHelper.formatCurrency(currentUser.balance)}
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
          <span onClick={() => handleNavClick("services")}>Services</span>
        </li>
        <li>
          <span onClick={() => handleNavClick("how-it-works")}>
            How it works
          </span>
        </li>
        <li>
          <span onClick={() => handleNavClick("why-us")}>Why us</span>
        </li>
        {adminActionButtons}
        {authActionButtons}
        <li>
          <Link to="/topup">
            <span className="cyan" onClick={() => handleNavClick()}>
              Topup
            </span>
          </Link>
        </li>
        <li>
          <Link to="/get-number">
            <span className="cyan" onClick={() => handleNavClick()}>
              Get number
            </span>
          </Link>
        </li>
      </ul>
      <div className="nav-auth">{authButtons}</div>
    </nav>
  );
}
