const _module = "module";
const _ = require("lodash");
const { body, query, validationResult } = require("express-validator");
const Sequelize = require("sequelize");
const error = require("../../util/errors");
const datatable = require("../../util/datatable");
const { Module } = require("../../models/model");

module.exports = {
  // List
  list: async (req, res) => {
    const mModule = await Module.findAll({
      attributes: ["id", "slug", "name"],
    });
    res.json(mModule);
  },
  // Datatable
  data: async (req, res) => {
    if (!(await req.user.hasAccess(_module, "view"))) {
      return error(res).permissionError();
    }

    var dataTableObj = await datatable(req.body);
    var count = await Module.count();
    var modules = await Module.findAndCountAll(dataTableObj);

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

    const mModule = await Module.findByPk(req.query.id);
    res.json(mModule);
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

    const module = await new Module({
      ...req.body,
      createdBy: req.user.id,
    }).save();

    res.json({ status: true, id: module.id });
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

    await Module.update(
      { ...req.body, updatedBy: req.user.id },
      { where: { id: req.query.id } }
    );

    res.send({ status: true });
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

    await Module.destroy({
      where: {
        id: req.query.id,
      },
    });
    res.send({ status: true });
  },
  // Validation
  validate: (type) => {
    let mModule = null;
    const ruleId = query("id")
      .trim()
      .notEmpty()
      .isUUID()
      .custom(async (value) => {
        mModule = await Module.findByPk(value);
        if (!mModule) {
          return Promise.reject("Data not found!");
        }
      });
    const ruleName = body("name").trim().notEmpty();
    const ruleSlug = body("slug").trim().notEmpty().isSlug();

    switch (type) {
      case "create":
        {
          return [
            ruleSlug.custom((value) => {
              return Module.findOne({
                where: {
                  slug: {
                    [Sequelize.Op.iLike]: value,
                  },
                },
              }).then((res) => {
                if (res) {
                  return Promise.reject("Slug already exists!");
                }
              });
            }),
            ruleName,
          ];
        }
        break;
      case "update":
        {
          return [
            ruleId,
            ruleSlug.optional().custom(async (value) => {
              const slugExists = await Module.findOne({
                where: {
                  slug: {
                    [Sequelize.Op.iLike]: value,
                  },
                  id: {
                    [Sequelize.Op.ne]: mModule.id,
                  },
                },
              });
              if (slugExists) {
                return Promise.reject("Slug already exists!");
              }
            }),
            ruleName.optional(),
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
