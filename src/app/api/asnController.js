// const _module = "banner-category";
const _ = require("lodash");
const { body, query, validationResult } = require("express-validator");
const Sequelize = require("sequelize");
const error = require("../../util/errors");
const datatable = require("../../util/datatable");
const { Asn, Divisi, Jabatan } = require("../../models/model");

const Op = Sequelize.Op;

module.exports = {
  // List
  list: async (req, res) => {
    const mAsn = await Asn.findAll({
      attributes: ["id_asn", "nip_asn", "nama_asn", "jabatan_asn"],
      include: [
        {
          model: Divisi,
          as: "divisi",
          attributes: ["kode_divisi", "nama_divisi"],
        },
        {
          model: Jabatan,
          as: "jabatan",
          attributes: ["kode_jabatan", "nama_jabatan"],
        },
      ],
    });
    res.json(mAsn);
  },
  // Datatable
  data: async (req, res) => {
    // if (!(await req.user.hasAccess(_module, "view"))) {
    //   return error(res).permissionError();
    // }

    var dataTableObj = await datatable(req.body);
    var count = await Asn.count();
    var modules = await Asn.findAndCountAll({
      ...dataTableObj,
      include: [
        {
          model: Divisi,
          as: "divisi",
          attributes: ["kode_divisi", "nama_divisi"],
        },
        {
          model: Jabatan,
          as: "jabatan",
          attributes: ["kode_jabatan", "nama_jabatan"],
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
    // if (!(await req.user.hasAccess(_module, "view"))) {
    //   return error(res).permissionError();
    // }

    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return error(res).validationError(validation.array());
    }

    const mAsn = await Asn.findOne({
      where: {
        nip_asn: req.query.nip_asn,
      },
      include: [
        {
          model: Divisi,
          as: "divisi",
          attributes: ["kode_divisi", "nama_divisi"],
        },
        {
          model: Jabatan,
          as: "jabatan",
          attributes: ["kode_jabatan", "nama_jabatan"],
        },
      ],
      attributes: ["id_asn", "nip_asn", "nama_asn", "jabatan_asn"],
    });
    res.json(mAsn);
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

    const asn = await new Asn({
      ...req.body,
    }).save();

    res.json({
      status: true,
      statusCode: 200,
      message: "ASN " + asn.nama_asn + " berhasil ditambah.",
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

    await Asn.update(
      { ...req.body },
      { where: { nip_asn: req.query.nip_asn } }
    );

    res.json({
      status: true,
      statusCode: 200,
      message: "ASN " + req.query.nip_asn + " berhasil diubah.",
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

    await Asn.destroy({
      where: {
        nip_asn: req.query.nip_asn,
      },
    });
    res.send({
      status: true,
      message: req.query.nip_asn + " berhasil dihapus.",
    });
  },
  // Validation
  validate: (type) => {
    let mAsn = null;
    const ruleNipAsn = query("nip_asn")
      .trim()
      .notEmpty()
      .custom(async (value) => {
        mAsn = await Asn.findOne({
          where: {
            nip_asn: {
              [Op.iLike]: value,
            },
          },
        });
        if (!mAsn) {
          return Promise.reject("ASN tidak ditemukan!");
        }
      });
    const ruleCreateNipAsn = body("nip_asn")
      .trim()
      .notEmpty()
      .custom(async (value) => {
        mAsn = await Asn.findOne({
          where: {
            nip_asn: {
              [Op.iLike]: value,
            },
          },
        });
        if (mAsn) {
          return Promise.reject("NIP ASN sudah ada!");
        }
      });
    const ruleNamaAsn = body("nama_asn").trim().notEmpty();

    switch (type) {
      case "create":
        {
          return [ruleCreateNipAsn, ruleNamaAsn];
        }
        break;
      case "update":
        {
          return [ruleCreateNipAsn.optional(), ruleNamaAsn.optional()];
        }
        break;
      case "get":
        {
          return [ruleNipAsn];
        }
        break;
      case "delete":
        {
          return [ruleNipAsn];
        }
        break;
    }
  },
};
