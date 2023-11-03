import json

# Load the JSON data from the file
with open("data/sensor_community/all-sensors.json", "r") as json_file:
    sensor_data = json.load(json_file)

# Define a function to check for duplicate IDs or coordinates
def check_for_duplicate_ids_and_coordinates(data):
    seen_ids = set()
    seen_coordinates = set()
    duplicate_ids = []
    duplicate_coordinates = []

    for entry in data:
        sensor_id = entry["SensorID"]
        coordinates = (entry["Latitude"], entry["Longitude"])

        if sensor_id in seen_ids:
            duplicate_ids.append(sensor_id)
        else:
            seen_ids.add(sensor_id)

        if coordinates in seen_coordinates:
            duplicate_coordinates.append(coordinates)
        else:
            seen_coordinates.add(coordinates)

    return duplicate_ids, duplicate_coordinates

# Check for duplicate IDs and coordinates
duplicate_ids, duplicate_coordinates = check_for_duplicate_ids_and_coordinates(sensor_data)

if duplicate_ids:
    print("Duplicate Sensor IDs found:")
    print(duplicate_ids)
else:
    print("No duplicate Sensor IDs found in the JSON data.")

if duplicate_coordinates:
    print("Duplicate Coordinates found:")
    print(duplicate_coordinates)
else:
    print("No duplicate Coordinates found in the JSON data.")
