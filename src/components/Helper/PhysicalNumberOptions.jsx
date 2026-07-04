//Css
import "./PhysicalNumberOptions.css";

export function PhysicalNumberOptions({
  numberType,
  setNumberType,
  physicalLinksActive = false,
  premiumNumberLinksActive = false,
}) {
  // Per-country off => hide the "Number with link" card. Master switch off => show it but disabled.
  const showPhysicalCard = physicalLinksActive;
  const physicalDisabled = !premiumNumberLinksActive;

  return (
    <div className="number-type-section">
      <label className="field-label">
        <i className="fa-solid fa-layer-group number-type-icon"></i> Number type
      </label>
      <div className="number-type-cards">
        <div
          className={`number-type-card ${numberType === "virtual" ? "active" : ""}`}
          onClick={() => setNumberType("virtual")}
        >
          <div className="number-type-card-top">
            <span className="number-type-title">Number</span>
            <div
              className={`number-type-dot ${numberType === "virtual" ? "checked" : ""}`}
            />
          </div>
          <span className="number-type-badge badge-green">Refundable</span>
          <p className="number-type-desc">
            Premium number. you will receive the OTP automatically inside
            website.
          </p>
        </div>

        {showPhysicalCard && (
          <div
            className={`number-type-card ${numberType === "physical" ? "active" : ""} ${
              physicalDisabled ? "number-type-card--disabled" : ""
            }`}
            onClick={
              physicalDisabled ? undefined : () => setNumberType("physical")
            }
            aria-disabled={physicalDisabled}
          >
            <div className="number-type-card-top">
              <span className="number-type-title">Number with link</span>
              <div
                className={`number-type-dot ${numberType === "physical" ? "checked" : ""}`}
              />
            </div>
            <span className="number-type-badge badge-amber">Non-refundable</span>
            <p className="number-type-desc">
              Premium number with inbox link. you can access OTP via the provided
              URL.
            </p>
            {physicalDisabled && (
              <span className="number-type-unavailable">
                Temporarily unavailable
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
