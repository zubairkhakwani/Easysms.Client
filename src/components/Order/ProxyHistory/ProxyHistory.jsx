//React
import { useState, useEffect } from "react";

//Services
import {
  getProxyMetaData,
  getMyActiveProxies,
  changeAuth,
  replaceIps,
  renewProxyOrder,
} from "../../../services/Proxy/ProxyService";

//Helper
import { FormatterHelper } from "../../../helper/FormatterHelper";
import { copyAndDownloadTextFile } from "../../../helper/UtilityHelper";

//Toaster
import { errorToast, successTaost } from "../../../helper/Toaster";

//Modal Keys
import { modalKeys } from "../../../data/Static";

//Modals
import { ProxyAuthChangeModal } from "../../Helper/Modals/Proxy/ProxyAuthChangeModal";
import { ProxyIpConfirm } from "../../Helper/Modals/Proxy/ProxyIpConfirm";
import { ProxyExtendModal } from "../../Helper/Modals/Proxy/ProxyExtendModal";

//Components
import { ProxyOrderGroup } from "../../Helper/Proxy/ProxyOrderGroup";

//Paginations
import Paginations from "../../Shared/Pagination";

//Css
import "./ProxyHistory.css";
import Modal from "@mui/material/Modal";

export default function ProxyHistory() {
  //Data
  const [myActiveProxies, setMyActiveProxies] = useState([]);
  const [metaData, setMetaData] = useState([]);
  const [myProxyAuth, setMyProxyAuth] = useState({
    orderNumber: "",
    login: "",
    password: "",
    authIp: "",
  });

  const [IpIds, setIpIds] = useState([]);

  //Loading
  const [isLoading, setIsLoading] = useState(false);
  const [isChangingAuth, setIsChangingAuth] = useState(false);
  const [isReplacingIps, setIsReplacingIps] = useState(false);
  const [isExtendingProxy, setIsExtedingProxy] = useState(false);

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

  //Load Proxy MetaData from the API
  const fetchProxyMetaData = async () => {
    let metaData = [];

    try {
      metaData = await getProxyMetaData();
    } catch {
      errorToast("Failed to fetch proxy metadata, please try later.");
    } finally {
      setMetaData(metaData);
    }
  };

  useEffect(() => {
    fetchProxyMetaData();
  }, []);

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
    //when replacing ip or extending proxy here we will recieve id with underscore e.g 123456_2 for order number
    if (key === modalKeys.exportProxy) {
      handleExport(orderNumber);
      return;
    } else if (key === modalKeys.proxyAuthChange) {
      populateProxyAuthChange(orderNumber);
    } else if (key === modalKeys.replaceIp || key === modalKeys.extendProxy) {
      setIpIds([orderNumber]);
    }
    openModal(key);
  }

  //Handle Export
  function handleExport(orderNumber) {
    const order = myActiveProxies?.find((x) => x.orderNumber === orderNumber);

    if (!order) {
      console.warn("Order not found:", orderNumber);
      return;
    }

    const proxies = order.proxies ?? [];

    if (proxies.length === 0) {
      console.warn("No proxies in order:", orderNumber);
      return;
    }

    const text = proxies
      .map(
        (proxy, idx) =>
          `# Proxy ${idx + 1}
IP:       ${proxy.ip}
HTTP Port:  ${proxy.portHttp}
SOCKS Port: ${proxy.portSocks}
Login:    ${proxy.login || "—"}
Password: ${proxy.password || "—"}
WhiteList IP: ${proxy.authIp || "—"}
Country:  ${proxy.country}
Starts:   ${proxy.startDate}
Expires:  ${proxy.endDate}`,
      )
      .join("\n\n---\n\n");

    const fileContent = `# Order #${orderNumber}
# Total Proxies: ${proxies.length}
# Exported: ${new Date().toLocaleString()}

${"=".repeat(40)}

${text}`;

    copyAndDownloadTextFile(
      `proxies_order_${orderNumber}`,
      fileContent,
      "proxy",
    );
  }

  //Populate modal to change proxy auth
  function populateProxyAuthChange(orderNumber) {
    const order = myActiveProxies?.find((x) => x.orderNumber === orderNumber);
    const proxy = order?.proxies?.[0];

    if (proxy) {
      setMyProxyAuth({
        orderNumber: orderNumber,
        login: proxy.login,
        password: proxy.password,
        authIp: proxy.authIp,
      });
    } else {
      setMyProxyAuth({
        orderNumber: "",
        login: "",
        password: "",
        authIp: "",
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

    try {
      let response = await changeAuth(request);
      let responseData = response.data;
      if (response.isSuccess) {
        setModals(null);
        successTaost(response.message);
      } else {
        errorToast(response.message);
      }
      setMyActiveProxies((prev) =>
        prev.map((order) => {
          if (order.orderNumber !== responseData.orderNumber) return order;

          return {
            ...order,
            proxies: order.proxies.map((proxy) => ({
              ...proxy,
              ...(responseData.login && { login: responseData.login }),
              ...(responseData.password && { password: responseData.password }),
              ...(responseData.ip && { authIp: responseData.ip }),
            })),
          };
        }),
      );
    } catch {
      errorToast("Failed to change proxy auth, please try later.");
    } finally {
      setIsChangingAuth(false);
    }
  }

  //Handle Replace IP
  async function handleReplaceIp(request) {
    const payload = {
      ...{ ids: IpIds },
      ...{ ...request },
    };

    setIsReplacingIps(true);

    try {
      let response = await replaceIps(payload);
      if (response.isSuccess) {
        setModals(null);
        successTaost(response.message);
      } else {
        errorToast(response.message);
      }
    } catch {
      errorToast("Failed to change ip, please try later.");
    } finally {
      setIsReplacingIps(false);
    }
  }

  //Handle Exptend Proxy
  async function handleExtendProxy(request) {
    const payload = {
      ...{ ids: IpIds },
      ...{ ...request },
    };

    setIsExtedingProxy(true);

    try {
      let response = await renewProxyOrder(payload);
      if (response.isSuccess) {
        setModals(null);
        successTaost(response.message);
      } else {
        errorToast(response.message);
      }
    } catch {
      errorToast("Failed to extend proxy, please try later.");
    } finally {
      setIsExtedingProxy(false);
    }
  }

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

        <div className="map__wrap">
          <div className="map__panel-header">
            <span className="map__panel-title">Active Proxies</span>
            <span className="map__panel-count">
              {myActiveProxies.length} order
              {myActiveProxies.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="ph-state-row">
              <div className="ph-spinner ph-spinner--lg ph-spinner-thick ph-spinner--light" />
              <span className="ph-state-text">Fetching records…</span>
            </div>
          )}

          {/* Empty */}
          {!isLoading && myActiveProxies.length === 0 && (
            <div className="ph-state-row">
              <div className="ph-state-icon">⊟</div>
              <span className="ph-state-text">
                No records found for the selected filters
              </span>
            </div>
          )}

          {/* Order groups */}
          {!isLoading &&
            myActiveProxies.map((order) => (
              <ProxyOrderGroup
                key={order.orderNumber}
                order={order}
                onAction={handleActions}
              />
            ))}

          {!isLoading && myActiveProxies.length > 0 && (
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
      {modals === modalKeys.replaceIp && (
        <ProxyIpConfirm
          onClose={closeModal}
          onConfirm={handleReplaceIp}
          isSubmitting={isReplacingIps}
        />
      )}

      {modals === modalKeys.extendProxy && (
        <ProxyExtendModal
          metaData={metaData}
          ids={IpIds}
          isSubmitting={isExtendingProxy}
          onClose={closeModal}
          onConfirm={handleExtendProxy}
        />
      )}
    </>
  );
}
