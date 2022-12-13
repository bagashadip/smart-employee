const _module = "unit-kerja";
const _ = require("lodash");
const { body, query, validationResult } = require("express-validator");
const Sequelize = require("sequelize");
const error = require("../../util/errors");
const datatable = require("../../util/datatable");
const { UnitKerja, Organisasi, File } = require("../../models/model");

const Op = Sequelize.Op;

module.exports = {
  // List
  list: async (req, res) => {
    if (!(await req.user.hasAccess(_module, "view"))) {
      return error(res).permissionError();
    }

    const mUnitKerja = await UnitKerja.findAll({
      include: [
        {
          model: File,
          as: "logo",
          attributes: ["name", "path", "size", "extension"],
        },
      ],
    });
    res.json(mUnitKerja);
  },
  // Datatable
  data: async (req, res) => {
    if (!(await req.user.hasAccess(_module, "view"))) {
      return error(res).permissionError();
    }

    var dataTableObj = await datatable(req.body);
    var count = await UnitKerja.count();
    var modules = await UnitKerja.findAndCountAll({
      ...dataTableObj,
      include: [
        {
          model: Organisasi,
          as: "organisasi",
          attributes: [
            "nama_organisasi",
            "logo_organisasi",
            "longitude_organisasi",
            "latitude_organisasi",
            "radiuslokasi_organisasi",
            "alamat_organisasi",
            "notelp_organisasi",
          ],
          include: [
            {
              model: File,
              as: "logo",
              attributes: ["name", "path", "size", "extension"],
            },
          ],
        },
        {
          model: File,
          as: "logo",
          attributes: ["name", "path", "size", "extension"],
        },
      ],
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

    const mUnitKerja = await UnitKerja.findOne({
      where: {
        kode_unitkerja: req.query.kode_unitkerja,
      },
      include: [
        {
          model: File,
          as: "logo",
          attributes: ["name", "path", "size", "extension"],
        },
      ],
    });
    res.json(mUnitKerja);
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

    const unitkerja = await new UnitKerja({
      ...req.body,
    }).save();

    res.json({
      status: true,
      statusCode: 200,
      message: "Unit Kerja " + unitkerja.kode_unitkerja + " berhasil ditambah.",
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

    await UnitKerja.update(
      { ...req.body },
      { where: { kode_unitkerja: req.query.kode_unitkerja } }
    );

    res.json({
      status: true,
      statusCode: 200,
      message: "Unit Kerja " + req.query.kode_unitkerja + " berhasil diubah.",
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

    await UnitKerja.destroy({
      where: {
        kode_unitkerja: req.query.kode_unitkerja,
      },
    });
    res.send({
      status: true,
      message: req.query.kode_unitkerja + " berhasil dihapus.",
    });
  },
  // Validation
  validate: (type) => {
    let mUnitKerja = null;
    const ruleKodeUnitKerja = query("kode_unitkerja")
      .trim()
      .notEmpty()
      .custom(async (value) => {
        mUnitKerja = await UnitKerja.findOne({
          where: {
            kode_unitkerja: {
              [Op.iLike]: value,
            },
          },
        });
        if (!mUnitKerja) {
          return Promise.reject("Data tidak ditemukan!");
        }
      });
    const ruleCreateKodeUnitkerja = body("kode_unitkerja")
      .trim()
      .notEmpty()
      .custom(async (value) => {
        mUnitKerja = await UnitKerja.findOne({
          where: {
            kode_unitkerja: {
              [Op.iLike]: value,
            },
          },
        });
        if (mUnitKerja) {
          return Promise.reject("Data sudah ada!");
        }
      });
    const ruleNama = body("nama_unitkerja").trim().notEmpty();
    const ruleLogo = body("logo_unitkerja")
      .trim()
      .optional()
      .custom(async (value) => {
        if (value) {
          mFile = await File.findByPk(value);
          if (!mFile) {
            return Promise.reject("Logo tidak ditemukan!");
          }
        }
      });
    const ruleLongitude = body("longitude_unitkerja").trim();
    const ruleLatitude = body("latitude_unitkerja").trim();
    const ruleRadiusLokasi = body("radiuslokasi_unitkerja").isNumeric();
    const ruleAlamat = body("alamat_unitkerja").trim();
    const ruleNoTelp = body("notelp_unitkerja").trim();

    switch (type) {
      case "create":
        {
          return [
            ruleCreateKodeUnitkerja,
            ruleNama,
            ruleLogo,
            ruleLongitude,
            ruleLatitude,
            ruleRadiusLokasi,
            ruleAlamat,
            ruleNoTelp,
          ];
        }
        break;
      case "update":
        {
          return [
            ruleKodeUnitKerja,
            ruleNama.optional(),
            ruleLogo.optional(),
            ruleLongitude.optional(),
            ruleLatitude.optional(),
            ruleRadiusLokasi.optional(),
            ruleAlamat.optional(),
            ruleNoTelp.optional(),
          ];
        }
        break;
      case "get":
        {
          return [ruleKodeUnitKerja];
        }
        break;
      case "delete":
        {
          return [ruleKodeUnitKerja];
        }
        break;
    }
  },
};
