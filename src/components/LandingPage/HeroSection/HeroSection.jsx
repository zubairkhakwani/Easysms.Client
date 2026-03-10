import { Link } from "react-router-dom";
import { stats } from "../../../data";
import "./HeroSection.css";

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-grid" />

      <div className="hero-content">
        <div className="hero-badge">⚡ 500+ Services · 100+ Countries</div>

        <h1 className="hero-title">
          Temporary Phone Numbers
          <br />
          <span className="highlight">Without the Hassle</span>
        </h1>

        <p className="hero-subtitle">
          Receive SMS verification codes instantly — no SIM card, no
          subscription. Stay anonymous, stay protected.
        </p>

        <div className="hero-btns">
          <Link to="/get-number">
            <button className="btn-primary">Get a Number Now</button>
          </Link>
          <a href="#how-it-works" className="btn-secondary">
            See How It Works
          </a>
        </div>

        <div className="hero-stats">
          {stats.map((stat) => (
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
