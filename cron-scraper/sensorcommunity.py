import requests
import os
import csv
from geopy.geocoders import Nominatim

def get_sensor_data(country_code, limit=None):
    print("Fetching sensor data...")
    url = f'https://data.sensor.community/airrohr/v1/filter/country={country_code}'
    headers = {'User-Agent': 'geoapiExercises'}  # TODO Replace 'geoapiExercises' with our custom user agent
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        data = response.json()
        print("Sensor data fetched successfully!")
        return data[:limit] if limit else data
    else:
        print(f"Error: {response.status_code}")
        return None

def get_district_name(latitude, longitude):
    print("Retrieving district name...")
    geolocator = Nominatim(user_agent="geoapiExercises")
    location = geolocator.reverse((latitude, longitude), exactly_one=True)
    if location:
        address = location.raw.get('address', {})
        district =address.get('city_district') or address.get('suburb')
        print("District name retrieved!")
        return district
    print("No district name found.")
    return None

def process_sensor_data(sensor_data):
    district_data = {}
    total_sensors = len(sensor_data)
    for i, sensor in enumerate(sensor_data, 1):
        latitude = sensor.get('location', {}).get('latitude', None)
        longitude = sensor.get('location', {}).get('longitude', None)
        sensor_id = sensor.get('sensor', {}).get('id', None)

        # Initialize the variables to None
        pressure = None
        temperature = None
        humidity = None
        pm25 = None
        pm10 = None

        for sensordata in sensor.get('sensordatavalues', []):
            value_type = sensordata.get('value_type')
            value = sensordata.get('value')
            if value_type == 'pressure':
                pressure = float(value) if value is not None else None
            elif value_type == 'temperature':
                temperature = float(value) if value is not None else None
            elif value_type == 'humidity':
                humidity = float(value) if value is not None else None
            elif value_type == 'P2':
                pm25 = float(value) if value is not None else None
            elif value_type == 'P1':
                pm10 = float(value) if value is not None else None

        if latitude is not None and longitude is not None and sensor_id is not None:
            district_name = get_district_name(latitude, longitude)
            if district_name:
                if district_name not in district_data:
                    district_data[district_name] = {
                        'Temperature': [],
                        'Pressure': [],
                        'Humidity': [],
                        'PM2.5': [],
                        'PM10': []
                    }
                if temperature is not None:
                    district_data[district_name]['Temperature'].append(temperature)
                if pressure is not None:
                    district_data[district_name]['Pressure'].append(pressure)
                if humidity is not None:
                    district_data[district_name]['Humidity'].append(humidity)
                if pm25 is not None:
                    district_data[district_name]['PM2.5'].append(pm25)
                if pm10 is not None:
                    district_data[district_name]['PM10'].append(pm10)

        print(f"Processed sensor {i}/{total_sensors}")

    return district_data

def write_to_csv(file_name, folder_path, headers, rows):
    # Check if the folder exists, if not create it
    os.makedirs(folder_path, exist_ok=True)

    file_path = os.path.join(folder_path, file_name)

    # Check if the file exists, and if yes, delete its contents
    if os.path.exists(file_path):
        with open(file_path, 'w', newline='') as file:
            pass

    with open(file_path, 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(headers)
        writer.writerows(rows)

if __name__ == '__main__':
    country_code = 'CZ'  # country code
    folder_path = 'data/sensor_community' # where to save files
    sensor_data = get_sensor_data(country_code, limit=None)
    if sensor_data:
        district_data = process_sensor_data(sensor_data)

        # Write all-sensors.csv
        all_sensors_file = "all-sensors.csv"
        all_sensors_headers = ['SensorID', 'Latitude', 'Longitude']
        all_sensors_rows = []
        for sensor in sensor_data:
            sensor_id = sensor.get('sensor', {}).get('id', None)
            latitude = sensor.get('location', {}).get('latitude', None)
            longitude = sensor.get('location', {}).get('longitude', None)
            if sensor_id and latitude and longitude:
                all_sensors_rows.append([sensor_id, latitude, longitude])

        write_to_csv(all_sensors_file, folder_path, all_sensors_headers, all_sensors_rows)

        # Write separate CSV files for each district
        for district, data in district_data.items():
            file_name = f"{district}.csv"
            headers = ['Temperature', 'Pressure', 'Humidity', 'PM2.5', 'PM10']
            rows = [[
                sum(data['Temperature']) / len(data['Temperature']) if data['Temperature'] else None,
                sum(data['Pressure']) / len(data['Pressure']) if data['Pressure'] else None,
                sum(data['Humidity']) / len(data['Humidity']) if data['Humidity'] else None,
                sum(data['PM2.5']) / len(data['PM2.5']) if data['PM2.5'] else None,
                sum(data['PM10']) / len(data['PM10']) if data['PM10'] else None,
            ]]

            write_to_csv(file_name, folder_path, headers, rows)
