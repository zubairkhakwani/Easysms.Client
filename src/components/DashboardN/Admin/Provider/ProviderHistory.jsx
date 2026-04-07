//React
import { useEffect, useState } from "react";

//Services
import { getProvidersHistory } from "../../../../services/Provider/ProviderService";

//Helper
import { providers } from "../../../../data/Admin/Static";
import { FormatterHelper } from "../../../../helper/FormatterHelper";
import { errorToast } from "../../../../helper/Toaster";

import Paginations from "../../../Shared/Pagination";

//Css
import "./ProviderHistory.css";

const toDS = (d) => d.toISOString().slice(0, 10);
const today = new Date();
const twoDays = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate() - 2,
);

function StatusBadge({ status }) {
  const known = ["Active", "Cancelled", "Completed"];
  const cls = known.includes(status) ? status : "default";
  return <span className={`ph-status ${cls}`}>{status}</span>;
}

export default function ProviderHistory() {
  const [startDate, setStartDate] = useState(toDS(twoDays));
  const [endDate, setEndDate] = useState(toDS(today));
  const [provider, setProvider] = useState("1");
  const [applied, setApplied] = useState(null);
  const [providerHistory, setProviderHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  async function getProviderHistoryData() {
    setIsLoading(true);
    try {
      let response = await getProvidersHistory({
        pageNo,
        pageSize,
        startDate,
        endDate,
        provider,
      });
      var responseMessage = response.message;
      var responseData = response.data;
      if (!response.isSuccess) {
        errorToast(responseMessage);
      }
      setProviderHistory(responseData.items);
      setCount(responseData.count);
    } finally {
      setApplied({ from: startDate, to: endDate, provider });
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getProviderHistoryData();
  }, [pageNo, pageSize]);

  const handleApply = async () => {
    await getProviderHistoryData();
    setPageNo(1);
  };

  const handleReset = async () => {
    setStartDate(toDS(twoDays));
    setEndDate(toDS(today));
    setProvider("1");
  };

  const handleChangePage = (event, newPage) => {
    setPageNo(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPageNo(1);
  };

  return (
    <div className="ph-page">
      {/* ── Filters ── */}
      <div className="ph-filters">
        <div className="ph-filter-field">
          <label className="ph-filter-label">From Date</label>
          <input
            type="date"
            className="ph-filter-input"
            value={startDate}
            max={endDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="ph-filter-field">
          <label className="ph-filter-label">To Date</label>
          <input
            type="date"
            className="ph-filter-input"
            value={endDate}
            min={startDate}
            max={toDS(today)}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="ph-filter-field">
          <label className="ph-filter-label">Provider</label>
          <select
            className="ph-filter-input"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
          >
            {providers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="ph-filter-actions">
          <button className="ph-reset-btn" onClick={handleReset}>
            Reset
          </button>
          <button
            className="ph-apply-btn"
            onClick={handleApply}
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
            ) : (
              "✦ Apply"
            )}
          </button>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="ph-table-panel">
        <div className="ph-table-header">
          <span className="ph-table-title">Provider History</span>
          {
            <span className="ph-table-meta">
              {applied?.from} → {applied?.to}
              {` · ${providers.find((p) => p.id === applied?.provider)?.name}`}
            </span>
          }
        </div>
        {/* Table */}
        {!isLoading && (
          <>
            <div className="ph-table-wrap">
              <table className="ph-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Id</th>
                    <th>User</th>
                    <th>Phone</th>
                    <th>Code</th>
                    <th>Actual Cost</th>
                    <th>User Cost</th>
                    <th>Date</th>
                    <th>Cancellation Status</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {providerHistory.map((r, index) => (
                    <tr key={r.id}>
                      <td className="ph-col-id">{index + 1}</td>
                      <td className="ph-col-id">{r.id}</td>
                      <td className="um-user-cell">
                        <div>
                          <div className="um-user-name">{r.userName}</div>
                          <div className="um-user-email">{r.email}</div>
                        </div>
                      </td>

                      <td className="ph-col-phone">{r.phone}</td>

                      <td className="ph-col-sms" title={r.verificationCode}>
                        {r.verificationCode ?? "-"}
                      </td>

                      <td className="ph-col-cost">
                        {FormatterHelper.formatCurrency(r.actualActivationCost)}
                      </td>
                      <td className="ph-col-cost">
                        {FormatterHelper.formatCurrency(r.userActivationCost)}
                      </td>

                      <td className="ph-col-date">
                        {FormatterHelper.formatDateToLocal(r.date)}
                      </td>
                      <td className="ph-col-sms" title={r.cancellationStatus}>
                        {r.cancellationStatus ?? "-"}
                      </td>
                      <td>
                        <StatusBadge status={r.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {/* Loading */}
        {isLoading && (
          <div className="ph-state-row">
            <div className="ph-spinner" />
            <span className="ph-state-text">Fetching records…</span>
          </div>
        )}
        {/* Empty result */}
        {!isLoading && applied && providerHistory.length === 0 && (
          <div className="ph-state-row">
            <div className="ph-state-icon">⊟</div>
            <span className="ph-state-text">
              No records found for the selected filters
            </span>
          </div>
        )}
        <Paginations
          page={pageNo}
          rowsPerPage={pageSize}
          count={count}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </div>
    </div>
  );
}
