const cron = require("node-cron");
const event_handler = require("./event-handler");


module.exports = function buildMakeCronScheduler() {
    console.log("masuk dalam  cron 2");
    cron.schedule("*/10 * * * * *", function () {
        event_handler.generate();
      });
};
