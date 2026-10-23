import { useEffect, useState } from "react";
import {
  getSystemIntegrity,
  skipIntegrityCheck,
  refundIntegrityActivation,
  completeIntegrityActivation,
} from "../../../../services/Dashboard/IntegrityService";
import { FormatterHelper } from "../../../../helper/FormatterHelper";
import { errorToast, successTaost } from "../../../../helper/Toaster";
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

function entityTypeFromCategory(category) {
  if (category === "Temp Numbers") return "number";
  if (category === "Temp Mail") return "mail";
  if (category === "Financial Core") return "user";
  return null;
}

function isActiveExpiredCheck(check) {
  return check.id === "number-active-expired" || check.id === "mail-active-expired";
}

/** System-wide drift has no per-user id in col0 — Skip only on per-user financial rows. */
function canSkipIntegrityIssue(check) {
  return check?.id !== "system-balance-drift";
}

function formatIssueCell(column, value) {
  if (!value || value === "—") return "—";
  if (column === "Purchased At" || column === "Activation End" || column === "Completed At") {
    return FormatterHelper.formatDateToLocal(value);
  }
  return value;
}

function issueHasVerificationCode(check, issue) {
  const codeColIdx = check.issueColumns?.indexOf("Verification Code") ?? -1;
  if (codeColIdx < 0) return false;
  const code = issue[`col${codeColIdx}`];
  return Boolean(code && code !== "—");
}

function DrillDownPanel({ check, actionKey, onRunAction }) {
  if (!check) return null;

  const entityType = entityTypeFromCategory(check.category);
  const showActions = Boolean(entityType) && canSkipIntegrityIssue(check);
  const showResolveActions = isActiveExpiredCheck(check);
  const columns = showActions ? [...(check.issueColumns ?? []), "Actions"] : check.issueColumns ?? [];

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
                {columns.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {check.issues.map((issue, idx) => {
                const id = Number(issue.col0);
                const busy = actionKey?.startsWith(`${entityType}-${id}-`);
                const hasCode = showResolveActions && issueHasVerificationCode(check, issue);

                return (
                  <tr key={idx}>
                    {(check.issueColumns ?? []).map((col, colIdx) => (
                      <td key={col}>{formatIssueCell(col, issue[`col${colIdx}`])}</td>
                    ))}
                    {showActions && (
                      <td>
                        <div className="si-row-actions">
                          <button
                            type="button"
                            className="si-action-btn"
                            disabled={busy}
                            onClick={() =>
                              onRunAction({
                                action: "skip",
                                entityType,
                                id,
                                confirmText:
                                  "Skip this item in future integrity checks?",
                              })
                            }
                          >
                            {actionKey === `${entityType}-${id}-skip` ? "Skipping…" : "Skip"}
                          </button>
                          {showResolveActions && (
                            <>
                              {!hasCode && (
                                <button
                                  type="button"
                                  className="si-action-btn si-action-btn--refund"
                                  disabled={busy}
                                  onClick={() =>
                                    onRunAction({
                                      action: "refund",
                                      entityType,
                                      id,
                                      confirmText:
                                        "Cancel this activation, credit the user, and write a refund wallet entry? No provider will be contacted.",
                                    })
                                  }
                                >
                                  {actionKey === `${entityType}-${id}-refund` ? "Refunding…" : "Refund"}
                                </button>
                              )}
                              {hasCode && (
                                <button
                                  type="button"
                                  className="si-action-btn si-action-btn--complete"
                                  disabled={busy}
                                  onClick={() =>
                                    onRunAction({
                                      action: "complete",
                                      entityType,
                                      id,
                                      confirmText:
                                        "Mark this activation as completed? No provider will be contacted.",
                                    })
                                  }
                                >
                                  {actionKey === `${entityType}-${id}-complete` ? "Completing…" : "Complete"}
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
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
  const [actionKey, setActionKey] = useState(null);

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

  async function handleRunAction({ action, entityType, id, confirmText }) {
    if (!window.confirm(confirmText)) return;

    const key = `${entityType}-${id}-${action}`;
    setActionKey(key);

    try {
      const api =
        action === "skip"
          ? skipIntegrityCheck
          : action === "refund"
            ? refundIntegrityActivation
            : completeIntegrityActivation;

      const res = await api(entityType, id);
      if (res.isSuccess) {
        successTaost(res.message);
        await fetchIntegrity();
      } else {
        errorToast(res.message);
      }
    } catch {
      errorToast("Failed to apply the integrity action.");
    } finally {
      setActionKey(null);
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

            {isSelectedCategory && (
              <DrillDownPanel
                check={selectedCheck}
                actionKey={actionKey}
                onRunAction={handleRunAction}
              />
            )}
          </section>
        );
      })}
    </div>
  );
}
