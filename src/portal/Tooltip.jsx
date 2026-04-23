import { createPortal } from "react-dom";
import { useRef, useState } from "react";

export default function Tooltip({ tooltip, btn }) {
  const ref = useRef(null);

  const [visible, setVisible] = useState(true);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const handleMouseEnter = () => {
    const rect = ref.current.getBoundingClientRect();

    setPosition({
      left: rect.left + rect.width / 2,
      top: rect.top - 8,
    });

    setVisible(true);
  };

  return (
    <span
      ref={ref}
      className="info-icon-wrapper"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setVisible(false)}
    >
      {btn ? (
        btn
      ) : (
        <svg
          className="info-icon"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="10"
            cy="10"
            r="9"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M10 9v5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="10" cy="6.5" r="0.75" fill="currentColor" />
        </svg>
      )}

      {visible &&
        createPortal(
          <div
            className="tooltip"
            style={{
              position: "fixed",
              left: position.left,
              top: position.top,
              transform: "translateX(-50%) translateY(-100%)",
            }}
          >
            {tooltip}
            <div className="tooltip-arrow" />
          </div>,
          document.body,
        )}
    </span>
  );
}
