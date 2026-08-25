const { Queue } = require("bullmq");
const connection = require("./connection");

const emailQueue = new Queue("email", { connection });

module.exports = { emailQueue };
