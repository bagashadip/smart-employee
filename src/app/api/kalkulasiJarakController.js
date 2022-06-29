// const _module = "banner-category";
const _ = require("lodash");
const { body, validationResult } = require("express-validator");
const error = require("../../util/errors");

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

    var latAbs = req.body.latitude_absensi;
    var lonAbs = req.body.longitude_absensi;
    var latUk = req.body.latitude_unitkerja;
    var lonUk = req.body.longitude_unitkerja;
    var rad = req.body.rad_unitkerja;
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
      distanse: Number(d.toFixed(2)),
    });
  },
  // Validation
  validate: (type) => {
    const ruleLongitudeAbsensi = body("longitude_absensi").isFloat().notEmpty();
    const ruleLatitudeAbsensi = body("latitude_absensi").isFloat().notEmpty();
    const ruleLongitudeUnitkerja = body("latitude_unitkerja")
      .isFloat()
      .notEmpty();
    const ruleLatitudeUnitKerja = body("latitude_unitkerja")
      .isFloat()
      .notEmpty();
    const ruleLatitudeRadius = body("rad_unitkerja").isFloat().notEmpty();

    switch (type) {
      case "create":
        {
          return [
            ruleLongitudeAbsensi,
            ruleLatitudeAbsensi,
            ruleLongitudeUnitkerja,
            ruleLatitudeUnitKerja,
            ruleLatitudeRadius,
          ];
        }
        break;
    }
  },
};
