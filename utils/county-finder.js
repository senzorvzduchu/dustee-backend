const fs = require('fs');
const parse = require('csv-parse');

module.exports = {
        getData(input) {
                // Vyextrahujeme název okresu
                let county = input.state.trim();
                //console.log(county);

                // Předpokládáme, že název souboru odpovídá názvu okresu
                let filename = county.replace(' ', '_') + '.csv';

                if (filename = ' okres Kolín') {
                        let data = fs.readFileSync(okres_Kolin.csv, 'utf8');
                }

                // Otevřeme soubor
                //let data = fs.readFileSync(filename, 'utf8');

                // Převedeme .csv data na JSON
                let records = parse(data, {
                        columns: true,
                        skip_empty_lines: true
                });

                // Převedeme hodnoty na čísla a vrátíme první záznam (předpokládáme, že chceme jen jeden záznam)
                let output = {};
                let record = records[0];
                for (let key in record) {
                        output[key.toLowerCase()] = parseFloat(record[key]);
                }
                return output;
        }
}
