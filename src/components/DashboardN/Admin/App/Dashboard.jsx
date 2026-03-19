import { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Topbar/Topbar";
import { Outlet } from "react-router-dom";

export default function AdminDashobard() {
  const [activePage, setActivePage] = useState("overview");

  return (
    <div className="dashboard-layout">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="dashboard-main">
        <Topbar activePage={activePage} />
        <Outlet></Outlet>
      </div>
    </div>
  );
}
