const puppeteer = require('puppeteer');

// This function does the scanning for errors using puppeteer
const scanPubFig = async (sites) => {
  const browser = await puppeteer.launch({
    headless: true
  })
  const page = await browser.newPage()

  // Get a handle for the client used by the page object to communicate with
  // the browser through the DevTools protocol
  const devToolsClient = page._client

  let currentRunSite = '';
  const finalInfo = [];
  const errorList = [];

  page.setMaxListeners(20);


  // Event fired when a request fired by the page failed
  page.on('requestfailed', request => {
    // Store a reference to that request
    const failedUrl = request.url();

    if (failedUrl.includes("pubfig.min.js")) {
      finalInfo.push(currentRunSite);
    }
  });

  page.on('error', error => {
    console.log("encountered an error while scanning" + currentRunSite);
    console.log(error.message);
    errorList.push(`${currentRunSite}: ${error.message}`);
  });
  
  for (let i = 0; i < sites.length; i++) {
    currentRunSite = sites[i];

    console.log(`attempting to scan pubfig errors for ${currentRunSite}`)
    try {
      const promise = page.waitForNavigation({
        waitUntil: 'networkidle2'
      }).catch(e => new Error(e));
      await page.goto(`${currentRunSite}`);
      await promise;
    }
    catch (error) {
      console.log('Error with puppeteer while trying to fetch site', currentRunSite);
      console.log(error.message);
      errorList.push(`${currentRunSite}: ${error.message}`);
    }
  }

  console.log("pubfig errors");
  console.log(finalInfo.join("\n"));
  console.log("Scanning Errors");
  console.log(errorList.join("\n"));

  await browser.close();
  return sites;
}

module.exports = {
  scanPubFig
};