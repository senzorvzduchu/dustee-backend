const geoip = require('geoip-lite');
const csv = require('csv-parser');
const fs = require('fs');
//const path = require('path');
const SensorService = require('../data-scrapers/sensor-community');
const JsonParser = require('../data-scrapers/json-parser')
const SensorState = require('../utils/sensor-state')
const User = require('../db/user')

module.exports = {
        // endpoint for getting the nearest sensor
        async getNearestSensor(req, res) {
                const ip = req.ip;
                console.log(ip);
      
                if (!ip) {
                        return res.status(400).json({ error: 'Missing IP address' });
                }
        
                const geo = geoip.lookup(ip);
        
                if (!geo) {
                        return res.status(400).json({ error: 'Unable to locate IP address' });
                }
        
                const data = await SensorService.getSensorData(geo.ll[0], geo.ll[1], 1);
                if (data) {
                        res.json(data);
                } else {
                        res.status(500).json({ error: 'Failed to fetch sensor data' });
                }
        },
        
        // endpoint for getting sensor state for temperature
        async getSensorStateTemp(req, res, next) {
                const ip = req.ip;
                console.log(ip);

                if (!ip) {
                        return res.status(400).json({ error: 'Missing IP address' });
                }
        
                const geo = geoip.lookup(ip);
        
                if (!geo) {
                        return res.status(400).json({ error: 'Unable to locate IP address' });
                }
        
                const data = await SensorService.getSensorData(geo.ll[0], geo.ll[1], 1);
                //console.log(data);
                const parserData = JsonParser.getSensorValue(data, 'temperature');
                if (parserData) {
                        console.log(parserData)
                        const state = SensorState.getTemperatureStat(parserData)
                        res.sendFile(state, (err) => {
                                if (err) {
                                        next(err);
                                } else {
                                        console.log('File Sent:', state);
                                }
                        });
                } else {
                        res.status(500).json({ error: 'Failed to fetch parserSensor data' });
                }
        },

        //endpoint for getting sensor state for pressure
        async getSensorStatePressure(req, res, next) {
                const ip = req.ip;
                console.log(ip);

                if (!ip) {
                        return res.status(400).json({ error: 'Missing IP address' });
                }
        
                const geo = geoip.lookup(ip);
        
                if (!geo) {
                        return res.status(400).json({ error: 'Unable to locate IP address' });
                }
        
                const data = await SensorService.getSensorData(geo.ll[0], geo.ll[1], 1);
                const parserData = JsonParser.getSensorValue(data, 'pressure');
                if (parserData) {
                        console.log(parserData)
                        const state = SensorState.getPressureStat(parserData);
                        res.sendFile(state, (err) => {
                                if (err) {
                                        next(err);
                                } else {
                                        console.log('File Sent:', state);
                                }
                        });
                } else {
                        res.status(500).json({ error: 'Failed to fetch parserSensor data' });
                }
        },

        //endpoint for getting sensor state for humidity
        async getSensorStateHumidity(req, res, next) {
                const ip = req.ip;
                console.log(ip);

                if (!ip) {
                        return res.status(400).json({ error: 'Missing IP address' });
                }
        
                const geo = geoip.lookup(ip);
        
                if (!geo) {
                        return res.status(400).json({ error: 'Unable to locate IP address' });
                }
        
                const data = await SensorService.getSensorData(geo.ll[0], geo.ll[1], 1);
                const parserData = JsonParser.getSensorValue(data, 'humidity');
                if (parserData) {
                        console.log(parserData)
                        const state = SensorState.getHumidityStat(parserData);
                        res.sendFile(state, (err) => {
                                if (err) {
                                        next(err);
                                } else {
                                        console.log('File Sent:', state);
                                }
                        });
                } else {
                        res.status(500).json({ error: 'Failed to fetch parserSensor data' });
                }
        },

        //endpoint for getting sensor state for pm2.5
        async getSensorStatePm2(req, res, next) {
                const ip = req.ip;
                console.log(ip);

                if (!ip) {
                        return res.status(400).json({ error: 'Missing IP address' });
                }
        
                const geo = geoip.lookup(ip);
        
                if (!geo) {
                        return res.status(400).json({ error: 'Unable to locate IP address' });
                }
        
                const data = await SensorService.getSensorData(geo.ll[0], geo.ll[1], 1);
                const parserData = JsonParser.getSensorValue(data, 'pm25');
                if (parserData) {
                        console.log(parserData)
                        const state = SensorState.getPm2Stat(parserData);
                        res.sendFile(state, (err) => {
                                if (err) {
                                        next(err);
                                } else {
                                        console.log('File Sent:', state);
                                }
                        });
                } else {
                        res.status(500).json({ error: 'Failed to fetch parserSensor data' });
                }
        },

        //endpoint for getting sensor state for pm10
        async getSensorStatePm10(req, res, next) {
                const ip = req.ip;
                console.log(ip);

                if (!ip) {
                        return res.status(400).json({ error: 'Missing IP address' });
                }
        
                const geo = geoip.lookup(ip);
        
                if (!geo) {
                        return res.status(400).json({ error: 'Unable to locate IP address' });
                }
        
                const data = await SensorService.getSensorData(geo.ll[0], geo.ll[1], 1);
                const parserData = JsonParser.getSensorValue(data, 'pm10');
                if (parserData) {
                        console.log(parserData)
                        const state = SensorState.getPm10Stat(parserData);
                        res.sendFile(state, (err) => {
                                if (err) {
                                        next(err);
                                } else {
                                        console.log('File Sent:', state);
                                }
                        });
                } else {
                        res.status(500).json({ error: 'Failed to fetch parserSensor data' });
                }
        },
    
        //endpoint for getting cordinates of all sensor's
        async getAllLocations(req, res) {
                let allSensors = {};
                fs.createReadStream('../cron-scraper/all-sensors.py.csv')
                        .pipe(csv())
                        .on('data', (row) => {
                                allSensors[row['Sensor ID']] = {
                                        latitude: row['Latitude'],
                                        longitude: row['Longitude']
                                };
                        })
                        .on('end', () => {
                                console.log('CSV file successfully processed');
                                res.json(allSensors);
                        });
        },

        //endpoint for saving create and save new user to db
        async newUser(req, res) {
                const user = new User(this.name, this.email, this.password);
                user.save()
                        .then(() => console.log('User saved'))
                        .catch(err => console.log(err));
        },

        //endpoint for finding user's
        async findUser(req, res) {
                User.find(this.email)
                        .then(user => console.log(user))
                        .catch(err => console.error(err));
        },

        //endpoint for password update
        async passUpdate(req, res) {
                User.update(this.email, { password: this.password })
                        .then(() => console.log('User updated'))
                        .catch(err => console.error(err));
        },

        //endpoint for deleteting user's
        async deleteUser(req, res) {
                User.delete(this.email)
                        .then(() => console.log('User deleted'))
                        .catch(err => console.error(err));
        },

        //updating existing user
        async updateProperties(req, res) {
                User.updateProperties(this.email, this.address, this.sensor)
                        .then(() => console.log('User properties updated'))
                        .catch(err => console.error(err));
        },

        //adding properties for existing user
        async addProperties(req, res) {
                const user = new User(this.name, this.email, this.password);
                user.addProperties(this.address, this.sensor)
                        .then(() => console.log('User and properties saved'))
                        .catch(err => console.error(err));
        }
};
