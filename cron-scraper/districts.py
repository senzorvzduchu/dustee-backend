import requests
import csv
import os
from geopy.geocoders import Nominatim
from collections import OrderedDict
import time

def get_sensor_data(country_code):
    url = f'https://data.sensor.community/airrohr/v1/filter/country={country_code}'
    
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        return data
    else:
        print(f"Error: {response.status_code}")
        return None

def get_district_name(latitude, longitude):
    geolocator = Nominatim(user_agent="geoapiExercises")
    location = geolocator.reverse((latitude, longitude), exactly_one=True)
    if location:
        address = location.raw.get('address', {})
        district = address.get('county') or address.get('city_district') or address.get('suburb')
        return district
    return None

def save_to_csv(district_sensors):
    for district, sensor_info in district_sensors.items():
        filename = f"{district}_data.csv"
        file_exists = os.path.isfile(filename)

        with open(filename, mode='a', newline='') as file:
            fieldnames = ['District', 'Pressure Average', 'Temperature Average', 'Humidity Average', 'PM2.5 Average', 'PM10 Average']
            writer = csv.DictWriter(file, fieldnames=fieldnames)

            if not file_exists:
                writer.writeheader()

            avg_values = {}
            for param, values in sensor_info.items():
                # Calculate average excluding None values
                non_empty_values = [value for value in values if value is not None]
                avg_value = sum(non_empty_values) / len(non_empty_values) if non_empty_values else 0
                avg_values[param] = f"{avg_value:.2f}"

            print(f"District: {district}, Sensor Info: {sensor_info}")  # Print sensor_info for debugging

            avg_values_ordered = OrderedDict()
            for key in fieldnames:
                if key in avg_values:
                    avg_values_ordered[key] = avg_values[key]
                else:
                    avg_values_ordered[key] = ''  # Set empty string for 'District'

            avg_values_ordered['District'] = district
            writer.writerow(avg_values_ordered)

    # Save all sensors to the 'all-sensors.csv' file
    all_sensors_file = 'all-sensors.csv'
    all_sensors_exist = os.path.isfile(all_sensors_file)

    with open(all_sensors_file, mode='w', newline='') as file:
        fieldnames = ['Sensor ID', 'Latitude', 'Longitude']
        writer = csv.DictWriter(file, fieldnames=fieldnames)

        if not all_sensors_exist:
            writer.writeheader()

        max_requests_per_minute = 10  # Limit the number of requests to geopy per minute
        sensors_per_request = 10

        processed_sensors = 0
        total_sensors = len(sensor_data)

        for start_index in range(0, total_sensors, sensors_per_request):
            end_index = min(start_index + sensors_per_request, total_sensors)

            for sensor in sensor_data[start_index:end_index]:
                latitude = sensor.get('location', {}).get('latitude', None)
                longitude = sensor.get('location', {}).get('longitude', None)
                sensor_id = sensor.get('sensor', {}).get('id', None)
                sensordatavalues = sensor.get('sensordatavalues', [])

                pressure, temperature, humidity, pm25, pm10 = None, None, None, None, None
                for data in sensordatavalues:
                    if data.get('value_type') == 'P':
                        pressure = float(data.get('value', 0))
                    elif data.get('value_type') == 'T':
                        temperature = float(data.get('value', 0))
                    elif data.get('value_type') == 'H':
                        humidity = float(data.get('value', 0))
                    elif data.get('value_type') == 'P2':
                        pm25 = float(data.get('value', 0))
                    elif data.get('value_type') == 'P1':
                        pm10 = float(data.get('value', 0))

                if latitude is not None and longitude is not None and sensor_id is not None:
                    district_name = get_district_name(latitude, longitude)
                    if district_name:
                        if district_name not in district_sensors:
                            district_sensors[district_name] = {
                                'Pressure': [],
                                'Temperature': [],
                                'Humidity': [],
                                'PM2.5': [],
                                'PM10': []
                            }
                        district_sensors[district_name]['Pressure'].append(pressure)
                        district_sensors[district_name]['Temperature'].append(temperature)
                        district_sensors[district_name]['Humidity'].append(humidity)
                        district_sensors[district_name]['PM2.5'].append(pm25)
                        district_sensors[district_name]['PM10'].append(pm10)

                processed_sensors += 1
                print(f"Processed sensor {processed_sensors}/{total_sensors}")

                if processed_sensors >= total_sensors:
                    break

                # Delay between geolocation requests
                time.sleep(60 / max_requests_per_minute)

        save_to_csv(district_sensors)

        print("Data processing complete!")

