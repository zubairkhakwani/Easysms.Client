import { useState } from "react";
import { registerUser } from "../../services/Auth/AuthService";
import { toast, Slide } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

import "./Register.css";

const InfoIcon = ({ tooltip }) => {
  const [visible, setVisible] = useState(false);

  return (
    <span
      className="info-icon-wrapper"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <svg
        className="info-icon"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M10 9v5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="10" cy="6.5" r="0.75" fill="currentColor" />
      </svg>
      {visible && (
        <span className="tooltip">
          <span className="tooltip-arrow" />
          {tooltip}
        </span>
      )}
    </span>
  );
};

export default function Register() {
  var navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({ name: "", email: "", password: "" });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
  });
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisibile] = useState(false);

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allTouched = { name: true, email: true, password: true };
    const allErrors = {
      name: validate("name", formData.name),
      email: validate("email", formData.email),
      password: validate("password", formData.password),
    };
    setTouched(allTouched);
    setErrors(allErrors);

    if (Object.values(allErrors).some(Boolean)) {
      return;
    }

    setLoading(true);

    let response = await registerUser(formData);
    let responseMessage = response.message;
    if (response.isSuccess) {
      toast(responseMessage, {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Slide,
      });
      navigate("/login");
    } else {
      toast.error(responseMessage, {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Slide,
      });
    }

    setLoading(false);
  };

  const validate = (name, value) => {
    switch (name) {
      case "name":
        if (!value) return "Name is required.";
        if (value.length < 3) return "Name must be at least 3 characters.";
        if (value.length > 25) return "Name must be 25 characters or fewer.";
        return "";
      case "email":
        if (!value) return "Email is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Enter a valid email address.";
        return "";
      case "password":
        if (!value) return "Password is required.";
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(value))
          return "Must include uppercase, lowercase, and a number.";
        if (value.length < 8) return "Password must be at least 8 characters.";
        return "";
      default:
        return "";
    }
  };

  function handlePasswordVisibility() {
    setPasswordVisibile((prev) => !prev);
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>Create Account</h1>
        <p className="register-tagline">
          Secure. Simple. Instant SMS verification.
        </p>

        <form className="register-form" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="form-group">
            <div className="form-label-row">
              <label>Name</label>
              <InfoIcon tooltip="Name must be between 3 and 25 characters." />
            </div>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.name && touched.name ? "input-error" : ""}
            />
            {errors.name && touched.name && (
              <span className="error-msg">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle
                    cx="6"
                    cy="6"
                    r="5.25"
                    stroke="#ff5f7e"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M6 3.5v3"
                    stroke="#ff5f7e"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <circle cx="6" cy="8.25" r="0.6" fill="#ff5f7e" />
                </svg>
                {errors.name}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="form-group">
            <div className="form-label-row">
              <label>Email</label>
            </div>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.email && touched.email ? "input-error" : ""}
            />
            {errors.email && touched.email && (
              <span className="error-msg">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle
                    cx="6"
                    cy="6"
                    r="5.25"
                    stroke="#ff5f7e"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M6 3.5v3"
                    stroke="#ff5f7e"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <circle cx="6" cy="8.25" r="0.6" fill="#ff5f7e" />
                </svg>
                {errors.email}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <div className="form-label-row">
              <label>Password</label>
              <InfoIcon
                tooltip={"Must contain uppercase, lowercase & a number."}
              />
            </div>
            <div className="password-container">
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={
                  errors.password && touched.password ? "input-error" : ""
                }
              />
              {passwordVisible ? (
                <i
                  className="fa-solid fa-eye  eye show-password"
                  onClick={handlePasswordVisibility}
                ></i>
              ) : (
                <i
                  className="fa-solid fa-eye-slash eye hide-password"
                  onClick={handlePasswordVisibility}
                ></i>
              )}
            </div>

            {errors.password && touched.password && (
              <span className="error-msg">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle
                    cx="6"
                    cy="6"
                    r="5.25"
                    stroke="#ff5f7e"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M6 3.5v3"
                    stroke="#ff5f7e"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <circle cx="6" cy="8.25" r="0.6" fill="#ff5f7e" />
                </svg>
                {errors.password}
              </span>
            )}
          </div>

          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? "Please wait.." : "Sign Up →"}
          </button>
        </form>

        <div className="register-footer">
          Already have an account?
          <Link to="/login">
            <span>Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
