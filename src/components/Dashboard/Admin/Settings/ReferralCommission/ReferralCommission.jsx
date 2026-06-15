import { useEffect, useState } from "react";

import {
  getReferralCommissionSettings,
  configureReferralCommissionSettings,
} from "../../../../../services/Referral/ReferralCommissionService";

import { FormatterHelper } from "../../../../../helper/FormatterHelper";
import { getReferralCommissionRateBounds } from "../../../../../helper/ReferralCommissionHelper";
import { errorToast, successTaost } from "../../../../../helper/Toaster";
import { modalKeys } from "../../../../../data/Static";

import { ConfigureReferralCommissionModal } from "../../../../Helper/ReferralCommission/Modals/ConfigureReferralCommissionModal";

import "../ProviderProfit/ProviderProfit.css";

export default function ReferralCommission() {
  const [settings, setSettings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [modals, setModals] = useState([]);

  async function loadSettings() {
    setIsLoading(true);
    try {
      const response = await getReferralCommissionSettings();
      const responseData = !response.data ? [] : [response.data];
      if (!response.isSuccess) {
        errorToast(response.message);
      }
      setSettings(responseData);
    } catch {
      errorToast("Failed to load referral commission settings");
    } finally {
      setIsLoading(false);
    }
  }

  async function configureSettings(request) {
    setIsConfiguring(true);
    try {
      const response = await configureReferralCommissionSettings(request);
      const responseData = !response.data ? [] : [response.data];
      if (response.isSuccess) {
        successTaost(response.message);
        setSettings(responseData);
        handleModalClose(modalKeys.referralCommission);
      } else {
        errorToast(response.message);
      }
    } catch {
      errorToast("Failed to configure referral commission settings.");
    } finally {
      setIsConfiguring(false);
    }
  }

  function handleModalOpen(key) {
    setModals((prev) => [...prev, key]);
  }

  function handleModalClose(key) {
    setModals((prev) => prev.filter((k) => k !== key));
  }

  useEffect(() => {
    loadSettings();
  }, []);

  const row = settings[0];
  const rateBounds = row
    ? getReferralCommissionRateBounds(
        row.tempNumberCommissionPercent,
        row.mailCommissionPercent,
        row.accountCommissionPercent,
        row.proxyCommissionPercent,
      )
    : { min: 0, max: 0 };

  return (
    <div className="pp-page">
      <div className="ph-filters">
        <div className="ph-filter-actions">
          <button
            onClick={() => handleModalOpen(modalKeys.referralCommission)}
            className="ph-apply-btn"
            disabled={isLoading}
          >
            {isLoading
              ? "Fetching…"
              : settings?.length > 0
                ? "✦ Edit"
                : "✦ Add"}
          </button>
        </div>
      </div>

      <div className="ph-table-panel">
        <div className="ph-table-header">
          <span className="ph-table-title">Referral Commission Settings</span>
        </div>

        {!isLoading && row && (
          <div className="ph-table-wrap">
            <table className="ph-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Temp Number</th>
                  <th>Mail</th>
                  <th>Account</th>
                  <th>Proxy</th>
                  <th>Rate range</th>
                  <th>Min Transfer / Withdraw</th>
                  <th>Created By</th>
                  <th>Created At</th>
                  <th>Updated By</th>
                  <th>Updated At</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="ph-col-id">1</td>
                  <td className="ph-col-cost">
                    {FormatterHelper.formatNumber(row.tempNumberCommissionPercent)}%
                  </td>
                  <td className="ph-col-cost">
                    {FormatterHelper.formatNumber(row.mailCommissionPercent)}%
                  </td>
                  <td className="ph-col-cost">
                    {FormatterHelper.formatNumber(row.accountCommissionPercent)}%
                  </td>
                  <td className="ph-col-cost">
                    {FormatterHelper.formatNumber(row.proxyCommissionPercent)}%
                  </td>
                  <td className="ph-col-cost">
                    {FormatterHelper.formatNumber(rateBounds.min)}% –{" "}
                    {FormatterHelper.formatNumber(rateBounds.max)}%
                  </td>
                  <td className="ph-col-cost">
                    {FormatterHelper.formatCurrency(row.minWithdrawalAmount)}
                  </td>
                  <td className="um-user-cell">
                    <div>
                      <div className="um-user-name">{row.createdBy.name}</div>
                      <div className="um-user-email">{row.createdBy.email}</div>
                    </div>
                  </td>
                  <td className="ph-col-date">
                    {FormatterHelper.formatDateToLocal(row.createdBy.createdAt)}
                  </td>
                  <td className="ph-col-id">
                    <div>
                      <div className="um-user-name">
                        {row.updatedBy?.name ?? "-"}
                      </div>
                      <div className="um-user-email">
                        {row.updatedBy?.email ?? "-"}
                      </div>
                    </div>
                  </td>
                  <td className="ph-col-date">
                    {row.updatedBy
                      ? FormatterHelper.formatDateToLocal(row.updatedBy.updatedAt)
                      : "-"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modals.includes(modalKeys.referralCommission) && (
        <ConfigureReferralCommissionModal
          onConfirm={configureSettings}
          onClose={handleModalClose}
          isSubmitting={isConfiguring}
          settings={settings}
        />
      )}
    </div>
  );
}
