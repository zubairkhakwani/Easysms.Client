//React
import { useState, useEffect } from "react";

//Services
import { getMyNumbers } from "../../services/Number/NumberService";

//Helper
import { FormatterHelper } from "../../helper/FormatterHelper";

//Css
import "./PurchasedNumberHistory.css";

export default function PurchasedNumberHistory() {
  const [numbers, setnumbers] = useState([]);
  const [filterednumbers, setFilterednumbers] = useState([]);

  useEffect(() => {
    const fetchAllMyNumbers = async () => {
      try {
        const res = await getMyNumbers();
        setnumbers(res.data);
        setFilterednumbers(res.data);
      } catch (error) {
        console.error("Failed to fetch numbers:", error);
      }
    };
    fetchAllMyNumbers();
  }, []);

  function handleSearch(keyword) {
    let filterednumbers = numbers.filter(
      (u) =>
        u.phoneNumber.toLowerCase().includes(keyword.toLowerCase()) ||
        u.provider.toLowerCase().includes(keyword.toLowerCase()) ||
        u.service.toLowerCase().includes(keyword.toLowerCase()) ||
        u.country.toLowerCase().includes(keyword.toLowerCase()),
    );
    setFilterednumbers(filterednumbers);
  }

  const stats = [
    { label: "Total numbers", val: numbers.length },
    {
      label: "Total Active",
      val: numbers.filter((num) => num.status == "Active").length,
    },
    {
      label: "Total Completed",
      val: numbers.filter((num) => num.status == "Completed").length,
    },
    {
      label: "Total Cancelled",
      val: numbers.filter((num) => num.status == "Cancelled").length,
    },
    {
      label: "Total Spent",
      val: FormatterHelper.formatCurrency(
        numbers
          .filter((num) => num.status == "Active")
          .reduce((sum, u) => sum + u.activationCost, 0),
      ),
    },

    {
      label: "Total Otps",
      val: numbers.reduce((sum, u) => sum + u.totalVerificationCode, 0),
    },
  ];

  return (
    <div className="um-page">
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

        <table className="um-table">
          <thead>
            <tr>
              {[
                "Number",
                "Provider",
                "Service",
                "Country",
                "Price",
                "Total Otps",
                "Status",
                "Purchased At",
              ].map((h) => (
                <th key={h} className="um-th">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filterednumbers.map((number) => (
              <tr key={number.id} className="um-tr">
                <td className="um-td">
                  <div className="um-user-cell">
                    <div className="">
                      {FormatterHelper.formatPhoneNumber(number.phoneNumber)}
                    </div>
                  </div>
                </td>

                <td className="um-td">{number.provider}</td>

                <td className="um-td">{number.service}</td>

                <td className="um-td">{number.country}</td>
                <td className="um-td">
                  {FormatterHelper.formatCurrency(number.activationCost)}
                </td>
                <td className="um-td">
                  <span className="um-role-badge">
                    {number.totalVerificationCode}
                  </span>
                </td>
                <td className="um-td">
                  <span className={`um-status-badge ${number.status}`}>
                    {number.status}
                  </span>
                </td>
                <td className="um-td um-joined">{number.purchasedAt}</td>
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
