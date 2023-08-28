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
      return "Kvalita ovzduší je v nezdravá.";
    case 6:
      return "Kvalita ovzduší je nebezpečná.";
    case 7:
      return "Kvalita ovzduší je extrémní.";
    default:
      return "Není dostupná žádná informace o kvalitě ovzduší.";
  }
}

function calculateOverallIconLevel(data) {
  const { Temperature, Humidity, Pressure, PM2_5, PM10 } = data;

  // Calculate AQI levels for PM2.5 and PM10
  const pm2_5IconLevel = calculateSinglePMIconLevel(PM2_5 || 0); // Use 0 if PM2.5 value is missing
  const pm10IconLevel = calculateSinglePMIconLevel(PM10 || 0); // Use 0 if PM10 value is missing

  // Determine the more severe PM icon level
  const combinedIconLevel = Math.max(pm2_5IconLevel, pm10IconLevel);

  // Get quality text based on the icon level
  const qualityText = getQualityText(combinedIconLevel);

  //console.log("PM2.5 Icon Level:", pm2_5IconLevel);
  //console.log("PM10 Icon Level:", pm10IconLevel);
  //console.log("Combined Icon Level:", combinedIconLevel);
  //console.log("Quality Text:", qualityText);

  return combinedIconLevel;
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
    return 7;
  }
}

module.exports = { getQualityText, calculateOverallIconLevel };