const fs = require('fs');
const parse = require('csv-parse');

module.exports = {
        getData(input) {
                // Extrahujeme název vesnice a okresu
                // Extrahujeme název vesnice a okresu

                console.log(input);

                let county = input.county.trim(); // Použijeme input.county místo input.name
                let state = input.state.trim();

                // Sestavíme název souboru na základě názvu okresu
                let filename = state.replace(' ', '_') + '.csv';
                console.log(filename);

                const absolutePath = 'C:/Users/alexa/OneDrive - Smíchovská střední průmyslová škola/Desktop/GitHub/Dustee/dustee-backend/utils/';

                if (filename) {
                        try {
                                let filePath = `${absolutePath}${filename}`;
                                let data = fs.readFileSync(filePath, 'utf8');
                
                                // Převedeme .csv data na JSON
                                let records = parse.parse(data, {
                                        columns: true,
                                        skip_empty_lines: true
                                });
                
                                // Převedeme hodnoty na čísla a vrátíme první záznam
                                let output = {};
                                let record = records[0];
                                for (let key in record) {
                                        output[key.toLowerCase()] = parse.parseFloat(record[key]);
                                }
                                return output;
                        } catch (error) {
                                console.error('Chyba při čtení souboru:', error);
                                return null;
                        }
                } else {
                        console.error('Název souboru není platný.');
                        return null;
                }
        }
}