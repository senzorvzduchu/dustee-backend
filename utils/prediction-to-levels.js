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

function processForecastData(inputData) {
    const outputData = {};
    let index = 0;
    for (const key in inputData) {
        if (inputData.hasOwnProperty(key)) {
            const pmLevel = calculateSinglePMIconLevel(inputData[key]);
            outputData[index.toString()] = pmLevel;
            index++;
        }
    }
    return outputData;
}

module.exports = processForecastData;
