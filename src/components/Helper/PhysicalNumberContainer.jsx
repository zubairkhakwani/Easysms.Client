//Css
import "./PhysicalNumberContainer.css";

//Helper
import { FormatterHelper } from "../../helper/FormatterHelper";

export const PhysicalNumberContainer = ({
  availability,
  price,
  numberType,
  quantity,
  setQuantity,
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
          <span className="summary-country-name">USA/Canada</span>
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

      <div className="summary-divider" />

      {numberType === "physical" && (
        <div className="summary-bottom">
          <div className="summary-col">
            <label className="summary-label">Quantity</label>

            <div className="qty-stepper">
              <button
                className="num-qty-btn"
                onClick={() =>
                  setQuantity((q) => Math.max(availability > 0 ? 1 : 0, q - 1))
                }
              >
                −
              </button>

              <span className="qty-val">{quantity}</span>

              <button
                className="num-qty-btn"
                onClick={() =>
                  setQuantity((q) => Math.min(availability, q + 1))
                }
              >
                +
              </button>
            </div>
            {getAvailabilityMessage()}
          </div>
        </div>
      )}
    </div>
  );
};
