//Css
import "./ToggleMessageReadModal.css";

function ToggleStatusModal({
  isActive, // boolean (current state)
  onClose,
  onConfirm,
  isLoading,
  config, // dynamic configuration
}) {
  const {
    activeLabel = "Active",
    inactiveLabel = "Inactive",
    activeIcon = "✅",
    inactiveIcon = "🚫",
    activeClass = "success",
    inactiveClass = "warning",
  } = config || {};

  const nextStateLabel = isActive ? inactiveLabel : activeLabel;
  const nextStateIcon = isActive ? inactiveIcon : activeIcon;
  const buttonClass = isActive ? inactiveClass : activeClass;

  return (
    <div className="cm-overlay" onClick={onClose}>
      <div className="cm-modal" onClick={(e) => e.stopPropagation()}>
        {/* Icon */}
        <div className={`cm-icon-wrap ${buttonClass}`}>
          <span className="cm-icon">{nextStateIcon}</span>
        </div>

        {/* Title */}
        <h2 className="cm-title">
          Mark as{" "}
          <span className={`accent-${buttonClass}`}>{nextStateLabel}</span>?
        </h2>

        {/* Description */}
        <p className="cm-sub">
          This item will be marked as <strong>{nextStateLabel}</strong>.
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
            className={`cm-btn ${buttonClass}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="cm-spinner" />
            ) : (
              <>
                {nextStateIcon} Mark as {nextStateLabel}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ToggleStatusModal;
