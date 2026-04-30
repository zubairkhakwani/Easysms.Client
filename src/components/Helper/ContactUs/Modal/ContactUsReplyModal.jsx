import { useState } from "react";
import "./ContactUsReplyModal.css";

function ContactUsReplyModal({ query, onClose, onConfirm, isLoading }) {
  const [fields, setFields] = useState({
    title: "",
    body: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!fields.title.trim()) errs.title = "Reply title is required";
    if (!fields.body.trim()) errs.body = "Reply message is required";
    else if (fields.body.trim().length < 10)
      errs.body = "Reply must be at least 10 characters";
    return errs;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onConfirm({ ...fields });
  };

  return (
    <div className="rcq-overlay" onClick={onClose}>
      <div className="rcq-modal" onClick={(e) => e.stopPropagation()}>
        {/* ── Header ── */}
        <div className="rcq-header">
          <div className="rcq-icon-wrap">
            <span className="rcq-icon">✉️</span>
          </div>
          <div>
            <h2 className="rcq-title">Reply to Query</h2>
            <p className="rcq-subtitle">
              This reply will be sent directly to the user via email
            </p>
          </div>
        </div>

        {/* ── Replying To ── */}
        <div className="rcq-recipient">
          <span className="rcq-recipient-label">Replying to</span>
          <div className="rcq-recipient-info">
            <span className="rcq-recipient-name">{query.name}</span>
            <span className="rcq-recipient-dot" />
            <span className="rcq-recipient-email">{query.email}</span>
          </div>
        </div>

        {/* ── Original Query Reference ── */}
        <div className="rcq-reference">
          <div className="rcq-reference-header">📋 Original Query</div>
          <div className="rcq-reference-subject">
            <span className="rcq-ref-label">Subject:</span>
            <span className="rcq-ref-value">{query.subject}</span>
          </div>
          <div className="rcq-reference-message">
            <span className="rcq-ref-label">Message:</span>
            <p className="rcq-ref-preview">{query.message}</p>
          </div>
        </div>

        {/* ── Reply Title ── */}
        <div className="rcq-field">
          <label className="rcq-label">
            Reply Title <span className="rcq-required">*</span>
          </label>
          <input
            className={`rcq-input${errors.title ? " error" : ""}`}
            type="text"
            name="title"
            placeholder="e.g. Regarding your balance inquiry"
            value={fields.title}
            onChange={handleChange}
          />
          {errors.title && (
            <span className="rcq-error-msg">⚠ {errors.title}</span>
          )}
        </div>

        {/* ── Reply Body ── */}
        <div className="rcq-field">
          <label className="rcq-label">
            Reply Message <span className="rcq-required">*</span>
          </label>
          <textarea
            className={`rcq-textarea${errors.body ? " error" : ""}`}
            name="body"
            placeholder="Write your reply here…"
            value={fields.body}
            onChange={handleChange}
            rows={5}
          />
          {errors.body && (
            <span className="rcq-error-msg">⚠ {errors.body}</span>
          )}
        </div>

        {/* ── Actions ── */}
        <div className="rcq-actions">
          <button
            className="rcq-btn ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="rcq-btn primary"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="rcq-spinner" />
            ) : (
              <>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
                Send Reply
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ContactUsReplyModal;
