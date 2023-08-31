const express = require("express");
const bodyParser = require("body-parser");
const Routes = require("./routes/routes");
//const cors = require("cors");
const cronScheduler = require("./utils/cron-scheduler")

// Spouštění funkce na spouštění Python skriptu každou minutu
cronScheduler.runCHMUpy("*/15 * * * *");
cronScheduler.runHistorypy("*/20 * * * *");
cronScheduler.runSCpy("*/35 * * * *");

const app = express();

//app.use(cors);

//app.use(cors({
        //origin: ['https://dustee-frontned.vercel.app', 'http://localhost:5173', 'http://localhost:80'],
        //credentials: true,
//}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("media", express.static("public"));

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.post("/nearest-sensor", Routes.getNearestSensor);

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
//app.post("/getNeighborhoodSensor", Routes.findSensor);

// endpoint for getting svg icon level absed on provided region data
app.post("/getIconLevel", Routes.getIconLevel);

// endpoint for getting sensor's history
app.post("/getLocationHistory", Routes.getHistory);

const port = process.env.PORT || 80;
app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});