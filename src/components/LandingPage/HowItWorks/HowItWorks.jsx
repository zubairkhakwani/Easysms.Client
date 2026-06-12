import { platformSteps } from "../../../data/Landing";
import "./HowItWorks.css";

export default function HowItWorks() {
  return (
    <div className="how-section" id="how-it-works">
      <div className="how-inner">
        <div>
          <div className="section-label">How It Works</div>
          <h2 className="section-title">Four Steps to Get Started</h2>
          <p className="section-sub">
            One account, one wallet. Use any service on EasyOtps in minutes.
          </p>
        </div>
        <div className="steps-grid">
          {platformSteps.map((step, i) => (
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
