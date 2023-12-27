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

      var mEvent = await Event.findAll({
        where: {
          status_event: "PUBLIC",
          tanggal_event: {
            [Op.and]: [
              Sequelize.where(sequelize.fn("DATE_PART", "YEAR", sequelize.col("tanggal_event")), year),
              Sequelize.where(sequelize.fn("DATE_PART", "MONTH", sequelize.col("tanggal_event")), month),
            ],
          },
        },
      });


      var result = [];
      await Promise.all(mEvent.map(async (item) => {
        if (item.kategori_event == "ALL" || item.recipient_event.includes(kode_pegawai) || item.recipient_event.includes(mPegawai.divisi_pegawai)) {
          const tanggal = moment(item.tanggal_event).format("YYYY-MM-DD");

          if (!result.includes(tanggal) || result.length == 0) {
            var events = mEvent.filter((event) => {
              return moment(event.tanggal_event).format("YYYY-MM-DD") == tanggal;
            });

            var listevents = await Promise.all(events.map(async (event) => {

              const recipient_object = await Pegawai.findAll({
                where: {
                  kode_pegawai: {
                    [Op.in]: event.recipient_event,
                  },
                },
                attributes: ["kode_pegawai", "namalengkap_pegawai", "kode_divisi"],
              });

              const mFile = await File.findOne({
                where: {
                  id: event.gambar_event,
                },
                attributes: ["name", "path", "extension", "size"],
              });

              var pic_object = {};

              if (event.pic_event) {
                const mPegawai = await Pegawai.findOne({
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

              return {
                id_event: event.id_event,
                nama_event: event.nama_event,
                tanggal_event: event.tanggal_event,
                jammulai_event: event.jammulai_event,
                jamselesai_event: event.jamselesai_event,
                kategori_event: event.kategori_event,
                recipient_event: event.recipient_event,
                keterangan_event: event.keterangan_event,
                gambar_event: event.gambar_event,
                pic_event: event.pic_event,
                divisi_event: event.divisi_event,
                push_date_event: event.push_date_event,
                pic_object: pic_object,
                foto: mFile,
                recipient_object: recipient_object,
              }
            }));

            result.push({ tanggal: tanggal, events: listevents });
          }
        }
      }));

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

      const result = {
        ...mEvent.dataValues,
        foto: mFile,
        pic_object: pic_object,
        divisi_object: divisi_object,
        recipient_object: recipient_object,
      }
      res.json(result);
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