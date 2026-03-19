export default function PlaceholderPage({ page }) {
  const label = page.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="placeholder-page">
      <div className="placeholder-inner">
        <div className="placeholder-icon">⊟</div>
        <h2 className="placeholder-title">{label}</h2>
        <p className="placeholder-sub">
          This section is coming soon. Focus is on the Overview dashboard for
          now.
        </p>
        <div className="placeholder-badge">Under Construction</div>
      </div>
    </div>
  );
}
