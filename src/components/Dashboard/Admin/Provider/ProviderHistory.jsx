//React
import { useEffect, useState } from "react";

//Services
import { getProvidersHistory } from "../../../../services/Provider/ProviderService";
import { getProviders } from "../../../../services/Provider/ProviderService";
import { getAll } from "../../../../services/User/UserService";

//Components
import { AdminPage } from "../../../Helper/AdminPage/AdminPage";
import { AdminFilters } from "../../../Helper/AdminFilters/AdminFilters";
import { AdminStats } from "../../../Helper/AdminStats/AdminStats";

//Helper
import { FormatterHelper } from "../../../../helper/FormatterHelper";
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

function StatusBadge({ status }) {
  const known = ["Active", "Cancelled", "Completed"];
  const cls = known.includes(status) ? status : "default";
  return <span className={`ph-status ${cls}`}>{status}</span>;
}

export default function ProviderHistory() {
  //Filtering
  const [startDate, setStartDate] = useState(toDS(today));
  const [endDate, setEndDate] = useState(toDS(today));
  const [provider, setProvider] = useState("0");
  const [user, setUser] = useState(0);
  const [country, setCountry] = useState("");

  //Data
  const [providerHistory, setProviderHistory] = useState([]);
  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [systemStats, setSystemStats] = useState({
    totalNumbers: 0,
    totalActive: 0,
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
        country,
      });
      var responseMessage = response.message;
      var responseData = response.data;
      if (!response.isSuccess) {
        errorToast(responseMessage);
      }
      setProviderHistory(responseData?.history?.items ?? []);
      setCount(responseData?.history?.count ?? 0);
      setSystemStats({
        totalNumbers: responseData?.totalNumbers ?? 0,
        totalActive: responseData?.totalActive ?? 0,
        totalCompleted: responseData?.totalCompleted ?? 0,
        totalCancelled: responseData?.totalCancelled ?? 0,
      });
    } catch {
      errorToast("Failed to load activation history");
    } finally {
      setApplied({ from: startDate, to: endDate, provider, country });
      setIsLoading(false);
    }
  }
  async function getUsersData() {
    try {
      let response = await getAll({ pageNo: 0, pageSize: 0 });
      var responseData = response.data?.users.items ?? [];
      setUsers(responseData);
      if (!response.isSuccess) {
        errorToast(response.message);
      }
    } catch {
      errorToast("Failed to load users");
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
    if (pageNo !== 0) {
      setPageNo(0);
      return;
    }
    await getProviderHistoryData();
  };

  const handleReset = async () => {
    setStartDate(toDS(today));
    setEndDate(toDS(today));
    setProvider("0");
    setUser(0);
    setCountry("");
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

  const systemOverviewStats = [
    { label: "Total Numbers", val: systemStats.totalNumbers },
    { label: "Total Active", val: systemStats.totalActive },
    { label: "Total Completed", val: systemStats.totalCompleted },
    { label: "Total Cancelled", val: systemStats.totalCancelled },
  ];

  const currentPageStats = [
    {
      label: "Total Numbers",
      val: providerHistory.length,
    },

    {
      label: "Total Active",
      val: providerHistory.filter((x) => x.status.toLowerCase() === "active")
        .length,
    },

    {
      label: "Total Completed",
      val: providerHistory.filter((x) => x.status.toLowerCase() === "completed")
        .length,
    },

    {
      label: "Total Cancelled",
      val: providerHistory.filter((x) => x.status.toLowerCase() === "cancelled")
        .length,
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

      {/* SYSTEM OVERVIEW */}
      <AdminStats
        title="System Overview"
        titleIcon="📊"
        subTitle="Statistics for all activations matching the current filters"
        stats={systemOverviewStats}
      />

      {/* CURRENT PAGE */}
      <AdminStats
        title="Current Page"
        titleIcon="📄"
        subTitle="Filtered / paginated results"
        stats={currentPageStats}
      />

      {/* ── Table ── */}
      <div className="ph-table-panel">
        <div className="ph-table-header">
          <span className="ph-table-title">Provider History</span>
        </div>
        {/* Table */}
        {!isLoading && (
          <div className="ph-table-wrap">
            <table className="ph-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Id</th>
                  <th>User</th>
                  <th>Phone</th>
                  <th>Provider</th>
                  <th>Physical link</th>
                  <th>Country</th>
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
                    <td className="ph-col-phone">
                      {r.isPhysicalLink ? "Yes" : "No"}
                    </td>
                    <td className="ph-col-phone">{r.country}</td>
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
