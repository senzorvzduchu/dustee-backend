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
                const ip = '185.209.221.186';
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
        newUser: async (req, res) => {
                const user = new User(req.body.name, req.body.email, req.body.password);
                try {
                        await user.save();
                        res.status(200).send('User saved');
                } catch (err) {
                        res.status(500).send(err);
                }
        },
        
        findUser: async (req, res) => {
                try {
                        const user = await User.find(req.body.email);
                        console.log(user);
                        res.status(200).send(user);
                } catch (err) {
                        res.status(500).send(err);
                }
        },
        
        passUpdate: async (req, res) => {
                try {
                        await User.update(req.body.email, { password: req.body.password });
                        res.status(200).send('User updated');
                } catch (err) {
                        res.status(500).send(err);
                }
        },
        
        deleteUser: async (req, res) => {
                try {
                        await User.delete(req.body.email);
                        res.status(200).send('User deleted');
                } catch (err) {
                        res.status(500).send(err);
                }
        },
        
        updateProperties: async (req, res) => {
                try {
                        await User.updateProperties(req.body.email, req.body.address, req.body.favSensor);
                        res.status(200).send('User properties updated');
                } catch (err) {
                        res.status(500).send(err);
                }
        },
        
        addProperties: async (req, res) => {
                const user = new User(req.body.name, req.body.email, req.body.password);
                try {
                        await user.addProperties(req.body.address, req.body.favSensor);
                        res.status(200).send('User and properties saved');
                } catch (err) {
                        res.status(500).send(err);
                }
        },

        // endpoint for user verification
        verifyUser: async (req, res) => {
                try {
                        const user = await User.verifyUser(req.body.email, req.body.password);
                        res.status(200).send(user);
                } catch (err) {
                        res.status(500).send(err);
                }
        },
};
