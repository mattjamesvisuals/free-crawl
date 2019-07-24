const puppeteer = require('puppeteer');
const csv = require('csv-parse');
const fs = require('fs');

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
    parseCSV("./urls.csv").then((data) => {
        const sites = data;
        return sites;
      }, (reason) => {
        // if there is an error parsing CSV
        console.error(reason);
      }).then(sites => {
          console.log(sites);
      });
  const sites = await parseCSV("./urls.csv");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://cnn.com');
  //await page.screenshot({path: './example1.png'});

  await browser.close();
})();
