import "./Guideline.css";

export default function Guideline({
  title,
  subtitle,
  icon,
  steps = [],
  notes = [],
}) {
  return (
    <div className="guidline-container card">
      {/* Header */}
      <div className="card-header">
        <span className="card-icon">
          <i className={icon}></i>
        </span>

        <div>
          <div className="card-title">{title}</div>
          <div className="card-sub">{subtitle}</div>
        </div>
      </div>

      {/* Steps */}
      <div className="guide-steps">
        {steps.map((step, index) => (
          <div className="guide-step" key={index}>
            <div className="step-num">{index + 1}</div>

            <div>
              <div className="guide-step-title">{step.title}</div>

              <div className="guide-step-desc">{step.description}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Notes */}
      {notes.length > 0 && (
        <div className="notes-box">
          <div className="notes-title">⚠️ Important Notes</div>

          {notes.map((note, index) => (
            <div className="note-item" key={index}>
              <span className="note-dot">•</span>
              <span>{note}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
