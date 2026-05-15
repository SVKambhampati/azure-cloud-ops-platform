const SERVICES = [
  { name: 'Flask Backend',   status: 'operational', latency: '~12ms',  uptime: '99.8%' },
  { name: 'Azure Event Hub', status: 'operational', latency: '~8ms',   uptime: '99.9%' },
  { name: 'Azure Function',  status: 'operational', latency: '~350ms', uptime: '99.5%' },
  { name: 'Blob Storage',    status: 'operational', latency: '~40ms',  uptime: '99.9%' },
  { name: 'Cosmos DB',       status: 'coming_soon', latency: '—',      uptime: '—' },
];

const TAG = {
  operational: 'OK',
  degraded:    'DEGRADED',
  down:        'DOWN',
  coming_soon: 'SOON',
};

function PipelineStatus() {
  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">Pipeline</span>
        <span className="live-indicator">
          <span className="live-dot"></span>LIVE
        </span>
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
                    <span className="stat-lbl">LATENCY</span>
                    <span className="stat-val">{svc.latency}</span>
                  </span>
                  <span className="pipeline-stat">
                    <span className="stat-lbl">UPTIME</span>
                    <span className="stat-val">{svc.uptime}</span>
                  </span>
                </>
              )}
              <span className={`pipeline-tag pipeline-tag--${svc.status}`}>
                {TAG[svc.status]}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PipelineStatus;
