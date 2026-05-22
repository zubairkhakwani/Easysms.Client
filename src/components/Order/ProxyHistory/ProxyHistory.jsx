//React
import { useState, useEffect } from "react";

//Services
import { getMyActiveProxies } from "../../../services/Proxy/ProxyService";

//Helper
import { FormatterHelper } from "../../../helper/FormatterHelper";
import { copyAndDownloadTextFile } from "../../../helper/UtilityHelper";

//DropDown
import { ActionDropdown } from "../../Helper/ProxyHistory/DropwDown/ActionDropDown";

//Toaster
import { errorToast } from "../../../helper/Toaster";

//Paginations
import Paginations from "../../Shared/Pagination";

export default function ProxyHistory() {
  //Data
  const [myActiveProxies, setMyActiveProxies] = useState([]);

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

  //Fetch active proxies
  const fetchMyActiveProxies = async () => {
    setIsLoading(true);
    try {
      const res = await getMyActiveProxies({ pageNo, pageSize, filters });
      setMyActiveProxies(res.data.items ?? []);
      setCount(res.data.count ?? 0);
    } catch {
      errorToast("Failed to fetch active proxies.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyActiveProxies();
  }, [pageNo, pageSize, filters.keyword]);

  //Set Filter
  function setFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  //Handle Paginations
  const handleChangePage = (event, newPage) => {
    setPageNo(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPageNo(0);
  };

  function handleExport(key, proxyId) {
    const proxy = myActiveProxies?.find((x) => x.id === proxyId);

    if (!proxy) {
      console.warn("Proxy not found:", proxyId);
      return;
    }
    let text = `
IP: ${proxy.ip}
HTTP Port: ${proxy.portHttp}
SOCKS Port: ${proxy.portSocks}
Login: ${proxy.login}
Password: ${proxy.password}
`.trim();

    copyAndDownloadTextFile(`proxy_${proxy.ip}`, text, "proxy");
  }

  //   const stats = [
  //     {
  //       label: "Total mails",
  //       val: myActiveProxies?.length ?? 0,
  //     },

  //     {
  //       label: "Total Cost",
  //       val: FormatterHelper.formatCurrency(
  //         myActiveProxies?.reduce((sum, x) => sum + (x.totalCost || 0), 0) ?? 0,
  //       ),
  //     },
  //   ];

  return (
    <>
      <div className="um-page">
        <div className="um-header">
          <div>
            <div className="um-page-title">My Active Proxies</div>
            <div className="um-page-sub">
              View your purchased active proxies
            </div>
          </div>
        </div>

        {/* <div className="um-stats-row">
        {stats.map((s) => (
          <div key={s.label} className="um-stat-card">
            <div className="um-stat-val">{s.val}</div>
            <div className="um-stat-label">{s.label}</div>
          </div>
        ))}
      </div> */}

        <div className="um-table-wrap">
          <div className="um-table-header">
            <span className="um-table-title">Active Proxies</span>
            {/* <input
            className="adm-search-input"
            placeholder="🔍  Search proxies..."
            onChange={(e) => setFilter("keyword", e.target.value)}
          /> */}
          </div>

          <table className="um-table">
            <thead>
              <tr>
                {[
                  "#",
                  "IP",
                  "Port HTTP",
                  "Port SOCKS",
                  "User Name",
                  "Password",
                  "Country",
                  "Status",
                  "Start Date",
                  "End Date",
                  "Actions",
                ].map((h) => (
                  <th key={h} className="um-th">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            {!isLoading && (
              <tbody>
                {myActiveProxies.map((item, index) => {
                  return (
                    <tr key={index} className="um-tr">
                      <td className="um-td">{index + 1}</td>
                      <td className="um-td">{item.ip}</td>
                      <td className="um-td">{item.portHttp}</td>
                      <td className="um-td">{item.portSocks}</td>
                      <td className="um-td">{item.login}</td>
                      <td className="um-td">{item.password}</td>
                      <td className="um-td">{item.country}</td>
                      <td className="um-td">{item.status}</td>
                      <td className="um-td">
                        {FormatterHelper.formatDateToLocal(item.startDate)}
                      </td>
                      <td className="um-td">
                        {FormatterHelper.formatDateToLocal(item.endDate)}
                      </td>
                      <td className="um-td">
                        <ActionDropdown
                          proxyId={item.id}
                          onAction={handleExport}
                        />
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
          {!isLoading && myActiveProxies.length === 0 && (
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
      {/* {modal?.type === "topup" && (
        <TopupModal
          user={modal.user}
          isTopUp={isTopup}
          onClose={closeModal}
          onConfirm={handleTopup}
        />
      )} */}
    </>
  );
}
