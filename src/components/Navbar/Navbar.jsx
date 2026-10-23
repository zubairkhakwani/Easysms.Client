//React
import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

//Context
import { AuthContext } from "../../context/AuthContext";

//Services
import { changePassword } from "../../services/Auth/AuthService";

//Toaster
import { successTaost, errorToast } from "../../helper/Toaster";

//Helper
import { FormatterHelper } from "../../helper/FormatterHelper";

//ModalKeys
import { modalKeys } from "../../data/Static";

//Skeltons
import { UserBadgeSkeleton } from "../Skeltons/User/UserBadge";

//Modals
import ChangePasswordModal from "../Helper/Auth/Modals/ChangePasswordModal";

//Components
// import { NavbarItem } from "../Helper/Navbar/NavBarItem";

import NavDropdownMenu from "../Helper/Navbar/NavDropdownMenu";
//Css
import "./Navbar.css";

export default function Navbar() {
  var navigate = useNavigate();
  var location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [actionOpen, setActionOpen] = useState(false);
  const userMenuRef = useRef(null);
  const [modal, setModal] = useState("");
  const [isPasswordChanging, setIsPasswordChanging] = useState(false);

  const { isAuthenticated, isAuthorized, currentUser, logout } =
    useContext(AuthContext);

  let authButtons;
  let adminActionButtons;

  function handleLogout() {
    logout();
    navigate("/");
  }

  //Handle Password Change
  async function handlePasswordChange(request) {
    setIsPasswordChanging(true);
    try {
      let response = await changePassword(request);
      let responseMessage = response.message;
      if (response.isSuccess) {
        successTaost(responseMessage);
        handleCloseModal();
      } else {
        errorToast(responseMessage);
      }
    } catch {
      errorToast("Failed to update password, please try later");
    } finally {
      setIsPasswordChanging(false);
    }
  }

  function handleOpenModal(key) {
    setModal(key);
  }
  function handleCloseModal() {
    setModal("");
  }

  const handleNavClick = (sectionId = null) => {
    setActionOpen(false);
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

  const handleHamburgerClick = () => {
    setActionOpen(false);
    setMenuOpen((prev) => !prev);
  };

  const closeUserMenu = () => setActionOpen(false);

  useEffect(() => {
    if (!actionOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setActionOpen(false);
    };
    const onPointerDown = (e) => {
      if (userMenuRef.current?.contains(e.target)) return;
      closeUserMenu();
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [actionOpen]);

  if (!isAuthenticated) {
    authButtons = (
      <>
        <Link to="/login">
          <button onClick={handleHamburgerClick} className="nav-login">
            Login
          </button>
        </Link>
        <Link to="/register">
          <button onClick={handleHamburgerClick} className="nav-signup">
            Register
          </button>
        </Link>
      </>
    );
  } else {
    authButtons = (
      <>
        {!currentUser ? (
          <UserBadgeSkeleton />
        ) : (
          <div className="nav-user-wrapper" ref={userMenuRef}>
            <button
              type="button"
              className="nav-user-badge"
              onClick={() => setActionOpen((prev) => !prev)}
              aria-expanded={actionOpen}
              aria-haspopup="menu"
            >
              <div className="nav-user-avatar">{currentUser.avatar}</div>
              <div className="nav-user-info">
                <span className="nav-user-name">{currentUser.name}</span>
                <span className="nav-user-balance">
                  {FormatterHelper.formatCurrency(currentUser.balance)}
                </span>
              </div>
              <div className="nav-user-divider" />
              <span className={`nav-user-arrow ${actionOpen ? "open" : ""}`}>
                ▾
              </span>
            </button>

            {actionOpen && (
              <div className="nav-dropdown" role="menu">
                {/* History Section */}
                <span className="nav-dropdown-section-label">History</span>
                <Link
                  className="nav-dropdown-item"
                  to="/history/numbers"
                  onClick={() => {
                    closeUserMenu();
                    handleNavClick();
                  }}
                >
                  <i className="fa-solid fa-phone-volume"></i>
                  Number History
                </Link>
                <Link
                  className="nav-dropdown-item"
                  to="/history/provider-performance"
                  onClick={() => {
                    closeUserMenu();
                    handleNavClick();
                  }}
                >
                  <i className="fa-solid fa-chart-line"></i>
                  Provider Performance
                </Link>
                <Link
                  className="nav-dropdown-item"
                  to="/history/accounts"
                  onClick={closeUserMenu}
                >
                  <i className="fa-solid fa-user-clock"></i>
                  Account History
                </Link>
                <Link
                  className="nav-dropdown-item"
                  to="/history/mails"
                  onClick={closeUserMenu}
                >
                  <i className="fa-solid fa-envelope-open-text"></i>
                  Mail History
                </Link>

                <Link
                  className="nav-dropdown-item"
                  to="/history/proxy"
                  onClick={closeUserMenu}
                >
                  <i className="fa-solid fa-network-wired"></i>
                  My Active Proxies
                </Link>

                <div className="nav-dropdown-divider" />

                {/* Account Section */}
                <span className="nav-dropdown-section-label">Account</span>
                <Link
                  className="nav-dropdown-item"
                  to="/history/transactions"
                  onClick={closeUserMenu}
                >
                  <i className="fa-solid fa-receipt"></i>
                  Transaction History
                </Link>
                <Link
                  className="nav-dropdown-item"
                  to="/referral-stats"
                  onClick={closeUserMenu}
                >
                  <i className="fa-solid fa-chart-pie"></i>
                  Referral Stats
                </Link>
                <button
                  type="button"
                  className="nav-dropdown-item"
                  onClick={() => {
                    closeUserMenu();
                    handleOpenModal(modalKeys.changePassword);
                  }}
                >
                  <i className="fa-solid fa-lock"></i>
                  Change Password
                </button>

                <div className="nav-dropdown-divider" />

                {/* Danger Zone */}
                <button
                  type="button"
                  className="nav-dropdown-item danger"
                  onClick={handleLogout}
                >
                  <i className="fa-solid fa-right-from-bracket"></i>
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

        <button className="nav-logout" onClick={handleLogout}>
          Logout
        </button>
      </>
    );
  }

  if (isAuthenticated && isAuthorized) {
    adminActionButtons = (
      <li>
        <Link to="/admin-dashboard/overview">
          <span className="hvr-undr" onClick={() => handleNavClick()}>
            Dashboard
          </span>
        </Link>
      </li>
    );
  }

  return (
    <>
      <nav className={`nav${menuOpen ? " open" : ""}`}>
        <div className="nav-inner">
          <div className="logo">
            <Link to="/">
              <span>Easy</span>{" "}
              <span style={{ color: "var(--text-heading)" }}>otps</span>
            </Link>
          </div>

          <div
            className={`hamburger${menuOpen ? " open" : ""}`}
            onClick={() => handleHamburgerClick()}
            aria-label="Toggle menu"
          >
            <span className="bar" />
            <span className="bar" />
            <span className="bar" />
          </div>
        </div>

        <ul className="nav-links">
          <li>
            <Link
              to="/services"
              className="hvr-undr"
              onClick={handleHamburgerClick}
            >
              Services
            </Link>
          </li>
          <li>
            <span
              className="hvr-undr"
              onClick={() => handleNavClick("how-it-works")}
            >
              How it works
            </span>
          </li>
          <li>
            <span className="hvr-undr" onClick={() => handleNavClick("why-us")}>
              Why us
            </span>
          </li>
          <li>
            <span
              className="hvr-undr"
              onClick={() => handleNavClick("contact-us")}
            >
              Contact us
            </span>
          </li>
          {adminActionButtons}

          <li>
            <Link
              to="/earn-with-us"
              className="hvr-undr cyan med-bold"
              onClick={handleHamburgerClick}
            >
              Earn With Us
            </Link>
          </li>

          <NavDropdownMenu
            label="Buy"
            onItemClick={() => handleNavClick()}
            items={[
              {
                label: "Top Up",
                to: "/topup",
                icon: "fa-brands fa-bitcoin",
              },
              {
                label: "Buy Temp Number",
                to: "/get-number",
                icon: "fa-solid fa-sim-card",
              },
              // {
              //   label: "Smart Facebook Number",
              //   to: "/facebook-number",
              //   icon: "fa-brands fa-facebook",
              //   badge: "New",
              // },
              {
                label: "Buy Proxy",
                to: "/get-proxy",
                icon: "fa-solid fa-shield-halved",
              },
              {
                label: "Rent Mail",
                to: "/get-mail",
                icon: "fa-solid fa-envelope",
              },
              {
                label: "Buy Account",
                to: "/get-account",
                icon: "fa-solid fa-user-check",
                badge: "Hot",
              },
            ]}
          />
        </ul>
        <div className="nav-auth">{authButtons}</div>
      </nav>

      {modal === modalKeys.changePassword && (
        <ChangePasswordModal
          onClose={handleCloseModal}
          isLoading={isPasswordChanging}
          onConfirm={handlePasswordChange}
        />
      )}
    </>
  );
}
