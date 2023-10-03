const cron = require('node-cron');
const { exec } = require('child_process');

module.exports = {
        //function for installing dependecies via PIP
        runPIP(schedule) {
                cron.schedule(schedule, () => {
                        exec('pip install -r ../cron-scraper/requirements.txt', (error, stdout, stderr) => {
                                if (error) {
                                    console.error(`Chyba: ${error}`);
                                    return;
                                }
                                console.log(`Výstup: ${stdout}`);
                                console.error(`Chybový výstup: ${stderr}`);
                        });
                });
        },

        //function for running CHMU.py script via CRON
        runCHMUpy(schedule) {
                cron.schedule(schedule, () => {
                        exec('python3 ../cron-scraper/chmu.py', (error, stdout, stderr) => {
                            if (error) {
                                console.error(`Chyba: ${error}`);
                                return;
                            }
                            console.log(`Výstup: ${stdout}`);
                            console.error(`Chybový výstup: ${stderr}`);
                        });
                });    
        },

        runHistorypy(schedule) {
                cron.schedule(schedule, () => {
                        exec('python3 ../cron-scraper/history.py', (error, stdout, stderr) => {
                            if (error) {
                                console.error(`Chyba: ${error}`);
                                return;
                            }
                            console.log(`Výstup: ${stdout}`);
                            console.error(`Chybový výstup: ${stderr}`);
                        });
                });    
        },

        runSCpy(schedule) {
                cron.schedule(schedule, () => {
                        exec('python3 ../cron-scraper/sensorcommunity.py', (error, stdout, stderr) => {
                            if (error) {
                                console.error(`Chyba: ${error}`);
                                return;
                            }
                            console.log(`Výstup: ${stdout}`);
                            console.error(`Chybový výstup: ${stderr}`);
                        });
                });    
        }
}