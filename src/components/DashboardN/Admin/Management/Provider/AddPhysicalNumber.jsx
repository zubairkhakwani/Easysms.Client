//React
import { useState, useMemo } from "react";

//Serives
import { addPhysical } from "../../../../../services/Number/NumberService";

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
    number.length > 0 && /^https?:\/\/.+/.test(url) && url.includes("?token=");
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
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const lines = useMemo(
    () => text.split("\n").map(parseLine).filter(Boolean),
    [text],
  );

  const validLines = lines.filter((l) => l.valid);
  const invalidLines = lines.filter((l) => !l.valid);
  const totalLines = lines.length;

  const handleSubmit = async () => {
    if (validLines.length === 0) return;
    setIsLoading(true);

    try {
      const payload = { Numbers: validLines.map((l) => l.raw).join("\n") };

      let response = await addPhysical(payload);
      console.log(response);
      setResult(response.data);
      setText("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => setText("");

  return (
    <div className="add-numbers-page">
      {/* Result Modal */}
      {result && (
        <ResultModal result={result} onClose={() => setResult(null)} />
      )}

      {/* Banner */}
      <div className="add-numbers-banner">
        <div className="banner-icon">🇺🇸</div>
        <div className="banner-text">
          <p className="banner-title">Add USA Physical Numbers</p>
          <p className="banner-sub">
            Paste all numbers you want to add — one entry per line. Each line
            must follow the pattern below. Invalid lines are skipped on submit.
          </p>
        </div>
      </div>

      {/* Pattern hint */}
      <div className="pattern-hint">
        <span className="pattern-hint-label">Required Format</span>
        <div className="pattern-hint-box">
          <span className="pattern-code">
            13104447990|https://sms222.us?token=j9u9Worj5y03101354
          </span>
          <span className="pattern-hint-note">number | inbox URL</span>
        </div>
      </div>

      {/* Textarea */}
      <div className="textarea-section">
        <div className="textarea-header">
          <span className="textarea-label">Numbers</span>
          <span
            className={`textarea-counter ${totalLines > 0 ? "has-entries" : ""}`}
          >
            {totalLines === 0
              ? "No entries yet"
              : `${validLines.length} valid · ${invalidLines.length} invalid`}
          </span>
        </div>

        <textarea
          className="numbers-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            "13104447990|https://sms222.us?token=abc123\n" +
            "13105557890|https://sms222.us?token=xyz456\n" +
            "19175551234|https://sms222.us?token=def789\n" +
            "...\n\nOne number per line."
          }
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
        />

        <div className="validation-row">
          {totalLines === 0 && (
            <span className="validation-item neutral">
              ⊙ Paste your numbers above to get started
            </span>
          )}
          {totalLines > 0 && validLines.length > 0 && (
            <span className="validation-item valid">
              ✓ {validLines.length}{" "}
              {validLines.length === 1 ? "entry" : "entries"} ready to submit
            </span>
          )}
          {invalidLines.length > 0 && (
            <span className="validation-item invalid">
              ✕ {invalidLines.length}{" "}
              {invalidLines.length === 1 ? "line" : "lines"} will be skipped
              (wrong format)
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="action-row">
        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={validLines.length === 0 || isLoading}
        >
          {isLoading ? (
            <>
              <span className="btn-spinner" /> Submitting…
            </>
          ) : (
            <>
              ✦ Submit Numbers
              {validLines.length > 0 && (
                <span style={{ opacity: 0.7, fontWeight: 400 }}>
                  ({validLines.length})
                </span>
              )}
            </>
          )}
        </button>

        <button
          className="clear-btn"
          onClick={handleClear}
          disabled={text.length === 0 || isLoading}
        >
          Clear
        </button>

        <span className="action-spacer" />
        <span className="submit-note">
          Invalid lines are automatically skipped
        </span>
      </div>
    </div>
  );
}
