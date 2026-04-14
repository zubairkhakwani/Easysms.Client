import { modalKeys } from "../../../../data/Static";

export function ResultModal({ result, onClose }) {
  const total = result.addedCount + result.skippedCount;
  const allGood =
    result.duplicates.length === 0 && result.validationErrors.length === 0;
  const allFailed = result.addedCount === 0;
  const variant = allGood ? "success" : allFailed ? "failed" : "partial";
  const title = allGood
    ? "All accounts added"
    : allFailed
      ? "No accounts added"
      : "Submission complete";
  const icon = allGood ? "✓" : allFailed ? "✕" : "!";

  return (
    <div
      className="rmodal-overlay"
      onClick={() => onClose(modalKeys.resultModal)}
    >
      <div className="rmodal" onClick={(e) => e.stopPropagation()}>
        <div className={`rmodal-header ${variant}`}>
          <div className="rmodal-header-icon">{icon}</div>
          <div>
            <p className="rmodal-title">{title}</p>
            <p className="rmodal-sub">
              {total} {total === 1 ? "entry" : "entries"} processed
            </p>
          </div>
          <button
            className="rmodal-close"
            onClick={() => onClose(modalKeys.resultModal)}
          >
            ✕
          </button>
        </div>

        <div className="rmodal-stats">
          <div className="rmodal-stat added">
            <span className="rmodal-stat-val">{result.addedCount}</span>
            <span className="rmodal-stat-label">Added</span>
          </div>
          <div className="rmodal-stat-divider" />
          <div className="rmodal-stat skipped">
            <span className="rmodal-stat-val">{result.duplicates.length}</span>
            <span className="rmodal-stat-label">Duplicates</span>
          </div>
          <div className="rmodal-stat-divider" />
          <div className="rmodal-stat errored">
            <span className="rmodal-stat-val">
              {result.validationErrors.length}
            </span>
            <span className="rmodal-stat-label">Errors</span>
          </div>
        </div>

        {result.duplicates.length > 0 && (
          <div className="rmodal-section">
            <p className="rmodal-section-label">
              Duplicates — already in database
            </p>
            <div className="rmodal-list">
              {result.duplicates.map((d, i) => (
                <div key={i} className="rmodal-list-item skipped-item">
                  <span className="rmodal-dot skipped-dot" />
                  <span className="rmodal-item-user">{d.userName}</span>
                  <span className="rmodal-item-text">{d.reason}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {result.validationErrors.length > 0 && (
          <div className="rmodal-section">
            <p className="rmodal-section-label">
              Validation errors — not submitted
            </p>
            <div className="rmodal-list">
              {result.validationErrors.map((e, i) => (
                <div key={i} className="rmodal-list-item error-item">
                  <span className="rmodal-dot error-dot" />
                  <span className="rmodal-item-user">{e.userName}</span>
                  <span className="rmodal-item-text">{e.reason}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          className="rmodal-done-btn"
          onClick={() => onClose(modalKeys.resultModal)}
        >
          Done
        </button>
      </div>
    </div>
  );
}
