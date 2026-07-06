import { useState, useCallback } from "react";
import { DropdownPortal } from "../../../portal/DropDownPortal";

export function MailHistoryActionDropdown({ mailId, onReorder, disabled }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <DropdownPortal
      open={open}
      onClose={close}
      trigger={
        <button
          type="button"
          className="um-action-btn"
          disabled={disabled}
          onClick={() => setOpen((v) => !v)}
        >
          Actions <span style={{ opacity: 0.5 }}>▾</span>
        </button>
      }
    >
      <div className="um-dropdown">
        <div
          className={`um-drop-item cyan${disabled ? " um-drop-item--disabled" : ""}`}
          onClick={() => {
            if (disabled) return;
            close();
            onReorder(mailId);
          }}
        >
          <span>
            <i className="fa-solid fa-arrows-rotate" />
          </span>{" "}
          {disabled ? "Re-ordering…" : "Re-order"}
        </div>
      </div>
    </DropdownPortal>
  );
}
