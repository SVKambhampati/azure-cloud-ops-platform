import { overviewMetrics } from '../data/mockData';

const cardConfig = [
  {
    key: 'systemHealth',
    label: 'System Health',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    key: 'cpuUsage',
    label: 'CPU Usage',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="9" y="9" width="6" height="6" />
        <path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2" />
      </svg>
    ),
  },
  {
    key: 'memoryUsage',
    label: 'Memory Usage',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 19v-3M10 19v-3M14 19v-3M18 19v-3M8 11V9M16 11V9M12 11V9M20 16H4a2 2 0 01-2-2V6a2 2 0 012-2h16a2 2 0 012 2v8a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    key: 'errorRate',
    label: 'Error Rate',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
  {
    key: 'eventsProcessed',
    label: 'Events Processed',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
];

function OverviewCards() {
  return (
    <section className="overview-cards">
      {cardConfig.map(({ key, label, icon }) => {
        const metric = overviewMetrics[key];
        return (
          <div key={key} className={`card card--${metric.status}`}>
            <div className="card-header">
              <span className="card-label">{label}</span>
              <div className={`card-icon card-icon--${metric.status}`}>{icon}</div>
            </div>
            <div className="card-value">{metric.value}</div>
            {metric.raw !== undefined && (
              <div className="card-bar">
                <div
                  className={`card-bar-fill card-bar-fill--${metric.status}`}
                  style={{ width: `${metric.raw}%` }}
                />
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}

export default OverviewCards;
