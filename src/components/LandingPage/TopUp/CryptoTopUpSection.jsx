//React
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

//Context
import { AuthContext } from "../../../context/AuthContext";

//Services
import {
  createCryptoInvoice,
  getCryptoPaymentStatus,
} from "../../../services/Payment/PaymentService";

//Helper
import { FormatterHelper } from "../../../helper/FormatterHelper";
import { errorToast, successTaost } from "../../../helper/Toaster";

//Css
import "./CryptoTopUp.css";
import "./TopUp.css";

import TopUpOptionHeader from "./TopUpOptionHeader";

const PRESETS = [5, 10, 25, 50];
const POLL_INTERVAL_MS = 5000;
const MAX_POLL_ATTEMPTS = 24;
const TERMINAL_STATUSES = new Set([
  "expired",
  "refunded",
  "refunding",
  "underpaid",
]);

const BENEFITS = [
  {
    icon: "fa-solid fa-bolt",
    title: "Instant balance update",
    desc: "Your wallet is credited automatically once payment confirms — start verifying right away.",
  },
  {
    icon: "fa-solid fa-shield-halved",
    title: "Secure by design",
    desc: "Encrypted checkout. We never ask for card numbers or bank details.",
  },
  {
    icon: "fa-solid fa-user-shield",
    title: "Your privacy protected",
    desc: "No extra personal information is collected for crypto top-up.",
  },
  {
    icon: "fa-solid fa-headset",
    title: "Support when you need it",
    desc: "Contact support anytime if something looks wrong or you need help.",
  },
];

function NetworkWarning() {
  return (
    <div className="crypto-network-warning">
      <div className="crypto-network-warning-header">
        <i className="fa-solid fa-triangle-exclamation" />
        <strong>Important: use the correct network</strong>
      </div>
      <p>
        When you pay, the <strong>blockchain network you select on the payment
        page must exactly match the network you send from</strong> your wallet or
        exchange (e.g. if you choose TRC20, send only via TRC20). Sending on
        the wrong network can result in <strong>lost funds</strong> that we
        cannot recover.
      </p>
      <p className="crypto-network-warning-foot">
        Double-check the coin, network, and amount before confirming the
        transfer.
      </p>
    </div>
  );
}

