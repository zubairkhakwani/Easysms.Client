import { useEffect, useRef } from "react";
import "./AttachmentNudgeModal.css";

export default function AttachmentNudgeModal({ onAddAttachments, onSkip }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    const el = overlayRef.current;
    requestAnimationFrame(() => {
      el?.classList.add("anm-visible");
    });
  }, []);

  return (
    <div className="anm-overlay" ref={overlayRef}>
      <div className="anm-card">
        <h2 className="anm-title">Got a screenshot or video?</h2>

        <p className="anm-body">
          You haven't attached any <em>proof</em> — and that's fine, it's
          optional. But here's why it helps <em>you</em> get a faster fix:
        </p>

        <ul className="anm-benefits">
          <li>
            <span className="anm-bullet">📸</span>
            <span>
              Screenshots or screen recordings help support see exactly what's
              wrong with your proxy
            </span>
          </li>
          <li>
            <span className="anm-bullet">⚡</span>
            <span>
              Requests with proof are often resolved faster — less back-and-forth
            </span>
          </li>
          <li>
            <span className="anm-bullet">🛡️</span>
            <span>
              We can investigate and resolve your issue faster with clear proof
              on hand
            </span>
          </li>
        </ul>

        <div className="anm-actions">
          <button className="anm-btn anm-btn-primary" onClick={onAddAttachments}>
            Sure, let me add files
          </button>
          <button className="anm-btn anm-btn-ghost" onClick={onSkip}>
            Skip, submit without files
          </button>
        </div>
      </div>
    </div>
  );
}
