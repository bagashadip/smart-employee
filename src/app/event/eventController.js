const _module = "event";
const _ = require("lodash");
const { body, query, validationResult } = require("express-validator");
const Sequelize = require("sequelize");
const error = require("../../util/errors");
const datatable = require("../../util/datatable");
const moment = require("moment");
const Op = Sequelize.Op;
const { Event, Pegawai } = require("../../models/model");



module.exports = {
  // calendar
  calendar: async (req, res) => {
    try {
      const start_date = moment(req.query.start_date, "YYYY-MM-DD");
      const end_date = moment(req.query.end_date, "YYYY-MM-DD");
      const kode_pegawai = req.user.kode_pegawai;



      const mPegawai = await Pegawai.findOne({
        where: {
          kode_pegawai: kode_pegawai,
        },
      });

      const mEvent = await Event.findAll({
        where: {
          status_event: "PUBLIC",
          tanggal_event: {
            [Op.gte]: start_date,
            [Op.lte]: end_date,
          },
        },
      });


      var result = [];      
      mEvent.map((item) => {
        if (item.kategori_event == "ALL" || item.recipient_event.includes(kode_pegawai) || item.recipient_event.includes(mPegawai.divisi_pegawai)) {
          result.push({
            id_event: item.id_event,
            nama_event: item.judul_event,
            tanggal_event: item.tanggal_event,
            jammulai_event: item.jammulai_event,
            jamselesai_event: item.jamselesai_event,
            kategori_event: item.kategori_event,
          });
        }
      });

      res.json(result);

    } catch (err) {
      res.status(400).json({ status: false, message: err.message });
    }
  },
  // List
  list: async (req, res) => {
    // if (!(await req.user.hasAccess(_module, "view"))) {
    //   return error(res).permissionError();
    // }
    try {
      const mEvent = await Event.findAll({
        where: {
          status_event: {
            [Op.ne]: "DELETED",
          },
        },
      });
      res.json(mEvent);
    } catch (err) {
      res.status(400).json({ status: false, message: err.message });
    }
  },
  //
  kategori: async (req, res) => {
    const kategori = ['ALL', 'DIVISI', 'INDIVIDU'];
    res.json(kategori);
  },
  // Datatable
  data: async (req, res) => {
    // if (!(await req.user.hasAccess(_module, "view"))) {
    //   return error(res).permissionError();
    // }

    var dataTableObj = await datatable(req.body);
    var count = await Event.count();
    var events = await Event.findAndCountAll(dataTableObj);

    res.json({
      recordsFiltered: events.count,
      recordsTotal: count,
      items: events.rows,
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
      const mEvent = await Event.findByPk(req.query.id);
      res.json(mEvent);
    } catch (err) {
      res.status(400).json({ status: false, message: err.message });
    }
  },
  // Create
  create: async (req, res) => {
    // if (!(await req.user.hasAccess(_module, "create"))) {
    //   return error(res).permissionError();
    // }

    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return error(res).validationError(validation.array());
    }

    try {
      const event = await new Event({
        ...req.body,
      }).save();

      res.json({ status: true, id: event.id });
    } catch (err) {
      res.status(400).json({ status: false, message: err.message });
    }
  },
  // Update
  update: async (req, res) => {
    // if (!(await req.user.hasAccess(_module, "update"))) {
    //   return error(res).permissionError();
    // }

    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return error(res).validationError(validation.array());
    }
    try {

      await Event.update(
        { ...req.body },
        { where: { id_event: req.query.id } }
      );

      res.send({ status: true });
    } catch (err) {
      res.status(400).json({ status: false, message: err.message });
    }
  },
  // Delete
  delete: async (req, res) => {
    // if (!(await req.user.hasAccess(_module, "delete"))) {
    //   return error(res).permissionError();
    // }

    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return error(res).validationError(validation.array());
    }
    try {
      await Event.update(
        { status_event: "DELETED" },
        { where: { id_event: req.query.id } }
      );
      res.send({ status: true });
    } catch (err) {
      res.status(400).json({ status: false, message: err.message });
    }
  },
  // Validation
  validate: (type) => {

    console.log(type);
    // let mEvent = null;
    const ruleId = query("id")
      .trim()
      .notEmpty();
    const ruleName = body("nama_event").trim().notEmpty();

    switch (type) {
      case "create":
        {
          return [
            ruleName.custom((value) => {
              return Event.findOne({
                where: {
                  nama_event: {
                    [Sequelize.Op.iLike]: value,
                  },
                },
              }).then((res) => {
                if (res) {
                  return Promise.reject("Nama Event already exists!");
                }
              });
            }),
            ruleName,
          ];
        }
        break;
      case "update":
        {
          return [
            ruleId.optional().custom(async (value) => {
              const nameExists = await Event.findOne({
                where: {
                  id_event: value
                },
              });
              if (!nameExists) {
                return Promise.reject("Id event not exists!");
              }
            }),
            ruleName.optional(),
          ];
        }
        break;
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