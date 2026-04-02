//Css
import "./PhysicalNumberOptions.css";

export function PhysicalNumberOptions({ numberType, setNumberType }) {
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

        <div
          className={`number-type-card ${numberType === "physical" ? "active" : ""}`}
          onClick={() => setNumberType("physical")}
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
        </div>
      </div>
    </div>
  );
}
