export default function Topbar({ activePage }) {
  const pageTitles = {
    overview: { title: "Overview", sub: "Real-time insights & key metrics" },
    analytics: { title: "Analytics", sub: "Detailed performance analytics" },
    reports: { title: "Reports", sub: "Generate & export reports" },
    providers: { title: "Providers", sub: "Manage provider accounts" },
    transactions: { title: "Transactions", sub: "Transaction history & logs" },
    "otp-logs": { title: "OTP Logs", sub: "Delivery logs & statuses" },
    users: { title: "Users", sub: "User management" },
    settings: { title: "Settings", sub: "System configuration" },
    audit: { title: "Audit Logs", sub: "System audit trail" },
    "api-keys": { title: "API Keys", sub: "Manage API credentials" },
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
