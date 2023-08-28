const fs = require("fs");
const path = require("path");
const Fuse = require("fuse.js");

// Function to perform the search using Fuse.js
function performSearch(query, data, numResults) {
  const options = {
    keys: ["Location"], // The field to search in
    includeScore: true,
    shouldSort: true,
    threshold: 0.3, // Adjust the threshold for better matching
    minMatchCharLength: 3, // Require at least 2 characters for matching
  };
  const fuse = new Fuse(data, options);

  // Perform the search with the original query and the exact match query
  const searchResults = fuse.search(query).concat(fuse.search(`"${query}"`));

  // Deduplicate and extract the N most relevant results
  const deduplicatedResults = [];
  const seenLocations = new Set();
  for (const result of searchResults) {
    if (!seenLocations.has(result.item.Location)) {
      deduplicatedResults.push(result.item);
      seenLocations.add(result.item.Location);
      if (deduplicatedResults.length >= numResults) {
        break;
      }
    }
  }

  return deduplicatedResults;
}

// Function to read the JSON data from a file
function readJSONData(filePath) {
  try {
    const jsonData = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(jsonData);
  } catch (error) {
    console.error("Error reading JSON data:", error);
    return null;
  }
}

// Function to get the newest JSON file from a folder
function getNewestJSONFile(folderPath) {
  try {
    const fileNames = fs.readdirSync(folderPath);

    // Filter only JSON files
    const jsonFileNames = fileNames.filter(
      (fileName) => path.extname(fileName) === ".json"
    );

    // Get file creation timestamps
    const fileStats = jsonFileNames.map((fileName) => {
      const filePath = path.join(folderPath, fileName);
      return { fileName, createdAt: fs.statSync(filePath).birthtime };
    });

    // Sort files based on creation timestamps
    fileStats.sort((a, b) => b.createdAt - a.createdAt);

    if (fileStats.length > 0) {
      return path.join(folderPath, fileStats[0].fileName);
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting newest JSON file:", error);
    return null;
  }
}

function fetchDataForSearchQuery(searchQuery) {
  const jsonFolderPath = "cron-scraper/data/history/region_data"; // Update with the correct folder path
  const numResults = 15;

  const newestJSONFilePath = getNewestJSONFile(jsonFolderPath);
  if (!newestJSONFilePath) {
    console.log("No JSON files found in the folder.");
    return [];
  }

  const jsonData = readJSONData(newestJSONFilePath);
  if (!jsonData) {
    console.log("Failed to read JSON data.");
    return [];
  }

  const results = performSearch(searchQuery, jsonData, numResults);
  console.log("Top Search Results:", results);

  return results;
}

module.exports = fetchDataForSearchQuery;
