import "./RequestNumberGuideline.css";

export default function RequestNumberGuideline() {
  return (

    <div className="guidline-container card">
      <div className="card-header">
        <span className="card-icon">
          <i className="fa-solid fa-list-check number-type-icon"></i>
        </span>
        <div>
          <div className="card-title">Getting Started</div>
          <div className="card-sub">
            Follow these steps to receive your verification code
          </div>
        </div>
      </div>

      <div className="guide-steps">
        <div className="guide-step">
          <div className="step-num">1</div>
          <div>
            <div className="guide-step-title">Select Your Options</div>
            <div className="guide-step-desc">
              Choose your SMS provider, service, country, and operator from the
              form on the right.
            </div>
          </div>
        </div>
        <div className="guide-step">
          <div className="step-num">2</div>
          <div>
            <div className="guide-step-title">
              Check Price &amp; Availability
            </div>
            <div className="guide-step-desc">
              Review the service information to see the price and available
              numbers.
            </div>
          </div>
        </div>
        <div className="guide-step">
          <div className="step-num">3</div>
          <div>
            <div className="guide-step-title">Click "Get Number"</div>
            <div className="guide-step-desc">
              Press the button to receive your temporary phone number instantly.
            </div>
          </div>
        </div>
        <div className="guide-step">
          <div className="step-num">4</div>
          <div>
            <div className="guide-step-title">Use the Number</div>
            <div className="guide-step-desc">
              Enter the provided number in your app or service to receive the
              SMS code.
            </div>
          </div>
        </div>
        <div className="guide-step">
          <div className="step-num">5</div>
          <div>
            <div className="guide-step-title">Get Your Code</div>
            <div className="guide-step-desc">
              Your verification code will appear on this page within a few
              minutes.
            </div>
          </div>
        </div>
      </div>

      <div className="notes-box">
        <div className="notes-title">⚠️ Important Notes</div>
        <div className="note-item">
          <span className="note-dot">•</span>
          <span>Numbers are temporary and expire after 15–20 minutes</span>
        </div>
        <div className="note-item">
          <span className="note-dot">•</span>
          <span>Make sure you have sufficient balance before ordering</span>
        </div>
        <div className="note-item">
          <span className="note-dot">•</span>
          <span>Use the number immediately after receiving it</span>
        </div>
        <div className="note-item">
          <span className="note-dot">•</span>
          <span>Some services may take longer to deliver SMS codes</span>
        </div>
      </div>
    </div>
  );
}
