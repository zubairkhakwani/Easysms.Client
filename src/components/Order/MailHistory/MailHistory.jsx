//React
import { useState, useEffect } from "react";

//Services
import { getMyMailHistory } from "../../../services/Order/Order";

//Helper
import { FormatterHelper } from "../../../helper/FormatterHelper";
import { CopyToClipboard } from "../../../helper/UtilityHelper";

//Toaster
import { errorToast } from "../../../helper/Toaster";

//Paginations
import Paginations from "../../Shared/Pagination";

export default function MailHistory() {
  //Data
  const [mailHistory, setMailHistory] = useState([]);

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

  const fetchMyMailHistory = async () => {
    setIsLoading(true);
    try {
      const res = await getMyMailHistory({ pageNo, pageSize, filters });
      setMailHistory(res.data.items ?? []);
      setCount(res.data.count ?? 0);
    } catch {
      errorToast("Failed to fetch mail history");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyMailHistory();
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
      label: "Total mails",
      val: mailHistory?.length ?? 0,
    },

    {
      label: "Total Cost",
      val: FormatterHelper.formatCurrency(
        mailHistory?.reduce((sum, x) => sum + (x.totalCost || 0), 0) ?? 0,
      ),
    },
  ];

  return (
    <div className="um-page">
      <div className="um-header">
        <div>
          <div className="um-page-title">Mail History</div>
          <div className="um-page-sub">View all your purchased mails</div>
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
          <span className="um-table-title">All Mails</span>
          <input
            className="adm-search-input"
            placeholder="🔍  Search mails..."
            onChange={(e) => setFilter("keyword", e.target.value)}
          />
        </div>

        <table className="um-table">
          <thead>
            <tr>
              {[
                "#",
                "Mails",
                "Service",
                "Domain",
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
              {mailHistory.map((mail, index) => {
                const mails = mail.data.map((a) => a.mail);
                const mailText = mails.join(", ");
                const mailCopyText = mails.join("\n");

                return (
                  <tr key={index} className="um-tr">
                    <td className="um-td">{index + 1}</td>

                    <td className="um-td">
                      {mails.length > 0 ? (
                        <div className="um-ellipsis-copy">
                          <span className="um-ellipsis-text">{mailText}</span>

                          <button
                            className="um-copy-btn"
                            onClick={() => CopyToClipboard("Mail", mailCopyText)}
                          >
                            📋
                          </button>
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td className="um-td">{mail.service}</td>

                    <td className="um-td">{mail.domain}</td>

                    <td className="um-td">
                      {FormatterHelper.formatCurrency(mail.totalCost)}
                    </td>

                    <td className="um-td">
                      {FormatterHelper.formatDateToLocal(mail.orderedAt)}
                    </td>
                  </tr>
                );
              })}
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
        {!isLoading && mailHistory.length === 0 && (
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
