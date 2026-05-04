export function AdminStats({ title, titleIcon, subTitle, stats }) {
  return (
    <div className="um-stats-section">
      <div className="um-section-header">
        <div className="um-section-title">
          {titleIcon} {title}
        </div>

        <div className="um-section-sub">{subTitle}</div>
      </div>

      <div className="um-stats-row">
        {stats.map((s) => (
          <div key={s.label} className="um-stat-card system">
            <div className="um-stat-val">{s.val}</div>

            <div className="um-stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
