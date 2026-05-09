//React
import { useState, useEffect } from "react";

//Services
import { getMyAccountHistory } from "../../../services/Order/Order";

//Helper
import { FormatterHelper } from "../../../helper/FormatterHelper";

//Toaster
import { errorToast } from "../../../helper/Toaster";

import { DownloadPurchaseReceipt } from "../../../helper/DownloadPurchaseReceipt";

//Paginations
import Paginations from "../../Shared/Pagination";

//Css
import "./AccountHistory.css";

export default function AccountHistory() {
  //Data
  const [accountHistory, setAccountHistory] = useState([]);

  //Loading
  const [isLoading, setIsLoading] = useState(false);

  //Pagination
  const [count, setCount] = useState(0);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  //filter
  const [filters, setFilters] = useState({
    keyword: "",
  });

  const fetchMyAccountHistory = async () => {
    setIsLoading(true);
    try {
      const res = await getMyAccountHistory({ pageNo, pageSize, filters });
      setAccountHistory(res.data.items ?? []);
      setCount(res.data.count ?? 0);
    } catch {
      errorToast("Failed to fetch account history");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyAccountHistory();
  }, [pageNo, pageSize, filters.keyword]);

  function setFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }
  const handleChangePage = (event, newPage) => {
    setPageNo(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPageNo(0);
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
            className="adm-search-input"
            placeholder="🔍  Search accounts..."
            onChange={(e) => setFilter("keyword", e.target.value)}
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
                "Total Cost",
                "Ordered At",
              ].map((h) => (
                <th key={h} className="um-th">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          {!isLoading && (
            <tbody>
              {accountHistory.map((account, index) => (
                <tr key={index} className="um-tr">
                  <td className="um-td">{index + 1}</td>
                  <td className="um-td">
                    {account.accounts.length > 0 ? (
                      <div className="um-ellipsis-copy">
                        <span className="um-ellipsis-text">
                          {account.accounts.map((a) => a.data).join(", ")}
                        </span>
                        <button
                          className="um-copy-btn"
                          onClick={() => DownloadPurchaseReceipt(account)}
                        >
                          <i className="fa-solid fa-download"></i>
                        </button>
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="um-td">{account.platformName}</td>
                  <td className="um-td">{account.categoryName}</td>
                  <td className="um-td">
                    {FormatterHelper.formatCurrency(account.totalCost)}
                  </td>
                  <td className="um-td">
                    {FormatterHelper.formatDateToLocal(account.orderedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>

        {/* Loading */}
        {isLoading && (
          <div className="ph-state-row">
            <div className="ph-spinner  ph-spinner--lg ph-spinner-thick ph-spinner--light" />
            <span className="ph-state-text">Fetching records…</span>
          </div>
        )}
        {/* Empty result */}
        {!isLoading && accountHistory.length === 0 && (
          <div className="ph-state-row">
            <div className="ph-state-icon">⊟</div>
            <span className="ph-state-text">
              No records found for the selected filters
            </span>
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
