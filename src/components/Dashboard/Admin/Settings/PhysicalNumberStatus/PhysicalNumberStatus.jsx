//React
import { useEffect, useMemo, useState } from "react";

//Services
import {
  getPhysicalNumberStatus,
  configurePhysicalNumberStatus,
} from "../../../../../services/Provider/ProviderService";

//Helper
import { errorToast, successTaost } from "../../../../../helper/Toaster";

//Css
import "./PhysicalNumberStatus.css";

const COUNTRY_FLAGS = {
  USA: "🇺🇸",
  CAN: "🇨🇦",
  GBR: "🇬🇧",
};

function Toggle({ checked, onChange, size }) {
  return (
    <button
      type="button"
      className={`pns-toggle ${checked ? "pns-toggle--on" : ""} ${
        size === "lg" ? "pns-toggle--lg" : ""
      }`}
      onClick={onChange}
      aria-pressed={checked}
    >
      <span className="pns-toggle-knob" />
    </button>
  );
}

export default function PhysicalNumberStatus() {
  const [premiumLinksActive, setPremiumLinksActive] = useState(false);
  const [countries, setCountries] = useState([]);
  const [initialSnapshot, setInitialSnapshot] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  function snapshotOf(premium, list) {
    return JSON.stringify({
      premium,
      countries: list.map((c) => [c.countryId, c.physicalLinksActive]),
    });
  }

  function applyStatus(data) {
    const premium = data?.premiumNumberLinksActive ?? false;
    const list = data?.countries ?? [];
    setPremiumLinksActive(premium);
    setCountries(list);
    setInitialSnapshot(snapshotOf(premium, list));
  }

  async function loadStatus() {
    setIsLoading(true);
    try {
      const response = await getPhysicalNumberStatus();
      if (response.isSuccess) {
        applyStatus(response.data);
      } else {
        errorToast(response.message);
      }
    } catch {
      errorToast("Failed to load physical number status.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadStatus();
  }, []);

  function toggleCountry(countryId) {
    setCountries((prev) =>
      prev.map((c) =>
        c.countryId === countryId
          ? { ...c, physicalLinksActive: !c.physicalLinksActive }
          : c,
      ),
    );
  }

  const hasChanges = useMemo(
    () => snapshotOf(premiumLinksActive, countries) !== initialSnapshot,
    [premiumLinksActive, countries, initialSnapshot],
  );

  const activeCount = useMemo(
    () => countries.filter((c) => c.physicalLinksActive).length,
    [countries],
  );

  async function handleSave() {
    setIsSaving(true);
    try {
      const request = {
        premiumNumberLinksActive: premiumLinksActive,
        countries: countries.map((c) => ({
          countryId: c.countryId,
          physicalLinksActive: c.physicalLinksActive,
        })),
      };

      const response = await configurePhysicalNumberStatus(request);
      if (response.isSuccess) {
        successTaost(response.message);
        applyStatus(response.data);
      } else {
        errorToast(response.message);
      }
    } catch {
      errorToast("Failed to update physical number status.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="pns-page">
      <div className="pns-panel">
        <div className="pns-panel-header">
          <div>
            <h2 className="pns-title">Physical Number Status</h2>
            <p className="pns-sub">
              Control availability of premium numbers with links
              (non-refundable). Turning a country off hides its link option;
              pausing the master switch shows it disabled everywhere.
            </p>
          </div>
          <button
            className={`pns-save-btn ${hasChanges ? "pns-save-btn--dirty" : ""}`}
            onClick={handleSave}
            disabled={isLoading || isSaving || !hasChanges}
          >
            {isSaving ? (
              <div className="ph-spinner ph-spinner-thick ph-spinner--light" />
            ) : hasChanges ? (
              "Save changes"
            ) : (
              "Saved"
            )}
          </button>
        </div>

        {isLoading ? (
          <div className="pns-state-row">
            <div className="ph-spinner" />
            <span className="pns-state-text">Fetching status…</span>
          </div>
        ) : (
          <>
            <div
              className={`pns-hero ${
                premiumLinksActive ? "pns-hero--on" : "pns-hero--off"
              }`}
            >
              <div className="pns-hero-icon">
                <i
                  className={`fa-solid ${
                    premiumLinksActive ? "fa-bolt" : "fa-pause"
                  }`}
                />
              </div>
              <div className="pns-hero-info">
                <div className="pns-hero-titles">
                  <span className="pns-hero-title">Premium Number Links</span>
                  <span
                    className={`pns-hero-status ${
                      premiumLinksActive
                        ? "pns-hero-status--on"
                        : "pns-hero-status--off"
                    }`}
                  >
                    {premiumLinksActive ? "Active" : "Paused"}
                  </span>
                </div>
                <span className="pns-hero-desc">
                  {premiumLinksActive
                    ? "Users can purchase premium numbers with links."
                    : "The “Number with link” option is shown but disabled everywhere."}
                </span>
              </div>
              <Toggle
                size="lg"
                checked={premiumLinksActive}
                onChange={() => setPremiumLinksActive((v) => !v)}
              />
            </div>

            <div className="pns-countries-head">
              <span className="pns-section-label">Countries</span>
              <span className="pns-summary-chip">
                {activeCount} of {countries.length} active
              </span>
            </div>

            {countries.length === 0 ? (
              <div className="pns-state-row">
                <span className="pns-state-text">No countries found.</span>
              </div>
            ) : (
              <div className="pns-country-grid">
                {countries.map((c) => (
                  <div
                    className={`pns-country-card ${
                      c.physicalLinksActive
                        ? "pns-country-card--on"
                        : "pns-country-card--off"
                    }`}
                    key={c.countryId}
                  >
                    <div className="pns-country-top">
                      <span className="pns-country-flag">
                        {COUNTRY_FLAGS[c.countryId] ?? "🏳️"}
                      </span>
                      <span
                        className={`pns-country-pill ${
                          c.physicalLinksActive
                            ? "pns-country-pill--on"
                            : "pns-country-pill--off"
                        }`}
                      >
                        {c.physicalLinksActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <span className="pns-country-name">{c.countryName}</span>
                    <div className="pns-country-foot">
                      <span className="pns-country-desc">
                        {c.physicalLinksActive
                          ? "Link option visible."
                          : "Link option hidden."}
                      </span>
                      <Toggle
                        checked={c.physicalLinksActive}
                        onChange={() => toggleCountry(c.countryId)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
