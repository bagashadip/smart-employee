// const _module = "banner-category";
const _ = require("lodash");
const { query, validationResult } = require("express-validator");
const error = require("../../util/errors");
const Sequelize = require("sequelize");
const {
  Pegawai,
  Asn,
  Posisi,
  File,
  Jabatan,
  Divisi,
  DivisiParent,
  Dpa,
} = require("../../models/model");

module.exports = {
  // Create
  get: async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return error(res).authenticationError("Not Authenticated");
    }

    const token = authHeader.substring(6, authHeader.length);

    if (!token) {
      return error(res).authenticationError("Not Authenticated");
    }

    var decodeToken = Buffer.from(token, "base64");

    if (
      String(decodeToken) !==
      process.env.WEBCORP_USER + ":" + process.env.WEBCORP_PASS
    ) {
      res.status(403).json({
        status: false,
        message: "Invalid credential!",
      });
    }

    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return error(res).validationError(validation.array());
    }
    const category = req.query.kategori;
    let resData;
    if (category === "ASN") {
      resData = await Asn.findAll({
        where: {
          statusaktif_asn: "Aktif",
        },
        order: [
          [Sequelize.col("jabatan.urutan_jabatan"), "ASC"],
          ["nama_asn", "ASC"],
        ],
        attributes: [
          "nip_asn",
          "nama_asn",
          "foto_asn",
          "jabatan_asn",
          "kode_divisi_parent",
          "kode_jabatan",
          "createdAt",
          "updatedAt",
        ],
        include: [
          {
            model: DivisiParent,
            as: "divisi_parent",
            attributes: ["kode_divisi_parent", "nama_divisi_parent"],
            include: [
              {
                model: Divisi,
                as: "divisi",
                attributes: ["kode_divisi", "nama_divisi"],
              },
            ],
          },
          {
            model: Jabatan,
            as: "jabatan",
            attributes: ["kode_jabatan", "nama_jabatan", "urutan_jabatan"],
          },
          {
            model: File,
            as: "foto",
            attributes: ["name", "path", "extension", "size"],
          },
        ],
      });
    }

    if (category === "TA") {
      resData = await Pegawai.findAll({
        where: {
          statusaktif_pegawai: "Aktif",
        },
        attributes: [
          "kode_pegawai",
          "namalengkap_pegawai",
          "foto_pegawai",
          "kode_posisi",
          "kode_dpa",
          "kode_divisi",
          "createdAt",
          "updatedAt",
        ],
        order: [
          [Sequelize.col("posisi.urutan_posisi"), "ASC"],
          ["namalengkap_pegawai", "ASC"],
        ],
        include: [
          {
            model: Divisi,
            as: "divisi",
            attributes: ["kode_divisi", "nama_divisi"],
          },
          {
            model: Posisi,
            as: "posisi",
            attributes: ["kode_posisi", "nama_posisi", "urutan_posisi"],
          },
          {
            model: Dpa,
            as: "dpa",
            attributes: ["kode_dpa", "nama_dpa"],
          },
          {
            model: File,
            as: "foto",
            attributes: ["name", "path", "extension", "size"],
          },
        ],
      });
    }

    res.send(resData);
  },
  // Validation
  validate: (type) => {
    const ruleKategori = query("kategori")
      .notEmpty()
      .custom(async (value) => {
        const listKategori = ["ASN", "TA"];
        let isKategori = listKategori.includes(value);
        if (!isKategori) {
          return Promise.reject("Kategori tidak terdaftar!");
        }
      });

    switch (type) {
      case "get":
        {
          return [ruleKategori];
        }
        break;
    }
  },
};
