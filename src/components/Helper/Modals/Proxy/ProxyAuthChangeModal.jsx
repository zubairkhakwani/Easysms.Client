import { useState } from "react";
import "./ProxyAuthChangeModal.css";

export function ProxyAuthChangeModal({
  onClose,
  onConfirm,
  isChanging,
  myProxyAuth,
}) {
  const [mode, setMode] = useState("credentials"); // "credentials" | "ip"

  const [login, setLogin] = useState(myProxyAuth.login);
  const [password, setPassword] = useState(myProxyAuth.password);
  const [showPassword, setShowPassword] = useState(false);
  const [ip, setIp] = useState(myProxyAuth.authIp);

  const [errors, setErrors] = useState({});

  /* ── validation ─────────────────────────────────────────── */
  function validate() {
    const e = {};

    // Credentials are ALWAYS required regardless of mode
    if (!login.trim()) e.username = "Username is required.";
    if (!password.trim()) e.password = "Password is required.";
    else if (password.length < 6)
      e.password = "Password must be at least 6 characters.";

    // IP is optional, but if filled it must be valid
    if (ip.trim()) {
      const ipv4 =
        /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
      if (!ipv4.test(ip.trim())) e.ip = "Enter a valid IPv4 address.";
    }

    setErrors(e);

    // If credentials are invalid and we're on the IP tab, snap back so user sees the errors
    if ((e.username || e.password) && mode === "ip") {
      setMode("credentials");
    }

    return Object.keys(e).length === 0;
  }

  function handleConfirm() {
    if (!validate()) return;
    onConfirm?.({
      orderNumber: myProxyAuth.orderNumber,
      login: login.trim(),
      password,
      ip: ip.trim(),
    });
  }

  function switchMode(next) {
    setMode(next);
    // Only clear IP error when switching — keep credential errors visible
    setErrors((prev) => ({ ...prev, ip: undefined }));
  }

  /* ── credential error indicator for the tab ── */
  const hasCredentialErrors = !!(errors.username || errors.password);

  return (
    <div className="pac-overlay">
      <div className="pac-modal" onClick={(e) => e.stopPropagation()}>
        {/* ── close button ── */}
        <button className="pac-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        {/* ── header ── */}
        <div className="pac-header">
          <div className="pac-icon-wrap">
            <span className="pac-icon">🔐</span>
          </div>
          <div className="pac-title">Change Authorization</div>
          <div className="pac-sub">
            Username and password are required. IP whitelist is optional — fill
            it to restrict access to a specific IP.
          </div>
        </div>

        {/* ── mode toggle ── */}
        <div className="pac-toggle">
          <button
            className={`pac-toggle-btn ${mode === "credentials" ? "pac-toggle-active" : ""} ${hasCredentialErrors ? "pac-toggle-btn--error" : ""}`}
            onClick={() => switchMode("credentials")}
          >
            <span className="pac-toggle-icon">👤</span>
            Username / Password
            {hasCredentialErrors && (
              <span className="pac-toggle-error-dot" aria-label="Has errors" />
            )}
          </button>
          <button
            className={`pac-toggle-btn ${mode === "ip" ? "pac-toggle-active" : ""}`}
            onClick={() => switchMode("ip")}
          >
            <span className="pac-toggle-icon">🌐</span>
            IP Whitelist
            <span className="pac-toggle-optional">optional</span>
          </button>
        </div>

        {/* ── form ── */}
        <div className="pac-form">
          {mode === "credentials" && (
            <>
              {/* Username */}
              <div className="pac-field">
                <label className="pac-label" htmlFor="pac-username">
                  Username <span className="required">*</span>
                </label>
                <div
                  className={`pac-input-wrap ${errors.username ? "pac-input-error" : ""}`}
                >
                  <span className="pac-input-icon">👤</span>
                  <input
                    id="pac-username"
                    className="pac-input"
                    type="text"
                    placeholder="Enter username"
                    value={login}
                    onChange={(e) => {
                      setLogin(e.target.value);
                      setErrors((prev) => ({ ...prev, username: undefined }));
                    }}
                    autoComplete="off"
                  />
                </div>
                {errors.username && (
                  <span className="pac-field-error">{errors.username}</span>
                )}
              </div>

              {/* Password */}
              <div className="pac-field">
                <label className="pac-label" htmlFor="pac-password">
                  Password <span className="required">*</span>
                </label>
                <div
                  className={`pac-input-wrap ${errors.password ? "pac-input-error" : ""}`}
                >
                  <span className="pac-input-icon">🔑</span>
                  <input
                    id="pac-password"
                    className="pac-input"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="pac-eye-btn"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                {errors.password && (
                  <span className="pac-field-error">{errors.password}</span>
                )}
              </div>
            </>
          )}

          {mode === "ip" && (
            <div className="pac-field">
              <label className="pac-label" htmlFor="pac-ip">
                IP Address{" "}
                <span className="pac-label-optional">(optional)</span>
              </label>
              <div
                className={`pac-input-wrap ${errors.ip ? "pac-input-error" : ""}`}
              >
                <span className="pac-input-icon">🌐</span>
                <input
                  id="pac-ip"
                  className="pac-input"
                  type="text"
                  placeholder="e.g. 192.168.1.100"
                  value={ip}
                  onChange={(e) => {
                    setIp(e.target.value);
                    setErrors((prev) => ({ ...prev, ip: undefined }));
                  }}
                  autoComplete="off"
                />
              </div>
              {errors.ip && (
                <span className="pac-field-error">{errors.ip}</span>
              )}
              <p className="pac-field-hint">
                Only this IP will be allowed to use the proxy without a username
                and password. Leave blank to use credential-based access only.
              </p>
            </div>
          )}
        </div>

        {/* ── actions ── */}
        <div className="pac-actions">
          <button className="pac-btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="pac-btn-primary" onClick={handleConfirm}>
            {isChanging ? (
              <div className="ph-spinner ph-spinner-thick ph-spinner--light" />
            ) : (
              "Save Changes →"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
