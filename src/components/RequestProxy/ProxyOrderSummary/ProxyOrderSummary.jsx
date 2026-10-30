import "../../RequestNumber/ActiveOrder/ActiveOrders.css";
import "./ProxyOrderSummary.css";

import { FormatterHelper } from "../../../helper/FormatterHelper";

export default function ProxyOrderSummary({
  priceData,
  isFetchingPrice,
  quantity,
}) {
  const showEmpty = !priceData && !isFetchingPrice;
  const showPriceBox = Boolean(priceData) || isFetchingPrice;
  const isRefreshing = isFetchingPrice;

  const unitPrice = priceData?.unitPrice;
  const period = priceData?.period ?? 1;
  const qty = priceData?.quantity ?? quantity ?? 1;
  const totalCost = priceData?.totalCost;
  const discount = Number(priceData?.discount) || 0;
  const hasQuote = Boolean(priceData);
  const showSaving = hasQuote && discount > 0;

  return (
    <div className="recent-card proxy-order-summary">
      <div className="card-header">
        <div className="orders-top">
          <span className="card-icon">
            <i className="fa-solid fa-receipt number-type-icon"></i>
          </span>
          <div>
            <div className="card-title">Order Summary</div>
            <div className="card-sub">Transparent pricing for your selection</div>
          </div>
        </div>
      </div>

      {showPriceBox ? (
        <div
          className={`price-summary-box ${isRefreshing ? "is-refreshing" : ""}`}
          aria-busy={isRefreshing}
        >
          <div className="price-summary-shimmer" aria-hidden="true" />

          <div className="price-breakdown">
            <div className="price-row">
              <span className="price-label">Unit price</span>
              <span
                className={`price-value ${isRefreshing ? "is-updating" : ""}`}
              >
                {hasQuote ? (
                  FormatterHelper.formatCurrency(unitPrice)
                ) : (
                  <span className="price-value-placeholder" />
                )}
              </span>
            </div>

            <div className="price-row">
              <span className="price-label">Quantity</span>
              <span
                className={`price-value price-value--muted ${isRefreshing ? "is-updating" : ""}`}
              >
                × {qty}
              </span>
            </div>

            <div className="price-row">
              <span className="price-label">Period</span>
              <span
                className={`price-value price-value--muted ${isRefreshing ? "is-updating" : ""}`}
              >
                {hasQuote ? (
                  `× ${period}`
                ) : (
                  <span className="price-value-placeholder price-value-placeholder--sm" />
                )}
              </span>
            </div>

            {showSaving ? (
              <div className="price-row">
                <span className="price-label">Discount</span>
                <span
                  className={`price-value ${isRefreshing ? "is-updating" : ""}`}
                >
                  {FormatterHelper.formatCurrency(discount)}
                </span>
              </div>
            ) : null}
          </div>

          <div className="price-divider">
            {isRefreshing ? (
              <span className="price-divider-progress" aria-hidden="true" />
            ) : null}
          </div>

          <div className="price-row total-row">
            <span className="price-label price-label--total">Total cost</span>
            <span
              className={`price-value total-value ${isRefreshing ? "is-updating" : ""}`}
            >
              {hasQuote ? (
                FormatterHelper.formatCurrency(totalCost)
              ) : (
                <span className="price-value-placeholder price-value-placeholder--lg" />
              )}
            </span>
          </div>
        </div>
      ) : null}

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
