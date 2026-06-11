//React
import { useState, useEffect } from "react";

//Services
import { getMyWalletHistory } from "../../../services/User/UserService";

//Helper
import { FormatterHelper } from "../../../helper/FormatterHelper";

//Static
import { WalletTransactionTypes } from "../../../data/Static";

//Toaster
import { errorToast } from "../../../helper/Toaster";

//Pagination
import Paginations from "../../Shared/Pagination";

//Css
import "./TransactionHistory.css";

const toDS = (d) => d.toISOString().slice(0, 10);
const today = new Date();
const twoWeeks = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate() - 14,
);

function getTypeLabel(type) {
  return WalletTransactionTypes.find((t) => Number(t.value) === type)?.label ?? "—";
}

export default function TransactionHistory() {
  const [summary, setSummary] = useState({
    currentBalance: 0,
    totalCredited: 0,
    totalSpent: 0,
    totalRefunded: 0,
    transactionCount: 0,
  });
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState({
    keyword: "",
    type: "",
    startDate: toDS(twoWeeks),
    endDate: toDS(today),
  });

  const fetchWalletHistory = async () => {
    setIsLoading(true);
    try {
      const res = await getMyWalletHistory({ pageNo, pageSize, filters });
      if (res.isSuccess) {
        setSummary({
          currentBalance: res.data.currentBalance ?? 0,
          totalCredited: res.data.totalCredited ?? 0,
          totalSpent: res.data.totalSpent ?? 0,
          totalRefunded: res.data.totalRefunded ?? 0,
          transactionCount: res.data.transactionCount ?? 0,
        });
        setTransactions(res.data.transactions?.items ?? []);
        setCount(res.data.transactions?.count ?? 0);
      } else {
        errorToast(res.message || "Failed to fetch transaction history");
      }
    } catch {
      errorToast("Failed to fetch transaction history");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletHistory();
  }, [pageNo, pageSize]);

  function setFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function clearFilters() {
    setFilters({
      keyword: "",
      type: "",
      startDate: toDS(twoWeeks),
      endDate: toDS(today),
    });
    setPageNo(0);
  }

  const handleApply = async () => {
    if (pageNo !== 0) {
      setPageNo(0);
    }
    await fetchWalletHistory();
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
      label: "Current Balance",
      val: FormatterHelper.formatCurrency(summary.currentBalance),
    },
    {
      label: "Total Added",
      val: FormatterHelper.formatCurrency(summary.totalCredited),
    },
    {
      label: "Total Spent",
      val: FormatterHelper.formatCurrency(summary.totalSpent),
    },
    {
      label: "Total Refunded",
      val: FormatterHelper.formatCurrency(summary.totalRefunded),
    },
    {
      label: "Transactions",
      val: summary.transactionCount,
    },
  ];

  return (
    <div className="th-page">
      <div className="th-header">
        <div>
          <div className="th-page-title">Transaction History</div>
          <div className="th-page-sub">
            Your complete wallet ledger — every credit, purchase, and refund in
            one place
          </div>
        </div>
      </div>

      <div className="th-stats-row">
        {stats.map((s) => (
          <div key={s.label} className="th-stat-card">
            <div className="th-stat-val">{s.val}</div>
            <div className="th-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="th-filters-bar">
        <div className="th-filters-left">
          <span className="th-filters-heading">Filters</span>
          <div className="th-filter-group">
            <label className="th-filter-label">From Date</label>
            <input
              type="date"
              className="th-filter-select"
              value={filters.startDate}
              onChange={(e) => setFilter("startDate", e.target.value)}
              max={filters.endDate}
            />
          </div>
          <div className="th-filter-group">
            <label className="th-filter-label">To Date</label>
            <input
              type="date"
              className="th-filter-select"
              value={filters.endDate}
              onChange={(e) => setFilter("endDate", e.target.value)}
              min={filters.startDate}
              max={toDS(today)}
            />
          </div>
          <div className="th-filter-group">
            <label className="th-filter-label">Type</label>
            <select
              className="th-filter-select"
              value={filters.type}
              onChange={(e) => setFilter("type", e.target.value)}
            >
              {WalletTransactionTypes.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="th-filter-actions">
          <button className="th-clear-btn" onClick={clearFilters}>
            Reset
          </button>
          <button
            className="th-apply-btn"
            onClick={handleApply}
            disabled={isLoading}
          >
            {isLoading ? "Fetching…" : "Apply"}
          </button>
        </div>
      </div>

      <div className="th-table-wrap">
        <div className="th-table-header">
          <span className="th-table-title">All Transactions</span>
          <input
            className="adm-search-input"
            placeholder="🔍  Search transactions..."
            value={filters.keyword}
            onChange={(e) => setFilter("keyword", e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleApply()}
          />
        </div>

        <table className="th-table">
          <thead>
            <tr>
              {["#", "Date", "Type", "Description", "Reference", "Amount"].map(
                (h) => (
                  <th key={h} className="th-th">
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          {!isLoading && (
            <tbody>
              {transactions.map((tx, index) => (
                <tr key={tx.id} className="th-tr">
                  <td className="th-td">{pageNo * pageSize + index + 1}</td>
                  <td className="th-td">
                    {FormatterHelper.formatDateToLocal(tx.createdAt)}
                  </td>
                  <td className="th-td">
                    <span className={`th-type-badge th-type-${tx.type}`}>
                      {getTypeLabel(tx.type)}
                    </span>
                  </td>
                  <td className="th-td">{tx.description}</td>
                  <td className="th-td th-reference">
                    {tx.reference || "—"}
                  </td>
                  <td
                    className={`th-td th-amount ${tx.amount >= 0 ? "th-amount-credit" : "th-amount-debit"}`}
                  >
                    {tx.amount >= 0 ? "+" : "−"}
                    {FormatterHelper.formatCurrency(Math.abs(tx.amount))}
                  </td>
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

        {!isLoading && transactions.length === 0 && (
          <div className="ph-state-row">
            <div className="ph-state-icon">⊟</div>
            <span className="ph-state-text">
              No transactions found for the selected filters
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
