import { useEffect, useState } from "react";
import { getSystemIntegrity } from "../../../../services/Dashboard/IntegrityService";
import { FormatterHelper } from "../../../../helper/FormatterHelper";
import { errorToast } from "../../../../helper/Toaster";
import "../Management/User/UserManagement.css";
import "../Management/Deposit/Deposits.css";
import "../Provider/IpReplacementLedger.css";
import "./SystemIntegrity.css";

const STATUS_LABEL = {
  Healthy: "Healthy",
  Warning: "Warning",
  Critical: "Critical",
  1: "Healthy",
  2: "Warning",
  3: "Critical",
};

function normalizeStatus(status) {
  return STATUS_LABEL[status] ?? "Healthy";
}

function statusClass(status) {
  const label = normalizeStatus(status).toLowerCase();
  if (label === "critical") return "si-status si-status--critical";
  if (label === "warning") return "si-status si-status--warning";
  return "si-status si-status--healthy";
}

function formatDifference(amount) {
  if (amount == null || amount === 0) return null;
  const prefix = amount > 0 ? "+" : "";
  return `${prefix}${FormatterHelper.formatCurrency(amount)}`;
}

function issueBadge(check) {
  if (check.issueCount > 0) {
    return `${check.issueCount} issue${check.issueCount === 1 ? "" : "s"}`;
  }
  return "All clear";
}

function CheckCard({ check, isSelected, onSelect }) {
  const diff = formatDifference(check.differenceAmount);
  const statusKey = normalizeStatus(check.status).toLowerCase();

  return (
    <button
      type="button"
      className={`si-check-card si-check-card--${statusKey} ${isSelected ? "si-check-card--selected" : ""}`}
      onClick={() => onSelect(check.id)}
    >
      <div className="si-check-card-top">
        <span className={statusClass(check.status)}>
          {normalizeStatus(check.status)}
        </span>
        <span
          className={`si-issue-badge ${check.issueCount > 0 ? "si-issue-badge--alert" : "si-issue-badge--ok"}`}
        >
          {issueBadge(check)}
        </span>
      </div>
      <div className="si-check-title">{check.title}</div>
      <span className="si-check-desc-label">What this checks</span>
      <p className="si-check-desc">{check.description}</p>
      {diff && <div className="si-check-diff">{diff}</div>}
    </button>
  );
}

