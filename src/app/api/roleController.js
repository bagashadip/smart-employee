const _module = "role";
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
    if (!(await req.user.hasAccess(_module, "view"))) {
      return error(res).permissionError();
    }

    const mRole = await Role.findAll({
      attributes: ["id", "slug", "name", "permissions", "createdAt", "updatedAt"],
    });
    res.json(mRole);
  },
  // Datatable
  data: async (req, res) => {
    if (!(await req.user.hasAccess(_module, "view"))) {
      return error(res).permissionError();
    }

    var dataTableObj = await datatable(req.body);
    var count = await Role.count();
    var modules = await Role.findAndCountAll({
      ...dataTableObj,
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

    const mRole = await Role.findOne({
      where: {
        slug: req.query.slug,
      },
    });
    res.json(mRole);
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

    const role = await new Role({
      ...req.body,
    }).save();

    res.json({
      status: true,
      statusCode: 200,
      message: "Role " + role.name + " berhasil ditambah.",
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

    await Role.update(
      { ...req.body },
      { where: { slug: req.query.slug } }
    );

    res.json({
      status: true,
      statusCode: 200,
      message: "Role " + req.query.slug + " berhasil diubah.",
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

    await Role.destroy({
      where: {
        slug: req.query.slug,
      },
    });
    res.send({
      status: true,
      message: req.query.slug + " berhasil dihapus.",
    });
  },
  // Validation
  validate: (type) => {
    let mRole = null;
    const ruleSlug = query("slug")
      .trim()
      .notEmpty()
      .custom(async (value) => {
        mRole = await Role.findOne({
          where: {
            slug: {
              [Op.iLike]: value,
            },
          },
        });
        if (!mRole) {
          return Promise.reject("Data tidak ditemukan!");
        }
      });
    const ruleCreateRole = body("slug")
      .trim()
      .notEmpty()
      .custom(async (value) => {
        mRole = await Role.findOne({
          where: {
            slug: {
              [Op.iLike]: value,
            },
          },
        });
        if (mRole) {
          return Promise.reject("Data sudah ada!");
        }
      });

    switch (type) {
      case "create":
        {
          return [ruleCreateRole];
        }
        break;
      case "update":
        {
          return [ruleSlug];
        }
        break;
      case "get":
        {
          return [ruleSlug];
        }
        break;
      case "delete":
        {
          return [ruleSlug];
        }
        break;
    }
  },
};
