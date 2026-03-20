//React
import { useState, useEffect } from "react";

//Services
import { getMyOrderHistory } from "../../services/Order/Order";

//Helper
import { FormatterHelper } from "../../helper/FormatterHelper";

//Toaster
import { successTaost, errorToast } from "../../helper/Toaster";

//Css
import "./OrderHistory.css";

export default function OrderHistory() {
  const [ordersData, setOrdersData] = useState([]);
  const [filterednumbers, setFilterednumbers] = useState([]);

  useEffect(() => {
    const fetchAllMyNumbers = async () => {
      try {
        const res = await getMyOrderHistory();
        setOrdersData(res.data);
        setFilterednumbers(res.data);
      } catch (error) {
        console.error("Failed to fetch numbers:", error);
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
      <div className="um-header">
        <div>
          <div className="um-page-title">Order History</div>
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

        {filterednumbers.length === 0 && (
          <div className="um-empty">No numbers found.</div>
        )}
      </div>
    </div>
  );
}
