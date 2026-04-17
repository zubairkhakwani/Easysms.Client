//React
import { useState, useEffect } from "react";

//Helper
import { modalKeys } from "../../../../data/Static";

//Css
import "./AddAccountModal.css";

export function AddAccountModal({
  onClose,
  onConfirm,
  isSubmitting = false,
  accountConfig,
}) {
  const [raw, setRaw] = useState("");
  const [records, setRecords] = useState([]);
  useEffect(() => {
    if (!raw.trim()) {
      setRecords([]);
      return;
    }

    const lines = raw.split("\n").filter((l) => l.trim());
    const parsed = lines.map((line) => {
      const parts = line.split("|").map((p) => p.trim());
      const username = parts[0] || "";
      const password = parts[1] || "";

      let idx = 2;

      const cookie = accountConfig.hasCookie ? (parts[idx++] ?? "") : undefined;
      const twoFactorKey = accountConfig.hasTwoFactorKey
        ? (parts[idx++] ?? "")
        : undefined;
      const extraInfo = parts[idx++] ?? "";

      const isValid =
        Boolean(username) &&
        Boolean(password) &&
        (!accountConfig.hasCookie || Boolean(cookie)) &&
        (!accountConfig.hasTwoFactorKey || Boolean(twoFactorKey));

      return {
        username,
        password,
        twoFactorKey,
        cookie,
        extraInfo,
        isValid,
      };
    });

    setRecords(parsed);
  }, [raw, accountConfig]);

  const validCount = records.filter((r) => r.isValid).length;
  const invalidCount = records.length - validCount;

  const formatHint = [
    "username",
    "password",
    accountConfig.hasCookie && "cookie",
    accountConfig.hasTwoFactorKey && "2faKey",
    "extraInfo",
  ]
    .filter(Boolean)
    .join(" | ");

  // Column config — only active ones rendered
  const columns = [
    { key: "username", label: "Username", always: true },
    { key: "password", label: "Password", always: true },
    { key: "cookie", label: "Cookie", show: accountConfig.hasCookie },
    {
      key: "twoFactorKey",
      label: "2FA key",
      show: accountConfig.hasTwoFactorKey,
    },
    {
      key: "extraInfo",
      label: "Extra Info",
      show: true,
    },
  ].filter((c) => c.always || c.show);

  const handleConfirm = () => {
    const valid = records.filter((r) => r.isValid);
    onConfirm(valid);
  };

  return (
    <div className="aam-overlay">
      <div className="aam-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="aam-header">
          <span className="aam-title">Add accounts</span>
          <button
            className="aam-close"
            onClick={() => onClose(modalKeys.newAccount)}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="aam-body">
          {/* Format hint */}
          <div className="aam-format-hint">
            <span className="aam-format-label">
              Expected format — pipe separated
            </span>
            <code className="aam-format-code">{formatHint}</code>
          </div>

          {/* Badges */}
          <div className="aam-badges">
            <span className="aam-badge aam-badge--required">
              username required
            </span>
            <span className="aam-badge aam-badge--required">
              password required
            </span>
            {accountConfig.hasCookie && (
              <span className="aam-badge aam-badge--required">
                cookie required
              </span>
            )}
            {accountConfig.hasTwoFactorKey && (
              <span className="aam-badge aam-badge--required">
                2faKey required
              </span>
            )}

            <span className="aam-badge aam-badge--allowed">
              extraInfo allowed
            </span>
          </div>

          {/* Textarea */}
          <label className="aam-label">Paste records below</label>
          <textarea
            className="aam-textarea"
            placeholder={`john_doe|pass123${accountConfig.hasTwoFactorKey ? "|JBSWY3DP" : ""}${accountConfig.hasCookie ? "|eyJhb..." : ""}${accountConfig.hasRegistrationData ? "|{name:John}" : ""}\njane_smith|secret456`}
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            rows={4}
          />

          {/* Parse summary */}
          <div className="aam-parse-row">
            {records.length > 0 ? (
              <span className="aam-parse-info">
                <strong>{validCount}</strong> valid
                {invalidCount > 0 && (
                  <span className="aam-parse-invalid">
                    {" "}
                    · {invalidCount} invalid
                  </span>
                )}
              </span>
            ) : (
              <span className="aam-parse-info aam-parse-info--muted">
                Paste records to preview
              </span>
            )}
          </div>

          {/* Preview table */}
          <div className="aam-table-wrap">
            <table className="aam-table">
              <thead>
                <tr>
                  <th className="aam-th aam-th--num">#</th>
                  {columns.map((col) => (
                    <th key={col.key} className="aam-th">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + 1} className="aam-empty">
                      No records yet
                    </td>
                  </tr>
                ) : (
                  records.map((rec, i) => (
                    <tr key={i} className={rec.isValid ? "" : "aam-row--error"}>
                      <td className="aam-td aam-td--num">{i + 1}</td>
                      {columns.map((col) => {
                        const val = rec[col.key];
                        const missing =
                          val === undefined ||
                          val === null ||
                          val.toString().trim() === "";

                        return (
                          <td key={col.key} className="aam-td">
                            {missing ? (
                              <span className="aam-td--missing">
                                {col.always ? "missing" : "—"}
                              </span>
                            ) : (
                              <span title={val}>
                                {val.length > 18 ? val.slice(0, 16) + "…" : val}
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="aam-footer">
          <span className="aam-footer-info">
            {validCount > 0
              ? `${validCount} record${validCount > 1 ? "s" : ""} ready`
              : "0 records ready"}
          </span>
          <div className="aam-footer-actions">
            <button
              className="aam-btn aam-btn--ghost"
              onClick={() => onClose(modalKeys.newAccount)}
            >
              Cancel
            </button>
            <button
              className="aam-btn aam-btn--primary"
              disabled={isSubmitting || validCount === 0}
              onClick={handleConfirm}
            >
              {isSubmitting ? <span className="aam-spinner" /> : "Add accounts"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
