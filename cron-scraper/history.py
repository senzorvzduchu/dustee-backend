from datetime import datetime
import json
import logging
import os
import csv
import time
import requests
from tenacity import retry, stop_after_attempt, wait_exponential
from geopy.geocoders import Nominatim
from geopy.extra.rate_limiter import RateLimiter

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# geographical center of CR
default_latitude = 49.7437  # Default latitude for CR
default_longitude = 15.33914  # Default longitude for CR

def get_lat_long(location_name, default_lat=None, default_long=None):
    # Create a geocoder object
    geolocator = Nominatim(user_agent="openweathermap.0duyh@passinbox.com")

    # Create a rate limiter with a specified rate limit (e.g., 1 request per second)
    geocode_with_delay = RateLimiter(geolocator.geocode, min_delay_seconds=1)

    try:
        # Use geocode method with rate limiting
        location = geocode_with_delay(location_name)

        if location:
            # Extract latitude and longitude
            latitude = location.latitude
            longitude = location.longitude
            return latitude, longitude
        else:
            if default_lat is not None and default_long is not None:
                return default_lat, default_long
            else:
                return None  # Location not found, and no default provided

    except Exception as e:
        logger.error(f"An error occurred: {str(e)}")
        if default_lat is not None and default_long is not None:
            return default_lat, default_long
        else:
            return None


def calculate_average(numbers):
    if len(numbers) == 0:
        return None
    return sum(numbers) / len(numbers)

def extract_data_from_file(file_path):
    extracted_data = {
        "Temperature": "none",
        "Pressure": "none",
        "Humidity": "none",
        "PM2_5": "none",
        "PM10": "none"
    }

    with open(file_path, "r") as file:
        reader = csv.reader(file)
        header = next(reader)

        if "Sensor Code" in header:
            for parts in reader:
                if len(parts) >= 7 and parts[0] != "Sensor Code":
                    _, so2, _, co, o3, pm10, pm2_5 = parts
                    extracted_data["PM2_5"] = pm2_5.strip() or extracted_data["PM2_5"]
                    extracted_data["PM10"] = pm10.strip() or extracted_data["PM10"]
        elif "Temperature" in header:
            for parts in reader:
                if len(parts) >= 5 and parts[0] != "Temperature":
                    temperature, pressure, humidity, pm25, pm10 = parts
                    extracted_data["Temperature"] = temperature.strip() or extracted_data["Temperature"]
                    extracted_data["Pressure"] = pressure.strip() or extracted_data["Pressure"]
                    extracted_data["Humidity"] = humidity.strip() or extracted_data["Humidity"]
                    extracted_data["PM2_5"] = pm25.strip() or extracted_data["PM2_5"]
                    extracted_data["PM10"] = pm10.strip() or extracted_data["PM10"]

    return extracted_data

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
def fetch_temperature_data(location):
    open_weather_api_key = "ce48301aaf1d16612230648eeff30329"
    url = f"https://api.openweathermap.org/data/2.5/weather?q={location}&appid={open_weather_api_key}&units=metric"
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        logger.info("OpenWeatherMap API Response:", data)  # log the response for debugging
        if "main" in data:
            return data["main"]
        else:
            logger.info("Response does not contain 'main' key.")
    else:
        logger.error("Failed to fetch temperature data. Status code:", response.status_code)
    
    return None

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
def fetch_air_quality_data(latitude, longitude):
    open_weather_api_key = "ce48301aaf1d16612230648eeff30329"
    url = f"http://api.openweathermap.org/data/2.5/air_pollution?lat={latitude}&lon={longitude}&appid={open_weather_api_key}&units=metric"
    response = requests.get(url)
    data = response.json()["list"][0]["components"]
    return data

