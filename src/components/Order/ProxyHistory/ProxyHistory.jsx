//React
import { useState, useEffect } from "react";

//Services
import {
  getMyActiveProxies,
  changeAuth,
} from "../../../services/Proxy/ProxyService";

//Helper
import { FormatterHelper } from "../../../helper/FormatterHelper";
import { copyAndDownloadTextFile } from "../../../helper/UtilityHelper";

//DropDown
import { ActionDropdown } from "../../Helper/ProxyHistory/DropwDown/ActionDropDown";

//Toaster
import { errorToast, successTaost } from "../../../helper/Toaster";

//Modal Keys
import { modalKeys } from "../../../data/Static";

//Modals
import { ProxyAuthChangeModal } from "../../Helper/Modals/Proxy/ProxyAuthChangeModal";

//Paginations
import Paginations from "../../Shared/Pagination";

export default function ProxyHistory() {
  //Data
  const [myActiveProxies, setMyActiveProxies] = useState([]);
  const [myProxyAuth, setMyProxyAuth] = useState({
    orderNumber: "",
    login: "",
    password: "",
    ip: "",
  });

  //Loading
  const [isLoading, setIsLoading] = useState(false);
  const [isChangingAuth, setIsChangingAuth] = useState(false);

  //Pagination
  const [count, setCount] = useState(0);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  //filter
  const [filters, setFilters] = useState({
    keyword: "",
  });

  //Modals
  const [modals, setModals] = useState(null);

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

  //Handle Actions
  function handleActions(key, orderNumber) {
    if (key === modalKeys.exportProxy) {
      handleExport(orderNumber);
    } else if (key === modalKeys.proxyAuthChange) {
      populateProxyAuthChange(orderNumber);
      openModal(key);
    }
  }

  //Handle Export
  function handleExport(orderNumber) {
    const proxy = myActiveProxies?.find((x) => x.orderNumber === orderNumber);

    if (!proxy) {
      console.warn("Proxy not found:", orderNumber);
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

  //Populate modal to change proxy auth
  function populateProxyAuthChange(orderNumber) {
    let proxy = myActiveProxies.find((x) => x.orderNumber == orderNumber);
    if (proxy) {
      setMyProxyAuth({
        orderNumber: orderNumber,
        login: proxy.login,
        password: proxy.password,
        ip: proxy.ip,
      });
    } else {
      setMyProxyAuth({
        orderNumber: "",
        login: "",
        password: "",
        ip: "",
      });
    }
  }

  //Open Modal
  function openModal(key) {
    setModals(key);
  }

  //Close Modal
  function closeModal() {
    setModals(null);
  }

  //Handle Change Auth
  async function handleChangeAuth(request) {
    setIsChangingAuth(true);
    let response = await changeAuth(request);
    if (response.isSuccess) {
      successTaost(response.message);
    } else {
      errorToast(response.message);
    }

    try {
    } catch {
      errorToast("Failed to change proxy auth, please try later.");
    } finally {
      setIsChangingAuth(false);
    }
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
                          orderNumber={item.orderNumber}
                          onAction={handleActions}
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
      {modals === modalKeys.proxyAuthChange && (
        <ProxyAuthChangeModal
          onClose={closeModal}
          onConfirm={handleChangeAuth}
          isChanging={isChangingAuth}
          myProxyAuth={myProxyAuth}
        />
      )}
    </>
  );
}
