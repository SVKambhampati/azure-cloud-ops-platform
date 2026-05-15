function Header({ lastUpdated, systemHealth, loading }) {
  const status = systemHealth?.status ?? 'unknown';
  const statusText = loading
    ? 'Connecting'
    : status === 'critical'
    ? 'Critical'
    : status === 'warning'
    ? 'Degraded'
    : status === 'healthy'
    ? 'Nominal'
    : 'Unknown';

  return (
    <header className="header">
      <div className="header-left">
        <span className="logo">
          CloudOps<span className="logo-slash">/</span>Monitor
        </span>
        <span className="header-env">Azure · Prod</span>
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
