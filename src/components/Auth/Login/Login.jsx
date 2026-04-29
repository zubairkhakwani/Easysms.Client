import { errorToast } from "../../../helper/Toaster";
import { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";

import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../../services/Auth/AuthService";

import "./Login.css";

export default function Login() {
  var navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [passwordVisible, setPasswordVisibile] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedFormData = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedFormData);

    validateField(name, value);
  };

  function validateField(name, value) {
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };

      if (name === "email") {
        if (!value) newErrors.email = "Email is required";
        else delete newErrors.email;
      }

      if (name === "password") {
        if (!value) newErrors.password = "Password is required";
        else delete newErrors.password;
      }

      return newErrors;
    });
  }

  function validateRequest(data) {
    let errors = {};

    if (data.email.length === 0) {
      errors.email = "Email is required";
    }
    if (data.password.length === 0) {
      errors.password = "Password is required";
    }

    setErrors(errors);

    return Object.keys(errors).length === 0;
  }

  function handlePasswordVisibility() {
    setPasswordVisibile((prev) => !prev);
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    let result = validateRequest(formData);
    if (!result) return;

    try {
      setLoading(true);

      let response = await loginUser(formData);
      let data = response.data;
      var responseMessage = response.message;

      if (response.isSuccess) {
        //Update authentication state
        await login(data.token);
        navigate("/get-number");
      } else {
        errorToast(responseMessage);
      }
    } catch (error) {
      errorToast("Failed to login, please try later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Welcome Back</h1>
        <p className="login-tagline">Login to manage your SMS verifications.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "input-error" : ""}
              autoComplete="email"
            />
            {errors.email && (
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

          <div className="form-group">
            <label>
              Password <span className="required">*</span>
            </label>
            <div>
              <div className="password-container">
                <input
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Enter your password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "input-error" : ""}
                  autoComplete="current-password"
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
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                {errors.password && (
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
                <div className="forgot-link-row">
                  <Link to="/forgot-password">Forgot password?</Link>
                </div>
              </div>
            </div>
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <div className="ph-spinner ph-spinner-thick ph-spinner--light" />
            ) : (
              "Log in →"
            )}
          </button>
        </form>

        <div className="login-footer">
          Don’t have an account?
          <Link to="/register">
            <span>Sign Up</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
