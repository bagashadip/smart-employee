// const _module = "banner-category";
const _ = require("lodash");
const { body, query, validationResult } = require("express-validator");
const Sequelize = require("sequelize");
const error = require("../../util/errors");
const datatable = require("../../util/datatable");
const { Jabatan } = require("../../models/model");

const Op = Sequelize.Op;

module.exports = {
  // List
  list: async (req, res) => {
    const mJabatan = await Jabatan.findAll({
      attributes: ["id_jabatan", "kode_jabatan", "nama_jabatan"],
    });
    res.json(mJabatan);
  },
  // Datatable
  data: async (req, res) => {
    // if (!(await req.user.hasAccess(_module, "view"))) {
    //   return error(res).permissionError();
    // }

    var dataTableObj = await datatable(req.body);
    var count = await Jabatan.count();
    var modules = await Jabatan.findAndCountAll(dataTableObj);
    
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

    const mJabatan = await Jabatan.findOne({
      where: {
        kode_jabatan: req.query.kode_jabatan
      }
    });
    res.json(mJabatan);
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

    const jabatan = await new Jabatan({
      ...req.body,
    }).save();

    res.json({ 
      status: true,
      statusCode: 200, 
      message: "Jabatan " + jabatan.kode_jabatan + " berhasil ditambah."
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

    await Jabatan.update(
      { ...req.body},
      { where: { kode_jabatan: req.query.kode_jabatan } }
    );

    res.json({ 
      status: true ,
      statusCode: 200,
      message: "Jabatan " + req.query.kode_jabatan + " berhasil diubah."
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

    await Jabatan.destroy({
      where: {
        kode_jabatan: req.query.kode_jabatan,
      },
    });
    res.send({ status: true, message: req.query.kode_jabatan + ' berhasil dihapus.' });
  },
  // Validation
  validate: (type) => {
    let mJabatan = null;
    const ruleKodeJabatan = query("kode_jabatan")
      .trim()
      .notEmpty()
      .custom(async (value) => {
        mJabatan = await Jabatan.findOne({
            where: {
                kode_jabatan: {
                    [Op.iLike]: value
                }
            }
        });
        if (!mJabatan) {
          return Promise.reject("Data not found!");
        }
      });
    const ruleCreateKodeJabatan = body("kode_jabatan")
      .trim()
      .notEmpty()
      .custom(async (value) => {
        mJabatan = await Jabatan.findOne({
            where: {
                kode_jabatan: {
                    [Op.iLike]: value,
                },
            },
        });
        if (mJabatan) {
          return Promise.reject("Data already exist!");
        }
    });
    const ruleNamaJabatan = body("nama_jabatan").trim().notEmpty();

    switch (type) {
      case "create":
        {
            return [
                ruleCreateKodeJabatan,
                ruleNamaJabatan,
            ];
        }
        break;
      case "update":
        {
            return [
              ruleKodeJabatan,
              ruleNamaJabatan.optional()
            ];
        }
        break;
      case "get":
        {
          return [ruleKodeJabatan];
        }
        break;
      case "delete":
        {
          return [ruleKodeJabatan];
        }
        break;
    }
  },
};
