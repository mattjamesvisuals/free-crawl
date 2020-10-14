const puppeteer = require('puppeteer');


const scanPubFig = async (sites) => {

  let currentRunSite = '';
  const noTcfCmp = [];
  const hasTcfApi = [];
  const hasCmp = [];
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
        const tcfExists = typeof __tcfapi === 'function';
        const cmpExists = typeof __cmp === 'function';
        return {
          tcfExists,
          cmpExists
        }

      });
      console.log(result);
      if (result.tcfExists) {
        hasTcfApi.push(currentRunSite);
      }
      else if (result.cmpExists) {
        hasCmp.push(currentRunSite);
      }
      else if (!result.tcfExists && !result.cmpExists) {
        noTcfCmp.push(currentRunSite)
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
      await browser.close();
    }

  }

  console.log('scan complete!')
  console.log('*** HAS TCFAPI ***');
  console.log(hasTcfApi.join('\n'));
  console.log('\n\n\n*** HAS CMP ***');
  console.log(hasCmp.join('\n'));
  console.log('\n\n\n*** NEITHER ***');
  console.log(noTcfCmp.join('\n'));
  console.log('\n\n\n*** ERRORED ***');
  console.log(errorList.join('\n'));
  process.exit(1);
  return sites;
}


module.exports = {
  scanPubFig
};