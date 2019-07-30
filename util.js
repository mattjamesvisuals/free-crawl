const puppeteer = require('puppeteer');
const lodash = require('lodash');

// This function does the scanning for mixed content errors using puppeteer
const scanPubFig = async (sites) => {
  const browser = await puppeteer.launch({
    headless: true
  })
  const page = await browser.newPage()

  // Get a handle for the client used by the page object to communicate with
  // the browser through the DevTools protocol
  const devToolsClient = page._client

  let failedRequests = new Map()
  let currentRunSite = '';
  const finalInfo = [];

  // Event fired when a request fired by the page failed
  page.on('requestfailed', request => {
    // Store a reference to that request, we'll need to get more information
    // about Mixed Content errors later
    const failedUrl = request.url();
    
      if (failedUrl.includes("pubfig.min.js")) {
        finalInfo.push(currentRunSite);
        // console.log( "this is the error" +  failedUrl);
      }

    // console.log({
    //   url: request.url(),
    //   resourceType: request.resourceType(),
    //   method: request.method()
    // });
  });
  page.on('close', request => {
    // return failedRequests;
  });
  page.on('error', error => {
    console.log(error);
  });

  // If a request failed due to a Mixed Content issue, log it
  page._client.on('Network.loadingFailed', event => {
    // if (Object.is(event.blockedReason, 'mixed-content')) {
    //   mixedContentIssues.add(event.requestId)
    // }
    // console.log(event);
  });

  for (let i = 0; i < 20; i++) {

    currentRunSite = sites[i];


     console.log(`attempting to scan pubfig errors for ${currentRunSite}`)
    try {
      const promise = page.waitForNavigation({
        waitUntil: 'networkidle2'
      });
      await page.goto(`${currentRunSite}`);
      await promise;
    }
    catch (error) {
      // console.log('error while mixed content scan', url);
      // console.log(error);
    }


  }

  console.log(finalInfo);


  browser.close();
  return sites;
}

module.exports = {
  scanPubFig


};