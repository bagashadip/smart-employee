const _module = "notifikasi";
const _ = require("lodash");
const { body, query, validationResult } = require("express-validator");
const Sequelize = require("sequelize");
const error = require("../../util/errors");
const datatable = require("../../util/datatable");
const moment = require("moment");
const Op = Sequelize.Op;
const { Notifikasi } = require("../../models/model");



module.exports = {
 
  // Datatable
  data: async (req, res) => {
    // if (!(await req.user.hasAccess(_module, "view"))) {
    //   return error(res).permissionError();
    // }

    var dataTableObj = await datatable(req.body);
    var count = await Notifikasi.count();
    var notifies = await Notifikasi.findAndCountAll(dataTableObj);

    res.json({
      recordsFiltered: notifies.count,
      recordsTotal: count,
      items: notifies.rows,
    });
  },
  // Get One Row require ID
  get: async (req, res) => {
    // if (!(await req.user.hasAccess(_module, "view"))) {
    //   return error(res).permissionError();
    // }

    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return error(res).validationError(validation.array());
    }

    try {
      const mNotifikasi = await Notifikasi.findByPk(req.query.id);
      res.json(mNotifikasi);
    } catch (err) {
      res.status(400).json({ status: false, message: err.message });
    }
  },
}