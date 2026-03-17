//React
import { useState, useEffect } from "react";

//Static
import { features, punchlines } from "../../../data/Static";

//Css
import "./TopUp.css";

export default function TopUp() {
  const [pulse, setPulse] = useState(0);
  const msg = encodeURIComponent(
    "Hello, I would like to request a balance top-up for my Easyotps account. Please let me know the available payment methods and next steps. Thank you.",
  );

  useEffect(() => {
    const t = setInterval(
      () => setPulse((p) => (p + 1) % punchlines.length),
      3000,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <div className="topup-root">
      <div className="topup-bg-grid" />
      <div className="topup-glow topup-glow-1" />
      <div className="topup-glow topup-glow-2" />

      <div className="topup-container">
        {/* Hero */}
        <div className="topup-hero">
          <span className="topup-badge">
            <i className="fa-solid fa-credit-card"></i> Balance Top-Up
          </span>
          <h1 className="topup-title">
            Power Your <span className="topup-accent">Verifications</span>
          </h1>
          <p className="topup-subtitle topup-pulse-text" key={pulse}>
            "{punchlines[pulse]}"
          </p>
        </div>

        {/* Main Card */}
        <div className="topup-card topup-main-card">
          <div className="topup-card-header">
            <span className="topup-card-icon">
              <i className="fa-solid fa-question"></i>
            </span>
            <h2>How to Top Up</h2>
          </div>
          <ol className="topup-steps">
            <li>
              <span className="topup-step-num">01</span>
              <div>
                <strong>Contact Support</strong>
                <p>
                  Reach out via phone or WhatsApp to initiate a top-up request.
                </p>
              </div>
            </li>
            <li>
              <span className="topup-step-num">02</span>
              <div>
                <strong>Choose Your Amount</strong>
                <p>
                  Minimum recommended balance is{" "}
                  <span className="topup-highlight">PKR 3,000</span> for
                  uninterrupted access.
                </p>
              </div>
            </li>
            <li>
              <span className="topup-step-num">03</span>
              <div>
                <strong>Send Payment</strong>
                <p>
                  Transfer via your preferred method — JazzCash, Easypaisa, or
                  bank transfer.
                </p>
              </div>
            </li>
            <li>
              <span className="topup-step-num">04</span>
              <div>
                <strong>Balance Activated</strong>
                <p>
                  Send your receipt and your balance will be updated instantly.
                </p>
              </div>
            </li>
          </ol>
        </div>

        {/* Contact + Minimum Row */}
        <div className="topup-row">
          <div className="topup-card topup-contact-card">
            <div className="topup-card-header">
              <span className="topup-card-icon">
                <i className="fa-solid fa-phone"></i>
              </span>
              <h2>Contact Support</h2>
            </div>
            <p className="topup-contact-label">Call / WhatsApp</p>
            <a href="tel:+923001234567" className="topup-phone">
              +92 318 5924 729
            </a>
            <p className="topup-contact-hours">Available 9am – 10pm daily</p>
            <a
              href={`https://wa.me/923185924729?text=${msg}`}
              className="topup-whatsapp-btn"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fa-solid fa-message"></i> Chat on WhatsApp
            </a>
          </div>

          <div className="topup-card topup-min-card">
            <div className="topup-card-header">
              <span className="topup-card-icon">
                <i className="fa-solid fa-sack-dollar"></i>
              </span>
              <h2>Minimum Balance</h2>
            </div>
            <div className="topup-amount-display">
              <span className="topup-currency">PKR</span>
              <span className="topup-amount">3,000</span>
            </div>
            <p className="topup-min-desc">
              We recommend keeping at least <strong>PKR 3,000</strong> to ensure
              you never run out mid-verification.
            </p>
            <div className="topup-warning">
              <i className="fa-solid fa-triangle-exclamation"></i> Low balance =
              missed verifications. Don't risk it.
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="topup-features">
          {features.map((f, i) => (
            <div className="topup-feature-card" key={i}>
              <span className="topup-feature-icon">
                <i className={f.icon}></i>
              </span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="topup-cta">
          <p>
            Ready to top up? <strong>One message is all it takes.</strong>
          </p>
          <a
            href={`https://wa.me/923185924729?text=${msg}`}
            className="topup-cta-btn"
            target="_blank"
            rel="noreferrer"
          >
            Top Up Now →
          </a>
        </div>
      </div>
    </div>
  );
}
