// const _module = "banner-category";
const _ = require("lodash");
const { body, query, validationResult } = require("express-validator");
const Sequelize = require("sequelize");
const error = require("../../util/errors");
const datatable = require("../../util/datatable");
const { HakAkses } = require("../../models/model");

const Op = Sequelize.Op;

module.exports = {
  // List
  list: async (req, res) => {
    const mHakAkses = await HakAkses.findAll({
      attributes: ["id_hakakses", "kode_hakakses", "keterangan_hakakses"],
    });
    res.json(mHakAkses);
  },
  // Datatable
  data: async (req, res) => {
    // if (!(await req.user.hasAccess(_module, "view"))) {
    //   return error(res).permissionError();
    // }

    var dataTableObj = await datatable(req.body);
    var count = await HakAkses.count();
    var modules = await HakAkses.findAndCountAll({
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

    const mHakAkses = await HakAkses.findOne({
        where: {
            kode_hakakses: req.query.kode_hakakses
        }
    });
    res.json(mHakAkses);
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

    const hakAkses = await new HakAkses({
      ...req.body,
    }).save();

    res.json({ 
      status: true,
      statusCode: 200, 
      message: "Hak Akses " + hakAkses.kode_hakakses + " berhasil ditambah."
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

    await HakAkses.update(
      { ...req.body},
      { where: { kode_hakakses: req.query.kode_hakakses } }
    );

    res.json({ 
      status: true ,
      statusCode: 200,
      message: "Hak Akses " + req.query.kode_hakakses + " berhasil diubah."
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

    await HakAkses.destroy({
      where: {
        kode_hakakses: req.query.kode_hakakses,
      },
    });
    res.send({ status: true, message: req.query.kode_hakakses + 'berhasil dihapus.' });
  },
  // Validation
  validate: (type) => {
    let mHakAkses = null;
    const ruleKodeHakAkses = query("kode_hakakses")
      .trim()
      .notEmpty()
      .custom(async (value) => {
        mHakAkses = await HakAkses.findOne({
            where: {
                kode_hakakses: {
                    [Op.iLike]: value
                }
            }
        });
        if (!mHakAkses) {
          return Promise.reject("Data tidak ditemukan!");
        }
      });
    const ruleCreateKodeHakAkses = body("kode_hakakses")
      .trim()
      .notEmpty()
      .custom(async (value) => {
        mHakAkses = await HakAkses.findOne({
            where: {
                kode_hakakses: {
                    [Op.iLike]: value,
                },
            },
        });
        if (mHakAkses) {
          return Promise.reject("Data sudah ada!");
        }
    });
    const ruleKeteranganHakAkses = body("keterangan_hakakses").trim().notEmpty();

    switch (type) {
      case "create":
        {
            return [
                ruleCreateKodeHakAkses,
                ruleKeteranganHakAkses,
            ];
        }
        break;
      case "update":
        {
            return [
              ruleKodeHakAkses,
              ruleKeteranganHakAkses.optional()
            ];
        }
        break;
      case "get":
        {
          return [ruleKodeHakAkses];
        }
        break;
      case "delete":
        {
          return [ruleKodeHakAkses];
        }
        break;
    }
  },
};
