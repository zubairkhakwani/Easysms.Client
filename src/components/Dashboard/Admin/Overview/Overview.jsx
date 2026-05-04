//React
import { useEffect, useState } from "react";

//Services
import { getProvidersInfo } from "../../../../services/Provider/ProviderService";
import { getDasboardOverview } from "../../../../services/Dashboard/DashboardService";

//Helper
import { FormatterHelper } from "../../../../helper/FormatterHelper";

//Toaster
import { errorToast } from "../../../../helper/Toaster";

//Components
import StatCard from "../StatCard/StatCard";

//Css
import "./Overview.css";

function toDateString(d) {
  return d.toISOString().slice(0, 10);
}

function getBalanceLevel(bal) {
  if (bal < 1000) return "low";
  if (bal < 10000) return "medium";
  return "";
}

const toDS = (d) => d.toISOString().slice(0, 10);
const today = new Date();
const twoWeeks = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate() - 14,
);

export default function Overview() {
  //Providers overview
  const [overview, setOverView] = useState([]);

  //Provider Balances
  const [balances, setBalances] = useState([]);

  //Loading
  const [isOverviewLoading, setIsOverviewLoading] = useState(false);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);

  //Filters
  const [startDate, setStartDate] = useState(toDS(twoWeeks));
  const [endDate, setEndDate] = useState(toDS(today));

  const [isRefreshing, setIsRefreshing] = useState(false);

  //Providers Info
  async function getProvidersData() {
    let response = await getProvidersInfo();
    if (response?.isSuccess) {
      setBalances(response.data.info);
    }
  }

  async function getDashboardOverviewData() {
    setIsOverviewLoading(true);
    try {
      let response = await getDasboardOverview({ startDate, endDate });
      if (response.isSuccess) {
        setOverView(response.data);
      } else {
        errorToast(response.message);
      }
    } catch {
      errorToast("Failed to load dasboard overview");
    } finally {
      setIsOverviewLoading(false);
    }
  }

  useEffect(() => {
    getProvidersData();
  }, []);

  useEffect(() => {
    getDashboardOverviewData();
  }, []);

  const handleApply = () => {
    getDashboardOverviewData();
  };

  const handleReset = () => {
    setStartDate(toDS(twoWeeks));
    setEndDate(toDS(today));
  };

  const handleGetLatest = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    await getProvidersData();
    setIsRefreshing(false);
  };

  const totalBalance = balances?.reduce((s, b) => s + (b.balance ?? 0), 0);
  const activeCount = balances?.filter((b) => b.status === "Online").length;
  const lowBalCount = balances?.filter((b) => (b.balance ?? 0) < 10).length;

  return (
    <div className="overview-page">
      <div className="filters-bar">
        <span className="filters-label">🔍 Filters</span>
        <div className="filter-divider" />
        <div className="filters-group">
          <div className="filter-field">
            <label>From Date</label>
            <input
              type="date"
              className="filter-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={endDate}
            />
          </div>
          <div className="filter-field">
            <label>To Date</label>
            <input
              type="date"
              className="filter-input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
              max={toDateString(today)}
            />
          </div>
        </div>
        <div className="filter-actions">
          <button className="filter-reset-btn" onClick={handleReset}>
            Reset
          </button>
          <button
            className="ph-apply-btn"
            onClick={handleApply}
            disabled={isOverviewLoading}
          >
            {isOverviewLoading ? (
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

      <div>
        <div className="section-header">
          <span className="section-header-title">Overall Breakdown</span>
        </div>
        <div
          className={`stats-grid${isRefreshing ? " refreshing" : ""}`}
          style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
        >
          <StatCard
            label="Total Revenue"
            value={FormatterHelper.formatCurrency(overview?.totalRevenue ?? 0)}
            accent="accent-purple"
          />
          <StatCard
            label="Total Cost"
            value={FormatterHelper.formatCurrency(overview?.totalCost ?? 0)}
            accent="accent-purple"
          />
          <StatCard
            label="Total Profit"
            value={FormatterHelper.formatCurrency(
              overview?.totalRevenue
                ? overview.totalRevenue - overview?.totalCost
                : 0,
            )}
            trendUp={true}
            accent="accent-purple"
          />
        </div>
      </div>
      {overview?.providersOverview?.map((o, i) => (
        <div key={i + 1}>
          <div className="section-header">
            <span className="section-header-title">
              {" "}
              {o.provider} Breakdown
            </span>
          </div>
          <div
            className="stats-grid"
            style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
          >
            <StatCard
              label="Total Revenue"
              value={FormatterHelper.formatCurrency(o.overview.totalRevenue)}
              trendUp={o.overview.totalRevenue > o.overview.totalCost}
              accent="accent-purple"
            />
            <StatCard
              label="Total Cost"
              value={FormatterHelper.formatCurrency(o.overview.totalCost)}
              trendUp={o.overview.totalRevenue < o.overview.totalCost}
              accent="accent-purple"
            />
            <StatCard
              label="Total Profit"
              value={FormatterHelper.formatCurrency(
                o.overview.totalRevenue - o.overview.totalCost,
              )}
              accent="accent-purple"
            />
          </div>
        </div>
      ))}

      {/* ── Provider Balances — independent of filters ── */}
      <div className="balances-section">
        <div className="balances-header">
          <div className="balances-header-left">
            <div className="balances-title-row">
              <span className="balances-title">Provider Balances</span>
              <span className="balances-count-pill">
                {balances?.length} Providers
              </span>
            </div>
            <span className="balances-subtitle">
              Live wallet balances · not affected by date filters
              {/* {lastSynced && (
                <span className="last-synced"> · Synced {lastSynced}</span>
              )} */}
            </span>
          </div>
          <button
            className={`get-latest-btn${isRefreshing ? " loading" : ""}`}
            onClick={handleGetLatest}
          >
            <span className="get-latest-icon">↻</span>
            {isRefreshing ? "Fetching…" : "Get Latest"}
          </button>
        </div>

        <div className="balances-summary">
          <div className="balance-summary-card">
            <div className="balance-summary-icon">◈</div>
            <div className="balance-summary-info">
              <span className="balance-summary-value">{balances?.length}</span>
              <span className="balance-summary-label">Total Providers</span>
            </div>
          </div>
          <div className="balance-summary-card">
            <div className="balance-summary-icon">⊛</div>
            <div className="balance-summary-info">
              <span className="balance-summary-value">
                {FormatterHelper.formatCurrency(totalBalance)}
              </span>
              <span className="balance-summary-label">Combined Balance</span>
            </div>
          </div>
          <div className="balance-summary-card">
            <div className="balance-summary-icon">◉</div>
            <div className="balance-summary-info">
              <span className="balance-summary-value">
                {activeCount} active
                {lowBalCount > 0 && (
                  <span
                    style={{
                      color: "var(--error)",
                      marginLeft: 8,
                      fontSize: "0.75rem",
                    }}
                  >
                    · {lowBalCount} low
                  </span>
                )}
              </span>
              <span className="balance-summary-label">Provider Status</span>
            </div>
          </div>
        </div>

        <div className="balances-grid">
          {balances?.map((b, i) => (
            <div
              key={i}
              className={`balance-card${isRefreshing ? " refreshing" : ""}`}
              style={{ animationDelay: `${i * 55}ms` }}
            >
              <div className="balance-card-shimmer" />

              {/* Top row: avatar + Active badge */}
              <div className="balance-card-top">
                <div
                  className="balance-provider-avatar-img"
                  style={{ borderColor: b.color + "44" }}
                >
                  <img
                    src={b.avatar}
                    alt={b.name}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div
                    className="balance-provider-avatar-fallback"
                    style={{ background: b.color + "22", color: b.color }}
                  >
                    {b.name?.slice(0, 2).toUpperCase()}
                  </div>
                </div>
                <span className={`balance-status-dot ${b.status}`}>
                  {b.status}
                </span>
              </div>

              {/* Body: name, message, balance */}
              <div className="balance-card-body">
                <p className="balance-provider-name">{b.name}</p>
                <p className="balance-message">{b.message}</p>
                <p className={`balance-amount ${getBalanceLevel(b.balance)}`}>
                  {b.balance}
                </p>
              </div>

              {/* Footer: ID tag */}
              <div className="balance-footer">
                <span className="balance-id-tag">ID #{b.id}</span>
                <span
                  className={`balance-level-tag ${getBalanceLevel(b.balance) || "normal"}`}
                >
                  {b.balance < 1000
                    ? "Low"
                    : b.balance < 10000
                      ? "Medium"
                      : "Healthy"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
