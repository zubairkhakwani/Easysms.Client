// React
import { useEffect, useState } from "react";

// Services
import {
  getProviderPerformance,
  getProviders,
} from "../../../services/Provider/ProviderService";

// Helper
import { getAdminProviderLabel } from "../../../helper/UtilityHelper";
import { errorToast } from "../../../helper/Toaster";

// Pagination
import Paginations from "../../Shared/Pagination";

// CSS — same look as Number History
import "../NumberHistory/NumberHistory.css";

export default function ProviderPerformance() {
  const [provider, setProvider] = useState("0");
  const [country, setCountry] = useState("");

  const [rows, setRows] = useState([]);
  const [providers, setProviders] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [count, setCount] = useState(0);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [sortBy, setSortBy] = useState("SuccessRate");
  const [sortDir, setSortDir] = useState("Desc");

  async function loadPerformance() {
    setIsLoading(true);
    try {
      const response = await getProviderPerformance({
        pageNo,
        pageSize,
        provider,
        country,
        sortBy,
        sortDir,
      });

      if (!response.isSuccess) {
        errorToast(response.message);
      }

      const data = response.data;
      setRows(data?.summary?.items ?? []);
      setCount(data?.summary?.count ?? 0);
    } catch {
      errorToast("Failed to load provider performance");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadPerformance();
  }, [pageNo, pageSize, sortBy, sortDir]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getProviders();
        setProviders(data ?? []);
      } catch {
        errorToast("Failed to load providers");
      }
    })();
  }, []);

  const handleApply = async () => {
    if (pageNo !== 0) {
      setPageNo(0);
      return;
    }
    await loadPerformance();
  };

  const handleReset = () => {
    setProvider("0");
    setCountry("");
    setSortBy("SuccessRate");
    setSortDir("Desc");
    setPageSize(10);
    setPageNo(0);
  };

  const handleChangePage = (event, newPage) => {
    setPageNo(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPageNo(0);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDir((prev) => (prev === "Desc" ? "Asc" : "Desc"));
    } else {
      setSortBy(field);
      setSortDir("Desc");
    }
    setPageNo(0);
  };

  const sortIndicator = (field) => {
    if (sortBy !== field) return null;
    return (
      <span className="nh-sort-arrow" aria-hidden="true">
        {sortDir === "Asc" ? "↑" : "↓"}
      </span>
    );
  };

  return (
    <div className="nh-page">
      <div className="nh-header">
        <div>
          <div className="nh-page-title">Provider performance</div>
          <div className="nh-page-sub">
            Last 3 days of activations across all customers. This is for you —
            use it to pick the best possible provider for your country right
            now.
          </div>
        </div>
      </div>

      <div className="nh-filters-bar">
        <div className="nh-filters-left">
          <span className="nh-filters-heading">Filters</span>
          <div className="nh-filter-group">
            <label className="nh-filter-label">Provider</label>
            <select
              className="nh-filter-select"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
            >
              <option value="0">All</option>
              {providers.map((p) => (
                <option key={p.id} value={p.id}>
                  {getAdminProviderLabel(p)}
                </option>
              ))}
            </select>
          </div>
          <div className="nh-filter-group">
            <label className="nh-filter-label">Country</label>
            <input
              type="text"
              className="nh-filter-select"
              placeholder="e.g. United Kingdom"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>
        </div>
        <div className="nh-filter-actions">
          <button className="nh-clear-btn" onClick={handleReset}>
            Reset
          </button>
          <button
            className="nh-apply-btn"
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

      <div className="nh-table-wrap">
        <div className="nh-table-header">
          <span className="nh-table-title">Last 3 days</span>
        </div>
        <table className="nh-table">
          <thead>
            <tr>
              <th className="nh-th">#</th>
              <th className="nh-th">Country</th>
              <th className="nh-th">Provider</th>
              <th className="nh-th">
                <button
                  type="button"
                  className={`nh-sort-th${sortBy === "Purchased" ? " nh-sort-th--active" : ""}`}
                  onClick={() => handleSort("Purchased")}
                >
                  Purchased{sortIndicator("Purchased")}
                </button>
              </th>
              <th className="nh-th">Completed</th>
              <th className="nh-th">Cancelled</th>
              <th className="nh-th">
                <button
                  type="button"
                  className={`nh-sort-th${sortBy === "SuccessRate" ? " nh-sort-th--active" : ""}`}
                  onClick={() => handleSort("SuccessRate")}
                >
                  Success %{sortIndicator("SuccessRate")}
                </button>
              </th>
              <th className="nh-th">
                <button
                  type="button"
                  className={`nh-sort-th${sortBy === "FailureRate" ? " nh-sort-th--active" : ""}`}
                  onClick={() => handleSort("FailureRate")}
                >
                  Failure %{sortIndicator("FailureRate")}
                </button>
              </th>
            </tr>
          </thead>
          {!isLoading && (
            <tbody>
              {rows.map((r, index) => (
                <tr
                  key={`${r.countryId}-${r.providerName}-${index}`}
                  className="nh-tr"
                >
                  <td className="nh-td">{pageNo * pageSize + index + 1}</td>
                  <td className="nh-td">{r.countryName}</td>
                  <td className="nh-td">{r.providerName}</td>
                  <td className="nh-td">{r.totalPurchased}</td>
                  <td className="nh-td">{r.totalCompleted}</td>
                  <td className="nh-td">{r.totalCancelled}</td>
                  <td className="nh-td nh-rate-success">{r.successRate}%</td>
                  <td className="nh-td nh-rate-fail">{r.failureRate}%</td>
                </tr>
              ))}
            </tbody>
          )}
        </table>

        {isLoading && (
          <div className="ph-state-row">
            <div className="ph-spinner ph-spinner--lg ph-spinner-thick ph-spinner--light" />
            <span className="ph-state-text">Fetching records…</span>
          </div>
        )}

        {!isLoading && rows.length === 0 && (
          <div className="ph-state-row">
            <div className="ph-state-icon">⊟</div>
            <span className="ph-state-text">
              No records found for the selected filters
            </span>
          </div>
        )}

        {!isLoading && (
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
