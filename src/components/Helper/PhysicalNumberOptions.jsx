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
            <span className="number-type-title">Virtual number</span>
            <div
              className={`number-type-dot ${numberType === "virtual" ? "checked" : ""}`}
            />
          </div>
          <span className="number-type-badge badge-green">Refundable</span>
          <p className="number-type-desc">
            Real phone number — we handle OTP delivery automatically.
          </p>
        </div>

        <div
          className={`number-type-card ${numberType === "physical" ? "active" : ""}`}
          onClick={() => setNumberType("physical")}
        >
          <div className="number-type-card-top">
            <span className="number-type-title">Physical link</span>
            <div
              className={`number-type-dot ${numberType === "physical" ? "checked" : ""}`}
            />
          </div>
          <span className="number-type-badge badge-amber">Non-refundable</span>
          <p className="number-type-desc">
            Direct inbox link — you access OTPs via the provided URL.
          </p>
        </div>
      </div>
    </div>
  );
}
