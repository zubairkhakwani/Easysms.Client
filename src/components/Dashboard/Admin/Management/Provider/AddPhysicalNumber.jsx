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

function parseLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return null;
  const pipeIdx = trimmed.indexOf("|");
  if (pipeIdx === -1) return { raw: trimmed, valid: false };
  const number = trimmed.slice(0, pipeIdx).trim();
  const url = trimmed.slice(pipeIdx + 1).trim();
  const valid =
    number.length > 0 && /^https?:\/\/.+/.test(url);
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

/* ── Main Page ── */
export default function AddPhysicalNumber() {
  const [text, setText] = useState("");
  const [price, setPrice] = useState(0);
  const [countryId, setCountryId] = useState("");
  const [countryOptions, setCountryOptions] = useState([]);
  const [result, setResult] = useState(null);
  const [isAddingPhysicalNumbers, setIsAddingPhysicalNumbers] = useState(false);

  // Countries come from the server (appsettings) — same list users see when purchasing.
  useEffect(() => {
    getPhysicalCountries()
      .then((list) => {
        const options = (list ?? []).map((c) => ({
          value: c.countryId,
          label: c.countryName,
        }));
        setCountryOptions(options);
        // Leave countryId empty — admin must explicitly choose (no auto-select).
      })
      .catch(() => errorToast("Failed to load physical number countries."));
  }, []);

  const lines = useMemo(
    () => text.split("\n").map(parseLine).filter(Boolean),
    [text],
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
    setIsAddingPhysicalNumbers(true);

    try {
      const payload = {
        Numbers: uniqueValidLines.map((l) => l.raw).join("\n"),
        price,
        countryId,
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
              Select a country, then paste numbers — one entry per line. Each line
              must follow the pattern below. Invalid lines are skipped on
              submit.
            </p>
          </div>
        </div>

        {/* Pattern hint */}
        <div className="pattern-hint">
          <span className="pattern-hint-label">Required Format</span>
          <div className="pattern-hint-box">
            <span className="pattern-code">
              13104447990|https://example.com/inbox/abc123
            </span>
            <span className="pattern-hint-note">number | inbox URL</span>
          </div>
        </div>

        {/* Country for entire batch — stored on every inserted PhysicalNumber row */}
        <div className="textarea-section">
          <div className="textarea-header">
            <span className="textarea-label">
              Country <span className="required">*</span>
            </span>
          </div>
          <SearchableSelect
            value={countryId}
            onChange={setCountryId}
            placeholder="Select a country"
            options={countryOptions}
            className={!countryId ? "input-error" : ""}
          />
          {!countryId && (
            <FormErrorMessage>Country is required — select one before submitting</FormErrorMessage>
          )}
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
              "13104447990|https://example.com/inbox/abc123\n" +
              "13105557890|https://provider.example/sms/xyz456\n" +
              "19175551234|https://another.example/page\n" +
              "...\n\nOne number per line."
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
            </FormErrorMessage>
          )}
        </div>

        {/* Price */}
        <div className="textarea-section">
          <div className="textarea-header">
            <span className="textarea-label">
              Price <span className="required">*</span>
            </span>
          </div>
          <input
            className={`price-input ${price <= 0 ? "input-error" : ""}`}
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          {price <= 0 && (
            <FormErrorMessage>Please enter a valid price greater than 0</FormErrorMessage>
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
