import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./NavDropdownMenu.css";

/**
 * NavDropdownMenu
 *
 * Props:
 *  label       – trigger label shown in the navbar       (string)
 *  items       – array of { label, description, to, icon, badge? }
 *                  icon: Font Awesome class e.g. "fa-solid fa-wallet"
 *                  badge: "New" | "Hot" | "Soon"
 *  onItemClick – optional callback (e.g. close mobile menu)
 */
export default function NavDropdownMenu({ label, items = [], onItemClick }) {
  const [open, setOpen] = useState(false);
  const timerRef = useRef(null);

  const show = () => {
    clearTimeout(timerRef.current);
    setOpen(true);
  };

  const hide = () => {
    timerRef.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <div className="ndm-root" onMouseEnter={show} onMouseLeave={hide}>
      {/* ── Trigger ── */}
      <span
        className={`hvr-undr cyan med-bold ndm-trigger ${open ? "ndm-trigger--open" : ""}`}
      >
        {label}
        <svg
          className={`ndm-chevron ${open ? "ndm-chevron--open" : ""}`}
          viewBox="0 0 10 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      {/* ── Panel ── */}
      {open && (
        <div className="ndm-panel" onMouseEnter={show} onMouseLeave={hide}>
          <div className="ndm-panel-inner">
            {items.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="ndm-item"
                onClick={() => {
                  setOpen(false);
                  onItemClick?.();
                }}
              >
                {/* Icon bubble — top-aligned */}
                <span className="ndm-icon-wrap">
                  <i className={item.icon} />
                </span>

                {/* Text block */}
                <span className="ndm-item-body">
                  <span className="ndm-item-top">
                    <span className="ndm-item-label">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`ndm-badge ndm-badge--${item.badge.toLowerCase()}`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </span>
                  {item.description && (
                    <span className="ndm-item-desc">{item.description}</span>
                  )}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
