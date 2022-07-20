const { body, query, validationResult } = require("express-validator");
const Sequelize = require("sequelize");
const error = require("../../util/errors");
const bcrypt = require("bcryptjs");

const Op = Sequelize.Op;

const { User, Pegawai, File } = require("../../models/model");

module.exports = {
  updateUser: async (req, res) => {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return error(res).validationError(validation.array());
    }

    let data = {};
    if (req.body.notelp_pegawai !== undefined) {
      data.notelp_pegawai = req.body.notelp_pegawai;
    }
    if (req.body.persetujuan_kontak !== undefined) {
      data.persetujuan_kontak = req.body.persetujuan_kontak;
    }

    await Pegawai.update(data, {
      where: {
        kode_pegawai: req.user.kode_pegawai,
      },
    });

    res.status(200).json({
      status: true,
      message: "Data pegawai berhasil diubah.",
    });
  },
  firstLoginPassword: async (req, res) => {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return error(res).validationError(validation.array());
    }

    if (req.user.first_login) {
      res.status(422).json({
        status: "failed",
        message: "Sudah melakukan login.",
      });
    }

    try {
      const hashedPw = await bcrypt.hash(req.body.new_password, 12);
      await User.update(
        {
          password_user: hashedPw,
          first_login: true,
        },
        {
          where: {
            id_user: req.user.id_user,
          },
        }
      );
      res.json({
        status: true,
        message: "Password berhasil diubah",
      });
    } catch (err) {
      res.status(422).send(err);
    }
  },
  // Validation
  validate: (type) => {
    const ruleNoTelp = body("notelp_pegawai").trim().optional();
    const rulePersetujuanKontak = body("persetujuan_kontak")
      .isBoolean()
      .withMessage("Value must be true or false.");
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

    switch (type) {
      case "updateUser":
        {
          return [ruleNoTelp, rulePersetujuanKontak];
        }
        break;
      case "firstLoginPassword":
        {
          return [ruleNewPass];
        }
        break;
    }
  },
};
