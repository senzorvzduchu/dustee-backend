// Import axios library to make API requests
const axios = require("axios");

// Map of weather conditions to SVG names
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
const openWeatherApiKey = "ce48301aaf1d16612230648eeff30329";

// Function to get weather data and map to SVG name
async function getWeatherAndMapToSvg(input) {
  let location;

  try {

    if (input.Location) {
      location = input.Location;
    } else if (input.Latitude && input.Longitude) {
      // Reverse geocode latitude and longitude to get a location
      const reverseGeocodeUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${input.Latitude}&lon=${input.Longitude}&appid=${openWeatherApiKey}`;
      const reverseGeocodeResponse = await axios.get(reverseGeocodeUrl);
      location = reverseGeocodeResponse.data.name;
    }

    // Fetch weather data from OpenWeatherMap API for specified location
    const locationUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${openWeatherApiKey}`;
    const locationResponse = await axios.get(locationUrl);

    // Extract weather condition
    const weatherCondition = locationResponse.data.weather[0].main;

    // Map weather condition to SVG name
    const svgName = weatherSvgMap[weatherCondition];
    return svgName;
    
  } catch (error) {
    //console.error('Error fetching weather data for location:', error);

    // If fetching for the location fails, fetch for the Czech Republic
    try {
      const czechRepublicUrl = `https://api.openweathermap.org/data/2.5/weather?q=Czech Republic&appid=${openWeatherApiKey}`;
      const czechRepublicResponse = await axios.get(czechRepublicUrl);

      // Extract weather condition
      const weatherCondition =
        czechRepublicResponse.data.weather[0].main || "weather-cloud.svg";

      // Map weather condition to SVG name
      const svgName = weatherSvgMap[weatherCondition] || "default.svg";

      return svgName;
    } catch (error) {
      //console.error('Error fetching weather data for Czech Republic:', error);
      // If fetching for the location fails, return clouds SVG
      return "weather-cloud.svg";
    }
  }
}
module.exports = getWeatherAndMapToSvg;

/*
// Example input
const input = {
  "Location": "Chodov",
  "Temperature": 30,
  "Humidity": 50,
  "Pressure": 1080.392525,
  "PM2_5": "",
  "PM10": ""
};

// Call the function and log the result
getWeatherAndMapToSvg(input)
  .then(svgName => {
    if (svgName) {
      console.log('Mapped SVG Name:', svgName);
    } else {
      console.log('Error getting SVG name.');
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
*/
