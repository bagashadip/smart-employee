const _module = "arsip-lapbul-log";
const _ = require("lodash");
const { body, query, validationResult } = require("express-validator");
const Sequelize = require("sequelize");
const error = require("../../util/errors");
const datatable = require("../../util/datatable");
const { ArsipLapbulLog, Pegawai, ArsipLapbul } = require("../../models/model");

const Op = Sequelize.Op;

module.exports = {
  // List
  list: async (req, res) => {
    if (!(await req.user.hasAccess(_module, "view"))) {
      return error(res).permissionError();
    }
    const mArsipLapbulLog = await ArsipLapbulLog.findAll({
      attributes: ["id", "arsip_lapbul_id", "note", "status", "createdAt", "updatedAt", "createdBy", "updatedBy"],
    });
    res.json(mArsipLapbulLog);
  },
  // Datatable
  data: async (req, res) => {
    if (!(await req.user.hasAccess(_module, "view"))) {
      return error(res).permissionError();
    }

    var dataTableObj = await datatable(req.body);
    var count = await ArsipLapbulLog.count();
    var modules = await ArsipLapbulLog.findAndCountAll(dataTableObj);

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
    
    const mArsipLapbulLog = await ArsipLapbulLog.findOne({
      where: {
        id: req.query.id,
      },
    });
    res.json(mArsipLapbulLog);
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

    const arsipLapbulLog = await new ArsipLapbulLog({
      ...req.body,
    }).save();

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

    await ArsipLapbulLog.update(
      { ...req.body },
      { where: { id: req.query.id } }
    );

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

    await ArsipLapbulLog.destroy({
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
    let mArsipLapbulLog = null;
    const ruleIdArsipLog = query("id")
      .notEmpty()
      .custom(async (value) => {
        mArsipLapbulLog = await ArsipLapbulLog.findOne({
          where: {
            id: {
              [Op.eq]: value,
            },
          },
        });
        if (!mArsipLapbulLog) {
          return Promise.reject("Data not found!");
        }
      });
    const ruleArsipLapbul = body("arsip_lapbul_id")
      .trim()
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
          return Promise.reject("Arsip Lapbul doesn't exist!");
        }
      });

    switch (type) {
      case "create":
        {
          return [ruleArsipLapbul];
        }
        break;
      case "update":
        {
          return [ruleIdArsipLog];
        }
        break;
      case "get":
        {
          return [ruleIdArsipLog];
        }
        break;
      case "delete":
        {
          return [ruleIdArsipLog];
        }
        break;
    }
  },
};
