const express = require('express');
//const geoip = require('geoip-lite');
const mongoose = require('mongoose');
const Routes = require('./routes/routes');
const routes = require('./routes/routes');

const app = express();

// connecting to database...
mongoose.connect('mongodb://dustee-backend-server:LpJ7D5RHnva7far8atBeNklqDhI2GqH869cNRJVKWONI7kzujQJkOmZ4Smi74K2S9WMNcnACfBfQACDbXtr4PA==@dustee-backend-server.mongo.cosmos.azure.com:10255/dustee-backend-database?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@dustee-backend-server@')
        .then(() => console.log('Successfully connected to MongoDB.'))
        .catch(error => console.error('Connection error', error));

app.use('media', express.static('public'));

app.get('/', (req, res) => {
        res.send('Hello, World!');
});

app.get('/nearest-sensor', Routes.getNearestSensor);

// endpoint's for getting sensor states of multiple measurements
app.get('/getSensorStateTemp', Routes.getSensorStateTemp);
app.get('/getSensorStatePressure', Routes.getSensorStatePressure);
app.get('/getSensorStateHumidity', Routes.getSensorStateHumidity);
app.get('/getSensorStatePm2', Routes.getSensorStatePm2);
app.get('/getSensorStatePm10', Routes.getSensorStatePm10);

// endpoint's for job's dealing with database
app.get('/newUser', Routes.newUser);
app.get('/findUser', Routes.findUser);
app.get('/passUpdate', Routes.passUpdate);
app.get('/deleteUser', Routes.deleteUser);
app.get('/updateProperties', Routes.updateProperties);
app.get('/addProperties', Routes.addProperties);

// endpoint for getting cordinates of all sensor's
app.get('/getAllLocations', Routes.getAllLocations);

const port = process.env.PORT || 80;
app.listen(port, () => {
        console.log(`API server listening on port ${port}`);
});
