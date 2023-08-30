const axios = require('axios');

const apiKey = 'ce48301aaf1d16612230648eeff30329';

async function fetchAQI(location) {
  const baseUrl = 'https://api.openweathermap.org/data/2.5/air_pollution';
  const url = `${baseUrl}?q=${location}&appid=${apiKey}`;

  try {
    const response = await axios.get(url);
    return response.data.list[0].main.aqi;
  } catch (error) {
    console.error('Chyba při načítání dat AQI:', error.message);
    throw error;
  }
}

async function getAQIPrediction(input) {
  const location = input.Location;
  try {
    const aqi = await fetchAQI(location);

    const categorizeAQI = (aqiValue) => {
      if (aqiValue <= 50) {
        return 1; // Excellent
      } else if (aqiValue <= 100) {
        return 2; // Good
      } else if (aqiValue <= 150) {
        return 3; // Unhealthy for Sensitive Groups
      } else if (aqiValue <= 200) {
        return 4; // Unhealthy
      } else if (aqiValue <= 300) {
        return 5; // Very Unhealthy
      } else {
        return 6; // Hazardous
      }
    };

    const aqiCategory = categorizeAQI(aqi);
    const qualityText = getQualityText(aqiCategory);

    return {
      aqiValue: aqi,
      category: aqiCategory,
      quality: qualityText,
    };
  } catch (error) {
    console.error('Chyba při načítání předpovědi AQI:', error.message);
    return null;
  }
}

function getQualityText(iconLevel) {
  switch (iconLevel) {
    case 1:
      return "Kvalita ovzduší je vynikající.";
    case 2:
      return "Kvalita ovzduší je dobrá.";
    case 3:
      return "Kvalita ovzduší je nezdravá pro citlivé skupiny.";
    case 4:
      return "Kvalita ovzduší je nezdravá.";
    case 5:
      return "Kvalita ovzduší je velmi nezdravá.";
    case 6:
      return "Kvalita ovzduší je nebezpečná.";
    default:
      return "Kvalita ovzduší je nezdravá pro citlivé skupiny.";
  }
}

function getAQIPredictionForLocation(input) {
  const location = input.Location;
  return getAQIPrediction(location).then((aqiPrediction) => {
    if (aqiPrediction) {
      return aqiPrediction;
    } else {
      return {
        aqiValue: input.AQI,
        category: 'Neznámá',
        quality: 'Nezdravá pro citlivé skupiny',
      };
    }
  });
}

module.exports = getAQIPredictionForLocation;
