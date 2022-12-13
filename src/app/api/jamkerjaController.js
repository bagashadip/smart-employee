const _module = "jam-kerja";
const _ = require("lodash");
const { body, query, validationResult } = require("express-validator");
const Sequelize = require("sequelize");
const error = require("../../util/errors");
const datatable = require("../../util/datatable");
const { JamKerja } = require("../../models/model");

const Op = Sequelize.Op;

module.exports = {
  // List
  list: async (req, res) => {
    if (!(await req.user.hasAccess(_module, "view"))) {
      return error(res).permissionError();
    }
    const mJamKerja = await JamKerja.findAll({
      attributes: [
        "kode_jamkerja",
        "tampil_jamkerja",
        "createdAt",
        "updatedAt",
      ],
    });
    res.json(mJamKerja);
  },
  // Datatable
  data: async (req, res) => {
    if (!(await req.user.hasAccess(_module, "view"))) {
      return error(res).permissionError();
    }

    var dataTableObj = await datatable(req.body);
    var count = await JamKerja.count();
    var modules = await JamKerja.findAndCountAll(dataTableObj);

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

    const mJamKerja = await JamKerja.findOne({
      where: {
        kode_jamkerja: req.query.kode_jamkerja,
      },
    });
    res.json(mJamKerja);
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

    const jamkerja = await new JamKerja({
      ...req.body,
    }).save();

    res.json({
      status: true,
      statusCode: 200,
      message: "Jam Kerja " + req.body.kode_jamkerja + " berhasil ditambah.",
    });
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

    await JamKerja.update(
      { ...req.body },
      { where: { kode_jamkerja: req.query.kode_jamkerja } }
    );

    res.json({
      status: true,
      statusCode: 200,
      message: "Jam Kerja " + req.query.kode_jamkerja + " berhasil diubah.",
    });
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

    await JamKerja.destroy({
      where: {
        kode_jamkerja: req.query.kode_jamkerja,
      },
    });
    res.send({
      status: true,
      message: req.query.kode_jamkerja + " berhasil dihapus.",
    });
  },
  // Validation
  validate: (type) => {
    let mJamKerja = null;
    const ruleKodeJamKerja = query("kode_jamkerja")
      .trim()
      .notEmpty()
      .custom(async (value) => {
        mJamKerja = await JamKerja.findOne({
          where: {
            kode_jamkerja: {
              [Op.iLike]: value,
            },
          },
        });
        if (!mJamKerja) {
          return Promise.reject("Data not found!");
        }
      });
    const ruleCreateKodeJamKerja = body("kode_jamkerja")
      .trim()
      .notEmpty()
      .custom(async (value) => {
        mJamKerja = await JamKerja.findOne({
          where: {
            kode_jamkerja: {
              [Op.iLike]: value,
            },
          },
        });
        if (mJamKerja) {
          return Promise.reject("Data already exist!");
        }
      });
    const ruleTampilJamKerja = body("tampil_jamkerja");

    switch (type) {
      case "create":
        {
          return [ruleCreateKodeJamKerja, ruleTampilJamKerja];
        }
        break;
      case "update":
        {
          return [ruleKodeJamKerja, ruleTampilJamKerja.optional()];
        }
        break;
      case "get":
        {
          return [ruleKodeJamKerja];
        }
        break;
      case "delete":
        {
          return [ruleKodeJamKerja];
        }
        break;
    }
  },
};
