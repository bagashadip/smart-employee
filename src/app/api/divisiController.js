const _module = "divisi";
const _ = require("lodash");
const { body, query, validationResult } = require("express-validator");
const Sequelize = require("sequelize");
const error = require("../../util/errors");
const datatable = require("../../util/datatable");
const { Divisi, UnitKerja, Pegawai, Asn, Posisi, Dpa, File } = require("../../models/model");

const Op = Sequelize.Op;

module.exports = {
  // search
  search: async (req, res) => {
    // if (!(await req.user.hasAccess(_module, "view"))) {
    //   return error(res).permissionError();
    // }
    const mDivisi = await Divisi.findAll({
      limit: 10,
      where: {
        [Op.or]: [
          {
            kode_divisi: {
              [Op.iLike]: "%" + req.query.key + "%",
            },
          },
          {
            nama_divisi: {
              [Op.iLike]: "%" + req.query.key + "%",
            },
          },
        ],
      },
      attributes: ["kode_divisi", "nama_divisi"],
    });

    res.json(mDivisi);
  },
  // List
  list: async (req, res) => {
    if (!(await req.user.hasAccess(_module, "view"))) {
      return error(res).permissionError();
    }
    const mDivisi = await Divisi.findAll({
      include: [
      {
          model: File,
          as: "template_lapbul_file",
          attributes: [
            "name",
            "path",
            "extension",
            "size"
          ],
      },
    ],
      attributes: ["id_divisi", "kode_divisi", "nama_divisi", "kode_unitkerja","kode_pegawai_manajer","nip_asn","template_lapbul"],
    });
    res.json(mDivisi);
  },
  // Datatable
  data: async (req, res) => {
    if (!(await req.user.hasAccess(_module, "view"))) {
      return error(res).permissionError();
    }

    var dataTableObj = await datatable(req.body);
    var count = await Divisi.count();
    var modules = await Divisi.findAndCountAll({
        ...dataTableObj,
        include: [
            {
                model: UnitKerja,
                as: "unitkerja",
                attributes: [
                  "kode_unitkerja",
                  "nama_unitkerja",
                  "logo_unitkerja",
                  "longitude_unitkerja",
                  "latitude_unitkerja",
                  "radiuslokasi_unitkerja",
                  "alamat_unitkerja",
                  "notelp_unitkerja",
                  "kode_organisasi"
                ],
            },
            {
              model: File,
              as: "template_lapbul_file",
              attributes: [
                "name",
                "path",
                "extension",
                "size"
              ],
          },
        ]
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

    const mDivisi = await Divisi.findOne({
      where: {
        kode_divisi: req.query.kode_divisi,
      },
      include: [
        {
          model: Pegawai,
          as: "manajer",
          attributes: ["kode_pegawai", "namalengkap_pegawai"],
          include: [
            {
              model: Posisi,
              as: "posisi",
              attributes: ["kode_posisi", "nama_posisi"],
            },
            {
              model: Dpa,
              as: "dpa",
              attributes: ["kode_dpa", "nama_dpa", "grade_dpa"],
            },
          ],
        },
        {
          model: Asn,
          as: "asn",
          attributes: [
            "nip_asn",
            "nama_asn",
            "jabatan_asn"
          ],
        },
        {
          model: File,
          as: "template_lapbul_file",
          attributes: [
            "name",
            "path",
            "extension",
            "size"
          ],
      },
      ]
    });
    res.json(mDivisi);
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

    const divisi = await new Divisi({
      ...req.body,
    }).save();

    res.json({
      status: true,
      statusCode: 200,
      message: "Divisi " + divisi.kode_divisi + " berhasil ditambah.",
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

    await Divisi.update(
      { ...req.body },
      { where: { kode_divisi: req.query.kode_divisi } }
    );

    res.json({
      status: true,
      statusCode: 200,
      message: "Divisi " + req.query.kode_divisi + " berhasil diubah.",
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

    await Divisi.destroy({
      where: {
        kode_divisi: req.query.kode_divisi,
      },
    });
    res.send({
      status: true,
      message: req.query.kode_divisi + " berhasil dihapus.",
    });
  },
  // Validation
  validate: (type) => {
    let mDivisi = null;
    const ruleKodeDivisi = query("kode_divisi")
      .trim()
      .notEmpty()
      .custom(async (value) => {
        mDivisi = await Divisi.findOne({
          where: {
            kode_divisi: {
              [Op.iLike]: value,
            },
          },
        });
        if (!mDivisi) {
          return Promise.reject("Data tidak ditemukan!");
        }
      });
    const ruleCreateKodeDivisi = body("kode_divisi")
      .trim()
      .notEmpty()
      .custom(async (value) => {
        mDivisi = await Divisi.findOne({
          where: {
            kode_divisi: {
              [Op.iLike]: value,
            },
          },
        });
        if (mDivisi) {
          return Promise.reject("Data sudah ada!");
        }
      });
    const ruleNamaDivisi = body("nama_divisi").trim().notEmpty();

    switch (type) {
      case "create":
        {
          return [ruleCreateKodeDivisi, ruleNamaDivisi];
        }
        break;
      case "update":
        {
          return [ruleKodeDivisi, ruleNamaDivisi.optional()];
        }
        break;
      case "get":
        {
          return [ruleKodeDivisi];
        }
        break;
      case "delete":
        {
          return [ruleKodeDivisi];
        }
        break;
    }
  },
};
