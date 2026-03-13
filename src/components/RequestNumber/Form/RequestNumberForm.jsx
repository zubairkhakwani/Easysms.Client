import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { toast, Slide } from "react-toastify";
import {
  getProviders,
  getServices,
  getCountriesMetaData,
  requestNumber,
} from "../../../services/Provider/ProviderService";
import "./RequestNumberForm.css";

export default function RequestNumber({ onNewNumber }) {
  const { balanceDebit } = useContext(AuthContext);

  const [providers, setProviders] = useState([]);
  const [services, setServices] = useState([]);
  const [countries, setCountries] = useState([]);
  const [countriesMetadata, setCountriesMetadata] = useState([]);
  const [operators_pricings, setOperators_Pricing] = useState([]);

  const [requestedNumber, setRequestedNumber] = useState({});
  const [requestNumberText, setRequestNumberText] = useState("⚡ Get Number");

  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedOperator_Pricings, setOperator_Pricings] = useState(null);

  const [isServiceLoading, setServiceLoading] = useState(false);
  const [isCountryLoadinig, setCountryLoading] = useState(false);
  const [isCountryMetadataLoadinig, setCountryMetadataLoading] =
    useState(false);

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
    var responseData = response.data;
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
      onNewNumber(responseData);
      balanceDebit(responseData.activationCost);
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

    setRequestNumberText("⚡ Get Number");
    setPurchaseState(false);
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
          <>
            <label>🏢 SMS Provider</label>
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
        <div className="field">
          <label>📲 Service</label>
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
          <label>🌍 Country</label>
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
          <label>📡 Operator / Pricing</label>
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

      <button
        className="get-btn"
        id="getBtn"
        onClick={handleRequestNumber}
        disabled={pruchaseState}
      >
        {requestNumberText}
      </button>
    </div>
  );
}
