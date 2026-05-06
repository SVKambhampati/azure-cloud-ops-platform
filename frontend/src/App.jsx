import { useState, useEffect } from 'react';
import Header from './components/Header';
import OverviewCards from './components/OverviewCards';
import PipelineStatus from './components/PipelineStatus';
import TelemetryTable from './components/TelemetryTable';
import AlertsPanel from './components/AlertsPanel';
import ArchitectureDiagram from './components/ArchitectureDiagram';
import './App.css';

function App() {
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    const now = new Date();
    setLastUpdated(
      now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
    );
  }, []);

  return (
    <div className="app">
      <Header lastUpdated={lastUpdated} />
      <main className="main">
        <section className="section">
          <h3 className="section-label">Overview</h3>
          <OverviewCards />
        </section>

        <section className="section">
          <h3 className="section-label">Infrastructure</h3>
          <div className="two-col">
            <PipelineStatus />
            <AlertsPanel />
          </div>
        </section>

        <section className="section">
          <TelemetryTable />
        </section>

        <section className="section">
          <ArchitectureDiagram />
        </section>
      </main>
      <footer className="footer">
        <span>CloudOps Monitor · Azure Event Hub Pipeline · Mock data — API integration pending</span>
      </footer>
    </div>
  );
}

export default App;
