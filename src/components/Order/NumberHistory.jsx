//React
import { useState, useEffect } from "react";

//Services
import { getMyNumberHistory } from "../../services/Order/Order";

//Helper
import { FormatterHelper } from "../../helper/FormatterHelper";
import { NumberStatus, Providers } from "../../data/Static";

//Toaster
import { successTaost, errorToast } from "../../helper/Toaster";

//Pagination
import Paginations from "../Shared/Pagination";

//Css
import "./NumberHistory.css";

export default function NumberHistory() {
  //Data
  const [ordersData, setOrdersData] = useState([]);
  const [filterednumbers, setFilterednumbers] = useState([]);
  const [status, setStatus] = useState("0");
  const [provider, setProvider] = useState("0");

  //Loading
  const [isLoading, setIsLoading] = useState(false);

  //Pagination
  const [count, setCount] = useState(0);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setIsLoading(true);
    const fetchAllMyNumbers = async () => {
      try {
        const res = await getMyNumberHistory({
          pageNo,
          pageSize,
          provider,
          status,
        });
        if (res.isSuccess) {
          setOrdersData(res.data?.items ?? []);
          setFilterednumbers(res.data?.items ?? []);
          setCount(res.data?.count ?? 0);
        }
      } catch {
        errorToast("Failed to fetch number history");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllMyNumbers();
  }, [pageNo, pageSize, provider, status]);

  function handleSearch(keyword) {
    const filtered = ordersData.filter((order) =>
      order.orderData.phoneNumbers.some((num) =>
        num.toLowerCase().includes(keyword.toLowerCase()),
      ),
    );

    setFilterednumbers(filtered);
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      successTaost("Copied to clipboard");
    } catch (err) {
      errorToast("Failed to copy");
      console.error("Copy failed", err);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPageNo(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPageNo(0);
  };

  const stats = [
    {
      label: "Total numbers",
      val: ordersData.flatMap((o) => o.orderData?.phoneNumbers || []).length,
    },
    {
      label: "Total Active",
      val: ordersData
        .flatMap((o) => o.orderData?.status || [])
        .filter((status) => status == "Active").length,
    },
    {
      label: "Total Completed",
      val: ordersData
        .flatMap((o) => o.orderData?.status || [])
        .filter((status) => status == "Completed").length,
    },
    {
      label: "Total Cancelled",
      val: ordersData
        .flatMap((o) => o.orderData?.status || [])
        .filter((status) => status == "Cancelled").length,
    },

    {
      label: "Total Otps",
      val: ordersData.flatMap((o) => o.orderData?.verificationCodes || [])
        .length,
    },
  ];

  return (
    <div className="um-page">
      <div className="ph-filters">
        <div className="ph-filter-field">
          <label className="ph-filter-label">Provider</label>
          <select
            className="ph-filter-input"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
          >
            {Providers.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <div className="ph-filter-field">
          <label className="ph-filter-label">Status</label>
          <select
            className="ph-filter-input"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {NumberStatus.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="um-header">
        <div>
          <div className="um-page-title">Number History</div>
          <div className="um-page-sub">
            View all your purchased numbers and their activation status
          </div>
        </div>
      </div>

      <div className="um-stats-row">
        {stats.map((s) => (
          <div key={s.label} className="um-stat-card">
            <div className="um-stat-val">{s.val}</div>
            <div className="um-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="um-table-wrap">
        <div className="um-table-header">
          <span className="um-table-title">All numbers</span>
          <input
            className="um-search-input"
            placeholder="🔍  Search numbers..."
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {!isLoading && (
          <table className="um-table">
            <thead>
              <tr>
                {[
                  "#",
                  "Number",
                  "Otps",
                  "Provider",
                  "Total Cost",
                  "Status",
                  "Ordered At",
                ].map((h) => (
                  <th key={h} className="um-th">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filterednumbers.map((number, index) => (
                <tr key={index} className="um-tr">
                  <td className="um-td">{index + 1}</td>
                  <td className="um-td">
                    {number.orderData.phoneNumbers.length > 0 ? (
                      <div className="um-ellipsis-copy">
                        <span className="um-ellipsis-text">
                          {number.orderData.phoneNumbers.join(", ")}
                        </span>
                        <button
                          className="um-copy-btn"
                          onClick={() =>
                            copyToClipboard(
                              number.orderData.phoneNumbers.join("\n"),
                            )
                          }
                        >
                          📋
                        </button>
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td className="um-td">
                    {number.orderData.verificationCodes.length > 0 ? (
                      <div className="um-ellipsis-copy">
                        <span className="um-ellipsis-text">
                          {number.orderData.verificationCodes.join(", ")}
                        </span>
                        <button
                          className="um-copy-btn"
                          onClick={() =>
                            copyToClipboard(
                              number.orderData.verificationCodes.join(", "),
                            )
                          }
                        >
                          📋
                        </button>
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td className="um-td">{number.provider}</td>

                  <td className="um-td">
                    {FormatterHelper.formatCurrency(number.totalCost)}
                  </td>
                  <td className="um-td">
                    <span className={`um-status-badge ${number.status}`}>
                      {number.status}
                    </span>
                  </td>
                  <td className="um-td">
                    {FormatterHelper.formatDateToLocal(number.orderedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="ph-state-row">
            <div className="ph-spinner" />
            <span className="ph-state-text">Fetching records…</span>
          </div>
        )}
        {/* Empty result */}
        {!isLoading && filterednumbers.length === 0 && (
          <div className="ph-state-row">
            <div className="ph-state-icon">⊟</div>
            <span className="ph-state-text">No records found</span>
          </div>
        )}

        {!isLoading && (
          <Paginations
            page={pageNo}
            rowsPerPage={pageSize}
            count={count}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
          />
        )}
      </div>
    </div>
  );
}
