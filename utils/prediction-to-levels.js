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

function processForecastData(inputData) {
  const outputData = {};
  let index = 0;
  for (const key in inputData) {
    if (inputData.hasOwnProperty(key)) {
      const pmLevel = calculateSinglePMIconLevel(
        Math.round(mapValueToRange(inputData[key]))
      );
      outputData[index.toString()] = pmLevel;
      index++;
    }
  }
  return outputData;
}

module.exports = processForecastData;
