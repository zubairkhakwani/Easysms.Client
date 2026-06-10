//React
import { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

//Context
import { AuthContext } from "../../../context/AuthContext";

//Static
import { AdminConst } from "../../../data/Static";

//Css
import "./WelcomePage.css";

const topUpMessage = encodeURIComponent(
  "Hello, I would like to request a balance top-up for my Easyotps account. Please let me know the available payment methods and next steps. Thank you.",
);
const WHATSAPP_URL = `https://wa.me/${AdminConst.phoneNumber}?text=${topUpMessage}`;

const offerings = [
  {
    icon: "fa-solid fa-sim-card",
    title: "Temp Numbers",
    desc: "Receive SMS verification codes instantly for WhatsApp, Facebook, Telegram, and 500+ services across 100+ countries.",
    to: "/get-number",
  },
  {
    icon: "fa-solid fa-envelope",
    title: "Temp Mails",
    desc: "Get temporary email addresses and receive verification emails and codes directly on your dashboard.",
    to: "/get-mail",
  },
  {
    icon: "fa-solid fa-user-check",
    title: "Accounts",
    desc: "Browse and purchase verified, ready-to-use accounts from our marketplace — no setup required.",
    to: "/get-account",
  },
  {
    icon: "fa-solid fa-shield-halved",
    title: "Proxies",
    desc: "Buy high-quality IPv4 & ISP proxies by location, duration, and usage type for social, gaming, and more.",
    to: "/get-proxy",
  },
];

const welcomeSteps = [
  {
    number: "01",
    title: "Account Created",
    desc: "You're all set — no need to log in again.",
    icon: "fa-solid fa-user-check",
    done: true,
  },
  {
    number: "02",
    title: "Top Up Your Balance",
    desc: "Add credits to your wallet. All four services use the same balance — numbers from as low as $0.05.",
    icon: "fa-solid fa-credit-card",
    to: "/topup",
  },
  {
    number: "03",
    title: "Choose a Service",
    desc: "Pick what you need: a temp number, temp mail, account, or proxy — then configure your order.",
    icon: "fa-solid fa-layer-group",
    scrollTo: "services",
  },
  {
    number: "04",
    title: "Receive & Use Instantly",
    desc: "Your number, mail, account, or proxy details appear on your dashboard — codes and emails arrive in real time.",
    icon: "fa-solid fa-bolt",
  },
];

const trustPoints = [
  {
    icon: "⚡",
    title: "OTP or your money back",
    body: "No OTP or verification received? Auto-refund, no questions asked.",
  },
  {
    icon: "🔒",
    title: "100% anonymous",
    body: "No real phone number or KYC required to get started.",
  },
  {
    icon: "📡",
    title: "500+ services · 100+ countries",
    body: "Temp numbers, mails, accounts, and proxies — all from one account.",
  },
];

export default function WelcomePage() {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const containerRef = useRef(null);
  const servicesRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    requestAnimationFrame(() => el?.classList.add("wp-ready"));
  }, []);

  const heading = currentUser?.name
    ? `Welcome, ${currentUser.name}!`
    : "Welcome to EasyOTPs";

  function scrollToServices() {
    servicesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleStepClick(step) {
    if (step.to) {
      navigate(step.to);
      return;
    }
    if (step.scrollTo === "services") {
      scrollToServices();
    }
  }

  return (
    <div className="wp-root" ref={containerRef}>
      <div className="wp-orb wp-orb-1" />
      <div className="wp-orb wp-orb-2" />

      <div className="wp-wrapper">
        <div className="wp-hero wp-reveal" style={{ "--d": "0ms" }}>
          <div className="wp-badge">✓ Account Created</div>
          <div className="wp-check-ring">
            <span className="wp-check">✓</span>
          </div>
          <h1 className="wp-heading">{heading}</h1>
          <p className="wp-overview">
            EasyOTPs is your all-in-one platform for online verification and
            digital access — buy temporary phone numbers, temporary emails,
            ready-made accounts, and proxies from a single wallet. No SIM card,
            no hassle, pay only for what you use.
          </p>
          <p className="wp-sub">
            You're already signed in. Top up your balance, pick a service below,
            and get started in minutes.
          </p>

          <div className="wp-punchline wp-reveal" style={{ "--d": "60ms" }}>
            <p className="wp-punchline-text">
              <strong>You don't need to go anywhere else</strong> — one balance
              gets you temp numbers, mails, accounts, and proxies.
            </p>
            <p className="wp-punchline-secure">
              <i className="fa-solid fa-shield-halved" aria-hidden="true" />
              All your data is secure. We never share your information with
              anyone.
            </p>
          </div>
        </div>

        <div className="wp-divider wp-reveal" style={{ "--d": "80ms" }}>
          <span>What we offer</span>
        </div>

        <div
          id="wp-services"
          ref={servicesRef}
          className="wp-offerings wp-reveal"
          style={{ "--d": "140ms" }}
        >
          {offerings.map((item) => (
            <button
              key={item.title}
              type="button"
              className="wp-offering-card"
              onClick={() => navigate(item.to)}
            >
              <div className="wp-offering-icon-wrap">
                <i className={item.icon} />
              </div>
              <div className="wp-offering-body">
                <div className="wp-offering-title">{item.title}</div>
                <div className="wp-offering-desc">{item.desc}</div>
              </div>
              <span className="wp-offering-arrow" aria-hidden="true">
                →
              </span>
            </button>
          ))}
        </div>

        <div className="wp-divider wp-reveal" style={{ "--d": "220ms" }}>
          <span>Your next steps</span>
        </div>

        <div className="wp-steps">
          {welcomeSteps.map((step, i) => {
            const isClickable = Boolean(step.to || step.scrollTo);

            return (
              <div
                key={step.number}
                role={isClickable ? "button" : undefined}
                tabIndex={isClickable ? 0 : undefined}
                className={`wp-step-card wp-reveal${step.done ? " wp-step-done" : ""}${isClickable ? " wp-step-clickable" : ""}`}
                style={{ "--d": `${280 + i * 70}ms` }}
                onClick={isClickable ? () => handleStepClick(step) : undefined}
                onKeyDown={
                  isClickable
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleStepClick(step);
                        }
                      }
                    : undefined
                }
              >
                <div className="wp-step-num">
                  {step.done ? "✓" : `Step ${step.number}`}
                </div>
                <div className="wp-step-icon-wrap">
                  <i className={step.icon} />
                </div>
                <div className="wp-step-content">
                  <div className="wp-step-title">{step.title}</div>
                  <div className="wp-step-desc">{step.desc}</div>
                </div>
                {isClickable && (
                  <span className="wp-step-arrow" aria-hidden="true">
                    →
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="wp-trust-grid">
          {trustPoints.map((point, i) => (
            <div
              key={point.title}
              className="wp-trust-card wp-reveal"
              style={{ "--d": `${600 + i * 60}ms` }}
            >
              <span className="wp-trust-icon">{point.icon}</span>
              <div>
                <div className="wp-trust-title">{point.title}</div>
                <div className="wp-trust-body">{point.body}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="wp-ctas wp-reveal" style={{ "--d": "800ms" }}>
          <button className="wp-btn-accent" onClick={scrollToServices}>
            Explore Services
          </button>
          <button className="wp-btn-secondary" onClick={() => navigate("/topup")}>
            Top Up Balance
          </button>
          <a
            href={WHATSAPP_URL}
            className="wp-btn-whatsapp"
            target="_blank"
            rel="noreferrer"
          >
            <svg className="wp-wa-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.528 5.845L.057 23.428a.75.75 0 00.915.915l5.638-1.485A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.712 9.712 0 01-4.953-1.355l-.355-.211-3.676.968.983-3.592-.232-.371A9.718 9.718 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" />
            </svg>
            Top Up via WhatsApp
          </a>
          <button className="wp-btn-link" onClick={() => navigate("/")}>
            ← Back to Home
          </button>
        </div>

        <p className="wp-footnote wp-reveal" style={{ "--d": "880ms" }}>
          You're logged in and ready to go. Need help choosing a service? Reach
          us anytime via WhatsApp or the contact form on our homepage.
        </p>
      </div>
    </div>
  );
}
