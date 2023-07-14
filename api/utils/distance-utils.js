module.exports = {
        // Haversine formule pro výpočet vzdálenosti mezi dvěma body na zemském povrchu (bez chata bych tohle nedalxd)
        getDistance(lat1, lon1, lat2, lon2) {
                const R = 6371; // Poloměr Země v km
                const dLat = this.deg2rad(lat2-lat1);
                const dLon = this.deg2rad(lon2-lon1); 
                const a = 
                        Math.sin(dLat/2) * Math.sin(dLat/2) +
                        Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
                        Math.sin(dLon/2) * Math.sin(dLon/2)
                ; 
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
                return R * c; // Vzdálenost v km
        },
          
        deg2rad(deg) {
                return deg * (Math.PI/180)
        }
};