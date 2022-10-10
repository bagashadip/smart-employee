const _module = "action";
const _ = require("lodash");
const { body, query, validationResult } = require("express-validator");
const Sequelize = require("sequelize");
const error = require("../../util/errors");
const datatable = require("../../util/datatable");
const { Action } = require("../../models/model");

module.exports = {
  // List
  list: async (req, res) => {
    if (!(await req.user.hasAccess(_module, "view"))) {
      return error(res).permissionError();
    }
    console.log("TEST");
    const mAction = await Action.findAll({
      attributes: ["id", "slug", "name"],
    });
    res.json(mAction);
  },
  // Datatable
  data: async (req, res) => {
    if (!(await req.user.hasAccess(_module, "view"))) {
      return error(res).permissionError();
    }

    var dataTableObj = await datatable(req.body);
    var count = await Action.count();
    var actions = await Action.findAndCountAll(dataTableObj);

    res.json({
      recordsFiltered: actions.count,
      recordsTotal: count,
      items: actions.rows,
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

    const mAction = await Action.findByPk(req.query.id);
    res.json(mAction);
  },
  // Create
  create: async (req, res) => {
    console.log("TESTTT", await req.user.hasAccess(_module, "create"));
    if (!(await req.user.hasAccess(_module, "create"))) {
      return error(res).permissionError();
    }

    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return error(res).validationError(validation.array());
    }

    const action = await new Action({
      ...req.body,
      createdBy: req.user.id,
    }).save();

    res.json({ status: true, id: action.id });
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

    await Action.update(
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

    await Action.destroy({
      where: {
        id: req.query.id,
      },
    });
    res.send({ status: true });
  },
  // Validation
  validate: (type) => {
    let mAction = null;
    const ruleId = query("id")
      .trim()
      .notEmpty()
      .isUUID()
      .custom(async (value) => {
        mAction = await Action.findByPk(value);
        if (!mAction) {
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
              return Action.findOne({
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
              const slugExists = await Action.findOne({
                where: {
                  slug: {
                    [Sequelize.Op.iLike]: value,
                  },
                  id: {
                    [Sequelize.Op.ne]: mAction.id,
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