def fetch_data_for_all_files():
    folder_paths = [
        "data/sensor_community",
        "data/CHMU/Česká republika"
    ]
    file_extension = ".csv"

    excluded_filenames = ["all-sensors.csv", "all_stations.csv"]  # Add filenames to exclude

    location = "Czech Republic"
    temperature_data = fetch_temperature_data(location)
    if not temperature_data:
        logger.info("Failed to fetch temperature data.")
        return []

    latitude = 50.0755
    longitude = 14.4378
    air_quality_data = fetch_air_quality_data(latitude, longitude)
    if not air_quality_data:
        logger.error("Failed to fetch air quality data.")
        return []

    average_temperature = calculate_average([temperature_data["temp"]])
    average_pressure = calculate_average([temperature_data["pressure"]])
    average_humidity = calculate_average([temperature_data["humidity"]])
    average_pm2_5 = calculate_average([air_quality_data["pm2_5"]])
    average_pm10 = calculate_average([air_quality_data["pm10"]])

    final_data = []

    for folder_path in folder_paths:
        file_names = os.listdir(folder_path)

        for file_name in file_names:
            if file_name in excluded_filenames:
                continue  # Skip processing excluded filenames

            file_path = os.path.join(folder_path, file_name)
            if os.path.isfile(file_path) and file_name.lower().endswith(file_extension):
                logger.info(f"Processing file: {file_name}")
                location_address = os.path.splitext(file_name)[0]
                extracted_data = extract_data_from_file(file_path)

                open_weather_data = fetch_temperature_data(location_address)

                if open_weather_data:
                    if extracted_data["Temperature"] == "none":
                        extracted_data["Temperature"] = open_weather_data["temp"]
                    if extracted_data["Pressure"] == "none":
                        extracted_data["Pressure"] = open_weather_data["pressure"]
                    if extracted_data["Humidity"] == "none":
                        extracted_data["Humidity"] = open_weather_data["humidity"]

                def update_value(value, average_value):
                    if isinstance(value, str) and value != "none" and value.replace(".", "", 1).isdigit():
                        return float(value)
                    return average_value


                extracted_data["Temperature"] = update_value(extracted_data["Temperature"], average_temperature)
                extracted_data["Pressure"] = update_value(extracted_data["Pressure"], average_pressure)
                extracted_data["Humidity"] = update_value(extracted_data["Humidity"], average_humidity)
                extracted_data["PM2_5"] = update_value(extracted_data["PM2_5"], average_pm2_5)
                extracted_data["PM10"] = update_value(extracted_data["PM10"], average_pm10)

                finalLatitude, finalLongitude = get_lat_long(location_address, default_lat=default_latitude, default_long=default_longitude)

                final_extracted_data = {
                    "Location": location_address,
                    "Temperature": extracted_data["Temperature"],
                    "Pressure": extracted_data["Pressure"],
                    "Humidity": extracted_data["Humidity"],
                    "PM2_5": extracted_data["PM2_5"],
                    "PM10": extracted_data["PM10"],
                    "Latitude": finalLatitude,
                    "Longitude":finalLongitude,
                }

                logger.info(f"Final extracted data for {file_name}:", final_extracted_data)
                final_data.append(final_extracted_data)

            time.sleep(1)

    return final_data

if __name__ == "__main__":
    try:
        log_path = 'logs/historylog.txt'
        log_file_path = os.path.join(log_path, 'historylog.txt')
        file_handler = logging.FileHandler(log_path)
        file_handler.setLevel(logging.INFO)
        file_formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
        file_handler.setFormatter(file_formatter)
        logger.addHandler(file_handler)
        
        logger.info("Starting the script...")

        data = fetch_data_for_all_files()

        # Get the current date and time
        current_datetime = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        
        # Create the 'data/history/region_data' folder if it doesn't exist
        output_folder = os.path.join("data", "history", "region_data")
        if not os.path.exists(output_folder):
            os.makedirs(output_folder)

        # Save the collected data as a JSON file
        output_filename = os.path.join(output_folder, f"data_{current_datetime}.json")
        with open(output_filename, "w", encoding="utf-8") as output_file:
            json.dump(data, output_file, indent=4, ensure_ascii=False)

        logger.info(f"Data saved to {output_filename}")

        logger.info("Script execution completed.")
    except Exception as e:
        logger.exception("An error occurred during script execution: %s", e)















