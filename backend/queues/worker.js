const { Worker } = require("bullmq");
const connection = require("./connection");

const worker = new Worker(
  "email",
  async (job) => {
    console.log(`Processing ${job.name} job ${job.id}`);
    // Add email provider calls here when email jobs are introduced.
    return { processed: true };
  },
  { connection, concurrency: Number(process.env.WORKER_CONCURRENCY || 5) },
);

worker.on("completed", (job) => console.log(`Completed job ${job.id}`));
worker.on("failed", (job, error) =>
  console.error(`Failed job ${job && job.id}:`, error),
);
worker.on("error", (error) => console.error("BullMQ worker error:", error));

const shutdown = async () => {
  await worker.close();
  process.exit(0);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
