const GET_BASE = '/api';
const AZURE_BASE = 'https://cloud-ops-functions-sk.azurewebsites.net/api';

export async function getProcessedEvents() {
  const res = await fetch(`${GET_BASE}/getprocessedevents`);
  if (!res.ok) throw new Error(`Failed to fetch events (${res.status})`);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function submitTelemetry(event_type, source, payload) {
  const res = await fetch(`${AZURE_BASE}/submittelemetry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event_type, source, payload }),
  });
  if (!res.ok) throw new Error(`Failed to submit event (${res.status})`);
  return res.json();
}
