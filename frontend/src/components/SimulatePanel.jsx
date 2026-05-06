function SimulatePanel({ onSubmit, submitting, lastSubmit }) {
  const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const randomFloat = (min, max, decimals = 3) =>
    parseFloat((Math.random() * (max - min) + min).toFixed(decimals));

  const handleMetrics = () =>
    onSubmit('metrics', {
      cpu_percent: randomInt(10, 98),
      memory_percent: randomInt(20, 92),
      error_rate: randomFloat(0, 0.18),
    });

  const handleHealthCheck = () =>
    onSubmit('health_check', {
      status: 'healthy',
      uptime_seconds: randomInt(3600, 864000),
    });

  const handleError = () =>
    onSubmit('simulated_error', {
      severity: ['low', 'medium', 'high', 'critical'][randomInt(0, 3)],
      message: 'Simulated application failure',
    });

  return (
    <div className="sim-panel">
      <div className="sim-header">
        <div className="sim-title-row">
          <span className="sim-title">Simulate Event</span>
          <span className="sim-hint">POST → Azure Function → Blob Storage</span>
        </div>
        {submitting && (
          <span className="sim-sending">
            <span className="sim-spinner"></span>
            Sending…
          </span>
        )}
        {!submitting && lastSubmit && (
          <span className="sim-sent">✓ Sent {lastSubmit}</span>
        )}
      </div>
      <div className="sim-buttons">
        <button
          className="sim-btn sim-btn--metrics"
          onClick={handleMetrics}
          disabled={submitting}
          title="POST random CPU / memory / error_rate metrics"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          Metrics
        </button>
        <button
          className="sim-btn sim-btn--health"
          onClick={handleHealthCheck}
          disabled={submitting}
          title="POST a health check event"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
          Health Check
        </button>
        <button
          className="sim-btn sim-btn--error"
          onClick={handleError}
          disabled={submitting}
          title="POST a simulated error event"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          Simulate Error
        </button>
      </div>
    </div>
  );
}

export default SimulatePanel;
