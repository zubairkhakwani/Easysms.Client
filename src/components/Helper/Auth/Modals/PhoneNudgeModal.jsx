import { useEffect, useRef } from "react";
import "./PhoneNudgeModal.css";

export default function PhoneNudgeModal({ onAddPhone, onSkip }) {
  const overlayRef = useRef(null);
  useEffect(() => {
    const el = overlayRef.current;
    requestAnimationFrame(() => {
      el?.classList.add("pnm-visible");
    });
  }, []);

  return (
    <div className="pnm-overlay" ref={overlayRef}>
      <div className="pnm-card">
        <h2 className="pnm-title">One quick thing!</h2>

        <p className="pnm-body">
          You haven't added a <em>whatsapp number</em> — and that's totally
          fine, it's optional. But here's why it's worth it for <em>you</em>:
        </p>

        <ul className="pnm-benefits">
          <li>
            <span className="pnm-bullet">💬</span>
            <span>We can reach you faster when you need support</span>
          </li>
          <li>
            <span className="pnm-bullet">🔔</span>
            <span>
              Stay updated about new providers, services, and important changes
            </span>
          </li>
          <li>
            <span className="pnm-bullet">🛡️</span>
            <span>
              Helps us verify and recover your account if you ever lose access
            </span>
          </li>
        </ul>

        <div className="pnm-actions">
          <button className="pnm-btn pnm-btn-primary" onClick={onAddPhone}>
            Sure, let me add it
          </button>
          <button className="pnm-btn pnm-btn-ghost" onClick={onSkip}>
            Skip, just register me
          </button>
        </div>
      </div>
    </div>
  );
}
