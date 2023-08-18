const fs = require("fs");
const csv = require("csv-parser");

async function parseCSVToJSON(filePath, fullSensors = false) {
  return new Promise((resolve, reject) => {
    const results = [];
    
    const headers = fullSensors
      ? [
          "Sensor ID",
          "Latitude",
          "Longitude",
          "Temperature",
          "Pressure",
          "Humidity",
          "PM2.5",
          "PM10",
        ]
      : ["Sensor ID", "Latitude", "Longitude", "Temperature"];

    fs.createReadStream(filePath)
      .pipe(
        csv({
          headers,
          skipLines: 1, // Skip the header line in the CSV file
        })
      )
      .on("data", (data) => {
        const filteredData = {};
        headers.forEach((header) => {
          filteredData[header] = data[header];
        });
        results.push(filteredData);
      })
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
}

module.exports = parseCSVToJSON;
