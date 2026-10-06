import LogoutButton from "./LogoutButton";

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: "▦" },
  { id: "datasets", label: "Datasets", icon: "▤" },
  { id: "upload", label: "Upload Dataset", icon: "↑" },
  { id: "validation", label: "Validation", icon: "✓" },
];

function Sidebar({ page, setPage, onLogout, username }) {
  const displayName = username || "User";
  const initial = displayName.charAt(0).toUpperCase();

  const activePage = page === "dataset-detail" ? "datasets" : page;

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">D</div>

        <div>
          <strong>DataGuard</strong>
          <p>Data Quality Platform</p>
        </div>
      </div>

      <div className="sidebar-section-label">WORKSPACE</div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`sidebar-link ${activePage === item.id ? "active" : ""}`}
            onClick={() => setPage(item.id)}
            aria-current={activePage === item.id ? "page" : undefined}
          >
            <span aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-user">
          <div className="user-avatar">{initial}</div>

          <div className="sidebar-user-info">
            <strong>{displayName}</strong>
            <span>Workspace member</span>
          </div>
        </div>

        <LogoutButton onLogout={onLogout} className="logout-link" />
      </div>
    </aside>
  );
}

export default Sidebar;
