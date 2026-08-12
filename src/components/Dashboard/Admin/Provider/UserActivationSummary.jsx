//React
import { useEffect, useState } from "react";

//Services
import {
  getUserActivationSummary,
  getProviders,
} from "../../../../services/Provider/ProviderService";
import { getAll } from "../../../../services/User/UserService";

//Components
import { AdminPage } from "../../../Helper/AdminPage/AdminPage";
import { AdminStats } from "../../../Helper/AdminStats/AdminStats";

//Helper
import { getAdminProviderLabel } from "../../../../helper/UtilityHelper";
import { errorToast } from "../../../../helper/Toaster";

//Paginations
import Paginations from "../../../Shared/Pagination";
import SearchableSelect from "../../../Shared/SearchableSelect/SearchableSelect";

//Css
import "./ProviderHistory.css";
import "./ActiveNumbers.css";

const toDS = (d) => d.toISOString().slice(0, 10);
const today = new Date();

export default function UserActivationSummary() {
  //Filtering
  const [startDate, setStartDate] = useState(toDS(today));
  const [endDate, setEndDate] = useState(toDS(today));
  const [provider, setProvider] = useState("0");
  const [user, setUser] = useState(0);
  const [country, setCountry] = useState("");

  //Data
  const [summaryRows, setSummaryRows] = useState([]);
  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [systemStats, setSystemStats] = useState({
    totalPurchased: 0,
    totalCompleted: 0,
    totalCancelled: 0,
  });

  //Loading
  const [applied, setApplied] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  //Pagination
  const [count, setCount] = useState(0);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  //Sorting
  const [sortBy, setSortBy] = useState("Purchased");
  const [sortDir, setSortDir] = useState("Desc");

  async function getSummaryData() {
    setIsLoading(true);
    try {
      const response = await getUserActivationSummary({
        pageNo,
        pageSize,
        startDate,
        endDate,
        provider,
        user,
        country,
        sortBy,
        sortDir,
      });
      const responseData = response.data;
      if (!response.isSuccess) {
        errorToast(response.message);
      }
      setSummaryRows(responseData?.summary?.items ?? []);
      setCount(responseData?.summary?.count ?? 0);
      setSystemStats({
        totalPurchased: responseData?.totalPurchased ?? 0,
        totalCompleted: responseData?.totalCompleted ?? 0,
        totalCancelled: responseData?.totalCancelled ?? 0,
      });
    } catch {
      errorToast("Failed to load user activation summary");
    } finally {
      setApplied({ from: startDate, to: endDate, provider, country });
      setIsLoading(false);
    }
  }

  async function getUsersData() {
    try {
      const response = await getAll({ pageNo: 0, pageSize: 0 });
      setUsers(response.data?.users.items ?? []);
      if (!response.isSuccess) {
        errorToast(response.message);
      }
    } catch {
      errorToast("Failed to load users");
    }
  }

  async function getProvidersData() {
    const response = await getProviders();
    setProviders(response);
  }

  useEffect(() => {
    getSummaryData();
  }, [pageNo, pageSize, sortBy, sortDir]);

  useEffect(() => {
    getUsersData();
  }, []);

  useEffect(() => {
    getProvidersData();
  }, []);

  const handleApply = async () => {
    if (pageNo !== 0) {
      setPageNo(0);
      return;
    }
    await getSummaryData();
  };

  const handleReset = async () => {
    setStartDate(toDS(today));
    setEndDate(toDS(today));
    setProvider("0");
    setUser(0);
    setCountry("");
    setSortBy("Purchased");
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
      <span className="ph-sort-arrow" aria-hidden="true">
        {sortDir === "Asc" ? "↑" : "↓"}
      </span>
    );
  };

  const systemOverviewStats = [
    { label: "Total Purchased", val: systemStats.totalPurchased },
    { label: "Total Completed", val: systemStats.totalCompleted },
    { label: "Total Cancelled", val: systemStats.totalCancelled },
  ];

  const currentPageStats = [
    { label: "Groups on page", val: summaryRows.length },
    {
      label: "Purchased (page)",
      val: summaryRows.reduce((sum, r) => sum + r.totalPurchased, 0),
    },
    {
      label: "Completed (page)",
      val: summaryRows.reduce((sum, r) => sum + r.totalCompleted, 0),
    },
    {
      label: "Cancelled (page)",
      val: summaryRows.reduce((sum, r) => sum + r.totalCancelled, 0),
    },
  ];

  return (
    <AdminPage>
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
          <SearchableSelect
            className="ph-filter-input"
            value={provider}
            onChange={setProvider}
            options={[
              { value: "0", label: "All" },
              ...providers.map((p) => ({
                value: p.id,
                label: getAdminProviderLabel(p),
              })),
            ]}
          />
        </div>

        <div className="ph-filter-field ph-filter-field--wide">
          <label className="ph-filter-label">User</label>
          <SearchableSelect
            className="ph-filter-input"
            wrapClassName="ph-filter-select-wide"
            panelFitContent
            panelMinWidth={240}
            value={user}
            onChange={setUser}
            searchPlaceholder="Search name or email…"
            options={[
              { value: 0, label: "All" },
              ...users.map((p) => ({
                value: p.id,
                label: p.name,
                sublabel: p.email ?? "",
              })),
            ]}
          />
        </div>

        <div className="ph-filter-field">
          <label className="ph-filter-label">Country</label>
          <input
            type="text"
            className="ph-filter-input"
            placeholder="e.g. United Kingdom"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
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

      <AdminStats
        title="System Overview"
        titleIcon="📊"
        subTitle="Totals for all activations matching the current filters"
        stats={systemOverviewStats}
      />

      <AdminStats
        title="Current Page"
        titleIcon="📄"
        subTitle="Aggregated groups on this page"
        stats={currentPageStats}
      />

      <div className="ph-table-panel">
        <div className="ph-table-header">
          <span className="ph-table-title">User Activation Summary</span>
        </div>

        {!isLoading && (
          <div className="ph-table-wrap">
            <table className="ph-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>Country</th>
                  <th>Provider</th>
                  <th>
                    <button
                      type="button"
                      className={`ph-sort-th${sortBy === "Purchased" ? " ph-sort-th--active" : ""}`}
                      onClick={() => handleSort("Purchased")}
                    >
                      Total Purchased{sortIndicator("Purchased")}
                    </button>
                  </th>
                  <th>Completed</th>
                  <th>Cancelled</th>
                  <th>
                    <button
                      type="button"
                      className={`ph-sort-th${sortBy === "SuccessRate" ? " ph-sort-th--active" : ""}`}
                      onClick={() => handleSort("SuccessRate")}
                    >
                      Success %{sortIndicator("SuccessRate")}
                    </button>
                  </th>
                  <th>
                    <button
                      type="button"
                      className={`ph-sort-th${sortBy === "FailureRate" ? " ph-sort-th--active" : ""}`}
                      onClick={() => handleSort("FailureRate")}
                    >
                      Failure %{sortIndicator("FailureRate")}
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {summaryRows.map((r, index) => (
                  <tr key={`${r.userId}-${r.countryId}-${r.providerName}-${index}`}>
                    <td className="ph-col-id">{pageNo * pageSize + index + 1}</td>
                    <td className="um-user-cell">
                      <div>
                        <div className="um-user-name">{r.userName}</div>
                        <div className="um-user-email">{r.email}</div>
                      </div>
                    </td>
                    <td className="ph-col-phone">{r.countryName}</td>
                    <td className="ph-col-phone">{r.providerName}</td>
                    <td className="ph-col-cost">{r.totalPurchased}</td>
                    <td className="ph-col-cost">{r.totalCompleted}</td>
                    <td className="ph-col-cost">{r.totalCancelled}</td>
                    <td
                      className="ph-col-cost"
                      style={{ color: "var(--text-success)" }}
                    >
                      {r.successRate}%
                    </td>
                    <td
                      className="ph-col-cost"
                      style={{ color: "var(--text-warning)" }}
                    >
                      {r.failureRate}%
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

        {!isLoading && applied && summaryRows.length === 0 && (
          <div className="ph-state-row">
            <div className="ph-state-icon">⊟</div>
            <span className="ph-state-text">
              No records found for the selected filters
            </span>
          </div>
        )}

        {!isLoading && applied && (
          <Paginations
            page={pageNo}
            rowsPerPage={pageSize}
            count={count}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
          />
        )}
      </div>
    </AdminPage>
  );
}
