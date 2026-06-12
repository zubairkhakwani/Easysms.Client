import { Link } from "react-router-dom";
import { platformStats, heroBadge } from "../../../data/Landing";
import "./HeroSection.css";

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-badge">{heroBadge}</div>

        <h1 className="hero-title">
          Your Complete Platform for
          <br />
          <span className="highlight">Verification and Access</span>
        </h1>

        <p className="hero-punchline">
          One wallet for the entire platform. Top up once, buy any service, and
          manage everything from a single dashboard.
        </p>

        <p className="hero-subtitle">
          Instant delivery from a single dashboard built for privacy, speed, and
          scale.
        </p>

        <div className="hero-btns">
          <Link to="/register">
            <button className="btn-primary">Create Free Account</button>
          </Link>
          <Link to="/services" className="btn-secondary">
            Explore Services
          </Link>
        </div>

        <div className="hero-stats">
          {platformStats.map((stat) => (
            <div key={stat.label} className="hero-stat">
              <div className="stat-num">
                {stat.num}
                <span>{stat.suffix}</span>
              </div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
