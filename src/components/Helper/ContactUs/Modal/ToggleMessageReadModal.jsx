//Css
import "./ToggleMessageReadModal.css";

function ToggleMessageReadModal({ isRead, onClose, onConfirm, isLoading }) {
  const action = isRead ? "unread" : "read";
  const oppositeIcon = isRead ? "✉️" : "📬";

  return (
    <div className="cm-overlay" onClick={onClose}>
      <div className="cm-modal" onClick={(e) => e.stopPropagation()}>
        {/* Icon */}
        <div className={`cm-icon-wrap ${isRead ? "unread" : "read"}`}>
          <span className="cm-icon">{oppositeIcon}</span>
        </div>

        {/* Title */}
        <h2 className="cm-title">
          Mark as{" "}
          <span className={isRead ? "accent-orange" : "accent-green"}>
            {action}
          </span>
          ?
        </h2>

        {/* Message preview */}
        <p className="cm-sub">
          This message will be marked as <strong>{action}</strong>.
        </p>

        {/* Actions */}
        <div className="cm-actions">
          <button
            className="cm-btn ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className={`cm-btn ${isRead ? "warning" : "success"}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="cm-spinner" />
            ) : (
              <>
                {oppositeIcon} Mark as {action}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ToggleMessageReadModal;
