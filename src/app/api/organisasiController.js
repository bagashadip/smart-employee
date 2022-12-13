const _module = "organisasi";
const _ = require("lodash");
const { body, query, validationResult } = require("express-validator");
const Sequelize = require("sequelize");
const error = require("../../util/errors");
const datatable = require("../../util/datatable");
const { Organisasi, File } = require("../../models/model");

const Op = Sequelize.Op;

module.exports = {
  // List
  list: async (req, res) => {
    if (!(await req.user.hasAccess(_module, "view"))) {
      return error(res).permissionError();
    }

    const mOrganisasi = await Organisasi.findAll({
      include: {
        model: File,
        as: "logo",
        attributes: ["name", "path", "extension", "size"],
      },
    });
    res.json(mOrganisasi);
  },
  // Datatable
  data: async (req, res) => {
    if (!(await req.user.hasAccess(_module, "view"))) {
      return error(res).permissionError();
    }

    var dataTableObj = await datatable(req.body);
    var count = await Organisasi.count();
    var modules = await Organisasi.findAndCountAll({
      ...dataTableObj,
      include: {
        model: File,
        as: "logo",
        attributes: ["name", "path", "extension", "size"],
      },
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

    const mOrganisasi = await Organisasi.findOne({
      where: {
        kode_organisasi: req.query.kode_organisasi,
      },
      include: {
        model: File,
        as: "logo",
        attributes: ["name", "path", "extension", "size"],
      },
    });
    res.json(mOrganisasi);
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

    const organisasi = await new Organisasi({
      ...req.body,
    }).save();

    res.json({
      status: true,
      statusCode: 200,
      message:
        "Organisasi " + organisasi.kode_organisasi + " berhasil ditambah.",
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

    await Organisasi.update(
      { ...req.body },
      { where: { kode_organisasi: req.query.kode_organisasi } }
    );

    res.json({
      status: true,
      statusCode: 200,
      message: "Organisasi " + req.query.kode_organisasi + " berhasil diubah.",
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

    await Organisasi.destroy({
      where: {
        kode_organisasi: req.query.kode_organisasi,
      },
    });
    res.send({
      status: true,
      message: req.query.kode_organisasi + " berhasil dihapus.",
    });
  },
  // Validation
  validate: (type) => {
    let mOrganisasi = null;
    const ruleKodeOrganisasi = query("kode_organisasi")
      .trim()
      .notEmpty()
      .custom(async (value) => {
        mOrganisasi = await Organisasi.findOne({
          where: {
            kode_organisasi: {
              [Op.iLike]: value,
            },
          },
        });
        if (!mOrganisasi) {
          return Promise.reject("Data not found!");
        }
      });
    const ruleCreateKodeOrganisasi = body("kode_organisasi")
      .trim()
      .notEmpty()
      .custom(async (value) => {
        mOrganisasi = await Organisasi.findOne({
          where: {
            kode_organisasi: {
              [Op.iLike]: value,
            },
          },
        });
        if (mOrganisasi) {
          return Promise.reject("Data already exist!");
        }
      });
    const ruleNamaOrganisasi = body("nama_organisasi").trim().notEmpty();
    const ruleLogoOrganisasi = body("logo_organisasi")
      .optional()
      .custom(async (value) => {
        if (value) {
          mFile = await File.findByPk(value);
          if (!mFile) {
            return Promise.reject("File logo tidak ditemukan!");
          }
        }
      });
    const ruleLongitudeOrganisasi = body("longitude_organisasi")
      .isFloat()
      .optional();
    const ruleLatitudeOrganisasi = body("latitude_organisasi")
      .isFloat()
      .optional();
    const ruleRadiusLokasiOrganisasi = body("radiuslokasi_organisasi")
      .isNumeric()
      .optional();
    const ruleAlamatOrganisasi = body("alamat_organisasi").trim().optional();
    const ruleNoTelpOrganisasi = body("notelp_organisasi").trim().optional();

    switch (type) {
      case "create":
        {
          return [
            ruleCreateKodeOrganisasi,
            ruleNamaOrganisasi,
            ruleLogoOrganisasi,
            ruleLongitudeOrganisasi,
            ruleLatitudeOrganisasi,
            ruleRadiusLokasiOrganisasi,
            ruleAlamatOrganisasi,
            ruleNoTelpOrganisasi,
          ];
        }
        break;
      case "update":
        {
          return [
            ruleKodeOrganisasi,
            ruleNamaOrganisasi.optional(),
            ruleLogoOrganisasi.optional(),
            ruleLongitudeOrganisasi.optional(),
            ruleLatitudeOrganisasi.optional(),
            ruleRadiusLokasiOrganisasi.optional(),
            ruleAlamatOrganisasi.optional(),
            ruleNoTelpOrganisasi.optional(),
          ];
        }
        break;
      case "get":
        {
          return [ruleKodeOrganisasi];
        }
        break;
      case "delete":
        {
          return [ruleKodeOrganisasi];
        }
        break;
    }
  },
};
