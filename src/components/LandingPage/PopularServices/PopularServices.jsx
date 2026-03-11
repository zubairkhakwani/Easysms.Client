//React
import { useState } from "react";

//Static Data
import { services } from "../../../data/Static";

//Css
import "./PopularServices.css";

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`
    : "0,229,255";
}
export default function PopularServices() {
  const [hoveredService, setHoveredService] = useState(null);
  return (
    <section className="section" id="Services">
      <div className="section-label">Popular Services</div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <div>
          <h2 className="section-title">Works With Every App You Use</h2>
          <p className="section-sub">
            From social media to e-commerce — get verified on any platform
            without exposing your real number.
          </p>
        </div>
        {/* <button className="btn-secondary" style={{ whiteSpace: "nowrap" }}>
          View All Services →
        </button> */}
      </div>
      <div className="services-grid">
        {services.map((s, i) => (
          <div
            key={i}
            className="service-card"
            style={{
              "--hover-color": s.color,
              background:
                hoveredService === i
                  ? `linear-gradient(135deg, rgba(${hexToRgb(s.color)},0.12), var(--card))`
                  : "var(--card)",
              borderColor:
                hoveredService === i ? `${s.color}40` : "var(--border)",
            }}
            onMouseEnter={() => setHoveredService(i)}
            onMouseLeave={() => setHoveredService(null)}
          >
            <span className="service-icon">
              <i className={s.icon}></i>
            </span>
            <div className="service-name">{s.name}</div>
            <div className="service-price">from $0.05</div>
          </div>
        ))}
      </div>
    </section>
  );
}
