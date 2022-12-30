const _module = "kategori-cuti";
const _ = require("lodash");
const { body, query, validationResult } = require("express-validator");
const Sequelize = require("sequelize");
const error = require("../../util/errors");
const datatable = require("../../util/datatable");
const { KategoriCuti } = require("../../models/model");

const Op = Sequelize.Op;

module.exports = {
  // List
  list: async (req, res) => {
    if (!(await req.user.hasAccess(_module, "view"))) {
      return error(res).permissionError();
    }
    const mKategoriCuti = await KategoriCuti.findAll({
      attributes: [
        "id_kategoricuti",
        "kode_kategoricuti",
        "keterangan_kategoricuti",
      ],
    });
    res.json(mKategoriCuti);
  },
  // Datatable
  data: async (req, res) => {
    if (!(await req.user.hasAccess(_module, "view"))) {
      return error(res).permissionError();
    }

    var dataTableObj = await datatable(req.body);
    var count = await KategoriCuti.count();
    var modules = await KategoriCuti.findAndCountAll({
      ...dataTableObj,
    });

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

    const mKategoriCuti = await KategoriCuti.findOne({
      where: {
        kode_kategoricuti: req.query.kode_kategoricuti,
      },
    });
    res.json(mKategoriCuti);
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

    const kategoriCuti = await new KategoriCuti({
      ...req.body,
    }).save();

    res.json({
      status: true,
      statusCode: 200,
      message:
        "Kategori Cuti " +
        kategoriCuti.kode_kategoricuti +
        " berhasil ditambah.",
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

    await KategoriCuti.update(
      { ...req.body },
      { where: { kode_kategoricuti: req.query.kode_kategoricuti } }
    );

    res.json({
      status: true,
      statusCode: 200,
      message:
        "Kategori Cuti " + req.query.kode_kategoricuti + " berhasil diubah.",
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

    await KategoriCuti.destroy({
      where: {
        kode_kategoricuti: req.query.kode_kategoricuti,
      },
    });
    res.send({
      status: true,
      message: req.query.kode_kategoricuti + " berhasil dihapus.",
    });
  },
  // Validation
  validate: (type) => {
    let mKategoriCuti = null;
    const ruleKodeKategoriCuti = query("kode_kategoricuti")
      .trim()
      .notEmpty()
      .custom(async (value) => {
        mKategoriCuti = await KategoriCuti.findOne({
          where: {
            kode_kategoricuti: {
              [Op.iLike]: value,
            },
          },
        });
        if (!mKategoriCuti) {
          return Promise.reject("Data tidak ditemukan!");
        }
      });
    const ruleCreateKodeKategoriCuti = body("kode_kategoricuti")
      .trim()
      .notEmpty()
      .custom(async (value) => {
        mKategoriCuti = await KategoriCuti.findOne({
          where: {
            kode_kategoricuti: {
              [Op.iLike]: value,
            },
          },
        });
        if (mKategoriCuti) {
          return Promise.reject("Data sudah ada!");
        }
      });
    const ruleKeteranganKategoriCuti = body("keterangan_kategoricuti")
      .trim()
      .notEmpty();

    switch (type) {
      case "create":
        {
          return [ruleCreateKodeKategoriCuti, ruleKeteranganKategoriCuti];
        }
        break;
      case "update":
        {
          return [ruleKodeKategoriCuti, ruleKeteranganKategoriCuti.optional()];
        }
        break;
      case "get":
        {
          return [ruleKodeKategoriCuti];
        }
        break;
      case "delete":
        {
          return [ruleKodeKategoriCuti];
        }
        break;
    }
  },
};
