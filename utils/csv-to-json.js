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
          filteredData["Location"] = data[1];
          filteredData["Latitude"] = data[2];
          filteredData["Longitude"] = data[3];

          // Extract relevant values from the second file based on fullSensors
          if (fullSensors) {
            
            if(data[4] !== undefined && data[4].trim() !== '') filteredData["SO2"] = data[4];
            if(data[5] !== undefined && data[5].trim() !== '') filteredData["NO2"] = data[5];
            if(data[7] !== undefined && data[7].trim() !== '') filteredData["O3"] = data[7];
            if(data[9] !== undefined && data[9].trim() !== '') filteredData["PM2_5"] = data[9];
            if(data[8] !== undefined && data[8].trim() !== '') filteredData["PM10"] = data[8];
          } else {
            if(data[9] !== undefined && data[9].trim() !== '') filteredData["PM2_5"] = data[9];
          }

          results.push(filteredData);
        })
        .on("end", () => resolve(results))
        .on("error", (error) => reject(error));
    });
  });
}

module.exports = parseCSVToJSON;
