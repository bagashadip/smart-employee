const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const Sequelize = require("sequelize");
const Token = require("./token");
const error = require("../../util/errors");
const mailer = require("../../util/mailer");
const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");

const Op = Sequelize.Op;

const {
  User,
  Log,
  Pegawai,
  File,
  Role,
  UserRole,
} = require("../../models/model");
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
  checkUserEmail: async (req, res, _) => {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return error(res).validationError(validation.array());
    }

    const username = req.body.emailpribadi_pegawai;
    let loadedUser;

    //Get pegawai by email
    const pegawaiFind = await Pegawai.findOne({
      where: {
        emailpribadi_pegawai: username
      },
    });

    if(pegawaiFind)
    {
      //Get user by kode pegawai
      const userFind = await User.findOne({
        where: {
          kode_pegawai: pegawaiFind.kode_pegawai
        },
      });

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
          kode_pegawai: pegawaiFind.kode_pegawai
        },
      });

      if (!user) {
        return res.status(404).json({
          statusCode: 404,
          message: "User tidak ditemukan!",
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

    }

    if (!pegawaiFind) {
      return res.status(404).json({
        statusCode: 404,
        message: "Email tidak ditemukan!",
      });
    }

  },
  login: async (req, res, _) => {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return error(res).validationError(validation.array());
    }

    let username = req.body.username;
    username = username.toLowerCase()
    username = username.trim()
    const password = req.body.password;
    let loadedUser;
    let activeRole;

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
          attributes: ["emailpribadi_pegawai", "kode_pegawai"],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        message: "Username tidak ditemukan!",
      });
    }
    activeRole = user.activeRole;
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
            "<p>Telah terdeteksi percobaan login yang gagal menggunakan akun Anda sebanyak 3x, saat ini akun Anda sedang dinonaktifkan. </p><br><a href=" +
            process.env.BASE_URL +
            "/auth/reset-attempt?verify=" +
            token +
            ">Klik untuk reset percobaan login</a> <br/><br/> <p>Jika Anda lupa password, pilih opsi Lupa Password pada aplikasi SmartEmployee setelah melakukan reset percobaan login ini. </p>",
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

    const userRole = await UserRole.findOne({
      where: { userId: user.id_user },
    });

    if (!userRole) {
      return error(res).authenticationError(["You don't have privileges."]);
    }

    if (!user.activeRole) {
      // Set Default Role
      if (!user.activeRole) {
        if (userRole.roles && userRole.roles.length > 0) {
          const mRole = await Role.findOne({
            where: {
              slug: userRole.roles[0],
            },
          });

          if (mRole) {
            await User.update(
              { activeRole: mRole.id },
              { where: { id_user: user.id_user } }
            );
            activeRole = mRole.id;
            to = mRole.defaultRoute;
          } else {
            return error(res).authenticationError([
              "You don't have privileges.",
            ]);
          }
        } else {
          return error(res).authenticationError(["You don't have privileges."]);
        }
      }
    } else {
      // Validate Zone & Role

      const mUserRole = await UserRole.findOne({
        attributes: ["id", "roles"],
        where: {
          userId: user.id_user,
        },
      });

      if (mUserRole) {
        const mRole = await Role.findByPk(user.activeRole);
        to = mRole.defaultRoute;
        if (mRole) {
          // Zone is Exists, check is role exists?
          if (mUserRole.roles && mUserRole.roles.length > 0) {
            if (mUserRole.roles.indexOf(mRole.slug) == -1) {
              const mDefaultRole = await Role.findOne({
                where: {
                  slug: mUserRole.roles[0],
                },
              });
              // Set Default Role
              if (mDefaultRole) {
                await User.update(
                  { activeRole: mDefaultRole.id },
                  { where: { id_user: user.id_user } }
                );
                activeRole = mDefaultRole.id;
                to = mDefaultRole.defaultRoute;
              } else {
                return error(res).authenticationError(["Unknown Role."]);
              }
            }
          } else {
            return error(res).authenticationError([
              "You don't have role privileges.",
            ]);
          }
        } else {
          return error(res).authenticationError(["Unknown Role."]);
        }
      } else {
        if (userRole.roles && userRole.roles.length > 0) {
          const mRole = await Role.findOne({
            where: {
              slug: userRole.roles[0],
            },
          });
          if (mRole) {
            // Set To Default Zone
            await User.update(
              { activeRole: mRole.id },
              { where: { id_user: user.id } }
            );
            activeRole = mRole.id;
            to = mRole.defaultRoute;
          } else {
            return error(res).authenticationError(["Unknown Role."]);
          }
        } else {
          return error(res).authenticationError([
            "You don't have role privileges.",
          ]);
        }
      }
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

    var resJson = {
      token_type: "bearer",
      access_token: accesToken,
      refresh_token: refreshToken,
      user: {
        id: loadedUser.id_user,
        username: loadedUser.username_user,
        first_login: loadedUser.first_login,
        activeRole: activeRole,
        roles: userRole.roles,
      },
      expires_in: process.env.JWT_EXPIRES_IN,
    };

    if (loadedUser.pegawai != undefined) {
      resJson.user.kode_pegawai = loadedUser.pegawai.kode_pegawai;
    }

    res.json(resJson);
  },
  loginByEmail  : async (req, res, _) => {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return error(res).validationError(validation.array());
    }

    let username=req.body.username
    username = username.toLowerCase()
    username = username.trim()
    let loginType= "username"

    if(username.includes("@"))
    {
      loginType="email"
    }

    const password = req.body.password;
    let loadedUser;
    let kodePegawai, userWhere;
    let activeRole;

    if(loginType=="email"){
      //Get pegawai by email
      const pegawaiFind = await Pegawai.findOne({
        where: {
          emailpribadi_pegawai: username
        },
      });

      if(pegawaiFind) {
        kodePegawai = pegawaiFind.kode_pegawai
      }

      if (!pegawaiFind) {
        return res.status(404).json({
          statusCode: 404,
          message: "Email tidak ditemukan!",
        });
      }

      userWhere = {
        kode_pegawai: pegawaiFind.kode_pegawai,
      }

    }else{
      kodePegawai = ""
      userWhere = {
        username_user: {
          [Op.iLike]: username,
        },
      }
    }

    const user = await User.findOne({
      where: userWhere,
      include: [
        {
          model: Pegawai,
          as: "pegawai",
          attributes: ["emailpribadi_pegawai","kode_pegawai"],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        message: "Username tidak ditemukan!",
      });
    }

    activeRole = user.activeRole;
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
            username_user: loadedUser.username_user,
          }
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
              username_user: loadedUser.username_user,
            },
          }
        );

        let data = {
          email: loadedUser.pegawai.emailpribadi_pegawai,
          message:
            "<p>Telah terdeteksi percobaan login yang gagal menggunakan akun Anda sebanyak 3x, saat ini akun Anda sedang dinonaktifkan. </p><br><a href=" +
            process.env.BASE_URL +
            "/auth/reset-attempt?verify=" +
            token +
            ">Klik untuk reset percobaan login</a><br/><br/><p>Jika Anda lupa password, pilih opsi Lupa Password pada aplikasi SmartEmployee setelah melakukan reset percobaan login ini. </p>",
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

    const userRole = await UserRole.findOne({
      where: { userId: user.id_user },
    });

    if (!userRole) {
      return error(res).authenticationError(["You don't have privileges."]);
    }

    if (!user.activeRole) {
      // Set Default Role
      if (!user.activeRole) {
        if (userRole.roles && userRole.roles.length > 0) {
          const mRole = await Role.findOne({
            where: {
              slug: userRole.roles[0],
            },
          });

          if (mRole) {
            await User.update(
              { activeRole: mRole.id },
              { where: { id_user: user.id_user } }
            );
            activeRole = mRole.id;
            to = mRole.defaultRoute;
          } else {
            return error(res).authenticationError([
              "You don't have privileges.",
            ]);
          }
        } else {
          return error(res).authenticationError(["You don't have privileges."]);
        }
      }
    } else {
      // Validate Zone & Role

      const mUserRole = await UserRole.findOne({
        attributes: ["id", "roles"],
        where: {
          userId: user.id_user,
        },
      });

      if (mUserRole) {
        const mRole = await Role.findByPk(user.activeRole);
        to = mRole.defaultRoute;
        if (mRole) {
          // Zone is Exists, check is role exists?
          if (mUserRole.roles && mUserRole.roles.length > 0) {
            if (mUserRole.roles.indexOf(mRole.slug) == -1) {
              const mDefaultRole = await Role.findOne({
                where: {
                  slug: mUserRole.roles[0],
                },
              });
              // Set Default Role
              if (mDefaultRole) {
                await User.update(
                  { activeRole: mDefaultRole.id },
                  { where: { id_user: user.id_user } }
                );
                activeRole = mDefaultRole.id;
                to = mDefaultRole.defaultRoute;
              } else {
                return error(res).authenticationError(["Unknown Role."]);
              }
            }
          } else {
            return error(res).authenticationError([
              "You don't have role privileges.",
            ]);
          }
        } else {
          return error(res).authenticationError(["Unknown Role."]);
        }
      } else {
        if (userRole.roles && userRole.roles.length > 0) {
          const mRole = await Role.findOne({
            where: {
              slug: userRole.roles[0],
            },
          });
          if (mRole) {
            // Set To Default Zone
            await User.update(
              { activeRole: mRole.id },
              { where: { id_user: user.id } }
            );
            activeRole = mRole.id;
            to = mRole.defaultRoute;
          } else {
            return error(res).authenticationError(["Unknown Role."]);
          }
        } else {
          return error(res).authenticationError([
            "You don't have role privileges.",
          ]);
        }
      }
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

    var resJson={
      token_type: "bearer",
      access_token: accesToken,
      refresh_token: refreshToken,
      user: {
        id: loadedUser.id_user,
        username: loadedUser.username_user,
        first_login: loadedUser.first_login,
        activeRole: activeRole,
        roles: userRole.roles,
      },
      expires_in: process.env.JWT_EXPIRES_IN,
    }

    if(loadedUser.pegawai!=undefined){
      resJson.user.kode_pegawai = loadedUser.pegawai.kode_pegawai
    }

    res.json(resJson);
    
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
        let mes="Reset Percobaan Login Berhasil.<br><br>"
        mes+="Silakan login kembali di aplikasi SmartEmployee.<br>"
        mes+="Jika Anda lupa password, klik Lupa Password pada aplikasi.<br><br>"
        mes+="Masih memiliki kendala?<br/>"
        mes+="Hubungi kami melalui email kepegawaian.jsc@gmail.com"
        res.send(mes);
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
          id_user: verify.userId,
        },
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
          first_login: user.first_login,
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
        case "checkUserEmail":
        {
          return [
            body("emailpribadi_pegawai")
              .notEmpty()
              .withMessage("Mohon masukkan emailpribadi_pegawai anda dengan benar."),
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
        case "loginByEmail":
        {
          return [
            body('username')
              .if(body('emailpribadi_pegawai').exists())
              .optional(),
            body('emailpribadi_pegawai')
              .if(body('username').exists())
              .optional(),
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
