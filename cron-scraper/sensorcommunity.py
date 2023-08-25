import requests
import os
import csv
from geopy.geocoders import Nominatim
from geopy.extra.rate_limiter import RateLimiter
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


def get_sensor_data(country_code, limit=None):
    logger.info("Fetching sensor data...")
    url = f'https://data.sensor.community/airrohr/v1/filter/country={country_code}'
    # TODO Replace 'geoapiExercises' with our custom user agent
    #headers = {'User-Agent': 'geoapiExercises'}
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        logger.info("Sensor data fetched successfully!")
        return data[:limit] if limit else data
    else:
        logger.error(f"Error: {response.status_code}")
        return None


def get_district_name(latitude, longitude):
    logger.info("Retrieving district name...")
    geolocator = Nominatim(user_agent="openweathermap.0duyh@passinbox.com")
    reverse = RateLimiter(geolocator.reverse, min_delay_seconds=2)
    location = reverse((latitude, longitude), exactly_one=True)
    if location:
        address = location.raw.get('address', {})
        district = address.get('city_district') or address.get('suburb')
        logger.info("District name retrieved!")
        return district
    logger.info("No district name found.")
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
                # Divide pressure by 100
                pressure = float(value) / 100 if value is not None else None
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
                    district_data[district_name]['Temperature'].append(
                        temperature)
                if pressure is not None:
                    district_data[district_name]['Pressure'].append(pressure)
                if humidity is not None:
                    district_data[district_name]['Humidity'].append(humidity)
                if pm25 is not None:
                    district_data[district_name]['PM2.5'].append(pm25)
                if pm10 is not None:
                    district_data[district_name]['PM10'].append(pm10)

        logger.info(f"Processed sensor {i}/{total_sensors}")

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
    try:
        country_code = 'CZ'  # country code
        folder_path = 'data/sensor_community'  # where to save files
        log_path = 'logs/sclog.txt'

        # Set up logging to write to a file
        log_file_path = os.path.join(log_path, 'sclog.txt')
        file_handler = logging.FileHandler(log_path)
        file_handler.setLevel(logging.INFO)
        file_formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
        file_handler.setFormatter(file_formatter)
        logger.addHandler(file_handler)
        
        logger.info("Starting the script...")
    
    
        sensor_data = get_sensor_data(country_code, limit=None)

        if sensor_data:
            district_data = process_sensor_data(sensor_data)


            # Delete contents of the folder to avoid duplicates
            for filename in os.listdir(folder_path):
                file_path = os.path.join(folder_path, filename)
                try:
                    if os.path.isfile(file_path):
                        os.unlink(file_path)
                except Exception as e:
                    logger.error(f"Error deleting {file_path}: {e}")
                    
            # Write separate CSV files for each district
            for district, data in district_data.items():
                file_name = f"{district}.csv"
                headers = ['Temperature', 'Pressure', 'Humidity', 'PM2.5', 'PM10']
                rows = [[
                    sum(data['Temperature']) / len(data['Temperature']
                                                ) if data['Temperature'] else None,
                    sum(data['Pressure']) / len(data['Pressure']
                                                ) if data['Pressure'] else None,
                    sum(data['Humidity']) / len(data['Humidity']
                                                ) if data['Humidity'] else None,
                    sum(data['PM2.5']) / len(data['PM2.5']
                                            ) if data['PM2.5'] else None,
                    sum(data['PM10']) / len(data['PM10']
                                            ) if data['PM10'] else None,
                ]]

                write_to_csv(file_name, folder_path, headers, rows)


            # Write all-sensors.csv
            all_sensors_file = "all-sensors.csv"
            all_sensors_headers = ['SensorID', 'Latitude', 'Longitude',
                                'Temperature', 'Pressure', 'Humidity', 'PM2.5', 'PM10']
            all_sensors_rows = []
            for sensor in sensor_data:
                sensor_id = sensor.get('sensor', {}).get('id', None)
                latitude = sensor.get('location', {}).get('latitude', None)
                longitude = sensor.get('location', {}).get('longitude', None)

                temperature = None
                pressure = None
                humidity = None
                pm25 = None
                pm10 = None

                for sensordata in sensor.get('sensordatavalues', []):
                    value_type = sensordata.get('value_type')
                    value = sensordata.get('value')
                    if value_type == 'temperature':
                        temperature = float(value) if value is not None else None
                    if value_type == 'pressure':
                        # Divide pressure by 100
                        pressure = float(value) / \
                            100 if value is not None else None
                    elif value_type == 'humidity':
                        humidity = float(value) if value is not None else None
                    elif value_type == 'P2':
                        pm25 = float(value) if value is not None else None
                    elif value_type == 'P1':
                        pm10 = float(value) if value is not None else None

                if sensor_id and latitude and longitude:
                    all_sensors_rows.append(
                        [sensor_id, latitude, longitude, temperature, pressure, humidity, pm25, pm10])
                    
                unique_locations = set()  # To store unique locations

                # Filter out sensors with the same coordinates
                unique_sensor_rows = []
                for row in all_sensors_rows:
                    sensor_id, latitude, longitude, temperature, pressure, humidity, pm25, pm10 = row
                    location = (latitude, longitude)
                    if location not in unique_locations:
                        unique_locations.add(location)
                        unique_sensor_rows.append(row)

                # Dictionary to store sensor data grouped by location
                location_groups = {}

                # Iterate through unique_sensor_rows and separate sensors by whether they have the same location
                for row in unique_sensor_rows:
                    sensor_id, latitude, longitude, temperature, pressure, humidity, pm25, pm10 = row
                    location = (latitude, longitude)

                    if location not in location_groups:
                        location_groups[location] = {
                            'count': 0,
                            'total_temperature': None,
                            'total_pressure': None,
                            'total_humidity': None,
                            'total_pm25': None,
                            'total_pm10': None
                        }

                    location_groups[location]['count'] += 1
                    if temperature is not None:
                        location_groups[location]['total_temperature'] = (location_groups[location]['total_temperature'] or 0) + temperature
                    if pressure is not None:
                        location_groups[location]['total_pressure'] = (location_groups[location]['total_pressure'] or 0) + pressure
                    if humidity is not None:
                        location_groups[location]['total_humidity'] = (location_groups[location]['total_humidity'] or 0) + humidity
                    if pm25 is not None:
                        location_groups[location]['total_pm25'] = (location_groups[location]['total_pm25'] or 0) + pm25
                    if pm10 is not None:
                        location_groups[location]['total_pm10'] = (location_groups[location]['total_pm10'] or 0) + pm10
                    location_groups[location]['sensor_ids'] = location_groups[location].get('sensor_ids', []) + [sensor_id]

                # Update all_sensors_rows with averaged data and keep individual sensors intact
                updated_all_sensors_rows = unique_sensor_rows.copy()

                # Initialize a dictionary to keep track of assigned sensor IDs for each location
                assigned_ids = {}

                for location, data in location_groups.items():
                    if data['count'] > 1:
                        sensor_ids = data['sensor_ids']
                        chosen_sensor_id = sensor_ids[0]  # Pick the first sensor ID in the group

                        total_temperature = data['total_temperature']
                        total_pressure = data['total_pressure']
                        total_humidity = data['total_humidity']
                        total_pm25 = data['total_pm25']
                        total_pm10 = data['total_pm10']
                        count = data['count']

                        avg_temperature = total_temperature / count if total_temperature is not None else None
                        avg_pressure = total_pressure / count if total_pressure is not None else None
                        avg_humidity = total_humidity / count if total_humidity is not None else None
                        avg_pm25 = total_pm25 / count if total_pm25 is not None else None
                        avg_pm10 = total_pm10 / count if total_pm10 is not None else None

                        if all(value is None for value in [avg_temperature, avg_pressure, avg_humidity, avg_pm25, avg_pm10]):
                            avg_temperature = avg_pressure = avg_humidity = avg_pm25 = avg_pm10 = None

                        latitude, longitude = location

                        updated_all_sensors_rows.append(
                            [chosen_sensor_id, latitude, longitude, avg_temperature, avg_pressure, avg_humidity, avg_pm25, avg_pm10]
                        )

                        
            write_to_csv(all_sensors_file, folder_path,
                        all_sensors_headers, updated_all_sensors_rows)
    
    except Exception as e:
        logger.exception("An error occurred during script execution: %s", e)




