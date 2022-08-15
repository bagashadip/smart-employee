// const _module = "banner-category";
const _ = require("lodash");
const { body, query, validationResult } = require("express-validator");
const Sequelize = require("sequelize");
const error = require("../../util/errors");
const datatable = require("../../util/datatable");
const { JamKerjaDetail, JamKerja } = require("../../models/model");

const Op = Sequelize.Op;

module.exports = {
  // List
  list: async (req, res) => {
    const mJamKerjaDetail = await JamKerjaDetail.findAll({
      attributes: [
        "id_jamkerjadetail",
        "nama_jamkerjadetail",
        "jam_datang",
        "jam_pulang",
        "kode_jamkerja",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: JamKerja,
          as: "jamkerja",
          attributes: ["kode_jamkerja", "tampil_jamkerja"],
        },
      ],
    });
    res.json(mJamKerjaDetail);
  },
  // Datatable
  data: async (req, res) => {
    // if (!(await req.user.hasAccess(_module, "view"))) {
    //   return error(res).permissionError();
    // }

    var dataTableObj = await datatable(req.body);
    var count = await JamKerjaDetail.count();
    var modules = await JamKerjaDetail.findAndCountAll({
      ...dataTableObj,
      include: [
        {
          model: JamKerja,
          as: "jamkerja",
          attributes: ["kode_jamkerja", "tampil_jamkerja"],
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

    const mJamKerjaDetail = await JamKerjaDetail.findOne({
      where: {
        id_jamkerjadetail: req.query.id_jamkerjadetail,
      },
      include: [
        {
          model: JamKerja,
          as: "jamkerja",
          attributes: ["kode_jamkerja", "tampil_jamkerja"],
        },
      ],
    });
    res.json(mJamKerjaDetail);
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

    const jamKerjaDetail = await new JamKerjaDetail({
      ...req.body,
    }).save();

    res.json({
      status: true,
      statusCode: 200,
      message: "Jam Kerja Detail berhasil ditambah.",
    });
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

    await JamKerjaDetail.update(
      { ...req.body },
      { where: { id_jamkerjadetail: parseInt(req.query.id_jamkerjadetail) } }
    );

    res.json({
      status: true,
      statusCode: 200,
      message: "Jam Kerja Detail berhasil diubah.",
    });
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

    await JamKerjaDetail.destroy({
      where: {
        id_jamkerjadetail: req.query.id_jamkerjadetail,
      },
    });
    res.send({
      status: true,
      message: "Detail jam kerja berhasil dihapus.",
    });
  },
  // Validation
  validate: (type) => {
    let mJamKerjaDetail = null;
    const ruleIdJamKerja = query("id_jamkerjadetail")
      .trim()
      .notEmpty()
      .custom(async (value) => {
        mJamKerjaDetail = await JamKerjaDetail.findByPk(value);
        if (!mJamKerjaDetail) {
          return Promise.reject("Data not found!");
        }
      });
    const ruleCreateIdJamKerja = body("id_jamkerjadetail")
      .trim()
      .notEmpty()
      .custom(async (value) => {
        mJamKerjaDetail = await JamKerjaDetail.findByPk(value);
        if (mJamKerjaDetail) {
          return Promise.reject("Data already exist!");
        }
      });

    const ruleJamDatang = body("jam_datang")
      .matches(/(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)/)
      .withMessage("time format should be HH:MM:SS (ex: 07:00:00)");

    const ruleJamPulang = body("jam_pulang")
      .matches(/(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)/)
      .withMessage("time format should be HH:MM:SS (ex: 07:00:00)");

    const kodeJamKerja = body("kode_jamkerja").custom(async (value) => {
      const mJamKerja = await JamKerja.findOne({
        where: {
          kode_jamkerja: value,
        },
      });

      if (!mJamKerja) {
        return Promise.reject("Kode jam kerja tidak ditemukan");
      }
    });

    switch (type) {
      case "create":
        {
          return [ruleJamDatang, ruleJamPulang, kodeJamKerja];
        }
        break;
      case "update":
        {
          return [
            ruleIdJamKerja,
            ruleJamDatang.optional(),
            ruleJamPulang.optional(),
            kodeJamKerja.optional(),
          ];
        }
        break;
      case "get":
        {
          return [ruleIdJamKerja];
        }
        break;
      case "delete":
        {
          return [ruleIdJamKerja];
        }
        break;
    }
  },
};
