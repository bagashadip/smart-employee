const { body, query, validationResult } = require("express-validator");
const Sequelize = require("sequelize");
const error = require("../../util/errors");
const jwt = require("jsonwebtoken");

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
  // Validation
  validate: (type) => {
    const ruleNoTelp = body("notelp_pegawai").trim().optional();
    const rulePersetujuanKontak = body("persetujuan_kontak")
      .isBoolean()
      .withMessage("Value must be true or false.");

    switch (type) {
      case "updateUser":
        {
          return [ruleNoTelp];
        }
        break;
    }
  },
};
