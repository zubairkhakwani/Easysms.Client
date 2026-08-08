//React
import { useEffect, useState, useRef } from "react";

//Services
import { getDeposts } from "../../../../../services/User/UserService";

//Hooks
import { useDebouncedValue } from "../../../../../hooks/useDebouncedValue";

//Components
import { AdminPage } from "../../../../Helper/AdminPage/AdminPage";
import { AdminFilters } from "../../../../Helper/AdminFilters/AdminFilters";
import { AdminStats } from "../../../../Helper/AdminStats/AdminStats";

//Toaster
import { errorToast } from "../../../../../helper/Toaster";

//Helper
import { FormatterHelper } from "../../../../../helper/FormatterHelper";

//Paginations
import Paginations from "../../../../Shared/Pagination";

//Css
import "./Deposits.css";
import "../User/UserManagement.css";

const DEPOSIT_TYPE_ALL = "";
const DEPOSIT_TYPE_MANUAL = "manual";
const DEPOSIT_TYPE_AUTO = "auto";

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
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebouncedValue(keyword, 350);
  const isFirstDebouncedKeyword = useRef(true);
  const [depositType, setDepositType] = useState(DEPOSIT_TYPE_ALL);

  async function getDepositsData(overrides = {}) {
    setIsLoading(true);
    try {
      let response = await getDeposts({
        startDate,
        endDate,
        pageNo: overrides.pageNo ?? pageNo,
        pageSize,
        keyword: overrides.keyword ?? debouncedKeyword,
        depositType: overrides.depositType ?? depositType,
      });
      var responseMessage = response.message;
      if (response.isSuccess && response.data) {
        const depositPage = response.data.deposits;
        setDeposits(depositPage?.items ?? []);
        setCount(depositPage?.count ?? 0);
        setSystemStats({
          totalDepositCount: response.data.totalDepositCount ?? 0,
          totalDepositAmount: response.data.totalDepositAmount ?? 0,
        });
      } else {
        errorToast(responseMessage ?? "Failed to fetch deposits");
      }
    } catch {
      errorToast("Failed to fetch deposits");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (isFirstDebouncedKeyword.current) {
      isFirstDebouncedKeyword.current = false;
      return;
    }
    setPageNo(0);
  }, [debouncedKeyword]);

  useEffect(() => {
    getDepositsData();
  }, [pageNo, pageSize, debouncedKeyword, depositType]);

  const handleDepositTypeChange = (type) => {
    setDepositType(type);
    setPageNo(0);
  };

  const handleApply = async () => {
    if (pageNo !== 0) {
      setPageNo(0);
    }
    await getDepositsData({ pageNo: 0 });
  };

  const handleReset = async () => {
    setStartDate(toDS(twoWeeks));
    setEndDate(toDS(today));
    setKeyword("");
    setDepositType(DEPOSIT_TYPE_ALL);
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
    <AdminPage>
      {/* ── Filters ── */}
      <AdminFilters
        starDateTitle="Start Date"
        endDateTitle="End Date"
        startDate={startDate}
        endDate={endDate}
        onStartDate={setStartDate}
        OnEndDate={setEndDate}
        onHandleApply={handleApply}
        onHandleReset={handleReset}
        isLoading={isLoading}
        loadingTitle="Fetching..."
      />

      {/* SYSTEM OVERVIEW */}
      <AdminStats
        title="System Overview"
        titleIcon="📊"
        subTitle="Statistics for all deposits across the system"
        stats={systemOverviewStats}
      />

      {/* CURRENT PAGE */}
      <AdminStats
        title="Current Page"
        titleIcon="📄"
        subTitle="Statistics for the deposits displayed on this page"
        stats={currentPageStats}
      />

      {/* ── Table ── */}
      <div className="ph-table-panel">
        <div className="ph-table-header deposits-table-header">
          <div className="deposits-table-header-left">
            <span className="ph-table-title">Deposit History</span>
            <div className="um-filter-bar">
              <span className="um-filter-label">Payment type</span>
              <div
                className="um-filter-group"
                role="group"
                aria-label="Deposit payment type"
              >
                <button
                  type="button"
                  className={`um-filter-chip ${depositType === DEPOSIT_TYPE_ALL ? "um-filter-chip--active" : ""}`}
                  onClick={() => handleDepositTypeChange(DEPOSIT_TYPE_ALL)}
                  aria-pressed={depositType === DEPOSIT_TYPE_ALL}
                >
                  <i className="fa-solid fa-list um-filter-chip-icon" aria-hidden />
                  <span>All</span>
                </button>
                <button
                  type="button"
                  className={`um-filter-chip ${depositType === DEPOSIT_TYPE_MANUAL ? "um-filter-chip--active" : ""}`}
                  onClick={() => handleDepositTypeChange(DEPOSIT_TYPE_MANUAL)}
                  aria-pressed={depositType === DEPOSIT_TYPE_MANUAL}
                >
                  <i className="fa-solid fa-user-shield um-filter-chip-icon" aria-hidden />
                  <span>Manual</span>
                </button>
                <button
                  type="button"
                  className={`um-filter-chip ${depositType === DEPOSIT_TYPE_AUTO ? "um-filter-chip--active" : ""}`}
                  onClick={() => handleDepositTypeChange(DEPOSIT_TYPE_AUTO)}
                  aria-pressed={depositType === DEPOSIT_TYPE_AUTO}
                >
                  <i className="fa-solid fa-bolt um-filter-chip-icon" aria-hidden />
                  <span>Auto</span>
                </button>
              </div>
            </div>
          </div>
          <input
            className="adm-search-input"
            placeholder="🔍  Search deposits..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
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
                    <th>Transaction Type</th>
                    <th>Note</th>
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
                      <td className="ph-col-id">{r.transactionType}</td>
                      <td className="ph-col-id">{r.note}</td>
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
    </AdminPage>
  );
}
