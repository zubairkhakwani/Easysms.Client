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
          <div className="nav-user-wrapper">
            <div
              className="nav-user-badge"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <div className="nav-user-avatar">{currentUser.avatar}</div>
              <div className="nav-user-info">
                <span className="nav-user-name">{currentUser.name}</span>
                <span className="nav-user-balance">
                  {FormatterHelper.formatCurrency(currentUser.balance)}
                </span>
              </div>
              <div className="nav-user-divider" />
              <span className={`nav-user-arrow ${menuOpen ? "open" : ""}`}>
                ▾
              </span>
            </div>

            {menuOpen && (
              <>
                <div
                  className="nav-dropdown-overlay"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="nav-dropdown">
                  <a className="nav-dropdown-item" href="/history/number">
                    <i className="fa-solid fa-clock-rotate-left"></i>
                    Number History
                  </a>

                  <a className="nav-dropdown-item" href="/history/account">
                    <i className="fa-solid fa-clock-rotate-left"></i>
                    Account History
                  </a>
                  {/* <a className="nav-dropdown-item" href="/change-password">
                    <i className="fa-solid fa-lock"></i>
                    Change Password
                  </a> */}
                  {/* <a className="nav-dropdown-item" href="/change-email">
                    <i className="fa-solid fa-envelope"></i>
                    Change Email
                  </a> */}
                  <div className="nav-dropdown-divider" />
                  <button
                    className="nav-dropdown-item danger"
                    onClick={handleLogout}
                  >
                    <i className="fa-solid fa-right-from-bracket"></i>
                    Logout
                  </button>
                </div>
              </>
            )}
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
        <Link to="/admin-dashboard/overview">
          <span onClick={() => handleNavClick()}>Dashboard</span>
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
              Buy number
            </span>
          </Link>
        </li>
        <li>
          <Link to="/get-account">
            <span className="cyan" onClick={() => handleNavClick()}>
              Buy account
            </span>
          </Link>
        </li>
      </ul>
      <div className="nav-auth">{authButtons}</div>
    </nav>
  );
}
