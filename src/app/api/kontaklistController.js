// const _module = "banner-category";
const _ = require("lodash");
const { query, validationResult } = require("express-validator");
const error = require("../../util/errors");
const { Pegawai, Asn, Posisi, File } = require("../../models/model");
const date = require("date-and-time");
const posisi = require("../../models/posisi");

module.exports = {
  // Create
  get: async (req, res) => {
    // if (!(await req.user.hasAccess(_module, "create"))) {
    //   return error(res).permissionError();
    // }

    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return error(res).validationError(validation.array());
    }
    const kategori = req.query.kategori;
    let resData = null;
    let qWhere = {
      where: {
        statusaktif_asn: "Aktif",
      },
      include: [
        {
          model: File,
          as: "foto",
          attributes: ["name", "path", "extension", "size"],
        },
      ],
      attributes: [
        "nama_asn",
        "jabatan_asn",
        "notelp_asn",
        "email_asn",
        "foto_asn",
      ],
      order: [["nama_asn", "ASC"]],
    };
    let qWherePegawai = {
      where: {
        statusaktif_pegawai: "Aktif",
      },
      include: [
        {
          model: Posisi,
          as: "posisi",
          attributes: ["nama_posisi"],
        },
        {
          model: File,
          as: "foto",
          attributes: ["name", "path", "extension", "size"],
        },
      ],
      attributes: [
        "namalengkap_pegawai",
        "kode_posisi",
        "notelp_pegawai",
        "emailpribadi_pegawai",
        "foto_pegawai",
      ],
      order: [["namalengkap_pegawai", "ASC"]],
    };

    if (kategori === "ALL") {
      qWhere = qWhere;
      qWherePegawai = qWherePegawai;
    } else if (kategori === "ASN") {
      qWhere.where.status_asn = "ASN";
    } else if (kategori === "CASN") {
      qWhere.where.status_asn = "CASN";
    } else if (kategori === "TA") {
      qWherePegawai = qWherePegawai;
    }

    let mRes = null;
    let tempRes = null;
    if (kategori === "TA") {
      mRes = await Pegawai.findAll(qWherePegawai);
    } else if (kategori === "ALL") {
      let mAsn = await Asn.findAll(qWhere);
      let mPegawai = await Pegawai.findAll(qWherePegawai);

      let arrAsn = JSON.parse(JSON.stringify(mAsn));
      let arrPegawai = JSON.parse(JSON.stringify(mPegawai));

      mRes = arrAsn.concat(arrPegawai);
      mRes.sort(function (a, b) {
        var keyA = "nama_asn" in a ? a.nama_asn : a.namalengkap_pegawai,
          keyB = "nama_asn" in b ? b.nama_asn : b.namalengkap_pegawai;
        // Compare the 2 dates
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
      });
      //   mRes.sort();
    } else {
      mRes = await Asn.findAll(qWhere);
    }

    tempRes = JSON.parse(JSON.stringify(mRes));
    console.log("tempRes", tempRes);
    resData = tempRes.map((v) => ({
      nama: "nama_asn" in v ? v.nama_asn : v.namalengkap_pegawai,
      jabatan: "jabatan_asn" in v ? v.jabatan_asn : v.posisi.nama_posisi,
      // no_hp: "notelp_asn" in v ? v.notelp_asn : v.notelp_pegawai,
      // email: "email_asn" in v ? v.email_asn : v.emailpribadi_pegawai,
      foto: v.foto.path,
      kategori: kategori,
    }));

    res.send(resData);
  },
  jumlahKontak: async (req, res) => {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return error(res).validationError(validation.array());
    }

    let mAsn = await Asn.count({
      where: {
        statusaktif_asn: "Aktif",
        status_asn: "ASN",
      },
    });

    let mCasn = await Asn.count({
      where: {
        statusaktif_asn: "Aktif",
        status_asn: "CASN",
      },
    });

    let mTa = await Pegawai.count({
      where: {
        statusaktif_pegawai: "Aktif",
      },
    });

    const kategori = req.query.kategori;
    let resTotal = null;
    if (kategori === "ALL") {
      resTotal = {
        jumlah_asn: mAsn,
        jumlah_casn: mCasn,
        jumlah_ta: mTa,
        total: mAsn + mCasn + mTa,
      };
    } else if (kategori === "ASN") {
      resTotal = {
        jumlah_asn: mAsn,
        total: mAsn,
      };
    } else if (kategori === "CASN") {
      resTotal = {
        jumlah_casn: mCasn,
        total: mCasn,
      };
    } else if (kategori === "TA") {
      resTotal = {
        jumlah_ta: mTa,
        total: mTa,
      };
    }

    res.send(resTotal);
  },
  // Validation
  validate: (type) => {
    const ruleKategori = query("kategori")
      .notEmpty()
      .custom(async (value) => {
        const listKategori = ["ALL", "ASN", "CASN", "TA"];
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
      case "jumlahKontak":
        {
          return [ruleKategori];
        }
        break;
    }
  },
};
