import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";
import {
  getMyReferralSummary,
  transferCommissionToBalance,
} from "../../services/Referral/ReferralCommissionService";
import { AdminConst } from "../../data/Static";
import { FormatterHelper } from "../../helper/FormatterHelper";
import { errorToast, successTaost } from "../../helper/Toaster";
import Tooltip from "../../portal/Tooltip";

import Header from "../Helper/Header/Header";

import "./ReferralStats.css";

const STAT_ITEMS = [
  {
    key: "referralCount",
    label: "Referrals",
    icon: "fa-solid fa-user-group",
    accent: "cyan",
    format: (v) => v.toLocaleString(),
    tooltip: "How many people signed up on EasyOtps using your referral link.",
  },
  {
    key: "totalCommissionEarned",
    label: "Total earned",
    icon: "fa-solid fa-coins",
    accent: "green",
    format: (v) => FormatterHelper.formatCurrency(v),
    tooltip:
      "Everything you have earned from referrals so far — added to your commission balance when they make purchases.",
  },
  {
    key: "minWithdrawalAmount",
    label: "Minimum withdrawal",
    icon: "fa-solid fa-hand-holding-dollar",
    accent: "muted",
    format: (v) => FormatterHelper.formatCurrency(v),
    tooltip: null,
  },
];

const POTENTIAL_EARNINGS = {
  min: {
    label: "Min potential",
    icon: "fa-solid fa-chart-line",
    accent: "purple",
    tooltip:
      "A conservative estimate of how much more you could earn if your referrals spend the balance they still have.",
  },
  max: {
    label: "Max potential",
    icon: "fa-solid fa-arrow-trend-up",
    accent: "orange",
    tooltip:
      "The best-case estimate of how much more you could earn if your referrals spend the balance they still have.",
  },
};

function getStatTooltip(item, summary) {
  if (item.key === "minWithdrawalAmount" && summary) {
    return `You need at least ${FormatterHelper.formatCurrency(summary.minWithdrawalAmount)} in your commission balance before you can transfer to your main balance or request a payout.`;
  }
  return item.tooltip ?? "";
}

function PotentialEarningsCard({ summary }) {
  return (
    <article className="rs-stat rs-stat--potential">
      <div className="rs-stat-top">
        <span className="rs-potential-card-title">Potential earnings</span>
      </div>
      <div className="rs-potential-rows">
        {(
          [
            ["minPotentialEarnings", POTENTIAL_EARNINGS.min],
            ["maxPotentialEarnings", POTENTIAL_EARNINGS.max],
          ]
        ).map(([summaryKey, item]) => (
          <div key={summaryKey} className="rs-potential-row">
            <div className="rs-potential-row-head">
              <div className={`rs-stat-icon rs-stat-icon--${item.accent}`}>
                <i className={item.icon} />
              </div>
              <StatLabel label={item.label} tooltip={item.tooltip} />
            </div>
            <p className="rs-potential-value">
              {FormatterHelper.formatCurrency(summary[summaryKey] ?? 0)}
            </p>
          </div>
        ))}
      </div>
    </article>
  );
}

function StatLabel({ label, tooltip }) {
  return (
    <div className="rs-stat-label-row">
      <span>{label}</span>
      <Tooltip tooltip={tooltip} />
    </div>
  );
}

