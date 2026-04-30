//React
import { useState, useMemo, useEffect } from "react";

//Serives
import {
  addPhysical,
  getAllPhysical,
} from "../../../../../services/Number/NumberService";

//Toaster
import { errorToast } from "../../../../../helper/Toaster";

//Helper
import { FormatterHelper } from "../../../../../helper/FormatterHelper";

//Static
import { PhysicalNumberStatus } from "../../../../../data/Static";

//Pagination
import Paginations from "../../../../Shared/Pagination";

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
  //Data
  const [physicalNumbers, setPhysicalNumbers] = useState([]);

  const [text, setText] = useState("");
  const [price, setPrice] = useState(0);
  const [result, setResult] = useState(null);
  const [isAddingPhysicalNumbers, setIsAddingPhysicalNumbers] = useState(false);

  //Loading
  const [isLoading, setIsLoading] = useState(false);

  //Filters
  const [filters, setFilters] = useState({
    status: "0",
    orderByCancellationCountDesc: false,
  });

  //Paginations
  const [count, setCount] = useState(0);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const lines = useMemo(
    () => text.split("\n").map(parseLine).filter(Boolean),
    [text],
  );

  //Add Physical Numbers

  const validLines = lines.filter((l) => l.valid);
  const invalidLines = lines.filter((l) => !l.valid);
  const totalLines = lines.length;

  const handleSubmit = async () => {
    if (validLines.length === 0) return;
    setIsAddingPhysicalNumbers(true);

    try {
      const payload = {
        Numbers: validLines.map((l) => l.raw).join("\n"),
        price,
      };
      let response = await addPhysical(payload);

      if (response.isSuccess) {
        setResult(response.data);
        setText("");
      } else {
        errorToast(response.message);
      }
    } finally {
      setIsAddingPhysicalNumbers(false);
    }
  };

  const handleClear = () => setText("");

  //Get Physical numbers

  async function getPhysicalNumbersData() {
    setIsLoading(true);
    try {
      let response = await getAllPhysical({
        pageNo,
        pageSize,
        filters,
      });
      var responseMessage = response.message;
      if (response.isSuccess) {
        setPhysicalNumbers(response.data.items ?? []);
        setCount(response.data.count);
      } else {
        errorToast(responseMessage);
      }
    } catch {
      errorToast("Failed to fetch physical numbers");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getPhysicalNumbersData();
  }, [pageNo, pageSize, filters]);

  const handleChangePage = (event, newPage) => {
    setPageNo(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPageNo(0);
  };

  function setFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <>
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

        {/* Price */}
        <div className="textarea-section">
          <div className="textarea-header">
            <span className="textarea-label">Price</span>
          </div>
          <input
            className="price-input"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <div className="validation-row">
            {price <= 0 && (
              <span className="validation-item neutral">
                ⊙ Please enter valid price for these numbers
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="action-row">
          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={
              price <= 0 || validLines.length === 0 || isAddingPhysicalNumbers
            }
          >
            {isAddingPhysicalNumbers ? (
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
            disabled={text.length === 0 || isAddingPhysicalNumbers}
          >
            Clear
          </button>

          <span className="action-spacer" />
        </div>
      </div>

      <div className="ph-page">
        {/* ── FILTERS ── */}
        <div className="nh-filters-bar">
          <div className="nh-filters-left">
            <span className="nh-filters-heading">Filters</span>
            <div className="nh-filter-group">
              <label className="nh-filter-label">Status</label>
              <select
                className={`nh-filter-select`}
                value={filters.status}
                onChange={(e) => setFilter("status", e.target.value)}
              >
                {PhysicalNumberStatus.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="nh-filter-group">
              <label className="nh-filter-label">OTP</label>
              <label className={`nh-filter-checkbox`}>
                <input
                  type="checkbox"
                  checked={filters.orderByCancellationCountDesc}
                  onChange={(e) =>
                    setFilter("orderByCancellationCountDesc", e.target.checked)
                  }
                />
                Order By Cancellation Count
              </label>
            </div>
          </div>
        </div>
        {/* ── Table ── */}
        <div className="ph-table-panel">
          <div className="ph-table-header">
            <span className="ph-table-title">Physical Numbers</span>
          </div>
          {/* Table */}
          {!isLoading && (
            <>
              <div className="ph-table-wrap">
                <table className="ph-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Id</th>
                      <th>Number</th>
                      <th>Url</th>
                      <th>Token</th>
                      <th>Purchased Price</th>
                      <th>Cancelled Count</th>
                      <th>Status</th>
                      <th>Created At</th>
                      <th>Sold At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {physicalNumbers.map((r, index) => (
                      <tr key={r.id}>
                        <td className="ph-col-id">{index + 1}</td>
                        <td className="ph-col-id">{r.id}</td>
                        <td className="ph-col-id">{r.number}</td>
                        <td className="ph-col-id">{r.url}</td>
                        <td className="ph-col-id">{r.token}</td>
                        <td className="ph-col-id">
                          {FormatterHelper.formatCurrency(r.purchasedPrice)}
                        </td>
                        <td className="ph-col-id">{r.canclledCount}</td>
                        <td className="ph-col-id">{r.status}</td>
                        <td className="ph-col-date">
                          {FormatterHelper.formatDateToLocal(r.createdAt)}
                        </td>

                        <td className="ph-col-date">
                          {r.soldAt
                            ? FormatterHelper.formatDateToLocal(r.soldAt)
                            : "- "}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="ph-state-row">
              <div className="ph-spinner" />
              <span className="ph-state-text">Fetching records…</span>
            </div>
          )}

          {/* Empty result */}
          {!isLoading && physicalNumbers.length === 0 && (
            <div className="ph-state-row">
              <div className="ph-state-icon">⊟</div>
              <span className="ph-state-text">
                No records found for the selected filters
              </span>
            </div>
          )}
          {!isLoading && (
            <Paginations
              page={pageNo}
              rowsPerPage={pageSize}
              count={count}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
            />
          )}
        </div>
      </div>
    </>
  );
}
