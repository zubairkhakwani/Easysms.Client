import { useEffect, useState } from "react";
import { toast, Slide } from "react-toastify";
import {
  getProviders,
  getServices,
  getCountriesMetaData,
  requestNumber,
} from "../../../services/Provider/ProviderService";
import "./RequestNumberForm.css";

export default function RequestNumber({ onNewNumber }) {
  const [providers, setProviders] = useState([]);
  const [services, setServices] = useState([]);
  const [countriesMetadata, setCountriesMetadata] = useState([]);
  const [countries, setCountries] = useState([]);
  const [operators_pricings, setOperators_Pricing] = useState([]);
  const [requestedNumber, setRequestedNumber] = useState({});
  const [requestNumberText, setRequestNumberText] = useState("⚡ Get Number");

  const [selectedProvider, setSelectedProvider] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  const [canPurchaseNumber, setPurchaseState] = useState(true);

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

  const handleProviderChange = async (e) => {
    let providerId = e.target.value;

    setSelectedProvider(providerId);

    let servicesResponse = await getServices(providerId);
    console.log(servicesResponse);
    setServices(servicesResponse);
  };

  const handleServiceChange = async (e) => {
    let serviceId = e.target.value;

    setSelectedService(serviceId);

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
  };

  const handleCountryChange = async (e) => {
    let countryId = e.target.value;

    const selectedCountry = countriesMetadata.find(
      (item) => item.countryId === Number(countryId),
    );

    setOperators_Pricing(selectedCountry.metaData);
    setSelectedCountry(countryId);
  };

  const handleOperators_PricingChange = async (e) => {
    let id = e.target.value;
    if (!id) return;

    var operator_pricing = operators_pricings.find((item) => item.id == id);

    setRequestedNumber({
      id,
      price: operator_pricing.price,
    });

    setPurchaseState(false);
  };

  const handleRequestNumber = async () => {
    setRequestNumberText("Getting Number..");
    setPurchaseState(true);

    var response = await requestNumber(
      selectedProvider,
      selectedService,
      selectedCountry,
      requestedNumber,
    );

    var responseMessage = response.message;
    if (response.isSuccess) {
      toast(responseMessage, {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Slide,
      });
      onNewNumber(response.data);
    } else {
      toast.warn(responseMessage, {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Slide,
      });
    }

    setPurchaseState(false);
    setRequestNumberText("⚡ Get Number");
  };

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-icon">📱</span>
        <div>
          <div className="card-title">Get Phone Number</div>
          <div className="card-sub">Configure your options below</div>
        </div>
      </div>

      <div className="fields">
        <div className="field">
          <label>🏢 SMS Provider</label>
          <select onChange={handleProviderChange}>
            <option value="">Select provider...</option>
            {providers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>📲 Service</label>
          <select onChange={handleServiceChange}>
            <option value="">Select service...</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>🌍 Country</label>
          <select id="country" onChange={handleCountryChange}>
            <option value="">Select country...</option>
            {countries.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>📡 Operator / Pricing</label>
          <select
            id="operator"
            className="operator-select"
            onChange={handleOperators_PricingChange}
          >
            <option value="">Select operator / pricing</option>
            {operators_pricings && operators_pricings.length > 0 ? (
              operators_pricings.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name && s.name.trim() !== "" ? `${s.name} - ` : ""}$
                  {(s.price ?? 0).toFixed(3)} ({s.count ?? 0} available)
                </option>
              ))
            ) : (
              <option value="" disabled>
                Operators / Pricing not found
              </option>
            )}
          </select>
        </div>
      </div>

      <div
        className="price-preview"
        id="pricePreview"
        style={{ display: "none" }}
      >
        <span className="price-label">Estimated Cost</span>
        <span className="price-value" id="priceVal">
          $0.00
        </span>
      </div>

      <button
        className="get-btn"
        id="getBtn"
        onClick={handleRequestNumber}
        disabled={canPurchaseNumber}
      >
        {requestNumberText}
      </button>
    </div>
  );
}
