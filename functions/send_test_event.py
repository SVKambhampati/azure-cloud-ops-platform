import json
from azure.eventhub import EventHubProducerClient, EventData

with open("local.settings.json") as f:
    settings = json.load(f)

conn_str = settings["Values"]["EVENT_HUB_CONNECTION_STR"]

producer = EventHubProducerClient.from_connection_string(
    conn_str=conn_str
)

event = {
    "deviceId": "test-device-001",
    "temperature": 72.5,
    "humidity": 44,
    "status": "normal"
}

with producer:
    batch = producer.create_batch()
    batch.add(EventData(json.dumps(event)))
    producer.send_batch(batch)

print("Sent test event")
