const _module = "absensi";
const _ = require("lodash");
const { body, query, validationResult } = require("express-validator");
const Sequelize = require("sequelize");
const error = require("../../util/errors");
const datatable = require("../../util/datatable");
const moment = require("moment");
const { Absensi, File, Pegawai } = require("../../models/model");
const Op = Sequelize.Op;

module.exports = {
  // List
  list: async (req, res) => {
    if (!(await req.user.hasAccess(_module, "view"))) {
      return error(res).permissionError();
    }
    const mAbsensi = await Absensi.findAll({
      include: [
        {
          model: Pegawai,
          as: "pegawai",
        },
        {
          model: File,
          as: "foto",
          attributes: ["name", "path", "extension", "size"],
        },
      ],
    });
    res.json(mAbsensi);
  },
  // Datatable
  data: async (req, res) => {
    if (!(await req.user.hasAccess(_module, "view"))) {
      return error(res).permissionError();
    }

    var { filter } = req.body;
    let filterKodeDivisi = null;
    if (filter && filter.length > 0) {
      filter.forEach((f) => {
        if (f.column === "kode_divisi") {
          filterKodeDivisi = f.value;
        }
      });
    }

    // remove filter containing kode_divisi
    const payload = req.body;
    const filterIndex = payload.filter.findIndex((f) => f.column === "kode_divisi");
    if (filterIndex !== -1) {
      payload.filter.splice(filterIndex, 1);
    }

    var dataTableObj = await datatable(req.body);
    var queryFilter = {
      ...dataTableObj,
      include: [
        {
          model: Pegawai,
          as: "pegawai",
        },
        {
          model: File,
          as: "foto",
          attributes: ["name", "path", "extension", "size"],
        },
      ],

      attributes: [
        "id_absensi",
        "foto_absensi",
        "longitude_absensi",
        "latitude_absensi",
        "label_absensi",
        "catatan_absensi",
        "tipe_absensi",
        "timestamp_absensi",
        "kode_pegawai",
        "time_limit_datang",
        "time_limit_pulang",
        "createdAt",
        "updatedAt",
        [Sequelize.literal('"pegawai"."kode_divisi"'), "kode_divisi"],
      ],
    };

    if (filterKodeDivisi) {
      if (queryFilter.where && queryFilter.where[Op.and]) {
        queryFilter.where[Op.and].push(Sequelize.literal('"pegawai"."kode_divisi" = \'' + filterKodeDivisi + "'"));
      } else {
        queryFilter.where = {
          [Op.and]: [Sequelize.literal('"pegawai"."kode_divisi" = \'' + filterKodeDivisi + "'")],
        };
      }
    }

    var count = await Absensi.count();
    var modules = await Absensi.findAndCountAll(queryFilter);

    res.json({
      recordsFiltered: modules.count,
      recordsTotal: count,
      items: modules.rows,
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

    const mAbsensi = await Absensi.findOne({
      where: {
        id_absensi: req.query.id_absensi,
      },
      include: [
        {
          model: Pegawai,
          as: "pegawai",
        },
        {
          model: File,
          as: "foto",
          attributes: ["name", "path", "extension", "size"],
        },
      ],
    });
    res.json(mAbsensi);
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

    const absensiValidate = await Absensi.count({
      where: {
        tipe_absensi: req.body.tipe_absensi,
        kode_pegawai: req.body.kode_pegawai,
        [Op.and]: [
          Sequelize.where(
            Sequelize.fn("date", Sequelize.col("timestamp_absensi")),
            "=",
            moment(new Date(), "YYYY-MM-DD").format("YYYY-MM-DD")
          ),
        ],
      },
    });
    if (absensiValidate > 0) {
      res.json({
        status: false,
        statusCode: 422,
        msg: "Sudah melakukan absen " + req.body.tipe_absensi + "!",
      });
    } else {
      const absensi = await new Absensi({
        ...req.body,
      }).save();

      res.json({
        status: true,
        statusCode: 200,
        message: "Sukses melakukan absensi.",
      });
    }
  },
  // Validation
  validate: (type) => {
    let mAbsensi = null;
    let mFile = null;
    let mPegawai = null;
    let absensiValidate = null;
    const ruleId = query("id_absensi")
      .trim()
      .notEmpty()
      .custom(async (value) => {
        mAbsensi = await Absensi.findByPk(value);
        if (!mAbsensi) {
          return Promise.reject("Data not found!");
        }
      });
    const ruleFotoAbsensi = body("foto_absensi")
      .trim()
      .notEmpty()
      .custom(async (value) => {
        if (value) {
          mFile = await File.findByPk(value);
          if (!mFile) {
            return Promise.reject("Foto absensi tidak ditemukan!");
          }
        }
      });
    const ruleLongitude = body("longitude_organisasi").isFloat().optional();
    const ruleLatitude = body("latitude_organisasi").isFloat().optional();
    const ruleLabel = body("label_absensi").trim().notEmpty();
    const ruleCatatan = body("logo_organisasi").trim().optional();
    const ruleTipe = body("tipe_absensi").trim().notEmpty();
    const ruleKodePegawai = body("kode_pegawai")
      .trim()
      .optional()
      .custom(async (value) => {
        if (value) {
          mPegawai = await Pegawai.findOne({
            where: {
              kode_pegawai: {
                [Op.iLike]: value,
              },
            },
          });
          if (!mPegawai) {
            return Promise.reject("Data Pegawai tidak ditemukan!");
          }
        }
      });
    const ruleTimeStamp = body("timestamp_absensi").trim().notEmpty();
    const ruleTimeLimitDatang = body("time_limit_datang")
      .matches(/(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)/)
      .withMessage("time format should be HH:MM:SS (ex: 07:00:00)");

    const ruleTimeLimitPulang = body("time_limit_pulang")
      .matches(/(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)/)
      .withMessage("time format should be HH:MM:SS (ex: 07:00:00)");

    switch (type) {
      case "create":
        {
          return [
            ruleFotoAbsensi,
            ruleLongitude,
            ruleLatitude,
            ruleLabel,
            ruleCatatan,
            ruleTipe,
            ruleKodePegawai,
            ruleTimeStamp,
            ruleTimeLimitDatang,
            ruleTimeLimitPulang,
          ];
        }
        break;
      case "get":
        {
          return [ruleId];
        }
        break;
    }
  },
};
