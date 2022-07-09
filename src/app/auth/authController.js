const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const Sequelize = require("sequelize");
const Token = require("./token");
const error = require("../../util/errors");
const mailer = require("../../util/mailer");
const jwt = require("jsonwebtoken");

const Op = Sequelize.Op;

const { User, Log, Pegawai, File } = require("../../models/model");
const { use } = require("../../router/router");

module.exports = {
  register: async (req, res, next) => {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return error(res).validationError(validation.array());
    }

    const username = req.body.username;
    const password = req.body.password;
    try {
      const hashedPw = await bcrypt.hash(password, 12);
      const newUser = new User({
        username_user: username,
        password_user: hashedPw,
      });
      await newUser.save();
      res.json({
        status: "sucess",
        message: "User created!",
        id: newUser.id_user,
      });
    } catch (err) {
      next(err);
    }
  },
  checkUser: async (req, res, _) => {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return error(res).validationError(validation.array());
    }

    const username = req.body.username;

    let loadedUser;

    const user = await User.findOne({
      include: [
        {
          model: Pegawai,
          as: "pegawai",
          include: [
            {
              model: File,
              as: "foto",
            },
          ],
        },
      ],
      where: {
        username_user: {
          [Op.iLike]: username,
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        message: "Username tidak ditemukan!",
      });
    }

    loadedUser = user;

    if (loadedUser.status_user !== "Aktif") {
      return res.status(401).json({
        statusCode: 401,
        message: "Status User Tidak Aktif. Silahkan hubungi Admin.",
      });
    }

    resData = {
      statusCode: 200,
      username: loadedUser.username_user,
      emailpribadi_pegawai: "",
      namalengkap_pegawai: "",
      foto_pegawai: "",
      status_user: loadedUser.status_user,
    };

    if (loadedUser.pegawai) {
      resData.emailpribadi_pegawai = loadedUser.pegawai.emailpribadi_pegawai;
      resData.namalengkap_pegawai = loadedUser.pegawai.namalengkap_pegawai;
      resData.foto_pegawai = loadedUser.pegawai.foto.path;
    }

    res.status(200).send(resData);
  },
  login: async (req, res, _) => {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return error(res).validationError(validation.array());
    }

    const username = req.body.username;
    const password = req.body.password;
    let loadedUser;

    const user = await User.findOne({
      where: {
        username_user: {
          [Op.iLike]: username,
        },
      },
      include: [
        {
          model: Pegawai,
          as: "pegawai",
          attributes: ["emailpribadi_pegawai"],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        message: "Username tidak ditemukan!",
      });
    }

    loadedUser = user;

    if (loadedUser.status_user !== "Aktif") {
      return res.status(401).json({
        statusCode: 401,
        message: "Status User Tidak Aktif. Silahkan hubungi Admin.",
      });
    }

    if (loadedUser.attempt_user > 2) {
      return res.status(401).json({
        statusCode: 401,
        message: "Input password salah 3 kali. User dinonaktifkan.",
      });
    }

    const isEqual = await bcrypt.compare(password, user.password_user);
    if (!isEqual) {
      await User.update(
        {
          attempt_user: user.attempt_user + 1,
        },
        {
          where: {
            username_user: username,
          },
        }
      );

      if (user.attempt_user + 1 > 2) {
        const token = jwt.sign(
          {
            id_user: loadedUser.id_user,
          },
          process.env.JWT_SECRET
        );

        await User.update(
          {
            status_user: "Non Aktif",
          },
          {
            where: {
              username_user: username,
            },
          }
        );

        let data = {
          email: loadedUser.pegawai.emailpribadi_pegawai,
          message:
            "<a href=" +
            process.env.BASE_URL +
            "/auth/reset-attempt?verify=" +
            token +
            ">Click to reset attempt login</a>",
        };

        const sendMail = await mailer(data);
        if (sendMail) {
          return res.status(401).json({
            statusCode: 401,
            message: "Input password salah 3 kali. User dinonaktifkan.",
          });
        }
      }

      const addLog = new Log({
        aktivitas_log: "Password anda salah!",
        ipaddress_log: req.socket.remoteAddress,
        username_user: loadedUser.username_user,
      });

      await addLog.save();

      return res.status(401).json({
        statusCode: 401,
        message:
          "Password anda salah! Silahkan ulangi. Attempt " +
          (loadedUser.attempt_user + 1) +
          " of 3",
      });
    }

    const accesToken = new Token("password").generate({
      userId: loadedUser.id_user.toString(),
      scope: req.body.scope,
      grantType: "password",
    });
    const refreshToken = new Token("refresh").generate({
      userId: loadedUser.id_user.toString(),
      scope: req.body.scope,
      grantType: "password",
    });

    await User.update(
      {
        token_user: accesToken,
        lastlogin_user: new Date(),
        attempt_user: 0,
      },
      {
        where: {
          username_user: username,
        },
      }
    );

    res.json({
      token_type: "bearer",
      access_token: accesToken,
      refresh_token: refreshToken,
      user: {
        id: loadedUser.id_user,
        username: loadedUser.username_user,
      },
      expires_in: process.env.JWT_EXPIRES_IN,
    });
  },
  changePassword: async (req, res, _) => {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return error(res).validationError(validation.array());
    }

    const username = req.body.username;
    const oldPassword = req.body.old_password;
    const newPassword = req.body.new_password;

    const mUser = await User.findOne({
      where: {
        username_user: req.body.username,
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
  forgotUsername: async (req, res) => {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return error(res).validationError(validation.array());
    }

    const email = req.body.email;

    const mPegawai = await Pegawai.findOne({
      where: {
        emailpribadi_pegawai: email,
      },
      include: [
        {
          as: "user",
          model: User,
          attributes: ["username_user"],
        },
      ],
    });

    let data = {
      email: email,
      username: mPegawai.user.username_user,
      message:
        "<p>Username anda: <b>" +
        mPegawai.user.username_user +
        "</b></p><br><br>",
    };

    const sendMail = await mailer(data);
    res.send(sendMail);
  },
  resetAttempt: async (req, res) => {
    const token = req.query.verify;
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    if (verify) {
      const update = await User.update(
        {
          status_user: "Aktif",
          attempt_user: 0,
        },
        {
          where: {
            id_user: verify.id_user,
          },
        }
      );
      if (update) {
        res.send("Attempt user has been reset.");
      } else {
        response.status(400).send(new Error(update));
      }
    } else {
      res.send("Token was invalid");
    }
  },
  refreshToken: async (req, res, _) => {
    const token = req.body.token;
    const verify = new Token("refresh").verify(token);

    if (verify) {
      const user = await User.findByPk(verify.userId);
      if (!user) {
        return error(res).authenticationError(["User not found."]);
      }
      // Validate Role & Zone
      const mUserRole = await UserRole.findOne({
        attributes: ["id", "roles"],
        where: {
          userId: user.id,
          zoneId: user.activeZone,
        },
      });
      const mRole = await Role.findByPk(user.activeRole);
      if (!mRole) {
        return error(res).authenticationError(["Invalid Role."]);
      }
      if (mUserRole) {
        if (mUserRole.roles.indexOf(mRole.slug) == -1) {
          return error(res).authenticationError(["Invalid Role."]);
        }
      } else {
        return error(res).authenticationError(["Invalid Zone."]);
      }

      const accesToken = new Token("password").generate({
        userId: verify.userId,
        scope: verify.scope,
        grantType: "password",
      });
      const refreshToken = new Token("refresh").generate({
        userId: verify.userId,
        scope: verify.scope,
        grantType: "password",
      });
      res.json({
        token_type: "bearer",
        access_token: accesToken,
        refresh_token: refreshToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          activeZone: user.activeZone,
          activeRole: user.activeRole,
        },
        expires_in: process.env.JWT_EXPIRES_IN,
      });
    } else {
      return error(res).authenticationError(["Invalid token."]);
    }
  },
  validate: (type) => {
    const ruleUsername = body("username")
      .notEmpty()
      .trim()
      .custom(async (value) => {
        const mUser = await User.findOne({
          where: {
            username_user: value,
          },
        });
        if (!mUser) {
          return Promise.reject("Username tidak ditemukan!");
        }
      });
    const ruleNewPass = body("new_password")
      .notEmpty()
      .trim()
      .isLength({ min: 6 })
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{8,}$/
      )
      .withMessage(
        "Password should have minimum six characters, at least one letter, one number and one special character"
      );
    const ruleEmail = body("email")
      .notEmpty()
      .trim()
      .isEmail()
      .custom(async (value) => {
        const mPegawai = await Pegawai.findOne({
          where: {
            emailpribadi_pegawai: value,
          },
        });
        if (!mPegawai) {
          return Promise.reject("Email pegawai tidak ditemukan!");
        }
      });
    switch (type) {
      case "checkUser":
        {
          return [
            body("username")
              .notEmpty()
              .withMessage("Mohon masukkan username anda dengan benar."),
          ];
        }
        break;
      case "login":
        {
          return [
            body("username")
              .notEmpty()
              .withMessage("Mohon masukkan Username anda dengan benar."),
            body("password")
              .notEmpty()
              .trim()
              .withMessage("Password tidak boleh kosong."),
          ];
        }
        break;
      case "register":
        {
          return [
            body("username")
              .customSanitizer((value) => {
                return value ? value.toLowerCase() : null;
              })
              .notEmpty()
              .custom((value, { req }) => {
                return User.findOne({
                  where: {
                    username_user: {
                      [Op.iLike]: value,
                    },
                  },
                }).then((userDoc) => {
                  if (userDoc) {
                    return Promise.reject("Username already exists!");
                  }
                });
              }),
            body("password")
              .notEmpty()
              .trim()
              .isLength({ min: 6 })
              .matches(
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{8,}$/
              )
              .withMessage(
                "Password should have minimum six characters, at least one letter, one number and one special character"
              ),
          ];
        }
        break;
      case "changePassword":
        {
          return [ruleUsername, ruleNewPass];
        }
        break;
      case "forgotUsername": {
        return [ruleEmail];
      }
    }
  },
};
