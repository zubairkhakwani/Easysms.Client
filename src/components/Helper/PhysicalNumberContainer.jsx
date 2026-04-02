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
        ✅ You can purchase up to <b>{availability}</b> numbers.
      </p>
    );
  };

  return (
    <div className="purchase-summary">
      <div className="summary-top">
        <div className="summary-service">
          <div className="service-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877f2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </div>
          <span className="summary-service-name">Facebook</span>
        </div>

        <div className="summary-country">
          <span className="summary-flag">🌍</span>
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
                className="qty-btn"
                onClick={() =>
                  setQuantity((q) => Math.max(availability > 0 ? 1 : 0, q - 1))
                }
              >
                −
              </button>

              <span className="qty-val">{quantity}</span>

              <button
                className="qty-btn"
                onClick={() =>
                  setQuantity((q) => Math.min(availability, q + 1))
                }
              >
                +
              </button>
            </div>
          </div>
        </div>
      )}
      {getAvailabilityMessage()}
    </div>
  );
};
