import { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Topbar/Topbar";
import { Outlet } from "react-router-dom";

export default function AdminDashobard() {
  const [activePage, setActivePage] = useState("overview");
  const [isSideBarOpen, setSidebarOpen] = useState(false);

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
      />
      <div className={`dashboard-main ${isSideBarOpen ? "collapsed" : ""}`}>
        <Topbar
          activePage={activePage}
          isSideBarOpened={isSideBarOpen}
          setSideBarOpened={handleSideBarOpen}
        />
        <Outlet></Outlet>
      </div>
    </div>
  );
}
