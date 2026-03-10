//Css
import "./Footer.css";

export default function Footer() {
  return (
    <footer>
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="logo">
            Easy<span style={{ color: "var(--accent)" }}>sms</span>
          </div>
          <p>
            Instant temporary phone numbers for SMS verification. Anonymous,
            affordable, and always available.
          </p>
        </div>
        <div className="footer-col">
          <h4>Services</h4>
          <ul>
            {["WhatsApp", "Telegram", "Facebook", "Instagram", "Gmail"].map(
              (s) => (
                <li key={s}>
                  <a href="#">{s}</a>
                </li>
              ),
            )}
          </ul>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            {["About Us", "Blog", "API Docs", "Pricing", "Contact"].map((s) => (
              <li key={s}>
                <a href="#">{s}</a>
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
          © {new Date().getFullYear()} Easyotps . All rights reserved.
        </span>
      </div>
    </footer>
  );
}
