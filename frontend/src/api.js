const API_BASE = "https://cloud-ops-functions-sk.azurewebsites.net/api";

export async function getProcessedEvents() {
  const res = await fetch(`${API_BASE}/getprocessedevents`);
  if (!res.ok) throw new Error(`Failed to fetch events (${res.status})`);
  return res.json();
}

export async function submitTelemetry(eventType, source, payload) {
  const res = await fetch(`${API_BASE}/submittelemetry`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event_type: eventType,
      source,
      payload,
    }),
  });

  if (!res.ok) throw new Error(`Failed to submit event (${res.status})`);
  return res.json();
}
