# Bull Kill POC

## What's this?

I made a simple POC for killing Bull jobs using [Alexander Lolis implementation](https://github.com/alolis/www.alexanderlolis.com/blob/master/blog/riding-the-bull.md#removing-an-active-job-in-sandboxed-environments). Basically, every time a job is "active" (it started its processing), I check whether there are jobs that are taking more than the maximum allowed and kill their process.

## How to run

### Without Docker

1. Run `npm install`.
2. Start the queue in one terminal: `node queue.js`.
3. Run the main process in another terminal: `node main.js`.

### With Docker
1. Run `docker-compose up`.
