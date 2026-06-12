import { Link, Navigate, useParams } from "react-router-dom";
import { serviceDetails, platformServices } from "../../../data/Landing";
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

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const service = serviceDetails[slug];

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  const accent = accentMap[service.accent];
  const otherServices = platformServices.filter((s) => s.slug !== slug);

  return (
    <div
      className="parent-container services-page"
      style={{
        "--page-accent": accent.color,
        "--page-accent-subtle": accent.subtle,
        "--page-accent-border": accent.border,
      }}
    >
      <section className="services-hero services-detail-hero">
        <div className="services-hero-content services-detail-hero-content">
          <div className="services-detail-topbar">
            <Link to="/services" className="services-back-link">
              <span className="services-back-icon" aria-hidden="true">
                <i className="fa-solid fa-arrow-left" />
              </span>
              <span>All Services</span>
            </Link>
          </div>
          <div className="services-detail-hero-main">
            <div className="services-detail-badge">{service.badge}</div>
            <h1 className="services-hero-title">{service.headline}</h1>
            <p className="services-hero-sub">{service.subtitle}</p>
            <div className="services-detail-hero-actions">
              <Link to={service.buyPath} className="btn-primary">
                {service.buyLabel}
              </Link>
              <Link to="/register" className="btn-secondary">
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section service-detail-section">
        <div className="service-detail-intro card-surface">
          <span className="service-detail-icon">
            <i className={service.icon} />
          </span>
          <p>{service.intro}</p>
        </div>

        <div className="service-detail-columns">
          <div className="card-surface">
            <h2 className="service-detail-heading">Use Cases</h2>
            <ul className="service-detail-list">
              {service.useCases.map((item) => (
                <li key={item}>
                  <i className="fa-solid fa-check" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card-surface">
            <h2 className="service-detail-heading">Key Features</h2>
            <ul className="service-detail-list">
              {service.features.map((item) => (
                <li key={item}>
                  <i className="fa-solid fa-star" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="card-surface">
          <h2 className="service-detail-heading">How It Works</h2>
          <div className="service-detail-steps">
            {service.steps.map((step, index) => (
              <div key={step.title} className="service-detail-step">
                <div className="service-detail-step-num">{index + 1}</div>
                <div>
                  <div className="service-detail-step-title">{step.title}</div>
                  <div className="service-detail-step-desc">
                    {step.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {service.notes.length > 0 && (
          <div className="service-detail-notes">
            <div className="service-detail-notes-title">
              Important Notes
            </div>
            <ul>
              {service.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="service-detail-cta card-surface">
          <h2>Ready to get started with {service.name}?</h2>
          <p>Sign up, top up your wallet, and place your first order in minutes.</p>
          <div className="services-detail-hero-actions">
            <Link to={service.buyPath} className="btn-primary">
              {service.buyLabel}
            </Link>
            <Link to="/topup" className="btn-secondary">
              Top Up Balance
            </Link>
          </div>
        </div>

        <div className="service-detail-other">
          <h2 className="service-detail-heading">Explore Other Services</h2>
          <div className="service-detail-other-grid">
            {otherServices.map((other) => {
              const otherAccent = accentMap[other.accent];
              return (
                <Link
                  key={other.slug}
                  to={other.detailPath}
                  className="service-detail-other-card"
                  style={{
                    "--card-accent": otherAccent.color,
                    "--card-accent-subtle": otherAccent.subtle,
                    "--card-accent-border": otherAccent.border,
                  }}
                >
                  <i className={other.icon} />
                  <span>{other.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
