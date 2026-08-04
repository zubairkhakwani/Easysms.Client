import "./ContactUsMessageViewModal.css";

function ContactUsMessageViewModal({ query, onClose }) {
  return (
    <div className="cum-overlay" onClick={onClose}>
      <div className="cum-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cum-header">
          <div className="cum-icon-wrap">
            <span className="cum-icon">💬</span>
          </div>
          <div>
            <h2 className="cum-title">Customer Message</h2>
            <p className="cum-subtitle">Full message submitted via Contact Us</p>
          </div>
        </div>

        <div className="cum-recipient">
          <span className="cum-recipient-label">From</span>
          <div className="cum-recipient-info">
            <span className="cum-recipient-name">{query.name}</span>
            <span className="cum-recipient-dot" />
            <span className="cum-recipient-email">{query.email}</span>
          </div>
        </div>

        <div className="cum-reference">
          <div className="cum-reference-subject">
            <span className="cum-ref-label">Subject</span>
            <span className="cum-ref-value">{query.subject}</span>
          </div>
          <div className="cum-reference-message">
            <span className="cum-ref-label">Message</span>
            <div className="cum-ref-body">{query.message}</div>
          </div>
        </div>

        <div className="cum-actions">
          <button type="button" className="cum-btn ghost" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ContactUsMessageViewModal;
