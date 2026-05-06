//React
import { useContext, useState } from "react";
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

//Css
import "./Navbar.css";

export default function Navbar() {
  var navigate = useNavigate();
  var location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [actionOpen, setActionOpen] = useState(false);
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
    setModal();
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
          <div className="nav-user-wrapper">
            <div
              className="nav-user-badge"
              onClick={() => setActionOpen((prev) => !prev)}
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
            </div>

            {actionOpen && (
              <>
                {/* <div
                  className="nav-dropdown-overlay"
                  // onClick={() => setActionOpen(false)}
                /> */}
                <div className="nav-dropdown">
                  <Link className="nav-dropdown-item" to="/history/number">
                    <i className="fa-solid fa-clock-rotate-left"></i>
                    <span onClick={() => handleNavClick()}>Number History</span>
                  </Link>
                  <Link className="nav-dropdown-item" to="/history/account">
                    <i className="fa-solid fa-clock-rotate-left"></i>
                    Account History
                  </Link>

                  <span
                    className="nav-dropdown-item"
                    onClick={() => handleOpenModal(modalKeys.changePassword)}
                  >
                    <i className="fa-solid fa-lock"></i>
                    Change Password
                  </span>
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

  if (isAuthenticated && isAuthorized) {
    adminActionButtons = (
      <li>
        <Link to="/admin-dashboard/overview">
          <span onClick={() => handleNavClick()}>Dashboard</span>
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
          <li>
            <span onClick={() => handleNavClick("contact-us")}>Contact us</span>
          </li>
          {adminActionButtons}
          <li>
            <Link to="/topup">
              <span className="cyan med-bold" onClick={() => handleNavClick()}>
                Topup
              </span>
            </Link>
          </li>
          <li>
            <Link to="/get-number">
              <span className="cyan med-bold" onClick={() => handleNavClick()}>
                Buy number
              </span>
            </Link>
          </li>
          <li>
            <Link to="/get-account">
              <span className="cyan med-bold" onClick={() => handleNavClick()}>
                Buy account
              </span>
            </Link>
          </li>
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
