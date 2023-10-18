const fs = require("fs").promises;
const path = require("path");

module.exports = {
  async getDataForLocation(location) {
    const directory = "cron-scraper/data/history/region_data/";
    
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
    try {
      const files = await fs.readdir(directory);

      const result = [];
      const now = new Date();

      for (const file of files) {
        if (file.startsWith("data_") && file.endsWith(".json")) {
          const filePath = path.join(directory, file);
          const fileStats = await fs.stat(filePath);
          const fileAgeInMilliseconds = now - fileStats.mtime;

          if (fileAgeInMilliseconds <= 7 * 24 * 60 * 60 * 1000) {
            const fileData = await fs.readFile(filePath, "utf-8");
            const jsonData = JSON.parse(fileData);

            const locationData = jsonData.find(
              (entry) => entry.Location === location
            );
            if (locationData) {
              const timeStamp = file.match(
                /\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}/
              )[0];
              locationData.timeStamp = timeStamp;

              const pm2_5 = locationData.PM2_5;
              if (!isNaN(pm2_5)) {
                locationData.AQI = Math.round(
                  mapValueToRange(pm2_5)
                );
              } else {
                locationData.AQI = null;
              }

              result.push(locationData);
            }
          }
        }
      }

      return result;
    } catch (error) {
      throw error;
    }
  },
};
