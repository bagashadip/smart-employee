// const _module = "banner-category";
const _ = require("lodash");
const { body, query, validationResult } = require("express-validator");
const Sequelize = require("sequelize");
const error = require("../../util/errors");
const datatable = require("../../util/datatable");
const { Permission } = require("../../models/model");

const Op = Sequelize.Op;

module.exports = {
  // List
  list: async (req, res) => {
    const mPermission = await Permission.findAll({
      attributes: ["id_permission", "kode_hakakses", "kode_role"],
    });
    res.json(mPermission);
  },
  // Datatable
  data: async (req, res) => {
    // if (!(await req.user.hasAccess(_module, "view"))) {
    //   return error(res).permissionError();
    // }

    var dataTableObj = await datatable(req.body);
    var count = await Permission.count();
    var modules = await Permission.findAndCountAll(dataTableObj);
    
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

    const mPermission = await Permission.findByPk(req.query.id_permission);
    res.json(mPermission);
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

    await new Permission({
      ...req.body,
    }).save();

    res.json({ 
      status: true,
      statusCode: 200, 
      message: "Permission berhasil ditambah."
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

    await Permission.update(
      { ...req.body},
      { where: { id_permission: req.query.id_permission } }
    );

    res.json({ 
      status: true ,
      statusCode: 200,
      message: "Permission berhasil diubah."
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

    await Permission.destroy({
      where: {
        id_permission: req.query.id_permission,
      },
    });
    res.send({ status: true, message: 'permission berhasil dihapus.' });
  },
  // Validation
  validate: (type) => {
    let mPermission = null;
    const ruleId = query("id_permission")
      .notEmpty()
      .toInt()
      .custom(async (value) => {
        mPermission = await Permission.findByPk(value);
        if (!mPermission) {
          return Promise.reject("Data not found!");
        }
      });
    const ruleCreateHakakses = body("kode_hakakses").trim().notEmpty();
    const ruleCreateRole = body("kode_role").trim().notEmpty();

    switch (type) {
      case "create":
        {
            return [
                ruleCreateHakakses,
                ruleCreateRole,
            ];
        }
        break;
      case "update":
        {
            return [
                ruleId,
                ruleCreateHakakses.optional(),
                ruleCreateRole.optional()
            ];
        }
        break;
      case "get":
        {
          return [ruleId];
        }
        break;
      case "delete":
        {
          return [ruleId];
        }
        break;
    }
  },
};
