export default function ActiveOrdersSkelton() {
  return (
    <div className="order-row">
      <div className="order-row-top">
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            className="skeleton-pulse skeleton-text"
            style={{ width: "70px" }}
          />
          <span
            className="skeleton-pulse skeleton-text"
            style={{ width: "4px" }}
          />
          <span
            className="skeleton-pulse skeleton-text"
            style={{ width: "90px" }}
          />
          <span
            className="skeleton-pulse skeleton-text"
            style={{ width: "4px" }}
          />
          <span
            className="skeleton-pulse skeleton-text"
            style={{ width: "60px" }}
          />
        </div>
        <span
          className="skeleton-pulse skeleton-text"
          style={{ width: "50px" }}
        />
      </div>

      <div
        className="skeleton-pulse skeleton-text"
        style={{ width: "160px" }}
      />
      <div
        className="skeleton-pulse skeleton-text"
        style={{ width: "110px" }}
      />

      <div className="order-actions">
        <div className="skeleton-pulse skeleton-btn" />
        <div className="skeleton-pulse skeleton-btn" />
        <div className="skeleton-pulse skeleton-btn" />
      </div>
    </div>
  );
}
