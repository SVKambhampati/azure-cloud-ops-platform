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

function StatCard({ label, value, status, raw, loading }) {
  return (
    <div className={`stat-card stat-card--${status}`}>
      <span className="stat-label">{label}</span>
      <span className="stat-value">
        {loading ? <span className="skeleton skeleton--stat" /> : value}
      </span>
      {raw != null && !loading && (
        <div className="stat-bar">
          <div className={`stat-bar-fill stat-bar-fill--${status}`} style={{ width: `${Math.min(raw, 100)}%` }} />
        </div>
      )}
    </div>
  );
}

function HealthCard({ value, status, loading }) {
  return (
    <div className={`health-card health-card--${status}`}>
      <span className="health-label">SYSTEM STATUS</span>
      <span className="health-value">
        {loading ? <span className="skeleton skeleton--health" /> : value.toUpperCase()}
      </span>
      <span className={`health-indicator health-indicator--${status}`}></span>
    </div>
  );
}

function OverviewCards({ metrics, systemHealth, eventsCount, loading }) {
  const cpu = metrics?.cpuPercent ?? null;
  const mem = metrics?.memoryPercent ?? null;
  const err = metrics?.errorRate ?? null;

  return (
    <section className="overview-cards">
      <HealthCard
        value={systemHealth?.value ?? 'No Data'}
        status={systemHealth?.status ?? 'unknown'}
        loading={loading}
      />
      <StatCard
        label="CPU"
        value={cpu != null ? `${cpu}%` : '—'}
        status={statusForCpu(cpu)}
        raw={cpu}
        loading={loading}
      />
      <StatCard
        label="MEMORY"
        value={mem != null ? `${mem}%` : '—'}
        status={statusForMemory(mem)}
        raw={mem}
        loading={loading}
      />
      <StatCard
        label="ERROR RATE"
        value={err != null ? `${(err * 100).toFixed(1)}%` : '—'}
        status={statusForErrorRate(err)}
        raw={err != null ? err * 100 : null}
        loading={loading}
      />
      <StatCard
        label="EVENTS"
        value={eventsCount != null ? eventsCount.toLocaleString() : '—'}
        status="normal"
        loading={loading}
      />
    </section>
  );
}

export default OverviewCards;
