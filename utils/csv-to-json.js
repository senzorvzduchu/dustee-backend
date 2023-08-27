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
          "PM2_5",
          "PM10",
        ]
      : ["Sensor ID", "Latitude", "Longitude", "Temperature", "PM2_5"];

    fs.createReadStream(filePath)
      .pipe(
        csv({
          headers: false, // Do not skip the first line, so we can access all columns
        })
      )
      .on("data", (data) => {
        const filteredData = {};

        // Map data based on fixed column positions
        filteredData["Sensor ID"] = data[0];
        filteredData["Latitude"] = data[1];
        filteredData["Longitude"] = data[2];

        if (fullSensors) {
          filteredData["Temperature"] = data[3];
          filteredData["Pressure"] = data[4];
          filteredData["Humidity"] = data[5];
          filteredData["PM2_5"] = data[6];
          filteredData["PM10"] = data[7];
        } else {
          filteredData["Temperature"] = data[3];
          filteredData["PM2_5"] = data[6];
        }

        results.push(filteredData);
      })
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
}

module.exports = parseCSVToJSON;
