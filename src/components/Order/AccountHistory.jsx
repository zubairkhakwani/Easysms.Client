//React
import { useState, useEffect } from "react";

//Services
import { getMyAccountHistory } from "../../services/Order/Order";

//Helper
import { FormatterHelper } from "../../helper/FormatterHelper";

//Toaster
import { successTaost, errorToast } from "../../helper/Toaster";

//Css
import "./AccountHistory.css";

export default function AccountHistory() {
  const [accountHistory, setAccountHistory] = useState([]);
  const [filteredAccountHistory, setFilteredAccountHistory] = useState([]);

  useEffect(() => {
    const fetchMyAccountHistory = async () => {
      try {
        const res = await getMyAccountHistory();
        let responseData = res.data ?? [];
        setAccountHistory(responseData);
        setFilteredAccountHistory(responseData);
      } catch {
        errorToast("Failed to fetch account history");
      }
    };
    fetchMyAccountHistory();
  }, []);

  function handleSearch(keyword) {
    const filtered = accountHistory.filter(
      (account) =>
        account.categoryName.toLowerCase().includes(keyword.toLowerCase()) ||
        account.platformName.toLowerCase().includes(keyword.toLowerCase()) ||
        account.gender.toLowerCase().includes(keyword.toLowerCase()) ||
        account.registrationCountry
          .toLowerCase()
          .includes(keyword.toLowerCase()),
    );

    setFilteredAccountHistory(filtered);
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
      label: "Total accounts",
      val: accountHistory?.length ?? 0,
    },

    {
      label: "Total Cost",
      val: FormatterHelper.formatCurrency(
        accountHistory?.reduce((sum, x) => sum + (x.totalCost || 0), 0) ?? 0,
      ),
    },
  ];

  return (
    <div className="um-page">
      <div className="um-header">
        <div>
          <div className="um-page-title">Account History</div>
          <div className="um-page-sub">View all your purchased accounts</div>
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
          <span className="um-table-title">All Accounts</span>
          <input
            className="um-search-input"
            placeholder="🔍  Search accounts..."
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <table className="um-table">
          <thead>
            <tr>
              {[
                "#",
                "Account",
                "Platform",
                "Category",
                "Registration country",
                "Gender",
                "Registration Method",
                "Market place",
                "Total Cost",
                "Ordered At",
              ].map((h) => (
                <th key={h} className="um-th">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredAccountHistory.map((account, index) => (
              <tr key={index} className="um-tr">
                <td className="um-td">{index + 1}</td>
                <td className="um-td">
                  {account.accountsData.length > 0 ? (
                    <div className="um-ellipsis-copy">
                      <span className="um-ellipsis-text">
                        {account.accountsData.map((a) => a.userName).join(", ")}
                      </span>
                      <button
                        className="um-copy-btn"
                        onClick={() =>
                          copyToClipboard(
                            account.accountsData
                              .map((a) => a.userName)
                              .join("\n"),
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

                <td className="um-td">{account.platformName}</td>
                <td className="um-td">{account.categoryName}</td>
                <td className="um-td">{account.registrationCountry}</td>
                <td className="um-td">{account.gender}</td>
                <td className="um-td">
                  {account.registrationMethod
                    ? account.registrationMethod
                    : "-"}
                </td>
                <td className="um-td">
                  {account.marketPlaceVerficationCountry
                    ? account.marketPlaceVerficationCountry
                    : "-"}
                </td>
                <td className="um-td">
                  {FormatterHelper.formatCurrency(account.totalCost)}
                </td>
                <td className="um-td">
                  {FormatterHelper.formatDateToLocal(account.orderedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAccountHistory.length === 0 && (
          <div className="um-empty">No accounts found.</div>
        )}
      </div>
    </div>
  );
}
