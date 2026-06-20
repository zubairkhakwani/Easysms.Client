//React
import { useEffect, useState, useContext } from "react";

//Context
import { AuthContext } from "../../../context/AuthContext.jsx";

//Toaster
import { successTaost, errorToast } from "../../../helper/Toaster.js";

//Services
import {
  getProviders,
  getPhysicalProviderInfo,
  getServices,
  getCountriesMetaData,
  requestNumber,
} from "../../../services/Provider/ProviderService.js";

//Components
import { PhysicalNumberContainer } from "../../Helper/PhysicalNumberContainer.jsx";
import { PhysicalNumberOptions } from "../../Helper/PhysicalNumberOptions.jsx";

//Skeltons
import { PhysicalNumberSkelton } from "../../Skeltons/PhysicalNumberSkelton.jsx";

//Shared
import SearchableSelect from "../../Shared/SearchableSelect/SearchableSelect.jsx";

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
export default function RequestNumberForm({ onNewNumber }) {
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
  const [isRequestingNumber, setIsRequestingNumber] = useState(false);

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
    let data = [];
    try {
      data = await getProviders();
    } catch {
      errorToast("Failed to fetch providers,please try later.");
    } finally {
      setProviders(data);
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

    try {
      let response = await getServices(providerId);
      if (response.isSuccess) {
        setServices(response.data);
      } else {
        errorToast(response.message);
      }
    } catch {
      errorToast("Failed to fetch services, please try later.");
    } finally {
      setServiceLoading(false);
    }
  };

  const handleServiceChange = async (e) => {
    let serviceId = e.target.value;

    setSelectedService(serviceId);

    setCountryLoading(true);

    resetOperators_pricing(); //When service change we default back to operators_pricings;

    try {
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
      setCountriesMetadata(countriesMetaData);
    } catch {
      errorToast("Failed to load countries metadata, please try later.");
    } finally {
      setCountryLoading(false);
    }
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

    setIsRequestingNumber(true);

    const updatedRequestedNumber = {
      ...requestedNumber,
      quantity,
      isPhysicalLinks: numberType === "physical",
    };

    setPurchaseState(true);
    setRequestedNumber(updatedRequestedNumber);
    try {
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
    } catch {
      errorToast("Failed to request number, please try later.");
    } finally {
      setIsRequestingNumber(false);
      setPurchaseState(false);
    }
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
            <SearchableSelect
              value={selectedProvider ?? ""}
              onChange={(val) => handleProviderChange({ target: { value: val } })}
              disabled={providers.length === 0}
              placeholder="Select provider"
              options={providers.map((p) => ({
                value: p.id,
                label: p.name,
              }))}
            />
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
              <SearchableSelect isLoading placeholder="Select service" options={[]} />
            ) : (
              <SearchableSelect
                value={selectedService ?? ""}
                onChange={(val) => handleServiceChange({ target: { value: val } })}
                disabled={selectedProvider == null}
                placeholder={
                  selectedProvider == null
                    ? "First select provider"
                    : "Select service"
                }
                options={services.map((s) => ({
                  value: s.id,
                  label: s.name,
                  sublabel: [
                    s.price ? `From ${s.price}` : null,
                    s.qty ? `${s.qty} available` : null,
                  ]
                    .filter(Boolean)
                    .join(" · "),
                }))}
              />
            )}
          </div>
          <div className="field">
            <label>
              <i className="fa-solid fa-globe number-type-icon"></i>
              Country
            </label>
            {isCountryLoadinig ? (
              <SearchableSelect isLoading placeholder="Select country" options={[]} />
            ) : (
              <SearchableSelect
                id="country"
                value={selectedCountry ?? ""}
                onChange={(val) => handleCountryChange({ target: { value: val } })}
                disabled={selectedService == null}
                placeholder={
                  selectedService == null
                    ? "First select service"
                    : "Select country"
                }
                options={countries.map((s) => ({
                  value: s.id,
                  label: s.name,
                }))}
              />
            )}
          </div>
          <div className="field">
            <label>
              <i className="fa-solid fa-signal number-type-icon"></i>
              Operator / Pricing
            </label>
            {isCountryMetadataLoadinig ? (
              <SearchableSelect
                isLoading
                placeholder="Select operator / pricing"
                options={[]}
              />
            ) : (
              <SearchableSelect
                id="operator"
                className="operator-select"
                value={selectedOperator_Pricings ?? ""}
                onChange={(val) =>
                  handleOperators_PricingChange({ target: { value: val } })
                }
                disabled={selectedCountry == null}
                placeholder={
                  selectedCountry == null
                    ? "First select country"
                    : "Select operator / pricing"
                }
                options={operators_pricings.map((s) => {
                  const price = `$${Math.trunc((s.price ?? 0) * 10000) / 10000}`;
                  const count = s.count ?? 0;
                  const name = s.name?.trim();
                  return {
                    value: s.id,
                    label: name ? name : `${price} (${count} available)`,
                    ...(name ? { sublabel: `${price} · ${count} available` } : {}),
                  };
                })}
              />
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
        {isRequestingNumber ? (
          <div className="ph-spinner ph-spinner-thick ph-spinner--light" />
        ) : (
          "⚡ Get Number"
        )}
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
