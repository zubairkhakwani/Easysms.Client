//Css
import "./Topbar.css";
export default function Topbar({
  activePage,
  isSideBarOpened,
  setSideBarOpened,
}) {
  const pageTitles = {
    overview: { title: "Overview", sub: "Real-time insights & key metrics" },
    analytics: { title: "Analytics", sub: "Detailed performance analytics" },
    reports: { title: "Reports", sub: "Generate & export reports" },
    physicalNumber: {
      title: "Physical Numbers",
      sub: "Manage USA/Canada physical numbers",
    },
    transactions: { title: "Transactions", sub: "Transaction history & logs" },
    "otp-logs": { title: "OTP Logs", sub: "Delivery logs & statuses" },
    users: { title: "Users", sub: "User management" },
    activationHistory: {
      title: "Provider Activation History",
      sub: "View detailed activation history with all relevant columns for insights",
    },

    activeNumbers: {
      title: "Active Numbers",
      sub: "View all active numbers in real-time. Numbers appear here when purchased and are removed if cancelled.",
    },
    deposits: {
      title: "User Deposits",
      sub: "View all deposits made by users in real-time. Admin-added deposits appear here with details including the amount, date, and responsible admin.",
    },
  };

  const page = pageTitles[activePage] || pageTitles.overview;

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <header className="topbar">
      <div
        className={`adm-hamburger `}
        onClick={setSideBarOpened}
        aria-label="Toggle menu"
      >
        <span className="adm-bar" />
        <span className="adm-bar" />
        <span className="adm-bar" />
      </div>
      <div className="topbar-left">
        <span className="topbar-title">{page.title}</span>
        <span className="topbar-subtitle">{page.sub}</span>
      </div>
      <div className="topbar-right">
        <span className="topbar-date">{dateStr}</span>
        <div className="topbar-notification">
          🔔
          <span className="notif-dot" />
        </div>
      </div>
    </header>
  );
}
