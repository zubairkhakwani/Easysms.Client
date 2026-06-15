import { useMemo, useState } from "react";

import { modalKeys } from "../../../../data/Static";
import { FormatterHelper } from "../../../../helper/FormatterHelper";

import "../../ProviderProfit/Modals/ConfigureProviderProfitModal.css";

export function ConfigureReferralCommissionModal({
  settings,
  isSubmitting,
  onClose,
  onConfirm,
}) {
  const current = settings[0];

  const [form, setForm] = useState({
    tempNumberCommissionPercent: current?.tempNumberCommissionPercent ?? "",
    mailCommissionPercent: current?.mailCommissionPercent ?? "",
    accountCommissionPercent: current?.accountCommissionPercent ?? "",
    proxyCommissionPercent: current?.proxyCommissionPercent ?? "",
    minWithdrawalAmount: current?.minWithdrawalAmount ?? "",
  });

  const rates = useMemo(() => {
    const values = [
      Number(form.tempNumberCommissionPercent),
      Number(form.mailCommissionPercent),
      Number(form.accountCommissionPercent),
      Number(form.proxyCommissionPercent),
    ].filter((v) => v > 0);

    if (values.length === 0) {
      return { min: 0, max: 0 };
    }

    return {
      min: Math.min(...values),
      max: Math.max(...values),
    };
  }, [form]);

  const isValid =
    Number(form.tempNumberCommissionPercent) > 0 &&
    Number(form.mailCommissionPercent) > 0 &&
    Number(form.accountCommissionPercent) > 0 &&
    Number(form.proxyCommissionPercent) > 0 &&
    Number(form.minWithdrawalAmount) > 0;

  const handleSubmit = () => {
    onConfirm({
      tempNumberCommissionPercent: Number(form.tempNumberCommissionPercent),
      mailCommissionPercent: Number(form.mailCommissionPercent),
      accountCommissionPercent: Number(form.accountCommissionPercent),
      proxyCommissionPercent: Number(form.proxyCommissionPercent),
      minWithdrawalAmount: Number(form.minWithdrawalAmount),
    });
  };

  return (
    <div className="cpp-overlay">
      <div className="cpp-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="cpp-close-btn"
          onClick={() => onClose(modalKeys.referralCommission)}
        >
          ✕
        </button>

        <div className="cpp-modal-title">Configure Referral Commission</div>
        <div className="cpp-modal-sub">
          Set per-service commission rates and minimum transfer / withdrawal amount
        </div>

        {[
          ["Temp Number Commission (%)", "tempNumberCommissionPercent"],
          ["Mail Commission (%)", "mailCommissionPercent"],
          ["Account Commission (%)", "accountCommissionPercent"],
          ["Proxy Commission (%)", "proxyCommissionPercent"],
          ["Minimum transfer / withdrawal (USD)", "minWithdrawalAmount"],
        ].map(([label, key]) => (
          <div key={key}>
            <label className="cpp-label">{label}</label>
            <input
              className="cpp-input"
              type="number"
              min="0"
              value={form[key]}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, [key]: e.target.value }))
              }
            />
          </div>
        ))}

        {isValid && (
          <div className="cpp-preview-box">
            <div>
              Temp Number:{" "}
              <span>
                {FormatterHelper.formatNumber(form.tempNumberCommissionPercent)}%
              </span>
            </div>
            <div>
              Mail:{" "}
              <span>{FormatterHelper.formatNumber(form.mailCommissionPercent)}%</span>
            </div>
            <div>
              Account:{" "}
              <span>
                {FormatterHelper.formatNumber(form.accountCommissionPercent)}%
              </span>
            </div>
            <div>
              Proxy:{" "}
              <span>{FormatterHelper.formatNumber(form.proxyCommissionPercent)}%</span>
            </div>
            <div>
              Rate range:{" "}
              <span>
                {FormatterHelper.formatNumber(rates.min)}% –{" "}
                {FormatterHelper.formatNumber(rates.max)}%
              </span>
            </div>
            <div>
              Min transfer / withdrawal:{" "}
              <span>
                {FormatterHelper.formatCurrency(form.minWithdrawalAmount)}
              </span>
            </div>
          </div>
        )}

        <div className="cpp-modal-actions">
          <button
            className="cpp-btn ghost"
            onClick={() => onClose(modalKeys.referralCommission)}
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
            ) : settings?.length > 0 ? (
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
