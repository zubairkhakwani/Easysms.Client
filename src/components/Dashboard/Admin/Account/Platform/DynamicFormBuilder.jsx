//React
import { useState, useCallback } from "react";

//Static Data
import { modalKeys } from "../../../../../data/Static";

// ─── Field type definitions ───────────────────────────────────────────────────
const FIELD_TYPES = [
  { type: "text", icon: "✏️", label: "Text Input" },
  { type: "select", icon: "🔽", label: "Dropdown" },
  { type: "checkbox", icon: "☑️", label: "Checkbox" },
];

const HAS_OPTIONS = ["select"];
const HAS_PLACEHOLDER = ["text", "number", "textarea"];

let _id = 1;
const uid = () => _id++;

// ─── Small reusable pieces ───────────────────────────────────────────────────
function Toggle({ on, onToggle }) {
  return (
    <button
      onClick={onToggle}
      style={{
        width: 36,
        height: 20,
        borderRadius: 10,
        border: "none",
        cursor: "pointer",
        background: on ? "#6366f1" : "#3d4460",
        padding: 0,
        position: "relative",
        transition: "background 0.2s",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: on ? 18 : 3,
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: "#fff",
          transition: "left 0.2s",
          display: "block",
        }}
      />
    </button>
  );
}

function PropInput({ label, value, onChange, placeholder, multiline }) {
  const base = {
    width: "100%",
    background: "#0f1117",
    border: "1px solid #2d3148",
    borderRadius: 6,
    padding: "6px 10px",
    color: "#e2e8f0",
    fontSize: 12,
    outline: "none",
    fontFamily: "inherit",
    resize: "vertical",
  };
  return (
    <div style={{ marginBottom: 12 }}>
      <div
        style={{
          fontSize: 10,
          color: "#6b7280",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: 5,
        }}
      >
        {label}
      </div>
      {multiline ? (
        <textarea
          rows={2}
          style={base}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <input
          style={base}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}

// ─── Field Preview (right panel) ─────────────────────────────────────────────
function FieldPreview({ field }) {
  const inputStyle = {
    width: "100%",
    background: "#0d0f17",
    border: "1px solid #2d3148",
    borderRadius: 6,
    padding: "6px 10px",
    color: "#6b7280",
    fontSize: 12,
    fontFamily: "inherit",
  };
  const labelStyle = {
    fontSize: 11,
    color: "#9ca3af",
    display: "block",
    marginBottom: 4,
  };

  switch (field.type) {
    case "text":
    case "number":
      return (
        <div>
          <span style={labelStyle}>
            {field.label}
            {field.required && <span style={{ color: "#f87171" }}> *</span>}
          </span>
          <input
            style={inputStyle}
            disabled
            placeholder={field.placeholder || "Preview…"}
          />
        </div>
      );
    case "textarea":
      return (
        <div>
          <span style={labelStyle}>
            {field.label}
            {field.required && <span style={{ color: "#f87171" }}> *</span>}
          </span>
          <textarea
            rows={2}
            style={{ ...inputStyle, resize: "none" }}
            disabled
            placeholder={field.placeholder || "Preview…"}
          />
        </div>
      );
    case "select":
      return (
        <div>
          <span style={labelStyle}>
            {field.label}
            {field.required && <span style={{ color: "#f87171" }}> *</span>}
          </span>
          <select style={inputStyle} disabled>
            <option>Select an option…</option>
            {field.options.map((o, i) => (
              <option key={i}>{o}</option>
            ))}
          </select>
        </div>
      );
    case "checkbox":
    case "radio":
      return (
        <div>
          <span style={labelStyle}>
            {field.label}
            {field.required && <span style={{ color: "#f87171" }}> *</span>}
          </span>
          {field.options.map((o, i) => (
            <label
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                fontSize: 12,
                color: "#9ca3af",
                marginBottom: 4,
                cursor: "default",
              }}
            >
              <input
                type={field.type}
                disabled
                style={{ accentColor: "#6366f1" }}
              />
              {o}
            </label>
          ))}
        </div>
      );
    case "date":
      return (
        <div>
          <span style={labelStyle}>
            {field.label}
            {field.required && <span style={{ color: "#f87171" }}> *</span>}
          </span>
          <input type="date" style={inputStyle} disabled />
        </div>
      );
    case "file":
      return (
        <div>
          <span style={labelStyle}>
            {field.label}
            {field.required && <span style={{ color: "#f87171" }}> *</span>}
          </span>
          <div
            style={{
              ...inputStyle,
              padding: "10px",
              textAlign: "center",
              borderStyle: "dashed",
              color: "#4b5563",
            }}
          >
            📎 Choose file…
          </div>
        </div>
      );
    case "label":
      return (
        <div style={{ paddingTop: 4 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#c4c9e2",
              borderBottom: "1px solid #2d3148",
              paddingBottom: 6,
            }}
          >
            {field.label}
          </div>
          {field.placeholder && (
            <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>
              {field.placeholder}
            </div>
          )}
        </div>
      );
    default:
      return null;
  }
}

// ─── Properties Panel ─────────────────────────────────────────────────────────
function PropsPanel({ field, isUpdateMode, isUpserting, onUpdate, onSave }) {
  if (!field) {
    return (
      <div
        style={{
          ...panelStyle,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        <div style={{ fontSize: 32 }}>←</div>
        <div
          style={{
            fontSize: 12,
            color: "#3d4460",
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          Click a field
          <br />
          to configure it
        </div>
      </div>
    );
  }

  const update = (key, val) => onUpdate(field.id, key, val);

  return (
    <div style={panelStyle}>
      <div style={panelTitleStyle}>Properties</div>

      <PropInput
        label="Label"
        value={field.label}
        onChange={(v) => update("label", v)}
        placeholder="Field label…"
      />

      <PropInput
        label="Value"
        value={field.value}
        onChange={(v) => update("value", v)}
        placeholder="Field label…"
      />

      {HAS_PLACEHOLDER.includes(field.type) && (
        <PropInput
          label={field.type === "textarea" ? "Placeholder" : "Placeholder"}
          value={field.placeholder || ""}
          onChange={(v) => update("placeholder", v)}
          placeholder="Hint text…"
        />
      )}

      {field.type === "label" && (
        <PropInput
          label="Subtitle (optional)"
          value={field.placeholder || ""}
          onChange={(v) => update("placeholder", v)}
          placeholder="Optional description…"
          multiline
        />
      )}

      {field.type !== "label" && (
        <div style={{ marginBottom: 14 }}>
          <div
            style={{
              fontSize: 10,
              color: "#6b7280",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 6,
            }}
          >
            Required
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontSize: 12,
                color: field.required ? "#818cf8" : "#6b7280",
              }}
            >
              {field.required ? "Yes" : "No"}
            </span>
            <Toggle
              on={field.required}
              onToggle={() => update("required", !field.required)}
            />
          </div>
        </div>
      )}

      {HAS_OPTIONS.includes(field.type) && (
        <div style={{ marginBottom: 14 }}>
          <div
            style={{
              fontSize: 10,
              color: "#6b7280",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 8,
            }}
          >
            Options
          </div>
          {field.options.map((opt, i) => (
            <div key={i} style={{ display: "flex", gap: 5, marginBottom: 5 }}>
              <input
                style={{
                  flex: 1,
                  background: "#0f1117",
                  border: "1px solid #2d3148",
                  borderRadius: 6,
                  padding: "5px 8px",
                  color: "#e2e8f0",
                  fontSize: 12,
                  fontFamily: "inherit",
                  outline: "none",
                }}
                value={opt}
                onChange={(e) => {
                  const next = [...field.options];
                  next[i] = e.target.value;
                  update("options", next);
                }}
              />
              {field.options.length > 1 && (
                <button
                  onClick={() =>
                    update(
                      "options",
                      field.options.filter((_, j) => j !== i),
                    )
                  }
                  style={{
                    background: "none",
                    border: "none",
                    color: "#f87171",
                    cursor: "pointer",
                    fontSize: 14,
                    padding: "0 4px",
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            onClick={() =>
              update("options", [
                ...field.options,
                `Option ${field.options.length + 1}`,
              ])
            }
            style={{
              width: "100%",
              background: "none",
              border: "1px dashed #3d4460",
              borderRadius: 6,
              padding: "5px 0",
              color: "#6366f1",
              fontSize: 11,
              cursor: "pointer",
              marginTop: 2,
              fontFamily: "inherit",
            }}
          >
            + Add option
          </button>
        </div>
      )}

      <div style={{ borderTop: "1px solid #1e2236", margin: "12px 0 14px" }} />
      <div
        style={{
          fontSize: 10,
          color: "#6b7280",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: 10,
        }}
      >
        Preview
      </div>
      <FieldPreview field={field} />

      <button
        onClick={onSave}
        style={{
          width: "100%",
          background: "linear-gradient(135deg,#6366f1,#4f46e5)",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "9px 0",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          marginTop: 20,
          fontFamily: "inherit",
          letterSpacing: "0.02em",
        }}
      >
        {isUpdateMode
          ? `✏️ ${isUpserting ? "Updating" : "Update"} Configuration`
          : `💾 ${isUpserting ? "Saving" : "Save"} Configuration`}
      </button>
    </div>
  );
}

// ─── Shared styles ────────────────────────────────────────────────────────────
const panelStyle = {
  width: 220,
  background: "#1a1d27",
  borderLeft: "1px solid #1e2236",
  padding: "18px 14px",
  flexShrink: 0,
  overflowY: "auto",
};
const panelTitleStyle = {
  fontSize: 10,
  fontWeight: 700,
  color: "#4b5563",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  marginBottom: 16,
};

// ─── Parse saved configuration into internal field shape ─────────────────────
function parseConfiguration(configuration) {
  if (!configuration) return [];

  // Accept a JSON string or a plain array
  let parsed = configuration;
  if (typeof configuration === "string") {
    try {
      parsed = JSON.parse(configuration);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(parsed)) return [];

  return parsed.map((field) => ({
    // Assign a fresh local id so canvas interactions work normally
    id: uid(),
    type: field.type ?? "text",
    label: field.label ?? "",
    value: field.value ?? "",
    placeholder: field.placeholder ?? "",
    required: field.required ?? false,
    options: Array.isArray(field.options) ? field.options : [],
  }));
}

// ─── Main DynamicFormBuilder Modal ───────────────────────────────────────────
export default function DynamicFormBuilder({
  unSavedData,
  onClose,
  onSave,
  isUpserting,
}) {
  const isUpdateMode = Boolean(unSavedData?.configuration);
  const [fields, setFields] = useState(() =>
    isUpdateMode ? parseConfiguration(unSavedData.configuration) : [],
  );
  const [selectedId, setSelectedId] = useState(null);

  const selectedField = fields.find((f) => f.id === selectedId) ?? null;

  const addField = useCallback((type) => {
    const def = FIELD_TYPES.find((ft) => ft.type === type);
    const newField = {
      id: uid(),
      type,
      label: def.label,
      value: "",
      placeholder: "",
      required: type !== "label",
      options: HAS_OPTIONS.includes(type)
        ? ["Option 1", "Option 2", "Option 3"]
        : [],
    };
    setFields((prev) => [...prev, newField]);
    setSelectedId(newField.id);
  }, []);

  const removeField = useCallback((id) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
    setSelectedId((prev) => (prev === id ? null : prev));
  }, []);

  const updateField = useCallback((id, key, val) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [key]: val } : f)),
    );
  }, []);

  const moveField = useCallback((id, dir) => {
    setFields((prev) => {
      const idx = prev.findIndex((f) => f.id === id);
      const next = idx + dir;
      if (next < 0 || next >= prev.length) return prev;
      const arr = [...prev];
      [arr[idx], arr[next]] = [arr[next], arr[idx]];
      return arr;
    });
  }, []);

  const handleSave = () => {
    const schema = fields.map(({ id, ...rest }) => rest);
    let configurationJson = JSON.stringify(schema, null, 2);

    onSave?.(configurationJson, unSavedData);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        style={{
          width: "min(960px, 96vw)",
          height: "min(680px, 92vh)",
          background: "#13161f",
          borderRadius: 14,
          border: "1px solid #1e2236",
          display: "flex",
          overflow: "hidden",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div
          style={{
            padding: "14px 20px",
            borderBottom: "1px solid #1e2236",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#1a1d27",
            flexShrink: 0,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0" }}>
                Dynamic Form Builder
              </div>
              {isUpdateMode && (
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: "#fbbf24",
                    background: "#fbbf2418",
                    border: "1px solid #fbbf2433",
                    padding: "2px 8px",
                    borderRadius: 20,
                    letterSpacing: "0.05em",
                  }}
                >
                  EDIT
                </span>
              )}
            </div>
            <div style={{ fontSize: 11, color: "#4b5563", marginTop: 1 }}>
              {isUpdateMode
                ? "Editing existing schema · Modify fields · Save changes"
                : "Add fields · Configure · Save schema"}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                background: "#6366f122",
                color: "#818cf8",
                fontSize: 11,
                padding: "3px 10px",
                borderRadius: 20,
                border: "1px solid #6366f133",
              }}
            >
              {fields.length} field{fields.length !== 1 ? "s" : ""}
            </span>
            <button
              onClick={() => onClose(modalKeys.platformConfiguration)}
              style={{
                background: "none",
                border: "1px solid #2d3148",
                color: "#6b7280",
                borderRadius: 6,
                padding: "4px 10px",
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* ── Body (3 columns) ── */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* Left: Palette */}
          <div
            style={{
              width: 190,
              background: "#1a1d27",
              borderRight: "1px solid #1e2236",
              padding: "16px 12px",
              overflowY: "auto",
              flexShrink: 0,
            }}
          >
            <div style={panelTitleStyle}>Field Types</div>
            {FIELD_TYPES.map((ft) => (
              <button
                key={ft.type}
                onClick={() => addField(ft.type)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 10px",
                  borderRadius: 8,
                  background: "#22263a",
                  border: "1px solid #2d3148",
                  cursor: "pointer",
                  fontSize: 12,
                  color: "#c4c9e2",
                  marginBottom: 6,
                  textAlign: "left",
                  fontFamily: "inherit",
                  transition: "all 0.12s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#2a2f4a";
                  e.currentTarget.style.borderColor = "#6366f1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#22263a";
                  e.currentTarget.style.borderColor = "#2d3148";
                }}
              >
                <span style={{ fontSize: 15, width: 20, textAlign: "center" }}>
                  {ft.icon}
                </span>
                <span style={{ flex: 1 }}>{ft.label}</span>
                <span
                  style={{ color: "#6366f1", fontWeight: 700, fontSize: 16 }}
                >
                  +
                </span>
              </button>
            ))}
          </div>

          {/* Center: Canvas */}
          <div
            style={{
              flex: 1,
              padding: "20px 18px",
              overflowY: "auto",
              background: "#0f1117",
            }}
          >
            {fields.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  color: "#2d3148",
                  gap: 12,
                }}
              >
                <div style={{ fontSize: 40 }}>⊟</div>
                <div style={{ fontSize: 13 }}>
                  Click a field type on the left to begin
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {fields.map((f, idx) => {
                  const def = FIELD_TYPES.find((ft) => ft.type === f.type);
                  const isSelected = f.id === selectedId;
                  return (
                    <div
                      key={f.id}
                      onClick={() => setSelectedId(f.id)}
                      style={{
                        background: isSelected ? "#1e2236" : "#1a1d27",
                        border: `1px solid ${isSelected ? "#6366f1" : "#1e2236"}`,
                        borderRadius: 10,
                        padding: "11px 14px",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        cursor: "pointer",
                        transition: "all 0.12s",
                      }}
                    >
                      {/* drag handle placeholder */}
                      <span
                        style={{
                          color: "#3d4460",
                          fontSize: 13,
                          flexShrink: 0,
                        }}
                      >
                        ⠿
                      </span>
                      <span
                        style={{ fontSize: 17, width: 24, textAlign: "center" }}
                      >
                        {def?.icon}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 500,
                            color: "#c4c9e2",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            flexWrap: "wrap",
                          }}
                        >
                          {f.label}
                          {f.type !== "label" &&
                            (f.required ? (
                              <span
                                style={{
                                  fontSize: 10,
                                  color: "#f87171",
                                  background: "#f8717118",
                                  padding: "1px 6px",
                                  borderRadius: 4,
                                }}
                              >
                                required
                              </span>
                            ) : (
                              <span
                                style={{
                                  fontSize: 10,
                                  color: "#4b5563",
                                  background: "#4b556318",
                                  padding: "1px 6px",
                                  borderRadius: 4,
                                }}
                              >
                                optional
                              </span>
                            ))}
                        </div>
                        <div
                          style={{
                            fontSize: 10,
                            color: "#4b5563",
                            marginTop: 2,
                          }}
                        >
                          {def?.label}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 4 }}>
                        {idx > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moveField(f.id, -1);
                            }}
                            style={iconBtnStyle}
                          >
                            ↑
                          </button>
                        )}
                        {idx < fields.length - 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moveField(f.id, 1);
                            }}
                            style={iconBtnStyle}
                          >
                            ↓
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeField(f.id);
                          }}
                          style={{ ...iconBtnStyle, color: "#f87171" }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Props */}
          <PropsPanel
            field={selectedField}
            isUpdateMode={isUpdateMode}
            isUpserting={isUpserting}
            onUpdate={updateField}
            onSave={handleSave}
          />
        </div>
      </div>
    </div>
  );
}

const iconBtnStyle = {
  background: "none",
  border: "1px solid #2d3148",
  color: "#6b7280",
  borderRadius: 6,
  padding: "3px 7px",
  cursor: "pointer",
  fontSize: 11,
  fontFamily: "inherit",
};
