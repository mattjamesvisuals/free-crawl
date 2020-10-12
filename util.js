const puppeteer = require('puppeteer');


const scanPubFig = async (sites) => {

  let currentRunSite = '';
  const noTcfApi = [];
  const hasTcfApi = [];
  const errorList = [];

  for (let i = 0; i < sites.length; i++) {
    const browser = await puppeteer.launch({
      headless: true
    })
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(60000);
    page.setMaxListeners(10);
    // Get a handle for the client used by the page object to communicate with
    // the browser through the DevTools protocol
    const devToolsClient = page._client
    currentRunSite = sites[i];

    console.log(`attempting to scan pubfig errors for ${currentRunSite}`)
    try {
      const promise = page.waitForNavigation({
        waitUntil: 'networkidle2'
      }).catch(e => new Error(e));
      await page.goto(`${currentRunSite}`);
      await promise;
      result = await page.evaluate(() => {
        return typeof __tcfapi;
      });
      if (result === 'undefined') {
        noTcfApi.push('does not have TcfApi ' + currentRunSite);
      }
      else if (result === 'function') {
        hasTcfApi.push('has Tcfapi ' + currentRunSite);
      }
      else {
        console.log(currentRunSite + ' site timed out')
      }
      await browser.close();
    }
    catch (error) {
      errorList.push(`${currentRunSite} :  ${error.message}`);
      console.log('Error with puppeteer while trying to fetch site ', currentRunSite);
      console.log(error.message);
    }

  }

  console.log('scan complete!')
  console.log(hasTcfApi.join('\n'));
  console.log(noTcfApi.join('\n'));
  console.log(errorList.join('\n'))

  return sites;
}

module.exports = {
  scanPubFig
};