const fs = require("fs");
const csv = require("csv-parser");

async function parseCSVToJSON(filePath2, filePath1, fullSensors = false) {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.readFile(filePath1, "utf8", (err, data) => {
      if (err) {
        console.error(err);
        reject(err);
        return;
      }

      const jsonData = JSON.parse(data);

      const modifiedData = jsonData.map((obj) => ({
        "Sensor ID": obj.SensorID,
        Latitude: obj.Latitude,
        Longitude: obj.Longitude,
        Temperature: obj.temperature,
        Pressure: obj.pressure,
        Humidity: obj.humidity,
        ...(fullSensors && {
          PM10: obj.P1,
          PM2_5: obj.P2,
        }),
      }));

      results.push(...modifiedData);
      console.log(
        "JSON data has been successfully read, modified, and stored."
      );
      fs.createReadStream(filePath2)
        .pipe(
          csv({
            headers: false,
          })
        )
        .on("data", (data) => {
          const filteredData = {};

          // Map data based on fixed column positions
          filteredData["Sensor ID"] = data[0];
          filteredData["Latitude"] = data[1];
          filteredData["Longitude"] = data[2];

          // Extract relevant values from the second file based on fullSensors
          if (fullSensors) {
            filteredData["Temperature"] = "";
            filteredData["Pressure"] = "";
            filteredData["Humidity"] = "";
            filteredData["SO2"] = data[3];
            filteredData["NO2"] = data[4];
            filteredData["O3"] = data[6];
            filteredData["PM2_5"] = data[8];
            filteredData["PM10"] = data[7];
          } else {
            filteredData["Temperature"] = "";
            filteredData["PM2_5"] = data[8];
          }

          results.push(filteredData);
        })
        .on("end", () => resolve(results))
        .on("error", (error) => reject(error));
    });
  });
}

module.exports = parseCSVToJSON;
