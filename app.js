const express = require('express');
const geoip = require('geoip-lite');
const Routes = require('./routes/routes');

const app = express();

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

// endpoint for getting cordinates of all sensor's
app.get('/getAllLocations', Routes.getAllLocations);

const port = process.env.PORT || 80;
app.listen(port, () => {
        console.log(`API server listening on port ${port}`);
});
