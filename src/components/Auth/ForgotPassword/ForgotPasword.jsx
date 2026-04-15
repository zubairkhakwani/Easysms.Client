import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

//Services
import { forgotPassword } from "../../../services/Auth/AuthService";

//Css
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  function validate(value) {
    if (!value) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(value)) return "Enter a valid email address";
    return "";
  }

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError(validate(e.target.value));
    if (serverError) setServerError(""); // clear server error on new input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate(email);
    if (err) {
      setError(err);
      return;
    }

    try {
      setLoading(true);
      setServerError("");
      const response = await forgotPassword({ email });
      console.log(response);
      let responseMessage = response.message;
      if (response.isSuccess) {
        let responseEmail = response.data.email;
        let responseExpiry = response.data.expiryTime;

        navigate("/forgot-password/verify-otp", {
          state: {
            email: responseEmail,
            expiry: responseExpiry,
            message: responseMessage,
          },
        });
      } else {
        setServerError(responseMessage);
      }
    } catch {
      setServerError(
        "Unable to connect. Please check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fp-container">
      <div className="fp-card">
        <div className="fp-step-dots">
          <span className="fp-dot filled" />
          <span className="fp-dot" />
          <span className="fp-dot" />
        </div>

        <div className="fp-icon-wrap">
          <i className="fa-solid fa-circle-question"></i>
        </div>

        <h1>Forgot Password?</h1>
        <p className="fp-tagline">
          No worries. Enter your email and we'll send you a one-time code.
        </p>

        {/* Server-level error banner */}
        {serverError && (
          <div className="fp-server-error">
            <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
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
            {serverError}
          </div>
        )}

        <form className="fp-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              Email<span style={{ color: "red", marginLeft: "2px" }}>*</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              name="email"
              value={email}
              onChange={handleChange}
              className={error || serverError ? "input-error" : ""}
              autoComplete="email"
              autoFocus
            />
            {error && (
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
                {error}
              </span>
            )}
          </div>

          <button type="submit" className="fp-btn" disabled={loading}>
            {loading ? "Sending code..." : "Send OTP →"}
          </button>
        </form>

        <div className="fp-footer">
          Remember it?
          <Link to="/login">
            <span>Back to login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
