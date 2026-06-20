import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import "./SearchableSelect.css";

const SEARCH_THRESHOLD = 6;

function normalizeOptions(options) {
  return (options ?? []).map((opt) => {
    if (opt == null || typeof opt !== "object") {
      return {
        value: opt,
        label: String(opt ?? ""),
        sublabel: "",
        disabled: false,
      };
    }
    return {
      value: opt.value,
      label: opt.label ?? String(opt.value ?? ""),
      sublabel: opt.sublabel ?? "",
      disabled: Boolean(opt.disabled),
    };
  });
}

function valuesEqual(a, b) {
  return String(a ?? "") === String(b ?? "");
}

export default function SearchableSelect({
  options = [],
  value,
  onChange,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  disabled = false,
  isLoading = false,
  emptyText = "No results found",
  className = "",
  name,
  id: idProp,
  disableSearch,
}) {
  const generatedId = useId();
  const listboxId = `${generatedId}-listbox`;
  const triggerId = idProp ?? `${generatedId}-trigger`;

  const wrapRef = useRef(null);
  const panelRef = useRef(null);
  const searchRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  const normalizedOptions = useMemo(() => normalizeOptions(options), [options]);

  const showSearch =
    disableSearch === false ||
    (disableSearch !== true && normalizedOptions.length > SEARCH_THRESHOLD);

  const filteredOptions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return normalizedOptions;
    return normalizedOptions.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        opt.sublabel.toLowerCase().includes(q),
    );
  }, [normalizedOptions, search]);

  const selectableOptions = useMemo(
    () => filteredOptions.filter((opt) => !opt.disabled),
    [filteredOptions],
  );

  const selectedOption = useMemo(
    () => normalizedOptions.find((opt) => valuesEqual(opt.value, value)),
    [normalizedOptions, value],
  );

  const displayLabel = selectedOption?.label ?? placeholder;
  const hasSelection = Boolean(selectedOption);

  const updateCoords = useCallback(() => {
    if (!wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    setCoords({
      top: rect.bottom + window.scrollY + 4,
      left: rect.left + window.scrollX,
      width: rect.width,
    });
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setSearch("");
    setHighlightIndex(0);
  }, []);

  const openPanel = useCallback(() => {
    if (disabled || isLoading) return;
    updateCoords();
    setOpen(true);
    const selectedIdx = selectableOptions.findIndex((opt) =>
      valuesEqual(opt.value, value),
    );
    setHighlightIndex(selectedIdx >= 0 ? selectedIdx : 0);
  }, [
    disabled,
    isLoading,
    updateCoords,
    selectableOptions,
    value,
  ]);

  const selectOption = useCallback(
    (opt) => {
      if (!opt || opt.disabled) return;
      onChange?.(opt.value);
      close();
    },
    [onChange, close],
  );

  useEffect(() => {
    if (!open) return;
    updateCoords();
    const t = window.setTimeout(() => searchRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, [open, updateCoords]);

  useEffect(() => {
    if (!open) return;

    const onScrollOrResize = () => updateCoords();
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [open, updateCoords]);

  useEffect(() => {
    if (!open) return;

    const onMouseDown = (e) => {
      if (
        !wrapRef.current?.contains(e.target) &&
        !panelRef.current?.contains(e.target)
      ) {
        close();
      }
    };

    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open, close]);

  useEffect(() => {
    if (highlightIndex >= selectableOptions.length) {
      setHighlightIndex(Math.max(0, selectableOptions.length - 1));
    }
  }, [selectableOptions.length, highlightIndex]);

  const onTriggerKeyDown = (e) => {
    if (disabled || isLoading) return;

    if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) openPanel();
      else if (e.key === "ArrowDown") setHighlightIndex(0);
    } else if (e.key === "Escape" && open) {
      e.preventDefault();
      close();
    }
  };

  const onPanelKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      wrapRef.current?.querySelector(".ss-trigger")?.focus();
      return;
    }

    if (selectableOptions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => Math.min(i + 1, selectableOptions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      selectOption(selectableOptions[highlightIndex]);
    }
  };

  if (isLoading) {
    return (
      <div className={`ss-wrap ${className}`.trim()}>
        <div className="ss-skeleton" aria-hidden />
      </div>
    );
  }

  const highlightedId =
    selectableOptions.length > 0
      ? `${listboxId}-opt-${highlightIndex}`
      : undefined;

  return (
    <div className={`ss-wrap ${className}`.trim()} ref={wrapRef}>
      <button
        type="button"
        id={triggerId}
        name={name}
        className={`ss-trigger ${open ? "ss-trigger--open" : ""}`}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => (open ? close() : openPanel())}
        onKeyDown={onTriggerKeyDown}
      >
        <span
          className={`ss-trigger-label ${!hasSelection ? "ss-trigger-label--placeholder" : ""}`}
        >
          {displayLabel}
        </span>
        <i className="fa-solid fa-chevron-down ss-trigger-chevron" aria-hidden />
      </button>

      {open &&
        createPortal(
          <div
            ref={panelRef}
            className="ss-panel"
            style={{
              position: "absolute",
              top: coords.top,
              left: coords.left,
              width: coords.width,
              zIndex: 9999,
            }}
            onKeyDown={onPanelKeyDown}
          >
            {showSearch && (
              <div className="ss-search-wrap">
                <i
                  className="fa-solid fa-magnifying-glass ss-search-icon"
                  aria-hidden
                />
                <input
                  ref={searchRef}
                  type="text"
                  className="ss-search-input"
                  placeholder={searchPlaceholder}
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setHighlightIndex(0);
                  }}
                  aria-label={searchPlaceholder}
                />
              </div>
            )}

            {filteredOptions.length === 0 ? (
              <div className="ss-empty">{emptyText}</div>
            ) : (
              <ul
                id={listboxId}
                className="ss-list"
                role="listbox"
                aria-labelledby={triggerId}
                aria-activedescendant={highlightedId}
              >
                {filteredOptions.map((opt) => {
                  const selectableIdx = selectableOptions.indexOf(opt);
                  const isHighlighted =
                    selectableIdx >= 0 && selectableIdx === highlightIndex;
                  const isSelected = valuesEqual(opt.value, value);

                  return (
                    <li key={`${opt.value}-${opt.label}`} role="presentation">
                      <button
                        type="button"
                        id={
                          selectableIdx >= 0
                            ? `${listboxId}-opt-${selectableIdx}`
                            : undefined
                        }
                        role="option"
                        aria-selected={isSelected}
                        disabled={opt.disabled}
                        className={[
                          "ss-option",
                          isHighlighted && "ss-option--highlighted",
                          isSelected && "ss-option--selected",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        onMouseEnter={() => {
                          if (selectableIdx >= 0) setHighlightIndex(selectableIdx);
                        }}
                        onClick={() => selectOption(opt)}
                      >
                        <span className="ss-option-text">
                          <span className="ss-option-label">{opt.label}</span>
                          {opt.sublabel ? (
                            <span className="ss-option-sublabel">
                              {opt.sublabel}
                            </span>
                          ) : null}
                        </span>
                        <i
                          className="fa-solid fa-check ss-option-check"
                          aria-hidden
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>,
          document.body,
        )}
    </div>
  );
}
