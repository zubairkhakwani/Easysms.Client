//React
import { useEffect, useState, useContext } from "react";

//Context
import { AuthContext } from "../../../context/AuthContext";

//Toaster
import { successTaost, errorToast } from "../../../helper/Toaster";

//Services
import {
  getProviders,
  getPhysicalProviderInfo,
  getServices,
  getCountriesMetaData,
  requestNumber,
} from "../../../services/Provider/ProviderService";

//Components
import { PhysicalNumberContainer } from "../../Helper/PhysicalNumberContainer";
import { PhysicalNumberSkelton } from "../../Helper/PhysicalNumberSkelton";
import { PhysicalNumberOptions } from "../../Helper/PhysicalNumberOptions";

//Css
import "./RequestNumberForm.css";

function PhysicalNumberModal({ numbersText, onClose }) {
  const [copied, setCopied] = useState(false);

  const rows = numbersText
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [number, url] = line.split("|");
      return { number, url };
    });

  function handleCopy() {
    navigator.clipboard.writeText(numbersText).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="um-overlay" onClick={onClose}>
      <div className="um-modal" onClick={(e) => e.stopPropagation()}>
        <button className="um-close-btn" onClick={onClose}>
          ✕
        </button>
        <div className="um-modal-title">Requested Physical Numbers</div>

        <div className="pn-list">
          {rows.map(({ number, url }, i) => (
            <div key={i} className="pn-row">
              <span className="pn-number">{number}</span>
              <span className="pn-url">{url}</span>
            </div>
          ))}
        </div>

        <div className="um-modal-actions">
          <button className="um-btn ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="um-btn primary" onClick={handleCopy}>
            {copied ? "✓ Copied!" : "Copy to Clipboard"}
          </button>
        </div>
      </div>
    </div>
  );
}
export default function RequestNumber({ onNewNumber }) {
  const { balanceDebit } = useContext(AuthContext);

  const [providers, setProviders] = useState([]);
  const [services, setServices] = useState([]);
  const [countries, setCountries] = useState([]);
  const [countriesMetadata, setCountriesMetadata] = useState([]);
  const [operators_pricings, setOperators_Pricing] = useState([]);
  const [quantity, setQuantity] = useState(1);

  const [physicalNumberInfo, setPhysicalNumberInfo] = useState(null);
  const [isPhysicalNumberInfoLoading, setPhysicalNumberInfoLoading] =
    useState(false);

  const [requestedNumber, setRequestedNumber] = useState({});
  const [requestNumberText, setRequestNumberText] = useState("Get Number");

  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedOperator_Pricings, setOperator_Pricings] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [modal, setModal] = useState(null);
  const [isServiceLoading, setServiceLoading] = useState(false);
  const [isCountryLoadinig, setCountryLoading] = useState(false);
  const [isCountryMetadataLoadinig, setCountryMetadataLoading] =
    useState(false);

  const [numberType, setNumberType] = useState("virtual");
  const [pruchaseState, setPurchaseState] = useState(true);

  const fetchProviders = async () => {
    try {
      const data = await getProviders();
      setProviders(data);
    } catch (error) {
      console.error("Failed to fetch providers:", error);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  function resetServices() {
    setServices([]);
    setSelectedService(null);
  }

  function resetCountries() {
    setCountries([]);
    setSelectedCountry(null);
  }

  function resetOperators_pricing() {
    setOperators_Pricing([]);
    setOperator_Pricings(null);
    setPurchaseState(true);
  }

  const handleProviderChange = async (e) => {
    let providerId = e.target.value;

    setSelectedProvider(providerId);

    if (providerId == 3) {
      setPhysicalNumberInfoLoading(true);
      let response = await getPhysicalProviderInfo();
      setPhysicalNumberInfoLoading(false);

      setSelectedService("Facebook");
      setSelectedCountry("USA");
      setNumberType("virtual");

      setPhysicalNumberInfo(response);
      setPurchaseState(false);
      if (response.count <= 0) {
        setPurchaseState(true);
      }
      return;
    }

    setNumberType();
    setPhysicalNumberInfo(null);

    setServiceLoading(true);

    resetServices(); //When provider changes we default back to services

    resetCountries(); //When provider changes we default back to countries

    resetOperators_pricing(); //When provider changes we default back to operators_pricing

    let servicesResponse = await getServices(providerId);

    setServices(servicesResponse);

    setServiceLoading(false);
  };

  const handleServiceChange = async (e) => {
    let serviceId = e.target.value;

    setSelectedService(serviceId);

    setCountryLoading(true);

    resetOperators_pricing(); //When service change we default back to operators_pricings;

    let countriesMetaData = await getCountriesMetaData(
      selectedProvider,
      serviceId,
    );

    let countriesData = countriesMetaData.map((item) => ({
      id: item.countryId,
      name: item.name,
      total: item.total,
    }));

    setCountries(countriesData);

    setCountryLoading(false);

    setCountriesMetadata(countriesMetaData);
  };

  const handleCountryChange = async (e) => {
    let countryId = e.target.value;

    setCountryMetadataLoading(true);

    const countries = countriesMetadata.find(
      (item) => item.countryId === countryId,
    );

    setPurchaseState(true);
    setOperators_Pricing(countries.metaData);

    setCountryMetadataLoading(false);

    setSelectedCountry(countryId);
  };

  const handleOperators_PricingChange = async (e) => {
    let id = e.target.value;
    if (!id) return;

    var operator_pricing = operators_pricings.find((item) => item.id == id);
    setOperator_Pricings(id);
    setPurchaseState(false);
    setRequestedNumber({
      id,
      price: operator_pricing.price,
      operator: operator_pricing.operator,
    });
  };

  function copyPhysicalNumbers(numbers) {
    navigator.clipboard.writeText(numbers).catch(() => {});
  }

  const handleRequestNumber = async () => {
    if (selectedProvider == 3 && !numberType) {
      errorToast("Please select one of the number types");
      return;
    }

    setRequestNumberText(<div className="ph-spinner" />);

    const updatedRequestedNumber = {
      ...requestedNumber,
      quantity,
      isPhysicalLinks: numberType === "physical",
    };

    setPurchaseState(true);
    setRequestedNumber(updatedRequestedNumber);

    var response = await requestNumber(
      selectedProvider,
      selectedService,
      selectedCountry,
      updatedRequestedNumber,
    );

    let responseMessage = response.message;

    let responseData = response.data;
    if (response.isSuccess) {
      let activationCost = 0;
      let phoneNumber_Url = "";

      successTaost(responseMessage);

      responseData.forEach((data) => {
        if (numberType !== "physical") {
          //Add only numbers except virtual
          onNewNumber(data);
        }
        if (selectedProvider == 3 && numberType === "physical") {
          phoneNumber_Url += data.phoneNumber + "\n";
        }
        activationCost += data.activationCost;
      });

      //For physical numbers we display users the popup so the user can copy and use them links
      if (selectedProvider == 3 && numberType === "physical") {
        handlePhysicalNumberRequest(responseData.length, phoneNumber_Url, {
          numbersText: phoneNumber_Url.trim(),
        });
      }

      //Update the balance
      balanceDebit(activationCost);
    } else {
      errorToast(responseMessage);
    }

    setRequestNumberText("Get Number");
    setPurchaseState(false);
  };

  function handlePhysicalNumberRequest(count, phoneNumber_Url, numbersText) {
    setPhysicalNumberInfo((prev) => ({
      ...prev,
      count: Math.max(0, prev.count - count),
    }));

    copyPhysicalNumbers(phoneNumber_Url);
    setModal(numbersText);
  }

  const closeModal = () => setModal(null);

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-icon">
          <i className="fa-solid fa-sim-card number-type-icon"></i>
        </span>
        <div>
          <div className="card-title">Get Phone Number</div>
          <div className="card-sub">Configure your options below</div>
        </div>
      </div>
      <div className="fields">
        <div className="field">
          <>
            <label>
              <i className="fa-solid fa-building-columns number-type-icon"></i>
              SMS Provider
            </label>
            <select
              defaultValue=""
              onChange={handleProviderChange}
              disabled={providers.length === 0}
            >
              <option value="" disabled>
                Select provider
              </option>
              {providers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </>
        </div>
      </div>

      {isPhysicalNumberInfoLoading ? (
        <PhysicalNumberSkelton />
      ) : physicalNumberInfo ? (
        <>
          <PhysicalNumberOptions
            numberType={numberType}
            setNumberType={setNumberType}
          />
          <PhysicalNumberContainer
            availability={physicalNumberInfo.count}
            price={physicalNumberInfo.pricePerNumber}
            quantity={quantity}
            setQuantity={setQuantity}
            numberType={numberType}
          />
        </>
      ) : (
        <div className="fields">
          <div className="field">
            <label>
              <i className="fa-solid fa-gear number-type-icon"></i>
              Service
            </label>
            {isServiceLoading ? (
              <div className="select-skeleton"></div>
            ) : (
              <select
                onChange={handleServiceChange}
                disabled={selectedProvider == null}
              >
                <option value="">
                  {selectedProvider == null
                    ? "First select provider"
                    : "Select service"}
                </option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} {s.price ? `— From ${s.price}` : ""}{" "}
                    {s.qty ? `— Total ${s.qty} numbers` : ""}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="field">
            <label>
              <i className="fa-solid fa-globe number-type-icon"></i>
              Country
            </label>
            {isCountryLoadinig ? (
              <div className="select-skeleton"></div>
            ) : (
              <select
                id="country"
                onChange={handleCountryChange}
                disabled={selectedService == null}
              >
                <option value="">
                  {selectedService == null
                    ? "First select service"
                    : "Select country"}
                </option>
                {countries.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="field">
            <label>
              <i className="fa-solid fa-signal number-type-icon"></i>
              Operator / Pricing
            </label>
            {isCountryMetadataLoadinig ? (
              <div className="select-skeleton"></div>
            ) : (
              <select
                id="operator"
                className="operator-select"
                onChange={handleOperators_PricingChange}
                disabled={selectedCountry == null}
              >
                <option value="">
                  {selectedCountry == null
                    ? "First select country"
                    : "Select operator / pricing"}
                </option>
                {operators_pricings.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name && s.name.trim() !== "" ? `${s.name} - ` : ""}$
                    {Math.trunc((s.price ?? 0) * 10000) / 10000} ({s.count ?? 0}{" "}
                    available)
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      )}

      <button
        className="get-btn"
        id="getBtn"
        onClick={handleRequestNumber}
        disabled={pruchaseState}
      >
        {requestNumberText}
      </button>
      {modal && (
        <PhysicalNumberModal
          numbersText={modal.numbersText}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
