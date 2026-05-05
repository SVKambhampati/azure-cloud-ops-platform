from flask import Flask, jsonify
from datetime import datetime, timezone
from dotenv import load_dotenv
from azure.eventhub import EventHubProducerClient, EventData
import os
import json
import random

load_dotenv()

app = Flask(__name__)

EVENT_HUB_CONNECTION_STR = os.getenv("EVENT_HUB_CONNECTION_STR")
EVENT_HUB_NAME = os.getenv("EVENT_HUB_NAME")


def send_event(event_type, payload):
    if not EVENT_HUB_CONNECTION_STR or not EVENT_HUB_NAME:
        print("Event Hub not configured. Skipping event send.")
        return

    event = {
        "event_type": event_type,
        "source": "flask-backend",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "payload": payload
    }

    producer = EventHubProducerClient.from_connection_string(
        conn_str=EVENT_HUB_CONNECTION_STR,
        eventhub_name=EVENT_HUB_NAME
    )

    with producer:
        event_batch = producer.create_batch()
        event_batch.add(EventData(json.dumps(event)))
        producer.send_batch(event_batch)


@app.route("/")
def home():
    return jsonify({
        "message": "Cloud Ops Monitoring Backend",
        "status": "running"
    })


@app.route("/health")
def health():
    payload = {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

    send_event("health_check", payload)

    return jsonify(payload)


@app.route("/metrics")
def metrics():
    payload = {
        "cpu_percent": random.randint(10, 95),
        "memory_percent": random.randint(20, 90),
        "request_count": random.randint(100, 5000),
        "error_rate": round(random.uniform(0, 0.15), 3),
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

    send_event("metrics", payload)

    return jsonify(payload)


@app.route("/simulate-error")
def simulate_error():
    payload = {
        "status": "error",
        "severity": random.choice(["low", "medium", "high", "critical"]),
        "message": "Simulated application failure",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

    send_event("simulated_error", payload)

    return jsonify(payload), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
