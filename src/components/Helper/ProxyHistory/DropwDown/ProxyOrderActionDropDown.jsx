//React
import { useState } from "react";

//Helper
import { modalKeys } from "../../../../data/Static";

export function ProxyOrderActionDropdown({ orderNumber, onAction }) {
  const [open, setOpen] = useState(false);

  const items = [
    {
      key: modalKeys.exportProxy,
      label: "Export",
      icon: <i className="fa-solid fa-download" />,
      color: "cyan",
    },
    {
      key: modalKeys.proxyAuthChange,
      label: "Change Auth",
      icon: <i className="fa-solid fa-user-shield" />,
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
                onAction(item.key, orderNumber);
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
