//React
import { useState, useMemo, useEffect } from "react";

//Serives
import { addPhysical } from "../../../../../services/Number/NumberService";
import { getPhysicalCountries } from "../../../../../services/Provider/ProviderService";

//Components
import { PhysicalNumbers } from "./PhysicalNumbers";

//Toaster
import { errorToast } from "../../../../../helper/Toaster";

//Helper
import { FormatterHelper } from "../../../../../helper/FormatterHelper";

//Static
import { PhysicalNumberStatus } from "../../../../../data/Static";

//Pagination
import Paginations from "../../../../Shared/Pagination";
import SearchableSelect from "../../../../Shared/SearchableSelect/SearchableSelect";
import FormErrorMessage from "../../../../Shared/FormErrorMessage/FormErrorMessage";

//Css
import "./AddPhysicalNumber.css";

function isValidNationalNumber(number, nationalNumberLength) {
  if (!number || number.includes("+")) return false;
  if (!/^\d+$/.test(number)) return false;
  if (!nationalNumberLength) return false;
  return number.length === nationalNumberLength;
}

function parseLine(line, selectedCountry) {
  const trimmed = line.trim();
  if (!trimmed) return null;
  const pipeIdx = trimmed.indexOf("|");
  if (pipeIdx === -1) return { raw: trimmed, valid: false };
  const number = trimmed.slice(0, pipeIdx).trim();
  const url = trimmed.slice(pipeIdx + 1).trim();
  const valid =
    isValidNationalNumber(number, selectedCountry?.nationalNumberLength) &&
    /^https?:\/\/.+/.test(url);
  return { raw: trimmed, number, url, valid };
}

