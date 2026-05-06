function formatTimestamp(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function ClassificationBadge({ value }) {
  if (!value) return null;
  return <span className={`class-badge class-badge--${value}`}>{value}</span>;
}

function SeverityBadge({ eventType, payload, classification }) {
  if (eventType === 'simulated_error') {
    const sev = payload?.severity ?? 'unknown';
    return <span className={`severity-badge severity-badge--${sev}`}>{sev}</span>;
  }
  if (classification === 'critical') return <span className="severity-badge severity-badge--critical">critical</span>;
  if (classification === 'warning') return <span className="severity-badge severity-badge--warning">warning</span>;
  return <span className="severity-badge severity-badge--info">info</span>;
}

function SkeletonRows() {
  return Array.from({ length: 5 }).map((_, i) => (
    <tr key={i} className="row--skeleton">
      {Array.from({ length: 6 }).map((__, j) => (
        <td key={j}><span className="skeleton" /></td>
      ))}
    </tr>
  ));
}

function TelemetryTable({ events = [], loading }) {
  return (
    <div className="panel panel--full">
      <div className="panel-header">
        <h2 className="panel-title">Recent Telemetry</h2>
        <div className="panel-header-right">
          {!loading && <span className="panel-count">{events.length} events</span>}
          <span className="live-indicator">
            <span className="live-dot"></span>Live
          </span>
        </div>
      </div>
      <div className="table-wrapper">
        <table className="telemetry-table">
          <thead>
            <tr>
              <th>Processed At</th>
              <th>Event Type</th>
              <th>Source</th>
              <th>Classification</th>
              <th>Severity</th>
              <th>Alert Reason</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <SkeletonRows />
            ) : events.length === 0 ? (
              <tr>
                <td colSpan={6} className="table-empty">No events yet. Use the simulate panel to send one.</td>
              </tr>
            ) : (
              events.slice(0, 20).map((evt, i) => (
                <tr key={`${evt.processed_at}-${i}`} className={`row--${evt.classification}`}>
                  <td className="cell-mono">
                    <span className="ts-date">{formatDate(evt.processed_at)}</span>
                    <span className="ts-time">{formatTimestamp(evt.processed_at)}</span>
                  </td>
                  <td><span className="event-type">{(evt.event_type ?? '').replace(/_/g, ' ')}</span></td>
                  <td className="cell-source">{evt.source ?? '—'}</td>
                  <td><ClassificationBadge value={evt.classification} /></td>
                  <td>
                    <SeverityBadge
                      eventType={evt.event_type}
                      payload={evt.payload}
                      classification={evt.classification}
                    />
                  </td>
                  <td className="cell-alert-reason">{evt.alert_reason ?? '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TelemetryTable;
