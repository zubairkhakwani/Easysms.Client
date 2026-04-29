//React
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

//Password Strength Bar
import StrengthBar from "../../Helper/Auth/StrengthBar";

//Services
import { registerUser } from "../../../services/Auth/AuthService";

//Toaster
import { errorToast, successTaost } from "../../../helper/Toaster";

//Modal
import PhoneNudgeModal from "../../Helper/Auth/Modals/PhoneNudgeModal";

//Css
import "./Register.css";
import Tooltip from "../../../portal/Tooltip";

export default function Register() {
  var navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    phoneNumber: false,
  });
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisibile] = useState(false);
  const [showPhoneNudge, setShowPhoneNudge] = useState(false);

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
    const allTouched = {
      name: true,
      email: true,
      password: true,
      phoneNumber: true,
    };
    const allErrors = {
      name: validate("name", formData.name),
      email: validate("email", formData.email),
      password: validate("password", formData.password),
      phoneNumber: validate("phoneNumber", formData.phoneNumber),
    };
    setTouched(allTouched);
    setErrors(allErrors);

    if (Object.values(allErrors).some(Boolean)) {
      return;
    }

    if (!formData.phoneNumber) {
      setShowPhoneNudge(true);
      return;
    }

    await handleRegisterUser();
  };

  function handleOnAddPhone() {
    setShowPhoneNudge(false);
  }

  async function handleSkipPhone() {
    setShowPhoneNudge(false);
    await handleRegisterUser();
  }

  async function handleRegisterUser() {
    setLoading(true);
    try {
      let response = await registerUser(formData);
      let responseMessage = response.message;
      if (response.isSuccess) {
        successTaost(responseMessage);
        navigate("/login");
      } else {
        if (response.data && response.data.errorKey) {
          setErrors({ [response.data.errorKey]: responseMessage });
        }
      }
    } catch {
      errorToast("Failed to register, please try later.");
    } finally {
      setLoading(false);
    }
  }

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
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9])/.test(value))
          return "Must include uppercase, lowercase, a number, and a special character e.g (!@#$%^&*).";
        if (value.length < 8) return "Password must be at least 8 characters.";
        return "";
      case "phoneNumber":
        if (!value) return "";
        if (!/^\+?[0-9]{7,15}$/.test(value))
          return "Enter a valid phone number.";
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
              <label>
                Name <span className="required">*</span>
              </label>
              <Tooltip tooltip="Name must be between 3 and 25 characters." />
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
              <label>
                Email <span className="required">*</span>
              </label>

              <Tooltip tooltip="Enter valid email address." />
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
              <label>
                Password <span className="required">*</span>
              </label>
              <Tooltip
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
                autoComplete="new-password"
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
            {formData.password && <StrengthBar password={formData.password} />}
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

          {/* Phone Number (Optional) */}
          <div className="form-group">
            <div className="form-label-row">
              <label>Whatsapp Number</label>
              <Tooltip tooltip="Optional. Enter a valid phone number." />
            </div>

            <input
              type="text"
              name="phoneNumber"
              placeholder="Enter phone number"
              value={formData.phoneNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              className={
                errors.phoneNumber && touched.phoneNumber ? "input-error" : ""
              }
            />

            {errors.phoneNumber && touched.phoneNumber && (
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
                {errors.phoneNumber}
              </span>
            )}
          </div>

          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? <div className="ph-spinner" /> : "Sign Up →"}
          </button>
        </form>

        <div className="register-footer">
          Already have an account?
          <Link to="/login">
            <span>Login</span>
          </Link>
        </div>
      </div>
      {showPhoneNudge && (
        <PhoneNudgeModal
          onAddPhone={handleOnAddPhone}
          onSkip={handleSkipPhone}
        />
      )}
    </div>
  );
}
