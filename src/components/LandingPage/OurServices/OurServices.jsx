import { Link } from "react-router-dom";
import { platformServices } from "../../../data/Landing";
import "../LandingShared.css";
import "./OurServices.css";

const accentMap = {
  cyan: {
    color: "var(--accent)",
    subtle: "var(--accent-subtle)",
    border: "var(--accent-border)",
  },
  blue: {
    color: "var(--accent-blue)",
    subtle: "var(--accent-blue-subtle)",
    border: "var(--accent-blue-border)",
  },
  green: {
    color: "var(--accent-green)",
    subtle: "var(--accent-green-subtle)",
    border: "var(--accent-green-border)",
  },
  orange: {
    color: "var(--accent-orange)",
    subtle: "var(--accent-orange-subtle)",
    border: "var(--accent-orange-border)",
  },
};

export default function OurServices() {
  return (
    <section className="section" id="services">
      <div className="section-label">Our Services</div>
      <div className="our-services-header">
        <div>
          <h2 className="section-title">Everything You Need in One Platform</h2>
          <p className="section-sub">
            Temp numbers and proxies at the core — plus mail rental and ready
            accounts. EasyOtps keeps every service in one place.
          </p>
        </div>
        <Link to="/services" className="btn-secondary our-services-link">
          View All Services →
        </Link>
      </div>
      <div className="our-services-grid">
        {platformServices.map((service) => {
          const accent = accentMap[service.accent];
          return (
            <Link
              key={service.slug}
              to={service.detailPath}
              className="our-service-card"
              style={{
                "--card-accent": accent.color,
                "--card-accent-subtle": accent.subtle,
                "--card-accent-border": accent.border,
              }}
            >
              <span className="our-service-icon">
                <i className={service.icon} />
              </span>
              <h3 className="our-service-name">{service.name}</h3>
              <p className="our-service-tagline">{service.tagline}</p>
              <span className="our-service-cta">
                Learn more <i className="fa-solid fa-arrow-right" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
