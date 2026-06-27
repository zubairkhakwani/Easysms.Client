//React
import { useState, useCallback } from "react";

//Helper
import { modalKeys } from "../../../../data/Static";
import { DropdownPortal } from "../../../../portal/DropDownPortal";

export function PhysicalNumberActionDropdown({ physicalNumberId, onAction, isActive }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  const items = [
    {
      key: modalKeys.physicalNumberActive,
      label: `Mark as ${isActive ? "inactive" : "active for sale"}`,
      icon: "",
      color: "cyan",
    },
    {
      key: modalKeys.physicalNumberExpiry,
      label: "Update expiry date",
      icon: "",
      color: "cyan",
    },
  ];

  return (
    <DropdownPortal
      open={open}
      onClose={close}
      trigger={
        <button className="um-action-btn" onClick={() => setOpen((v) => !v)}>
          Actions <span style={{ opacity: 0.5 }}>▾</span>
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
              onAction(item.key, physicalNumberId);
            }}
          >
            <span>{item.icon}</span> {item.label}
          </div>
        ))}
      </div>
    </DropdownPortal>
  );
}
