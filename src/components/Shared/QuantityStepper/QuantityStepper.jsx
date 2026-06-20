import { useEffect, useState } from "react";

import "./QuantityStepper.css";

function clamp(value, min, max) {
  let n = value;
  if (max != null) n = Math.min(max, n);
  return Math.max(min, n);
}

export default function QuantityStepper({
  value,
  onChange,
  min = 1,
  max,
  disabled = false,
  className = "",
}) {
  const [draft, setDraft] = useState(String(value));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) {
      setDraft(String(value));
    }
  }, [value, focused]);

  const commit = (raw) => {
    const parsed = parseInt(raw, 10);
    if (Number.isNaN(parsed)) {
      onChange(min);
      setDraft(String(min));
      return;
    }
    const next = clamp(parsed, min, max);
    onChange(next);
    setDraft(String(next));
  };

  const handleDecrement = () => {
    if (disabled || value <= min) return;
    const next = clamp(value - 1, min, max);
    onChange(next);
    setDraft(String(next));
  };

  const handleIncrement = () => {
    if (disabled) return;
    if (max != null && value >= max) return;
    const next = clamp(value + 1, min, max);
    onChange(next);
    setDraft(String(next));
  };

  return (
    <div className={`qty-stepper ${className}`.trim()}>
      <button
        type="button"
        className="num-qty-btn"
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
      >
        −
      </button>

      <input
        type="text"
        inputMode="numeric"
        className="qty-val"
        value={draft}
        disabled={disabled}
        aria-label="Quantity"
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          commit(draft);
        }}
        onChange={(e) => {
          const raw = e.target.value.replace(/\D/g, "");
          if (raw === "") {
            setDraft("");
            return;
          }
          const next = clamp(parseInt(raw, 10), min, max);
          setDraft(String(next));
          onChange(next);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            e.currentTarget.blur();
          }
        }}
      />

      <button
        type="button"
        className="num-qty-btn"
        onClick={handleIncrement}
        disabled={disabled || (max != null && value >= max)}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
