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

export default function NumberHistory() {
  //Data
  const [ordersData, setOrdersData] = useState([]);
  const [filteredNumbers, setFilteredNumbers] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  //Pagination
  const [count, setCount] = useState(0);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");

  //Filters
  const [filters, setFilters] = useState({
    status: "0",
    provider: "0",
    hasOtp: false,
  });

  useEffect(() => {
    const fetchAllMyNumbers = async () => {
      setIsLoading(true);
      try {
        const res = await getMyNumberHistory({
          pageNo,
          pageSize,
          filters,
        });

        setOrdersData(res.data.items ?? []);
        setFilteredNumbers(res.data.items ?? []);
        setCount(res.data.count ?? 0);
      } catch (err) {
        console.log(err);
        errorToast("Failed to fetch number history");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllMyNumbers();
  }, [pageNo, pageSize, filters]);

  const activeFilterCount = Object.values(filters).filter(
    (v) => v !== "0" && v !== false,
  ).length;

  function setFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function handleSearch(value) {
    setSearch(value);

    if (!value) {
      setFilteredNumbers(ordersData);
      return;
    }

    const searchValue = value.toLowerCase();

    const found = ordersData.filter(
      (num) =>
        num.orderData?.phoneNumbers?.some((p) => p.includes(searchValue)) ||
        num.provider.toLowerCase()?.includes(searchValue) ||
        num.status.toLowerCase()?.includes(searchValue),
    );
    setFilteredNumbers(found);
  }

  function clearFilters() {
    setFilters({
      status: "0",
      provider: "0",
      hasOtp: false,
    });
    setSearch("");
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
      val: ordersData.flatMap((o) => o.orderData?.phoneNumbers || []).length,
    },
    {
      label: "Total Active",
      val: ordersData
        .flatMap((o) => o.orderData?.status || [])
        .filter((s) => s === "Active").length,
    },
    {
      label: "Total Completed",
      val: ordersData
        .flatMap((o) => o.orderData?.status || [])
        .filter((s) => s === "Completed").length,
    },
    {
      label: "Total Cancelled",
      val: ordersData
        .flatMap((o) => o.orderData?.status || [])
        .filter((s) => s === "Cancelled").length,
    },
    {
      label: "Total Otps",
      val: ordersData.flatMap((o) => o.orderData?.verificationCodes || [])
        .length,
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
            <label className="nh-filter-label">Provider</label>
            <select
              className={`nh-filter-select ${filters.provider !== "0" ? "nh-filter-select--active" : ""}`}
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
              className={`nh-filter-select ${filters.status !== "0" ? "nh-filter-select--active" : ""}`}
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
            <label
              className={`nh-filter-checkbox ${filters.hasOtp ? "nh-filter-checkbox--active" : ""}`}
            >
              <input
                type="checkbox"
                checked={filters.hasOtp}
                onChange={(e) => setFilter("hasOtp", e.target.checked)}
              />
              Has OTP
            </label>
          </div>
        </div>

        {activeFilterCount > 0 && (
          <button className="nh-clear-btn" onClick={clearFilters}>
            Clear {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""}
          </button>
        )}
      </div>

      <div className="nh-table-wrap">
        <div className="nh-table-header">
          <span className="nh-table-title">All numbers</span>
          <input
            className="nh-search-input"
            placeholder="🔍 Search numbers..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
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
              {filteredNumbers.map((number, index) => (
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
            <div className="ph-spinner ph-spinner--dark ph-spinner--lg ph-spinner-thick" />
            <span className="ph-state-text">Fetching records…</span>
          </div>
        )}
        {/* Empty result */}
        {!isLoading && filteredNumbers.length === 0 && (
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
