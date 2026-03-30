//React
import { Link } from "react-router-dom";

//Helper
import { navItems } from "../../../../data/Admin/Static";

//Css
import "./Sidebar.css";

export default function Sidebar({
  activePage,
  setActivePage,
  isBarClosed,
  onSideBarClosed,
}) {
  return (
    <aside className={`sidebar ${isBarClosed ? "hidden" : ""}`}>
      <div className="sidebar-logo">
        <Link to="/" className="sidebar-logo-anchor">
          <div className="sidebar-logo-icon">A</div>
          <div className="sidebar-logo-text">
            <span className="sidebar-logo-name">AdminCore</span>
            <span className="sidebar-logo-tag">Dashboard</span>
          </div>
        </Link>
      </div>
      <div
        className={`adm-close `}
        aria-label="Toggle menu"
        onClick={onSideBarClosed}
      >
        <span className="adm-close-bar" />
        <span className="adm-close-bar" />
        <span className="adm-close-bar" />
      </div>
      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((section) => (
          <div key={section.section}>
            <p className="nav-section-label">{section.section}</p>
            {section.items.map((item) => (
              <Link to={item.url}>
                <span
                  key={item.id}
                  className={`nav-item ${activePage === item.id ? "active" : ""}`}
                  onClick={() => setActivePage(item.id)}
                >
                  <span className="nav-item-icon">{item.icon}</span>
                  {item.label}
                  {item.badge && (
                    <span className="nav-item-badge">{item.badge}</span>
                  )}
                </span>
              </Link>
            ))}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="sidebar-user">
        <div className="sidebar-user-avatar">SA</div>
        <div className="sidebar-user-info">
          <p className="sidebar-user-name">Super Admin</p>
          <p className="sidebar-user-role">Administrator</p>
        </div>
        <button className="sidebar-logout-btn" title="Logout">
          ⎋
        </button>
      </div>
    </aside>
  );
}
