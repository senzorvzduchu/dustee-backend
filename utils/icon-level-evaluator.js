const axios = require("axios");

function getQualityText(iconLevel) {
  switch (iconLevel) {
    case 1:
      return "Kvalita ovzduší je výborná.";
    case 2:
      return "Kvalita ovzduší je dobrá.";
    case 3:
      return "Kvalita ovzduší je nezdravá pro rizikové skupiny.";
    case 4:
      return "Kvalita ovzduší je riziková.";
    case 5:
      return "Kvalita ovzduší je nezdravá.";
    case 6:
      return "Kvalita ovzduší je nebezpečná.";
    default:
      return "Kvalita ovzduší je nezdravá pro rizikové skupiny.";
  }
}

async function calculateOverallIconLevel(data) {
  const { Temperature, Humidity, Pressure, PM2_5, PM10 } = data;

  if (PM2_5 === undefined) {
    // Both PM2.5 and PM10 values are missing, fetch them from OpenWeather API
    const aqiValue = await fetchOpenWeatherDataForCzechRepublic();
    return aqiValue == null ? 2 : aqiValue;
  } else {
    // Calculate AQI levels for PM2.5 and PM10 from the provided data
    const pm2_5IconLevel = calculateSinglePMIconLevel(
      Math.round(PM2_5 * 4) || 0
    );
    //const pm10IconLevel = calculateSinglePMIconLevel(PM10 || 0);

    // Determine the more severe PM icon level
    //const combinedIconLevel = Math.max(pm2_5IconLevel, pm10IconLevel);

    // Return the combined icon level
    return pm2_5IconLevel;
  }
}

// Function to fetch OpenWeather data for Czech Republic
async function fetchOpenWeatherDataForCzechRepublic() {
  const apiKey = "ce48301aaf1d16612230648eeff30329";
  const openWeatherApiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=49.8175&lon=15.4730&appid=${apiKey}`;

  try {
    const response = await axios.get(openWeatherApiUrl);
    const aqiData = response.data;

    if (aqiData.list && aqiData.list.length > 0) {
      const aqiValue = aqiData.list[0].main.aqi;
      console.log(aqiValue);
      return aqiValue;
    } else {
      console.log("AQI data not found for the specified location.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching AQI data:", error);
    return null;
  }
}
function calculateSinglePMIconLevel(pmValue) {
  if (pmValue >= 0 && pmValue <= 12) {
    return 1;
  } else if (pmValue > 12 && pmValue <= 35.4) {
    return 2;
  } else if (pmValue > 35.4 && pmValue <= 55.4) {
    return 3;
  } else if (pmValue > 55.4 && pmValue <= 150.4) {
    return 4;
  } else if (pmValue > 150.4 && pmValue <= 250.4) {
    return 5;
  } else if (pmValue > 250.4 && pmValue <= 300) {
    return 6;
  } else {
    return 2;
  }
}

module.exports = { getQualityText, calculateOverallIconLevel };
