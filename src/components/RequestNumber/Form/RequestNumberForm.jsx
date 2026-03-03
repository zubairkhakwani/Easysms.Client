import { useEffect, useState } from "react";
import {
  getProviders,
  getServices,
  getCountries,
  getOperators_Pricings,
} from "../../../services/Provider/ProviderService";

import "./RequestNumberForm.css";

export default function RequestNumber() {
  const [providers, setProviders] = useState([]);
  const [services, setServices] = useState([]);
  const [countries, setCountries] = useState([]);
  const [operators_pricings, setOperators_Pricing] = useState([]);

  const [selectedProvider, setSelectedProvider] = useState("");
  const [selectedService, setSelectedService] = useState("");

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

    let services = await getServices(providerId);
    setServices(services);

    let countries = await getCountries(providerId);
    setCountries(countries);
  };

  const handleServiceChange = (e) => {
    let serviceId = e.target.value;

    setSelectedService(serviceId);
  };

  const handleCountryChange = async (e) => {
    let countryId = e.target.value;

    let operators_pricings = await getOperators_Pricings(
      selectedProvider,
      selectedService,
      countryId,
    );

    console.log("Operators_Pricings:", operators_pricings);
    setOperators_Pricing(operators_pricings);
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
          <select id="operator" className="operator-select">
            <option value="">Select operator / pricing</option>
            {operators_pricings.map((s) => (
              <option value={s.id}>
                {s.name && s.name.trim() !== "" ? `${s.name} - ` : ""}$
                {s.cost.toFixed(3)} ({s.count} available)
              </option>
            ))}
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

      <button className="get-btn" id="getBtn" disabled>
        ⚡ Get Number
      </button>

      <div id="resultBox" style={{ display: "none" }} className="result-box">
        <div className="result-eyebrow">Your number is ready</div>
        <div className="result-number" id="resultNum"></div>
        <div className="result-meta" id="resultMeta"></div>
        <button className="copy-btn">📋 Copy Number</button>
      </div>
    </div>
  );
}
