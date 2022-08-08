const Queue = require('bull');
const REDIS_URL = require('./consts');

function main() {
  const myQueue = new Queue('myQueue', REDIS_URL);
  myQueue.add({ commonName: 'job_1', timeToFinish: 1000, usesPuppeteer: true }, { attempts: 1 });
  myQueue.add({ commonName: 'job_2', timeToFinish: 7000 }, { attempts: 1 });
  myQueue.add({ commonName: 'job_3', timeToFinish: 6000 }, { attempts: 1 });
}

main();
