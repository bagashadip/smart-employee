const _module = "file-category";
const _ = require("lodash");
const { body, query, validationResult } = require("express-validator");
const Sequelize = require("sequelize");
const error = require("../../util/errors");
const datatable = require("../../util/datatable");
const { FileCategory } = require("../../models/model");

module.exports = {
  // List
  list: async (req, res) => {
    const mFileCategory = await FileCategory.findAll({
      attributes: ["id", "slug", "name"],
    });
    res.json(mFileCategory);
  },
  // Datatable
  data: async (req, res) => {
    // if (!(await req.user.hasAccess(_module, "view"))) {
    //   return error(res).permissionError();
    // }

    var dataTableObj = await datatable(req.body);
    var count = await FileCategory.count();
    var fileCategories = await FileCategory.findAndCountAll(dataTableObj);

    res.json({
      recordsFiltered: fileCategories.count,
      recordsTotal: count,
      items: fileCategories.rows,
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

    const mFileCategory = await FileCategory.findByPk(req.query.id);
    res.json(mFileCategory);
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

    const fileCategory = await new FileCategory({
      ...req.body,
      createdBy: req.user.id,
    }).save();

    res.json({ status: true, id: fileCategory.id });
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

    await FileCategory.update(
      { ...req.body, updatedBy: req.user.id },
      { where: { id: req.query.id } }
    );

    res.send({ status: true });
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

    await FileCategory.destroy({
      where: {
        id: req.query.id,
      },
    });
    res.send({ status: true });
  },
  // Validation
  validate: (type) => {
    let mFileCategory = null;
    const ruleId = query("id")
      .trim()
      .notEmpty()
      .isUUID()
      .custom(async (value) => {
        mFileCategory = await FileCategory.findByPk(value);
        if (!mFileCategory) {
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
              return FileCategory.findOne({
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
              const slugExists = await FileCategory.findOne({
                where: {
                  slug: {
                    [Sequelize.Op.iLike]: value,
                  },
                  id: {
                    [Sequelize.Op.ne]: mFileCategory.id,
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
