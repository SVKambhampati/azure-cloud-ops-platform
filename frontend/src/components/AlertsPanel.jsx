import { activeAlerts } from '../data/mockData';

function timeAgo(iso) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

function AlertsPanel() {
  const criticalCount = activeAlerts.filter((a) => a.severity === 'critical').length;

  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">Active Alerts</h2>
        <span className={`panel-badge panel-badge--${criticalCount > 0 ? 'critical' : 'warning'}`}>
          {activeAlerts.length} active
        </span>
      </div>
      <ul className="alerts-list">
        {activeAlerts.map((alert) => (
          <li key={alert.id} className={`alert-item alert-item--${alert.severity}`}>
            <div className="alert-header">
              <div className="alert-title-row">
                <span className={`alert-dot alert-dot--${alert.severity}`}></span>
                <span className="alert-title">{alert.title}</span>
              </div>
              <span className="alert-time">{timeAgo(alert.triggered)}</span>
            </div>
            <p className="alert-desc">{alert.description}</p>
            <div className="alert-footer">
              <span className="alert-source">{alert.source}</span>
              <span className={`alert-badge alert-badge--${alert.severity}`}>
                {alert.severity}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AlertsPanel;
