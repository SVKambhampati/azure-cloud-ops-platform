const SERVICES = [
  { name: 'Flask Backend', status: 'operational', latency: '~12ms', uptime: '99.8%' },
  { name: 'Azure Event Hub', status: 'operational', latency: '~8ms', uptime: '99.9%' },
  { name: 'Azure Function', status: 'operational', latency: '~350ms', uptime: '99.5%' },
  { name: 'Blob Storage', status: 'operational', latency: '~40ms', uptime: '99.9%' },
  { name: 'Cosmos DB', status: 'coming_soon', latency: '—', uptime: '—' },
];

const STATUS_LABEL = {
  operational: 'Operational',
  degraded: 'Degraded',
  down: 'Down',
  coming_soon: 'Coming Soon',
};

function PipelineStatus() {
  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">Pipeline Status</h2>
        <span className="panel-badge">Live</span>
      </div>
      <ul className="pipeline-list">
        {SERVICES.map((svc) => (
          <li key={svc.name} className={`pipeline-item pipeline-item--${svc.status}`}>
            <div className="pipeline-left">
              <span className={`status-dot status-dot--${svc.status}`}></span>
              <span className="pipeline-name">{svc.name}</span>
            </div>
            <div className="pipeline-right">
              {svc.status !== 'coming_soon' && (
                <>
                  <span className="pipeline-stat">
                    <span className="stat-label">Latency</span>
                    <span className="stat-value">{svc.latency}</span>
                  </span>
                  <span className="pipeline-stat">
                    <span className="stat-label">Uptime</span>
                    <span className="stat-value">{svc.uptime}</span>
                  </span>
                </>
              )}
              <span className={`pipeline-badge pipeline-badge--${svc.status}`}>
                {STATUS_LABEL[svc.status]}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PipelineStatus;
