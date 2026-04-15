import { useMemo } from "react";
import "./StrengthBar.css";

export default function StrengthBar({ password }) {
  const strengthScore = useMemo(() => {
    if (!password) return 0;

    let score = 0;

    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    return score;
  }, [password]);

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"][
    strengthScore
  ];

  const strengthColors = [
    "",
    "#e74c3c",
    "#f39c12",
    "#3498db",
    "#2ecc71",
    "#27ae60",
  ];

  const strengthColor = strengthColors[strengthScore];

  return (
    <div className="rp-strength-wrap">
      <div className="rp-strength-bars">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="rp-strength-bar"
            style={{
              background: i <= strengthScore ? strengthColor : "#eee",
            }}
          />
        ))}
      </div>

      <span className="rp-strength-label" style={{ color: strengthColor }}>
        {strengthLabel}
      </span>
    </div>
  );
}
