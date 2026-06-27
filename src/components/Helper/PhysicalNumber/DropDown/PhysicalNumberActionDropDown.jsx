//React
import { useState } from "react";

//Helper
import { modalKeys } from "../../../../data/Static";

export function PhysicalNumberActionDropdown({ physicalNumberId, onAction, isActive }) {
  const [open, setOpen] = useState(false);

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
    <div className="um-dropdown-wrap">
      <button className="um-action-btn" onClick={() => setOpen((v) => !v)}>
        Actions <span style={{ opacity: 0.5 }}>▾</span>
      </button>
      {open && (
        <div className="um-dropdown">
          {items.map((item) => (
            <div
              key={item.key}
              className={`um-drop-item ${item.color}`}
              onClick={() => {
                setOpen(false);
                onAction(item.key, physicalNumberId);
              }}
            >
              <span>{item.icon}</span> {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
