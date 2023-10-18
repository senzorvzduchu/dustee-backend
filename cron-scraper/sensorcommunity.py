import json
import requests
import os
import csv
from geopy.geocoders import Nominatim
from geopy.extra.rate_limiter import RateLimiter
import logging
from collections import defaultdict
from statistics import median

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



# Define the list of relevant measurement types
relevant_measurement_types = ["temperature", "pressure", "humidity", "P1", "P2"]

# Function to extract sensor measurements and calculate medians
def extract_sensor_measurements(data):
    # Create a dictionary to store sensor data with unique IDs
    sensor_data = {}

    for entry in data:
        sensor_data_entry = entry["sensordatavalues"]
        sensor_id = entry["sensor"]["id"]
        latitude = entry["location"]["latitude"]
        longitude = entry["location"]["longitude"]

        if sensor_id not in sensor_data:
            sensor_data[sensor_id] = {
                "SensorID": sensor_id,
                "Latitude": latitude,
                "Longitude": longitude,
            }

        for sensor_value in sensor_data_entry:
            value_type = sensor_value["value_type"]
            if value_type in relevant_measurement_types:
                value = sensor_value["value"]
                if value != 'unknown':
                    try:
                        value = float(value)
                        if value_type == "pressure":
                            value /= 100
                        if value_type not in sensor_data[sensor_id]:
                            sensor_data[sensor_id][value_type] = [value]
                        else:
                            sensor_data[sensor_id][value_type].append(value)
                    except ValueError:
                        pass

    # Calculate medians for each unique sensor
    for sensor_id, sensor_entry in sensor_data.items():
        for measurement_type, values in sensor_entry.items():
            if measurement_type in relevant_measurement_types:
                sensor_entry[measurement_type] = median(values)

    return list(sensor_data.values())


if __name__ == '__main__':
    try:
        country_code = 'CZ'  # country code
        folder_path = '/home/ubuntu/dustee-backend/cron-scraper/data/sensor_community'  # where to save files
        log_path = '/home/ubuntu/dustee-backend/cron-scraper/logs/sclog.txt'

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
            
            sfinal_data = extract_sensor_measurements(sensor_data)

            # Save the station median data to a JSON file
            with open('/home/ubuntu/dustee-backend/cron-scraper/data/sensor_community/all-sensors.json', "w") as json_file:
                json.dump(sfinal_data, json_file, indent=4)

                logger.info("Station median data saved to station_medians.json")
    
    except Exception as e:
        logger.exception("An error occurred during script execution: %s", e)




