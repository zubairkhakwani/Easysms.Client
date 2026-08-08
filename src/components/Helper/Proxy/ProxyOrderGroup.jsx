import { useState } from "react";
import { FormatterHelper } from "../../../helper/FormatterHelper";
import { CopyToClipboard } from "../../../helper/UtilityHelper";
import { ProxyOrderActionDropdown } from "../ProxyHistory/DropwDown/ProxyOrderActionDropDown";
import { ProxyActionDropdown } from "../ProxyHistory/DropwDown/ProxyActionDropDown";
import { CopyableCell } from "./CopyableCell";
import Tooltip from "../../../portal/Tooltip";

function buildConnectionString(proxy, protocol = "http") {
  const port = protocol === "socks" ? proxy.portSocks : proxy.portHttp;
  if (!proxy?.ip || !port) return "";
  if (proxy.login && proxy.password) {
    return `${proxy.ip}:${port}:${proxy.login}:${proxy.password}`;
  }
  return `${proxy.ip}:${port}`;
}

export function ProxyOrderGroup({
  order,
  onAction,
  showUserInfo = false,
}) {
  const [open, setOpen] = useState(true);
  const proxies = order.proxies ?? [];

  const first = proxies[0];

  return (
    <div className={`map__order ${open ? "map__order--open" : ""}`}>
      {/* ── Order header row ── */}
      <div className="map__order-hd">
        <button
          type="button"
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
            {showUserInfo && (order.userName || order.userEmail) && (
              <>
                <span className="map__order-meta-sep" />
                <span className="map__order-meta-item">
                  <span className="map__order-meta-label">User</span>
                  <span className="map__order-meta-val">
                    {order.userName || "—"}
                  </span>
                </span>
                <span className="map__order-meta-sep" />
                <span className="map__order-meta-item">
                  <span className="map__order-meta-label">Email</span>
                  <span className="map__order-meta-val map__order-meta-val--email">
                    {order.userEmail || "—"}
                  </span>
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
                  "Days Left",
                  "Actions",
                ].map((h) => (
                  <th key={h} className="map__th">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {proxies.map((item, idx) => {
                const rowExpiry = FormatterHelper.getExpiryInfo(item.endDate);
                const httpConn = buildConnectionString(item, "http");
                const socksConn = buildConnectionString(item, "socks");

                return (
                  <tr key={item.id ?? idx} className="map__tr">
                    <td className="map__td map__td--idx">{idx + 1}</td>
                    <td className="map__td map__td--mono">
                      <span className="map__ip-cell">
                        <CopyableCell label="IP" value={item.ip} mono />
                        {httpConn && (
                          <Tooltip
                            tooltip="Copy HTTP connection — ip:port:user:pass"
                            btn={
                              <button
                                type="button"
                                className="map__copy-btn map__copy-btn--proto"
                                aria-label="Copy HTTP connection"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  CopyToClipboard("HTTP connection", httpConn);
                                }}
                              >
                                <i className="fa-solid fa-globe" aria-hidden />
                              </button>
                            }
                          />
                        )}
                        {socksConn && (
                          <Tooltip
                            tooltip="Copy SOCKS connection — ip:port:user:pass"
                            btn={
                              <button
                                type="button"
                                className="map__copy-btn map__copy-btn--proto"
                                aria-label="Copy SOCKS connection"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  CopyToClipboard(
                                    "SOCKS connection",
                                    socksConn,
                                  );
                                }}
                              >
                                <i className="fa-solid fa-socks" aria-hidden />
                              </button>
                            }
                          />
                        )}
                      </span>
                    </td>
                    <td className="map__td map__td--mono">
                      {item.authIp ? (
                        <CopyableCell
                          label="Whitelist IP"
                          value={item.authIp}
                          mono
                        />
                      ) : (
                        <span className="map__empty-none">—</span>
                      )}
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
                    <td className="map__td map__td--cred">
                      <CopyableCell label="Username" value={item.login} mono />
                    </td>
                    <td className="map__td map__td--cred map__td--secret">
                      <CopyableCell
                        label="Password"
                        value={item.password}
                        mono
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
                      {rowExpiry.label ? (
                        <span
                          className={`map__expiry map__expiry--${rowExpiry.tone}`}
                        >
                          {rowExpiry.label}
                        </span>
                      ) : (
                        <span className="map__empty">—</span>
                      )}
                    </td>
                    <td className="map__td">
                      <ProxyActionDropdown id={item.id} onAction={onAction} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
