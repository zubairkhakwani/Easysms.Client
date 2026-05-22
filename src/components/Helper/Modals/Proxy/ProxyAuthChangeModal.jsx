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
  const [ip, setIp] = useState(myProxyAuth.ip);

  const [errors, setErrors] = useState({});

  /* ── validation ─────────────────────────────────────────── */
  function validate() {
    const e = {};
    if (mode === "credentials") {
      if (!login.trim()) e.username = "Username is required.";
      if (!password.trim()) e.password = "Password is required.";
      else if (password.length < 6)
        e.password = "Password must be at least 6 characters.";
    } else {
      const ipv4 =
        /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
      if (!ip.trim()) e.ip = "IP address is required.";
      else if (!ipv4.test(ip.trim())) e.ip = "Enter a valid IPv4 address.";
    }
    setErrors(e);
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

  /* ── helpers ─────────────────────────────────────────────── */
  function switchMode(next) {
    setMode(next);
    setErrors({});
  }

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
            Update how your proxy authenticates. Switch between login
            credentials or IP-based access.
          </div>
        </div>

        {/* ── mode toggle ── */}
        <div className="pac-toggle">
          <button
            className={`pac-toggle-btn ${mode === "credentials" ? "pac-toggle-active" : ""}`}
            onClick={() => switchMode("credentials")}
          >
            <span className="pac-toggle-icon">👤</span>
            Username / Password
          </button>
          <button
            className={`pac-toggle-btn ${mode === "ip" ? "pac-toggle-active" : ""}`}
            onClick={() => switchMode("ip")}
          >
            <span className="pac-toggle-icon">🌐</span>
            IP Whitelist
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
                IP Address
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
                Only this IP will be allowed to use the proxy without a
                username/password pair.
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
