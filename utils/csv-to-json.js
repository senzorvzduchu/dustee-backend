const fs = require('fs');
const csv = require('csv-parser');

async function parseCSVToJSON(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv({ headers: ['Sensor ID', 'Latitude', 'Longitude'] }))
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

module.exports = parseCSVToJSON;

