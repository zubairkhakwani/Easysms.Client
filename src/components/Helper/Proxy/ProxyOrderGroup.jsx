import { useState } from "react";
import { FormatterHelper } from "../../../helper/FormatterHelper";
import { ProxyOrderActionDropdown } from "../ProxyHistory/DropwDown/ProxyOrderActionDropDown";
import { ProxyActionDropdown } from "../ProxyHistory/DropwDown/ProxyActionDropDown";
import { CopyableCell } from "./CopyableCell";

export function ProxyOrderGroup({ order, onAction }) {
  const [open, setOpen] = useState(true);
  const proxies = order.proxies ?? [];

  const first = proxies[0];

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
          <ProxyOrderActionDropdown
            orderNumber={order.orderNumber}
            onAction={onAction}
          />
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
                  "Proxy type",
                  "Status",
                  "End Date",
                  "Actions",
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
                  <td className="map__td map__td--mono">
                    <CopyableCell label="IP" value={item.ip} mono />
                  </td>
                  <td className="map__td map__td--mono">
                    <CopyableCell
                      label="Whitelist IP"
                      value={item.authIp}
                      mono
                    />
                  </td>
                  <td className="map__td map__td--mono">
                    <CopyableCell
                      label="HTTP Port"
                      value={item.portHttp}
                      mono
                    />
                  </td>
                  <td className="map__td map__td--mono">
                    <CopyableCell
                      label="SOCKS Port"
                      value={item.portSocks}
                      mono
                    />
                  </td>
                  <td className="map__td">
                    <CopyableCell label="Username" value={item.login} />
                  </td>
                  <td className="map__td map__td--secret">
                    <CopyableCell
                      label="Password"
                      value={item.password}
                      secret
                    />
                  </td>
                  <td className="map__td">
                    <span className="map__country-tag">{item.country}</span>
                  </td>
                  <td className="map__td">
                    <span className="map__country-tag">{item.proxyType}</span>
                  </td>
                  <td className="map__td">
                    <span
                      className={`map__status map__status--${(item.status ?? "").toLowerCase()}`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="map__td map__td--date">
                    {FormatterHelper.formatDateToLocal(item.endDate)}
                  </td>
                  <td className="map__td">
                    <ProxyActionDropdown id={item.id} onAction={onAction} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
