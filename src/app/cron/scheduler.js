const cron = require("node-cron");
const event_handler = require("./event-handler");
const moment = require("moment");


module.exports = function buildMakeCronScheduler() {
    
    // cron.schedule("*/10 * * * *", function () {
    //     console.log("scheduler generate");
    //     event_handler.generate();
    // });

    cron.schedule("*/5 * * * * *", function () {
        console.log("masuk dalam cron start " + moment().format("YYYY-MM-DD HH:mm:ss"));
        console.log("scheduler generate");
        event_handler.generate();
        console.log("scheduler send");
        // event_handler.send();
        console.log("masuk dalam cron end " + moment().format("YYYY-MM-DD HH:mm:ss"));
    });
    
};
