import { telemetryEvents } from '../data/mockData';

function formatTimestamp(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

function TelemetryTable() {
  return (
    <div className="panel panel--full">
      <div className="panel-header">
        <h2 className="panel-title">Recent Telemetry</h2>
        <span className="panel-count">{telemetryEvents.length} events</span>
      </div>
      <div className="table-wrapper">
        <table className="telemetry-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Event Type</th>
              <th>Source</th>
              <th>Severity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {telemetryEvents.map((evt) => (
              <tr key={evt.id} className={`row--${evt.severity}`}>
                <td className="cell-mono">{formatTimestamp(evt.timestamp)}</td>
                <td>
                  <span className="event-type">{evt.event_type.replace('_', ' ')}</span>
                </td>
                <td className="cell-source">{evt.source}</td>
                <td>
                  <span className={`severity-badge severity-badge--${evt.severity}`}>
                    {evt.severity}
                  </span>
                </td>
                <td>
                  <span className={`status-pill status-pill--${evt.status}`}>
                    {evt.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TelemetryTable;
