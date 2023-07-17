const express = require('express');
const bodyParser = require('body-parser');
const Routes = require('./routes/routes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
app.post('/newUser', Routes.newUser);
app.get('/findUser', Routes.findUser);
app.patch('/passUpdate', Routes.passUpdate);
app.delete('/deleteUser', Routes.deleteUser);
app.patch('/updateProperties', Routes.updateProperties);
app.post('/addProperties', Routes.addProperties);
app.post('/verifyUser', Routes.verifyUser);

// endpoint for getting cordinates of all sensor's
app.get('/getAllLocations', Routes.getAllLocations);

const port = process.env.PORT || 80;
app.listen(port, () => {
        console.log(`API server listening on port ${port}`);
});