function DrillDownPanel({ check }) {
  if (!check) return null;

  return (
    <div className="ph-table-panel si-drilldown">
      <div className="ph-table-header">
        <div className="si-drilldown-header-text">
          <div className="ph-table-title">{check.title}</div>
          <div className="si-drilldown-desc-label">What this checks</div>
          <p className="si-drilldown-desc">{check.description}</p>
        </div>
        <span className={statusClass(check.status)}>
          {normalizeStatus(check.status)}
          {check.issueCount > 0 && ` · ${check.issueCount} issues`}
        </span>
      </div>

      {check.issues?.length > 0 ? (
        <div className="ph-table-wrap">
          <table className="ph-table">
            <thead>
              <tr>
                {check.issueColumns.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {check.issues.map((issue, idx) => (
                <tr key={idx}>
                  {check.issueColumns.map((_, colIdx) => (
                    <td key={colIdx}>{issue[`col${colIdx}`] ?? "—"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="ph-state-row si-all-clear">
          ✓ No issues found — this check passed.
        </div>
      )}
    </div>
  );
}

function HeroSkeleton() {
  return (
    <div className="si-hero si-hero--skeleton">
      <div className="si-skeleton si-skeleton--title" />
      <div className="si-kpi-row">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="si-kpi si-skeleton" />
        ))}
      </div>
    </div>
  );
}

function CategorySkeleton() {
  return (
    <div className="si-category-panel">
      <div className="si-skeleton si-skeleton--heading" />
      <div className="si-check-grid">
        {[1, 2, 3].map((i) => (
          <div key={i} className="si-check-card si-skeleton si-check-card--skeleton" />
        ))}
      </div>
    </div>
  );
}

function HeroSummary({ data, isLoading, onRefresh }) {
  const overallStatus = data?.overallStatus ?? "Healthy";
  const statusKey = normalizeStatus(overallStatus).toLowerCase();

  return (
    <div className={`si-hero si-hero--${statusKey}`}>
      <div className="si-hero-main">
        <div className="si-hero-status-row">
          <span className={`si-status-dot si-status-dot--${statusKey}`} />
          <div>
            <div className="si-hero-label">Overall platform health</div>
            <div className={`si-hero-status si-hero-status--${statusKey}`}>
              {normalizeStatus(overallStatus)}
            </div>
          </div>
        </div>
        {data && (
          <div className="si-kpi-row">
            <div className="si-kpi">
              <span className="si-kpi-val">{data.totalChecks}</span>
              <span className="si-kpi-label">Total checks</span>
            </div>
            <div className="si-kpi si-kpi--critical">
              <span className="si-kpi-val">{data.criticalChecks}</span>
              <span className="si-kpi-label">Critical</span>
            </div>
            <div className="si-kpi si-kpi--warning">
              <span className="si-kpi-val">{data.warningChecks}</span>
              <span className="si-kpi-label">Warning</span>
            </div>
            <div className="si-kpi">
              <span className="si-kpi-val">{data.totalIssues}</span>
              <span className="si-kpi-label">Total issues</span>
            </div>
          </div>
        )}
      </div>
      <div className="si-hero-actions">
        {data?.checkedAt && (
          <span className="si-last-checked">
            Last checked: {FormatterHelper.formatDateToLocal(data.checkedAt)}
          </span>
        )}
        <button
          type="button"
          className="get-latest-btn si-refresh-btn"
          onClick={onRefresh}
          disabled={isLoading}
        >
          {isLoading ? "Checking…" : "Refresh checks"}
        </button>
      </div>
    </div>
  );
}

export default function SystemIntegrity() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCheckId, setSelectedCheckId] = useState(null);

  async function fetchIntegrity() {
    setIsLoading(true);
    try {
      const res = await getSystemIntegrity();
      if (res.isSuccess) {
        setData(res.data);
        setSelectedCheckId((prev) => {
          if (prev && res.data.checks?.some((c) => c.id === prev)) return prev;
          const firstFailing = res.data.checks?.find((c) => c.issueCount > 0);
          return firstFailing?.id ?? res.data.checks?.[0]?.id ?? null;
        });
      } else {
        errorToast(res.message);
      }
    } catch {
      errorToast("Failed to run system integrity checks.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchIntegrity();
  }, []);

  const selectedCheck = data?.checks?.find((c) => c.id === selectedCheckId) ?? null;
  const selectedCategory = selectedCheck
    ? data?.categories?.find((c) => c.checks.some((ch) => ch.id === selectedCheckId))
    : null;

  if (isLoading && !data) {
    return (
      <div className="si-page">
        <HeroSkeleton />
        <CategorySkeleton />
        <CategorySkeleton />
      </div>
    );
  }

  return (
    <div className="si-page">
      <HeroSummary data={data} isLoading={isLoading} onRefresh={fetchIntegrity} />

      {data?.categories?.map((category) => {
        const isSelectedCategory = selectedCategory?.name === category.name;

        return (
          <section key={category.name} className="si-category-panel">
            <div className="si-category-header">
              <div className="si-category-header-left">
                <h3 className="si-category-title">{category.name}</h3>
                <span className="si-category-count">
                  {category.checks.length} check{category.checks.length === 1 ? "" : "s"}
                </span>
              </div>
              <span className={statusClass(category.status)}>
                {normalizeStatus(category.status)}
              </span>
            </div>

            <div className="si-check-grid">
              {category.checks.map((check) => (
                <CheckCard
                  key={check.id}
                  check={check}
                  isSelected={selectedCheckId === check.id}
                  onSelect={setSelectedCheckId}
                />
              ))}
            </div>

            {isSelectedCategory && <DrillDownPanel check={selectedCheck} />}
          </section>
        );
      })}
    </div>
  );
}
