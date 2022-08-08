const puppeteer = require('puppeteer');
const wrapProcessor = require('./wrap_processor');

async function myProcessor(job) {
  console.log(`Started processing job ${job.id} (${job.data.commonName}) with pid ${job.data.pid}`);
  await new Promise((resolve) => {
    setTimeout(async () => {
      if (job.data.usesPuppeteer) {
        console.log(`Job ${job.id} uses puppeteer`);
        const browser = await puppeteer.launch({
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const browserPID = browser.process().pid;
        const page = await browser.newPage();
        console.log(`Puppeteer launched with PID ${browserPID}`);
        await page.goto('https://google.com');
        console.log('Puppeteer waiting for 10 seconds');
        await page.waitFor(10000);
        await browser.close();
        console.log('Puppeteer closed');
      }
      console.log(`Finished job ${job.id} with pid ${job.data.pid}`);
      resolve();
    }, job.data.timeToFinish);
  });
}

module.exports = wrapProcessor(myProcessor);
