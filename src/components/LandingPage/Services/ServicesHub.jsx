import { Link } from "react-router-dom";
import { platformServices } from "../../../data/Landing";
import Footer from "../Footer/Footer";
import "../LandingShared.css";
import "./ServicesShared.css";

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

export default function ServicesHub() {
  return (
    <div className="parent-container services-page">
      <section className="services-hero">
        <div className="services-hero-content">
          <div className="section-label">Services</div>
          <h1 className="services-hero-title">
            Choose the Right Tool for{" "}
            <span className="services-hero-highlight">Your Workflow</span>
          </h1>
          <p className="services-hero-sub">
            EasyOtps offers temp numbers, proxies, mail rental, and ready
            accounts from one wallet and one dashboard.
          </p>
        </div>
      </section>

      <section className="section services-hub-grid-wrap">
        <div className="services-hub-grid">
          {platformServices.map((service) => {
            const accent = accentMap[service.accent];
            return (
              <article
                key={service.slug}
                className="services-hub-card"
                style={{
                  "--card-accent": accent.color,
                  "--card-accent-subtle": accent.subtle,
                  "--card-accent-border": accent.border,
                }}
              >
                <span className="services-hub-icon">
                  <i className={service.icon} />
                </span>
                <h2 className="services-hub-name">{service.name}</h2>
                <p className="services-hub-tagline">{service.tagline}</p>
                <div className="services-hub-actions">
                  <Link to={service.detailPath} className="btn-secondary">
                    Learn More
                  </Link>
                  <Link to={service.buyPath} className="btn-primary">
                    Get Started
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
}
