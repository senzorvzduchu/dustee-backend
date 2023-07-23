import requests
import csv
import os

def get_sensor_data(country_code):
    url = f'https://data.sensor.community/airrohr/v1/filter/country={country_code}'
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        return data
    else:
        print(f"Error: {response.status_code}")
        return None


def print_sensor_data(data, param):
    for sensor in data:
        print(get_sensor_value(sensor, param))


def get_sensor_value(sensor, param):
    sensor_id = sensor['id']

    if param == 'temperature':
        if any(sensor['value_type'] == 'temperature' for sensor in sensor['sensordatavalues']):
            return f"Sensor ID: {sensor_id}, Temperature: {next(sensor['value'] for sensor in sensor['sensordatavalues'] if sensor['value_type'] == 'temperature')}"
        else:
            return f"Sensor ID: {sensor_id}, Sensor doesn't have a temperature sensor"

    if param == 'pressure':
        if any(sensor['value_type'] == 'pressure' for sensor in sensor['sensordatavalues']):
            return f"Sensor ID: {sensor_id}, Pressure: {next(sensor['value'] for sensor in sensor['sensordatavalues'] if sensor['value_type'] == 'pressure')}"
        else:
            return f"Sensor ID: {sensor_id}, Sensor doesn't have a pressure sensor"

    if param == 'humidity':
        if any(sensor['value_type'] == 'humidity' for sensor in sensor['sensordatavalues']):
            return f"Sensor ID: {sensor_id}, Humidity: {next(sensor['value'] for sensor in sensor['sensordatavalues'] if sensor['value_type'] == 'humidity')}"
        else:
            return f"Sensor ID: {sensor_id}, Sensor doesn't have a humidity sensor"

    if param == 'altitude':
        if 'altitude' in sensor['location']:
            return f"Sensor ID: {sensor_id}, Altitude: {sensor['location']['altitude']}"
        else:
            return f"Sensor ID: {sensor_id}, Sensor doesn't have an altitude value"

    if param == 'place':
        if 'latitude' in sensor['location'] and 'longitude' in sensor['location']:
            return f"Sensor ID: {sensor_id}, Latitude: {sensor['location']['latitude']}, Longitude: {sensor['location']['longitude']}"
        else:
            return f"Sensor ID: {sensor_id}, Sensor doesn't have location coordinates"

    if param == 'country':
        if 'country' in sensor['location']:
            return f"Sensor ID: {sensor_id}, Country: {sensor['location']['country']}"
        else:
            return f"Sensor ID: {sensor_id}, Sensor doesn't have a country value"

    if param == 'manufacturer':
        if 'manufacturer' in sensor['sensor']['sensor_type'] and 'name' in sensor['sensor']['sensor_type']:
            return f"Sensor ID: {sensor_id}, Manufacturer: {sensor['sensor']['sensor_type']['manufacturer']}, Sensor Type: {sensor['sensor']['sensor_type']['name']}"
        else:
            return f"Sensor ID: {sensor_id}, Sensor doesn't have a manufacturer and sensor type"

    if param == 'pm25':
        if any(sensor['value_type'] == 'P2' for sensor in sensor['sensordatavalues']):
            return f"Sensor ID: {sensor_id}, PM2.5: {next(sensor['value'] for sensor in sensor['sensordatavalues'] if sensor['value_type'] == 'P2')}"
        else:
            return f"Sensor ID: {sensor_id}, Sensor doesn't have a PM2.5 sensor"

    if param == 'pm10':
        if any(sensor['value_type'] == 'P0' for sensor in sensor['sensordatavalues']):
            return f"Sensor ID: {sensor_id}, PM10: {next(sensor['value'] for sensor in sensor['sensordatavalues'] if sensor['value_type'] == 'P0')}"
        else:
            return f"Sensor ID: {sensor_id}, Sensor doesn't have a PM10 sensor"

    return f"Sensor ID: {sensor_id}, Invalid parameter"


def save_data_as_csv(sensor_data, filename):
    if not filename.endswith(".csv"):
        filename += ".csv"

    if not os.path.exists(filename):
        print(f"Error: The file {filename} does not exist.")
        return

    with open(filename, "w", newline="") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(["Sensor ID", "Latitude", "Longitude"])
        for sensor in sensor_data:
            sensor_id = sensor['id']
            latitude = sensor['location'].get('latitude', 'N/A')
            longitude = sensor['location'].get('longitude', 'N/A')
            writer.writerow([sensor_id, latitude, longitude])
    print(f"The data has been updated in {filename}")


if __name__ == '__main__':
    country_code = 'CZ'  # country code
    sensor_data = get_sensor_data(country_code)

    if sensor_data:
        print_sensor_data(sensor_data, "place")

        existing_filename = "all-sensors.csv"  # Replace with your actual file name
        save_data_as_csv(sensor_data, existing_filename)
