const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const Sequelize = require("sequelize");
const Token = require("./token");
const error = require("../../util/errors");
const mailer = require("../../util/mailer");
const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");

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
            "<p>Telah terdeteksi percobaan login yang gagal menggunakan akun Anda sebanyak 3x, saat ini akun Anda sedang dinonaktifkan. Jika anda merasa percobaan tersebut Bukan Anda, silahkan klik link berikut. </p><br><a href=" +
            process.env.BASE_URL +
            "/auth/reset-attempt?verify=" +
            token +
            ">Klik untuk reset percobaan login</a>",
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
      grantType: "password",
    });
    const refreshToken = new Token("refresh").generate({
      userId: loadedUser.id_user.toString(),
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
        first_login: loadedUser.first_login,
      },
      expires_in: "120",
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
  forgotPassword: async (req, res) => {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return error(res).validationError(validation.array());
    }

    const email = req.body.email;
    var secret = speakeasy.generateSecret();
    var otp = speakeasy.totp({
      secret: secret.base32,
      encoding: "base32",
      digits: 4,
      step: 60,
      window: 10,
    });

    const mPegawai = await Pegawai.findOne({
      where: {
        emailpribadi_pegawai: email,
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["username_user"],
        },
      ],
    });

    if (mPegawai) {
      await User.update(
        {
          otp_secret: secret.base32,
        },
        {
          where: {
            username_user: mPegawai.user.username_user,
          },
        }
      );
    } else {
      res.status(404).json({
        status: false,
        statusCode: 404,
        message: "User tidak ditemukan!",
      });
    }

    let data = {
      email: email,
      message:
        "<p>Berikut adalah kode OTP anda: </p><h3>" +
        otp +
        "</h3><br><br><i>Jangan beritahukan kepada pihak manapun karena ini bersifat rahasia dan hanya berlaku selama 10 Menit.</i>",
    };

    const sendMail = await mailer(data);
    if (sendMail) {
      return res.status(200).json({
        status: true,
        statusCode: 200,
        message: "Kode OTP telah dikirim ke email anda.",
      });
    }
  },
  verifyOtp: async (req, res) => {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return error(res).validationError(validation.array());
    }

    const email = req.body.email;
    const otp = req.body.otp;

    const mPegawai = await Pegawai.findOne({
      where: {
        emailpribadi_pegawai: email,
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["otp_secret"],
        },
      ],
    });

    if (mPegawai) {
      var verifyToken = speakeasy.totp.verify({
        secret: mPegawai.user.otp_secret,
        encoding: "base32",
        token: otp,
        digits: 4,
        step: 60,
        window: 10,
      });

      if (!verifyToken) {
        res.status(400).json({
          status: false,
          statusCode: 400,
          message: "Invalid OTP",
        });
      } else {
        res.status(200).json({
          status: true,
          statusCode: 200,
          otp_secret: mPegawai.user.otp_secret,
          message: "OTP has been verfied.",
        });
      }
    }
  },
  resetPassword: async (req, res) => {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return error(res).validationError(validation.array());
    }

    const otpSecret = req.body.otp_secret;
    const newPassword = req.body.new_password;

    const mUser = await User.findOne({
      where: {
        otp_secret: otpSecret,
      },
    });

    if (mUser) {
      const hashedPw = await bcrypt.hash(newPassword, 12);
      await User.update(
        {
          otp_secret: null,
          password_user: hashedPw,
        },
        {
          where: {
            otp_secret: otpSecret,
          },
        }
      );

      res.json({
        status: true,
        statusCode: 200,
        message: "Password berhasil diubah.",
      });
    }
  },
  refreshToken: async (req, res, _) => {
    const token = req.body.token;
    const verify = new Token("refresh").verify(token);
    if (verify) {
      const user = await User.findOne({
        where: {
          id_user: verify.userId
        }
      });
      if (!user) {
        return error(res).authenticationError(["User not found."]);
      }
      // Validate Role & Zone
      // const mUserRole = await UserRole.findOne({
      //   attributes: ["id", "roles"],
      //   where: {
      //     userId: user.id,
      //     zoneId: user.activeZone,
      //   },
      // });
      // const mRole = await Role.findByPk(user.activeRole);
      // if (!mRole) {
      //   return error(res).authenticationError(["Invalid Role."]);
      // }
      // if (mUserRole) {
      //   if (mUserRole.roles.indexOf(mRole.slug) == -1) {
      //     return error(res).authenticationError(["Invalid Role."]);
      //   }
      // } else {
      //   return error(res).authenticationError(["Invalid Zone."]);
      // }
      const accesToken = new Token("password").generate({
        userId: verify.userId,
        grantType: "password",
      });
      const refreshToken = new Token("refresh").generate({
        userId: verify.userId,
        grantType: "password",
      });
      res.json({
        token_type: "bearer",
        access_token: accesToken,
        refresh_token: refreshToken,
        user: {
          id: user.id_user,
          username: user.username_user,
          first_login: user.first_login
        },
        expires_in: "120",
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
          return Promise.reject("Email user tidak ditemukan!");
        }
      });
    const ruleOtp = body("otp").notEmpty().isNumeric();
    const ruleOtpSecret = body("otp_secret")
      .notEmpty()
      .custom(async (value) => {
        const mUser = await User.findOne({
          where: {
            otp_secret: value,
          },
        });
        if (!mUser) {
          return Promise.reject("Invalid otp secret!");
        }
      });
    const ruleNewPassword = body("new_password").notEmpty();
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
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{6,}$/
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
      case "forgotUsername":
        {
          return [ruleEmail];
        }
        break;
      case "forgotPassword":
        {
          return [ruleEmail];
        }
        break;
      case "verifyOtp":
        {
          return [ruleEmail, ruleOtp];
        }
        break;
      case "resetPassword":
        {
          return [ruleOtpSecret, ruleNewPassword];
        }
        break;
    }
  },
};
