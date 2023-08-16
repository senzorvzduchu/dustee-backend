const fs = require("fs");
const path = require("path");
const Fuse = require("fuse.js");
const axios = require("axios"); // Import Axios for making API requests

// Function to calculate the average of an array of numbers
function calculateAverage(numbers) {
  if (numbers.length === 0) {
    return null;
  }
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum / numbers.length;
}

function searchFiles(
  query,
  folderPaths,
  fileExtension,
  numResults,
  excludedStrings
) {
  let allFileNames = [];

  // Iterate over each folder path
  for (const folderPath of folderPaths) {
    // Read the list of files in the folder
    const fileNames = fs.readdirSync(folderPath);

    // Filter file names based on the provided file extension
    const filteredFileNames = fileNames.filter(
      (fileName) =>
        path.extname(fileName).toLowerCase() === fileExtension.toLowerCase() &&
        !excludedStrings.some((excludedStr) =>
          fileName.toLowerCase().includes(excludedStr.toLowerCase())
        )
    );

    allFileNames = allFileNames.concat(filteredFileNames);
  }

  // Create a Fuse instance with custom options
  const options = {
    keys: ["fileName"], // The field to search in
    shouldSort: true,
    includeScore: true,
    threshold: 0.4, // Adjust the threshold for matching
  };
  const fuse = new Fuse(
    allFileNames.map((fileName) => ({ fileName })),
    options
  );

  // Perform the search
  const searchResults = fuse.search(query);

  // Extract and return the N most relevant file names
  const topResults = searchResults
    .slice(0, numResults)
    .map((item) => item.item.fileName);
  return topResults;
}

const openWeatherApiKey = "ce48301aaf1d16612230648eeff30329";

// Function to fetch temperature data from OpenWeatherMap API
async function fetchTemperatureData(location) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    location
  )}&appid=${openWeatherApiKey}&units=metric`;

  try {
    const response = await axios.get(url);
    return response.data.main;
  } catch (error) {
    console.error("Error fetching temperature data:", error);
    return null;
  }
}

// Function to fetch air quality data from OpenWeatherMap API
async function fetchAirQualityData(latitude, longitude) {
  const url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${openWeatherApiKey}&units=metric`;

  try {
    const response = await axios.get(url);
    return response.data.list[0].components;
  } catch (error) {
    console.error("Error fetching air quality data:", error);
    return null;
  }
}

function extractDataFromFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const lines = fileContent.split("\n");

    const extractedData = {
      Temperature: "none",
      Pressure: "none",
      Humidity: "none",
      PM2_5: "none",
      PM10: "none",
    };

    const header = lines[0].split(",");

    if (header.includes("Sensor Code")) {
      // Extract from Sensor Code type file
      for (const line of lines) {
        const parts = line.split(",");

        if (parts.length >= 7 && parts[0] !== "Sensor Code") {
          const [, so2, , co, o3, pm10, pm2_5] = parts;
          extractedData.Temperature = "none"; // Not available in this type
          extractedData.Pressure = "none"; // Not available in this type
          extractedData.Humidity = "none"; // Not available in this type
          extractedData.PM2_5 = pm2_5.trim() || extractedData.PM2_5;
          extractedData.PM10 = pm10.trim() || extractedData.PM10;
        }
      }
    } else if (header.includes("Temperature")) {
      // Extract from Temperature type file
      for (const line of lines) {
        const parts = line.split(",");

        if (parts.length >= 5 && parts[0] !== "Temperature") {
          const [temperature, pressure, humidity, pm25, pm10] = parts;
          extractedData.Temperature =
            temperature.trim() || extractedData.Temperature;

          // Divide pressure by 100 before storing it
          extractedData.Pressure =
            (parseFloat(pressure) / 100).toString() || extractedData.Pressure;

          extractedData.Humidity = humidity.trim() || extractedData.Humidity;
          extractedData.PM2_5 = pm25.trim() || extractedData.PM2_5;
          extractedData.PM10 = pm10.trim() || extractedData.PM10;
        }
      }
    }

    return extractedData;
  } catch (error) {
    console.error("Error extracting data from file:", error);
    return null;
  }
}
async function fetchDataForSearchQuery(searchQuery) {
  const folderPaths = ["sensor_community", "CHMU/Česká republika"];
  const fileExtension = ".csv";
  const numResults = 15;
  const excludedStrings = ["all-sensors", "all_stations"];

  const location = "Czech Republic";
  const temperatureData = await fetchTemperatureData(location);
  if (!temperatureData) {
    console.log("Failed to fetch temperature data.");
    return [];
  }

  const latitude = 50.0755;
  const longitude = 14.4378;
  const airQualityData = await fetchAirQualityData(latitude, longitude);
  if (!airQualityData) {
    console.log("Failed to fetch air quality data.");
    return [];
  }

  const averageTemperature = calculateAverage([temperatureData.temp]);
  const averagePressure = calculateAverage([temperatureData.pressure]);
  const averageHumidity = calculateAverage([temperatureData.humidity]);
  const averagePM2_5 = calculateAverage([airQualityData.pm2_5]);
  const averagePM10 = calculateAverage([airQualityData.pm10]);

  const results = searchFiles(
    searchQuery,
    folderPaths,
    fileExtension,
    numResults,
    excludedStrings
  );
  console.log("Top Search Results:", results);

  const finalData = [];

  for (const result of results) {
    for (const folderPath of folderPaths) {
      const filePath = path.join(folderPath, result);
      if (fs.existsSync(filePath)) {
        console.log(`Found file: ${result}`);
        const locationAddress = result.replace(".csv", "");
        const extractedData = extractDataFromFile(filePath);

        const openWeatherData = await fetchTemperatureData(locationAddress);

        if (openWeatherData) {
          // Only update if extracted data is not available
          if (extractedData.Temperature === "none") {
            extractedData.Temperature = openWeatherData.temp;
          }
          if (extractedData.Pressure === "none") {
            extractedData.Pressure = openWeatherData.pressure;
          }
          if (extractedData.Humidity === "none") {
            extractedData.Humidity = openWeatherData.humidity;
          }
        }

        function updateValue(value, averageValue) {
          return value === "none" || isNaN(parseFloat(value))
            ? averageValue
            : parseFloat(value);
        }

        extractedData.Temperature = updateValue(
          extractedData.Temperature,
          averageTemperature
        );
        extractedData.Pressure = updateValue(
          extractedData.Pressure,
          averagePressure
        );
        extractedData.Humidity = updateValue(
          extractedData.Humidity,
          averageHumidity
        );
        extractedData.PM2_5 = updateValue(extractedData.PM2_5, averagePM2_5);
        extractedData.PM10 = updateValue(extractedData.PM10, averagePM10);

        const finalExtractedData = {
          Location: locationAddress,
          Temperature: extractedData.Temperature,
          Pressure: extractedData.Pressure,
          Humidity: extractedData.Humidity,
          PM2_5: extractedData.PM2_5,
          PM10: extractedData.PM10,
        };

        console.log(`Final extracted data for ${result}:`, finalExtractedData);

        finalData.push(finalExtractedData);
      }
    }
  }

  return finalData;
}

module.exports = fetchDataForSearchQuery;
