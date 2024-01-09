const _module = "event";
const _ = require("lodash");
const { body, query, validationResult } = require("express-validator");
const Sequelize = require("sequelize");
const error = require("../../util/errors");
const datatable = require("../../util/datatable");
const moment = require("moment");
const Op = Sequelize.Op;
const { Event, Pegawai, File, Divisi, Asn } = require("../../models/model");
const sequelize = require("../../util/database");
const event = require("../../models/event");
const { htmlToText } = require('html-to-text');



module.exports = {
  // calendar
  calendar: async (req, res) => {
    try {

      const year = req.query.year;
      const month = req.query.month;
      const kode_pegawai = req.user.kode_pegawai;

      const mPegawai = await Pegawai.findOne({
        where: {
          kode_pegawai: kode_pegawai,
        },
      });

      var mEvents = await Event.findAll({
        where: {
          status_event: "PUBLIC",
          tanggal_event: {
            [Op.and]: [
              Sequelize.where(sequelize.fn("DATE_PART", "YEAR", sequelize.col("tanggal_event")), year),
              Sequelize.where(sequelize.fn("DATE_PART", "MONTH", sequelize.col("tanggal_event")), month),
            ],
          },
        },
        order: [
          [Sequelize.col("tanggal_event"), "DESC"]
        ],
      });

      var events = []
      await Promise.all(mEvents.map(async (event) => {

        var data = null;
        if (event.kategori_event == "ALL") {
          data = event;
        } else if (event.kategori_event == "DIVISI" && event.recipient_event.includes(mPegawai.kode_divisi)) {
          data = event;
        } else if (event.kategori_event == "INDIVIDU" && event.recipient_event.includes(kode_pegawai)) {
          data = event;
        }
        if (data) {

          data.dataValues.recipient_object = await Pegawai.findAll({
            where: {
              kode_pegawai: {
                [Op.in]: event.recipient_event,
              },
            },
            attributes: ["kode_pegawai", "namalengkap_pegawai", "kode_divisi"],
          });

          data.dataValues.foto = await File.findOne({
            where: {
              id: event.gambar_event,
            },
            attributes: ["name", "path", "extension", "size"],
          });


          var pic_object = {};

          if (event.pic_event) {
            const mPegawaiEach = await Pegawai.findOne({
              where: {
                kode_pegawai: event.pic_event,
              },
              attributes: ["kode_pegawai", "namalengkap_pegawai", "kode_divisi"],
            });

            const mAsn = await Asn.findOne({
              where: {
                nip_asn: event.pic_event,
              },
              attributes: ["nip_asn", "nama_asn"],
            });

            if (mPegawaiEach) {
              pic_object = {
                kode: mPegawaiEach.kode_pegawai,
                nama: mPegawaiEach.namalengkap_pegawai,
                divisi_jabatan: mPegawaiEach.kode_divisi,
              }

            } else if (mAsn) {
              pic_object = {
                kode: mAsn.nip_asn,
                nama: mAsn.nama_asn,
                divisi_jabatan: "ASN",
              }
            }
          }

          data.dataValues.pic_object = pic_object;
          events.push(data);
        }
      }));

      var result = [];

      events.map((item) => {
        const tanggal = moment(item.tanggal_event).format("YYYY-MM-DD");
        const found = result.some(el => el.tanggal === tanggal);
        if (!found) {

          var eventsEach = events.filter((event) => {
            return moment(event.tanggal_event).format("YYYY-MM-DD") == tanggal;
          });


          result.push({ tanggal: tanggal, events: eventsEach });
        }
      });

      var sortedObjs = _.sortBy(result, 'tanggal', 'desc')


      res.json(sortedObjs);

    } catch (err) {
      res.status(400).json({ status: false, message: err.message });
    }
  },
  // List
  list: async (req, res) => {
    if (!(await req.user.hasAccess(_module, "view"))) {
      return error(res).permissionError();
    }
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
    if (!(await req.user.hasAccess(_module, "view"))) {
      return error(res).permissionError();
    }

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
    if (!(await req.user.hasAccess(_module, "view"))) {
      return error(res).permissionError();
    }

    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return error(res).validationError(validation.array());
    }

    try {
      const mEvent = await Event.findByPk(req.query.id);
      const mFile = await File.findOne({
        where: {
          id: mEvent.gambar_event,
        },
        attributes: ["name", "path", "extension", "size"],
      });

      var pic_object = null;
      var divisi_object = null;
      var recipient_object = [];

      

      if (mEvent.pic_event) {
        const mPegawai = await Pegawai.findOne({
          where: {
            kode_pegawai: mEvent.pic_event,
          },
          attributes: ["kode_pegawai", "namalengkap_pegawai", "kode_divisi"],
        });

        const mAsn = await Asn.findOne({
          where: {
            nip_asn: mEvent.pic_event,
          },
          attributes: ["nip_asn", "nama_asn"],
        });

        if (mPegawai) {
          pic_object = {
            kode: mPegawai.kode_pegawai,
            nama: mPegawai.namalengkap_pegawai,
            divisi_jabatan: mPegawai.kode_divisi,
          }

        } else if (mAsn) {
          pic_object = {
            kode: mAsn.nip_asn,
            nama: mAsn.nama_asn,
            divisi_jabatan: "ASN",
          }
        }
      }

      if (mEvent.divisi_event) {
        divisi_object = await Divisi.findOne({
          where: {
            kode_divisi: mEvent.divisi_event,
          },
          attributes: ["kode_divisi", "nama_divisi"],
        });
      }

      if (mEvent.recipient_event && mEvent.kategori_event == "INDIVIDU") {
        const pegawais = await Pegawai.findAll({
          where: {
            kode_pegawai: {
              [Op.in]: mEvent.recipient_event,
            },
          },
          attributes: ["kode_pegawai", "namalengkap_pegawai", "kode_divisi"],
        });

        pegawais.map((item) => {
          recipient_object.push({
            kode: item.kode_pegawai,
            nama: item.namalengkap_pegawai,
            divisi_jabatan: item.kode_divisi,
          });
        });

        const asns = await Asn.findAll({
          where: {
            nip_asn: {
              [Op.in]: mEvent.recipient_event,
            },
          },
          attributes: ["nip_asn", "nama_asn"],
        });

        asns.map((item) => {
          recipient_object.push({
            kode: item.nip_asn,
            nama: item.nama_asn,
            divisi_jabatan: "ASN",
          });
        });
      }

      if (mEvent.recipient_event && mEvent.kategori_event == "DIVISI") {
        var divisis = await Divisi.findAll({
          where: {
            kode_divisi: {
              [Op.in]: mEvent.recipient_event,
            },
          },
          attributes: ["kode_divisi", "nama_divisi"],
        });

        divisis.map((item) => {
          recipient_object.push({
            kode: item.kode_divisi,
            nama: item.nama_divisi
          });
        });

      }

      var plainText = htmlToText(mEvent.keterangan_event, { wordwrap: 100 }).trim().replace(/(\r\n|\n|\r)/gm, "").substring(0, 100) + "...";
      const result = {
        ...mEvent.dataValues,
        foto: mFile,
        pic_object: pic_object,
        divisi_object: divisi_object,
        recipient_object: recipient_object,
        plainText: plainText,
      }
      res.json(result);
    } catch (err) {
      res.status(400).json({ status: false, message: err.message });
    }
  },
  // Create
  create: async (req, res) => {
    if (!(await req.user.hasAccess(_module, "create"))) {
      return error(res).permissionError();
    }

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
    if (!(await req.user.hasAccess(_module, "update"))) {
      return error(res).permissionError();
    }

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
    if (!(await req.user.hasAccess(_module, "delete"))) {
      return error(res).permissionError();
    }

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