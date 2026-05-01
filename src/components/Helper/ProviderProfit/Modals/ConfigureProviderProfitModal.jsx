//React
import { useState } from "react";

//Helper
import { modalKeys } from "../../../../data/Static";
import { FormatterHelper } from "../../../../helper/FormatterHelper";

//Css
import "./ConfigureProviderProfitModal.css";

export function ConfigureProviderProfitModal({
  isSubmitting,
  onClose,
  onConfirm,
}) {
  const [heroSms, setHeroSms] = useState("");
  const [fiveSim, setFiveSim] = useState("");
  const [physicalNumbers, setPhysicalNumbers] = useState("");
  const isValid =
    Number(heroSms) >= 0 &&
    Number(fiveSim) >= 0 &&
    Number(physicalNumbers) >= 0;

  const handleSubmit = () => {
    onConfirm({
      heroSms: Number(heroSms),
      fiveSim: Number(fiveSim),
      physicalNumbers: Number(physicalNumbers),
    });
  };

  return (
    <div
      className="cpp-overlay"
      onClick={() => onClose(modalKeys.providerProfit)}
    >
      <div className="cpp-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="cpp-close-btn"
          onClick={() => onClose(modalKeys.providerProfit)}
        >
          ✕
        </button>

        <div className="cpp-modal-title">Configure Provider Profit</div>

        <div className="cpp-modal-sub">
          Set profit percentage and fixed pricing for providers
        </div>

        {/* HeroSms */}

        <label className="cpp-label">HeroSms Profit (%)</label>

        <input
          className="cpp-input"
          type="number"
          min="0"
          placeholder="Enter percentage"
          value={heroSms}
          onChange={(e) => setHeroSms(e.target.value)}
        />

        {/* FiveSim */}

        <label className="cpp-label">FiveSim Profit (%)</label>

        <input
          className="cpp-input"
          type="number"
          min="0"
          placeholder="Enter percentage"
          value={fiveSim}
          onChange={(e) => setFiveSim(e.target.value)}
        />

        {/* Physical Numbers */}

        <label className="cpp-label">Physical Numbers Price ($)</label>

        <input
          className="cpp-input"
          type="number"
          min="0"
          placeholder="Enter fixed price"
          value={physicalNumbers}
          onChange={(e) => setPhysicalNumbers(e.target.value)}
        />

        {/* Preview */}

        {(heroSms || fiveSim || physicalNumbers) && (
          <div className="cpp-preview-box">
            <div>
              HeroSms: <span>{heroSms || 0}%</span>
            </div>

            <div>
              FiveSim: <span>{fiveSim || 0}%</span>
            </div>

            <div>
              Physical Numbers:{" "}
              <span>
                {FormatterHelper.formatCurrency(physicalNumbers) || 0}
              </span>
            </div>
          </div>
        )}

        <div className="cpp-modal-actions">
          <button
            className="cpp-btn ghost"
            onClick={() => onClose(modalKeys.providerProfit)}
          >
            Cancel
          </button>

          <button
            className="cpp-btn primary"
            disabled={isSubmitting || !isValid}
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <div className="cpp-spinner" />
            ) : (
              <span>Save Profit</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
