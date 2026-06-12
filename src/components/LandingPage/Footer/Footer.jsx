import { Link } from "react-router-dom";
import { footerServiceLinks, footerCompanyLinks } from "../../../data/Landing";
import "./Footer.css";

export default function Footer() {
  return (
    <footer>
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="logo">
            Easy<span style={{ color: "var(--accent)" }}>Otps</span>
          </div>
          <p>
            Your all-in-one platform for SMS verification, proxy rentals,
            mail inbox rental, and ready accounts. Instant delivery with
            pay-as-you-go pricing.
          </p>
        </div>
        <div className="footer-col">
          <h4>Services</h4>
          <ul>
            {footerServiceLinks.map((s) => (
              <li key={s.label}>
                <Link to={s.to}>{s.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            {footerCompanyLinks.map((s) => (
              <li key={s.label}>
                <Link to={s.to}>{s.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-col">
          <h4>Legal</h4>
          <ul>
            {[
              "Privacy Policy",
              "Terms of Service",
              "Cookie Policy",
              "GDPR",
            ].map((s) => (
              <li key={s}>
                <a href="#">{s}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} EasyOtps. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
