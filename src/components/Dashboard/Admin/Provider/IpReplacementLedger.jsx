import { useEffect, useState } from "react";
import { getProxyIpReplacements } from "../../../../services/Proxy/ProxyService";
import { FormatterHelper } from "../../../../helper/FormatterHelper";
import { errorToast } from "../../../../helper/Toaster";
import Paginations from "../../../Shared/Pagination";
import { IpReplacementLedgerActionDropdown } from "../../../Helper/IpReplacementLedger/IpReplacementLedgerActionDropdown";
import { IpReplacementAttachmentsModal } from "../../../Helper/IpReplacementLedger/IpReplacementAttachmentsModal";
import "../Management/Deposit/Deposits.css";
import "../Management/User/UserManagement.css";
import "./IpReplacementLedger.css";

function formatJson(value) {
  if (!value) return "";
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
}

function statusClass(status) {
  return `irl-status irl-status--${(status ?? "").toLowerCase()}`;
}

export default function IpReplacementLedger() {
  const [records, setRecords] = useState([]);
  const [count, setCount] = useState(0);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedJson, setSelectedJson] = useState(null);
  const [selectedAttachments, setSelectedAttachments] = useState(null);

  async function fetchRecords() {
    setIsLoading(true);
    try {
      const res = await getProxyIpReplacements({
        pageNo,
        pageSize,
        filters: { keyword },
      });
      if (res.isSuccess) {
        setRecords(res.data.items ?? []);
        setCount(res.data.count ?? 0);
      } else {
        errorToast(res.message);
      }
    } catch {
      errorToast("Failed to fetch IP replacement records.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchRecords();
  }, [pageNo, pageSize, keyword]);

  const handleChangePage = (_event, newPage) => {
    setPageNo(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPageNo(0);
  };

  return (
    <>
      <div className="irl-wrap">
        <div className="ph-table-panel">
          <div className="ph-table-header irl-table-header">
            <input
              className="adm-search-input"
              placeholder="Search IP, proxy type, user, order, proxy id..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          {isLoading && (
            <div className="ph-state-row">
              <div className="ph-spinner ph-spinner--lg ph-spinner-thick ph-spinner--light" />
              <span className="ph-state-text">Fetching records…</span>
            </div>
          )}

          {!isLoading && records.length === 0 && (
            <div className="ph-state-row">
              <div className="ph-state-icon">⊟</div>
              <span className="ph-state-text">No IP replacement records found</span>
            </div>
          )}

          {!isLoading && records.length > 0 && (
            <>
              <div className="ph-table-wrap">
                <table className="ph-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Proxy ID</th>
                      <th>Order ID</th>
                      <th>Old IP</th>
                      <th>New IP</th>
                      <th>IP Type</th>
                      <th>Status</th>
                      <th>Issue</th>
                      <th>Comment</th>
                      <th>Created At</th>
                      <th>Elapsed</th>
                      <th>Updated At</th>
                      <th className="irl-col-actions">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((row) => (
                      <tr key={row.id}>
                        <td>
                          <div className="um-user-cell">
                            <div className="um-avatar">{row.userAvatar || "?"}</div>
                            <div>
                              <div className="um-user-name">{row.userName || "—"}</div>
                              <div className="um-user-email">{row.userEmail || "—"}</div>
                            </div>
                          </div>
                        </td>
                        <td className="ph-col-id">{row.proxyId}</td>
                        <td className="ph-col-id">{row.providerOrderId}</td>
                        <td className="irl-mono">{row.oldIp || "—"}</td>
                        <td className="irl-mono">{row.newIp || "—"}</td>
                        <td>{row.proxyType || "—"}</td>
                        <td>
                          <span className={statusClass(row.status)}>{row.status}</span>
                        </td>
                        <td>{row.issueType || "—"}</td>
                        <td className="irl-comment" title={row.comment || undefined}>
                          {row.comment || "—"}
                        </td>
                        <td className="irl-date">
                          {FormatterHelper.formatDateToLocal(row.createdAt)}
                        </td>
                        <td className="irl-elapsed">
                          {FormatterHelper.formatElapsedSince(row.createdAt)}
                        </td>
                        <td className="irl-date">
                          {row.updatedAt
                            ? FormatterHelper.formatDateToLocal(row.updatedAt)
                            : "—"}
                        </td>
                        <td className="irl-col-actions">
                          <IpReplacementLedgerActionDropdown
                            row={row}
                            onViewJson={setSelectedJson}
                            onViewAttachments={setSelectedAttachments}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Paginations
                page={pageNo}
                rowsPerPage={pageSize}
                count={count}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </>
          )}
        </div>
      </div>

      {selectedAttachments && (
        <IpReplacementAttachmentsModal
          row={selectedAttachments}
          onClose={() => setSelectedAttachments(null)}
        />
      )}

      {selectedJson && (
        <div className="irl-modal-overlay" onClick={() => setSelectedJson(null)}>
          <div className="irl-modal" onClick={(e) => e.stopPropagation()}>
            <div className="irl-modal-header">
              <span>Provider response — Proxy #{selectedJson.proxyId}</span>
              <button
                type="button"
                className="irl-modal-close"
                onClick={() => setSelectedJson(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <pre className="irl-json">
              {formatJson(selectedJson.providerResponseJson)}
            </pre>
          </div>
        </div>
      )}
    </>
  );
}
