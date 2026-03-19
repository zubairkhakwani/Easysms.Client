//React
import { useEffect, useState, useMemo } from "react";

//Services

import { getProvidersInfo } from "../../../../services/Provider/ProviderService";
import { getOverview } from "../../../../services/Dashboard/DashboardService";

//Components
import StatCard from "../StatCard/StatCard";

import {
  providers,
  providerStats,
  providerBalances,
  topProvidersBySales,
  topProvidersByRevenue,
  recentOtpActivity,
  formatNumber,
  formatCurrency,
} from "../../../../data/MockData";

//Css
import "./Overview.css";

const today = new Date();
const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

function toDateString(d) {
  return d.toISOString().slice(0, 10);
}
function fmtTime(d) {
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

const accentColors = [
  { bar: "#00e5ff" },
  { bar: "#7c3aed" },
  { bar: "#00ffaa" },
  { bar: "#ff9d3d" },
  { bar: "#ff5f7e" },
];

function getBalanceLevel(bal) {
  if (bal < 1000) return "low";
  if (bal < 10000) return "medium";
  return "";
}

export default function Overview() {
  const [fromDate, setFromDate] = useState(toDateString(firstOfMonth));
  const [toDate, setToDate] = useState(toDateString(today));
  const [selectedProvider, setSelectedProvider] = useState("all");
  const [appliedFilters, setAppliedFilters] = useState({
    from: toDateString(firstOfMonth),
    to: toDateString(today),
    provider: "all",
  });
  const [isFiltered, setIsFiltered] = useState(false);
  const [balances, setBalances] = useState(providerBalances);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSynced, setLastSynced] = useState(fmtTime(new Date()));

  //Providers Info

  async function getProvidersData() {
    let response = await getProvidersInfo();
    setBalances(response.info);
  }

  useEffect(() => {
    getProvidersData();
  }, []);

  const stats = useMemo(
    () => providerStats[appliedFilters.provider] || providerStats["all"],
    [appliedFilters.provider],
  );
  const providerName = useMemo(
    () =>
      providers.find((p) => p.id === appliedFilters.provider)?.name ||
      "All Providers",
    [appliedFilters.provider],
  );

  const handleApply = () => {
    setAppliedFilters({
      from: fromDate,
      to: toDate,
      provider: selectedProvider,
    });
    setIsFiltered(
      fromDate !== toDateString(firstOfMonth) ||
        toDate !== toDateString(today) ||
        selectedProvider !== "all",
    );
  };

  const handleReset = () => {
    const f = toDateString(firstOfMonth),
      t = toDateString(today);
    setFromDate(f);
    setToDate(t);
    setSelectedProvider("all");
    setAppliedFilters({ from: f, to: t, provider: "all" });
    setIsFiltered(false);
  };

  const handleGetLatest = () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setTimeout(() => {
      // Simulate fresh balance fetch — swap this setTimeout for your real API call
      setBalances((prev) =>
        prev.map((b) => {
          const delta = (Math.random() - 0.45) * ((b.Balance ?? 0) * 0.03);
          return { ...b, Balance: Math.max(0, (b.Balance ?? 0) + delta) };
        }),
      );
      setLastSynced(fmtTime(new Date()));
      setIsRefreshing(false);
    }, 1400);
  };

  const activeSales = useMemo(
    () =>
      appliedFilters.provider === "all"
        ? topProvidersBySales
        : topProvidersBySales.filter((p) => p.name === providerName),
    [appliedFilters.provider, providerName],
  );
  const activeRevenue = useMemo(
    () =>
      appliedFilters.provider === "all"
        ? topProvidersByRevenue
        : topProvidersByRevenue.filter((p) => p.name === providerName),
    [appliedFilters.provider, providerName],
  );
  const activeOtps = useMemo(
    () =>
      appliedFilters.provider === "all"
        ? recentOtpActivity
        : recentOtpActivity.filter((a) => a.provider === providerName),
    [appliedFilters.provider, providerName],
  );

  const totalBalance = balances.reduce((s, b) => s + (b.balance ?? 0), 0);
  const activeCount = balances.filter((b) => b.status === "Online").length;
  const lowBalCount = balances.filter((b) => (b.balance ?? 0) < 1000).length;

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
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              max={toDate}
            />
          </div>
          <div className="filter-field">
            <label>To Date</label>
            <input
              type="date"
              className="filter-input"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              min={fromDate}
              max={toDateString(today)}
            />
          </div>
          <div className="filter-field">
            <label>Provider</label>
            <select
              className="filter-input"
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
            >
              {providers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="filter-actions">
          <button className="filter-reset-btn" onClick={handleReset}>
            Reset
          </button>
          <button className="filter-apply-btn" onClick={handleApply}>
            ✦ Apply Filters
          </button>
        </div>
      </div>

      {isFiltered && (
        <div className="active-filters">
          {appliedFilters.provider !== "all" && (
            <span className="active-filter-tag">
              Provider: {providerName}
              <button
                className="active-filter-remove"
                onClick={() => {
                  setSelectedProvider("all");
                  setAppliedFilters((prev) => ({ ...prev, provider: "all" }));
                }}
              >
                ×
              </button>
            </span>
          )}
          <span className="active-filter-tag">
            {appliedFilters.from} → {appliedFilters.to}
          </span>
        </div>
      )}

      <div>
        <div className="section-header">
          <span className="section-header-title">Key Metrics</span>
          <span className="section-header-meta">
            {providerName} · {appliedFilters.from} to {appliedFilters.to}
          </span>
        </div>
        <div
          className="stats-grid"
          style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
        >
          <StatCard
            icon="◉"
            label="Total Sales"
            value={formatNumber(stats.totalSales)}
            trend="8.3%"
            trendUp={true}
            accent="accent-purple"
            delay={0}
            sub="vs. last period"
            subStrong="+2.1K"
          />
          <StatCard
            icon="⊛"
            label="Total Revenue"
            value={formatCurrency(stats.totalRevenue)}
            trend="5.7%"
            trendUp={true}
            accent="accent-green"
            delay={60}
            sub="most revenue"
            subStrong={stats.topRevenueProvider}
          />
          <StatCard
            icon="⊞"
            label="Top Sales Provider"
            value={stats.topSalesProvider.split(" ")[0]}
            accent="accent-orange"
            delay={120}
            sub="leads in sales"
            subStrong={formatNumber(
              topProvidersBySales.find((p) => p.name === stats.topSalesProvider)
                ?.sales || 0,
            )}
          />
          <StatCard
            icon="⊕"
            label="OTPs Delivered"
            value={formatNumber(stats.totalOtps)}
            trend="3.2%"
            trendUp={false}
            accent="accent-pink"
            delay={180}
            sub="success rate"
            subStrong="98.4%"
          />
        </div>
      </div>

      {/* ── Provider Balances — independent of filters ── */}
      <div className="balances-section">
        <div className="balances-header">
          <div className="balances-header-left">
            <div className="balances-title-row">
              <span className="balances-title">Provider Balances</span>
              <span className="balances-count-pill">
                {balances.length} Providers
              </span>
            </div>
            <span className="balances-subtitle">
              Live wallet balances · not affected by date filters
              {lastSynced && (
                <span className="last-synced"> · Synced {lastSynced}</span>
              )}
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
              <span className="balance-summary-value">{balances.length}</span>
              <span className="balance-summary-label">Total Providers</span>
            </div>
          </div>
          <div className="balance-summary-card">
            <div className="balance-summary-icon">⊛</div>
            <div className="balance-summary-info">
              <span className="balance-summary-value">
                {formatCurrency(totalBalance)}
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
          {balances.map((b, i) => (
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
