const axios = require('axios');
const DistanceUtils = require('../utils/distance-utils');

module.exports = {
        async getSensorData(lat, lon, radius) {
                try {
                        const response = await axios.get(`https://data.sensor.community/airrohr/v1/filter/area=${lat},${lon},${radius}`);
                        if (response.data.length > 0) {
                                // Seřazení senzorů podle vzdálenosti a vrácení nejbližšího
                                return response.data.sort((a, b) => {
                                        const distA = DistanceUtils.getDistance(lat, lon, a.location.latitude, a.location.longitude);
                                        const distB = DistanceUtils.getDistance(lat, lon, b.location.latitude, b.location.longitude);
                                        return distA - distB;
                                })[0];
                        } else {
                                // Pokud nejsou žádná data, zvýším radius a posílám požadavek znovu
                                return await this.getSensorData(lat, lon, radius + 1);
                        }
                } catch (error) {
                        console.error(error);
                        return null;
                }
        }
};