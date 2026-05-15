import { useState, useEffect, useRef } from 'react';

/* ── Pipeline nodes ─────────────────────────────────────── */
const NODES = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    sub: 'You are here',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  {
    id: 'flask',
    label: 'Flask API',
    sub: 'Event producer',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 3h6M9 3v6l-4 9a1 1 0 00.9 1.45h12.2A1 1 0 0024 18l-4-9V3" />
      </svg>
    ),
  },
  {
    id: 'eventhub',
    label: 'Event Hub',
    sub: 'Stream ingestion',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    id: 'function',
    label: 'Azure Fn',
    sub: 'Classify & enrich',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    id: 'storage',
    label: 'Blob Storage',
    sub: 'Persist JSON',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
  },
  {
    id: 'live',
    label: 'Dashboard',
    sub: 'Live update',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="23 4 23 10 17 10" />
        <polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
      </svg>
    ),
  },
];

/* ── Step trace descriptions ────────────────────────────── */
const STEPS = [
  {
    nodeIdx: 0,
    label: 'Sending POST request',
    detail: 'Dashboard → POST /api/submittelemetry with JSON payload',
  },
  {
    nodeIdx: 1,
    label: 'Flask API received',
    detail: 'Backend validates event and publishes to Azure Event Hub partition',
  },
  {
    nodeIdx: 2,
    label: 'Event Hub ingested',
    detail: 'Message buffered in partitioned stream at ~8ms latency',
  },
  {
    nodeIdx: 3,
    label: 'Azure Function triggered',
    detail: 'Consumer reads event, classifies severity → normal / warning / critical',
  },
  {
    nodeIdx: 4,
    label: 'Persisted to Blob Storage',
    detail: 'Processed event JSON written to Azure Blob Storage container',
  },
  {
    nodeIdx: 5,
    label: 'Dashboard refreshed',
    detail: 'GET /getprocessedevents — new event appears in the table below',
  },
];

/* ── Event type definitions ─────────────────────────────── */
const EVENT_TYPES = [
  {
    id: 'metrics',
    label: 'metrics',
    description: 'Sends CPU %, memory %, and error rate. Triggers a warning or critical alert if thresholds are exceeded.',
    fields: ['cpu_percent', 'memory_percent', 'error_rate'],
    color: 'blue',
  },
  {
    id: 'health_check',
    label: 'health_check',
    description: 'Reports service uptime in seconds. Classified as normal — used to confirm the pipeline is alive.',
    fields: ['status: "healthy"', 'uptime_seconds'],
    color: 'green',
  },
  {
    id: 'simulated_error',
    label: 'simulated_error',
    description: 'Injects a random-severity fault (low → critical). Critical errors surface as active alerts.',
    fields: ['severity: low|medium|high|critical', 'message'],
    color: 'red',
  },
];

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min, max, d = 3) => parseFloat((Math.random() * (max - min) + min).toFixed(d));

function buildPayload(eventType) {
  if (eventType === 'metrics') {
    return {
      cpu_percent: randomInt(10, 98),
      memory_percent: randomInt(20, 92),
      error_rate: randomFloat(0, 0.18),
    };
  }
  if (eventType === 'health_check') {
    return { status: 'healthy', uptime_seconds: randomInt(3600, 864000) };
  }
  return {
    severity: ['low', 'medium', 'high', 'critical'][randomInt(0, 3)],
    message: 'Simulated application failure',
  };
}

