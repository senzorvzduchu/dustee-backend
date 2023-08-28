import os
import requests
import csv
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

pollutants = ['SO2', 'NO2', 'CO', 'O3', 'PM10', 'PM2_5']

def extract_values_for_pollutant(station, pollutant_code):
    for component in station['Components']:
        if component['Code'] == pollutant_code:
            return component.get('Val', '')
    return ''

def clean_csv(file_path):
    with open(file_path, 'w', newline='') as csvfile:
        csv_writer = csv.writer(csvfile)
        header = ['Sensor Code', 'Latitude', 'Longitude'] + pollutants
        csv_writer.writerow(header)

def main():
    logger.info("Fetching data and saving to CSV...")
    url = 'https://www.idea-envi.cz/JSON/ISKO/actual_hour_data/actual_hour_data.json'
    response = requests.get(url)
    data = response.json()

    save_path = 'data/CHMU/'
    os.makedirs(save_path, exist_ok=True)

    for state in data['States']:
        if state['Code'] == 'CZ':
            country_name = state['Name']
            country_folder = os.path.join(save_path, country_name)
            os.makedirs(country_folder, exist_ok=True)

            all_stations_csv_path = os.path.join(country_folder, 'all_stations.csv')
            clean_csv(all_stations_csv_path)

            for county in state['Regions']:
                county_name = county['Name']
                for station in county['Stations']:
                    station_name = station['Name']
                    station_id = station['Code']
                    results = {}
                    for pollutant in pollutants:
                        results[pollutant] = extract_values_for_pollutant(station, pollutant)

                    csv_file_path = os.path.join(country_folder, f'{station_name}.csv')

                    with open(csv_file_path, 'w', newline='') as csvfile:
                        csv_writer = csv.writer(csvfile)
                        csv_writer.writerow(['Sensor Code'] + pollutants)
                        row_data = [station_id] + [results[pollutant] for pollutant in pollutants]
                        csv_writer.writerow(row_data)

                    with open(all_stations_csv_path, 'a', newline='') as all_csvfile:
                        all_csv_writer = csv.writer(all_csvfile)
                        row_data = [station_id, station['Lat'], station['Lon']]
                        row_data += [results.get(pollutant, '') for pollutant in pollutants]
                        all_csv_writer.writerow(row_data)

                    logger.info(f"Data for station '{station_name}' saved to '{csv_file_path}'.")

            logger.info(f"All stations data for '{country_name}' saved to '{all_stations_csv_path}'.")

    logger.info("Data fetching and saving completed.")

if __name__ == "__main__":
    try:
        log_path = 'logs/chmulog.txt'
        log_file_path = os.path.join(log_path, 'chmulog.txt')
        file_handler = logging.FileHandler(log_path)
        file_handler.setLevel(logging.INFO)
        file_formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
        file_handler.setFormatter(file_formatter)
        logger.addHandler(file_handler)
        
        logger.info("Starting the script...")
        main()
        logger.info("Script execution completed.")

    except Exception as e:
        logger.exception("An error occurred during script execution: %s", e)
