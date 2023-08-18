const express = require("express");
const bodyParser = require("body-parser");
const Routes = require("./routes/routes");
const cors = require("cors");
const winston = require('winston');


const app = express();

// Configure Winston logger
const logger = winston.createLogger({
  level: 'info', // Set the log level (options: 'error', 'warn', 'info', 'verbose', 'debug', 'silly')
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(info => `${info.timestamp} [${info.level}] ${info.message}`)
  ),
  transports: [
    new winston.transports.Console(), // Output logs to the console
    new winston.transports.File({ filename: 'app.log' }), // Output logs to a file
  ],
});

app.use(cors({
        origin: ['https://dustee-frontned.vercel.app', 'http://localhost:5173'],
        credentials: true,
}));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("media", express.static("public"));

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/nearest-sensor", Routes.getNearestSensor);

// endpoint's for getting sensor states of multiple measurements
app.get("/getSensorStateTemp", Routes.getSensorStateTemp);
app.get("/getSensorStatePressure", Routes.getSensorStatePressure);
app.get("/getSensorStateHumidity", Routes.getSensorStateHumidity);
app.get("/getSensorStatePm2", Routes.getSensorStatePm2);
app.get("/getSensorStatePm10", Routes.getSensorStatePm10);

// endpoint's for job's dealing with database
app.post("/createNewUser", Routes.newUser);
app.post("/getUserInformation", Routes.findUser);
app.patch("/resetUserPassword", Routes.passUpdate);
app.delete("/deleteUser", Routes.deleteUser);
app.patch("/updateUserProperties", Routes.updateProperties);
//app.post('/addProperties', Routes.addProperties);
app.post("/loginUser", Routes.verifyUser);
app.get("/verifyToken", Routes.verifyToken);

// endpoint for getting cordinates of all sensor's
app.get("/getAllLocations", Routes.getAllLocations);

// endpoint for getting list of sensors and their data based on search query
app.post("/searchLocation", Routes.searchForSensors);

// endpoint to search for sensors in the neighborhood
app.post("/getNeighborhoodSensor", Routes.findSensor);

const port = process.env.PORT || 80;
app.listen(port, () => {
  logger.log(`API server listening on port ${port}`);
});
