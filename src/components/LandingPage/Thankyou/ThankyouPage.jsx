//React
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

//Helper
import { AdminConst } from "../../../data/Static";

//Css
import "./ThankyouPage.css";

const topUpMessage = encodeURIComponent(
  "Hello, I would like to request a balance top-up for my Easyotps account. Please let me know the available payment methods and next steps. Thank you.",
);
const WHATSAPP_URL = `https://wa.me/${AdminConst.phoneNumber}?text=${topUpMessage}`;

const trustPoints = [
  {
    icon: "🔒",
    title: "Your data stays yours",
    body: "We never share your information with any third party. Ever.",
  },
  {
    icon: "💰",
    title: "Your balance is safe",
    body: "Funds in your account are fully secure and only used when you request a number.",
  },
  {
    icon: "⚡",
    title: "OTP or your money back",
    body: "Every number is guaranteed to receive an OTP if sent by the service. No OTP delivered? Auto-refund, no questions asked.",
  },
  {
    icon: "🔄",
    title: "Forgot to cancel? No problem",
    body: "If you forget to cancel a number and no OTP arrives, we automatically refund you. Zero hassle.",
  },
  {
    icon: "📡",
    title: "100+ services, 2+ providers",
    body: "A wide range of services at different price points with real-time availability so you always have options.",
  },
];

export default function ThankYouPage() {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    requestAnimationFrame(() => el?.classList.add("ty-ready"));
  }, []);

  return (
    <div className="ty-root" ref={containerRef}>
      {/* Background glow orbs */}
      <div className="ty-orb ty-orb-1" />
      <div className="ty-orb ty-orb-2" />

      <div className="ty-wrapper">
        {/* ── Hero ── */}
        <div className="ty-hero ty-reveal" style={{ "--d": "0ms" }}>
          <div className="ty-check-ring">
            <span className="ty-check">✓</span>
          </div>
          <h1 className="ty-heading">We've got your message.</h1>
          <p className="ty-sub">
            Thank you for reaching out, your query matters to us. We read every
            message and always look for ways to improve — we'll get back to you
            as soon as possible.
          </p>
        </div>

        {/* ── CTAs ── */}
        <div className="ty-ctas ty-reveal" style={{ "--d": "100ms" }}>
          <button className="ty-btn-primary" onClick={() => navigate("/")}>
            ← Back to Home
          </button>
          <a
            href={WHATSAPP_URL}
            className="ty-btn-whatsapp"
            target="_blank"
            rel="noreferrer"
          >
            <svg className="ty-wa-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.528 5.845L.057 23.428a.75.75 0 00.915.915l5.638-1.485A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.712 9.712 0 01-4.953-1.355l-.355-.211-3.676.968.983-3.592-.232-.371A9.718 9.718 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" />
            </svg>
            Top Up via WhatsApp
          </a>
        </div>

        {/* ── Divider ── */}
        <div className="ty-divider ty-reveal" style={{ "--d": "180ms" }}>
          <span>Why thousands trust EasyOtps</span>
        </div>

        {/* ── Trust Grid ── */}
        <div className="ty-grid">
          {trustPoints.map((point, i) => (
            <div
              key={i}
              className="ty-trust-card ty-reveal"
              style={{ "--d": `${240 + i * 70}ms` }}
            >
              <span className="ty-trust-icon">{point.icon}</span>
              <div>
                <div className="ty-trust-title">{point.title}</div>
                <div className="ty-trust-body">{point.body}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Footer note ── */}
        <p className="ty-footnote ty-reveal" style={{ "--d": "620ms" }}>
          This is an automated confirmation from <strong>EasyOtps</strong>. Our
          team will reach out via the contact details you provided.
        </p>
      </div>
    </div>
  );
}
