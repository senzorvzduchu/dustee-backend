const ARIMA = require("arima");

function getMedianPredictions(inputData) {
  const order = { p: 1, d: 1, q: 1 };
  const model = new ARIMA(order);

  const timeInterval = 10;
  const timeHorizons = [3 * 60, 6 * 60, 12 * 60];
  const predictions = {};

  for (const horizon of timeHorizons) {
    const trainingData = inputData.slice(0, -horizon / timeInterval);
    const testingData = inputData.slice(-horizon / timeInterval);

    if (trainingData.length < order.p + order.d + order.q) {
      // Not enough data for training, return three times averaged input value
      const averagedValue = averageLastThreeValues(inputData);
      predictions[`${horizon / 60} hours forecast`] = [averagedValue, averagedValue, averagedValue];
      continue;
    }

    model.train(trainingData);

    function forecastNextValue(steps) {
      const forecast = model.predict(steps);
      return forecast[0];
    }

    const steps = horizon / timeInterval;
    const predictedValue = forecastNextValue(steps);
    predictions[`${horizon / 60} hours forecast`] = predictedValue;
  }

  const medianPredictions = {};
  for (const horizon in predictions) {
    const predictedValues = predictions[horizon];
    if (Array.isArray(predictedValues)) {
      medianPredictions[horizon] = median(predictedValues);
    } else {
      medianPredictions[horizon] = predictedValues;
    }
  }

  return medianPredictions;
}

function median(values) {
  values.sort((a, b) => a - b);
  const middle = Math.floor(values.length / 2);
  if (values.length % 2 === 0) {
    return (values[middle - 1] + values[middle]) / 2;
  } else {
    return values[middle];
  }
}

function averageLastThreeValues(values) {
  const startIndex = Math.max(values.length - 3, 0);
  const lastThreeValues = values.slice(startIndex);
  const sum = lastThreeValues.reduce((acc, value) => acc + value, 0);
  return sum / lastThreeValues.length;
}

module.exports = getMedianPredictions;
