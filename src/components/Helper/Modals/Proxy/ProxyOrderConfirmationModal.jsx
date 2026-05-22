import "./ProxyOrderConfirmationModal.css";
import { useNavigate, Link } from "react-router-dom";

export function ProxyOrderConfirmationModal({ data, onClose }) {
  var navigate = useNavigate();

  function navigateToMyActiveProxies() {
    navigate("/history/proxy");
  }
  return (
    <div className="pom-overlay" onClick={onClose}>
      <div className="pom-modal" onClick={(e) => e.stopPropagation()}>
        {/* Success Icon */}
        <div className="pom-icon-wrap">
          <div className="pom-icon">✅</div>
        </div>

        {/* Header */}
        <div className="pom-title">Order Confirmed!</div>
        <div className="pom-sub">
          Your proxies are being set up and will be ready shortly. You can track
          and manage them from your profile.
        </div>

        {/* Order ID Badge */}
        <div className="pom-badge">
          <span className="pom-badge-label">Order ID</span>
          <span className="pom-badge-value">#{data.providerOrderId}</span>
        </div>

        {/* Info Grid */}
        <div className="pom-info-grid">
          <div className="pom-info-row">
            <span className="pom-info-key">🌍 Location</span>
            <span className="pom-info-val">{data.location}</span>
          </div>
          <div className="pom-info-row">
            <span className="pom-info-key">⚙️ Service</span>
            <span className="pom-info-val">{data.service}</span>
          </div>
          {data.purpose && (
            <div className="pom-info-row">
              <span className="pom-info-key">🎯 Purpose</span>
              <span className="pom-info-val">{data.purpose}</span>
            </div>
          )}
          {data.period && (
            <div className="pom-info-row">
              <span className="pom-info-key">📅 Period</span>
              <span className="pom-info-val">{data.period}</span>
            </div>
          )}
          <div className="pom-info-row">
            <span className="pom-info-key">🔐 Authorization</span>
            <span className="pom-info-val">{data.authorization}</span>
          </div>
          <div className="pom-info-row">
            <span className="pom-info-key">📦 Quantity</span>
            <span className="pom-info-val pom-accent">
              {data.quantity} {data.quantity === 1 ? "piece" : "pieces"}
            </span>
          </div>
        </div>

        {/* Total Cost */}
        <div className="pom-total-row">
          <span className="pom-total-label">💰 Total Cost</span>
          <span className="pom-total-value">${data.totalCost.toFixed(2)}</span>
        </div>

        {/* Guide Hint */}
        <div className="pom-hint">
          <span className="pom-hint-icon">💡</span>
          <span>
            To access your proxies, click your <strong>name or balance</strong>{" "}
            at the top right, then navigate to:
            <div className="pom-path-chips">
              <span className="pom-chip">Your Profile</span>
              <span className="pom-chip-arrow">→</span>
              <span className="pom-chip">My Proxies</span>
            </div>
          </span>
        </div>

        {/* Actions */}
        <div className="pom-actions">
          <button className="pom-btn-ghost" onClick={onClose}>
            Close
          </button>
          <button
            className="pom-btn-primary"
            onClick={navigateToMyActiveProxies}
          >
            Go to My Proxies →
          </button>
        </div>
      </div>
    </div>
  );
}
