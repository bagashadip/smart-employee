// const _module = "banner-category";
const _ = require("lodash");
const { body, query, validationResult } = require("express-validator");
const Sequelize = require("sequelize");
const error = require("../../util/errors");
const datatable = require("../../util/datatable");
const { User, Pegawai, Role } = require("../../models/model");
const bcrypt = require("bcryptjs");

const Op = Sequelize.Op;

module.exports = {
  // List
  list: async (req, res) => {
    const mUser = await User.findAll();
    res.json(mUser);
  },
  // Datatable
  data: async (req, res) => {
    // if (!(await req.user.hasAccess(_module, "view"))) {
    //   return error(res).permissionError();
    // }

    var dataTableObj = await datatable(req.body);
    var count = await User.count();
    var modules = await User.findAndCountAll(dataTableObj);

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

    const mUser = await User.findOne({
      where: {
        username_user: req.query.username_user,
      },
    });
    res.json(mUser);
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

    req.body.password_user = await bcrypt.hash(req.body.password_user, 12);
    const jabatan = await new User({
      ...req.body,
    }).save();

    res.json({
      status: true,
      statusCode: 200,
      message: "User " + jabatan.username_user + " berhasil ditambah.",
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

    delete req.body.username_user;
    await User.update(
      { ...req.body },
      { where: { username_user: req.query.username_user } }
    );

    res.json({
      status: true,
      statusCode: 200,
      message: "User " + req.query.username_user + " berhasil diubah.",
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

    await User.destroy({
      where: {
        username_user: req.query.username_user,
      },
    });
    res.send({
      status: true,
      message: req.query.username_user + " berhasil dihapus.",
    });
  },
  // Validation
  validate: (type) => {
    let mUser = null;
    const ruleUsername = query("username_user")
      .trim()
      .notEmpty()
      .custom(async (value) => {
        mUser = await User.findOne({
          where: {
            username_user: {
              [Op.iLike]: value,
            },
          },
        });
        if (!mUser) {
          return Promise.reject("User tidak ditemukan!");
        }
      });
    const ruleCreateUsername = body("username_user")
      .trim()
      .notEmpty()
      .custom(async (value) => {
        mUser = await User.findOne({
          where: {
            username_user: {
              [Op.iLike]: value,
            },
          },
        });
        if (mUser) {
          return Promise.reject("Username sudah ada.");
        }
      });
    const rulePassword = body("password_user")
      .notEmpty()
      .trim()
      .isLength({ min: 6 })
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{8,}$/
      )
      .withMessage(
        "Password should have minimum six characters, at least one letter, one number and one special character"
      );
    const ruleStatus = body("status_user").trim().notEmpty();
    const ruleOneSignalId = body("onesignalid_user").trim().optional();
    const ruleKodePegawai = body("kode_pegawai")
      .trim()
      .optional()
      .custom(async (value) => {
        if (value) {
          mPegawai = await Pegawai.findOne({
            where: {
              kode_pegawai: value,
            },
          });
          if (!mPegawai) {
            return Promise.reject("Kode Pegawai tidak ditemukan!");
          }
        }
      });
    const ruleRole = body("kode_role")
      .trim()
      .optional()
      .custom(async (value) => {
        if (value) {
          mRole = await Role.findOne({
            where: {
              kode_role: value,
            },
          });
          if (!mRole) {
            return Promise.reject("Role tidak ditemukan!");
          }
        }
      });

    switch (type) {
      case "create":
        {
          return [
            ruleCreateUsername,
            rulePassword,
            ruleStatus,
            ruleOneSignalId,
            ruleKodePegawai,
            ruleRole,
          ];
        }
        break;
      case "update":
        {
          return [
            ruleUsername,
            rulePassword.optional(),
            ruleStatus.optional(),
            ruleOneSignalId.optional(),
            ruleKodePegawai.optional(),
            ruleRole.optional(),
          ];
        }
        break;
      case "get":
        {
          return [ruleUsername];
        }
        break;
      case "delete":
        {
          return [ruleUsername];
        }
        break;
    }
  },
};
