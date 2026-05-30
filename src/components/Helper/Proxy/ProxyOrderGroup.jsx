import { useState } from "react";
import { FormatterHelper } from "../../../helper/FormatterHelper";
import { ActionDropdown } from "../../Helper/ProxyHistory/DropwDown/ActionDropDown";

export function ProxyOrderGroup({ order, onAction }) {
  const [open, setOpen] = useState(true);
  const proxies = order.proxies ?? [];

  const first = proxies[0];
  const expiryDate = first
    ? FormatterHelper.formatDateToLocal(first.endDate)
    : "—";

  return (
    <div className={`map__order ${open ? "map__order--open" : ""}`}>
      {/* ── Order header row ── */}
      <div className="map__order-hd">
        {/* Left: chevron + badge + meta — clicking this area toggles */}
        <button
          className="map__order-toggle"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="map__chevron">{open ? "▾" : "▸"}</span>

          <span className="map__order-badge">
            <span className="map__order-badge-label">Order</span>
            <span className="map__order-badge-num">#{order.orderNumber}</span>
          </span>

          <span className="map__order-meta">
            <span className="map__order-meta-item">
              <span className="map__order-meta-label">Proxies</span>
              <span className="map__order-meta-val">{proxies.length}</span>
            </span>
            {first && (
              <>
                <span className="map__order-meta-sep" />
                <span className="map__order-meta-item">
                  <span className="map__order-meta-label">Country</span>
                  <span className="map__order-meta-val">{first.country}</span>
                </span>
                <span className="map__order-meta-sep" />
                <span className="map__order-meta-item">
                  <span className="map__order-meta-label">Expires</span>
                  <span className="map__order-meta-val">{expiryDate}</span>
                </span>
              </>
            )}
          </span>

          <span
            className={`map__toggle-pill ${open ? "map__toggle-pill--open" : ""}`}
          >
            {open ? "Hide" : "Show"}
          </span>
        </button>

        {/* Right: order-level action dropdown — does NOT trigger toggle */}
        <div
          className="map__order-actions"
          onClick={(e) => e.stopPropagation()}
        >
          <ActionDropdown orderNumber={order.orderNumber} onAction={onAction} />
        </div>
      </div>

      {/* ── Collapsible proxy table ── */}
      {open && (
        <div className="map__table-wrap">
          <table className="map__table">
            <thead>
              <tr>
                {[
                  "#",
                  "IP",
                  "Whitelist IP",
                  "Port HTTP",
                  "Port SOCKS",
                  "Username",
                  "Password",
                  "Country",
                  "Status",
                  "Start Date",
                  "End Date",
                  //   "Actions",
                ].map((h) => (
                  <th key={h} className="map__th">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {proxies.map((item, idx) => (
                <tr key={idx} className="map__tr">
                  <td className="map__td map__td--idx">{idx + 1}</td>
                  <td className="map__td map__td--mono">{item.ip}</td>
                  <td className="map__td map__td--mono">
                    {item.authIp || <span className="map__empty">—</span>}
                  </td>
                  <td className="map__td map__td--mono">{item.portHttp}</td>
                  <td className="map__td map__td--mono">{item.portSocks}</td>
                  <td className="map__td">
                    {item.login || <span className="map__empty">—</span>}
                  </td>
                  <td className="map__td map__td--secret">
                    {item.password || <span className="map__empty">—</span>}
                  </td>
                  <td className="map__td">
                    <span className="map__country-tag">{item.country}</span>
                  </td>
                  <td className="map__td">
                    <span
                      className={`map__status map__status--${(item.status ?? "").toLowerCase()}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="map__td map__td--date">
                    {FormatterHelper.formatDateToLocal(item.startDate)}
                  </td>
                  <td className="map__td map__td--date">
                    {FormatterHelper.formatDateToLocal(item.endDate)}
                  </td>
                  {/* <td className="map__td">
                    <ActionDropdown
                      orderNumber={order.orderNumber}
                      onAction={onAction}
                    />
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
