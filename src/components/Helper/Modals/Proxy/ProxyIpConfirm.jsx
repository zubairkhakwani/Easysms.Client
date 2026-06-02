import { useState } from "react";
import { proxyIssueTypes } from "../../../../data/Static";
import "./ProxyIpConfirm.css";

export function ProxyIpConfirm({ onClose, onConfirm, isSubmitting }) {
  const [issueType, setIssueType] = useState("");
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState({});

  const isCustom = issueType === "5";

  function validate() {
    const e = {};
    if (!issueType) e.issueType = "Please select an issue type.";
    if (isCustom && !comment.trim())
      e.comment = "Please describe your custom issue.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleConfirm() {
    if (!validate()) return;
    onConfirm?.({ issueType, comment: comment.trim() });
  }

  return (
    <div className="pim-overlay">
      <div className="pim-modal" onClick={(e) => e.stopPropagation()}>
        <button className="pim-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className="pim-header">
          <div className="pim-icon-wrap">🛠️</div>
          <div className="pim-title">Report an Issue</div>
          <div className="pim-sub">
            Select the issue you are facing with your proxy.
          </div>
        </div>

        <div className="pim-form">
          {/* ── Issue Type ── */}
          <div className="pim-field">
            <label className="pim-label">
              Issue Type <span className="required">*</span>
            </label>
            <div
              className={`pim-select-wrap ${errors.issueType ? "pim-input-error" : ""}`}
            >
              <select
                className="pim-select"
                value={issueType}
                onChange={(e) => {
                  setIssueType(e.target.value);
                  setErrors((prev) => ({ ...prev, issueType: undefined }));
                }}
              >
                <option value="" disabled>
                  Select an issue...
                </option>
                {proxyIssueTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            {errors.issueType && (
              <span className="pim-field-error">{errors.issueType}</span>
            )}
          </div>

          {/* ── Comment (required only if Custom) ── */}
          <div className="pim-field">
            <label className="pim-label">
              Comment{" "}
              {isCustom ? (
                <span className="required">*</span>
              ) : (
                <span className="pim-label-optional">(optional)</span>
              )}
            </label>
            <div
              className={`pim-input-wrap ${errors.comment ? "pim-input-error" : ""}`}
            >
              <textarea
                className="pim-textarea"
                placeholder={
                  isCustom
                    ? "Please describe your custom issue..."
                    : "Any additional details..."
                }
                value={comment}
                rows={3}
                onChange={(e) => {
                  setComment(e.target.value);
                  setErrors((prev) => ({ ...prev, comment: undefined }));
                }}
              />
            </div>
            {errors.comment && (
              <span className="pim-field-error">{errors.comment}</span>
            )}
          </div>
        </div>

        <div className="pim-actions">
          <button className="pac-btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="pac-btn-primary" onClick={handleConfirm}>
            {isSubmitting ? (
              <div className="ph-spinner ph-spinner-thick ph-spinner--light" />
            ) : (
              "Submit Issue →"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
