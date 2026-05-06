function timeAgo(iso) {
  if (!iso) return '';
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

function AlertsPanel({ alerts = [], loading }) {
  const criticalCount = alerts.filter((a) => a.classification === 'critical').length;
  const hasAlerts = alerts.length > 0;

  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">Active Alerts</h2>
        {!loading && (
          <span className={`panel-badge panel-badge--${criticalCount > 0 ? 'critical' : hasAlerts ? 'warning' : 'ok'}`}>
            {hasAlerts ? `${alerts.length} active` : 'None'}
          </span>
        )}
      </div>

      {loading ? (
        <ul className="alerts-list">
          {Array.from({ length: 3 }).map((_, i) => (
            <li key={i} className="alert-item alert-item--skeleton">
              <div className="skeleton skeleton--alert-title" />
              <div className="skeleton skeleton--alert-desc" />
            </li>
          ))}
        </ul>
      ) : !hasAlerts ? (
        <div className="alerts-empty">
          <span className="alerts-empty-icon">✓</span>
          <span>No active alerts</span>
        </div>
      ) : (
        <ul className="alerts-list">
          {alerts.slice(0, 8).map((alert, i) => (
            <li key={`${alert.processed_at}-${i}`} className={`alert-item alert-item--${alert.classification}`}>
              <div className="alert-header">
                <div className="alert-title-row">
                  <span className={`alert-dot alert-dot--${alert.classification}`}></span>
                  <span className="alert-title">
                    {alert.alert_reason ?? `${alert.event_type} ${alert.classification}`}
                  </span>
                </div>
                <span className="alert-time">{timeAgo(alert.processed_at)}</span>
              </div>
              <div className="alert-footer">
                <span className="alert-source">{alert.source}</span>
                <span className={`alert-badge alert-badge--${alert.classification}`}>
                  {alert.classification}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AlertsPanel;
