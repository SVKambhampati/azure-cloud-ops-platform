from azure.eventhub import EventHubProducerClient, EventData
import azure.functions as func
import logging
import json
import os
from datetime import datetime, timezone
from azure.storage.blob import BlobServiceClient


app = func.FunctionApp()

STORAGE_CONNECTION_STR = os.getenv("AzureWebJobsStorage")
CONTAINER_NAME = "raw-logs"


def classify_event(data):
    event_type = data.get("event_type", "unknown")
    payload = data.get("payload", {})

    classification = "normal"
    alert_reason = None

    if event_type == "metrics":
        cpu = payload.get("cpu_percent", 0)
        memory = payload.get("memory_percent", 0)
        error_rate = payload.get("error_rate", 0)

        if error_rate > 0.10:
            classification = "critical"
            alert_reason = f"High error rate detected: {error_rate}"
        elif cpu > 85:
            classification = "warning"
            alert_reason = f"High CPU usage detected: {cpu}%"
        elif memory > 85:
            classification = "warning"
            alert_reason = f"High memory usage detected: {memory}%"

    elif event_type == "simulated_error":
        severity = payload.get("severity", "low")

        if severity in ["high", "critical"]:
            classification = "critical"
            alert_reason = f"Simulated failure severity: {severity}"
        else:
            classification = "warning"
            alert_reason = f"Simulated failure severity: {severity}"

    return {
        "classification": classification,
        "alert_reason": alert_reason
    }

@app.route(route="submitTelemetry", methods=["POST"], auth_level=func.AuthLevel.ANONYMOUS)
def submitTelemetry(req: func.HttpRequest) -> func.HttpResponse:
    try:
        data = req.get_json()

        if "timestamp" not in data:
            data["timestamp"] = datetime.now(timezone.utc).isoformat()

        event_hub_conn_str = os.getenv("EVENT_HUB_SEND_CONNECTION_STR")

        producer = EventHubProducerClient.from_connection_string(
            conn_str=event_hub_conn_str
        )

        with producer:
            batch = producer.create_batch()
            batch.add(EventData(json.dumps(data)))
            producer.send_batch(batch)

        return func.HttpResponse(
            json.dumps({"message": "Telemetry submitted successfully", "data": data}),
            status_code=200,
            mimetype="application/json"
        )

    except Exception as e:
        logging.error(f"Failed to submit telemetry: {e}")
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            status_code=500,
            mimetype="application/json"
        )


@app.route(route="getProcessedEvents", methods=["GET"], auth_level=func.AuthLevel.ANONYMOUS)
def getProcessedEvents(req: func.HttpRequest) -> func.HttpResponse:
    try:
        blob_service_client = BlobServiceClient.from_connection_string(
            STORAGE_CONNECTION_STR
        )

        container_client = blob_service_client.get_container_client(CONTAINER_NAME)

        events = []

        for blob in container_client.list_blobs():
            if blob.name.endswith(".json"):
                blob_client = container_client.get_blob_client(blob.name)
                content = blob_client.download_blob().readall()
                event_data = json.loads(content)

                event_data["blob_name"] = blob.name
                events.append(event_data)

        events.sort(key=lambda x: x.get("processed_at", ""), reverse=True)

        return func.HttpResponse(
            json.dumps(events),
            status_code=200,
            mimetype="application/json"
        )

    except Exception as e:
        logging.error(f"Failed to fetch processed events: {e}")
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            status_code=500,
            mimetype="application/json"
        )
@app.event_hub_message_trigger(
    arg_name="event",
    event_hub_name="cloud-ops-events",
    connection="EVENT_HUB_LISTEN_CONNECTION_STR"
)
def ProcessTelemetryEvents(event: func.EventHubEvent):
    try:
        raw_body = event.get_body().decode("utf-8")
        data = json.loads(raw_body)

        classification_result = classify_event(data)

        processed_event = {
            "processed_at": datetime.now(timezone.utc).isoformat(),
            "event_type": data.get("event_type", "unknown"),
            "source": data.get("source", "unknown"),
            "original_timestamp": data.get("timestamp"),
            "classification": classification_result["classification"],
            "alert_reason": classification_result["alert_reason"],
            "payload": data.get("payload", {})
        }

        timestamp = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S-%f")
        event_type = processed_event["event_type"]
        classification = processed_event["classification"]

        blob_name = f"{classification}/{event_type}/event-{timestamp}.json"

        blob_service_client = BlobServiceClient.from_connection_string(
            STORAGE_CONNECTION_STR
        )

        blob_client = blob_service_client.get_blob_client(
            container=CONTAINER_NAME,
            blob=blob_name
        )

        blob_client.upload_blob(
            json.dumps(processed_event, indent=2),
            overwrite=True
        )

        logging.info(
            f"Stored processed event: {blob_name} | "
            f"classification={classification} | "
            f"reason={classification_result['alert_reason']}"
        )

    except Exception as e:
        logging.error(f"Failed to process Event Hub event: {e}")
        raise
