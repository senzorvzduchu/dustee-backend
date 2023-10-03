const jsonToAQI = async (json) => {
        for (const record of json) {
            if (record["PM2_5"]) {
                try {
                    const pm2_5 = parseFloat(record["PM2_5"]);
                    if (!isNaN(pm2_5)) {
                        record["AQI"] = Math.round(pm2_5 * 4);
                    }
                } catch (error) {
                    console.error("Chyba při zpracování PM2_5:", error);
                }
            }
        }
    };
    
module.exports = {
        jsonToAQI
};
    