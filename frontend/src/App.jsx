import { useTelemetry } from './hooks/useTelemetry';
import Header from './components/Header';
import OverviewCards from './components/OverviewCards';
import EventFlowPanel from './components/EventFlowPanel';
import PipelineStatus from './components/PipelineStatus';
import TelemetryTable from './components/TelemetryTable';
import AlertsPanel from './components/AlertsPanel';
import './App.css';

function App() {
  const {
    events,
    loading,
    error,
    submitting,
    lastUpdated,
    systemHealth,
    metrics,
    alerts,
    eventsCount,
    submit,
  } = useTelemetry(12000);

  const handleSubmit = async (event_type, payload) => {
    await submit(event_type, payload);
  };

  return (
    <div className="app">
      <Header lastUpdated={lastUpdated} systemHealth={systemHealth} loading={loading} />
      <main className="main">
        {error && (
          <div className="api-error">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            API error: {error}
          </div>
        )}

        {/* 1 — System snapshot */}
        <section className="section">
          <h3 className="section-label">System snapshot</h3>
          <OverviewCards
            metrics={metrics}
            systemHealth={systemHealth}
            eventsCount={eventsCount}
            loading={loading}
          />
        </section>

        {/* 2 — Interactive pipeline */}
        <section className="section">
          <h3 className="section-label">How it works</h3>
          <EventFlowPanel onSubmit={handleSubmit} submitting={submitting} />
        </section>

        {/* 3 — Infrastructure status */}
        <section className="section">
          <h3 className="section-label">Infrastructure</h3>
          <div className="two-col">
            <PipelineStatus />
            <AlertsPanel alerts={alerts} loading={loading} />
          </div>
        </section>

        {/* 4 — Live event stream */}
        <section className="section">
          <h3 className="section-label">Live event stream</h3>
          <TelemetryTable events={events} loading={loading} />
        </section>
      </main>
      <footer className="footer">
        <span>CloudOps Monitor · Azure Event Hub Pipeline · Live data via Azure Functions</span>
      </footer>
    </div>
  );
}

export default App;
