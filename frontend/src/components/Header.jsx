function Header({ lastUpdated }) {
  return (
    <header className="header">
      <div className="header-brand">
        <div className="header-logo">
          <span className="logo-mark">◈</span>
          <span className="logo-text">CloudOps<span className="logo-accent"> Monitor</span></span>
        </div>
        <span className="header-env">Production · Azure</span>
      </div>
      <div className="header-meta">
        <div className="header-status">
          <span className="status-dot status-dot--healthy"></span>
          <span className="status-label">All Systems Nominal</span>
        </div>
        <span className="header-timestamp">
          Updated {lastUpdated}
        </span>
      </div>
    </header>
  );
}

export default Header;
