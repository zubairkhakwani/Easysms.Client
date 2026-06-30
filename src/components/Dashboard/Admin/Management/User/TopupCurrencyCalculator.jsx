import { useEffect, useRef, useState } from "react";
import { FormatterHelper } from "../../../../../helper/FormatterHelper";
import { getUsdPkrRate } from "../../../../../services/User/UserService";

const DEFAULT_RATE = 290;

function parseNum(value) {  if (value === "" || value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export function TopupCurrencyCalculator({ usdAmount, onUsdChange }) {
  const [rate, setRate] = useState(String(DEFAULT_RATE));
  const [pkr, setPkr] = useState("");
  const [usd, setUsd] = useState("");
  const [isLoadingRate, setIsLoadingRate] = useState(true);
  const [showFallbackBanner, setShowFallbackBanner] = useState(false);
  const [fallbackRate, setFallbackRate] = useState(DEFAULT_RATE);
  const skipParentSync = useRef(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setIsLoadingRate(true);
      try {
        const response = await getUsdPkrRate();
        if (cancelled) return;

        const data = response?.data;
        const fetchedRate = data?.rate ?? DEFAULT_RATE;

        setRate(String(fetchedRate));
        setFallbackRate(fetchedRate);

        if (!data?.isLive) {
          setShowFallbackBanner(true);
        }
      } catch {
        if (!cancelled) {
          setRate(String(DEFAULT_RATE));
          setFallbackRate(DEFAULT_RATE);
          setShowFallbackBanner(true);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingRate(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Sync from parent only when preset / custom amount changes (not from our own onUsdChange).
  useEffect(() => {
    if (skipParentSync.current) {
      skipParentSync.current = false;
      return;
    }

    if (usdAmount === "" || usdAmount === null || usdAmount === undefined) {
      setUsd("");
      setPkr("");
      return;
    }

    setUsd(String(usdAmount));

    const usdNum = parseNum(usdAmount);
    const rateNum = parseNum(rate);
    if (usdNum !== null && rateNum && rateNum > 0) {
      setPkr(FormatterHelper.formatDecimal(usdNum * rateNum));
    }
  }, [usdAmount, rate]);

  const pushUsdToParent = (nextUsd) => {
    skipParentSync.current = true;
    onUsdChange(nextUsd);
  };

  const handleRateChange = (nextRate) => {
    setRate(nextRate);
    const rateNum = parseNum(nextRate);
    if (!rateNum || rateNum <= 0) return;

    const pkrNum = parseNum(pkr);
    const usdNum = parseNum(usd);

    if (pkr !== "" && pkrNum !== null) {
      const computedUsd = FormatterHelper.formatDecimal(pkrNum / rateNum);
      setUsd(computedUsd);
      pushUsdToParent(computedUsd);
    } else if (usd !== "" && usdNum !== null) {
      setPkr(FormatterHelper.formatDecimal(usdNum * rateNum));
    }
  };

  const handlePkrChange = (nextPkr) => {
    setPkr(nextPkr);

    if (nextPkr === "") {
      setUsd("");
      pushUsdToParent("");
      return;
    }

    const pkrNum = parseNum(nextPkr);
    const rateNum = parseNum(rate);
    if (pkrNum === null || !rateNum || rateNum <= 0) return;

    const computedUsd = FormatterHelper.formatDecimal(pkrNum / rateNum);
    setUsd(computedUsd);
    pushUsdToParent(computedUsd);
  };

  const handleUsdChange = (nextUsd) => {
    setUsd(nextUsd);
    pushUsdToParent(nextUsd);

    const usdNum = parseNum(nextUsd);
    const rateNum = parseNum(rate);
    if (usdNum === null) {
      setPkr("");
      return;
    }

    if (rateNum && rateNum > 0) {
      setPkr(FormatterHelper.formatDecimal(usdNum * rateNum));
    }
  };

  return (
    <div
      className={`um-calc-panel ${isLoadingRate ? "um-calc-panel--loading" : ""}`}
    >
      {isLoadingRate ? (
        <>
          <div className="ph-spinner ph-spinner--sm ph-spinner--accent um-calc-rate-spinner" />
          <span className="um-calc-rate-loading-text">
            Fetching exchange rate…
          </span>
        </>
      ) : (
        <>
          {showFallbackBanner && (
            <div className="um-calc-banner">
              <span>
                Could not fetch the latest USD/PKR rate. Using default{" "}
                <strong>{fallbackRate} PKR = 1 USD</strong>. You can change the
                rate below.
              </span>
              <button
                type="button"
                className="um-calc-banner-dismiss"
                onClick={() => setShowFallbackBanner(false)}
                aria-label="Dismiss"
              >
                ✕
              </button>
            </div>
          )}

          <label className="um-label">1 USD = PKR (selling rate)</label>
          <input
            className="um-input"
            type="text"
            inputMode="decimal"
            placeholder={String(DEFAULT_RATE)}
            value={rate}
            onChange={(e) => handleRateChange(e.target.value)}
          />

          <div className="um-calc-row">
            <div className="um-calc-field">
              <label className="um-label">PKR amount</label>
              <input
                className="um-input"
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={pkr}
                onChange={(e) => handlePkrChange(e.target.value)}
              />
            </div>
            <div className="um-calc-field">
              <label className="um-label">USD amount</label>
              <input
                className="um-input"
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={usd}
                onChange={(e) => handleUsdChange(e.target.value)}
              />
            </div>
          </div>

          <p className="um-calc-hint">
            Enter PKR or USD — the other field and top-up amount update
            automatically.
          </p>
        </>
      )}
    </div>
  );
}
