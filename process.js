const wrapProcessor = require('./wrap_processor');

async function myProcessor(job) {
  console.log(`Started processing job ${job.id} with pid ${job.data.pid}`);
  await new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Finished job ${job.id} with pid ${job.data.pid}`);
      resolve();
    }, job.data.timeToFinish);
  });
}

module.exports = wrapProcessor(myProcessor);
