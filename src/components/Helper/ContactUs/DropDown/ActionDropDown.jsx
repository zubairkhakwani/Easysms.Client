import { useCallback, useState } from "react";
import { DropdownPortal } from "../../../../portal/DropDownPortal";
import { modalKeys } from "../../../../data/Static";

export function ActionDropdown({ contactUsId, onAction, isRead }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  const items = [
    {
      key: modalKeys.contactUsMessage,
      label: `Mark as ${isRead ? "un-read" : "read"} `,
      icon: "",
      color: "cyan",
    },
    {
      key: modalKeys.contactUsReply,
      label: "Reply",
      icon: "",
      color: "cyan",
    },
  ];

  return (
    <DropdownPortal
      open={open}
      onClose={close}
      trigger={
        <button type="button" className="um-action-btn" onClick={() => setOpen((v) => !v)}>
          Actions <span className="um-action-down-arrow">▾</span>
        </button>
      }
    >
      <div className="um-dropdown">
        {items.map((item) => (
          <div
            key={item.key}
            className={`um-drop-item ${item.color}`}
            onClick={() => {
              close();
              onAction(item.key, contactUsId);
            }}
          >
            <span>{item.icon}</span> {item.label}
          </div>
        ))}
      </div>
    </DropdownPortal>
  );
}
