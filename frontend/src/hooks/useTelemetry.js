import { useState, useEffect, useCallback, useRef } from 'react';
import { getProcessedEvents, submitTelemetry } from '../api';

function deriveHealth(events) {
  if (!events.length) return { value: 'No Data', status: 'unknown' };
  const recent = events.slice(0, 20);
  if (recent.some((e) => e.classification === 'critical')) return { value: 'Critical', status: 'critical' };
  if (recent.some((e) => e.classification === 'warning')) return { value: 'Degraded', status: 'warning' };
  return { value: 'Healthy', status: 'healthy' };
}

function deriveMetrics(events) {
  const metricsEvents = events.filter(
    (e) => e.event_type === 'metrics' && e.payload?.cpu_percent != null
  );
  const latest = metricsEvents[0];
  if (!latest) return null;
  return {
    cpuPercent: latest.payload.cpu_percent,
    memoryPercent: latest.payload.memory_percent,
    errorRate: latest.payload.error_rate,
  };
}

function deriveAlerts(events) {
  return events
    .filter((e) => e.classification === 'warning' || e.classification === 'critical')
    .slice(0, 10);
}

export function useTelemetry(pollInterval = 12000) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');
  const isMounted = useRef(true);

  const fetchEvents = useCallback(async () => {
    try {
      const data = await getProcessedEvents();
      if (!isMounted.current) return;
      const sorted = [...data].sort(
        (a, b) => new Date(b.processed_at) - new Date(a.processed_at)
      );
      setEvents(sorted);
      setError(null);
      setLastUpdated(
        new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    } catch (err) {
      if (isMounted.current) setError(err.message);
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    fetchEvents();
    const id = setInterval(fetchEvents, pollInterval);
    return () => {
      isMounted.current = false;
      clearInterval(id);
    };
  }, [fetchEvents, pollInterval]);

  const submit = useCallback(
    async (event_type, payload) => {
      setSubmitting(true);
      try {
        await submitTelemetry(event_type, 'frontend-dashboard', payload);
        await fetchEvents();
      } catch (err) {
        if (isMounted.current) setError(err.message);
      } finally {
        if (isMounted.current) setSubmitting(false);
      }
    },
    [fetchEvents]
  );

  return {
    events,
    loading,
    error,
    submitting,
    lastUpdated,
    systemHealth: deriveHealth(events),
    metrics: deriveMetrics(events),
    alerts: deriveAlerts(events),
    eventsCount: events.length,
    submit,
    refresh: fetchEvents,
  };
}
