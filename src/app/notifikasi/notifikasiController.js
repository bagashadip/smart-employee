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
  mobile: async (req, res) => {

    try {

      const next = req.query.next ?? moment();
      const limit = req.query.limit ?? 10;
      const kode = req.user.kode_pegawai;

      var meta = {
        total: 0,
        cursor: {
          hasNext: false,
          next: next
        },
        limit: limit,
        sort: {
          by: "updatedAt",
          order: "DESC"
        }
      };


      const whereClause = {
        send_date_notifikasi: {
          [Op.ne]: null
        },
        data_user_notifikasi: {
          kode_pegawai: kode
        },
        updatedAt: {
          [Op.lt]: next
        }
      };

      const orderClause = [
        [meta.sort.by, meta.sort.order],
      ];

      const mNotifikasi = await Notifikasi.findAll({
        limit: limit,
        where: whereClause,
        order: orderClause,
        attributes: ["id_notifikasi", "main_title_notifikasi", "main_konten_notifikasi", "tipe_notifikasi", "data_notifikasi", "send_date_notifikasi", "is_read_notifikasi", "updatedAt"]
      });

      meta.cursor.next = mNotifikasi.length > 0 ? mNotifikasi[mNotifikasi.length - 1].updatedAt : null;
      meta.total = await Notifikasi.count({
        where: whereClause
      }) - mNotifikasi.length;

      meta.cursor.hasNext = meta.total > 0 ? true : false;

      const data = {
        data: mNotifikasi,
        meta: meta,
      };

      res.json(data);
    } catch (err) {
      res.status(400).json({ status: false, message: err.message });
    }
  },
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

    try {
      const mNotifikasi = await Notifikasi.findByPk(req.query.id);
      res.json(mNotifikasi);
    } catch (err) {
      res.status(400).json({ status: false, message: err.message });
    }
  },
  read: async (req, res) => {

    try {

      await Notifikasi.update(
        {
          is_read_notifikasi: req.body.is_read_notifikasi,
          updatedAt: moment().format("YYYY-MM-DD hh:mm:ss"),
        },
        {
          where: {
            id_notifikasi: req.query.id
          }
        }
      );

      // console.log('read notifikasi', req.query.id);


      res.send({ status: true });
    } catch (err) {
      res.status(400).json({ status: false, message: err.message });
    }
  },
  // Get One Row require ID
  alert: async (req, res) => {
    // if (!(await req.user.hasAccess(_module, "view"))) {
    //   return error(res).permissionError();
    // }

    try {
      const countNotRead = await Notifikasi.count({
        where: {
          data_user_notifikasi: {
            kode_pegawai: req.user.kode_pegawai
          },
          is_read_notifikasi: false,
        },
      });
      res.json({
        total: countNotRead
      });
    } catch (err) {
      res.status(400).json({ status: false, message: err.message });
    }
  },
  validate: (type) => {

    console.log(type);
    // let mEvent = null;
    const ruleId = query("id")
      .trim()
      .notEmpty();

    switch (type) {

      case "get":
        {
          return [ruleId];
        }
        break;
      case "delete":
        {
          return [ruleId];
        }
        break;
    }
  },
}