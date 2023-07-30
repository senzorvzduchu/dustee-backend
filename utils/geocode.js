const axios = require('axios');

module.exports = {
        // function for geocoding address to cordinates
        async geocode(address) {
                try {
                        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
                                params: {
                                q: address,
                                format: 'json',
                                },
                        });
                
                        const data = response.data;
                        console.log(data);
                
                        if (data.length > 0) {
                                let locationParts = data[0].display_name.split(",");
                                let county = locationParts[0];
                                let state = locationParts[1];
                
                                // Vrací okres a kraj
                                return {
                                        county: county,
                                        state: state
                                };
                        } else {
                                throw new Error('No results found');
                        }
                } catch (error) {
                        throw new Error(`Geocoding error: ${error}`);
                }               
        },
        
}

/*
geocode('1600 Amphitheatre Parkway, Mountain View, CA')
.then(location => console.log(location))
.catch(error => console.error(error));
*/