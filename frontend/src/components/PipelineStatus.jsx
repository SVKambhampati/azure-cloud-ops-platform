import { pipelineServices } from '../data/mockData';

const statusLabel = {
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
        {pipelineServices.map((svc) => (
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
                {statusLabel[svc.status]}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PipelineStatus;
