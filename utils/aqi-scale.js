const jsonToAQI = (json) => {
    for (const record of json) {
        if (record["PM2_5"]) {
            try {
                // Přidává AQI jako textový řetězec
                const pm2_5 = parseFloat(record["PM2_5"]);
                if (!isNaN(pm2_5)) {
                    record["AQI"] = (Math.round(pm2_5 * 4)).toString();
                }
            } catch (error) {
                console.error("Chyba při zpracování PM2_5:", error);
            }
        }
    }
    console.log(json);
    return json; // Vrací upravený JSON objekt včetně AQI jako text
};

module.exports = {
    jsonToAQI
};
