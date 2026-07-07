import { useCallback, useEffect, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Topbar/Topbar";
import { Outlet } from "react-router-dom";
import { getUnresolvedIpReplacementCount } from "../../../../services/Proxy/ProxyService";
import { getUnreadContactUsCount } from "../../../../services/ContactUs/ContactUsService";
import "./AdminShared.css";

export default function AdminDashobard() {
  const [activePage, setActivePage] = useState("overview");
  const [isSideBarOpen, setSidebarOpen] = useState(true);
  const [unresolvedLedgerCount, setUnresolvedLedgerCount] = useState(0);
  const [unreadContactUsCount, setUnreadContactUsCount] = useState(0);

  const refreshUnresolvedLedgerCount = useCallback(async () => {
    try {
      const response = await getUnresolvedIpReplacementCount();
      if (response.isSuccess) {
        setUnresolvedLedgerCount(response.data?.count ?? 0);
      }
    } catch {
      // Sidebar badge is non-critical; fail silently.
    }
  }, []);

  const refreshUnreadContactUsCount = useCallback(async () => {
    try {
      const response = await getUnreadContactUsCount();
      if (response.isSuccess) {
        setUnreadContactUsCount(response.data?.count ?? 0);
      }
    } catch {
      // Sidebar badge is non-critical; fail silently.
    }
  }, []);

  useEffect(() => {
    refreshUnresolvedLedgerCount();
    refreshUnreadContactUsCount();
  }, [refreshUnresolvedLedgerCount, refreshUnreadContactUsCount]);

  function handleSideBarClosed() {
    setSidebarOpen(true);
  }

  function handleActivePage(page) {
    setActivePage(page);

    if (window.innerWidth <= 860) {
      handleSideBarClosed();
    }
  }

  function handleSideBarOpen() {
    setSidebarOpen(false);
  }

  return (
    <div className={`dashboard-layout`}>
      <Sidebar
        activePage={activePage}
        setActivePage={handleActivePage}
        isBarClosed={isSideBarOpen}
        onSideBarClosed={handleSideBarClosed}
        unresolvedLedgerCount={unresolvedLedgerCount}
        unreadContactUsCount={unreadContactUsCount}
      />
      <div className={`dashboard-main ${isSideBarOpen ? "collapsed" : ""}`}>
        <Topbar
          activePage={activePage}
          isSideBarOpened={isSideBarOpen}
          setSideBarOpened={handleSideBarOpen}
        />
        <Outlet context={{ refreshUnresolvedLedgerCount, refreshUnreadContactUsCount }} />
      </div>
    </div>
  );
}
