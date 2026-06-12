import { platformWhyUs } from "../../../data/Landing";
import "./WhyChooseUs.css";

export default function WhyChooseUs() {
  return (
    <section className="section" id="why-us">
      <div className="section-label">Why Choose Us</div>
      <h2 className="section-title">Built for Speed, Privacy & Reliability</h2>
      <div className="why-grid">
        {platformWhyUs.map((item, i) => (
          <div key={i} className="why-card">
            <span className="why-icon">
              <i className={item.icon}></i>
            </span>
            <div className="why-title">{item.title}</div>
            <div className="why-desc">{item.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
