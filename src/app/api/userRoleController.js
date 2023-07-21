const _module = "user";
const _ = require("lodash");
const { body, query, validationResult } = require("express-validator");
const Sequelize = require("sequelize");
const error = require("../../util/errors");
const datatable = require("../../util/datatable");
const { UserRole, User, Role } = require("../../models/model");

module.exports = {
  permission: async (req, res, next) => {
    let permission = null;
    if (req.user.activeRole) {
      const mUserRole = await UserRole.findOne({
        attributes: ["roles"],
        where: {
          userId: req.user.id_user,
        },
      });

      const currentRole = await Role.findByPk(req.user.activeRole);

      if (mUserRole && mUserRole.roles && currentRole) {
        if (mUserRole.roles.indexOf(currentRole.slug) !== -1) {
          permission = currentRole.permissions;
        }
      }
    }

    res.json(permission);
  },
  // List Auth & Role
  list: async (req, res, next) => {
    const mUserRole = await UserRole.findAll({
      attributes: ["roles"],
      where: {
        userId: req.user.id_user,
      },
    });

    // console.log("TESTTTT", mUserRole);

    const listRole = await Role.findAll({ attributes: ["id", "slug", "name"] });

    const listUserRole = [];
    _.map(mUserRole, (value) => {
      if (value.roles) {
        const objRole = [];
        _.map(value.roles, (vrole) => {
          const findRole = _.find(listRole, { slug: vrole });
          if (findRole) {
            objRole.push(findRole);
          }
        });
        value.roles = objRole;
        listUserRole.push(value);
      }
    });

    res.json(listUserRole);
  },
  // Datatable
  data: async (req, res, next) => {
    if (!(await req.user.hasAccess(_module, "view"))) {
      return error(res).permissionError();
    }

    var dataTableObj = await datatable(req.body, {
      onColumn: [
        {
          column: "userName",
          model: "user",
          field: "name",
        },
      ],
    });
    var count = await UserRole.count();

    if (req.query.userId) {
      dataTableObj.where = _.merge(dataTableObj.where, {
        userId: req.query.userId,
      });
    }

    var userRoles = await UserRole.findAndCountAll({
      ...dataTableObj,
      include: [
        {
          model: User,
          attributes: [],
        },
      ],
    });

    let listRole = await Role.findAll({
      attributes: ["slug", "name"],
    });

    userRoles.rows = _.map(userRoles.rows, ({ dataValues }) => {
      if (dataValues.roles) {
        let roleName = [];
        _.forEach(dataValues.roles, (role) => {
          const objRole = _.find(listRole, (o) => o.slug == role);
          roleName.push(objRole.name);
        });
        dataValues.rolesName = roleName;
      }

      return dataValues;
    });

    res.json({
      recordsFiltered: userRoles.count,
      recordsTotal: count,
      items: userRoles.rows,
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

    const mUserRole = await UserRole.findByPk(req.query.id);
    res.json(mUserRole);
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

    const userRole = await new UserRole({
      ...req.body,
      createdBy: req.user.id,
    }).save();

    res.json({ status: true, id: userRole.id });
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

    if(req.body.nip_asn){
      req.body.kode_pegawai = null;
    }

    if(req.body.kode_pegawai){
      req.body.nip_asn = null;
    }

    await UserRole.update(
      { ...req.body, updatedBy: req.user.id },
      { where: { id: req.query.id } }
    );

    res.send({ status: true });
  },
  // Delete
  delete: async (req, res) => {
    if (!(await req.user.hasAccess(_module, "update"))) {
      return error(res).permissionError();
    }

    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return error(res).validationError(validation.array());
    }

    await UserRole.destroy({
      where: {
        id: req.query.id,
      },
    });
    res.send({ status: true });
  },
  // Validation
  validate: (type) => {
    let mUserRole = null;
    const ruleId = query("id")
      .trim()
      .notEmpty()
      .isUUID()
      .custom(async (value) => {
        mUserRole = await UserRole.findByPk(value);
        if (!mUserRole) {
          return Promise.reject("Data not found!");
        }
      });
    const ruleUserId = body("userId")
      .trim()
      .notEmpty()
      .custom(async (value) => {
        const mUser = await User.findByPk(value);
        if (!mUser) {
          return Promise.reject("User not exists!");
        }
      });

    switch (type) {
      case "create":
        {
          return [
            ruleUserId,
          ];
        }
        break;
      case "update":
        {
          return [
            ruleId,
            ruleUserId.optional(),
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
