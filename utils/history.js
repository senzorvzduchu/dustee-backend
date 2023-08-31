const fs = require('fs').promises;
const path = require('path');

module.exports = {
  async getDataForLocation(location) {
    const directory = 'cron-scraper/data/history/region_data/';

    try {
      const files = await fs.readdir(directory);

      const result = [];
      const now = new Date();

      for (const file of files) {
        if (file.startsWith('data_') && file.endsWith('.json')) {
          const filePath = path.join(directory, file);
          const fileStats = await fs.stat(filePath);
          const fileAgeInMilliseconds = now - fileStats.mtime;

          if (fileAgeInMilliseconds <= 7 * 24 * 60 * 60 * 1000) {
            const fileData = await fs.readFile(filePath, 'utf-8');
            const jsonData = JSON.parse(fileData);

            const locationData = jsonData.find(entry => entry.Location === location);
            if (locationData) {
              const timeStamp = file.match(/\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}/)[0];
              locationData.timeStamp = timeStamp;
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
