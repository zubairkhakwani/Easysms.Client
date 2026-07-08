import { getTaskStatusBadgeClass } from "../../../data/Admin/Task";
import { parseTaskDescription } from "./parseTaskDescription";
import "./TaskDetailsModal.css";

const TASK_TYPE_ICONS = {
  "Contact Us": "✉️",
  "IP Replacement": "🔄",
  "New Registration": "👤",
};

function getTaskTypeIcon(type) {
  return TASK_TYPE_ICONS[type] ?? "📋";
}

function LegacyDescription({ text }) {
  return (
    <div className="tdm-legacy">
      <pre className="tdm-legacy-body">{text}</pre>
    </div>
  );
}

function DetailGrid({ label, items }) {
  if (!items.length) return null;

  return (
    <div className="tdm-details-card">
      <div className="tdm-card-head">
        <span className="tdm-card-icon">📋</span>
        <span className="tdm-card-title">{label}</span>
      </div>
      <div className="tdm-detail-grid">
        {items.map((item) => (
          <div key={item.label} className="tdm-detail-row">
            <span className="tdm-detail-label">{item.label}</span>
            <span className="tdm-detail-value">{item.value || "—"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActionSteps({ steps }) {
  if (!steps.length) return null;

  return (
    <div className="tdm-actions-card">
      <div className="tdm-card-head tdm-card-head--action">
        <span className="tdm-card-icon">✅</span>
        <div>
          <span className="tdm-card-title">What you should do</span>
          <span className="tdm-card-hint">Follow these steps to complete this task</span>
        </div>
      </div>
      <ol className="tdm-step-list">
        {steps.map((step, index) => (
          <li key={index} className="tdm-step-item">
            <span className="tdm-step-num">{index + 1}</span>
            <span className="tdm-step-text">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function TaskDetailsModal({ task, onClose }) {
  if (!task) return null;

  const parsed = parseTaskDescription(task.description);

  return (
    <div className="tdm-overlay" onClick={onClose}>
      <div className="tdm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="tdm-header">
          <div className="tdm-icon-wrap">
            <span className="tdm-icon">{getTaskTypeIcon(task.type)}</span>
          </div>
          <div className="tdm-header-text">
            <h2 className="tdm-title">{task.type}</h2>
            <p className="tdm-subtitle">{task.typeDescription}</p>
          </div>
          <span className={getTaskStatusBadgeClass(task.status)}>{task.status}</span>
        </div>

        <div className="tdm-hero">
          <span className="tdm-hero-label">Your task</span>
          <p className="tdm-hero-title">{task.title}</p>
          {parsed.summary && (
            <p className="tdm-hero-summary">{parsed.summary}</p>
          )}
        </div>

        {parsed.isStructured ? (
          <>
            <ActionSteps steps={parsed.steps} />
            <DetailGrid label={parsed.detailsLabel} items={parsed.details} />
            {parsed.message && (
              <div className="tdm-message-card">
                <div className="tdm-card-head">
                  <span className="tdm-card-icon">💬</span>
                  <span className="tdm-card-title">Customer message</span>
                </div>
                <p className="tdm-message-body">{parsed.message}</p>
              </div>
            )}
          </>
        ) : (
          <LegacyDescription text={task.description} />
        )}

        <div className="tdm-footer">
          <button type="button" className="tdm-btn danger" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
