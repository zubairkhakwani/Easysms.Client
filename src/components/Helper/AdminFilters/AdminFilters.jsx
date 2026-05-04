const toDS = (d) => d.toISOString().slice(0, 10);

const today = new Date();

export function AdminFilters({
  startDate,
  endDate,
  starDateTitle,
  endDateTitle,
  onStartDate,
  OnEndDate,
  isLoading,
  loadingTitle,
  onHandleReset,
  onHandleApply,
}) {
  return (
    <div className="ph-filters">
      <div className="ph-filter-field">
        <label className="ph-filter-label">{starDateTitle}</label>
        <input
          type="date"
          className="ph-filter-input"
          value={startDate}
          max={endDate}
          onChange={(e) => onStartDate(e.target.value)}
        />
      </div>

      <div className="ph-filter-field">
        <label className="ph-filter-label">{endDateTitle}</label>
        <input
          type="date"
          className="ph-filter-input"
          value={endDate}
          min={startDate}
          max={toDS(today)}
          onChange={(e) => OnEndDate(e.target.value)}
        />
      </div>

      <div className="ph-filter-actions">
        <button className="ph-reset-btn" onClick={onHandleReset}>
          Reset
        </button>
        <button
          className="ph-apply-btn"
          onClick={onHandleApply}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span
                className="btn-spinner"
                style={{
                  width: 13,
                  height: 13,
                  borderTopColor: "#000",
                  borderColor: "rgba(0,0,0,0.25)",
                }}
              />{" "}
              {loadingTitle}
            </>
          ) : (
            "✦ Apply"
          )}
        </button>
      </div>
    </div>
  );
}
