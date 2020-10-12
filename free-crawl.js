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
  const environment = process.env.MY_ENV
  console.log('environment variable', process.env.MY_ENV)
  const sites = await parseCSV("./erroredurls.csv");
  const updatedSites = sites.map((site) => {

    //if qa append ?fsdebug=true else nothing 
    //run qa environment MY_ENV=qa node free-crawl.js
    return `https://www.${site}` + (environment == 'qa' ? '?fsdebug=true' : '');

  });
  util.scanPubFig(updatedSites);
})();

