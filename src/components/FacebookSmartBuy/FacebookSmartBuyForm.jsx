import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import SearchableSelect from "../Shared/SearchableSelect/SearchableSelect";
import {
  getFacebookSmartBuyCountries,
  getFacebookSmartBuyRecommendations,
  purchaseFacebookSmartBuyOption,
} from "../../services/SmartBuy/FacebookSmartBuyService";
import { errorToast, successTaost } from "../../helper/Toaster";
import "./FacebookSmartBuyForm.css";
import "../RequestNumber/RequestNumberForm/RequestNumberForm.css";

export default function FacebookSmartBuyForm({ onNewNumber }) {
  const { balanceDebit } = useContext(AuthContext);

  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [options, setOptions] = useState([]);
  const [selectedOptionId, setSelectedOptionId] = useState("");

  const [countriesLoading, setCountriesLoading] = useState(true);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    const loadCountries = async () => {
      setCountriesLoading(true);
      try {
        const response = await getFacebookSmartBuyCountries();
        if (response.isSuccess) {
          setCountries(response.data ?? []);
        } else {
          errorToast(response.message || "Failed to load countries.");
        }
      } catch {
        errorToast("Failed to load countries. Please try again.");
      } finally {
        setCountriesLoading(false);
      }
    };

    loadCountries();
  }, []);

  const loadRecommendations = async (countryKey) => {
    if (!countryKey) {
      setOptions([]);
      setSelectedOptionId("");
      return;
    }

    setOptionsLoading(true);
    setOptions([]);
    setSelectedOptionId("");

    try {
      const response = await getFacebookSmartBuyRecommendations(countryKey);
      if (response.isSuccess) {
        const list = response.data ?? [];
        setOptions(list);
        if (list.length > 0) {
          setSelectedOptionId(list[0].optionId);
        }
      } else {
        errorToast(response.message || "No options available.");
      }
    } catch {
      errorToast("Failed to load recommendations. Please try again.");
    } finally {
      setOptionsLoading(false);
    }
  };

  const handleCountryChange = (countryKey) => {
    setSelectedCountry(countryKey);
    loadRecommendations(countryKey);
  };

  const handlePurchase = async () => {
    if (!selectedOptionId) {
      errorToast("Please select an option.");
      return;
    }

    setPurchasing(true);
    try {
      const response = await purchaseFacebookSmartBuyOption(selectedOptionId);
      if (response.isSuccess) {
        successTaost(response.message || "Number purchased successfully.");
        let activationCost = 0;
        (response.data ?? []).forEach((data) => {
          onNewNumber?.(data);
          activationCost += data.activationCost ?? 0;
        });
        if (activationCost > 0) {
          balanceDebit(activationCost);
        }
      } else {
        errorToast(response.message || "Purchase failed.");
        // Quietly refresh options (e.g. sold out) without clearing the list first.
        if (selectedCountry) {
          try {
            const refresh = await getFacebookSmartBuyRecommendations(selectedCountry);
            if (refresh.isSuccess && refresh.data?.length) {
              setOptions(refresh.data);
              setSelectedOptionId(refresh.data[0].optionId);
            }
          } catch {
            // Keep existing options if refresh fails.
          }
        }
      }
    } catch {
      errorToast("Failed to purchase number. Please try again.");
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <div className="card request-number-container facebook-smart-buy-form">
      <div className="card-header">
        <div className="card-icon">
          <i className="fa-brands fa-facebook" style={{ color: "#1877F2" }} />
        </div>
        <div>
          <div className="card-title">Get a Facebook number</div>
          <div className="card-sub">
            Select a country to see prices. Options are sorted by how often
            verification codes arrive.
          </div>
        </div>
      </div>

      <div className="fields">
        <div className="field">
          <label>
            <i className="fa-solid fa-globe number-type-icon" />
            Country
          </label>
          {countriesLoading ? (
            <SearchableSelect isLoading placeholder="Select country" options={[]} />
          ) : (
            <SearchableSelect
              value={selectedCountry}
              onChange={handleCountryChange}
              placeholder="Select country"
              options={countries.map((c) => ({
                value: c.countryKey,
                label: c.countryName,
              }))}
            />
          )}
        </div>
      </div>

      {!selectedCountry && !countriesLoading && (
        <p className="facebook-select-hint">
          Select a country to see available numbers and prices.
        </p>
      )}

      {selectedCountry && (
        <div className="facebook-options">
          <div className="facebook-options-title">Choose a price</div>
          {optionsLoading ? (
            <div className="facebook-options-loading">
              <div className="ph-spinner ph-spinner--sm facebook-options-spinner" />
              <span>Finding the best options for you…</span>
            </div>
          ) : options.length === 0 ? (
            <div className="facebook-options-empty">
              No numbers available for this country right now. Try again later
              or pick another country.
            </div>
          ) : (
            <div className="facebook-option-list">
              {options.map((opt) => {
                const selected = opt.optionId === selectedOptionId;
                return (
                  <button
                    key={opt.optionId}
                    type="button"
                    className={`facebook-option-card${selected ? " selected" : ""}`}
                    onClick={() => setSelectedOptionId(opt.optionId)}
                  >
                    <div className="facebook-option-top">
                      <span className="facebook-option-price">
                        ${Number(opt.userPrice).toFixed(2)}
                      </span>
                      {opt.badge && (
                        <span className="facebook-option-badge">{opt.badge}</span>
                      )}
                    </div>
                    <div className="facebook-option-meta">
                      <span className="facebook-option-label">
                        Code delivery: {opt.successLabel}
                      </span>
                      {opt.successRate != null && (
                        <span className="facebook-option-rate">
                          ~{opt.successRate}%
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        className="get-btn facebook-buy-btn"
        disabled={!selectedOptionId || purchasing || optionsLoading}
        onClick={handlePurchase}
      >
        {purchasing ? "Getting number…" : "Get number"}
      </button>
    </div>
  );
}
