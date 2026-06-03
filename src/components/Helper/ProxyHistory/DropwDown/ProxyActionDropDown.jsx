// ProxyActionDropdown.jsx
import { useState, useCallback } from "react";
import { DropdownPortal } from "../../../../portal/DropDownPortal";
import { modalKeys } from "../../../../data/Static";

export function ProxyActionDropdown({ id, onAction }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  const items = [
    {
      key: modalKeys.replaceIp,
      label: "Replace Ip",
      icon: <i className="fa-solid fa-arrows-rotate" />,
      color: "cyan",
    },
    {
      key: modalKeys.extendProxy,
      label: "Extend Proxy",
      icon: <i className="fa-solid fa-clock" />,
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
              onAction(item.key, id);
            }}
          >
            <span>{item.icon}</span> {item.label}
          </div>
        ))}
      </div>
    </DropdownPortal>
  );
}
