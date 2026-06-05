import { useEffect, useRef, useState } from "react";
import "./Maintenance.css";

// ── Configurable props ── //
const DEFAULT_STEPS = [
  { id: 2, label: "New features deployed", status: "done" },
  { id: 4, label: "Restoring services", status: "done" },
  { id: 1, label: "Database backup completed", status: "active" },
  { id: 3, label: "Running system tests", status: "pending" },
];

// ── Sub-components ── //

function GearIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path d="M19.622 10.395l-1.097-2.65L20 6l-2-2-1.735 1.483-2.707-1.113L12.935 2h-1.954l-.632 2.401-2.645 1.115L6 4 4 6l1.453 1.789-1.08 2.657L2 11v2l2.401.655L5.516 16.3 4 18l2 2 1.791-1.46 2.606 1.072L11 22h2l.604-2.387 2.651-1.098C16.697 19.48 18 20 18 20l2-2-1.484-1.75 1.106-2.648L22 13v-2l-2.378-.605Z" />
    </svg>
  );
}

function CheckIcon({ status }) {
  if (status === "done") {
    return (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="#22d3a0"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-label="Done"
      >
        <path d="M3 8l3.5 3.5L13 4.5" />
      </svg>
    );
  }
  if (status === "active") {
    return (
      <div
        className="maintenance-spinner"
        role="status"
        aria-label="In progress"
      />
    );
  }
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="rgba(200,215,245,0.3)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="Pending"
    >
      <circle cx="8" cy="8" r="5" />
    </svg>
  );
}

function Particles() {
  const particles = useRef(
    Array.from({ length: 28 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      dur: `${6 + Math.random() * 10}s`,
      delay: `${Math.random() * 10}s`,
      drift: `${(Math.random() - 0.5) * 80}px`,
      size: Math.random() > 0.7 ? 3 : 2,
    })),
  ).current;

  return (
    <div className="maintenance-particles" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="maintenance-particle"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            "--dur": p.dur,
            "--delay": p.delay,
            "--drift": p.drift,
          }}
        />
      ))}
    </div>
  );
}

// ── Main component ── //

export default function MaintenancePage({
  title = "We're upgrading things",
  titleAccent = "upgrading",
  description = "Our team is currently performing scheduled maintenance to bring you a better, faster experience. We'll be back online shortly.",
  progressTarget = 72,
  steps = DEFAULT_STEPS,
  contactEmail = "dev.fbmrobo@gmail.com",
}) {
  const [displayPct, setDisplayPct] = useState(0);
  const [barWidth, setBarWidth] = useState(0);

  // Animate progress on mount
  useEffect(() => {
    const rafDelay = requestAnimationFrame(() => {
      setBarWidth(progressTarget);
    });

    let current = 0;
    const duration = 2500; // ms
    const step = progressTarget / (duration / 16);
    const timer = setInterval(() => {
      current = Math.min(current + step, progressTarget);
      setDisplayPct(Math.round(current));
      if (current >= progressTarget) clearInterval(timer);
    }, 16);

    return () => {
      cancelAnimationFrame(rafDelay);
      clearInterval(timer);
    };
  }, [progressTarget]);

  // Build title with highlighted accent word
  const renderTitle = () => {
    if (!titleAccent || !title.includes(titleAccent)) return title;
    const [before, after] = title.split(titleAccent);
    return (
      <>
        {before}
        <span className="maintenance-title-accent">{titleAccent}</span>
        {after}
      </>
    );
  };

  return (
    <div className="maintenance-root" role="main">
      {/* Decorative backgrounds */}
      <div className="maintenance-bg" aria-hidden="true" />
      <div className="maintenance-grid" aria-hidden="true" />
      <Particles />

      {/* Status pill */}
      <div className="maintenance-status-bar" role="status" aria-live="polite">
        <div className="maintenance-status-dot" aria-hidden="true" />
        MAINTENANCE IN PROGRESS
      </div>

      {/* Card */}
      <div className="maintenance-card">
        {/* Animated gear */}
        <div className="maintenance-icon-wrap" aria-hidden="true">
          <div className="maintenance-icon-ring" />
          <div className="maintenance-icon-inner">
            <GearIcon />
          </div>
        </div>

        <p className="maintenance-eyebrow">System Update</p>
        <h1 className="maintenance-title">{renderTitle()}</h1>
        <p className="maintenance-description">{description}</p>

        {/* Progress bar */}
        <div
          className="maintenance-progress-wrap"
          role="progressbar"
          aria-valuenow={displayPct}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="maintenance-progress-label">
            <span>Update progress</span>
            <span className="maintenance-progress-pct">{displayPct}%</span>
          </div>
          <div className="maintenance-progress-track">
            <div
              className="maintenance-progress-bar"
              style={{ width: `${barWidth}%` }}
            />
          </div>
        </div>

        {/* Steps checklist */}
        <ul className="maintenance-checklist" aria-label="Update steps">
          {steps.map((step) => (
            <li
              key={step.id}
              className={`maintenance-checklist-item ${step.status}`}
            >
              <span className="maintenance-check-icon">
                <CheckIcon status={step.status} />
              </span>
              {step.label}
            </li>
          ))}
        </ul>

        <div className="maintenance-divider" aria-hidden="true" />

        {/* Footer */}
        <p className="maintenance-footer">
          Questions? Reach us at&nbsp;
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
        </p>
      </div>
    </div>
  );
}
