import { useEffect, useRef, useState } from "react";

/**
 * Parses a formatted currency/number string like "$1,234.56" → 1234.56
 * Returns null if it can't be parsed (so we skip the animation).
 */
function parseNumeric(val) {
  if (val == null) return null;
  const str = String(val).replace(/[^0-9.-]/g, "");
  const n = parseFloat(str);
  return isNaN(n) ? null : n;
}

/**
 * Re-formats a raw number back to match the original value's format.
 * Detects: currency prefix ($), comma separators, decimal places.
 */
function reformat(raw, template) {
  const str = String(template ?? "");
  const hasCurrency = /^\$/.test(str);
  const decimalPlaces = str.includes(".")
    ? str.split(".")[1].replace(/[^0-9]/g, "").length
    : 0;

  let formatted = raw.toLocaleString("en-US", {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });

  return hasCurrency ? `$${formatted}` : formatted;
}

/**
 * useCountUp — animates a number from 0 → target whenever `target` changes.
 * duration: ms, easingFn: t → 0..1
 */
function useCountUp(target, duration = 900) {
  const [display, setDisplay] = useState(target); // start at target (SSR safe)
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const fromRef = useRef(0);

  useEffect(() => {
    const numeric = parseNumeric(target);
    if (numeric === null) {
      setDisplay(target);
      return;
    }

    // Cancel any in-flight animation
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const from = fromRef.current;
    startRef.current = null;

    const ease = (t) => 1 - Math.pow(1 - t, 3); // easeOutCubic

    const tick = (now) => {
      if (!startRef.current) startRef.current = now;
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const current = from + (numeric - from) * ease(progress);

      setDisplay(reformat(current, target));
      fromRef.current = current;

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(target); // snap to exact final value
        fromRef.current = numeric;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return display;
}

export default function StatCard({
  label,
  value,
  accent = "accent-cyan",
  icon,
  trendUp,
  trendLabel,
  sub,
  subStrong,
  subIcon = "🏆",
  delay = 0,
  loading = false,
  animKey,
}) {
  const animatedValue = useCountUp(loading ? value : value, 900);

  // Re-run count-up when animKey changes (filter apply)
  const [internalKey, setInternalKey] = useState(0);
  const prevAnimKey = useRef(animKey);
  useEffect(() => {
    if (animKey !== prevAnimKey.current) {
      prevAnimKey.current = animKey;
      setInternalKey((k) => k + 1);
    }
  }, [animKey]);

  const hasTrend = trendUp !== undefined && trendUp !== null;

  if (loading) {
    return (
      <div
        className={`stat-card ${accent} stat-card--skeleton`}
        style={{ animationDelay: `${delay}ms` }}
      >
        <div className="stat-card-bg-glow" />
        <div className="stat-card-header">
          <div
            className="skeleton-box"
            style={{ width: 38, height: 38, borderRadius: "var(--radius-sm)" }}
          />
          <div
            className="skeleton-box"
            style={{
              width: 56,
              height: 22,
              borderRadius: "var(--radius-full)",
            }}
          />
        </div>
        <div className="stat-card-body">
          <div
            className="skeleton-box"
            style={{ width: "70%", height: 36, marginBottom: 6 }}
          />
          <div className="skeleton-box" style={{ width: "50%", height: 14 }} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`stat-card ${accent}`}
      style={{ animationDelay: `${delay}ms` }}
      key={internalKey}
    >
      <div className="stat-card-bg-glow" />

      {/* ── Body: value + label ── */}
      <div className="stat-card-body">
        <span className="stat-card-value stat-card-value--animated">
          {animatedValue}
        </span>
        <span className="stat-card-label">{label}</span>
      </div>

      {/* ── Sub-line ── */}
      {sub && (
        <div className="stat-card-sub">
          <span>{subIcon}</span>
          <span>
            {subStrong && <strong>{subStrong}</strong>} {sub}
          </span>
        </div>
      )}
    </div>
  );
}
