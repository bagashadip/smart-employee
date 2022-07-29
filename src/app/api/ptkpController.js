// const _module = "banner-category";
const _ = require("lodash");
const { body, query, validationResult } = require("express-validator");
const Sequelize = require("sequelize");
const error = require("../../util/errors");
const datatable = require("../../util/datatable");
const { Ptkp } = require("../../models/model");

const Op = Sequelize.Op;

module.exports = {
  // List
  list: async (req, res) => {
    const mPtkp = await Ptkp.findAll({
      attributes: ["id_ptkp", "kode_ptkp", "keterangan_ptkp"],
    });
    res.json(mPtkp);
  },
  // Datatable
  data: async (req, res) => {
    // if (!(await req.user.hasAccess(_module, "view"))) {
    //   return error(res).permissionError();
    // }

    var dataTableObj = await datatable(req.body);
    var count = await Ptkp.count();
    var modules = await Ptkp.findAndCountAll({
        ...dataTableObj
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

    const mPtkp = await Ptkp.findOne({
        where: {
            kode_ptkp: req.query.kode_ptkp
        }
    });
    res.json(mPtkp);
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

    const ptkp = await new Ptkp({
      ...req.body,
    }).save();

    res.json({ 
      status: true,
      statusCode: 200, 
      message: "PTKP " + ptkp.kode_ptkp + " berhasil ditambah."
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

    await Ptkp.update(
      { ...req.body},
      { where: { kode_ptkp: req.query.kode_ptkp } }
    );

    res.json({ 
      status: true ,
      statusCode: 200,
      message: "PTKP " + req.query.kode_ptkp + " berhasil diubah."
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

    await Ptkp.destroy({
      where: {
        kode_ptkp: req.query.kode_ptkp,
      },
    });
    res.send({ status: true, message: req.query.kode_ptkp + ' berhasil dihapus.' });
  },
  // Validation
  validate: (type) => {
    let mPtkp = null;
    const ruleKodePtkp = query("kode_ptkp")
      .trim()
      .notEmpty()
      .custom(async (value) => {
        mPtkp = await Ptkp.findOne({
            where: {
                kode_ptkp: {
                    [Op.iLike]: value
                }
            }
        });
        if (!mPtkp) {
          return Promise.reject("Data tidak ditemukan!");
        }
      });
    const ruleCreateKodePtkp = body("kode_ptkp")
      .trim()
      .notEmpty()
      .custom(async (value) => {
        mPtkp = await Ptkp.findOne({
            where: {
                kode_ptkp: {
                    [Op.iLike]: value,
                },
            },
        });
        if (mPtkp) {
          return Promise.reject("Data sudah ada!");
        }
    });
    const ruleKeteranganPtkp = body("keterangan_ptkp").trim().notEmpty();

    switch (type) {
      case "create":
        {
            return [
                ruleCreateKodePtkp,
                ruleKeteranganPtkp,
            ];
        }
        break;
      case "update":
        {
            return [
              ruleKodePtkp,
              ruleKeteranganPtkp.optional()
            ];
        }
        break;
      case "get":
        {
          return [ruleKodePtkp];
        }
        break;
      case "delete":
        {
          return [ruleKodePtkp];
        }
        break;
    }
  },
};
