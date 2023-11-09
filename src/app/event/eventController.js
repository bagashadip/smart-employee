const _module = "event";
const _ = require("lodash");
const { body, query, validationResult } = require("express-validator");
const Sequelize = require("sequelize");
const error = require("../../util/errors");
const datatable = require("../../util/datatable");
const moment = require("moment");
const Op = Sequelize.Op;
const { Event } = require("../../models/model");



module.exports = {
     // List
    list: async (req, res) => {
       
        const mEvent = await Event.findAll();
        res.json(mEvent);
      },
}