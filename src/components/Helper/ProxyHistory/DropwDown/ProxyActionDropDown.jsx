//React
import { useState } from "react";

//Helper
import { modalKeys } from "../../../../data/Static";

export function ProxyActionDropdown({ id, onAction }) {
  const [open, setOpen] = useState(false);

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
                onAction(item.key, id);
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
