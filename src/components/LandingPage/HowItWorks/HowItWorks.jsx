//Static Data
import { steps } from "../../../data/Static";

//Css
import "./HowItWorks.css";

export default function HowItWorks() {
  return (
    <div className="how-section" id="how-it-works">
      <div className="how-inner">
        <div>
          <div className="section-label">How It Works</div>
          <h2 className="section-title">4 Steps to Anonymous Verification</h2>
          <p className="section-sub">
            No technical skills needed. Start receiving SMS codes in under 2
            minutes.
          </p>
        </div>
        <div className="steps-grid">
          {steps.map((step, i) => (
            <div key={i} className="step-card">
              <div className="step-num">Step {step.number}</div>
              <div className="step-icon-wrap">
                <i className={step.icon}></i>
              </div>
              <div className="step-title">{step.title}</div>
              <div className="step-desc">{step.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
