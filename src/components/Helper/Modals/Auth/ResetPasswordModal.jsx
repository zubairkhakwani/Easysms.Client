//React
import { useState } from "react";

import StrengthBar from "../../Auth/StrengthBar";

//Css
import "./ResetPasswordModal.css";

function ResetPasswordModal({ isLoading, onClose, onConfirm }) {
  const [fields, setFields] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [errors, setErrors] = useState({});

  const toggleVisibility = (field) =>
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));

  const validate = () => {
    const newErrors = {};
    if (!fields.currentPassword)
      newErrors.currentPassword = "Current password is required.";
    if (!fields.newPassword) {
      newErrors.newPassword = "New password is required.";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9])/.test(
        fields.newPassword,
      )
    ) {
      newErrors.newPassword =
        "Must include uppercase, lowercase, a number, and a special character.";
    } else if (fields.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters.";
    }
    if (!fields.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password.";
    } else if (fields.newPassword !== fields.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    return newErrors;
  };

  const handleChange = (field, value) => {
    setFields((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onConfirm({
      currentPassword: fields.currentPassword,
      newPassword: fields.newPassword,
      confirmPassword: fields.confirmPassword,
    });
  };

  const inputFields = [
    {
      key: "currentPassword",
      label: "Current Password",
      placeholder: "Enter current password",
    },
    {
      key: "newPassword",
      label: "New Password",
      placeholder: "Enter new password",
    },
    {
      key: "confirmPassword",
      label: "Confirm Password",
      placeholder: "Repeat new password",
    },
  ];

  return (
    <div className="rp-overlay" onClick={onClose}>
      <div className="rp-modal" onClick={(e) => e.stopPropagation()}>
        <button className="rp-close-btn" onClick={onClose}>
          ✕
        </button>

        <div className="rp-header">
          <div className="rp-title">🔐 Reset Password</div>
        </div>

        {inputFields.map(({ key, label, placeholder }) => (
          <div className="rp-field" key={key}>
            <label className="rp-label">{label}</label>
            <div className="rp-input-wrap">
              <input
                className={`rp-input ${errors[key] ? "error" : ""}`}
                type={showPasswords[key] ? "text" : "password"}
                placeholder={placeholder}
                value={fields[key]}
                onChange={(e) => handleChange(key, e.target.value)}
              />
              <button
                className="rp-toggle-btn"
                onClick={() => toggleVisibility(key)}
                type="button"
              >
                {showPasswords[key] ? (
                  <i className="fa-solid fa-eye "></i>
                ) : (
                  <i className="fa-solid fa-eye-slash "></i>
                )}
              </button>
            </div>

            {key === "newPassword" && fields.newPassword && (
              <StrengthBar password={fields.newPassword} />
            )}

            {errors[key] && (
              <div className="rp-error">
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
                {errors[key]}
              </div>
            )}
          </div>
        ))}

        <div className="rp-actions">
          <button className="rp-btn ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="rp-btn primary"
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? <div className="rp-spinner" /> : "Update Password"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordModal;
