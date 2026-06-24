//Css
import "./PhysicalNumberContainer.css";

//Helper
import { FormatterHelper } from "../../helper/FormatterHelper";
import QuantityStepper from "../Shared/QuantityStepper/QuantityStepper";

export const PhysicalNumberContainer = ({
  availability,
  price,
  numberType,
  quantity,
  setQuantity,
  countryName,
}) => {
  const getAvailabilityMessage = () => {
    if (availability === 0) {
      return (
        <p className="qty-helper qty-helper--error ">
          <i className="fa-regular fa-face-frown"></i> No numbers are available
          right now. Please check back later.
        </p>
      );
    }

    if (availability <= 25) {
      return (
        <p className="qty-helper qty-helper--low">
          <i className="fa-solid fa-fire"></i> Only <b> {availability} </b>
          {availability === 1 ? "number" : "numbers"} left — grab them before
          they're gone!
        </p>
      );
    }

    return (
      <p className="qty-helper qty-helper--available">
        You can purchase up to <b>{availability}</b> numbers.
      </p>
    );
  };

  return (
    <div className="purchase-summary">
      <div className="summary-top">
        <div className="summary-service">
          <div className="">
            <i
              className="fa-brands fa-facebook"
              style={{ color: "#1877F2" }}
            ></i>
          </div>
          <span className="summary-service-name">Facebook</span>
        </div>

        <div className="summary-country">
          <span className="summary-flag">
            <i className="fa-solid fa-globe number-type-icon"></i>
          </span>
          <span className="summary-country-name">{countryName || "—"}</span>
        </div>
      </div>

      <div className="summary-divider" />

      <div className="summary-mid">
        <div className="summary-availability">
          {availability ?? 0} available
        </div>

        <div className="summary-price-block">
          <span className="summary-per">per number</span>
          <span className="summary-price">
            ${FormatterHelper.formatNumber(price)}
          </span>
        </div>
      </div>

      {numberType === "physical" && (
        <>
          <div className="summary-divider" />
          <div className="summary-bottom">
            <div className="summary-col">
              <label className="summary-label">Quantity</label>

              <QuantityStepper
                value={quantity}
                onChange={setQuantity}
                min={availability > 0 ? 1 : 0}
                max={availability}
                disabled={availability === 0}
              />
              {getAvailabilityMessage()}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
