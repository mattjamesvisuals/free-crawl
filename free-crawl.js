const csv = require('csv-parse');
const fs = require('fs');
const util = require('./util');

// This function parses the CSV and returns the parsed data
function parseCSV(file) {
  return new Promise(function (resolve, reject) {
    var parser = csv({
      delimiter: ','
    },
      function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
        parser.end();
      });
    fs.createReadStream(file).pipe(parser);
  });
}
// main function thats being executed
(async () => {
  const sites = await parseCSV("./urls.csv");
  const updatedSites = sites.map((site) => {
    return `https://www.${site}`
  })
  util.scanPubFig(updatedSites);
})();
