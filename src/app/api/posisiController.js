const _module = "posisi";
const _ = require("lodash");
const { body, query, validationResult } = require("express-validator");
const Sequelize = require("sequelize");
const error = require("../../util/errors");
const datatable = require("../../util/datatable");
const { Posisi } = require("../../models/model");

const Op = Sequelize.Op;

module.exports = {
  // List
  list: async (req, res) => {
    if (!(await req.user.hasAccess(_module, "view"))) {
      return error(res).permissionError();
    }

    const mPosisi = await Posisi.findAll({
      attributes: ["id_posisi", "kode_posisi", "nama_posisi"],
    });
    res.json(mPosisi);
  },
  // Datatable
  data: async (req, res) => {
    if (!(await req.user.hasAccess(_module, "view"))) {
      return error(res).permissionError();
    }

    var dataTableObj = await datatable(req.body);
    var count = await Posisi.count();
    var modules = await Posisi.findAndCountAll(dataTableObj);

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

    const mPosisi = await Posisi.findOne({
      where: {
        kode_posisi: req.query.kode_posisi,
      },
    });
    res.json(mPosisi);
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

    const posisi = await new Posisi({
      ...req.body,
    }).save();

    res.json({
      status: true,
      statusCode: 200,
      message: "Posisi " + posisi.kode_posisi + " berhasil ditambah.",
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

    await Posisi.update(
      { ...req.body },
      { where: { kode_posisi: req.query.kode_posisi } }
    );

    res.json({
      status: true,
      statusCode: 200,
      message: "Posisi " + req.query.kode_posisi + " berhasil diubah.",
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

    await Posisi.destroy({
      where: {
        kode_posisi: req.query.kode_posisi,
      },
    });
    res.send({
      status: true,
      message: req.query.kode_posisi + " berhasil dihapus.",
    });
  },
  // Validation
  validate: (type) => {
    let mPosisi = null;
    const ruleKodePosisi = query("kode_posisi")
      .trim()
      .notEmpty()
      .custom(async (value) => {
        mPosisi = await Posisi.findOne({
          where: {
            kode_posisi: {
              [Op.iLike]: value,
            },
          },
        });
        if (!mPosisi) {
          return Promise.reject("Data not found!");
        }
      });
    const ruleCreateKodePosisi = body("kode_posisi")
      .trim()
      .notEmpty()
      .custom(async (value) => {
        mPosisi = await Posisi.findOne({
          where: {
            kode_posisi: {
              [Op.iLike]: value,
            },
          },
        });
        if (mPosisi) {
          return Promise.reject("Data already exist!");
        }
      });
    const ruleNamaPosisi = body("nama_posisi").trim().notEmpty();

    switch (type) {
      case "create":
        {
          return [ruleCreateKodePosisi, ruleNamaPosisi];
        }
        break;
      case "update":
        {
          return [ruleKodePosisi, ruleNamaPosisi.optional()];
        }
        break;
      case "get":
        {
          return [ruleKodePosisi];
        }
        break;
      case "delete":
        {
          return [ruleKodePosisi];
        }
        break;
    }
  },
};
