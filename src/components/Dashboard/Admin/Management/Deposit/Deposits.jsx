//React
import { useEffect, useState } from "react";

//Services
import { getDeposts } from "../../../../../services/User/UserService";

//Toaster
import { errorToast } from "../../../../../helper/Toaster";

//Helper
import { FormatterHelper } from "../../../../../helper/FormatterHelper";

import Paginations from "../../../../Shared/Pagination";

//Css
import "./Deposits.css";

const toDS = (d) => d.toISOString().slice(0, 10);
const today = new Date();
const twoWeeks = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate() - 14,
);

export default function Deposits() {
  const [startDate, setStartDate] = useState(toDS(twoWeeks));
  const [endDate, setEndDate] = useState(toDS(today));
  const [systemStats, setSystemStats] = useState({
    totalDepositCount: 0,
    totalDepositAmount: 0,
  });
  const [deposits, setDeposits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  async function getDepositsData() {
    setIsLoading(true);
    try {
      let response = await getDeposts({
        startDate,
        endDate,
        pageNo,
        pageSize,
      });
      var responseMessage = response.message;
      if (response.isSuccess) {
        setDeposits(response.data.deposits.items ?? []);
        setCount(response.data.deposits.count);
        setSystemStats({
          totalDepositCount: response.data.totalDepositCount,
          totalDepositAmount: response.data.totalDepositAmount,
        });
      } else {
        errorToast(responseMessage);
      }
    } catch {
      errorToast("Failed to fetch deposits");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getDepositsData();
  }, [pageNo, pageSize]);

  const handleApply = async () => {
    await getDepositsData();
  };

  const handleReset = async () => {
    setStartDate(toDS(twoWeeks));
    setEndDate(toDS(today));
  };

  const handleChangePage = (event, newPage) => {
    setPageNo(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPageNo(0);
  };

  const systemOverviewStats = [
    { label: "Total Deposits", val: systemStats.totalDepositCount },

    {
      label: "Total Balance",
      val: FormatterHelper.formatCurrency(systemStats.totalDepositAmount),
    },
  ];

  const currentPageStats = [
    { label: "Total deposits on Page", val: deposits.length },

    {
      label: "Page Balance",
      val: FormatterHelper.formatCurrency(
        deposits.reduce((s, u) => s + u.amount, 0),
      ),
    },
  ];

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
      {/* SYSTEM OVERVIEW */}

      <div className="um-stats-section">
        <div className="um-section-header">
          <div className="um-section-title">📊 System Overview</div>
          <div className="um-section-sub">
            Statistics for all deposits across the system
          </div>
        </div>

        <div className="um-stats-row">
          {systemOverviewStats.map((s) => (
            <div key={s.label} className="um-stat-card system">
              <div className="um-stat-val">{s.val}</div>

              <div className="um-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CURRENT PAGE */}

      <div className="um-stats-section">
        <div className="um-section-header">
          <div className="um-section-title">📄 Current Page</div>

          <div className="um-section-sub">
            Statistics for the deposits displayed on this page
          </div>
        </div>

        <div className="um-stats-row">
          {currentPageStats.map((s) => (
            <div key={s.label} className="um-stat-card page">
              <div className="um-stat-val">{s.val}</div>

              <div className="um-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      {/* ── Table ── */}
      <div className="ph-table-panel">
        <div className="ph-table-header">
          <span className="ph-table-title">Deposit History</span>
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
                    <th>Admin</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {deposits.map((r, index) => (
                    <tr key={r.id}>
                      <td className="ph-col-id">{index + 1}</td>
                      <td className="ph-col-id">{r.id}</td>
                      <td className="um-user-cell">
                        <div>
                          <div className="um-user-name">{r.userName}</div>
                          <div className="um-user-email">{r.userEmail}</div>
                        </div>
                      </td>

                      <td className="ph-col-id">
                        <div>
                          <div className="um-user-name">{r.adminName}</div>
                          <div className="um-user-email">{r.adminEmail}</div>
                        </div>
                      </td>
                      <td className="ph-col-id">
                        {FormatterHelper.formatCurrency(r.amount)}
                      </td>
                      <td className="ph-col-date">
                        {r.depositedAt} {"|||"}
                        {FormatterHelper.formatDateToLocal(r.depositedAt)}
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
        {!isLoading && deposits.length === 0 && (
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
