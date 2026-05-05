export function AccountCardSkeleton() {
  return (
    <div className="account-card">
      {/* Header */}
      <div className="account-card-header">
        <div className="card-title">
          <div className="card-platform-row">
            <span className="skeleton-pulse skeleton-icon" />
            <span
              className="skeleton-pulse skeleton-name"
              style={{ width: 90, height: 14 }}
            />
          </div>
          <span
            className="skeleton-pulse skeleton-text"
            style={{ width: 60, height: 11 }}
          />
        </div>
        <span
          className="skeleton-pulse"
          style={{ width: 90, height: 24, borderRadius: 999 }}
        />
      </div>

      {/* Description */}
      <span
        className="skeleton-pulse skeleton-text"
        style={{ width: "100%" }}
      />
      <span className="skeleton-pulse skeleton-text" style={{ width: "78%" }} />
      <span className="skeleton-pulse skeleton-text" style={{ width: "55%" }} />

      {/* Feature Tags */}
      <div className="feature-tags">
        {[52, 70, 60, 80].map((w, i) => (
          <span
            key={i}
            className="skeleton-pulse"
            style={{
              display: "inline-block",
              width: w,
              height: 22,
              borderRadius: 999,
            }}
          />
        ))}
      </div>

      {/* Pricing */}
      <div className="pricing-section">
        <div className="pricing-row">
          {[0, 1, 2].map((i) => (
            <div key={i} className="pricing-item">
              <span
                className="skeleton-pulse"
                style={{
                  display: "block",
                  width: 48,
                  height: 22,
                  marginBottom: 6,
                }}
              />
              <span
                className="skeleton-pulse"
                style={{ display: "block", width: 36, height: 10 }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="card-actions">
        <span className="skeleton-pulse skeleton-stepper" />
        <span
          className="skeleton-pulse skeleton-btn"
          style={{ flex: 1, height: 38 }}
        />
      </div>
    </div>
  );
}
