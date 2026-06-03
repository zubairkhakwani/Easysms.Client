// components/DropdownPortal.jsx
import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

export function DropdownPortal({ trigger, children, open, onClose }) {
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  // Recalculate position whenever open changes
  useEffect(() => {
    if (!open || !triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    setCoords({
      top: rect.bottom + window.scrollY + 4, // 4px gap
      left: rect.left + window.scrollX,
      width: rect.width,
    });
  }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (
        !triggerRef.current?.contains(e.target) &&
        !dropdownRef.current?.contains(e.target)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  return (
    <>
      {/* Trigger — clones it and injects the ref */}
      <div ref={triggerRef} style={{ display: "inline-block" }}>
        {trigger}
      </div>

      {/* Dropdown teleported to <body> */}
      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "absolute",
              top: coords.top,
              left: coords.left,
              minWidth: coords.width,
              zIndex: 9999,
            }}
          >
            {children}
          </div>,
          document.body,
        )}
    </>
  );
}
