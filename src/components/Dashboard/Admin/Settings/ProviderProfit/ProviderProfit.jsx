//React
import { useEffect, useState } from "react";

//Services
import {
  getProvidersProfit,
  configureProvidersProfit,
} from "../../../../../services/Provider/ProviderService";

//Helper
import { FormatterHelper } from "../../../../../helper/FormatterHelper";
import { errorToast, successTaost } from "../../../../../helper/Toaster";
import { modalKeys } from "../../../../../data/Static";

//Modals
import { ConfigureProviderProfitModal } from "../../../../Helper/ProviderProfit/Modals/ConfigureProviderProfitModal";

//Css
import "./ProviderProfit.css";

export default function ProviderProfit() {
  //Data
  const [providersProfit, setProvidersProfit] = useState([]);

  //Loading
  const [isLoading, setIsLoading] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(false);

  //Modal
  const [modals, setModals] = useState([]);

  async function getProviderProfitData() {
    setIsLoading(true);
    try {
      let response = await getProvidersProfit();
      var responseMessage = response.message;
      var responseData = !response.data ? [] : [response.data];
      if (!response.isSuccess) {
        errorToast(responseMessage);
      }
      setProvidersProfit(responseData);
    } catch {
      errorToast("Failed to load provider pricings");
    } finally {
      setIsLoading(false);
    }
  }

  async function configureProviderProfit(request) {
    setIsConfiguring(true);
    try {
      let response = await configureProvidersProfit(request);
      var responseMessage = response.message;
      var responseData = !response.data ? [] : [response.data];
      if (response.isSuccess) {
        successTaost(responseMessage);
        setProvidersProfit(responseData);
        handleModalClose(modalKeys.providerProfit);
      } else {
        errorToast(responseMessage);
      }
    } catch {
      errorToast("Failed to configure providers profit.");
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
    getProviderProfitData();
  }, []);

  return (
    <div className="pp-page">
      <div className="ph-filters">
        <div className="ph-filter-actions">
          <button
            onClick={() => handleModalOpen(modalKeys.providerProfit)}
            className="ph-apply-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span
                  className="btn-spinner"
                  style={{
                    width: 13,
                    height: 13,
                    borderTopColor: "#000",
                    borderColor: "rgba(0,0,0,0.25)",
                  }}
                />{" "}
                Fetching…
              </>
            ) : providersProfit?.length > 0 ? (
              "✦ Edit"
            ) : (
              "✦ Add"
            )}
          </button>
        </div>
      </div>
      <div className="ph-table-panel">
        <div className="ph-table-header">
          <span className="ph-table-title">Provider Pricings</span>
        </div>

        {!isLoading && (
          <div className="ph-table-wrap">
            <table className="ph-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>HeroSms</th>
                  <th>FiveSim</th>
                  <th>Physical Numbers</th>
                  <th>Created By</th>
                  <th>Updated By</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                </tr>
              </thead>

              <tbody>
                {providersProfit.map((r, index) => (
                  <tr key={r.id}>
                    <td className="ph-col-id">{index + 1}</td>
                    <td className="ph-col-cost">{r.heroSms}%</td>

                    <td className="ph-col-cost">{r.fiveSim}%</td>
                    <td className="ph-col-cost">
                      {FormatterHelper.formatCurrency(r.physicalNumbers)}{" "}
                    </td>

                    <td className="um-user-cell">
                      <div>
                        <div className="um-user-name">{r.createdBy.name}</div>

                        <div className="um-user-email">{r.createdBy.email}</div>
                      </div>
                    </td>
                    <td className="ph-col-id">
                      <div>
                        <div className="um-user-name">
                          {r.updatedBy?.name ?? "-"}
                        </div>

                        <div className="um-user-email">
                          {r.updatedBy?.email ?? "-"}
                        </div>
                      </div>
                    </td>

                    <td className="ph-col-date">
                      {FormatterHelper.formatDateToLocal(r.createdBy.createdAt)}
                    </td>
                    <td className="ph-col-date">
                      {r.updatedBy
                        ? FormatterHelper.formatDateToLocal(
                            r.updatedBy.updatedAt,
                          )
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {isLoading && (
          <div className="ph-state-row">
            <div className="ph-spinner" />
            <span className="ph-state-text">Fetching records…</span>
          </div>
        )}

        {!isLoading && providersProfit.length === 0 && (
          <div className="ph-state-row">
            <div className="ph-state-icon">⊟</div>

            <span className="ph-state-text">
              No provider profit record found
            </span>
          </div>
        )}
      </div>
      {modals.includes(modalKeys.providerProfit) && (
        <ConfigureProviderProfitModal
          onConfirm={configureProviderProfit}
          onClose={handleModalClose}
          providersProfit={providersProfit}
          isSubmitting={isConfiguring}
        />
      )}
    </div>
  );
}
