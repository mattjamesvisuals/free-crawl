const puppeteer = require('puppeteer');
const csv = require('csv-parse');
const fs = require('fs');
const util = require('./util');

// This function parses the CSV and returns the parsed data
function parseCSV(file) {
  return new Promise(function(resolve, reject) {
    var parser = csv({
        delimiter: ','
      },
      function(err, data) {
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




(async () => {

  const sites = await parseCSV("./urls.csv");
  const updatedSites = sites.map((site) => {
      return `https://www.${site}`
  }
  )
  //console.log(updatedSites);
  util.scanPubFig(updatedSites);

})();
