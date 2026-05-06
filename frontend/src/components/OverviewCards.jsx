const ICONS = {
  health: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  cpu: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2" />
    </svg>
  ),
  memory: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 19v-3M10 19v-3M14 19v-3M18 19v-3M8 11V9M16 11V9M12 11V9M20 16H4a2 2 0 01-2-2V6a2 2 0 012-2h16a2 2 0 012 2v8a2 2 0 01-2 2z" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  events: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
};

function statusForCpu(val) {
  if (val == null) return 'normal';
  if (val >= 85) return 'critical';
  if (val >= 65) return 'warning';
  return 'normal';
}

function statusForMemory(val) {
  if (val == null) return 'normal';
  if (val >= 85) return 'critical';
  if (val >= 70) return 'warning';
  return 'normal';
}

function statusForErrorRate(val) {
  if (val == null) return 'normal';
  if (val >= 0.1) return 'critical';
  if (val >= 0.015) return 'warning';
  return 'normal';
}

function Card({ label, value, icon, status, raw, loading }) {
  return (
    <div className={`card card--${status}${loading ? ' card--loading' : ''}`}>
      <div className="card-header">
        <span className="card-label">{label}</span>
        <div className={`card-icon card-icon--${status}`}>{icon}</div>
      </div>
      <div className="card-value">{loading ? <span className="skeleton skeleton--value" /> : value}</div>
      {raw != null && !loading && (
        <div className="card-bar">
          <div className={`card-bar-fill card-bar-fill--${status}`} style={{ width: `${Math.min(raw, 100)}%` }} />
        </div>
      )}
    </div>
  );
}

function OverviewCards({ metrics, systemHealth, eventsCount, loading }) {
  const cpu = metrics?.cpuPercent ?? null;
  const mem = metrics?.memoryPercent ?? null;
  const err = metrics?.errorRate ?? null;

  const cpuStatus = statusForCpu(cpu);
  const memStatus = statusForMemory(mem);
  const errStatus = statusForErrorRate(err);

  return (
    <section className="overview-cards">
      <Card
        label="System Health"
        value={systemHealth?.value ?? '—'}
        icon={ICONS.health}
        status={systemHealth?.status ?? 'normal'}
        loading={loading}
      />
      <Card
        label="CPU Usage"
        value={cpu != null ? `${cpu}%` : '—'}
        icon={ICONS.cpu}
        status={cpuStatus}
        raw={cpu}
        loading={loading}
      />
      <Card
        label="Memory Usage"
        value={mem != null ? `${mem}%` : '—'}
        icon={ICONS.memory}
        status={memStatus}
        raw={mem}
        loading={loading}
      />
      <Card
        label="Error Rate"
        value={err != null ? `${(err * 100).toFixed(1)}%` : '—'}
        icon={ICONS.error}
        status={errStatus}
        raw={err != null ? err * 100 : null}
        loading={loading}
      />
      <Card
        label="Events Processed"
        value={eventsCount != null ? eventsCount.toLocaleString() : '—'}
        icon={ICONS.events}
        status="normal"
        loading={loading}
      />
    </section>
  );
}

export default OverviewCards;
