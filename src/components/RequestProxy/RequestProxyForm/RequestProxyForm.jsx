//React
import { useEffect, useState, useContext } from "react";

//Context
import { AuthContext } from "../../../context/AuthContext";

//Providers
import { Providers } from "../../../data/Static";

//Toaster
import { successTaost, errorToast } from "../../../helper/Toaster";

//Helper
import { FormatterHelper } from "../../../helper/FormatterHelper.js";

//Services

import {
  getProxyMetaData,
  calculateProxyOrder,
  requestProxy,
} from "../../../services/Proxy/ProxyService.js";

//Components
import { PhysicalNumberContainer } from "../../Helper/PhysicalNumberContainer";
import { PhysicalNumberOptions } from "../../Helper/PhysicalNumberOptions";

//Skeltons
import { PhysicalNumberSkelton } from "../../Skeltons/PhysicalNumberSkelton.jsx";

//Modals
import { ProxyOrderConfirmationModal } from "../../Helper/Modals/Proxy/ProxyOrderConfirmationModal.jsx";

//Css
import "./RequestProxyForm.css";

export default function RequestProxyForm() {
  const { balanceDebit } = useContext(AuthContext);

  //Data
  const [metaData, setMetaData] = useState([]);
  const [authType, setAuthType] = useState("namePassword");
  const [staticIp, setStaticIp] = useState(["", "", "", ""]);

  //Calculate the order price
  const [priceData, setPriceData] = useState(null);

  //Proxy order confirmation response
  const [orderConfirmationData, setOrderConfirmationData] = useState(null);

  //Selected Values
  const [selectedService, setSelectedService] = useState("Ipv4");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [selectedPurpose, setSelectedPurpose] = useState(null);

  //Loading
  const [isRequestingProxy, setIsRequestingProxy] = useState(false);
  const [isFetchingPrice, setIsFetchingPrice] = useState(false);

  const [quantityState, setQuantityState] = useState({
    current: 1,
    min: 1,
  });

  const isStaticIpValid = () => {
    if (authType !== "staticIp") return true;

    return staticIp.every((octet) => {
      if (octet === "") return false;
      if (/^0\d/.test(octet)) return false;
      const num = Number(octet);
      return num >= 0 && num <= 255;
    });
  };

  const getValidStaticIp = () => {
    if (staticIp.some((octet) => octet === "")) {
      return null;
    }

    return staticIp.join(".");
  };

  const purchaseState =
    selectedService &&
    selectedLocation &&
    selectedPeriod &&
    selectedPurpose &&
    quantityState.current > 0 &&
    !isFetchingPrice &&
    isStaticIpValid();

  //Load Proxy MetaData from the API
  const fetchProxyMetaData = async () => {
    let metaData = [];

    try {
      metaData = await getProxyMetaData();
    } catch {
      errorToast("Failed to fetch proxy metadata, please try later.");
    } finally {
      setMetaData(metaData);
    }
  };

  useEffect(() => {
    fetchProxyMetaData();
  }, []);

  //Calculate the order price
  const fetchOrderPrice = async () => {
    setIsFetchingPrice(true);
    try {
      let response = await calculateProxyOrder({
        service: selectedService,
        location: selectedLocation,
        period: selectedPeriod,
        purpose: selectedPurpose,
        staticIp: getValidStaticIp(),
        quantity: quantityState.current,
      });
      if (response.isSuccess) {
        setPriceData(response.data);
      } else {
        errorToast(response.message);
      }
    } catch {
      errorToast("Failed to calculate proxy order.");
    } finally {
      setIsFetchingPrice(false);
    }
  };

  //Handle when quantity changes
  useEffect(() => {
    if (
      quantityState.current <= 0 ||
      !selectedService ||
      !selectedLocation ||
      !selectedPeriod ||
      !selectedPurpose
    ) {
      return;
    }

    fetchOrderPrice();
  }, [
    quantityState.current,
    selectedLocation,
    selectedPeriod,
    selectedPurpose,
  ]);

  //Handle Location Change
  const handleLocationChange = (e) => {
    let value = e.target.value;
    setSelectedLocation(value);
  };

  //Handle Location Change
  const handlePeriodChange = (e) => {
    let value = e.target.value;
    setSelectedPeriod(value);
  };

  //Handle Purpose Change
  const handlePurposeChange = (e) => {
    let value = e.target.value;
    setSelectedPurpose(value);
  };

  //Handle Quanity Change
  const handleQuantity = (action) => {
    if (action === "plus") {
      setQuantityState((prev) => ({
        ...prev,
        current: prev.current + 1,
      }));
    } else if (
      action === "minus" &&
      quantityState.current > quantityState.min
    ) {
      setQuantityState((prev) => ({
        ...prev,
        current: prev.current - 1,
      }));
    }
  };

  //Handle Ip Address Change
  const handleIpAddressChange = (e, index) => {
    const val = e.target.value.replace(/\D/g, "");
    if (Number(val) > 255) return;
    const updated = [...staticIp];
    updated[index] = val;
    setStaticIp(updated);
    // Auto-focus next field when 3 digits entered
    if (val.length === 3 && index < 3) {
      document.querySelectorAll(".ip-octet-input")[index + 1]?.focus();
    }
  };

  //Handle Ip Address Key Down
  const handleKeyDownIpAddress = (e, index, octet) => {
    if (e.key === "Backspace" && octet === "" && index > 0) {
      document.querySelectorAll(".ip-octet-input")[index - 1]?.focus();
    }
  };

  //Handle Ip Address Paste
  const handleIpAdressPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text");
    const parts = pasted.split(".");

    if (parts.length === 4) {
      const valid = parts.every(
        (p) => p !== "" && !isNaN(p) && Number(p) >= 0 && Number(p) <= 255,
      );
      if (valid) {
        setStaticIp(parts.map(String));
      }
    }
  };

  const handleCloseModal = () => {
    setOrderConfirmationData(null);
  };

  //Request Proxy
  const handleRequestProxy = async () => {
    setIsRequestingProxy(true);

    try {
      let response = await requestProxy({
        service: selectedService,
        location: selectedLocation,
        period: selectedPeriod,
        purpose: selectedPurpose,
        staticIp: getValidStaticIp(),
        quantity: quantityState.current,
      });

      let responseMessage = response.message;

      if (response.isSuccess) {
        let responseData = response.data;
        balanceDebit(responseData.totalCost);
        successTaost(responseMessage);
        setOrderConfirmationData(responseData);
      } else {
        errorToast(responseMessage);
      }
    } catch {
      errorToast("Failed to request proxy, please try later.");
    } finally {
      setIsRequestingProxy(false);
    }
  };

  return (
    <>
      <div className="card">
        <div className="card-header">
          <span className="card-icon">
            <i className="fa-solid fa-sim-card number-type-icon"></i>
          </span>
          <div>
            <div className="card-title">Get Ipv4 Proxy</div>
            <div className="card-sub">Configure your options below</div>
          </div>
        </div>
        <div className="fields">
          {/* Services */}
          <div className="field">
            <label>
              <i className="fa-solid fa-gear number-type-icon"></i>
              Service
            </label>

            <select defaultValue="">
              <option value="" disabled>
                Proxy Ipv4
              </option>
            </select>
          </div>

          {/* Location */}
          <div className="field">
            <label>
              <i className="fa-solid fa-envelope number-type-icon"></i>
              Location
            </label>

            <select
              id="operator"
              className="operator-select"
              defaultValue=""
              disabled={!selectedService}
              onChange={handleLocationChange}
            >
              <option value="" disabled>
                {!selectedService ? "First select service" : "Select location"}
              </option>
              {metaData.data?.countries?.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Period */}
          <div className="field">
            <label>
              <i className="fa-solid fa-dollar-sign number-type-icon"></i>
              Period
            </label>
            <select
              id="operator"
              defaultValue=""
              onChange={handlePeriodChange}
              className="operator-select"
            >
              <option value="" disabled>
                Select Period
              </option>

              {metaData.data?.periods?.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Purpose */}
          <div className="field">
            <label>
              <i className="fa-solid fa-dollar-sign number-type-icon"></i>
              Purpose
            </label>
            <select
              defaultValue=""
              id="operator"
              onChange={handlePurposeChange}
              className="operator-select"
            >
              <option value="" disabled>
                Select purpose
              </option>

              {metaData.data?.purposes?.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Authorization */}
          <div className="field">
            <label>
              <i className="fa-solid fa-shield-halved number-type-icon"></i>
              Authorization
            </label>
            <div className="auth-toggle">
              <label className="auth-option">
                <input
                  type="radio"
                  name="authType"
                  value="namePassword"
                  checked={authType === "namePassword"}
                  onChange={() => {
                    setAuthType("namePassword");
                    setStaticIp(["", "", "", ""]);
                  }}
                />
                <span>Name & Password</span>
              </label>
              <label className="auth-option">
                <input
                  type="radio"
                  name="authType"
                  value="staticIp"
                  checked={authType === "staticIp"}
                  onChange={() => setAuthType("staticIp")}
                />
                <span>Static IP</span>
              </label>
            </div>
          </div>

          {/* Static IP Input */}
          {authType === "staticIp" && (
            <div className="field">
              <label>
                <i className="fa-solid fa-network-wired number-type-icon"></i>
                Static IP Address
              </label>
              <div className="ip-input-group">
                {staticIp.map((octet, index) => (
                  <>
                    <input
                      type="text"
                      className="ip-octet-input"
                      value={octet}
                      maxLength={3}
                      placeholder="---"
                      onPaste={handleIpAdressPaste}
                      onChange={(e) => handleIpAddressChange(e, index)}
                      onKeyDown={(e) => handleKeyDownIpAddress(e, index, octet)}
                    />
                    {index < 3 && <span className="ip-dot">.</span>}
                  </>
                ))}
              </div>
            </div>
          )}

          <div className="field">
            <div className="summary-col" bis_skin_checked="1">
              <label className="summary-label">Quantity</label>
              <div className="qty-stepper" bis_skin_checked="1">
                <button
                  className="num-qty-btn"
                  onClick={() => handleQuantity("minus")}
                >
                  −
                </button>
                <span className="qty-val">{quantityState.current}</span>
                <button
                  className="num-qty-btn"
                  onClick={() => handleQuantity("plus")}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Price Summary */}
          {(isFetchingPrice || priceData) && (
            <div className="field">
              <div className="price-summary-box">
                <div className="price-summary-title">
                  <i className="fa-solid fa-receipt number-type-icon"></i>
                  Order Summary
                </div>

                <>
                  <div className="price-row">
                    <span className="price-label">Unit Price</span>
                    <span className="price-value">
                      ${priceData?.unitPrice?.toFixed(2)}
                    </span>
                  </div>
                  <div className="price-row">
                    <span className="price-label">Quantity</span>
                    <span className="price-value">
                      × {quantityState.current}
                    </span>
                  </div>
                  <div className="price-divider" />
                  <div className="price-row total-row">
                    <span className="price-label">Total Cost</span>
                    <span className="price-value total-value">
                      ${priceData?.totalCost?.toFixed(2)}
                    </span>
                  </div>
                </>
              </div>
            </div>
          )}
        </div>

        <button
          className="get-btn"
          id="getBtn"
          disabled={!purchaseState}
          onClick={handleRequestProxy}
        >
          {isRequestingProxy ? (
            <div className="ph-spinner ph-spinner-thick ph-spinner--light" />
          ) : (
            "⚡ Get Proxy"
          )}
        </button>
      </div>

      {orderConfirmationData && (
        <ProxyOrderConfirmationModal
          data={orderConfirmationData}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
