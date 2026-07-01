import "../Helper/PhysicalNumberContainer.css";
import "./PhysicalNumberSkelton.css";

/** Summary box placeholder — matches PhysicalNumberContainer layout height. */
function SummarySkeleton({ showQuantity }) {
  return (
    <div className="purchase-summary purchase-summary--skeleton">
      <div className="summary-top">
        <div className="summary-service">
          <div className="skeleton-pulse skeleton-icon" />
          <div className="skeleton-pulse skeleton-text ph-sk-line ph-sk-line--80" />
        </div>
        <div className="summary-country">
          <div className="skeleton-pulse skeleton-icon" />
          <div className="skeleton-pulse skeleton-text ph-sk-line ph-sk-line--100" />
        </div>
      </div>

      <div className="summary-divider" />

      <div className="summary-mid">
        <div className="skeleton-pulse skeleton-text ph-sk-line ph-sk-line--90" />
        <div className="summary-price-block">
          <div className="skeleton-pulse skeleton-text ph-sk-line ph-sk-line--60" />
          <div className="skeleton-pulse skeleton-text ph-sk-line ph-sk-line--50 ph-sk-line--price" />
        </div>
      </div>

      {showQuantity && (
        <>
          <div className="summary-divider" />
          <div className="summary-bottom">
            <div className="summary-col">
              <div className="skeleton-pulse skeleton-text ph-sk-line ph-sk-line--55" />
              <div className="skeleton-pulse skeleton-stepper" />
              <div className="skeleton-pulse skeleton-text ph-sk-line ph-sk-line--180" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * @param {"full" | "summary"} variant
 * - full: initial provider load (entire physical section)
 * - summary: country change — only the purchase summary card refreshes
 * @param {"virtual" | "physical"} numberType — controls quantity block visibility (summary variant)
 */
export const PhysicalNumberSkelton = ({
  variant = "full",
  numberType = "physical",
}) => {
  const showQuantity = variant === "full" || numberType === "physical";
  return <SummarySkeleton showQuantity={showQuantity} />;
};
