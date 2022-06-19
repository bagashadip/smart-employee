// const _module = "banner-category";
const _ = require("lodash");
const { body, query, validationResult } = require("express-validator");
const Sequelize = require("sequelize");
const error = require("../../util/errors");
const datatable = require("../../util/datatable");
const { Role } = require("../../models/model");

const Op = Sequelize.Op;

module.exports = {
  // List
  list: async (req, res) => {
    const mRole = await Role.findAll({
      attributes: ["id_role", "kode_role", "keterangan_role"],
    });
    res.json(mRole);
  },
  // Datatable
  data: async (req, res) => {
    // if (!(await req.user.hasAccess(_module, "view"))) {
    //   return error(res).permissionError();
    // }

    var dataTableObj = await datatable(req.body);
    var count = await Role.count();
    var modules = await Role.findAndCountAll({
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

    const mRole = await Role.findOne({
        where: {
            kode_role: req.query.kode_role
        }
    });
    res.json(mRole);
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

    const role = await new Role({
      ...req.body,
    }).save();

    res.json({ 
      status: true,
      statusCode: 200, 
      message: "Role " + role.kode_role + " berhasil ditambah."
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

    await Role.update(
      { ...req.body},
      { where: { kode_role: req.query.kode_role } }
    );

    res.json({ 
      status: true ,
      statusCode: 200,
      message: "Role " + req.query.kode_role + " berhasil diubah."
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

    await Role.destroy({
      where: {
        kode_role: req.query.kode_role,
      },
    });
    res.send({ status: true, message: req.query.kode_role + 'berhasil dihapus.' });
  },
  // Validation
  validate: (type) => {
    let mRole = null;
    const ruleKodeRole = query("kode_role")
      .trim()
      .notEmpty()
      .custom(async (value) => {
        mRole = await Role.findOne({
            where: {
                kode_role: {
                    [Op.iLike]: value
                }
            }
        });
        if (!mRole) {
          return Promise.reject("Data tidak ditemukan!");
        }
      });
    const ruleCreateKodeRole = body("kode_role")
      .trim()
      .notEmpty()
      .custom(async (value) => {
        mRole = await Role.findOne({
            where: {
                kode_role: {
                    [Op.iLike]: value,
                },
            },
        });
        if (mRole) {
          return Promise.reject("Data sudah ada!");
        }
    });
    const ruleKeteranganRole = body("keterangan_role").trim().notEmpty();

    switch (type) {
      case "create":
        {
            return [
                ruleCreateKodeRole,
                ruleKeteranganRole,
            ];
        }
        break;
      case "update":
        {
            return [
              ruleKodeRole,
              ruleKeteranganRole.optional()
            ];
        }
        break;
      case "get":
        {
          return [ruleKodeRole];
        }
        break;
      case "delete":
        {
          return [ruleKodeRole];
        }
        break;
    }
  },
};
