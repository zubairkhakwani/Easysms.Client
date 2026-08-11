import "./IpReplacementCommentViewModal.css";

function IpReplacementCommentViewModal({ row, onClose }) {
  return (
    <div className="irlc-overlay" onClick={onClose}>
      <div className="irlc-modal" onClick={(e) => e.stopPropagation()}>
        <div className="irlc-header">
          <div className="irlc-icon-wrap">
            <span className="irlc-icon">💬</span>
          </div>
          <div>
            <h2 className="irlc-title">User Comment</h2>
            <p className="irlc-subtitle">
              Full comment from the IP replacement request
            </p>
          </div>
        </div>

        <div className="irlc-recipient">
          <span className="irlc-recipient-label">From</span>
          <div className="irlc-recipient-info">
            <span className="irlc-recipient-name">{row.userName || "—"}</span>
            {row.userEmail && (
              <>
                <span className="irlc-recipient-dot" />
                <span className="irlc-recipient-email">{row.userEmail}</span>
              </>
            )}
          </div>
        </div>

        <div className="irlc-reference">
          {row.issueType && (
            <div className="irlc-reference-subject">
              <span className="irlc-ref-label">Issue</span>
              <span className="irlc-ref-value">{row.issueType}</span>
            </div>
          )}
          <div className="irlc-reference-message">
            <span className="irlc-ref-label">Comment</span>
            <div className="irlc-ref-body">{row.comment}</div>
          </div>
        </div>

        <div className="irlc-actions">
          <button type="button" className="irlc-btn ghost" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default IpReplacementCommentViewModal;
