function Header({ lastUpdated, systemHealth, loading }) {
  const status = systemHealth?.status ?? 'unknown';
  const statusText = loading
    ? 'CONNECTING'
    : status === 'critical'
    ? 'CRITICAL'
    : status === 'warning'
    ? 'DEGRADED'
    : status === 'healthy'
    ? 'NOMINAL'
    : 'UNKNOWN';

  return (
    <header className="header">
      <div className="header-left">
        <span className="logo">CLOUDOPS<span className="logo-slash">/</span>MONITOR</span>
        <span className="header-divider">|</span>
        <span className="header-env">PROD · AZURE</span>
      </div>
      <div className="header-center">
        <span className={`header-status header-status--${status}`}>
          <span className="header-status-dot"></span>
          {statusText}
        </span>
      </div>
      <div className="header-right">
        {lastUpdated && <span className="header-ts">{lastUpdated}</span>}
      </div>
    </header>
  );
}

export default Header;
