const Queue = require('bull');
const kill = require('tree-kill');

const MAX_TTL = 5000;
const CONCURRENCY = 2;

// Based on:
// https://github.com/alolis/www.alexanderlolis.com/blob/master/blog/riding-the-bull.md#removing-an-active-job-in-sandboxed-environments
async function killJob(queue, jobId) {
  queue.getJob(jobId).then((job) => {
    if (job) {
      kill(job.data.pid, 'SIGTERM', (err) => {
        if (err) {
          Promise.reject(err);
        } else {
          console.log(`Killed job ${jobId}`);
          Promise.resolve(true);
        }
      });
    } else {
      Promise.resolve(false);
    }
  });
}

function checkIfJobsToKill(myQueue) {
  console.log('Checking if there are jobs to kill');
  myQueue.getActive().then(async (jobs) => {
    console.log(
      'Active jobs',
      jobs.map((job) => job.id),
    );
    const jobsToKill = jobs.filter((job) => {
      const currentTimestamp = Date.now();
      const jobStartingTime = job.processedOn;
      const timeDifference = currentTimestamp - jobStartingTime;
      return timeDifference > MAX_TTL;
    });
    console.log(
      'Jobs to kill: ',
      jobsToKill.map((job) => ({ id: job.id, duration: job.data.timeToFinish })),
    );
    await Promise.all(jobsToKill.map((job) => killJob(myQueue, job.id)));
  });
}

function createQueue() {
  const myQueue = new Queue('myQueue', 'redis://localhost:6379');
  myQueue.process(CONCURRENCY, `${__dirname}/process.js`);
  myQueue.on('active', () => checkIfJobsToKill(myQueue));
  myQueue.on('failed', (job) => console.log('Job failed', job.id, job.stacktrace));
  console.log('Created queue');
}

createQueue();

module.exports = checkIfJobsToKill;