/* ── Component ──────────────────────────────────────────── */
export default function EventFlowPanel({ onSubmit, submitting }) {
  const [activeStep, setActiveStep] = useState(-1);   // -1 = idle
  const [doneSteps, setDoneSteps] = useState(new Set());
  const [selectedType, setSelectedType] = useState(null);
  const [sentPayload, setSentPayload] = useState(null);
  const timersRef = useRef([]);

  /* Clear timers on unmount */
  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  /* When submitting flips back to false, finish the trace */
  const prevSubmitting = useRef(false);
  useEffect(() => {
    if (prevSubmitting.current && !submitting && activeStep >= 0) {
      /* API done — jump to final step */
      timersRef.current.forEach(clearTimeout);
      setActiveStep(5);
      setDoneSteps(new Set([0, 1, 2, 3, 4, 5]));
      /* Auto-reset after 5s */
      const t = setTimeout(() => {
        setActiveStep(-1);
        setDoneSteps(new Set());
        setSelectedType(null);
        setSentPayload(null);
      }, 5000);
      timersRef.current.push(t);
    }
    prevSubmitting.current = submitting;
  }, [submitting, activeStep]);

  const handleSend = async (eventTypeId) => {
    if (submitting) return;

    const payload = buildPayload(eventTypeId);
    setSelectedType(eventTypeId);
    setSentPayload(payload);
    setDoneSteps(new Set());
    setActiveStep(0);

    /* Animate intermediate steps during network round-trip */
    const delays = [350, 800, 1300, 1800];
    timersRef.current.forEach(clearTimeout);
    timersRef.current = delays.map((delay, i) =>
      setTimeout(() => {
        setActiveStep(i + 1);
        setDoneSteps((prev) => new Set([...prev, i]));
      }, delay)
    );

    await onSubmit(eventTypeId, payload);
    /* Completion handled by the useEffect above */
  };

  const isIdle = activeStep === -1;
  const isDone = doneSteps.size === 6;

  return (
    <div className="efp">
      {/* Header */}
      <div className="efp-header">
        <div className="efp-title-group">
          <span className="efp-title">Try it — send a live event</span>
          <span className="efp-sub">Click an event type to fire a real telemetry payload through the pipeline</span>
        </div>
        {isDone && <span className="efp-done-badge">✓ delivered</span>}
      </div>

      {/* Pipeline flow diagram */}
      <div className="efp-flow">
        {NODES.map((node, idx) => {
          const stepForNode = STEPS.findIndex((s) => s.nodeIdx === idx);
          const isActive = activeStep === stepForNode;
          const isDoneNode = doneSteps.has(stepForNode);
          const connectorActive = doneSteps.has(stepForNode) || (activeStep > stepForNode && stepForNode >= 0);

          return (
            <div key={node.id} className="efp-node-group">
              <div className={`efp-node ${isActive ? 'efp-node--active' : ''} ${isDoneNode ? 'efp-node--done' : ''}`}>
                <div className="efp-node-icon">{node.icon}</div>
                <span className="efp-node-label">{node.label}</span>
                <span className="efp-node-sub">{node.sub}</span>
              </div>
              {idx < NODES.length - 1 && (
                <div className={`efp-connector ${connectorActive ? 'efp-connector--active' : ''}`}>
                  <svg viewBox="0 0 56 16" fill="none" preserveAspectRatio="none">
                    <path d="M0 8 H42" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" />
                    <path d="M36 4 L46 8 L36 12" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Event type buttons */}
      <div className="efp-buttons">
        {EVENT_TYPES.map((et) => (
          <button
            key={et.id}
            className={`efp-btn efp-btn--${et.color} ${selectedType === et.id ? 'efp-btn--selected' : ''}`}
            onClick={() => handleSend(et.id)}
            disabled={submitting}
          >
            <span className="efp-btn-label">{et.label}</span>
            <span className="efp-btn-desc">{et.description}</span>
            <div className="efp-btn-fields">
              {et.fields.map((f) => (
                <code key={f} className="efp-field">{f}</code>
              ))}
            </div>
          </button>
        ))}
      </div>

      {/* Step trace — shown only when a flow is in progress or just completed */}
      {activeStep >= 0 && (
        <div className="efp-trace">
          <div className="efp-trace-header">
            <span className="efp-trace-title">Event trace</span>
            {sentPayload && (
              <code className="efp-trace-payload">
                {JSON.stringify(sentPayload)}
              </code>
            )}
          </div>
          <div className="efp-trace-steps">
            {STEPS.map((step, i) => {
              const done = doneSteps.has(i);
              const active = activeStep === i;
              const waiting = !done && !active;
              return (
                <div
                  key={i}
                  className={`efp-step ${done ? 'efp-step--done' : ''} ${active ? 'efp-step--active' : ''} ${waiting ? 'efp-step--waiting' : ''}`}
                >
                  <span className="efp-step-icon">
                    {done ? '✓' : active ? <span className="efp-spinner" /> : '○'}
                  </span>
                  <div className="efp-step-text">
                    <span className="efp-step-label">{step.label}</span>
                    <span className="efp-step-detail">{step.detail}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
