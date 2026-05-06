# CloudOps Monitor

An Azure-based real-time cloud monitoring and telemetry platform. Ingests structured events from a Flask backend through Azure Event Hub, processes them with an Azure Function consumer, and surfaces them in a professional operations dashboard.

## Architecture

```
Flask Backend  →  Azure Event Hub  →  Azure Function  →  Blob Storage / Cosmos DB (coming soon)
   (producer)        (ingestion)         (consumer)             (persistence)
```

## Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Backend   | Python · Flask · azure-eventhub SDK     |
| Ingestion | Azure Event Hub                         |
| Consumer  | Azure Functions (Python v2)             |
| Frontend  | React 19 · Vite · plain CSS             |

---

## Frontend — CloudOps Monitor Dashboard

Located in `frontend/`. A dark, professional SRE/DevOps dashboard built with React + Vite.

### What it shows

| Section | Description |
|---------|-------------|
| **Overview cards** | Live-style metrics: System Health, CPU Usage, Memory Usage, Error Rate, Events Processed — with colour-coded severity and progress bars |
| **Pipeline Status** | Per-service health for Flask Backend, Azure Event Hub, Azure Function, Blob Storage, and Cosmos DB — with latency and uptime stats; coming-soon services are clearly marked |
| **Active Alerts** | Four alert types surfaced from the pipeline: High CPU, Azure Function Latency, Elevated Error Rate, and Simulated Critical Failure — each with severity badge, description, and source |
| **Recent Telemetry** | Scrollable table of the latest events with timestamp, event type, source, severity, and processing status |
| **Architecture Diagram** | Visual event-flow diagram: Flask → Event Hub → Azure Function → Storage/Monitoring |

### Run locally

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

> The dashboard currently uses realistic mock data. Live API integration with the Flask backend is a planned next step.

---

## Backend

Located in `backend/`. Flask app that produces three event types to Azure Event Hub:

- `health_check` — service liveness
- `metrics` — CPU %, memory %, request count, error rate
- `simulated_error` — random severity error events

```bash
cd backend
pip install -r requirements.txt
# set EVENT_HUB_CONNECTION_STR and EVENT_HUB_NAME in .env
python app.py
```

Endpoints: `GET /`, `GET /health`, `GET /metrics`, `GET /simulate-error`

## Azure Function

Located in `functions/`. Consumes events from Event Hub and logs payloads. Persistence to Blob Storage and Cosmos DB is coming soon.
