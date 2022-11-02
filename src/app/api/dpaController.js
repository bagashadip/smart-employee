// const _module = "banner-category";
const _ = require("lodash");
const { body, query, validationResult } = require("express-validator");
const Sequelize = require("sequelize");
const error = require("../../util/errors");
const datatable = require("../../util/datatable");
const { Dpa } = require("../../models/model");

const Op = Sequelize.Op;

module.exports = {
  // List
  list: async (req, res) => {
    const mDpa = await Dpa.findAll({
      attributes: ["id_dpa", "kode_dpa", "nama_dpa","jenis_kontrak"],
    });
    res.json(mDpa);
  },
  // Datatable
  data: async (req, res) => {
    // if (!(await req.user.hasAccess(_module, "view"))) {
    //   return error(res).permissionError();
    // }

    var dataTableObj = await datatable(req.body);
    var count = await Dpa.count();
    var modules = await Dpa.findAndCountAll(dataTableObj);
    
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

    const mDpa = await Dpa.findOne({
        where: {
            kode_dpa: req.query.kode_dpa
        }
    });
    res.json(mDpa);
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

    const dpa = await new Dpa({
      ...req.body,
    }).save();

    res.json({ 
      status: true,
      statusCode: 200, 
      message: "DPA " + dpa.kode_dpa + " berhasil ditambah."
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

    await Dpa.update(
      { ...req.body},
      { where: { kode_dpa: req.query.kode_dpa } }
    );

    res.json({ 
      status: true ,
      statusCode: 200,
      message: "DPA " + req.query.kode_dpa + " berhasil diubah."
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

    await Dpa.destroy({
      where: {
        kode_dpa: req.query.kode_dpa,
      },
    });
    res.send({ status: true, message: req.query.kode_dpa + ' berhasil dihapus.' });
  },
  // Validation
  validate: (type) => {
    let mDpa = null;
    const ruleKodeDpa = query("kode_dpa")
      .trim()
      .notEmpty()
      .custom(async (value) => {
        mDpa = await Dpa.findOne({
            where: {
                kode_dpa: {
                    [Op.iLike]: value
                }
            }
        });
        if (!mDpa) {
          return Promise.reject("Data not found!");
        }
      });
    const ruleCreateKodeDpa = body("kode_dpa")
      .trim()
      .notEmpty()
      .custom(async (value) => {
        mDpa = await Dpa.findOne({
            where: {
                kode_dpa: {
                    [Op.iLike]: value,
                },
            },
        });
        if (mDpa) {
          return Promise.reject("Data already exist!");
        }
    });
    const ruleNamaDpa = body("nama_dpa").trim().notEmpty();
    const ruleGradeDpa = body("grade_dpa").trim().notEmpty();

    switch (type) {
      case "create":
        {
            return [
                ruleCreateKodeDpa,
                ruleNamaDpa,
                ruleGradeDpa
            ];
        }
        break;
      case "update":
        {
            return [
              ruleKodeDpa,
              ruleNamaDpa.optional(),
              ruleGradeDpa.optional()
            ];
        }
        break;
      case "get":
        {
          return [ruleKodeDpa];
        }
        break;
      case "delete":
        {
          return [ruleKodeDpa];
        }
        break;
    }
  },
};
