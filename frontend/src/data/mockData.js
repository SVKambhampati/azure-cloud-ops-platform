export const overviewMetrics = {
  systemHealth: { value: 'Healthy', status: 'healthy' },
  cpuUsage: { value: '67%', status: 'warning', raw: 67 },
  memoryUsage: { value: '54%', status: 'normal', raw: 54 },
  errorRate: { value: '2.1%', status: 'warning', raw: 2.1 },
  eventsProcessed: { value: '14,832', status: 'normal' },
};

export const pipelineServices = [
  { name: 'Flask Backend', status: 'operational', latency: '12ms', uptime: '99.8%' },
  { name: 'Azure Event Hub', status: 'operational', latency: '8ms', uptime: '99.9%' },
  { name: 'Azure Function', status: 'degraded', latency: '340ms', uptime: '97.2%' },
  { name: 'Blob Storage', status: 'coming_soon', latency: '—', uptime: '—' },
  { name: 'Cosmos DB', status: 'coming_soon', latency: '—', uptime: '—' },
];

export const telemetryEvents = [
  {
    id: 1,
    timestamp: '2026-05-05T18:42:11Z',
    event_type: 'metrics',
    source: 'flask-backend',
    severity: 'info',
    status: 'processed',
  },
  {
    id: 2,
    timestamp: '2026-05-05T18:42:08Z',
    event_type: 'health_check',
    source: 'flask-backend',
    severity: 'info',
    status: 'processed',
  },
  {
    id: 3,
    timestamp: '2026-05-05T18:41:55Z',
    event_type: 'simulated_error',
    source: 'flask-backend',
    severity: 'high',
    status: 'processed',
  },
  {
    id: 4,
    timestamp: '2026-05-05T18:41:30Z',
    event_type: 'metrics',
    source: 'flask-backend',
    severity: 'info',
    status: 'processed',
  },
  {
    id: 5,
    timestamp: '2026-05-05T18:41:12Z',
    event_type: 'simulated_error',
    source: 'flask-backend',
    severity: 'critical',
    status: 'flagged',
  },
  {
    id: 6,
    timestamp: '2026-05-05T18:40:58Z',
    event_type: 'health_check',
    source: 'flask-backend',
    severity: 'info',
    status: 'processed',
  },
  {
    id: 7,
    timestamp: '2026-05-05T18:40:40Z',
    event_type: 'metrics',
    source: 'flask-backend',
    severity: 'warning',
    status: 'processed',
  },
  {
    id: 8,
    timestamp: '2026-05-05T18:40:22Z',
    event_type: 'simulated_error',
    source: 'flask-backend',
    severity: 'medium',
    status: 'processed',
  },
];

export const activeAlerts = [
  {
    id: 1,
    title: 'High CPU Usage',
    description: 'CPU sustained above 65% for >5 minutes',
    severity: 'warning',
    triggered: '2026-05-05T18:38:00Z',
    source: 'flask-backend',
  },
  {
    id: 2,
    title: 'Azure Function Latency',
    description: 'P99 latency exceeded 300ms threshold',
    severity: 'warning',
    triggered: '2026-05-05T18:39:45Z',
    source: 'azure-function',
  },
  {
    id: 3,
    title: 'Elevated Error Rate',
    description: 'Error rate at 2.1%, threshold is 1.5%',
    severity: 'warning',
    triggered: '2026-05-05T18:41:12Z',
    source: 'flask-backend',
  },
  {
    id: 4,
    title: 'Simulated Critical Failure',
    description: 'Critical severity error event received from pipeline',
    severity: 'critical',
    triggered: '2026-05-05T18:41:12Z',
    source: 'flask-backend',
  },
];

export const architectureSteps = [
  { id: 'flask', label: 'Flask Backend', sublabel: 'REST API + Event Producer', icon: '⬡' },
  { id: 'eventhub', label: 'Azure Event Hub', sublabel: 'Ingestion / Streaming', icon: '⬡' },
  { id: 'function', label: 'Azure Function', sublabel: 'Event Consumer', icon: '⬡' },
  { id: 'storage', label: 'Storage / Monitoring', sublabel: 'Blob · Cosmos · App Insights', icon: '⬡', comingSoon: true },
];
