//React
import { useEffect, useState } from "react";

//Helper
import { FormatterHelper } from "../../helper/FormatterHelper";

//Css
import "./AnimatedCounter.css";

export default function AnimatedCounter({
  value,
  type = "number",
  format = "currency",
  prefix = "",
  suffix = "",
  duration = 1400,
}) {
  const [display, setDisplay] = useState(type === "string" ? "—" : "0");

  useEffect(() => {
    if (type === "string") animateString(value, duration, setDisplay);
    else animateNumber(value, duration, format, setDisplay);
  }, [value]);

  return (
    <span className="counter">
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

function animateNumber(target, duration, format, setDisplay) {
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(target * eased);

    if (format === "currency") {
      setDisplay(FormatterHelper.formatCurrency(current));
    } else {
      setDisplay(FormatterHelper.formatNumber(current));
    }

    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function animateString(target, duration, setDisplay) {
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const revealed = Math.floor(progress * target.length);
    let result = "";
    for (let i = 0; i < target.length; i++) {
      result +=
        i < revealed
          ? target[i]
          : CHARS[Math.floor(Math.random() * CHARS.length)];
    }
    setDisplay(result);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
