from flask import Flask, jsonify
from datetime import datetime, timezone
import random

app = Flask(__name__)

@app.route("/")
def home():
    return jsonify({
        "message": "Cloud Ops Monitoring Backend",
        "status": "running"
    })

@app.route("/health")
def health():
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat()
    })

@app.route("/metrics")
def metrics():
    return jsonify({
        "cpu_percent": random.randint(10, 95),
        "memory_percent": random.randint(20, 90),
        "request_count": random.randint(100, 5000),
        "error_rate": round(random.uniform(0, 0.15), 3),
        "timestamp": datetime.now(timezone.utc).isoformat()
    })

@app.route("/simulate-error")
def simulate_error():
    return jsonify({
        "status": "error",
        "severity": random.choice(["low", "medium", "high", "critical"]),
        "message": "Simulated application failure",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)

