function Header({ lastUpdated, systemHealth, loading }) {
  const isHealthy = !systemHealth || systemHealth.status === 'healthy' || systemHealth.status === 'unknown';
  const isDegraded = systemHealth?.status === 'warning';
  const isCritical = systemHealth?.status === 'critical';

  const statusText = loading
    ? 'Connecting…'
    : isCritical
    ? 'Critical State Detected'
    : isDegraded
    ? 'Degraded — Alerts Active'
    : 'All Systems Nominal';

  const statusClass = isCritical ? 'critical' : isDegraded ? 'warning' : 'healthy';

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
          <span className={`status-dot status-dot--${statusClass}${loading ? ' status-dot--pulse' : ''}`}></span>
          <span className={`status-label status-label--${statusClass}`}>{statusText}</span>
        </div>
        {lastUpdated && (
          <span className="header-timestamp">Updated {lastUpdated}</span>
        )}
      </div>
    </header>
  );
}

export default Header;
