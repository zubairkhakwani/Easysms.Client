//React
import { useState, useEffect } from "react";

//Services
import { calculateRenewProxyOrder } from "../../../../services/Proxy/ProxyService";

//Toaster
import { errorToast } from "../../../../helper/Toaster";

//Css
import "./ProxyExtendModal.css";
import SearchableSelect from "../../../Shared/SearchableSelect/SearchableSelect";

export function ProxyExtendModal({
  onClose,
  onConfirm,
  isSubmitting,
  isLoadingPeriods,
  metaData,
  ids,
}) {
  const [periodId, setPeriodId] = useState("");
  const [price, setPrice] = useState(null);
  const [isFetchingPrice, setIsFetchingPrice] = useState(false);
  const [errors, setErrors] = useState({});

  const periods = metaData?.data?.periods ?? [];

  // Fetch price whenever periodId changes
  useEffect(() => {
    if (!periodId) {
      setPrice(null);
      return;
    }

    async function fetchPrice() {
      setIsFetchingPrice(true);
      setPrice(null);
      try {
        const response = await calculateRenewProxyOrder({
          ids,
          periodId,
        });

        if (response.isSuccess) {
          setPrice(response.data.totalCost);
        } else {
          errorToast(response.message);
        }
      } catch {
        setPrice(null);
      } finally {
        setIsFetchingPrice(false);
      }
    }

    fetchPrice();
  }, [periodId]);

  function validate() {
    const e = {};
    if (!periodId) e.period = "Please select a period.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleConfirm() {
    if (!validate()) return;
    onConfirm?.({ periodId });
  }

  return (
    <div className="pem-overlay">
      <div className="pem-modal" onClick={(e) => e.stopPropagation()}>
        {/* ── close ── */}
        <button className="pem-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        {/* ── header ── */}
        <div className="pem-header">
          <div className="pem-icon-wrap">⏳</div>
          <div className="pem-title">Extend Proxy</div>
          <div className="pem-sub">
            Select how long you want to extend your proxy for.
          </div>
        </div>

        {/* ── form ── */}
        <div className="pem-form">
          {/* ── Period ── */}
          <div className="pem-field">
            <label className="pem-label">
              Period <span className="required">*</span>
            </label>
            <div
              className={`pem-select-wrap ${errors.period ? "pem-input-error" : ""}`}
            >
              {isLoadingPeriods ? (
                <SearchableSelect
                  isLoading
                  className="pem-select"
                  placeholder="Select a period..."
                  options={[]}
                />
              ) : (
                <SearchableSelect
                  className="pem-select"
                  value={periodId}
                  onChange={(val) => {
                    setPeriodId(val);
                    setErrors((prev) => ({ ...prev, period: undefined }));
                  }}
                  placeholder="Select a period..."
                  options={periods.map((p) => ({ value: p.id, label: p.name }))}
                />
              )}
            </div>
            {errors.period && (
              <span className="pem-field-error">{errors.period}</span>
            )}
          </div>

          {/* ── Price ── */}
          {periodId && (
            <div className="pem-price-box">
              <span className="pem-price-label">Total Price</span>
              {isFetchingPrice ? (
                <div className="pem-price-loading">
                  <div className="pem-price-spinner" />
                  <span>Calculating...</span>
                </div>
              ) : price !== null ? (
                <span className="pem-price-value">${price}</span>
              ) : (
                <span className="pem-price-error">Unable to fetch price</span>
              )}
            </div>
          )}
        </div>

        {/* ── actions ── */}
        <div className="pem-actions">
          <button className="pac-btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="pac-btn-primary"
            onClick={handleConfirm}
            disabled={isFetchingPrice || (periodId && price === null)}
          >
            {isSubmitting ? (
              <div className="ph-spinner ph-spinner-thick ph-spinner--light" />
            ) : (
              "Extend Proxy →"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
