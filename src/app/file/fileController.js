const _module = "file";
const _ = require("lodash");
const { body, query, validationResult } = require("express-validator");
const Sequelize = require("sequelize");
const error = require("../../util/errors");
const datatable = require("../../util/datatable");
const { File, FileCategory } = require("../../models/model");

module.exports = {
  // Datatable
  data: async (req, res) => {
    // if (!(await req.user.hasAccess(_module, "view"))) {
    //   return error(res).permissionError();
    // }

    var dataTableObj = await datatable(req.body, {
      onColumn: [
        {
          column: "categorySlug",
          model: "fileCategory",
          field: "slug",
        },
        {
          column: "categoryName",
          model: "fileCategory",
          field: "name",
        },
      ],
    });
    var count = await File.count();
    var files = await File.findAndCountAll({
      ...dataTableObj,
      include: [
        {
          model: FileCategory,
          attributes: [],
        },
      ],
    });

    res.json({
      recordsFiltered: files.count,
      recordsTotal: count,
      items: files.rows,
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

    const mFile = await File.findByPk(req.query.id);
    res.json(mFile);
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

    await File.destroy({
      where: {
        id: req.query.id,
      },
    });
    res.send({ status: true });
  },
  // Validation
  validate: (type) => {
    let mFile = null;
    const ruleId = query("id")
      .trim()
      .notEmpty()
      .isUUID()
      .custom(async (value) => {
        mFile = await File.findByPk(value);
        if (!mFile) {
          return Promise.reject("Data not found!");
        }
      });

    switch (type) {
      case "get":
        {
          return [ruleId];
        }
        break;
    }
  },
};
