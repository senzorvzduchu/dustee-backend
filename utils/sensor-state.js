const path = require('path');

module.exports = {
        // functions for getting sensor state of different measurements
        getTemperatureStat(temperature) {
                const temp = parseFloat(temperature);

                if (temp < 0) {
                        return path.join(__dirname, '..', 'media', 'emoji-states', 'level-colored', 'icon-level-4.svg');
                } else if (temp >= 0 && temp < 10) {
                        return path.join(__dirname, '..', 'media', 'emoji-states', 'level-colored', 'icon-level-3.svg');
                } else if (temp >= 10 && temp < 20) {
                        return path.join(__dirname, '..', 'media', 'emoji-states', 'level-colored', 'icon-level-2.svg');
                } else {
                        return path.join(__dirname, '..', 'media', 'emoji-states', 'level-colored', 'icon-level-1.svg');
                }
        },
        // 
        getPressureStat(press) {
                const pressure = parseFloat(press);

                if (pressure < 0) {
                        return path.join(__dirname, '..', 'media', 'emoji-states', 'level-colored', 'icon-level-4.svg');
                } else if (pressure >= 0 && pressure < 10) {
                        return path.join(__dirname, '..', 'media', 'emoji-states', 'level-colored', 'icon-level-3.svg');
                } else if (pressure >= 10 && pressure < 20) {
                        return path.join(__dirname, '..', 'media', 'emoji-states', 'level-colored', 'icon-level-2.svg');
                } else {
                        return path.join(__dirname, '..', 'media', 'emoji-states', 'level-colored', 'icon-level-1.svg');
                }
        },
        //
        getHumidityStat(humid) {
                const humidity = parseFloat(humid);

                if (humidity < 0) {
                        return path.join(__dirname, '..', 'media', 'emoji-states', 'level-colored', 'icon-level-4.svg');
                } else if (humidity >= 0 && humidity < 10) {
                        return path.join(__dirname, '..', 'media', 'emoji-states', 'level-colored', 'icon-level-3.svg');
                } else if (humidity >= 10 && humidity < 20) {
                        return path.join(__dirname, '..', 'media', 'emoji-states', 'level-colored', 'icon-level-2.svg');
                } else {
                        return path.join(__dirname, '..', 'media', 'emoji-states', 'level-colored', 'icon-level-1.svg');
                }
        },
        //
        /*
        color-level-1: #8bca7e;
        color-level-2: #ffd772;
        color-level-3: #ffb277;
        color-level-4: #f2807c;
        color-level-5: #e68fbb; 
        color-level-6: #bc8cc5;
        */
        getPm25Text(pm25) {
                const pm2 = parseFloat(pm25);

                if (pm2 >= 0 && pm2 < 12) {
                        //good
                        return "Kvalita ovzduší je výborná.";
                } else if (pm2 >= 12.1 && pm2 < 35.4) {
                        //moderate
                        return "Kvalita ovzduší je dobrá.";
                } else if (pm2 >= 35.5 && pm2 < 55.4) {
                        //unhealty for sensitive groups
                        return "Kvalita ovzduší je nezdravá pro rizikové skupiny.";
                } else if (pm2 >= 55.5 && pm2 < 150.4) {
                        //unhealty
                        return "Kvalita ovzduší je riziková.";
                } else if (pm2 >= 150.5 && pm2 < 250.4) {
                        //very unhealty
                        return "Kvalita ovzduší je v nezdravá.";
                } else if (pm2 >= 250.5) {
                        //hazardous
                        return "Kvalita ovzduší je nebezpečná.";
                } else {
                        return "Kvalita ovzduší je nezdravá pro rizikové skupiny.";
                }
        },

        getPm2Stat(pm25) {
                const pm2 = parseFloat(pm25);

                if (pm2 >= 0 && pm2 < 12) {
                        //good
                        return path.join(__dirname, '..', 'media', 'emoji-states', 'level-colored', 'icon-level-1.svg');
                } else if (pm2 >= 12.1 && pm2 < 35.4) {
                        //moderate
                        return path.join(__dirname, '..', 'media', 'emoji-states', 'level-colored', 'icon-level-2.svg');
                } else if (pm2 >= 35.5 && pm2 < 55.4) {
                        //unhealty for sensitive groups
                        return path.join(__dirname, '..', 'media', 'emoji-states', 'level-colored', 'icon-level-š.svg');
                } else if (pm2 >= 55.5 && pm2 < 150.4) {
                        //unhealty
                        return path.join(__dirname, '..', 'media', 'emoji-states', 'level-colored', 'icon-level-4.svg');
                } else if (pm2 >= 150.5 && pm2 < 250.4) {
                        //very unhealty
                        return path.join(__dirname, '..', 'media', 'emoji-states', 'level-colored', 'icon-level-5.svg');
                } else if (pm2 >= 250.5) {
                        //hazardous
                        return path.join(__dirname, '..', 'media', 'emoji-states', 'level-colored', 'icon-level-6.svg');
                } else {
                        return path.join(__dirname, '..', 'media', 'emoji-states', 'level-colored', 'icon-level-4.svg');
                }
        },
        //
        getPm10Stat(pm100) {
                const pm10 = parseFloat(pm100);

                if (pm10 >= 0 && pm10 < 12) {
                        //good - green
                        return path.join(__dirname, '..', 'media', 'emoji-states', 'level-colored', 'icon-level-1.svg');
                } else if (pm10 >= 12.1 && pm10 < 35.4) {
                        //moderate - yellow
                        return path.join(__dirname, '..', 'media', 'emoji-states', 'level-colored', 'icon-level-2.svg');
                } else if (pm10 >= 35.5 && pm10 < 55.4) {
                        //unhealty for sensitive groups - orange
                        return path.join(__dirname, '..', 'media', 'emoji-states', 'level-colored', 'icon-level-3.svg');
                } else if (pm10 >= 55.5 && pm10 < 150.4) {
                        //unhealty - red
                        return path.join(__dirname, '..', 'media', 'emoji-states', 'level-colored', 'icon-level-4.svg');
                } else if (pm10 >= 150.5 && pm10 < 250.4) {
                        //very unhealty - violet
                        return path.join(__dirname, '..', 'media', 'emoji-states', 'level-colored', 'icon-level-5.svg');
                } else if (pm10 >= 250.5) {
                        //hazardous - pink/violet?
                        return path.join(__dirname, '..', 'media', 'emoji-states', 'level-colored', 'icon-level-6.svg');
                } else {
                return path.join(__dirname, '..', 'media', 'emoji-states', 'level-colored', 'icon-level-4.svg');
                }
        }

        // Příklad použití funkce pro získání kategorie teploty
        //const json = '{"timestamp":"2023-07-07 19:17:48","sensor":{"pin":"11","sensor_type":{"manufacturer":"Bosch","name":"BME280","id":17},"id":77456},"location":{"country":"CZ","latitude":"50.13252000000","indoor":0,"longitude":"13.99531250000","exact_location":1,"altitude":"416.0","id":66539},"sensordatavalues":[{"value":"20.84","value_type":"temperature","id":36451229742},{"value":"97294.09","value_type":"pressure","id":36451229745},{"value":"36.35","value_type":"humidity","id":36451229750},{"value":102089.58,"value_type":"pressure_at_sealevel"}],"sampling_rate":null,"id":16169042323}';
        //const temperature = getSensorValue(json, 'temperature');
        //const category = getTemperatureCategory(temperature);
        //console.log('Temperature Category:', category);
}