// const _module = "banner-category";
const _ = require("lodash");
const { body, validationResult } = require("express-validator");
const error = require("../../util/errors");
const Sequelize = require("sequelize");
const { Pegawai, Divisi, UnitKerja } = require("../../models/model");

module.exports = {
  // Create
  create: async (req, res) => {
    // if (!(await req.user.hasAccess(_module, "create"))) {
    //   return error(res).permissionError();
    // }

    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return error(res).validationError(validation.array());
    }

    const toRad = (value) => {
      return (value * Math.PI) / 180;
    };

    const kodePegawai = req.body.kode_pegawai;
    const mPegawai = await Pegawai.findOne({
      where: {
        kode_pegawai: kodePegawai,
      },
      attributes: ["kode_pegawai"],
      include: [
        {
          model: Divisi,
          as: "divisi",
          attributes: ["kode_divisi"],
          include: [
            {
              model: UnitKerja,
              as: "unitkerja",
              attributes: [
                "latitude_unitkerja",
                "longitude_unitkerja",
                "radiuslokasi_unitkerja",
              ],
            },
          ],
        },
      ],
    });

    var latAbs = req.body.latitude_absensi;
    var lonAbs = req.body.longitude_absensi;
    var latUk = mPegawai.divisi.unitkerja.latitude_unitkerja;
    var lonUk = mPegawai.divisi.unitkerja.longitude_unitkerja;
    var rad = mPegawai.divisi.unitkerja.radiuslokasi_unitkerja;
    var status = null;

    var R = 6371;
    var dLat = toRad(latUk - latAbs);
    var dLon = toRad(lonUk - lonAbs);
    var lat1 = toRad(latAbs);
    var lat2 = toRad(latUk);

    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c * 1000; // Conver Km to meter
    //Return value for label WFH/WFO
    if (d > rad) {
      status = "WFH";
    } else {
      status = "WFO";
    }

    res.json({
      statusCode: 200,
      status: status,
      distance: Number(d.toFixed(2)),
    });
  },
  // Validation
  validate: (type) => {
    const ruleLongitudeAbsensi = body("longitude_absensi").isFloat().notEmpty();
    const ruleLatitudeAbsensi = body("latitude_absensi").isFloat().notEmpty();
    const ruleKodePegawai = body("kode_pegawai")
      .notEmpty()
      .custom(async (value) => {
        const mPegawai = await Pegawai.findOne({
          where: {
            kode_pegawai: value,
          },
        });
        if (!mPegawai) {
          return Promise.reject("Kode pegawai tidak ditemukan!");
        }
      });

    switch (type) {
      case "create":
        {
          return [ruleLongitudeAbsensi, ruleLatitudeAbsensi, ruleKodePegawai];
        }
        break;
    }
  },
};
