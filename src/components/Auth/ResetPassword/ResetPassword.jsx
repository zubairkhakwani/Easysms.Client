//React
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

//Services
import { resetPassword } from "../../../services/Auth/AuthService";

//Toaster
import { errorToast } from "../../../helper/Toaster";

// import "./ForgotPassword.css";

function getStrength(pw) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0–4
}

const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
const strengthClass = [
  "",
  "active-weak",
  "active-weak",
  "active-fair",
  "active-strong",
];

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, otp } = location.state || {};

  const [formData, setFormData] = useState({ password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Guard: require email + otp from previous steps
  useEffect(() => {
    if (!email || !otp) navigate("/forgot-password");
  }, [email, otp, navigate]);

  const strength = getStrength(formData.password);

  const validate = (name, value, other = formData) => {
    const errs = { ...errors };
    if (name === "password") {
      if (!value) errs.password = "Password is required";
      else if (value.length < 8)
        errs.password = "Must be at least 8 characters";
      else delete errs.password;
      // Re-validate confirm if it has a value
      if (other.confirm && value !== other.confirm) {
        errs.confirm = "Passwords do not match";
      } else if (other.confirm) {
        delete errs.confirm;
      }
    }
    if (name === "confirm") {
      if (!value) errs.confirm = "Please confirm your password";
      else if (value !== other.password)
        errs.confirm = "Passwords do not match";
      else delete errs.confirm;
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    setErrors(validate(name, value, updated));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalErrors = {
      ...validate("password", formData.password, formData),
      ...validate("confirm", formData.confirm, formData),
    };
    if (Object.keys(finalErrors).length) {
      setErrors(finalErrors);
      return;
    }

    try {
      setLoading(true);
      const response = await resetPassword({
        email,
        otp,
        newPassword: formData.password,
        confirmPassword: formData.confirm,
      });

      if (response.isSuccess) {
        setSuccess(true);
      } else {
        errorToast(response.message);
      }
    } catch (err) {
      errorToast("Reset password failed");
    } finally {
      setLoading(false);
    }
  };

  // ── Success state ──────────────────────────────────────
  if (success) {
    return (
      <div className="fp-container">
        <div className="fp-card" style={{ textAlign: "center" }}>
          <div className="fp-success-icon">
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
              <circle
                cx="15"
                cy="15"
                r="13"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M9 15l4 4 8-8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1>Password updated!</h1>
          <p className="fp-tagline">
            Your password has been changed successfully. You can now log in with
            your new password.
          </p>
          <Link to="/login" style={{ display: "block" }}>
            <button className="fp-btn" style={{ width: "100%" }}>
              Back to login →
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // ── Form state ─────────────────────────────────────────
  return (
    <div className="fp-container">
      <div className="fp-card">
        <div className="fp-step-dots">
          <span className="fp-dot filled" />
          <span className="fp-dot filled" />
          <span className="fp-dot filled" />
        </div>

        <div className="fp-icon-wrap">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect
              x="4"
              y="11"
              width="20"
              height="14"
              rx="3"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M9 11V8a5 5 0 0 1 10 0v3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="14" cy="18" r="1.5" fill="currentColor" />
          </svg>
        </div>

        <h1>Set new password</h1>
        <p className="fp-tagline">
          Create a strong password you haven't used before.
        </p>

        <form className="fp-form" onSubmit={handleSubmit}>
          {/* New password */}
          <div className="form-group">
            <label>New password</label>
            <div className="password-container">
              <input
                type={showPw ? "text" : "password"}
                name="password"
                placeholder="Enter new password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "input-error" : ""}
                autoComplete="new-password"
                autoFocus
              />
              <i
                className={`fa-solid ${showPw ? "fa-eye" : "fa-eye-slash"} eye`}
                onClick={() => setShowPw((p) => !p)}
              />
            </div>

            {/* Strength bar */}
            {formData.password && (
              <>
                <div className="strength-bar-wrap">
                  {[1, 2, 3, 4].map((seg) => (
                    <div
                      key={seg}
                      className={`strength-seg${strength >= seg ? ` ${strengthClass[strength]}` : ""}`}
                    />
                  ))}
                </div>
                <span className="strength-label">
                  {strengthLabel[strength]}
                </span>
              </>
            )}

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
          </div>

          {/* Confirm password */}
          <div className="form-group">
            <label>Confirm password</label>
            <div className="password-container">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirm"
                placeholder="Re-enter new password"
                value={formData.confirm}
                onChange={handleChange}
                className={errors.confirm ? "input-error" : ""}
                autoComplete="new-password"
              />
              <i
                className={`fa-solid ${showConfirm ? "fa-eye" : "fa-eye-slash"} eye`}
                onClick={() => setShowConfirm((p) => !p)}
              />
            </div>
            {errors.confirm && (
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
                {errors.confirm}
              </span>
            )}
          </div>

          <button type="submit" className="fp-btn" disabled={loading}>
            {loading ? "Updating..." : "Update password →"}
          </button>
        </form>
      </div>
    </div>
  );
}
