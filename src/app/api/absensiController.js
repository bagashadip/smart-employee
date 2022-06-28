// const _module = "banner-category";
const _ = require("lodash");
const { body, query, validationResult } = require("express-validator");
const Sequelize = require("sequelize");
const error = require("../../util/errors");
const datatable = require("../../util/datatable");
const { Absensi, File, Pegawai } = require("../../models/model");

const Op = Sequelize.Op;

module.exports = {
  // List
  list: async (req, res) => {
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
    // if (!(await req.user.hasAccess(_module, "view"))) {
    //   return error(res).permissionError();
    // }

    var dataTableObj = await datatable(req.body);
    var count = await Absensi.count();
    var modules = await Absensi.findAndCountAll({
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
    });

    res.json({
      recordsFiltered: modules.count,
      recordsTotal: count,
      items: modules.rows,
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
    // if (!(await req.user.hasAccess(_module, "create"))) {
    //   return error(res).permissionError();
    // }

    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return error(res).validationError(validation.array());
    }

    req.body.timestamp_absensi = new Date();
    const absensi = await new Absensi({
      ...req.body,
    }).save();

    res.json({
      status: true,
      statusCode: 200,
      message: "Sukses melakukan absensi.",
    });
  },
  // Validation
  validate: (type) => {
    let mAbsensi = null;
    let mFile = null;
    let mPegawai = null;
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
