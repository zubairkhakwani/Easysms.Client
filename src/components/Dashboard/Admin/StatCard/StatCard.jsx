export default function StatCard({
  label,
  value,
  sub,
  subStrong,
  accent = "accent-cyan",

  delay = 0,
}) {
  return (
    <div
      className={`stat-card ${accent}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="stat-card-bg-glow" />
      <div className="stat-card-body">
        <span className="stat-card-value">{value}</span>
        <span className="stat-card-label">{label}</span>
      </div>
      {sub && (
        <div className="stat-card-sub">
          <span>🏆</span>
          <span>
            <strong>{subStrong}</strong> {sub}
          </span>
        </div>
      )}
    </div>
  );
}
