const axios = require("axios");

async function fetchTemperatureForCzechRepublic() {
  const apiKey = "ce48301aaf1d16612230648eeff30329";
  const latitude = 49.8175; // Default latitude for the Czech Republic
  const longitude = 15.473; // Default longitude for the Czech Republic

  const openWeatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

  try {
    const response = await axios.get(openWeatherApiUrl);
    const temperature = response.data.main.temp;
    return temperature;
  } catch (error) {
    console.error("Error fetching temperature data:", error);
    return null;
  }
}

module.exports = { fetchTemperatureForCzechRepublic };
