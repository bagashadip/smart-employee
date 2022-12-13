
const error = require("../../util/errors");
var moment = require('moment'); // require
moment.locale('id');

module.exports = {
    // Get all
    get: async (req, res) => {
        let CurrentDate = moment();
        let dateThis = CurrentDate.format('YYYY-MM-DD')
        let time = CurrentDate.format('HH:mm:ss')
        res.json({
            date: dateThis,
            time: time,
            datetime: CurrentDate.format('YYYY-MM-DD HH:mm:ss')
        });
    },

}