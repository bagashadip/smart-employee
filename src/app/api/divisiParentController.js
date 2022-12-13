const _module = "divisi-parent";
const _ = require("lodash");
const { body, query, validationResult } = require("express-validator");
const Sequelize = require("sequelize");
const error = require("../../util/errors");
const datatable = require("../../util/datatable");
const { DivisiParent } = require("../../models/model");

const Op = Sequelize.Op;

module.exports = {
  // List
  list: async (req, res) => {
    if (!(await req.user.hasAccess(_module, "view"))) {
      return error(res).permissionError();
    }
    const mDivisiParent = await DivisiParent.findAll({
      attributes: [
        "id_divisi_parent",
        "kode_divisi_parent",
        "nama_divisi_parent",
      ],
    });
    res.json(mDivisiParent);
  },
  // Datatable
  data: async (req, res) => {
    if (!(await req.user.hasAccess(_module, "view"))) {
      return error(res).permissionError();
    }

    var dataTableObj = await datatable(req.body);
    var count = await DivisiParent.count();
    var modules = await DivisiParent.findAndCountAll(dataTableObj);

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

    const mDivisiParent = await DivisiParent.findOne({
      where: {
        kode_divisi_parent: req.query.kode_divisi_parent,
      },
    });
    res.json(mDivisiParent);
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

    const divisiParent = await new DivisiParent({
      ...req.body,
    }).save();

    res.json({
      status: true,
      statusCode: 200,
      message: divisiParent.kode_divisi_parent + " berhasil ditambah.",
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

    await DivisiParent.update(
      { ...req.body },
      { where: { kode_divisi_parent: req.query.kode_divisi_parent } }
    );

    res.json({
      status: true,
      statusCode: 200,
      message: req.query.kode_divisi_parent + " berhasil diubah.",
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

    await DivisiParent.destroy({
      where: {
        kode_divisi_parent: req.query.kode_divisi_parent,
      },
    });
    res.send({
      status: true,
      message: req.query.kode_divisi_parent + " berhasil dihapus.",
    });
  },
  // Validation
  validate: (type) => {
    let mDivisiParent = null;
    const ruleKodeDivisiParent = query("kode_divisi_parent")
      .trim()
      .notEmpty()
      .custom(async (value) => {
        mDivisiParent = await DivisiParent.findOne({
          where: {
            kode_divisi_parent: {
              [Op.iLike]: value,
            },
          },
        });
        if (!mDivisiParent) {
          return Promise.reject("Data not found!");
        }
      });
    const ruleCreateKodeDivisiParent = body("kode_divisi_parent")
      .trim()
      .notEmpty()
      .custom(async (value) => {
        mDivisiParent = await DivisiParent.findOne({
          where: {
            kode_divisi_parent: {
              [Op.iLike]: value,
            },
          },
        });
        if (mDivisiParent) {
          return Promise.reject("Data already exist!");
        }
      });
    const ruleNamaDivisiParent = body("nama_divisi_parent").trim().notEmpty();

    switch (type) {
      case "create":
        {
          return [ruleCreateKodeDivisiParent, ruleNamaDivisiParent];
        }
        break;
      case "update":
        {
          return [ruleKodeDivisiParent, ruleNamaDivisiParent.optional()];
        }
        break;
      case "get":
        {
          return [ruleKodeDivisiParent];
        }
        break;
      case "delete":
        {
          return [ruleKodeDivisiParent];
        }
        break;
    }
  },
};
