//React
import { useState } from "react";

//Service
import { submit } from "../../../services/ContactUs/ContactUsService";

//Toaster
import { successTaost, errorToast } from "../../../helper/Toaster";

//Static
import { ContactUsSubjects } from "../../../data/Static";

//Css
import "./ContactUs.css";

function validate(fields) {
  const errors = {};
  if (!fields.firstName.trim()) errors.firstName = "First name is required";
  if (!fields.lastName.trim()) errors.lastName = "Last name is required";
  if (!fields.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = "Enter a valid email address";
  }
  if (!fields.subject) errors.subject = "Please select a subject";
  if (!fields.message.trim()) {
    errors.message = "Message is required";
  } else if (fields.message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters";
  }
  return errors;
}

export default function ContactUs() {
  const [fields, setFields] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async () => {
    const validationErrors = validate(fields);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      var response = await submit(fields);

      if (response.isSuccess) {
        successTaost(response.message);

        setSubmitted(true);

        setTimeout(() => {
          setSubmitted(false);
        }, 3000);
      }
    } catch {
      errorToast("Failed to submit form, please try later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cf-page" id="contact-us">
      <div className="cf-wrapper">
        {/* Header */}
        <div className="cf-header">
          <h1 className="cf-title">
            Get in <span>touch</span>
          </h1>
          <p className="cf-subtitle">
            Have a question or need help? Fill out the form and we'll get back
            to you within 24 hours.
          </p>
        </div>

        {/* Card */}
        <div className="cf-card">
          {submitted ? (
            <div className="cf-success">
              <div className="cf-success-icon">✓</div>
              <h2 className="cf-success-title">Message sent!</h2>
              <p className="cf-success-sub">
                Thanks for reaching out. We'll be in touch shortly.
              </p>
            </div>
          ) : (
            <>
              {/* Name row */}
              <div className="cf-row">
                <div className="cf-field">
                  <label className="cf-label">
                    First Name <span className="cf-label-required">*</span>
                  </label>
                  <div className="cf-input-wrap">
                    <span className="cf-input-icon">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </span>
                    <input
                      className={`cf-input${errors.firstName ? " error" : ""}`}
                      type="text"
                      name="firstName"
                      placeholder="John"
                      value={fields.firstName}
                      onChange={handleChange}
                      autoComplete="given-name"
                    />
                  </div>
                  {errors.firstName && (
                    <span className="cf-error-msg">⚠ {errors.firstName}</span>
                  )}
                </div>

                <div className="cf-field">
                  <label className="cf-label">
                    Last Name <span className="cf-label-required">*</span>
                  </label>
                  <div className="cf-input-wrap">
                    <span className="cf-input-icon">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </span>
                    <input
                      className={`cf-input${errors.lastName ? " error" : ""}`}
                      type="text"
                      name="lastName"
                      placeholder="Doe"
                      value={fields.lastName}
                      onChange={handleChange}
                      autoComplete="family-name"
                    />
                  </div>
                  {errors.lastName && (
                    <span className="cf-error-msg">⚠ {errors.lastName}</span>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="cf-field">
                <label className="cf-label">
                  Email Address <span className="cf-label-required">*</span>
                </label>
                <div className="cf-input-wrap">
                  <span className="cf-input-icon">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="M2 7l10 7 10-7" />
                    </svg>
                  </span>
                  <input
                    className={`cf-input${errors.email ? " error" : ""}`}
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    value={fields.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <span className="cf-error-msg">⚠ {errors.email}</span>
                )}
              </div>

              {/* Subject */}
              <div className="cf-field">
                <label className="cf-label">
                  Subject <span className="cf-label-required">*</span>
                </label>
                <div className="cf-input-wrap cf-select-wrap">
                  <span className="cf-input-icon">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </span>
                  <select
                    className={`cf-select${errors.subject ? " error" : ""}`}
                    name="subject"
                    value={fields.subject}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Select a subject…
                    </option>
                    {ContactUsSubjects.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <span className="cf-select-arrow">▾</span>
                </div>
                {errors.subject && (
                  <span className="cf-error-msg">⚠ {errors.subject}</span>
                )}
              </div>

              {/* Message */}
              <div className="cf-field">
                <label className="cf-label">
                  Message <span className="cf-label-required">*</span>
                </label>
                <div className="cf-input-wrap">
                  <span
                    className="cf-input-icon"
                    style={{ top: "14px", alignItems: "flex-start" }}
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                    </svg>
                  </span>
                  <textarea
                    className={`cf-textarea${errors.message ? " error" : ""}`}
                    name="message"
                    placeholder="Tell us how we can help you…"
                    value={fields.message}
                    onChange={handleChange}
                    rows={5}
                  />
                </div>
                {errors.message && (
                  <span className="cf-error-msg">⚠ {errors.message}</span>
                )}
              </div>

              <div className="cf-divider" />

              {/* Submit */}
              <button
                className="cf-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="cf-btn-spinner" />
                    Sending…
                  </>
                ) : (
                  <>
                    Send Message
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
