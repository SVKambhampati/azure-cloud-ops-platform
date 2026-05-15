function timeAgo(iso) {
  if (!iso) return '';
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  return `${Math.floor(diff / 3600)}h`;
}

function AlertsPanel({ alerts = [], loading }) {
  const criticalCount = alerts.filter((a) => a.classification === 'critical').length;
  const hasAlerts = alerts.length > 0;

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">Active Alerts</span>
        {!loading && (
          <span className={`panel-count panel-count--${criticalCount > 0 ? 'critical' : hasAlerts ? 'warning' : 'ok'}`}>
            {hasAlerts ? alerts.length : '0'}
          </span>
        )}
      </div>

      {loading ? (
        <div className="log-list">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="log-row log-row--skeleton">
              <span className="skeleton skeleton--log" />
            </div>
          ))}
        </div>
      ) : !hasAlerts ? (
        <div className="log-empty">
          <span className="log-empty-mark">OK</span>
          <span>no active alerts</span>
        </div>
      ) : (
        <div className="log-list">
          {alerts.slice(0, 8).map((alert, i) => (
            <div key={`${alert.processed_at}-${i}`} className={`log-row log-row--${alert.classification}`}>
              <span className="log-age">{timeAgo(alert.processed_at)}</span>
              <span className={`log-level log-level--${alert.classification}`}>
                {alert.classification.toUpperCase()}
              </span>
              <span className="log-msg">
                {alert.alert_reason ?? `${alert.event_type} ${alert.classification}`}
              </span>
              <span className="log-src">{alert.source}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AlertsPanel;
