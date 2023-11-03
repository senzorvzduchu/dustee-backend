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

function mapValueToRange(value) {
  if (value >= 0 && value <= 12.0) {
    return mapRange(value, 0, 12.0, 0, 50);
  } else if (value >= 12.1 && value <= 35.4) {
    return mapRange(value, 12.1, 35.4, 51, 100);
  } else if (value >= 35.5 && value <= 55.4) {
    return mapRange(value, 35.5, 55.4, 101, 150);
  } else if (value >= 55.5 && value <= 150.4) {
    return mapRange(value, 55.5, 150.4, 151, 200);
  } else if (value >= 150.5 && value <= 250.4) {
    return mapRange(value, 150.5, 250.4, 201, 300);
  } else if (value > 250.4) {
    return mapRange(value, 250.5, Infinity, 301, Infinity);
  }
}

function mapRange(value, fromMin, fromMax, toMin, toMax) {
  const normalizedValue = (value - fromMin) / (fromMax - fromMin);
  const mappedValue = normalizedValue * (toMax - toMin) + toMin;
  return mappedValue;
}

async function calculateOverallIconLevel(data) {
  const { Temperature, Humidity, Pressure, PM2_5, PM10 } = data;

  if (PM2_5 === undefined || PM2_5 === "") {
    // Both PM2.5 and PM10 values are missing, fetch them from OpenWeather API
    const aqiValue = await fetchOpenWeatherDataForCzechRepublic();
    return aqiValue == null ? 2 : aqiValue;
  } else {
    // Calculate AQI levels for PM2.5 and PM10 from the provided data
    const pm2_5IconLevel = calculateSinglePMIconLevel(
      Math.round(mapValueToRange(PM2_5))
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
  if (pmValue >= 0 && pmValue <= 50) {
    return 1;
  } else if (pmValue > 50 && pmValue <= 100) {
    return 2;
  } else if (pmValue > 100 && pmValue <= 150) {
    return 3;
  } else if (pmValue > 150 && pmValue <= 200) {
    return 4;
  } else if (pmValue > 200 && pmValue <= 300) {
    return 5;
  } else if (pmValue > 300) {
    return 6;
  } else {
    return 2;
  }
}

module.exports = { getQualityText, calculateOverallIconLevel };
