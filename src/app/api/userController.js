const _module = "user";
const _ = require("lodash");
const { body, query, validationResult } = require("express-validator");
const Sequelize = require("sequelize");
const error = require("../../util/errors");
const datatable = require("../../util/datatable");
const {
  User,
  Pegawai,
  Role,
  Permission,
  HakAkses,
  Asn
} = require("../../models/model");
const bcrypt = require("bcryptjs");
const generator = require("generate-password");
const mailer = require("../../util/mailer");

const Op = Sequelize.Op;

module.exports = {
  // List
  list: async (req, res) => {
    if (!(await req.user.hasAccess(_module, "view"))) {
      return error(res).permissionError();
    }

    const mUser = await User.findAll();
    res.json(mUser);
  },
  // Datatable
  data: async (req, res) => {
    if (!(await req.user.hasAccess(_module, "view"))) {
      return error(res).permissionError();
    }

    var dataTableObj = await datatable(req.body);
    var count = await User.count();
    var modules = await User.findAndCountAll({
      ...dataTableObj,
      include: [
        {
          model: Pegawai,
          as: "pegawai",
          attributes: ["emailpribadi_pegawai"],
        },
      ],
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

    const mUser = await User.findOne({
      where: {
        username_user: req.query.username_user,
      },
    });
    res.json(mUser);
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
    if (!(await req.user.hasAccess(_module, "update"))) {
      return error(res).permissionError();
    }

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
    if (!(await req.user.hasAccess(_module, "delete"))) {
      return error(res).permissionError();
    }

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
  changePassword: async (req, res) => {
    if (!(await req.user.hasAccess(_module, "change-password"))) {
      return error(res).permissionError();
    }

    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return error(res).validationError(validation.array());
    }

    const username = req.body.username;
    const oldPassword = req.body.old_password;
    const newPassword = req.body.new_password;

    const mUser = await User.findOne({
      where: {
        username_user: username,
      },
    });

    if (mUser) {
      const isEqual = await bcrypt.compare(oldPassword, mUser.password_user);
      if (!isEqual) {
        res.json({
          statusCode: 404,
          message: "Password lama tidak sesuai!",
        });
      } else {
        const hashedPw = await bcrypt.hash(newPassword, 12);
        if (oldPassword === newPassword) {
          res.json({
            statusCode: 422,
            message: "Password tidak boleh sama!",
          });
        } else {
          await User.update(
            {
              password_user: hashedPw,
            },
            {
              where: {
                username_user: username,
              },
            }
          );

          res.json({
            statusCode: 200,
            message: "Password berhasil diubah.",
          });
        }
      }
    }
  },
  permission: async (req, res) => {
    const mUser = await User.findByPk(req.user.id_user, {
      attributes: ["kode_role"],
    });

    let mHakAkses = await HakAkses.findAll({
      attributes: ["kode_hakakses"],
      include: [
        {
          model: Permission,
          as: "permission",
          attributes: ["kode_hakakses"],
          where: {
            kode_role: mUser.kode_role,
          },
          required: false,
        },
      ],
    });
    let tempRes = JSON.parse(JSON.stringify(mHakAkses));
    let resData = null;
    resData = tempRes.map((val) => ({
      kode_hakakses: val.kode_hakakses,
      status: val.permission !== null ? true : false,
    }));
    res.send(resData);
  },
  sendCredential: async (req, res) => {
    if (!(await req.user.hasAccess(_module, "create"))) {
      return error(res).permissionError();
    }

    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return error(res).validationError(validation.array());
    }

    let generatePass = generator.generate({
      length: 10,
      numbers: true,
      symbols: true,
      excludeSimilarCharacters: true,
      strict: true,
      exclude: '$%^()?.,*-_=+~`<>/{}[]:;"',
    });

    try {
      const hashedPw = await bcrypt.hash(generatePass, 12);
      const mUser = await Pegawai.findOne({
        where: {
          emailpribadi_pegawai: req.body.email,
        },
        attributes: ["kode_pegawai"],
        include: [
          {
            model: User,
            as: "user",
            attributes: ["username_user"],
          },
        ],
      });

      await User.update(
        {
          password_user: hashedPw,
          first_login: true,
        },
        {
          where: {
            username_user: mUser.user.username_user,
          },
        }
      );

      let data = {
        email: req.body.email,
        message:
          "<p>Dear rekan Jakarta Smart City,</p><br><p>Berikut informasi user akses anda di aplikasi Smart Employee</p><p>username: <b>" +
          mUser.user.username_user +
          "</b></p><p>password: <b>" +
          generatePass +
          "</b></p><p>Silahkan login dan atur ulang password baru anda di aplikasi.</p><br><br/>" +
          "<p>Aplikasi bisa diunduh melalui Play Store dan App Store dengan link berikut:</p><br/>"+
          "<p>Play Store (Android):</p><br/>"+
          "https://play.google.com/store/apps/details?id=id.go.jakarta.smartcity.kepegawaian<br/><br/>"+
          "<p>App Store (iOS): </p><br/>"+
          "https://apps.apple.com/id/app/smartemployee/id1629810566<br/><br/>"+
          "<p>Terimakasih</p>",
      };

      const sendMail = await mailer(data);
      if (sendMail) {
        res.json({
          status: "success",
          message: "Credential berhasil dikirim ke email.",
        });
      }
    } catch (err) {
      res.status(422).send(err);
    }
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
      .optional({ nullable: true })
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
    const ruleNipAsn = body("nip_asn")
    .trim()
    .optional({ nullable: true })
    .custom(async (value) => {
      if (value) {
        mAsn = await Asn.findOne({
          where: {
            nip_asn: value,
          },
        });
        if (!mAsn) {
          return Promise.reject("NIP ASN tidak ditemukan!");
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
    const ruleUsernameChangePass = body("username")
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
    const ruleNewPass = body("new_password")
      .notEmpty()
      .trim()
      .isLength({ min: 6 })
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{6,}$/
      )
      .withMessage(
        "Password should have minimum six characters, at least one letter, one number and one special character"
      );
    const ruleFindEmail = body("email")
      .isEmail()
      .notEmpty()
      .custom(async (value) => {
        const mPegawai = await Pegawai.findOne({
          where: {
            emailpribadi_pegawai: value,
          },
        });
        if (!mPegawai) {
          return Promise.reject("Email tidak ditemukan!");
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
            ruleNipAsn,
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
            ruleNipAsn.optional(),
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
      case "changePassword":
        {
          return [ruleUsernameChangePass, ruleNewPass];
        }
        break;
      case "sendCredential":
        {
          return [ruleFindEmail];
        }
        break;
    }
  },
};
