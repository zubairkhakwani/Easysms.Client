// React
import { useState, useEffect } from "react";

// Services
import { getMyNumberHistory } from "../../services/Order/Order";

// Helper
import { FormatterHelper } from "../../helper/FormatterHelper";

// Toaster
import { successTaost, errorToast } from "../../helper/Toaster";

// CSS
import "./NumberHistory.css";

export default function NumberHistory() {
  const [ordersData, setOrdersData] = useState([]);
  const [filteredNumbers, setFilteredNumbers] = useState([]);

  useEffect(() => {
    const fetchAllMyNumbers = async () => {
      try {
        const res = await getMyNumberHistory();
        setOrdersData(res.data);
        setFilteredNumbers(res.data);
      } catch {
        errorToast("Failed to fetch number history");
      }
    };
    fetchAllMyNumbers();
  }, []);

  function handleSearch(keyword) {
    const filtered = ordersData.filter((order) =>
      order.orderData.phoneNumbers.some((num) =>
        num.toLowerCase().includes(keyword.toLowerCase()),
      ),
    );

    setFilteredNumbers(filtered);
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

  const stats = [
    {
      label: "Total numbers",
      val: ordersData.flatMap((o) => o.orderData?.phoneNumbers || []).length,
    },
    {
      label: "Total Active",
      val: ordersData
        .flatMap((o) => o.orderData?.status || [])
        .filter((s) => s === "Active").length,
    },
    {
      label: "Total Completed",
      val: ordersData
        .flatMap((o) => o.orderData?.status || [])
        .filter((s) => s === "Completed").length,
    },
    {
      label: "Total Cancelled",
      val: ordersData
        .flatMap((o) => o.orderData?.status || [])
        .filter((s) => s === "Cancelled").length,
    },
    {
      label: "Total Otps",
      val: ordersData.flatMap((o) => o.orderData?.verificationCodes || [])
        .length,
    },
  ];

  return (
    <div className="nh-page">
      <div className="nh-header">
        <div>
          <div className="nh-page-title">Number History</div>
          <div className="nh-page-sub">
            View all your purchased numbers and their activation status
          </div>
        </div>
      </div>

      <div className="nh-stats-row">
        {stats.map((s) => (
          <div key={s.label} className="nh-stat-card">
            <div className="nh-stat-val">{s.val}</div>
            <div className="nh-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="nh-table-wrap">
        <div className="nh-table-header">
          <span className="nh-table-title">All numbers</span>

          <input
            className="nh-search-input"
            placeholder="🔍 Search numbers..."
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <table className="nh-table">
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
                <th key={h} className="nh-th">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredNumbers.map((number, index) => (
              <tr key={index} className="nh-tr">
                <td className="nh-td">{index + 1}</td>

                <td className="nh-td">
                  {number.orderData.phoneNumbers.length > 0 ? (
                    <div className="nh-ellipsis-copy">
                      <span className="nh-ellipsis-text">
                        {number.orderData.phoneNumbers.join(", ")}
                      </span>
                      <button
                        className="nh-copy-btn"
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

                <td className="nh-td">
                  {number.orderData.verificationCodes.length > 0 ? (
                    <div className="nh-ellipsis-copy">
                      <span className="nh-ellipsis-text">
                        {number.orderData.verificationCodes.join(", ")}
                      </span>
                      <button
                        className="nh-copy-btn"
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

                <td className="nh-td">{number.provider}</td>

                <td className="nh-td">
                  {FormatterHelper.formatCurrency(number.totalCost)}
                </td>

                <td className="nh-td">
                  <span
                    className={`nh-status-badge nh-status--${number.status.toLowerCase()}`}
                  >
                    {number.status}
                  </span>
                </td>

                <td className="nh-td">
                  {FormatterHelper.formatDateToLocal(number.orderedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredNumbers.length === 0 && (
          <div className="nh-empty">No numbers found.</div>
        )}
      </div>
    </div>
  );
}
