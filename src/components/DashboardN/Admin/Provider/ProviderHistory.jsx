//React
import { useEffect, useState, useMemo } from "react";

//Services
import { getProvidersHistory } from "../../../../services/Provider/ProviderService";

//Helper
import { providers } from "../../../../data/Admin/Static";

import { errorToast } from "../../../../helper/Toaster";

//Css
import "./ProviderHistory.css";

const CURRENCY_LABEL = { 1: "USD", 2: "PKR" };
const PAGE_SIZE = 10;

const toDS = (d) => d.toISOString().slice(0, 10);
const today = new Date();
const twoDays = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate() - 2,
);

function fmtDate(iso) {
  try {
    return new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function fmtCost(n) {
  return "$" + Number(n).toFixed(4);
}

function StatusBadge({ status }) {
  const known = ["Successfully", "Cancelled", "Completed"];
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
  const [page, setPage] = useState(1);

  async function getProviderHistoryData() {
    setIsLoading(true);
    try {
      let response = await getProvidersHistory({
        startDate,
        endDate,
        provider,
      });
      var responseMessage = response.message;
      if (!response.isSuccess) {
        errorToast(responseMessage);
      }

      setProviderHistory(response.data);
    } finally {
      setApplied({ from: startDate, to: endDate, provider });
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getProviderHistoryData();
  }, []);

  const handleApply = async () => {
    setPage(1);
    await getProviderHistoryData();
  };

  const handleReset = async () => {
    setStartDate(toDS(twoDays));
    setEndDate(toDS(today));
    setProvider("1");
    setPage(1);
  };

  // ── Pagination ─────────────────────────────────────────────────────
  const totalPages = Math.ceil(providerHistory.length / PAGE_SIZE);
  const pageRows = providerHistory.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const pageNumbers = useMemo(() => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) pages.push(i);
      else if (pages[pages.length - 1] !== "…") pages.push("…");
    }
    return pages;
  }, [totalPages, page]);

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
                    <th>ID</th>
                    <th>User</th>
                    <th>Phone</th>
                    <th>SMS</th>
                    <th>Internal Code</th>
                    <th>Cost</th>
                    <th>Activation Cost</th>
                    <th>Currency</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Our Status</th>
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

                      <td className="ph-col-sms" title={r.sms}>
                        {r.sms ?? "-"}
                      </td>
                      <td className="ph-col-sms" title={r.ourInternalCode}>
                        {r.ourInternalCode ?? "-"}
                      </td>
                      <td className="ph-col-cost">{fmtCost(r.cost)}</td>
                      <td className="ph-col-currency">
                        {CURRENCY_LABEL[r.Currency] ?? r.ourActivationCost}
                      </td>
                      <td className="ph-col-currency">
                        {CURRENCY_LABEL[r.Currency] ?? r.currency}
                      </td>
                      <td className="ph-col-date">{fmtDate(r.date)}</td>
                      <td>
                        <StatusBadge status={r.status} />
                      </td>
                      <td>
                        <StatusBadge status={r.ourStatus} />
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
      </div>
    </div>
  );
}
