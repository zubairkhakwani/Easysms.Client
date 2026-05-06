//React
import { useState } from "react";

//Helper
import { modalKeys } from "../../../../data/Static";

//Component
import { PlatformDynamicFields } from "./PlatformsDynamicFields";

export function UpsertAccountGroupModal({
  onClose,
  onConfirm,
  onPlatformChange,
  isSubmitting,
  lookups,
  accountGroupConfig,
}) {
  const [formData, setFormData] = useState({
    description: accountGroupConfig.description,
    customTitle: accountGroupConfig.customTitle,
    platformId: accountGroupConfig.platformId,
    categoryId: accountGroupConfig.categoryId,
    purchasePrice: accountGroupConfig.purchasePrice,
    salePrice: accountGroupConfig.salePrice,
    hasCookie: accountGroupConfig.hasCookie,
    hasTwoFactorKey: accountGroupConfig.hasTwoFactorKey,
    showCustomTitle: accountGroupConfig.showCustomTitle,
    platformFields: {},
  });
  const numericFields = [
    "platformId",
    "categoryId",
    "purchasePrice",
    "salePrice",
  ];

  const set = (field) => (e) => {
    let value;
    if (e.target.type === "checkbox") {
      value = e.target.checked;
    } else {
      const raw = e.target.value;

      if (numericFields.includes(field)) {
        value = raw === "" ? "" : parseFloat(raw);
      } else {
        value = raw;
      }
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlatformChange = (value) => {
    setFormData((prev) => ({ ...prev, ["platformId"]: Number(value) }));
    onPlatformChange(value);
  };

  const validatePlatformFields = (configuration, values) => {
    if (!configuration) return true;

    let fields = [];

    try {
      const parsed =
        typeof configuration === "string"
          ? JSON.parse(configuration)
          : configuration;

      if (Array.isArray(parsed)) fields = parsed;
    } catch {
      return true;
    }

    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];

      if (!field.required) continue;

      const key = field.value || field.label || String(i);
      const value = values[key];

      switch (field.type) {
        case "checkbox":
          if (!value) return false;
          break;

        default:
          if (value === undefined || value === null || value === "")
            return false;
      }
    }

    return true;
  };

  const dynamicValid = validatePlatformFields(
    lookups.platformConfiguration,
    formData.platformFields,
  );

  const isValid =
    formData.purchasePrice &&
    formData.salePrice &&
    formData.purchasePrice > 0 &&
    formData.salePrice > 0 &&
    formData.salePrice >= formData.purchasePrice &&
    formData.platformId &&
    formData.categoryId &&
    dynamicValid;

  const isEdit = accountGroupConfig.accountGroupId > 0;

  const CheckRow = ({ label, field, isDisabled }) => (
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
        disabled={isDisabled}
        onChange={set(field)}
        style={{ accentColor: "#4f8ef7", width: 15, height: 15 }}
      />
      {label}
    </label>
  );

  return (
    <div className="um-overlay">
      <div className="um-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="um-close-btn"
          onClick={() =>
            onClose(
              isEdit ? modalKeys.updateAccountGroup : modalKeys.addAccountGroup,
            )
          }
        >
          ✕
        </button>
        <div className="um-modal-title">
          {isEdit ? "Edit" : "Add New"} Account Group
        </div>

        {/* ── Basic Info ── */}
        <div className="um-form-group" style={{ marginTop: "1rem" }}>
          <label className="um-label">Description </label>
          <textarea
            className="um-input"
            placeholder="Short description..."
            value={formData.description}
            onChange={set("description")}
            rows={2}
            style={{ resize: "vertical" }}
          />
        </div>
        <div className="um-form-group" style={{ marginTop: "1rem" }}>
          <label className="um-label">Custom Title </label>
          <textarea
            className="um-input"
            placeholder="Facebook accounts with included cookies..."
            value={formData.customTitle}
            onChange={set("customTitle")}
            rows={4}
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
              disabled={isEdit}
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

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.75rem",
          }}
        >
          <div className="um-form-group">
            <label className="um-label">
              Purchase Price <span style={{ color: "red" }}>*</span>
            </label>
            <input
              className="um-input"
              type="number"
              min={0}
              step="0.01"
              placeholder="0.00"
              value={formData.purchasePrice}
              onChange={set("purchasePrice")}
            />
          </div>
          <div className="um-form-group">
            <label className="um-label">
              Sale Price <span style={{ color: "red" }}>*</span>
            </label>
            <input
              className="um-input"
              type="number"
              min={0}
              step="0.01"
              placeholder="0.00"
              value={formData.salePrice}
              onChange={set("salePrice")}
            />
          </div>
        </div>

        <CheckRow label="Has Cookie" field="hasCookie" isDisabled={isEdit} />
        <CheckRow
          label="Has Two Factor Key"
          field="hasTwoFactorKey"
          isDisabled={isEdit}
        />
        <CheckRow label="Show custom title" field="showCustomTitle" />

        <PlatformDynamicFields
          configuration={accountGroupConfig.platformConfig}
          values={formData.platformFields}
          platformId={formData.platformId}
          onChange={(updated) =>
            setFormData((prev) => ({ ...prev, platformFields: updated }))
          }
        />
        {/* ── Actions ── */}
        <div className="um-modal-actions" style={{ marginTop: "1.5rem" }}>
          <button
            className="um-btn ghost"
            onClick={() =>
              onClose(
                isEdit
                  ? modalKeys.updateAccountGroup
                  : modalKeys.addAccountGroup,
              )
            }
          >
            Cancel
          </button>
          <button
            className={`um-btn ${!isSubmitting ? "primary" : ""}`}
            disabled={isSubmitting || !isValid}
            onClick={() => onConfirm(formData)}
          >
            {isSubmitting ? (
              <div className="ph-spinner ph-spinner-thick ph-spinner--light" />
            ) : isEdit ? (
              "Update"
            ) : (
              "Add"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
