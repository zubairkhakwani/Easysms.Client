//React
import { useState } from "react";

//Helper
import { modalKeys } from "../../../../data/Static";

export function AccountGroupModal({
  onClose,
  onConfirm,
  onPlatformChange,
  isSubmitting,
  lookups,
}) {
  const [formData, setFormData] = useState({
    description: "",
    platformId: "",
    categoryId: "",
    unitPrice: "",
    gender: "",
    completionStatus: "",
    registrationMethod: "",
    registrationCountry: "",
    isMarketplaceNumberVerified: false,
    marketplaceVerificationCountry: "",
    hasRegistrationData: false,
    hasCookie: false,
    hasTwoFactorKey: false,
  });
  const set = (field) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlatformChange = (value) => {
    setFormData((prev) => ({ ...prev, ["platformId"]: value }));
    onPlatformChange(value);
  };

  const isValid =
    formData.unitPrice &&
    formData.unitPrice > 0 &&
    formData.platformId &&
    formData.categoryId &&
    formData.gender &&
    formData.completionStatus &&
    formData.registrationCountry &&
    (!formData.isMarketplaceNumberVerified ||
      formData.marketplaceVerificationCountry);

  const CheckRow = ({ label, field }) => (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        fontSize: "0.88rem",
        cursor: "pointer",
        padding: "0.25rem 0",
      }}
    >
      <input
        type="checkbox"
        checked={formData[field]}
        onChange={set(field)}
        style={{ accentColor: "#4f8ef7", width: 15, height: 15 }}
      />
      {label}
    </label>
  );

  return (
    <div
      className="um-overlay"
      onClick={() => onClose(modalKeys.newAccountGroup)}
    >
      <div className="um-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="um-close-btn"
          onClick={() => onClose(modalKeys.newAccountGroup)}
        >
          ✕
        </button>
        <div className="um-modal-title">Add New Account Group</div>

        {/* ── Basic Info ── */}
        <div className="um-form-group" style={{ marginTop: "1rem" }}>
          <label className="um-label">
            Description{" "}
            <span style={{ color: "#aaa", fontWeight: 400 }}>(optional)</span>
          </label>
          <textarea
            className="um-input"
            placeholder="Short description..."
            value={formData.description}
            onChange={set("description")}
            rows={2}
            style={{ resize: "vertical" }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.75rem",
          }}
        >
          <div className="um-form-group">
            <label className="um-label">
              Platform <span style={{ color: "red" }}>*</span>
            </label>
            <select
              className="um-input"
              value={formData.platformId}
              onChange={(e) => handlePlatformChange(e.target.value)}
            >
              <option value="0">Select platform...</option>
              {lookups.platforms?.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div className="um-form-group">
            <label className="um-label">
              Category <span style={{ color: "red" }}>*</span>
            </label>
            <select
              className="um-input"
              value={formData.categoryId}
              onChange={set("categoryId")}
            >
              <option value="">Select category...</option>
              {lookups.categories?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="um-form-group">
          <label className="um-label">
            Unit Price <span style={{ color: "red" }}>*</span>
          </label>
          <input
            className="um-input"
            type="number"
            min={0}
            step="0.01"
            placeholder="0.00"
            value={formData.unitPrice}
            onChange={set("unitPrice")}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.75rem",
          }}
        >
          <div className="um-form-group">
            <label className="um-label">
              Gender <span style={{ color: "red" }}>*</span>
            </label>
            <select
              className="um-input"
              value={formData.gender}
              onChange={set("gender")}
            >
              <option value="">Select gender...</option>
              {lookups.genders?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="um-form-group">
            <label className="um-label">
              Account Completion <span style={{ color: "red" }}>*</span>
            </label>
            <select
              className="um-input"
              value={formData.completionStatus}
              onChange={set("completionStatus")}
            >
              <option value="">Select status...</option>
              {lookups.completionStatus?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="um-form-group">
          <label className="um-label">Registration Method</label>
          <select
            className="um-input"
            value={formData.registrationMethod}
            onChange={set("registrationMethod")}
          >
            <option value="">Select registration method...</option>
            {lookups.registrationMethods?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="um-form-group">
          <label className="um-label">
            Registration Country <span style={{ color: "red" }}>*</span>
          </label>
          <input
            className="um-input"
            type="text"
            placeholder="e.g. Canada"
            value={formData.registrationCountry}
            onChange={set("registrationCountry")}
          />
        </div>

        <CheckRow label="Has Cookie" field="hasCookie" />
        <CheckRow label="Has 2FA" field="hasTwoFactorKey" />
        <CheckRow label="Has Registration Data" field="hasRegistrationData" />
        <CheckRow
          label="Marketplace Number Verified"
          field="isMarketplaceNumberVerified"
        />

        {formData.isMarketplaceNumberVerified && (
          <div className="um-form-group" style={{ marginTop: "1rem" }}>
            <label className="um-label">
              Marketplace number verfied country{" "}
              <span style={{ color: "red" }}>*</span>
            </label>
            <input
              className="um-input"
              type="text"
              placeholder="e.g. Canada"
              value={formData.marketplaceVerificationCountry}
              onChange={set("marketplaceVerificationCountry")}
            />
          </div>
        )}

        {/* ── Actions ── */}
        <div className="um-modal-actions" style={{ marginTop: "1.5rem" }}>
          <button
            className="um-btn ghost"
            onClick={() => onClose(modalKeys.newAccountGroup)}
          >
            Cancel
          </button>
          <button
            className={`um-btn ${!isSubmitting ? "primary" : ""}`}
            disabled={isSubmitting || !isValid}
            onClick={() => onConfirm(formData)}
          >
            {isSubmitting ? <div className="ph-spinner" /> : <span>Add</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
