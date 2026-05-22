//React
import { useState } from "react";

//Helper
import { modalKeys } from "../../../../data/Static";
import { FormatterHelper } from "../../../../helper/FormatterHelper";

//Css
import "./ConfigureProviderProfitModal.css";

export function ConfigureProviderProfitModal({
  providersProfit,
  isSubmitting,
  onClose,
  onConfirm,
}) {
  const [profits, setProfits] = useState({
    heroSmsTempNumbers: providersProfit[0]?.heroSms_TempNumbers ?? "",
    heroSmsMails: providersProfit[0]?.heroSms_Mails ?? "",
    fiveSim: providersProfit[0]?.fiveSim ?? "",
    physicalNumbers: providersProfit[0]?.physicalNumbers ?? "",
    proxySellerProfit: providersProfit[0]?.proxySeller_Profit ?? "",
  });

  const isValid =
    Number(profits.heroSmsTempNumbers) > 0 &&
    Number(profits.heroSmsMails) > 0 &&
    Number(profits.fiveSim) > 0 &&
    Number(profits.physicalNumbers) > 0 &&
    Number(profits.proxySellerProfit) > 0;

  const handleSubmit = () => {
    onConfirm({
      heroSmsTempNumbers: Number(profits.heroSmsTempNumbers),
      heroSmsMails: Number(profits.heroSmsMails),
      fiveSim: Number(profits.fiveSim),
      physicalNumbers: Number(profits.physicalNumbers),
      proxySellerProfit: Number(profits.proxySellerProfit),
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

        {/* HeroSms  Temp Number Profit */}

        <label className="cpp-label">HeroSms Temp Number Profit (%)</label>
        <input
          className="cpp-input"
          type="number"
          min="0"
          placeholder="Enter percentage"
          value={profits.heroSmsTempNumbers}
          onChange={(e) =>
            setProfits((prev) => ({
              ...prev,
              heroSmsTempNumbers: e.target.value,
            }))
          }
        />

        {/* HeroSms  Mail Profit */}

        <label className="cpp-label">HeroSms Mails Profit (%)</label>
        <input
          className="cpp-input"
          type="number"
          min="0"
          placeholder="Enter percentage"
          value={profits.heroSmsMails}
          onChange={(e) =>
            setProfits((prev) => ({
              ...prev,
              heroSmsMails: e.target.value,
            }))
          }
        />

        {/* Physical Numbers */}

        <label className="cpp-label">Physical Numbers Price ($)</label>

        <input
          className="cpp-input"
          type="number"
          min="0"
          placeholder="Enter fixed price"
          value={profits.physicalNumbers}
          onChange={(e) =>
            setProfits((prev) => ({
              ...prev,
              physicalNumbers: e.target.value,
            }))
          }
        />

        {/* Proxy Seller */}
        <label className="cpp-label">Proxy Seller Profit (%)</label>

        <input
          className="cpp-input"
          type="number"
          min="0"
          placeholder="Enter percentage"
          value={profits.proxySellerProfit}
          onChange={(e) =>
            setProfits((prev) => ({
              ...prev,
              proxySellerProfit: e.target.value,
            }))
          }
        />

        {/* FiveSim */}

        <label className="cpp-label">FiveSim Profit (%)</label>

        <input
          className="cpp-input"
          type="number"
          min="0"
          placeholder="Enter percentage"
          value={profits.fiveSim}
          onChange={(e) =>
            setProfits((prev) => ({
              ...prev,
              fiveSim: e.target.value,
            }))
          }
        />

        {/* Preview */}

        {(profits.heroSmsTempNumbers ||
          profits.heroSmsMails ||
          profits.fiveSim ||
          profits.physicalNumbers ||
          profits.proxySellerProfit) && (
          <div className="cpp-preview-box">
            <div>
              HeroSms TempNumbers:{" "}
              <span>
                {FormatterHelper.formatNumber(profits.heroSmsTempNumbers) || 0}%
              </span>
            </div>
            <div>
              HeroSms Mails:{" "}
              <span>
                {FormatterHelper.formatNumber(profits.heroSmsMails) || 0}%
              </span>
            </div>
            <div>
              Physical Numbers:{" "}
              <span>
                {FormatterHelper.formatCurrency(profits.physicalNumbers) || 0}
              </span>
            </div>

            <div>
              Proxy Seller Profit:{" "}
              <span>
                {FormatterHelper.formatNumber(profits.proxySellerProfit) || 0}%
              </span>
            </div>
            <div>
              FiveSim:{" "}
              <span>{FormatterHelper.formatNumber(profits.fiveSim) || 0}%</span>
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
              <div className="ph-spinner ph-spinner-thick ph-spinner--light" />
            ) : providersProfit?.length > 0 ? (
              "Update"
            ) : (
              "Add"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
