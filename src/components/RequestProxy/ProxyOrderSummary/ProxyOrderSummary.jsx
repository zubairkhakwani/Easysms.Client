import "../../RequestNumber/ActiveOrder/ActiveOrders.css";
import "./ProxyOrderSummary.css";

export default function ProxyOrderSummary({
  priceData,
  isFetchingPrice,
  quantity,
}) {
  return (
    <div className="recent-card proxy-order-summary">
      <div className="card-header">
        <div className="orders-top">
          <span className="card-icon">
            <i className="fa-solid fa-receipt number-type-icon"></i>
          </span>
          <div>
            <div className="card-title">Order Summary</div>
            <div className="card-sub">Pricing for your current selection</div>
          </div>
        </div>
      </div>

      {isFetchingPrice && !priceData ? (
        <div className="proxy-summary-loading">
          <div className="ph-spinner ph-spinner--sm proxy-summary-spinner" />
          <span className="proxy-summary-loading-text">Calculating price…</span>
        </div>
      ) : priceData ? (
        <div className="price-summary-box">
          <div className="price-row">
            <span className="price-label">Unit Price</span>
            <span className="price-value">
              ${priceData.unitPrice?.toFixed(2)}
            </span>
          </div>
          <div className="price-row">
            <span className="price-label">Quantity</span>
            <span className="price-value">× {quantity}</span>
          </div>
          <div className="price-divider" />
          <div className="price-row total-row">
            <span className="price-label">Total Cost</span>
            <span className="price-value total-value">
              ${priceData.totalCost?.toFixed(2)}
            </span>
          </div>
        </div>
      ) : (
        <div className="proxy-summary-empty">
          <div className="proxy-summary-empty-icon">
            <i className="fa-solid fa-sliders"></i>
          </div>
          <p className="proxy-summary-empty-text">
            Complete your selections to see pricing
          </p>
        </div>
      )}
    </div>
  );
}
