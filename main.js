const Queue = require('bull');

function main() {
  const myQueue = new Queue('myQueue', 'redis://localhost:6379');
  myQueue.add({ commonName: 'job_1', timeToFinish: 100000 }, { attempts: 1 });
  myQueue.add({ commonName: 'job_2', timeToFinish: 5000 }, { attempts: 1 });
  myQueue.add({ commonName: 'job_3', timeToFinish: 6000 }, { attempts: 1 });
}

main();
