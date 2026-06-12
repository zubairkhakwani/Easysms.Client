import { Link } from "react-router-dom";
import "./CTA.css";

export default function CTA() {
  return (
    <section className="cta-section">
      <div className="cta-box">
        <h2>Ready to Get Started?</h2>
        <p>
          Create your account, top up your wallet, and choose from temp numbers,
          temp mail, accounts, or proxies.
        </p>
        <div className="cta-actions">
          <Link to="/register">
            <button className="btn-primary">Create Free Account</button>
          </Link>
          <Link to="/services" className="btn-secondary">
            Browse All Services
          </Link>
        </div>
      </div>
    </section>
  );
}
