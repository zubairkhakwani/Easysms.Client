import "./RecentOrders.css";

export default function RecentOrders() {
  return (
    <div className="card">
      <div className="card-header">
        <div className="orders-top" style={{ width: "100%" }}>
          <div
            style={{
              display: "flex",
              gap: "14px",
              alignItems: "flex-start",
            }}
          >
            <span className="card-icon">🕐</span>
            <div>
              <div className="card-title">Recent Orders</div>
              <div className="card-sub" id="ordersSub">
                Your orders will appear here
              </div>
            </div>
          </div>
          <span
            className="orders-badge"
            id="ordersBadge"
            style={{ display: "none" }}
          >
            0
          </span>
        </div>
      </div>

      <div id="emptyState" className="empty-state">
        <div className="empty-icon">📭</div>
        <div className="empty-text">No orders yet</div>
        <div className="empty-hint">
          Numbers you purchase will show up here instantly — no need to navigate
          away.
        </div>
      </div>

      <div
        id="ordersList"
        className="orders-list"
        style={{ display: "none" }}
      ></div>
    </div>
  );
}
