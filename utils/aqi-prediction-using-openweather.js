const axios = require("axios");

async function getAirQualityForecasts(lat, lon) {
  const apiKey = "ce48301aaf1d16612230648eeff30329";
  // Calculate the current timestamp
  const now = Date.now() / 1000;

  // Create an array to store the requested AQI values
  const aqiValues = [];

  // Define the time intervals (in hours)
  const timeIntervals = [3, 6, 12];

  // Build the API URL for the provided coordinates
  const apiUrl = `http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  try {
    // Fetch the data from the API using Axios
    const response = await axios.get(apiUrl);
    const data = response.data;

    for (const interval of timeIntervals) {
      // Calculate the target time for the current interval
      const targetTime = now + interval * 3600; // Add hours in seconds

      // Find the forecast closest to the target time
      let closestForecast = null;
      let timeDifference = Infinity;

      for (const forecast of data.list) {
        const forecastTime = forecast.dt;

        // Calculate the time difference
        const diff = Math.abs(targetTime - forecastTime);

        if (diff < timeDifference) {
          closestForecast = forecast;
          timeDifference = diff;
        }
      }

      // Extract and push the AQI (Air Quality Index) to the array
      if (closestForecast) {
        aqiValues.push(closestForecast.main.aqi);
      } else {
        // If no data found for the interval, push null
        aqiValues.push(null);
      }
    }

    return aqiValues;
  } catch (error) {
    console.error("Error fetching air quality forecasts for provided coordinates. Trying Prague's coordinates:", error);

    // Build the API URL for Prague's coordinates as a fallback
    const pragueLat = 50.0755; // Prague's latitude
    const pragueLon = 14.4378; // Prague's longitude
    const pragueApiUrl = `http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${pragueLat}&lon=${pragueLon}&appid=${apiKey}`;

    try {
      // Fetch the data from the API using Axios for Prague's coordinates
      const pragueResponse = await axios.get(pragueApiUrl);
      const pragueData = pragueResponse.data;

      // Proceed with the same logic as before to get AQI values for Prague
      for (const interval of timeIntervals) {
        const targetTime = now + interval * 3600;
        let closestForecast = null;
        let timeDifference = Infinity;

        for (const forecast of pragueData.list) {
          const forecastTime = forecast.dt;
          const diff = Math.abs(targetTime - forecastTime);

          if (diff < timeDifference) {
            closestForecast = forecast;
            timeDifference = diff;
          }
        }

        if (closestForecast) {
          aqiValues.push(closestForecast.main.aqi);
        } else {
          aqiValues.push(null);
        }
      }

      return aqiValues;
    } catch (pragueError) {
      console.error("Error fetching air quality forecasts for Prague's coordinates. Fallback to AQI = 2:", pragueError);

      // If both requests fail, return an array of AQI values equal to 2
      return [2, 2, 2];
    }
  }
}

module.exports = getAirQualityForecasts;