/* ── Result Modal ── */
function ResultModal({ result, onClose }) {
  const total = result.added + result.skipped + result.errors.length;
  const allGood = result.skipped === 0 && result.errors.length === 0;

  return (
    <div className="rmodal-overlay" onClick={onClose}>
      <div className="rmodal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={`rmodal-header ${allGood ? "success" : "partial"}`}>
          <div className="rmodal-header-icon">{allGood ? "✓" : "⚠"}</div>
          <div>
            <p className="rmodal-title">
              {allGood ? "All Numbers Added" : "Submission Complete"}
            </p>
            <p className="rmodal-sub">
              {total} {total === 1 ? "entry" : "entries"} processed
            </p>
          </div>
          <button className="rmodal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Stat row */}
        <div className="rmodal-stats">
          <div className="rmodal-stat added">
            <span className="rmodal-stat-val">{result.added}</span>
            <span className="rmodal-stat-label">Added</span>
          </div>
          <div className="rmodal-stat-divider" />
          <div className="rmodal-stat skipped">
            <span className="rmodal-stat-val">{result.skipped}</span>
            <span className="rmodal-stat-label">Skipped (duplicate)</span>
          </div>
          <div className="rmodal-stat-divider" />
          <div className="rmodal-stat errored">
            <span className="rmodal-stat-val">{result.errors.length}</span>
            <span className="rmodal-stat-label">Errors</span>
          </div>
        </div>

        {/* Skipped numbers list */}
        {result.skippedNumbers?.length > 0 && (
          <div className="rmodal-section">
            <p className="rmodal-section-label">⊙ Already exist in database</p>
            <div className="rmodal-list">
              {result.skippedNumbers.map((n) => (
                <div key={n} className="rmodal-list-item skipped-item">
                  <span className="rmodal-dot skipped-dot" />
                  <span className="rmodal-item-text">{n}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Errors list */}
        {result.errors?.length > 0 && (
          <div className="rmodal-section">
            <p className="rmodal-section-label">
              ✕ Invalid lines (not submitted)
            </p>
            <div className="rmodal-list">
              {result.errors.map((e, i) => (
                <div key={i} className="rmodal-list-item error-item">
                  <span className="rmodal-dot error-dot" />
                  <span className="rmodal-item-text">{e}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button className="rmodal-done-btn" onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  );
}

function toDateString(date) {
  return date.toLocaleDateString("en-CA");
}

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const minExpiryDateString = toDateString(tomorrow);

/* ── Main Page ── */
export default function AddPhysicalNumber() {
  const [text, setText] = useState("");
  const [price, setPrice] = useState(0);
  const [countryId, setCountryId] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [countryOptions, setCountryOptions] = useState([]);
  const [countries, setCountries] = useState([]);
  const [result, setResult] = useState(null);
  const [isAddingPhysicalNumbers, setIsAddingPhysicalNumbers] = useState(false);

  // Countries come from the server (appsettings) — same list users see when purchasing.
  useEffect(() => {
    getPhysicalCountries()
      .then((list) => {
        const items = list ?? [];
        setCountries(items);
        setCountryOptions(
          items.map((c) => ({
            value: c.countryId,
            label: c.countryName,
          })),
        );
        // Leave countryId empty — admin must explicitly choose (no auto-select).
      })
      .catch(() => errorToast("Failed to load physical number countries."));
  }, []);

  const selectedCountry = useMemo(
    () => countries.find((c) => c.countryId === countryId) ?? null,
    [countries, countryId],
  );

  const nationalNumberLength = selectedCountry?.nationalNumberLength ?? 0;

  const lines = useMemo(
    () =>
      text
        .split("\n")
        .map((line) => parseLine(line, selectedCountry))
        .filter(Boolean),
    [text, selectedCountry],
  );

  //Add Physical Numbers
  const validLines = lines.filter((l) => l.valid);
  const invalidLines = lines.filter((l) => !l.valid);
  const totalLines = lines.length;

  // First occurrence wins; duplicate numbers in the same paste are not submitted.
  const { uniqueValidLines, duplicateValidCount } = useMemo(() => {
    const seen = new Set();
    const unique = [];
    let dupes = 0;
    for (const line of validLines) {
      if (seen.has(line.number)) {
        dupes++;
        continue;
      }
      seen.add(line.number);
      unique.push(line);
    }
    return { uniqueValidLines: unique, duplicateValidCount: dupes };
  }, [validLines]);

  const handleSubmit = async () => {
    if (uniqueValidLines.length === 0) return;
    if (!countryId) {
      errorToast("Please select a country for this batch.");
      return;
    }
    if (!expiresAt || expiresAt < minExpiryDateString) {
      errorToast("Please select an expiry date after today.");
      return;
    }
    setIsAddingPhysicalNumbers(true);

    try {
      const payload = {
        Numbers: uniqueValidLines.map((l) => l.raw).join("\n"),
        price,
        countryId,
        expiresAt,
      };
      let response = await addPhysical(payload);

      if (response.isSuccess) {
        setResult(response.data);
      } else {
        errorToast(response.message);
      }
    } finally {
      setIsAddingPhysicalNumbers(false);
    }
  };

  const handleClear = () => setText("");

  return (
    <>
      <PhysicalNumbers />

      <div className="add-numbers-page">
        {/* Result Modal */}
        {result && (
          <ResultModal result={result} onClose={() => setResult(null)} />
        )}

        {/* Banner */}
        <div className="add-numbers-banner">
          <div className="banner-icon">🇺🇸</div>
          <div className="banner-text">
            <p className="banner-title">Add Physical Numbers</p>
            <p className="banner-sub">
              Select a country, then paste national numbers only — one entry per
              line. No country code and no + sign. Invalid lines are skipped on
              submit.
            </p>
          </div>
        </div>

        {/* Pattern hint */}
        <div className="pattern-hint">
          <span className="pattern-hint-label">Required Format</span>
          <div className="pattern-hint-box">
            <span className="pattern-code">
              3104447990|https://example.com/inbox/abc123
            </span>
            <div className="pattern-hint-legend">
              <span className="pattern-legend-part">
                <span className="pattern-legend-key">National number</span>
                <span className="pattern-legend-sep" aria-hidden>
                  |
                </span>
                <span className="pattern-legend-key">Inbox URL</span>
              </span>
              {nationalNumberLength > 0 ? (
                <span className="pattern-legend-badge">
                  {nationalNumberLength} digits
                </span>
              ) : (
                <span className="pattern-legend-badge pattern-legend-badge--muted">
                  Select country first
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Batch settings — country, price, expiry for entire paste */}
        <div className="batch-settings-card">
          <div className="batch-settings-header">
            <span className="batch-settings-title">Batch settings</span>
            <span className="batch-settings-sub">
              Applies to every number in this paste
            </span>
          </div>

          <div className="batch-settings-grid">
            <div className="batch-settings-field">
              <span className="textarea-label">
                Country <span className="required">*</span>
              </span>
              <SearchableSelect
                value={countryId}
                onChange={setCountryId}
                placeholder="Select a country"
                options={countryOptions}
                className={!countryId ? "input-error" : ""}
              />
              {selectedCountry && (
                <span className="batch-field-hint batch-field-hint--emphasis">
                  {selectedCountry.nationalNumberLength}-digit national number
                  {" · "}+{selectedCountry.phoneCode}
                </span>
              )}
              {!countryId && (
                <FormErrorMessage>
                  Country is required — select one before submitting
                </FormErrorMessage>
              )}
            </div>

            <div className="batch-settings-field">
              <span className="textarea-label">
                Price <span className="required">*</span>
              </span>
              <div className="price-input-wrap">
                <span className="price-input-prefix" aria-hidden>
                  $
                </span>
                <input
                  className={`price-input price-input--prefixed ${price <= 0 ? "input-error" : ""}`}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              {price <= 0 && (
                <FormErrorMessage>
                  Please enter a valid price greater than 0
                </FormErrorMessage>
              )}
            </div>

            <div className="batch-settings-field">
              <span className="textarea-label">
                Expiry Date <span className="required">*</span>
              </span>
              <input
                className={`price-input ${!expiresAt || expiresAt < minExpiryDateString ? "input-error" : ""}`}
                type="date"
                min={minExpiryDateString}
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
              <span className="batch-field-hint">
                Expires on this date (inclusive)
              </span>
              {(!expiresAt || expiresAt < minExpiryDateString) && (
                <FormErrorMessage>
                  Expiry date is required and must be after today
                </FormErrorMessage>
              )}
            </div>
          </div>
        </div>

        {/* Textarea */}
        <div className="textarea-section">
          <div className="textarea-header">
            <span className="textarea-label">
              Numbers <span className="required">*</span>
            </span>
            <span
              className={`textarea-counter ${totalLines > 0 ? "has-entries" : ""}`}
            >
              {totalLines === 0
                ? "No entries yet"
                : `${validLines.length} valid · ${invalidLines.length} invalid`}
            </span>
          </div>

          <textarea
            className={`numbers-textarea ${totalLines === 0 ? "input-error" : ""}`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              "3104447990|https://example.com/inbox/abc123\n" +
              "3105557890|https://provider.example/sms/xyz456\n" +
              "9175551234|https://another.example/page\n" +
              "...\n\nNational number only — no country code, no +. One per line."
            }
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
          />

          {totalLines === 0 && (
            <FormErrorMessage>
              Numbers are required — paste at least one line above
            </FormErrorMessage>
          )}
          {totalLines > 0 && uniqueValidLines.length > 0 && (
            <span className="validation-item valid">
              ✓ {uniqueValidLines.length}{" "}
              {uniqueValidLines.length === 1 ? "entry" : "entries"} ready to submit
            </span>
          )}
          {duplicateValidCount > 0 && (
            <FormErrorMessage>
              {duplicateValidCount}{" "}
              {duplicateValidCount === 1 ? "duplicate line" : "duplicate lines"}{" "}
              in your paste will be ignored (same number)
            </FormErrorMessage>
          )}
          {invalidLines.length > 0 && (
            <FormErrorMessage>
              {invalidLines.length}{" "}
              {invalidLines.length === 1 ? "line has" : "lines have"} invalid
              format and will be skipped
              {nationalNumberLength > 0
                ? ` (must be exactly ${nationalNumberLength} digits, digits only, no + or country code)`
                : ""}
            </FormErrorMessage>
          )}
        </div>

        {/* Actions */}
        <div className="action-row">
          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={
              price <= 0 ||
              uniqueValidLines.length === 0 ||
              !countryId ||
              !expiresAt ||
              expiresAt < minExpiryDateString ||
              isAddingPhysicalNumbers
            }
          >
            {isAddingPhysicalNumbers ? (
              <>
                <span className="btn-spinner" /> Submitting…
              </>
            ) : (
              <>
                ✦ Submit Numbers
                {uniqueValidLines.length > 0 && (
                  <span style={{ opacity: 0.7, fontWeight: 400 }}>
                    ({uniqueValidLines.length})
                  </span>
                )}
              </>
            )}
          </button>

          <button
            className="clear-btn"
            onClick={handleClear}
            disabled={text.length === 0 || isAddingPhysicalNumbers}
          >
            Clear
          </button>

          <span className="action-spacer" />
        </div>
      </div>
    </>
  );
}
