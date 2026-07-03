import "./IpReplacementAttachmentsModal.css";

function isVideo(contentType) {
  return (contentType ?? "").startsWith("video/");
}

export function IpReplacementAttachmentsModal({ row, onClose }) {
  const attachments = row?.attachments ?? [];

  return (
    <div className="ira-overlay" onClick={onClose}>
      <div className="ira-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ira-header">
          <span>
            Attachments — Proxy #{row.proxyId}
            <span className="ira-count">({attachments.length})</span>
          </span>
          <button
            type="button"
            className="ira-close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="ira-grid">
          {attachments.map((file, idx) => (
            <div key={`${file.url}-${idx}`} className="ira-item">
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ira-preview-link"
              >
                {isVideo(file.contentType) ? (
                  <video
                    src={file.url}
                    className="ira-preview"
                    controls
                    preload="metadata"
                  />
                ) : (
                  <img
                    src={file.url}
                    alt={file.fileName}
                    className="ira-preview"
                    loading="lazy"
                  />
                )}
              </a>
              <div className="ira-meta">
                <span className="ira-filename" title={file.fileName}>
                  {file.fileName}
                </span>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ira-open"
                >
                  Open ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
