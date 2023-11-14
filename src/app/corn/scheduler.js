const cron = require("node-cron");
const event_handler = require("./event-handler");


module.exports = function buildMakeCronScheduler() {

    // cron.schedule("*/10 * * * *", function () {
    //     console.log("scheduler generate");
    //     event_handler.generate();
    // });

    cron.schedule("* * * * *", function () {
        console.log("scheduler send");
        // event_handler.send();

        console.log("scheduler generate");
        event_handler.generate();
    });
};
