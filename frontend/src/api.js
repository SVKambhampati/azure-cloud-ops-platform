const BASE = '/api';

export async function getProcessedEvents() {
  const res = await fetch(`${BASE}/getprocessedevents`);
  if (!res.ok) throw new Error(`Failed to fetch events (${res.status})`);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function submitTelemetry(event_type, source, payload) {
  const res = await fetch(`${BASE}/submittelemetry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event_type, source, payload }),
  });
  if (!res.ok) throw new Error(`Failed to submit event (${res.status})`);
  return res.json();
}
