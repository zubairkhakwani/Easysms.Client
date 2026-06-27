import { useState } from "react";
import "../../ContactUs/Modal/ToggleMessageReadModal.css";

function toDateString(date) {
  return date.toLocaleDateString("en-CA");
}

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const minExpiryDateString = toDateString(tomorrow);

function normalizeExpiryInput(value) {
  if (!value) return "";
  const trimmed = String(value).trim();
  const isoDateOnly = trimmed.match(/^(\d{4}-\d{2}-\d{2})/);
  return isoDateOnly ? isoDateOnly[1] : trimmed;
}

export default function UpdatePhysicalNumberExpiryModal({
  expiresAt,
  onClose,
  onConfirm,
  isLoading,
}) {
  const [selectedExpiry, setSelectedExpiry] = useState(
    normalizeExpiryInput(expiresAt),
  );

  const isValid =
    selectedExpiry && selectedExpiry >= minExpiryDateString;

  return (
    <div className="cm-overlay" onClick={onClose}>
      <div className="cm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cm-icon-wrap success">
          <span className="cm-icon">📅</span>
        </div>

        <h2 className="cm-title">Update expiry date</h2>
        <p className="cm-sub">
          Choose a new expiry date for this physical number. The number expires
          on that date.
        </p>

        <input
          className="price-input"
          type="date"
          min={minExpiryDateString}
          value={selectedExpiry}
          onChange={(e) => setSelectedExpiry(e.target.value)}
          style={{ width: "100%", marginTop: "1rem" }}
        />

        {!isValid && (
          <p className="cm-sub" style={{ marginTop: "0.5rem", color: "var(--text-error)" }}>
            Expiry must be after today.
          </p>
        )}

        <div className="cm-actions">
          <button className="cm-btn ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </button>
          <button
            className="cm-btn success"
            onClick={() => onConfirm(selectedExpiry)}
            disabled={isLoading || !isValid}
          >
            {isLoading ? <span className="cm-spinner" /> : "Save expiry"}
          </button>
        </div>
      </div>
    </div>
  );
}
