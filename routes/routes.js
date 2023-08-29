const path = require("path");
const fs = require("fs");
const geoip = require("geoip-lite");
const jwt = require("jsonwebtoken");
//const path = require('path');
const SensorService = require("../data-scrapers/sensor-community");
const JsonParser = require("../data-scrapers/json-parser");
const SensorState = require("../utils/sensor-state");
const parseCSVToJSONforSC = require("../utils/csv-to-json"); // Import the function from csvParser.js
const User = require("../db/user");
const Geocode = require("../utils/geocode");
const County = require("../utils/county-finder");
const fetchDataForSearchQuery = require("../utils/search-location");
const parseSensorData = require("../utils/nearest-sensor-parser");
const getWeatherAndMapToSvg = require("../utils/weather-level-evaluator");
const getWeatherForecast = require("../utils/weather-forecast");

const {
  calculateOverallIconLevel,
  getQualityText,
} = require("../utils/icon-level-evaluator.js");

module.exports = {
  // endpoint for getting the nearest sensor
  async getNearestSensor(req, res) {
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;

    if (!latitude || !longitude) {
      const parsedData = await parseSensorData();
      if (parsedData) {
        res.json(parsedData);
      }
      return;
    }

    // Use Promise.race to set a timeout for the sensor data retrieval
    const timeoutPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error("Sensor data retrieval took too long"));
      }, 8000); // 5000 milliseconds = 5 seconds
    });

    try {
      const data = await Promise.race([
        SensorService.getSensorData(latitude, longitude, 1),
        timeoutPromise,
      ]);

      if (data) {
        const parsedData = await parseSensorData(data);
        if (parsedData) {
          res.json(parsedData);
        } else {
          res.status(400).json({ error: "Failed to parse sensor data" });
        }
      } else {
        res.status(500).json({ error: "Failed to fetch sensor data" });
      }
    } catch (error) {
      const parsedData = await parseSensorData();
      if (parsedData) {
        res.json(parsedData);
      }
    }
  },

  async getIconLevel(req, res) {
    const inputData = req.body;

    // Check if required data is provided
    if (
      !inputData ||
      inputData.Temperature === undefined ||
      inputData.Humidity === undefined ||
      inputData.Pressure === undefined ||
      inputData.PM2_5 === undefined ||
      inputData.PM10 === undefined
    ) {
      res
        .status(400)
        .json({ error: "Missing or incomplete data in request body" });
      return;
    }

    try {
      //-------------------------------Emojis--------------------------------------------

      const iconLevel = calculateOverallIconLevel(inputData);

      // Construct the complete icon path based on the icon level
      const iconPath = `icon-level-${iconLevel}.svg`;
      const completeIconPath = path.join(
        __dirname,
        "..",
        "media",
        "emoji-states",
        "level-colored",
        iconPath
      );

      // Read the SVG file content
      const emojiSvgContent = fs.readFileSync(completeIconPath, "utf8");

      // Get quality text based on the icon level
      const qualityText = getQualityText(iconLevel);

      const emoji = {
        title: "Current air quality state",
        airQuality: qualityText,
        emojiSvgContent: emojiSvgContent,
      };

      //----------------------------Weather--------------------------------------------------------

      // Fetch the weather SVG name
      const weatherSvgName = await getWeatherAndMapToSvg(inputData);

      // Construct the complete weather SVG path
      const weatherSvgPath = path.join(
        __dirname,
        "..",
        "media",
        "weather",
        weatherSvgName
      );
      // Read the weather SVG file content
      const weatherSvgContent = fs.readFileSync(weatherSvgPath, "utf8");

      // Fetch the weather forecast data
      const forecasts = await getWeatherForecast(inputData);

      const weather = {
        title: "Current weather",
        currentTemperature: inputData.Temperature,
        weatherSvgContent: weatherSvgContent,
      };

      //////---------------------Forecasts------------------------------------------------------

      // Extract SVG filenames from forecasts
      const forecastSvgFilenames = [
        forecasts.forecast3Hours.icon,
        forecasts.forecast6Hours.icon,
        forecasts.forecast12Hours.icon,
      ];

      // Construct the complete weather SVG paths
      const forecastWeatherSvgPaths = forecastSvgFilenames.map((filename) =>
        path.join(__dirname, "..", "media", "weather", filename)
      );

      // Read the weather SVG file contents
      const forecastWeatherSvgContents = forecastWeatherSvgPaths.map(
        (svgPath) => fs.readFileSync(svgPath, "utf8")
      );

      // Prepare forecast intervals for titles
      const forecastIntervals = ["3 hours", "6 hours", "12 hours"];

      // Map interval strings to corresponding forecast properties
      const intervalToPropertyMap = {
        "3 hours": "forecast3Hours",
        "6 hours": "forecast6Hours",
        "12 hours": "forecast12Hours",
      };

      // Combine forecast intervals with their respective SVG contents and temperatures
      const forecastWeatherSvgWithTitle = forecastIntervals.map((interval) => ({
        title: `${interval} forecast`,
        temperature: forecasts[intervalToPropertyMap[interval]]?.temperature,
        svgContent:
          forecastWeatherSvgContents[forecastIntervals.indexOf(interval)],
      }));

      //-------------------------------Response-----------------------------------------------
      res.json({
        emoji,
        weather,
        weatherForecast: forecastWeatherSvgWithTitle,
      });
    } catch (error) {
      res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
  },

  // endpoint for getting sensor state for temperature
  async getSensorStateTemp(req, res, next) {
    var ip = (req.headers["x-forwarded-for"] || "")
      .split(",")[0]
      .trim()
      .split(":")[0];
    console.log(ip);

    if (!ip) {
      return res.status(400).json({ error: "Missing IP address" });
    }

    const geo = geoip.lookup(ip);

    if (!geo) {
      return res.status(400).json({ error: "Unable to locate IP address" });
    }

    const data = await SensorService.getSensorData(geo.ll[0], geo.ll[1], 1);
    //console.log(data);
    const parserData = JsonParser.getSensorValue(data, "temperature");
    if (parserData) {
      console.log(parserData);
      const state = SensorState.getTemperatureStat(parserData);
      res.sendFile(state, (err) => {
        if (err) {
          next(err);
        } else {
          console.log("File Sent:", state);
        }
      });
    } else {
      res.status(500).json({ error: "Failed to fetch parserSensor data" });
    }
  },

  //endpoint for getting sensor state for pressure
  async getSensorStatePressure(req, res, next) {
    var ip = (req.headers["x-forwarded-for"] || "")
      .split(",")[0]
      .trim()
      .split(":")[0];
    console.log(ip);

    if (!ip) {
      return res.status(400).json({ error: "Missing IP address" });
    }

    const geo = geoip.lookup(ip);

    if (!geo) {
      return res.status(400).json({ error: "Unable to locate IP address" });
    }

    const data = await SensorService.getSensorData(geo.ll[0], geo.ll[1], 1);
    const parserData = JsonParser.getSensorValue(data, "pressure");
    if (parserData) {
      console.log(parserData);
      const state = SensorState.getPressureStat(parserData);
      res.sendFile(state, (err) => {
        if (err) {
          next(err);
        } else {
          console.log("File Sent:", state);
        }
      });
    } else {
      res.status(500).json({ error: "Failed to fetch parserSensor data" });
    }
  },

  //endpoint for getting sensor state for humidity
  async getSensorStateHumidity(req, res, next) {
    var ip = (req.headers["x-forwarded-for"] || "")
      .split(",")[0]
      .trim()
      .split(":")[0];
    console.log(ip);

    if (!ip) {
      return res.status(400).json({ error: "Missing IP address" });
    }

    const geo = geoip.lookup(ip);

    if (!geo) {
      return res.status(400).json({ error: "Unable to locate IP address" });
    }

    const data = await SensorService.getSensorData(geo.ll[0], geo.ll[1], 1);
    const parserData = JsonParser.getSensorValue(data, "humidity");
    if (parserData) {
      console.log(parserData);
      const state = SensorState.getHumidityStat(parserData);
      res.sendFile(state, (err) => {
        if (err) {
          next(err);
        } else {
          console.log("File Sent:", state);
        }
      });
    } else {
      res.status(500).json({ error: "Failed to fetch parserSensor data" });
    }
  },

  //endpoint for getting sensor state for pm2.5
  async getSensorStatePm2(req, res, next) {
    var ip = (req.headers["x-forwarded-for"] || "")
      .split(",")[0]
      .trim()
      .split(":")[0];
    console.log(ip);

    if (!ip) {
      return res.status(400).json({ error: "Missing IP address" });
    }

    const geo = geoip.lookup(ip);

    if (!geo) {
      return res.status(400).json({ error: "Unable to locate IP address" });
    }

    const data = await SensorService.getSensorData(geo.ll[0], geo.ll[1], 1);
    const parserData = JsonParser.getSensorValue(data, "pm25");
    if (parserData) {
      console.log(parserData);
      const state = SensorState.getPm2Stat(parserData);
      res.sendFile(state, (err) => {
        if (err) {
          next(err);
        } else {
          console.log("File Sent:", state);
        }
      });
    } else {
      res.status(500).json({ error: "Failed to fetch parserSensor data" });
    }
  },

  //endpoint for getting sensor state text for pm2.5
  async getSensorStatePm2Text(req, res, next) {
    var ip = (req.headers["x-forwarded-for"] || "")
      .split(",")[0]
      .trim()
      .split(":")[0];
    console.log(ip);

    if (!ip) {
      return res.status(400).json({ error: "Missing IP address" });
    }

    const geo = geoip.lookup(ip);

    if (!geo) {
      return res.status(400).json({ error: "Unable to locate IP address" });
    }

    const data = await SensorService.getSensorData(geo.ll[0], geo.ll[1], 1);
    const parserData = JsonParser.getSensorValue(data, "pm25");
    if (parserData) {
      console.log(parserData);
      const state = SensorState.getPm25Text(parserData);
      res.status(200).json(state);
    } else {
      res.status(500).json({ error: "Failed to fetch parserSensor data" });
    }
  },

  //endpoint for getting sensor state for pm10
  async getSensorStatePm10(req, res, next) {
    var ip = (req.headers["x-forwarded-for"] || "")
      .split(",")[0]
      .trim()
      .split(":")[0];
    console.log(ip);

    if (!ip) {
      return res.status(400).json({ error: "Missing IP address" });
    }

    const geo = geoip.lookup(ip);

    if (!geo) {
      return res.status(400).json({ error: "Unable to locate IP address" });
    }

    const data = await SensorService.getSensorData(geo.ll[0], geo.ll[1], 1);
    const parserData = JsonParser.getSensorValue(data, "pm10");
    if (parserData) {
      console.log(parserData);
      const state = SensorState.getPm10Stat(parserData);
      res.sendFile(state, (err) => {
        if (err) {
          next(err);
        } else {
          console.log("File Sent:", state);
        }
      });
    } else {
      res.status(500).json({ error: "Failed to fetch parserSensor data" });
    }
  },

  // Endpoint for getting coordinates of all sensors
  async getAllLocations(req, res) {
    try {
      const SCfilePath = "cron-scraper/data/sensor_community/all-sensors.csv"; // Update the path to your CSV file
      const CHMUfilePath =
        "cron-scraper/data/CHMU/Česká republika/all_stations.csv";
      // Check if a JWT token is present in the request
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        // If no token is provided, call parseCSVToJSON with fullSensors as false
        const locations = await parseCSVToJSONforSC(
          CHMUfilePath,
          SCfilePath,
          false
        );
        res
          .status(200)
          .json({ locations, status: "Only essential sensors returned" });
        return;
      }

      const tokenParts = authHeader.split(" ");
      if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
        return res.status(400).send("Invalid token format");
      }

      const token = tokenParts[1];

      jwt.verify(token, "panacek", async function (err, decoded) {
        if (err) {
          return res.status(401).send("Invalid token");
        }

        const fullSensors = true; // Set this to true since the token is valid

        const locations = await parseCSVToJSONforSC(
          CHMUfilePath,
          SCfilePath,
          fullSensors
        );

        res.status(200).json({ locations, status: "All sensors returned" });
      });
    } catch (error) {
      res.status(500).json({ error: "Error while parsing CSV file" });
    }
  },

  async searchForSensors(req, res) {
    try {
      const searchQuery = req.body.searchQuery; // Retrieve searchQuery from request body
      const finalData = await fetchDataForSearchQuery(searchQuery);

      if (finalData.length === 0) {
        res.status(404).json({ message: "No locations found" }); // Set 404 status code for no locations found
      } else {
        res.json(finalData); // Send the data if locations are found
      }
    } catch (error) {
      res.status(500).json({ error: "An error occurred" });
    }
  },

  //endpoint for saving create and save new user to db
  newUser: async (req, res) => {
    const { name, email, password, address, favSensor, group } = req.body;

    // Kontrola povinných parametrů
    if (!name || !email || !password) {
      return res.status(400).send("Name, email and password are required.");
    }

    const user = new User(
      name,
      email,
      password,
      address || "",
      favSensor || "",
      group || ""
    );

    try {
      await user.save();

      // vytvoření JWT po úspěšném uložení uživatele
      const token = jwt.sign({ email: user.email }, "panacek", {
        expiresIn: "24h",
      });

      res.status(200).json({ message: "User saved", token: token });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  findUser: async (req, res) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(403).send("No token provided");
      }

      const authParts = authHeader.split(" ");
      if (authParts.length !== 2 || authParts[0] !== "Bearer") {
        return res.status(401).send("Invalid token format");
      }

      const token = authParts[1];

      jwt.verify(token, "panacek", async function (err, decoded) {
        if (err) {
          return res.status(401).send("Invalid token");
        } else {
          try {
            const user = await User.find(decoded.email);
            console.log(user);
            res.status(200).send(user);
          } catch (err) {
            res.status(500).send(err);
          }
        }
      });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  passUpdate: async (req, res) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(403).send("No token provided");
      }

      const authParts = authHeader.split(" ");
      if (authParts.length !== 2 || authParts[0] !== "Bearer") {
        return res.status(401).send("Invalid token format");
      }

      const token = authParts[1];

      jwt.verify(token, "panacek", async function (err, decoded) {
        if (err) {
          return res.status(401).send("Invalid token");
        } else {
          try {
            await User.update(req.body.email, { password: req.body.password });
            res.status(200).send("User updated");
          } catch (err) {
            res.status(500).send(err);
          }
        }
      });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  deleteUser: async (req, res) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(403).send("No token provided");
      }

      const authParts = authHeader.split(" ");
      if (authParts.length !== 2 || authParts[0] !== "Bearer") {
        return res.status(401).send("Invalid token format");
      }

      const token = authParts[1];

      jwt.verify(token, "panacek", async function (err, decoded) {
        if (err) {
          return res.status(401).send("Invalid token");
        } else {
          try {
            await User.delete(req.body.email);
            res.status(200).send("User deleted");
          } catch (err) {
            res.status(500).send(err);
          }
        }
      });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  updateProperties: async (req, res) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(403).send("No token provided");
      }

      const authParts = authHeader.split(" ");
      if (authParts.length !== 2 || authParts[0] !== "Bearer") {
        return res.status(401).send("Invalid token format");
      }

      const token = authParts[1];

      jwt.verify(token, "panacek", async function (err, decoded) {
        if (err) {
          return res.status(401).send("Invalid token");
        } else {
          try {
            await User.updateProperties(
              req.body.email,
              req.body.address,
              req.body.favSensor,
              req.body.group
            );
            res.status(200).send("User properties updated");
          } catch (err) {
            res.status(500).send(err);
          }
        }
      });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  /*addProperties: async (req, res) => {
                const user = new User(req.body.name, req.body.email, req.body.password);
                try {
                        await user.addProperties(req.body.address, req.body.favSensor, req.body.group);

                        //vytvoření tokenu
                        const token = jwt.sign({ userID: user.id }, 'panacek', { expiresIn: '1h' });
                        
                        res.status(200).json({ message: 'User and properties saved', token: token });
                } catch (err) {
                        res.status(500).send(err);
                }
        },*/

  // endpoint for user verification
  verifyUser: async (req, res) => {
    try {
      const user = await User.verifyUser(req.body.email, req.body.password);

      //vytvoření tokenu
      const token = jwt.sign({ email: user.email }, "panacek", {
        expiresIn: "24h",
      });

      res.status(200).json({ login: "success", token: token });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  // endpoint pro pro promazání db
  //deleteDb: asyn

  //endpoint for token verification
  verifyToken: async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(403).send("No token provided");
    }

    const authParts = authHeader.split(" ");
    if (authParts.length !== 2 || authParts[0] !== "Bearer") {
      return res.status(401).send("Invalid token format");
    }

    const token = authParts[1];

    jwt.verify(token, "panacek", function (err, decoded) {
      if (err) {
        return res
          .status(401)
          .json({ message: "Invalid token or token expired." });
      }

      // Pokud není chyba, token je platný. Ověříme, že uživatel stále existuje.
      User.find(decoded.userID)
        .then((user) => {
          if (!user) {
            return res.status(404).json({ message: "User not found." });
          }

          return res
            .status(200)
            .json({ message: "Token is valid and user exists." });
        })
        .catch((err) => {
          return res.status(500).send(err);
        });
    });
  },

  // endpoint for sensor geocoding
  findSensor: async (req, res) => {
    try {
    } catch (err) {
      res.status(500).send(err);
    }
  },
};
