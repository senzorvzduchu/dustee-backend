module.exports = {
        getSensorValue(json, param) {
                //const data = JSON.parse(json); included parametr is already json, its not neccesary to parse it anymore
                const data = json;

                if (param === 'temperature') {
                        if (data.sensordatavalues.some(sensor => sensor.value_type === 'temperature')) {
                                return data.sensordatavalues.find(sensor => sensor.value_type === 'temperature').value;
                        } else {
                                return 'Sensor doesn\'t have a temperature sensor';
                        }
                }

                if (param === 'pressure') {
                        if (data.sensordatavalues.some(sensor => sensor.value_type === 'pressure')) {
                                return data.sensordatavalues.find(sensor => sensor.value_type === 'pressure').value;
                        } else {
                                return 'Sensor doesn\'t have a pressure sensor';
                        }
                }
                    
                if (param === 'humidity') {
                        if (data.sensordatavalues.some(sensor => sensor.value_type === 'humidity')) {
                                return data.sensordatavalues.find(sensor => sensor.value_type === 'humidity').value;
                        } else {
                                return 'Sensor doesn\'t have a humidity sensor';
                        }
                }
                    
                if (param === 'altitude') {
                        if (data.location.altitude) {
                                return data.location.altitude;
                        } else {
                                return 'Sensor doesn\'t have an altitude value';
                        }
                }
                    
                if (param === 'place') {
                        if (data.location.latitude && data.location.longitude) {
                                return {
                                        latitude: data.location.latitude,
                                        longitude: data.location.longitude
                                };
                        } else {
                                return 'Sensor doesn\'t have location coordinates';
                        }
                }
                    
                if (param === 'country') {
                        if (data.location.country) {
                                return data.location.country;
                        } else {
                                return 'Sensor doesn\'t have a country value';
                        }
                }
                    
                if (param === 'manufacturer') {
                        if (data.sensor.sensor_type.manufacturer && data.sensor.sensor_type.name) {
                                return {
                                        manufacturer: data.sensor.sensor_type.manufacturer,
                                        name: data.sensor.sensor_type.name
                                };
                        } else {
                                return 'Sensor doesn\'t have a manufacturer and sensor type';
                        }
                }
                    
                if (param === 'pm25') {
                        if (data.sensordatavalues.some(sensor => sensor.value_type === 'P2')) {
                                return data.sensordatavalues.find(sensor => sensor.value_type === 'P2').value;
                        } else {
                                return 'Sensor doesn\'t have a PM2.5 sensor';
                        }
                }
                    
                if (param === 'pm10') {
                        if (data.sensordatavalues.some(sensor => sensor.value_type === 'P0')) {
                                return data.sensordatavalues.find(sensor => sensor.value_type === 'P0').value;
                        } else {
                                return 'Sensor doesn\'t have a PM10 sensor';
                        }
                }
                    
                return 'Invalid parameter';
        }

        // example of usage the function to get temperature
        //const json = '{"timestamp":"2023-07-07 19:17:48","sensor":{"pin":"11","sensor_type":{"manufacturer":"Bosch","name":"BME280","id":17},"id":77456},"location":{"country":"CZ","latitude":"50.13252000000","indoor":0,"longitude":"13.99531250000","exact_location":1,"altitude":"416.0","id":66539},"sensordatavalues":[{"value":"20.84","value_type":"temperature","id":36451229742},{"value":"97294.09","value_type":"pressure","id":36451229745},{"value":"36.35","value_type":"humidity","id":36451229750},{"value":102089.58,"value_type":"pressure_at_sealevel"}],"sampling_rate":null,"id":16169042323}';
        //const temperature = getSensorValue(json, 'temperature');
        //console.log('Temperature:', temperature);
}