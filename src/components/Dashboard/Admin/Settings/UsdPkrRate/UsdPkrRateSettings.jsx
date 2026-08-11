import { useEffect, useMemo, useState } from "react";

import { getUsdPkrRate } from "../../../../../services/User/UserService";
import { configureUsdPkrRateSettings } from "../../../../../services/Provider/ProviderService";

import { errorToast, successTaost } from "../../../../../helper/Toaster";

import "./UsdPkrRateSettings.css";

const DEFAULT_RATE = 290;

function parseRate(value) {
  if (value === "" || value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export default function UsdPkrRateSettings() {
  const [savedRate, setSavedRate] = useState(DEFAULT_RATE);
  const [rateInput, setRateInput] = useState(String(DEFAULT_RATE));
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const parsedRate = parseRate(rateInput);
  const isValidRate = parsedRate !== null && parsedRate > 0;
  const hasChanges = isValidRate && parsedRate !== savedRate;

  const validationError = useMemo(() => {
    if (rateInput === "") return "Rate is required.";
    if (parsedRate === null) return "Enter a valid number.";
    if (parsedRate <= 0) return "Rate must be greater than 0.";
    return "";
  }, [rateInput, parsedRate]);

  async function loadSettings() {
    setIsLoading(true);
    try {
      const response = await getUsdPkrRate();
      if (response.isSuccess && response.data) {
        const rate = response.data.rate ?? DEFAULT_RATE;
        setSavedRate(rate);
        setRateInput(String(rate));

        if (response.data.source === "error") {
          errorToast(
            response.message ||
              "Could not load the USD/PKR rate. Showing default 290 PKR = 1 USD.",
          );
        }
      } else {
        errorToast(response.message || "Failed to load USD/PKR rate settings.");
        setSavedRate(DEFAULT_RATE);
        setRateInput(String(DEFAULT_RATE));
      }
    } catch {
      errorToast("Failed to load USD/PKR rate settings.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  async function handleSave() {
    if (!isValidRate || !hasChanges) return;

    setIsSaving(true);
    try {
      const response = await configureUsdPkrRateSettings({
        usdPkrRate: parsedRate,
      });

      if (response.isSuccess && response.data) {
        successTaost(response.message);
        const rate = response.data.rate ?? parsedRate;
        setSavedRate(rate);
        setRateInput(String(rate));
      } else {
        errorToast(response.message || "Failed to update USD/PKR rate.");
      }
    } catch {
      errorToast("Failed to update USD/PKR rate.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleResetToDefault() {
    setRateInput(String(DEFAULT_RATE));
  }

  return (
    <div className="upr-page">
      <div className="upr-panel">
        <div className="upr-panel-header">
          <div>
            <h2 className="upr-title">USD / PKR selling rate</h2>
            <p className="upr-sub">
              Set the exchange rate used by the admin top-up calculator.
            </p>
          </div>
        </div>

        <div className="upr-helper">
          <strong>What this affects</strong>
          <ul>
            <li>
              The <strong>PKR ↔ USD calculator</strong> on User Management → Top
              Up Balance
            </li>
            <li>
              Wallet balances stay in <strong>USD</strong> — this only helps
              admins convert amounts when topping up
            </li>
            <li>
              Default is <strong>290 PKR = 1 USD</strong> if no settings record
              exists yet
            </li>
            <li>Zero and negative values are not allowed</li>
          </ul>
        </div>

        {isLoading ? (
          <div className="upr-state-row">
            <div className="ph-spinner" />
            <span>Loading rate settings…</span>
          </div>
        ) : (
          <>
            <p className="upr-current">
              Current saved rate: <strong>{savedRate} PKR = 1 USD</strong>
            </p>

            <div className="upr-field">
              <label className="upr-label" htmlFor="usd-pkr-rate">
                1 USD = PKR (selling rate)
              </label>
              <input
                id="usd-pkr-rate"
                className="um-input upr-input"
                type="text"
                inputMode="decimal"
                placeholder={String(DEFAULT_RATE)}
                value={rateInput}
                onChange={(e) => setRateInput(e.target.value)}
              />
              {validationError && rateInput !== "" && (
                <div className="upr-error">{validationError}</div>
              )}
            </div>

            <div className="upr-actions">
              <button
                type="button"
                className="upr-save-btn"
                onClick={handleSave}
                disabled={isSaving || !hasChanges || !isValidRate}
              >
                {isSaving ? (
                  <div className="ph-spinner ph-spinner-thick ph-spinner--light" />
                ) : (
                  "Save rate"
                )}
              </button>
              <button
                type="button"
                className="upr-reset-btn"
                onClick={handleResetToDefault}
                disabled={isSaving || rateInput === String(DEFAULT_RATE)}
              >
                Reset to {DEFAULT_RATE}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
