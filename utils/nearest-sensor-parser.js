const axios = require("axios"); // Import the axios library

const openWeatherApiKey = "ce48301aaf1d16612230648eeff30329";

// Function to fetch temperature data from OpenWeatherMap API
async function fetchTemperatureData(location) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    location
  )}&appid=${openWeatherApiKey}&units=metric`;

  try {
    const response = await axios.get(url);
    return response.data.main;
  } catch (error) {
    console.error("Error fetching temperature data:", error);
    return null;
  }
}

// Function to fetch air quality data from OpenWeatherMap API
async function fetchAirQualityData(latitude, longitude) {
  const url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${openWeatherApiKey}&units=metric`;

  try {
    const response = await axios.get(url);
    return response.data.list[0].components;
  } catch (error) {
    console.error("Error fetching air quality data:", error);
    return null;
  }
}

// Parse function with data fetching fallback for Czech Republic
async function parseSensorData(data) {
  try {
    let sensorId,
      temperature,
      pressure,
      humidity,
      pm25,
      pm10,
      longitude,
      latitude;

    if (!data) {
      // Fetch data for Czech Republic and average it
      const averageTemperatureData = await fetchTemperatureData(
        "Czech Republic"
      );
      const averageAirQualityData = await fetchAirQualityData(49.8175, 15.473);

      temperature = averageTemperatureData ? averageTemperatureData.temp : null;
      pressure = averageTemperatureData ? averageTemperatureData.pressure : null;
      humidity = averageTemperatureData ? averageTemperatureData.humidity : null;
      pm25 = averageAirQualityData ? averageAirQualityData.pm2_5 : null;
      pm10 = averageAirQualityData ? averageAirQualityData.pm10 : null;
      longitude = 15.473; // Czech Republic longitude
      latitude = 49.8175; // Czech Republic latitude
    } else {
      sensorId = data.sensor.id;

      const temperatureData = data.sensordatavalues.find(value => value.value_type === "temperature");
      const pressureData = data.sensordatavalues.find(value => value.value_type === "pressure");
      const humidityData = data.sensordatavalues.find(value => value.value_type === "humidity");

      temperature = temperatureData ? parseFloat(temperatureData.value) : null;
      pressure = pressureData ? parseFloat(pressureData.value) : null;
      humidity = humidityData ? parseFloat(humidityData.value) : null;

      longitude = parseFloat(data.location.longitude);
      latitude = parseFloat(data.location.latitude);

      const pm25Data = data.sensordatavalues.find(value => value.value_type === "PM2.5");
      const pm10Data = data.sensordatavalues.find(value => value.value_type === "PM10");

      pm25 = pm25Data ? parseFloat(pm25Data.value) : null;
      pm10 = pm10Data ? parseFloat(pm10Data.value) : null;
    }

    return {
      sensorId,
      Temperature: temperature,
      Pressure: pressure,
      Humidity: humidity,
      "PM2.5": pm25,
      PM10: pm10,
      Longitude: longitude,
      Latitude: latitude,
    };
  } catch (error) {
    console.error("Error parsing sensor data:", error);
    return null;
  }
}

module.exports = parseSensorData;
