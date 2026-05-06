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
      <div className="sim-prompt">
        <span className="sim-caret">▶</span>
        <span className="sim-cmd">POST /api/submittelemetry</span>
        <span className="sim-pipe">→</span>
        <span className="sim-dest">azure-functions</span>
        {submitting && <span className="sim-status sim-status--sending">⠋ sending</span>}
        {!submitting && lastSubmit && <span className="sim-status sim-status--ok">✓ {lastSubmit}</span>}
      </div>
      <div className="sim-actions">
        <button className="sim-btn sim-btn--metrics" onClick={handleMetrics} disabled={submitting}>
          metrics
        </button>
        <button className="sim-btn sim-btn--health" onClick={handleHealthCheck} disabled={submitting}>
          health_check
        </button>
        <button className="sim-btn sim-btn--error" onClick={handleError} disabled={submitting}>
          simulated_error
        </button>
      </div>
    </div>
  );
}

export default SimulatePanel;
