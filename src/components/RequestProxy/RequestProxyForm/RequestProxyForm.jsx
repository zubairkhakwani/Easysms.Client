//React
import { useEffect, useState, useContext, useRef } from "react";

//Context
import { AuthContext } from "../../../context/AuthContext";

//Toaster
import { successTaost, errorToast } from "../../../helper/Toaster";

//Helper
import { ProxyTypes } from "../../../data/Static";

//Services
import {
  getProxyMetaData,
  calculateProxyOrder,
  requestProxy,
} from "../../../services/Proxy/ProxyService.js";

//Modals
import { ProxyOrderConfirmationModal } from "../../Helper/Modals/Proxy/ProxyOrderConfirmationModal.jsx";

//Shared
import SearchableSelect from "../../Shared/SearchableSelect/SearchableSelect.jsx";
import QuantityStepper from "../../Shared/QuantityStepper/QuantityStepper.jsx";

//Css
import "./RequestProxyForm.css";
import "../../RequestNumber/RequestNumberForm/RequestNumberForm.css";

export default function RequestProxyForm({ onSummaryChange }) {
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
  const [selectedService, setSelectedService] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [selectedPurpose, setSelectedPurpose] = useState(null);

  //Loading
  const [isRequestingProxy, setIsRequestingProxy] = useState(false);
  const [isFetchingPrice, setIsFetchingPrice] = useState(false);
  const [isMetaDataLoading, setIsMetaDataLoading] = useState(false);

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
  const fetchProxyMetaData = async (proxyType) => {
    let metaData = [];

    setIsMetaDataLoading(true);
    setMetaData([]);

    try {
      metaData = await getProxyMetaData(proxyType);
    } catch {
      errorToast("Failed to fetch proxy metadata, please try later.");
    } finally {
      setMetaData(metaData);
      setIsMetaDataLoading(false);
    }
  };

  //Calculate the order price
  const abortControllerRef = useRef(null);

  const fetchOrderPrice = async () => {
    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setIsFetchingPrice(true);
    try {
      let response = await calculateProxyOrder(
        {
          service: selectedService,
          location: selectedLocation,
          period: selectedPeriod,
          purpose: selectedPurpose,
          staticIp: getValidStaticIp(),
          quantity: quantityState.current,
        },
        signal,
      );

      if (signal.aborted) return;

      if (response.isSuccess) {
        setPriceData(response.data);
      } else {
        errorToast(response.message);
      }
    } catch (err) {
      if (err.name === "CanceledError") return; // axios cancel
      errorToast("Failed to calculate proxy order.");
    } finally {
      if (!signal.aborted) setIsFetchingPrice(false);
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

  useEffect(() => {
    onSummaryChange?.({
      priceData,
      isFetchingPrice,
      quantity: quantityState.current,
    });
  }, [priceData, isFetchingPrice, quantityState.current, onSummaryChange]);

  //Handle Service Change
  const handleServiceChange = async (e) => {
    let value = e.target.value;
    setSelectedService(value);
    await fetchProxyMetaData(value);

    //Reset as the service change, so we want user to select again
    setSelectedLocation("");
    setSelectedPeriod("");
    setSelectedPurpose("");
    setPriceData(null);
  };

  //Handle Location Change
  const handleLocationChange = (e) => {
    let value = e.target.value;
    setSelectedLocation(value);
  };

  //Handle Period Change
  const handlePeriodChange = (e) => {
    let value = e.target.value;
    setSelectedPeriod(value);
  };

  //Handle Purpose Change
  const handlePurposeChange = (e) => {
    let value = e.target.value;
    setSelectedPurpose(value);
  };

  const handleQuantityChange = (next) => {
    setQuantityState((prev) => ({
      ...prev,
      current: next,
    }));
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
            <div className="card-title">Get Proxy</div>
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

            <SearchableSelect
              value={selectedService ?? ""}
              onChange={(val) => handleServiceChange({ target: { value: val } })}
              placeholder="Select Service"
              options={ProxyTypes.map((s) => ({
                value: s.label,
                label: s.displayName,
              }))}
            />
          </div>

          {/* Location */}
          <div className="field">
            <label>
              <i className="fa-solid fa-envelope number-type-icon"></i>
              Location
            </label>

            {isMetaDataLoading ? (
              <SearchableSelect isLoading placeholder="Select location" options={[]} />
            ) : (
              <SearchableSelect
                id="operator"
                className="operator-select"
                value={selectedLocation ?? ""}
                disabled={!selectedService}
                onChange={(val) => handleLocationChange({ target: { value: val } })}
                placeholder={
                  !selectedService ? "First select service" : "Select location"
                }
                options={(metaData.data?.countries ?? []).map((s) => ({
                  value: s.id,
                  label: s.name,
                }))}
              />
            )}
          </div>

          {/* Period */}
          <div className="field">
            <label>
              <i className="fa-solid fa-dollar-sign number-type-icon"></i>
              Period
            </label>
            <SearchableSelect
              id="period"
              className="operator-select"
              value={selectedPeriod ?? ""}
              onChange={(val) => handlePeriodChange({ target: { value: val } })}
              disabled={!selectedLocation}
              placeholder={
                !selectedLocation ? "First select location" : "Select Period"
              }
              options={(metaData.data?.periods ?? []).map((s) => ({
                value: s.id,
                label: s.name,
              }))}
            />
          </div>

          {/* Purpose */}
          <div className="field">
            <label>
              <i className="fa-solid fa-dollar-sign number-type-icon"></i>
              Purpose
            </label>
            <SearchableSelect
              id="purpose"
              className="operator-select"
              value={selectedPurpose ?? ""}
              onChange={(val) => handlePurposeChange({ target: { value: val } })}
              disabled={!selectedPeriod}
              placeholder={
                !selectedPeriod ? "First select period" : "Select purpose"
              }
              options={(metaData.data?.purposes ?? []).map((s) => ({
                value: s.id,
                label: s.name,
              }))}
            />
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
              <QuantityStepper
                value={quantityState.current}
                onChange={handleQuantityChange}
                min={quantityState.min}
              />
            </div>
          </div>
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
