const fs = require('fs');
const path = require('path');

function extractPMAverages(inputData, folderPath) {
  const location = inputData.Location;
  const inputPM2_5 = parseFloat(inputData.PM2_5); // Convert input values to numbers
  const inputPM10 = parseFloat(inputData.PM10);
  const pmAveragesArray = [];

  try {
    const files = fs.readdirSync(folderPath);

    files.sort((fileA, fileB) => {
      const statA = fs.statSync(path.join(folderPath, fileA));
      const statB = fs.statSync(path.join(folderPath, fileB));
      return statA.ctime - statB.ctime; // Sort by creation time
    });

    files.forEach(file => {
      const filePath = path.join(folderPath, file);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const jsonData = JSON.parse(fileContents);

      let pm25Total = 0;
      let pm10Total = 0;
      let pmCount = 0;

      jsonData.forEach(fileData => {
        if (fileData.Location === location && typeof fileData.PM2_5 === 'number' && typeof fileData.PM10 === 'number') {
          pm25Total += fileData.PM2_5;
          pm10Total += fileData.PM10;
          pmCount++;
        }
      });

      if (pmCount > 0) {
        const pm25Average = pm25Total / pmCount;
        const pm10Average = pm10Total / pmCount;
        const averagedValue = (pm25Average + pm10Average) / 2;
        pmAveragesArray.push(Math.max(0, averagedValue)); // Replace negative values with 0
      } else if (!isNaN(inputPM2_5) && !isNaN(inputPM10)) {
        const inputAverage = (inputPM2_5 + inputPM10) / 2;
        pmAveragesArray.push(Math.max(0, inputAverage)); // Use the input averages if no valid data
      }
    });

    return pmAveragesArray;
  } catch (error) {
    console.error('An error occurred:', error);
    return [];
  }
}

module.exports = extractPMAverages;
