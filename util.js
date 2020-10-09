const puppeteer = require('puppeteer');

// This function does the scanning for errors using puppeteer
const scanPubFig = async (sites) => {
  const browser = await puppeteer.launch({
    headless: true
  })
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(60000);
  page.setMaxListeners(10);
  // Get a handle for the client used by the page object to communicate with
  // the browser through the DevTools protocol
  const devToolsClient = page._client

  let currentRunSite = '';
  const noTcfApi = [];
  const hasTcfApi = [];
  const errorList = [];
  

  


  // Event fired when a request fired by the page failed
  // page.on('requestfailed', request => {
  //   // Store a reference to that request
  //   const failedUrl = request.url();

  //   if (failedUrl.includes("pubfig.min.js")) {
  //     finalInfo.push(currentRunSite);
  //   }
  // });

  // page.on('error', error => {
  //   //console.log("encountered an error while scanning" + currentRunSite);
  //   //console.log(error.message);
  //   errorList.push(`${currentRunSite}: ${error.message}`);
  // });
  
  for (let i = 171; i < 190; i++) {
    currentRunSite = sites[i];

   // console.log(`attempting to scan pubfig errors for ${currentRunSite}`)
    try {
      const promise = page.waitForNavigation({
        waitUntil: 'networkidle2'
      }).catch(e => new Error(e));
      await page.goto(`${currentRunSite}`);
      await promise;
      //console.log(currentRunSite + ' is loaded');
      result = await page.evaluate(() => {
        return typeof __tcfapi;
      });
      if (result === 'undefined') {
        noTcfApi.push('does not have TcfApi ' + currentRunSite);
        //console.log(currentRunSite + ' doesnt exist');
      }
      else if(result === 'function'){
        hasTcfApi.push('has Tcfapi ' + currentRunSite);
        //console.log(currentRunSite + ' DOES EXIST'); 
      }
      else {
        
        console.log(currentRunSite + ' site timed out')
      }
    }
    catch (error) {
      errorList.push(`${currentRunSite} :  ${error.message}`);
      console.log('Error with puppeteer while trying to fetch site ', currentRunSite);
      console.log(error.message);
      
      // errorList.push(`${currentRunSite}: ${error.message}`);
     }
  }

  
  // .then((page) => {
  //   return page.evaluate(() => {
  //     return globalVar;
  //   });
  // })
  // .then((globalVarHere) => {
  //   console.log(globalVarHere); // Should output the value
  // });

  // console.log("pubfig errors");
  // console.log(finalInfo.join("\n"));
  // console.log("Scanning Errors");
  // console.log(errorList.join("\n"));
  console.log('scan complete!')
  console.log(hasTcfApi.join('\n'));
  console.log(noTcfApi.join('\n'));
  console.log(errorList.join('\n'))
  await browser.close();
  return sites;
}

module.exports = {
  scanPubFig
};