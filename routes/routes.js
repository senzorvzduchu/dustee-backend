const geoip = require('geoip-lite');
const jwt = require('jsonwebtoken');
//const path = require('path');
const SensorService = require('../data-scrapers/sensor-community');
const JsonParser = require('../data-scrapers/json-parser')
const SensorState = require('../utils/sensor-state')
const parseCSVToJSON = require('../utils/csv-to-json'); // Import the function from csvParser.js
const User = require('../db/user')

module.exports = {
        // endpoint for getting the nearest sensor
        async getNearestSensor(req, res) {
                var ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim().split(':')[0];
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
                var ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim().split(':')[0];
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
                var ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim().split(':')[0];
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
                var ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim().split(':')[0];
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
                var ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim().split(':')[0];
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
                var ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim().split(':')[0];
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
                try {
                        const filePath = 'cron-scraper/all-sensors.csv'; // Update the path to your CSV file
                        const locations = await parseCSVToJSON(filePath);
                        res.json({ locations });
                } catch (error) {
                        res.status(500).json({ error: 'Error while parsing CSV file' });
                }
        },

        //endpoint for saving create and save new user to db
        newUser: async (req, res) => {
                const user = new User(req.body.name, req.body.email, req.body.password);
                try {
                        await user.save();

                        // vytvoření JWT po úspěšném uložení uživatele
                        const token = jwt.sign({ userID: user.id }, 'secretKey', { expiresIn: '1h' });
                        
                        res.status(200).json({ message: "User saved", token: token });
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
                        const token = req.headers.authorization;
                        if(!token) {
                                return res.status(403).send('No token provided');
                        }

                        jwt.verify(token, 'secretKey', async function(err, decoded) {
                                if (err) {
                                        return res.status(401).send('Invalid token');
                                } else {
                                        try {
                                                await User.update(req.body.email, { password: req.body.password });
                                                res.status(200).send('User updated');
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
                        const token = req.headers.authorization;
                        if(!token) {
                                return res.status(403).send('No token provided');
                        }

                        jwt.verify(token, 'secretKey', async function(err, decoded) {
                                if (err) {
                                        return res.status(401).send('Invalid token');
                                } else {
                                        try {
                                                await User.delete(req.body.email);
                                                res.status(200).send('User deleted');
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
                        const token = req.headers.authorization;
                        if(!token) {
                                return res.status(403).send('No token provided');
                        }

                        jwt.verify(token, 'secretKey', async function(err, decoded) {
                                if (err) {
                                        return res.status(401).send('Invalid token');
                                } else {
                                        try {
                                                await User.updateProperties(req.body.email, req.body.address, req.body.favSensor, req.body.group);
                                                res.status(200).send('User properties updated');
                                        } catch (err) {
                                                res.status(500).send(err);
                                        }
                                }
                        });
                } catch (err) {
                        res.status(500).send(err);
                }
        },
        
        addProperties: async (req, res) => {
                const user = new User(req.body.name, req.body.email, req.body.password);
                try {
                        await user.addProperties(req.body.address, req.body.favSensor);

                        //vytvoření tokenu
                        const token = jwt.sign({ userID: user.id }, 'secretKey', { expiresIn: '1h' });
                        
                        res.status(200).json({ message: 'User and properties saved', token: token });
                } catch (err) {
                        res.status(500).send(err);
                }
        },

        // endpoint for user verification
        verifyUser: async (req, res) => {
                try {
                        const user = await User.verifyUser(req.body.email, req.body.password);

                        //vytvoření tokenu
                        const token = jwt.sign({ userID: user.id }, 'secretKey', { expiresIn: '1h' });


                        res.status(200).json({ login: "success", token: token });
                } catch (err) {
                        res.status(500).send(err);
                }
        },
};
