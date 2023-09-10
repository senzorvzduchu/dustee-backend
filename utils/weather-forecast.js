const axios = require("axios");

const apiKey = "ce48301aaf1d16612230648eeff30329";

const weatherSvgMap = {
  Thunderstorm: "weather-thunder.svg",
  Drizzle: "weather-rain-drops.svg",
  Rain: "weather-rain.svg",
  Snow: "weather-snow.svg",
  Mist: "weather-cloud.svg",
  Smoke: "weather-cloud.svg",
  Haze: "weather-cloud.svg",
  Dust: "weather-cloud.svg",
  Fog: "weather-cloud.svg",
  Sand: "weather-cloud.svg",
  Ash: "weather-cloud.svg",
  Squall: "weather-wind-1.svg",
  Tornado: "weather-cloud-hurricane.svg",
  Clear: "weather-sun.svg",
  Clouds: "weather-cloud.svg",
};

async function fetchWeatherForecast(location) {
  const baseUrl = "https://api.openweathermap.org/data/2.5/forecast";
  const units = "metric"; // Specify the metric units
  const url = `${baseUrl}?q=${location}&appid=${apiKey}&units=${units}`;

  try {
    const response = await axios.get(url);
    return response.data.list;
  } catch (error) {
    console.error("Error fetching weather forecast:", error.message);
    throw error;
  }
}

async function getForecasts(location) {
  try {
    const forecastData = await fetchWeatherForecast(location);

    // Calculate current time in seconds since epoch
    const currentTime = Math.floor(new Date().getTime() / 1000);

    const extractInfo = (item) => ({
      weather: item.weather[0].main,
      icon: weatherSvgMap[item.weather[0].main], // Get the corresponding SVG icon name
      temperature: item.main.temp,
    });

    // Extract forecast data for 3, 6, and 12 hours intervals
    const forecast3Hours = extractInfo(
      forecastData.find((item) => item.dt > currentTime + 3 * 3600)
    );
    const forecast6Hours = extractInfo(
      forecastData.find((item) => item.dt > currentTime + 6 * 3600)
    );
    const forecast12Hours = extractInfo(
      forecastData.find((item) => item.dt > currentTime + 12 * 3600)
    );

    // Check if any forecast data is incomplete
    if (!forecast3Hours || !forecast6Hours || !forecast12Hours) {
      throw new Error("Incomplete forecast data");
    }

    return {
      forecast3Hours,
      forecast6Hours,
      forecast12Hours,
    };
  } catch (error) {
    console.error("Error fetching forecasts:", error.message);
    return null;
  }
}

async function getWeatherForecast(input) {
  let location;
  if (input.Location) {
    location = input.Location;
  } else if (input.Latitude && input.Longitude) {
    // Reverse geocode latitude and longitude to get a location
    const reverseGeocodeUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${input.Latitude}&lon=${input.Longitude}&appid=${apiKey}`;
    const reverseGeocodeResponse = await axios.get(reverseGeocodeUrl);
    location = reverseGeocodeResponse.data.name;
  }
  return getForecasts(location).then((forecasts) => {
    if (forecasts) {
      return forecasts;
    } else {
      return getForecasts("Praha").then((fallbackForecasts) => {
        if (fallbackForecasts) {
          return fallbackForecasts;
        } else {
          return {
            weather: "Clouds",
            icon: weatherSvgMap.Clouds,
            temperature: input.Temperature,
          };
        }
      });
    }
  });
}

module.exports = getWeatherForecast;
