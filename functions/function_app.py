import azure.functions as func
import logging
import json
import os
from datetime import datetime, timezone
from azure.storage.blob import BlobServiceClient

app = func.FunctionApp()

STORAGE_CONNECTION_STR = os.getenv("AzureWebJobsStorage")
CONTAINER_NAME = "raw-logs"


@app.event_hub_message_trigger(
    arg_name="event",
    event_hub_name="cloud-ops-events",
    connection="EVENT_HUB_CONNECTION_STR"
)
def ProcessTelemetryEvents(event: func.EventHubEvent):
    try:
        raw_body = event.get_body().decode("utf-8")
        data = json.loads(raw_body)

        timestamp = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S-%f")
        event_type = data.get("event_type", "unknown")
        blob_name = f"{event_type}/event-{timestamp}.json"

        blob_service_client = BlobServiceClient.from_connection_string(
            STORAGE_CONNECTION_STR
        )

        blob_client = blob_service_client.get_blob_client(
            container=CONTAINER_NAME,
            blob=blob_name
        )

        blob_client.upload_blob(
            json.dumps(data, indent=2),
            overwrite=True
        )

        logging.info(f"Stored Event Hub event in Blob Storage: {blob_name}")

    except Exception as e:
        logging.error(f"Failed to process Event Hub event: {e}")
        raise
