// React
import { useState, useEffect } from "react";

// Services
import { getMyNumberHistory } from "../../services/Order/Order";

// Helper
import { FormatterHelper } from "../../helper/FormatterHelper";
import { NumberStatus, Providers } from "../../data/Static";

// Toaster
import { successTaost, errorToast } from "../../helper/Toaster";

//Pagination
import Paginations from "../Shared/Pagination";

// CSS
import "./NumberHistory.css";

const toDS = (d) => d.toISOString().slice(0, 10);
const today = new Date();
const twoWeeks = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate() - 14,
);
export default function NumberHistory() {
  //Data
  const [numbersHistory, setNumbersHistory] = useState([]);

  //Loading
  const [isLoading, setIsLoading] = useState(false);

  //Pagination
  const [count, setCount] = useState(0);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  //Filters
  const [filters, setFilters] = useState({
    status: "0",
    provider: "0",
    hasOtp: false,
    keyword: "",
    startDate: toDS(twoWeeks),
    endDate: toDS(today),
  });

  async function fetchAllMyNumbersHistory() {
    setIsLoading(true);
    try {
      const res = await getMyNumberHistory({
        pageNo,
        pageSize,
        filters,
      });

      setNumbersHistory(res.data.items ?? []);
      console.log(res.data.items);
      setCount(res.data.count ?? 0);
    } catch (err) {
      console.log(err);
      errorToast("Failed to fetch number history");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchAllMyNumbersHistory();
  }, [pageNo, pageSize, filters.keyword]);

  const handleApply = async () => {
    await fetchAllMyNumbersHistory();
  };

  function setFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function clearFilters() {
    setFilters({
      status: "0",
      provider: "0",
      hasOtp: false,
      keyword: "",
      startDate: toDS(twoWeeks),
      endDate: toDS(today),
    });
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      successTaost("Copied to clipboard");
    } catch (err) {
      errorToast("Failed to copy");
      console.error("Copy failed", err);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPageNo(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPageNo(0);
  };

  const stats = [
    {
      label: "Total numbers",
      val: numbersHistory.flatMap((o) => o.orderData?.phoneNumbers || [])
        .length,
    },
    {
      label: "Total Active",
      val: numbersHistory
        .flatMap((o) => o.orderData?.status || [])
        .filter((s) => s === "Active").length,
    },
    {
      label: "Total Completed",
      val: numbersHistory
        .flatMap((o) => o.orderData?.status || [])
        .filter((s) => s === "Completed").length,
    },
    {
      label: "Total Cancelled",
      val: numbersHistory
        .flatMap((o) => o.orderData?.status || [])
        .filter((s) => s === "Cancelled").length,
    },
    {
      label: "Total Otps",
      val: numbersHistory.flatMap((o) => o.orderData?.verificationCodes || [])
        .length,
    },
    {
      label: "Total Spent",
      val: FormatterHelper.formatCurrency(
        numbersHistory
          .filter((x) => x.status === "Completed")
          .reduce((sum, x) => sum + (x.totalCost ?? 0), 0),
      ),
    },
  ];

  return (
    <div className="nh-page">
      <div className="nh-header">
        <div>
          <div className="nh-page-title">Number History</div>
          <div className="nh-page-sub">
            View all your purchased numbers and their activation status
          </div>
        </div>
      </div>

      <div className="nh-stats-row">
        {stats.map((s) => (
          <div key={s.label} className="nh-stat-card">
            <div className="nh-stat-val">{s.val}</div>
            <div className="nh-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── FILTERS ── */}
      <div className="nh-filters-bar">
        <div className="nh-filters-left">
          <span className="nh-filters-heading">Filters</span>
          <div className="nh-filter-group">
            <label className="nh-filter-label">From Date</label>
            <input
              type="date"
              className={`nh-filter-select`}
              value={filters.startDate}
              onChange={(e) => setFilter("startDate", e.target.value)}
              max={filters.endDate}
            />
          </div>
          <div className="nh-filter-group">
            <label className="nh-filter-label">To Date</label>
            <input
              type="date"
              className={`nh-filter-select`}
              value={filters.endDate}
              onChange={(e) => setFilter("endDate", e.target.value)}
              min={filters.startDate}
              max={toDS(today)}
            />
          </div>
          <div className="nh-filter-group">
            <label className="nh-filter-label">Provider</label>
            <select
              className={`nh-filter-select `}
              value={filters.provider}
              onChange={(e) => setFilter("provider", e.target.value)}
            >
              {Providers.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="nh-filter-group">
            <label className="nh-filter-label">Status</label>
            <select
              className={`nh-filter-select `}
              value={filters.status}
              onChange={(e) => setFilter("status", e.target.value)}
            >
              {NumberStatus.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="nh-filter-group">
            <label className="nh-filter-label">OTP</label>
            <label className={`nh-filter-checkbox `}>
              <input
                type="checkbox"
                checked={filters.hasOtp}
                onChange={(e) => setFilter("hasOtp", e.target.checked)}
              />
              Has OTP
            </label>
          </div>
        </div>
        <div className="nh-filter-actions">
          <button className="nh-clear-btn" onClick={clearFilters}>
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
          <span className="nh-table-title">All numbers</span>
          <input
            className="adm-search-input"
            placeholder="🔍 Search numbers..."
            onChange={(e) => setFilter("keyword", e.target.value)}
          />
        </div>
        <table className="nh-table">
          <thead>
            <tr>
              {[
                "#",
                "Number",
                "Otps",
                "Provider",
                "Total Cost",
                "Status",
                "Ordered At",
              ].map((h) => (
                <th key={h} className="nh-th">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          {!isLoading && (
            <tbody>
              {numbersHistory.map((number, index) => (
                <tr key={index} className="nh-tr">
                  <td className="nh-td">{index + 1}</td>
                  <td className="nh-td">
                    {number.orderData.phoneNumbers.length > 0 ? (
                      <div className="nh-ellipsis-copy">
                        <span className="nh-ellipsis-text">
                          {number.orderData.phoneNumbers.join(", ")}
                        </span>
                        <button
                          className="nh-copy-btn"
                          onClick={() =>
                            copyToClipboard(
                              number.orderData.phoneNumbers.join("\n"),
                            )
                          }
                        >
                          📋
                        </button>
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="nh-td">
                    {number.orderData.verificationCodes.length > 0 ? (
                      <div className="nh-ellipsis-copy">
                        <span className="nh-ellipsis-text">
                          {number.orderData.verificationCodes.join(", ")}
                        </span>
                        <button
                          className="nh-copy-btn"
                          onClick={() =>
                            copyToClipboard(
                              number.orderData.verificationCodes.join(", "),
                            )
                          }
                        >
                          📋
                        </button>
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="nh-td">{number.provider}</td>
                  <td className="nh-td">
                    {FormatterHelper.formatCurrency(number.totalCost)}
                  </td>
                  <td className="nh-td">
                    <span
                      className={`nh-status-badge nh-status--${number.status.toLowerCase()}`}
                    >
                      {number.status}
                    </span>
                  </td>
                  <td className="nh-td">
                    {FormatterHelper.formatDateToLocal(number.orderedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
        {/* Loading */}
        {isLoading && (
          <div className="ph-state-row">
            <div className="ph-spinner  ph-spinner--lg ph-spinner-thick ph-spinner--light" />
            <span className="ph-state-text">Fetching records…</span>
          </div>
        )}
        {/* Empty result */}
        {!isLoading && numbersHistory.length === 0 && (
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
