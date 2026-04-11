import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

//Services
import { resendOtp, verifyOtp } from "../../../services/Auth/AuthService";

//Toaster
import { errorToast, successTaost } from "../../../helper/Toaster";

//Helper
import { verificationPurpose } from "../../../data/Static";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const expiry = location.state?.expiry;

  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [hasError, setHasError] = useState(false);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(RESEND_COOLDOWN);
  const [resending, setResending] = useState(false);

  const inputRefs = useRef([]);

  // Guard: if no email in state, send back
  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  // Countdown timer for resend
  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const handleChange = (index, value) => {
    // Accept only single digit
    const cleaned = value.replace(/\D/g, "").slice(-1);

    const updated = [...digits];
    updated[index] = cleaned;
    setDigits(updated);
    setHasError(false);
    setServerError(false);

    // Advance focus
    if (cleaned && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        // Clear current
        const updated = [...digits];
        updated[index] = "";
        setDigits(updated);
      } else if (index > 0) {
        // Move to previous
        inputRefs.current[index - 1]?.focus();
      }
    }
    if (e.key === "ArrowLeft" && index > 0)
      inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1)
      inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    const updated = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((ch, i) => {
      updated[i] = ch;
    });
    setDigits(updated);
    // Focus last filled or last box
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = digits.join("");
    if (otp.length < OTP_LENGTH) {
      setHasError(true);
      return;
    }

    try {
      setLoading(true);
      const response = await verifyOtp({
        otp,
        verificationPurpose: verificationPurpose.forgotPassword,
      });

      if (response.isSuccess) {
        navigate("/forgot-password/reset-password", {
          state: { email, otp },
        });
      } else {
        setServerError(response.message);
        setHasError(true);
      }
    } catch (err) {
      errorToast(
        "Unable to connect. Please check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0 || resending) return;
    try {
      setResending(true);
      const response = await resendOtp({
        email,
        verificationPurpose: verificationPurpose.forgotPassword,
      });
      if (response.isSuccess) {
        setTimer(RESEND_COOLDOWN);
        setDigits(Array(OTP_LENGTH).fill(""));
        setHasError(false);
        inputRefs.current[0]?.focus();
        successTaost(response.message);
      } else {
        errorToast(response.message);
      }
    } catch (err) {
      console.error("Resend failed:", err);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="fp-container">
      <div className="fp-card">
        <div className="fp-step-dots">
          <span className="fp-dot filled" />
          <span className="fp-dot filled" />
          <span className="fp-dot" />
        </div>

        <div className="fp-icon-wrap">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect
              x="3"
              y="7"
              width="22"
              height="16"
              rx="3"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M3 10l11 7 11-7"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h1>Check your email</h1>
        <p className="fp-tagline">
          We sent a 6-digit code to{" "}
          <strong style={{ color: "var(--accent)" }}>{email}</strong>.<br />
          It expires in {expiry} minutes.
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
          <div className="otp-boxes" onPaste={handlePaste}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                className={`otp-box${hasError ? " otp-error" : ""}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                autoFocus={i === 0}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
              />
            ))}
          </div>

          <div className="otp-resend-row">
            Didn't receive it?
            <button
              type="button"
              className="resend-btn"
              onClick={handleResend}
              disabled={timer > 0 || resending}
            >
              {resending ? "Sending..." : "Resend code"}
            </button>
            {timer > 0 && <span className="otp-timer">in {timer}s</span>}
          </div>

          <button
            type="submit"
            className="fp-btn"
            disabled={loading || resending}
          >
            {loading ? "Verifying..." : "Verify →"}
          </button>
        </form>

        <div className="fp-footer">
          <Link to="/forgot-password">
            <span>← Change email</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
