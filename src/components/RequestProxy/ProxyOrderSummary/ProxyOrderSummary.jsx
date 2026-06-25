import "../../RequestNumber/ActiveOrder/ActiveOrders.css";
import "./ProxyOrderSummary.css";

import { FormatterHelper } from "../../../helper/FormatterHelper";

export default function ProxyOrderSummary({
  priceData,
  isFetchingPrice,
  quantity,
}) {
  const showLoading = isFetchingPrice && !priceData;
  const showPrice = Boolean(priceData);
  const showEmpty = !priceData && !isFetchingPrice;

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

      <div
        className={`proxy-summary-loading ${showLoading ? "" : "is-hidden"}`}
        aria-hidden={!showLoading}
      >
        <div className="ph-spinner ph-spinner--sm proxy-summary-spinner" />
        <span className="proxy-summary-loading-text">Calculating price…</span>
      </div>

      <div
        className={`price-summary-box ${showPrice ? "" : "is-hidden"}`}
        aria-hidden={!showPrice}
      >
        <div className="price-row">
          <span className="price-label">Unit Price</span>
          <span className="price-value">
            {FormatterHelper.formatCurrency(priceData?.unitPrice)}
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
            {FormatterHelper.formatCurrency(priceData?.totalCost)}
          </span>
        </div>
      </div>

      <div
        className={`proxy-summary-empty ${showEmpty ? "" : "is-hidden"}`}
        aria-hidden={!showEmpty}
      >
        <div className="proxy-summary-empty-icon">
          <i className="fa-solid fa-sliders"></i>
        </div>
        <p className="proxy-summary-empty-text">
          Complete your selections to see pricing
        </p>
      </div>
    </div>
  );
}
