const _module = "arsip-lapbul";
const _ = require("lodash");
const { body, query, validationResult } = require("express-validator");
const Sequelize = require("sequelize");
const error = require("../../util/errors");
const datatable = require("../../util/datatable");
const { ArsipLapbul, Pegawai, ArsipLapbulLog, File } = require("../../models/model");

const Op = Sequelize.Op;

module.exports = {
  // List
  list: async (req, res) => {
    if (!(await req.user.hasAccess(_module, "view"))) {
      return error(res).permissionError();
    }
    const mArsipLapbul = await ArsipLapbul.findAll({
      attributes: ["id", "kode_pegawai", "name","period", "file", "status", "createdBy", "updatedBy", "createdAt", "updatedAt"],
      include: [
        {
          model: File,
          as: "lapbul_file",
          attributes: ["name", "path", "extension", "size"],
        },
      ]
    });
    res.json(mArsipLapbul);
  },
  // Datatable
  data: async (req, res) => {
    if (!(await req.user.hasAccess(_module, "view"))) {
      return error(res).permissionError();
    }

    var dataTableObj = await datatable(req.body);
    var count = await ArsipLapbul.count();
    var modules = await ArsipLapbul.findAndCountAll({
      ...dataTableObj,
      include: [
        {
          model: File,
          as: "lapbul_file",
          attributes: ["name", "path", "extension", "size"],
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

    const mArsipLapbul = await ArsipLapbul.findOne({
      where: {
        id: req.query.id,
      },
      include: [
        {
          model: File,
          as: "lapbul_file",
          attributes: ["name", "path", "extension", "size"],
        },
      ]
    });
    res.json(mArsipLapbul);
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

    const arsipLapbul = await new ArsipLapbul({
      ...req.body,
      createdBy: req.user.id_user,
    }).save();

    if (arsipLapbul) {
      await new ArsipLapbulLog({
        arsip_lapbul_id: arsipLapbul.id,
        note: req.body.note,
        status: req.body.status,
        createdBy: req.user.id_user,
    }).save();
    }

    res.json({
      status: true,
      statusCode: 200,
      message: "Data berhasil ditambah.",
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

    const update = await ArsipLapbul.update(
      { ...req.body, updatedBy: req.user.id_user, },
      { where: { id: req.query.id } }
    );

    if (update) {
        await new ArsipLapbulLog({
            arsip_lapbul_id: req.query.id,
            note: req.body.note,
            status: req.body.status,
            updatedBy: req.user.id_user,
        }).save();
    }

    res.json({
      status: true,
      statusCode: 200,
      message: "Data berhasil diubah.",
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

    await ArsipLapbul.destroy({
      where: {
        id: req.query.id,
      },
    });
    res.send({
      status: true,
      message: req.query.id + " berhasil dihapus.",
    });
  },
  // Validation
  validate: (type) => {
    let mArsipLapbul = null;
    const ruleIdArsip = query("id")
      .notEmpty()
      .custom(async (value) => {
        mArsipLapbul = await ArsipLapbul.findOne({
          where: {
            id: {
              [Op.eq]: value,
            },
          },
        });
        if (!mArsipLapbul) {
          return Promise.reject("Data not found!");
        }
      });
    const ruleKodePegawai = body("kode_pegawai")
      .trim()
      .notEmpty()
      .custom(async (value) => {
        mArsipLapbul = await Pegawai.findOne({
          where: {
            kode_pegawai: {
              [Op.iLike]: value,
            },
          },
        });
        if (!mArsipLapbul) {
          return Promise.reject("Pegawai doesn't exist!");
        }
      });
    const ruleName = body("name").trim().notEmpty();
    const rulePeriod = body("period").notEmpty();
    const ruleFile = body("file").notEmpty();
    const ruleStatus = body("status").notEmpty();

    switch (type) {
      case "create":
        {
          return [ruleKodePegawai, ruleName, rulePeriod, ruleFile, ruleStatus];
        }
        break;
      case "update":
        {
          return [ruleIdArsip, ruleName.optional(), rulePeriod.optional(), ruleFile.optional(), ruleStatus.optional()];
        }
        break;
      case "get":
        {
          return [ruleIdArsip];
        }
        break;
      case "delete":
        {
          return [ruleIdArsip];
        }
        break;
    }
  },
};
