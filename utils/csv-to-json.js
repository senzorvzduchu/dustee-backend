import { createReadStream } from 'fs';
import csv from 'csv-parser';

async function parseCSVToJSON(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    createReadStream(filePath)
      .pipe(csv({ headers: ['Sensor ID', 'Latitude', 'Longitude'] }))
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

export default parseCSVToJSON;

