const { body, query, validationResult } = require("express-validator");
const Sequelize = require("sequelize");
const error = require("../../util/errors");

const Op = Sequelize.Op;

const { User, Pegawai, File } = require("../../models/model");

module.exports = {
  get: async (req, res) => {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return error(res).validationError(validation.array());
    }

    const username = req.query.username;

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
      notelp_pegawai: "",
      foto_pegawai: "",
      status_user: loadedUser.status_user,
    };

    if (loadedUser.pegawai) {
      resData.emailpribadi_pegawai = loadedUser.pegawai.emailpribadi_pegawai;
      resData.namalengkap_pegawai = loadedUser.pegawai.namalengkap_pegawai;
      resData.notelp_pegawai = loadedUser.pegawai.notelp_pegawai;
      resData.foto_pegawai = loadedUser.pegawai.foto.path;
    }

    res.status(200).send(resData);
  },
  validate: (type) => {
    switch (type) {
      case "get":
        {
          return [
            query("username")
              .notEmpty()
              .withMessage("Mohon masukkan username anda dengan benar."),
          ];
        }
        break;
    }
  },
};
