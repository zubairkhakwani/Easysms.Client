//React
import { useEffect, useState } from "react";

//Services
import { getProvidersHistory } from "../../../../services/Provider/ProviderService";
import { getProviders } from "../../../../services/Provider/ProviderService";
import { getAll } from "../../../../services/User/UserService";

//Helper
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
  //Filtering
  const [startDate, setStartDate] = useState(toDS(twoDays));
  const [endDate, setEndDate] = useState(toDS(today));
  const [provider, setProvider] = useState("0");
  const [user, setUser] = useState(0);

  //Data
  const [providerHistory, setProviderHistory] = useState([]);
  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);

  //Loading
  const [applied, setApplied] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  //Pagination
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
        user,
      });
      var responseMessage = response.message;
      var responseData = !response.data ? [] : response.data;
      if (!response.isSuccess) {
        errorToast(responseMessage);
      }
      setProviderHistory(responseData?.items ?? []);
      setCount(responseData.count);
    } finally {
      setApplied({ from: startDate, to: endDate, provider });
      setIsLoading(false);
    }
  }
  async function getUsersData() {
    let response = await getAll();
    var responseData = response.data;
    setUsers(responseData);
    if (!response.isSuccess) {
      errorToast(response.message);
    }
  }

  async function getProvidersData() {
    let response = await getProviders();
    setProviders(response);
  }

  useEffect(() => {
    getProviderHistoryData();
  }, [pageNo, pageSize]);

  useEffect(() => {
    getUsersData();
  }, []);

  useEffect(() => {
    getProvidersData();
  }, []);

  const handleApply = async () => {
    await getProviderHistoryData();
    setPageNo(1);
  };

  const handleReset = async () => {
    setStartDate(toDS(twoDays));
    setEndDate(toDS(today));
    setProvider("0");
    setUser(0);
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
            <option value={"0"}>All</option>
            {providers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div className="ph-filter-field">
          <label className="ph-filter-label">User</label>
          <select
            className="ph-filter-input"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          >
            <option value={0}>All</option>
            {users.map((p) => (
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
                    <th>Provider</th>
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
                      <td className="ph-col-phone">{r.provider}</td>

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

        {!isLoading && applied && providerHistory.length !== 0 && (
          <Paginations
            page={pageNo}
            rowsPerPage={pageSize}
            count={count}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
          />
        )}
      </div>
    </div>
  );
}