export default function CryptoTopUpSection() {
  const { isAuthenticated, currentUser, balanceCredit } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [customAmount, setCustomAmount] = useState("10");
  const [isLoading, setIsLoading] = useState(false);
  const [returnStatus, setReturnStatus] = useState(null);
  const [checkingReturn, setCheckingReturn] = useState(false);
  const creditedRef = useRef(false);

  const isReturn = searchParams.get("payment") === "return";
  const returnOrderId =
    searchParams.get("orderId") ?? searchParams.get("order_id") ?? "";

  const topUpReturnPath =
    isReturn && returnOrderId
      ? `/topup?payment=return&orderId=${encodeURIComponent(returnOrderId)}`
      : "/topup";

  useEffect(() => {
    if (!isReturn || !returnOrderId) return;

    document.getElementById("crypto-topup")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [isReturn, returnOrderId]);

  useEffect(() => {
    if (!isReturn || !returnOrderId || !isAuthenticated) return;

    let attempts = 0;
    let cancelled = false;
    let timeoutId;

    const pollStatus = async () => {
      if (cancelled) return;

      setCheckingReturn(true);
      try {
        const response = await getCryptoPaymentStatus({
          orderId: returnOrderId,
        });

        if (cancelled) return;

        if (response.isSuccess) {
          setReturnStatus(response.data);

          if (response.data.isCredited && !creditedRef.current) {
            creditedRef.current = true;
            successTaost(response.data.message);
            balanceCredit?.(response.data.amount);
            setCheckingReturn(false);
            return;
          }

          const status = (response.data.status ?? "").toLowerCase();
          if (TERMINAL_STATUSES.has(status)) {
            setCheckingReturn(false);
            return;
          }
        } else if (attempts === 0) {
          errorToast(response.message);
        }
      } catch {
        if (attempts === 0) {
          errorToast(
            "Could not verify payment status. Please check again shortly.",
          );
        }
      }

      attempts += 1;
      setCheckingReturn(false);

      if (attempts < MAX_POLL_ATTEMPTS && !cancelled) {
        timeoutId = setTimeout(pollStatus, POLL_INTERVAL_MS);
      }
    };

    pollStatus();

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [isReturn, returnOrderId, isAuthenticated, balanceCredit]);

  const resolvedAmount = parseFloat(customAmount);

  const handlePay = async () => {
    if (!isAuthenticated) {
      navigate(`/login?returnUrl=${encodeURIComponent("/topup")}`);
      return;
    }

    if (!resolvedAmount || resolvedAmount < 5) {
      errorToast("Minimum top-up amount is $5.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await createCryptoInvoice({ amount: resolvedAmount });
      if (!response.isSuccess) {
        errorToast(response.message);
        return;
      }

      const url = response.data?.paymentUrl;
      if (!url) {
        errorToast("Payment link was not returned. Please try again.");
        return;
      }

      window.location.href = url;
    } catch {
      errorToast("Failed to start crypto payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="crypto-topup" className="topup-option topup-option--instant">
      <TopUpOptionHeader
        optionNumber="1"
        tag="Instant"
        tagVariant="instant"
        description="Pay with crypto — balance updates automatically"
      />

      <div className="crypto-topup-section">
      <div className="topup-hero">
        <span className="topup-badge">
          <i className="fa-brands fa-bitcoin" /> Instant Crypto Top-Up
        </span>
        <h2 className="topup-title crypto-section-title">
          Fund Your Wallet <span className="topup-accent">Instantly</span>
        </h2>
        <p className="topup-subtitle crypto-hero-subtitle">
          Pay with cryptocurrency through a secure checkout. Your balance
          updates automatically after on-chain confirmation — no waiting for
          support, no manual approval.
        </p>
      </div>

      <div className="topup-features">
        {BENEFITS.map((b) => (
          <div className="topup-feature-card" key={b.title}>
            <span className="topup-feature-icon">
              <i className={b.icon} />
            </span>
            <h3>{b.title}</h3>
            <p>{b.desc}</p>
          </div>
        ))}
      </div>

      <div className="topup-card">
        <div className="topup-card-header">
          <span className="topup-card-icon">
            <i className="fa-solid fa-list-ol" />
          </span>
          <h2>How It Works</h2>
        </div>
        <ol className="topup-steps">
          <li>
            <span className="topup-step-num">01</span>
            <div>
              <strong>Log in</strong>
              <p>
                Crypto top-up credits your account balance — sign in to get
                started.
              </p>
            </div>
          </li>
          <li>
            <span className="topup-step-num">02</span>
            <div>
              <strong>Choose your amount</strong>
              <p>
                Select a preset or enter a custom amount. Minimum top-up is{" "}
                <span className="topup-highlight">$5 USD</span>.
              </p>
            </div>
          </li>
          <li>
            <span className="topup-step-num">03</span>
            <div>
              <strong>Complete crypto payment</strong>
              <p>
                You will be redirected to a secure, encrypted payment page to
                send your cryptocurrency.
              </p>
            </div>
          </li>
          <li>
            <span className="topup-step-num">04</span>
            <div>
              <strong>Balance updates automatically</strong>
              <p>
                No receipt upload, no admin queue — your wallet is credited as
                soon as payment confirms on-chain.
              </p>
            </div>
          </li>
        </ol>
      </div>

      <NetworkWarning />

      {isReturn && returnOrderId && (
        <div
          className={`crypto-return-banner topup-card ${returnStatus?.isCredited ? "success" : ""}`}
        >
          {checkingReturn ? (
            <span>Checking payment status…</span>
          ) : !isAuthenticated ? (
            <span>
              Payment return detected.{" "}
              <Link
                to={`/login?returnUrl=${encodeURIComponent(topUpReturnPath)}`}
              >
                Log in
              </Link>{" "}
              to view your payment status.
            </span>
          ) : (
            <span>
              {returnStatus?.message ??
                "Thank you — we are confirming your payment."}
            </span>
          )}
        </div>
      )}

      {!isAuthenticated && (
        <div className="crypto-login-card topup-card">
          <div className="topup-card-header">
            <span className="topup-card-icon">
              <i className="fa-solid fa-right-to-bracket" />
            </span>
            <h2>Log in to continue</h2>
          </div>
          <p>
            Crypto top-up credits your account balance. Please sign in first to
            create a payment.
          </p>
          <Link
            to={`/login?returnUrl=${encodeURIComponent("/topup")}`}
            className="crypto-primary-btn"
          >
            Log In →
          </Link>
        </div>
      )}

      {isAuthenticated && (
        <div className="topup-card crypto-amount-card">
          <div className="topup-card-header">
            <span className="topup-card-icon">
              <i className="fa-solid fa-wallet" />
            </span>
            <h2>Top Up Now</h2>
          </div>

          {currentUser && (
            <p className="crypto-balance-line">
              Current balance:{" "}
              <strong>
                {FormatterHelper.formatCurrency(currentUser.balance)}
              </strong>
            </p>
          )}

          <p className="crypto-fee-note">
            Network fees are paid by you. The payment must be fully completed to
            credit your balance.
          </p>

          <div className="crypto-presets">
            {PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                className={`crypto-preset-btn ${Number(customAmount) === p ? "active" : ""}`}
                onClick={() => setCustomAmount(String(p))}
              >
                ${p}
              </button>
            ))}
          </div>

          <label className="crypto-custom-label">Custom amount (USD)</label>
          <input
            type="number"
            min="5"
            step="0.01"
            className="crypto-custom-input"
            placeholder="Minimum $5"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
          />

          <button
            type="button"
            className="crypto-pay-btn"
            onClick={handlePay}
            disabled={isLoading}
          >
            <span className="crypto-pay-btn-icon">
              {isLoading ? (
                <span className="crypto-pay-btn-spinner" />
              ) : (
                <i className="fa-solid fa-shield-halved" />
              )}
            </span>
            <span className="crypto-pay-btn-body">
              <span className="crypto-pay-btn-title">
                {isLoading ? "Creating payment…" : "Continue to Secure Payment"}
              </span>
              <span className="crypto-pay-btn-sub">
                You will be redirected to complete your crypto transfer
              </span>
            </span>
            {!isLoading && (
              <i className="fa-solid fa-arrow-right crypto-pay-btn-arrow" />
            )}
          </button>
        </div>
      )}
      </div>
    </section>
  );
}
