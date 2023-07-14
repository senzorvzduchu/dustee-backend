module.exports = {
        // functions for getting sensor state of different measurements
        getTemperatureStat(temperature) {
                const temp = parseFloat(temperature);

                if (temp < 0) {
                        return 'very cold';
                } else if (temp >= 0 && temp < 10) {
                        return 'cold';
                } else if (temp >= 10 && temp < 20) {
                        return 'warm';
                } else {
                        return 'very warm';
                }
        },
        // 
        getPressureStat(pressure) {
                const temp = parseFloat(pressure);

                if (temp < 0) {
                        return 'low pressure';
                } else if (temp >= 0 && temp < 10) {
                        return 'little biger pressure';
                } else if (temp >= 10 && temp < 20) {
                        return 'bigger pressure';
                } else {
                        return 'real pressure';
                }
        },
        //
        getHumidityStat(humidity) {
                const temp = parseFloat(humidity);

                if (temp < 0) {
                        return 'low';
                } else if (temp >= 0 && temp < 10) {
                        return 'bigger';
                } else if (temp >= 10 && temp < 20) {
                        return 'much bigger';
                } else {
                        return 'much much bigger';
                }
        },
        //
        getPm2Stat(pm2) {
                const temp = parseFloat(pm2);

                if (temp < 0) {
                        return 'low';
                } else if (temp >= 0 && temp < 10) {
                        return 'litte bit bigger';
                } else if (temp >= 10 && temp < 20) {
                        return 'bigger';
                } else {
                        return 'big';
                }
        },
        //
        getPm10Stat(pm10) {
                const temp = parseFloat(pm10);

                if (temp < 0) {
                        return 'low';
                } else if (temp >= 0 && temp < 10) {
                        return 'bigger';
                } else if (temp >= 10 && temp < 20) {
                        return 'much bigger';
                } else {
                        return 'much much bigger';
                }
        }

        // Příklad použití funkce pro získání kategorie teploty
        //const json = '{"timestamp":"2023-07-07 19:17:48","sensor":{"pin":"11","sensor_type":{"manufacturer":"Bosch","name":"BME280","id":17},"id":77456},"location":{"country":"CZ","latitude":"50.13252000000","indoor":0,"longitude":"13.99531250000","exact_location":1,"altitude":"416.0","id":66539},"sensordatavalues":[{"value":"20.84","value_type":"temperature","id":36451229742},{"value":"97294.09","value_type":"pressure","id":36451229745},{"value":"36.35","value_type":"humidity","id":36451229750},{"value":102089.58,"value_type":"pressure_at_sealevel"}],"sampling_rate":null,"id":16169042323}';
        //const temperature = getSensorValue(json, 'temperature');
        //const category = getTemperatureCategory(temperature);
        //console.log('Temperature Category:', category);
}