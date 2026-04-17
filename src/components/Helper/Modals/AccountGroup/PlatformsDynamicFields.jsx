import { useEffect } from "react";

export function PlatformDynamicFields({
  configuration,
  values = {},
  onChange,
}) {
  // ── Parse once ────────────────────────────────────────────────────────────
  let fields = [];
  if (configuration && configuration !== "") {
    try {
      const parsed =
        typeof configuration === "string"
          ? JSON.parse(configuration)
          : configuration;
      if (Array.isArray(parsed)) fields = parsed;
    } catch {
      fields = [];
    }
  }

  const buildDefaultValues = (fields) => {
    const defaults = {};

    fields.forEach((field, idx) => {
      const key = field.value || field.label || String(idx);

      switch (field.type) {
        case "checkbox":
          defaults[key] = false;
          break;

        case "number":
          defaults[key] = "";
          break;

        case "date":
          defaults[key] = "";
          break;

        case "select":
        case "radio":
          defaults[key] = "";
          break;

        case "file":
          defaults[key] = "";
          break;

        default:
          defaults[key] = "";
      }
    });

    return defaults;
  };

  useEffect(() => {
    if (fields.length === 0) return;

    const defaults = buildDefaultValues(fields);

    onChange({
      ...defaults,
      ...values,
    });
  }, [configuration]);

  // ── Single change handler ─────────────────────────────────────────────────
  const handleChange = (key, value) => {
    onChange({ ...values, [key]: value });
  };

  // ── Shared input style (matches existing .um-input look) ──────────────────
  const inputCls = "um-input";

  return (
    <div style={{ marginTop: "1rem" }}>
      {/* Divider with label */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "0.75rem",
        }}
      >
        <div style={{ height: 1, flex: 1, background: "#2d3148" }} />
        <span
          style={{
            fontSize: "0.72rem",
            fontWeight: 600,
            color: "#6b7280",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            whiteSpace: "nowrap",
          }}
        >
          {fields.length <= 0 ? "Please select patform" : 'Platform Fields'} 
        </span>
        <div style={{ height: 1, flex: 1, background: "#2d3148" }} />
      </div>

      {/* Render each field */}
      {fields.map((field, idx) => {
        const key = field.value || field.label || String(idx);
        const currentVal = values[key] ?? "";

        // ── Section label / header ──
        if (field.type === "label") {
          return (
            <div
              key={idx}
              style={{
                fontSize: "0.82rem",
                fontWeight: 700,
                color: "#c4c9e2",
                borderBottom: "1px solid #2d3148",
                paddingBottom: "0.3rem",
                marginBottom: "0.6rem",
                marginTop: idx === 0 ? 0 : "0.75rem",
              }}
            >
              {field.label}
              {field.placeholder && (
                <div
                  style={{
                    fontSize: "0.72rem",
                    color: "#6b7280",
                    fontWeight: 400,
                    marginTop: 2,
                  }}
                >
                  {field.placeholder}
                </div>
              )}
            </div>
          );
        }

        return (
          <div className="um-form-group" key={idx}>
            <label className="um-label">
              {field.type !== "checkbox" && field.label}
              {field.type !== "checkbox" && field.required && (
                <span style={{ color: "red" }}> *</span>
              )}
            </label>

            {/* ── text / number ── */}
            {(field.type === "text" || field.type === "number") && (
              <input
                className={inputCls}
                type={field.type}
                placeholder={field.placeholder || ""}
                onChange={(e) => handleChange(key, e.target.value)}
              />
            )}

            {/* ── select / dropdown ── */}
            {field.type === "select" && (
              <select
                className={inputCls}
                value={currentVal}
                onChange={(e) => handleChange(key, e.target.value)}
              >
                <option value="">Select…</option>
                {(field.options ?? []).map((opt, i) => (
                  <option key={i} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}

            {/* ── single boolean checkbox ── */}
            {field.type === "checkbox" && (
              <>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.88rem",
                    cursor: "pointer",
                    marginTop: 4,
                  }}
                ></label>
                <input
                  type="checkbox"
                  checked={!!currentVal}
                  onChange={(e) => handleChange(key, e.target.checked)}
                  style={{ accentColor: "#4f8ef7", width: 15, height: 15 }}
                />
                {field.label}{" "}
                {field.required && <span style={{ color: "red" }}> *</span>}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
