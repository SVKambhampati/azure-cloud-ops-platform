import { architectureSteps } from '../data/mockData';

function ArchitectureDiagram() {
  return (
    <div className="panel panel--full">
      <div className="panel-header">
        <h2 className="panel-title">Pipeline Architecture</h2>
        <span className="panel-sub">Event-driven telemetry on Azure</span>
      </div>
      <div className="arch-flow">
        {architectureSteps.map((step, idx) => (
          <div key={step.id} className="arch-group">
            <div className={`arch-node${step.comingSoon ? ' arch-node--soon' : ''}`}>
              <div className="arch-node-inner">
                <div className="arch-icon">
                  {step.id === 'flask' && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
                    </svg>
                  )}
                  {step.id === 'eventhub' && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                  )}
                  {step.id === 'function' && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <polyline points="16 18 22 12 16 6" />
                      <polyline points="8 6 2 12 8 18" />
                    </svg>
                  )}
                  {step.id === 'storage' && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <ellipse cx="12" cy="5" rx="9" ry="3" />
                      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                    </svg>
                  )}
                </div>
                <div className="arch-label">
                  <span className="arch-name">{step.label}</span>
                  <span className="arch-sub">{step.sublabel}</span>
                </div>
                {step.comingSoon && (
                  <span className="arch-soon-badge">Coming Soon</span>
                )}
              </div>
            </div>
            {idx < architectureSteps.length - 1 && (
              <div className="arch-arrow">
                <svg viewBox="0 0 40 16" fill="none">
                  <path d="M0 8 H32" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" />
                  <path d="M28 4 L36 8 L28 12" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="arch-legend">
        <span className="legend-item">
          <span className="legend-dot legend-dot--active"></span>Active
        </span>
        <span className="legend-item">
          <span className="legend-dot legend-dot--soon"></span>Coming Soon
        </span>
        <span className="legend-item legend-note">
          Event flow: producer → ingestion → consumer → persistence
        </span>
      </div>
    </div>
  );
}

export default ArchitectureDiagram;
