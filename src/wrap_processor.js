// Based on: https://github.com/alolis/www.alexanderlolis.com/blob/master/blog/riding-the-bull.md#removing-an-active-job-in-sandboxed-environments

function wrapProcessor(processor) {
  async function wrappedProcessor(job) {
    const exitHandler = (exitCode) => {
      console.log(
        `Received SIGTERM for job id '${job.id}' with exit code '${exitCode}' and PID '${process.pid}'`,
      );

      // Discard the job first to ensure that it will not be retried after a process kill.
      job.discard();

      process.exit(exitCode);
    };

    process.on('SIGTERM', exitHandler);

    try {
      // Store the process pid in order to be able to abort the process at any time
      // by simply killing it.
      await job.update({ ...job.data, pid: process.pid });

      const result = await processor(job);

      return result;
    } finally {
      // Bull internally uses a child pool of forked processors that are being re-used
      // so we need to make sure that we remove the listener before the processor returns
      // to the pool or else we will cause memory leakage.
      process.removeListener('SIGTERM', exitHandler);
    }
  }

  return wrappedProcessor;
}
module.exports = wrapProcessor;