export default function ReferralStats() {
  const { currentUser, balanceCredit } = useContext(AuthContext);
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransferring, setIsTransferring] = useState(false);

  const withdrawMsg = encodeURIComponent(
    `Hello, I would like to request a commission withdrawal from my EasyOtps referral earnings. My account email is ${currentUser?.email ?? ""}. Please let me know the next steps. Thank you.`,
  );

  async function loadSummary() {
    setIsLoading(true);
    try {
      const response = await getMyReferralSummary();
      if (response.isSuccess) {
        setSummary(response.data);
      } else {
        errorToast(response.message || "Failed to load referral stats.");
      }
    } catch {
      errorToast("Failed to load referral stats.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (currentUser) {
      loadSummary();
    }
  }, [currentUser]);

  const withdrawRemaining = useMemo(() => {
    if (!summary) return 0;
    return Math.max(0, summary.minWithdrawalAmount - summary.commissionBalance);
  }, [summary]);

  async function handleTransfer() {
    setIsTransferring(true);
    try {
      const response = await transferCommissionToBalance();
      if (response.isSuccess) {
        successTaost(response.message);
        balanceCredit(response.data.transferredAmount);
        await loadSummary();
      } else {
        errorToast(response.message);
      }
    } catch {
      errorToast("Failed to transfer commission balance.");
    } finally {
      setIsTransferring(false);
    }
  }

  return (
    <div className="rs-page">
      <Header
        title="Referral Stats"
        description="Track your referrals, earnings, and commission balance."
      />

      <div className="rs-content">
        {isLoading ? (
          <div className="rs-loading card-surface">
            <div className="ph-spinner ph-spinner--sm" />
            <span>Loading your referral stats…</span>
          </div>
        ) : summary ? (
          <>
            <section className="rs-dashboard">
              <div
                className="rs-dashboard-glow rs-dashboard-glow--cyan"
                aria-hidden="true"
              />
              <div
                className="rs-dashboard-glow rs-dashboard-glow--green"
                aria-hidden="true"
              />

              <div className="rs-dashboard-inner">
                <div className="rs-dashboard-top">
                  <span className="rs-dashboard-badge">
                    <i className="fa-solid fa-chart-pie" />
                    Referral dashboard
                  </span>
                  <div className="rs-dashboard-actions">
                    <Link to="/earn-with-us" className="rs-btn rs-btn--ghost">
                      <i className="fa-solid fa-link" />
                      Share link
                    </Link>
                    {summary.canTransferOrWithdraw ? (
                      <>
                        <button
                          type="button"
                          className="rs-btn rs-btn--primary"
                          disabled={isTransferring}
                          onClick={handleTransfer}
                        >
                          <i className="fa-solid fa-right-left" />
                          {isTransferring
                            ? "Transferring…"
                            : "Transfer to balance"}
                        </button>
                        <a
                          href={`https://wa.me/${AdminConst.phoneNumber}?text=${withdrawMsg}`}
                          className="rs-btn rs-btn--whatsapp"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <i className="fa-brands fa-whatsapp" />
                          Withdraw
                        </a>
                      </>
                    ) : (
                      <>
                        <span
                          className="rs-btn rs-btn--disabled"
                          title={`Available at ${FormatterHelper.formatCurrency(summary.minWithdrawalAmount)}`}
                        >
                          <i className="fa-solid fa-right-left" />
                          Transfer to balance
                        </span>
                        <span
                          className="rs-btn rs-btn--disabled"
                          title={`Available at ${FormatterHelper.formatCurrency(summary.minWithdrawalAmount)}`}
                        >
                          <i className="fa-brands fa-whatsapp" />
                          Withdraw
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="rs-dashboard-balance-block">
                  <div className="rs-dashboard-balance-label">
                    <span>Commission balance</span>
                    <Tooltip tooltip="Money you have earned from referrals. Transfer it to your main balance to spend on services, or request a payout once you reach the minimum." />
                  </div>
                  <p className="rs-dashboard-balance">
                    {FormatterHelper.formatCurrency(summary.commissionBalance)}
                  </p>
                </div>

                <div className="rs-dashboard-pills">
                  <div className="rs-pill">
                    <i className="fa-solid fa-user-group" />
                    <div>
                      <span className="rs-pill-val">
                        {summary.referralCount}
                      </span>
                      <div className="rs-pill-label-row">
                        <span className="rs-pill-lbl">Referrals</span>
                        <Tooltip tooltip="People who joined EasyOtps through your referral link." />
                      </div>
                    </div>
                  </div>
                  <div className="rs-pill">
                    <i className="fa-solid fa-coins" />
                    <div>
                      <span className="rs-pill-val">
                        {FormatterHelper.formatCurrency(
                          summary.totalCommissionEarned,
                        )}
                      </span>
                      <div className="rs-pill-label-row">
                        <span className="rs-pill-lbl">Total earned</span>
                        <Tooltip tooltip="All commission you have earned from referrals, counted from day one." />
                      </div>
                    </div>
                  </div>
                </div>

                {!summary.canTransferOrWithdraw && (
                  <div className="rs-dashboard-notice">
                    <div className="rs-dashboard-notice-icon">
                      <i className="fa-solid fa-wallet" />
                    </div>
                    <div className="rs-dashboard-notice-text">
                      <strong>
                        {FormatterHelper.formatCurrency(withdrawRemaining)} away
                        from transfer / withdrawal
                      </strong>
                      <span>
                        Minimum is{" "}
                        {FormatterHelper.formatCurrency(
                          summary.minWithdrawalAmount,
                        )}
                        . Keep referring users and earning commission to unlock
                        transfer and WhatsApp payout.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </section>

            <div className="rs-section-head">
              <h2>Detailed breakdown</h2>
              <p>Hover the info icons to learn what each metric means.</p>
            </div>

            <section className="rs-grid">
              <PotentialEarningsCard summary={summary} />
              {STAT_ITEMS.map((item) => (
                <article
                  key={item.key}
                  className={`rs-stat rs-stat--${item.accent}`}
                >
                  <div className="rs-stat-top">
                    <div
                      className={`rs-stat-icon rs-stat-icon--${item.accent}`}
                    >
                      <i className={item.icon} />
                    </div>
                    <StatLabel
                      label={item.label}
                      tooltip={getStatTooltip(item, summary)}
                    />
                  </div>
                  <p className="rs-stat-value">
                    {item.format(summary[item.key] ?? 0)}
                  </p>
                </article>
              ))}
            </section>
          </>
        ) : (
          <div className="rs-empty card-surface">
            <i className="fa-solid fa-chart-pie" />
            <p>
              We could not load your referral stats. Please try again later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
