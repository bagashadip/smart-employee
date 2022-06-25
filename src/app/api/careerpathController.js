// const _module = "banner-category";
const _ = require("lodash");
const { body, query, validationResult } = require("express-validator");
const Sequelize = require("sequelize");
const error = require("../../util/errors");
const datatable = require("../../util/datatable");
const { CareerPath, Divisi } = require("../../models/model");

const Op = Sequelize.Op;

module.exports = {
  // List
  list: async (req, res) => {
    const mCareerPath = await CareerPath.findAll({
      attributes: ["id_careerpath", "kode_careerpath", "nama_careerpath", "kode_divisi"],
    });
    res.json(mCareerPath);
  },
  // Datatable
  data: async (req, res) => {
    // if (!(await req.user.hasAccess(_module, "view"))) {
    //   return error(res).permissionError();
    // }

    var dataTableObj = await datatable(req.body);
    var count = await CareerPath.count();
    var modules = await CareerPath.findAndCountAll(dataTableObj);

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

    const mCareerPath = await CareerPath.findOne({
      where: {
        kode_careerpath: req.query.kode_careerpath
      }
    });
    res.json(mCareerPath);
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

    const careerPath = await new CareerPath({
      ...req.body,
    }).save();

    res.json({ 
      status: true,
      statusCode: 200, 
      message: "CareerPath " + careerPath.kode_careerpath + " berhasil ditambah."
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

    await CareerPath.update(
      { ...req.body},
      { where: { kode_careerpath: req.query.kode_careerpath } }
    );

    res.json({ 
      status: true ,
      statusCode: 200,
      message: "CareerPath " + req.query.kode_careerpath + " berhasil diubah."
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

    await CareerPath.destroy({
      where: {
        kode_careerpath: req.query.kode_careerpath,
      },
    });
    res.send({ status: true, message: req.query.kode_careerpath + ' berhasil dihapus.' });
  },
  // Validation
  validate: (type) => {
    let mCareerPath = null;
    const ruleKodeCareerPath = query("kode_careerpath")
      .trim()
      .notEmpty()
      .custom(async (value) => {
        mCareerPath = await CareerPath.findOne({
            where: {
                kode_careerpath: {
                    [Op.iLike]: value
                }
            }
        });
        if (!mCareerPath) {
          return Promise.reject("Data tidak ditemukan!");
        }
      });
    const ruleKodeDivisi = body("kode_divisi")
      .trim()
      .custom(async (value) => {
        mDivisi = await Divisi.findOne({
            where: {
                kode_divisi: {
                    [Op.iLike]: value
                }
            }
        });
        if (!mDivisi) {
            return Promise.reject("Relasi divisi " + value + " tidak ditemukan!");
        }
      });
    const ruleCreateKodeCareerPath = body("kode_careerpath")
      .trim()
      .notEmpty()
      .custom(async (value) => {
        mCareerPath = await CareerPath.findOne({
            where: {
                kode_careerpath: {
                    [Op.iLike]: value,
                },
            },
        });
        if (mCareerPath) {
          return Promise.reject("Data sudah ada!");
        }
    });
    const ruleNamaCareerPath = body("nama_careerpath").trim().notEmpty();

    switch (type) {
      case "create":
        {
            return [
                ruleCreateKodeCareerPath,
                ruleNamaCareerPath,
                ruleKodeDivisi
            ];
        }
        break;
      case "update":
        {
            return [
              ruleNamaCareerPath.optional(),
              ruleKodeDivisi.optional()
            ];
        }
        break;
      case "get":
        {
          return [ruleKodeCareerPath];
        }
        break;
      case "delete":
        {
          return [ruleKodeCareerPath];
        }
        break;
    }
  },
};
