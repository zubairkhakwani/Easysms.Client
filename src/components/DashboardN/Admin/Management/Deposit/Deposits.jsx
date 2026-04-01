//React
import { useEffect, useState } from "react";

//Services
import { getDeposts } from "../../../../../services/User/UserService";

//Toaster
import { errorToast } from "../../../../../helper/Toaster";

//Helper
import { FormatterHelper } from "../../../../../helper/FormatterHelper";

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
  const [deposits, setDeposits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  async function getDepositsData() {
    setIsLoading(true);
    try {
      let response = await getDeposts({
        startDate,
        endDate,
      });
      var responseMessage = response.message;
      if (!response.isSuccess) {
        errorToast(responseMessage);
      }

      setDeposits(response.data);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getDepositsData();
  }, []);

  const handleApply = async () => {
    await getDepositsData();
  };

  const handleReset = async () => {
    setStartDate(toDS(twoWeeks));
    setEndDate(toDS(today));
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

                      <td className="ph-col-id ">
                        <div>
                          <div className="um-user-name">{r.adminName}</div>
                          <div className="um-user-email">{r.adminEmail}</div>
                        </div>
                      </td>
                      <td className="ph-col-id">
                        {FormatterHelper.formatCurrency(r.amount)}
                      </td>
                      <td className="ph-col-date">
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
      </div>
    </div>
  );
}
