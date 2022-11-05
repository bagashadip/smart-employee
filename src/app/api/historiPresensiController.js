// const _module = "banner-category";
const _ = require("lodash");
const { query, validationResult } = require("express-validator");
const error = require("../../util/errors");
const Sequelize = require("sequelize");
const { Absensi } = require("../../models/model");
const date = require("date-and-time");
const Op = Sequelize.Op;
const moment = require("moment");

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

    const mAbsensi = await Absensi.findAll({
      where: {
        kode_pegawai: req.query.kode_pegawai,
        [Op.and]: [
          Sequelize.where(
            Sequelize.fn("date", Sequelize.col("timestamp_absensi")),
            "=",
            moment(new Date(), "YYYY-MM-DD").format("YYYY-MM-DD")
          ),
        ],
      },
    });

    if (mAbsensi) {
      let listAbsensi = [];
      const monthName = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mei",
        "Jun",
        "Jul",
        "Agu",
        "Sep",
        "Okt",
        "Nov",
        "Des",
      ];
      mAbsensi.forEach((item, index) => {
        let dateFormat = date.format(item.timestamp_absensi, "DD M YYYY HH:mm");
        let splitDate = dateFormat.split(" ");
        const getMonthName = monthName[parseInt(splitDate[1]) - 1];
        splitDate[1] = getMonthName;
        listAbsensi.push({
          timestamp_absensi: splitDate.join(" "),
          tipe_absensi: item.tipe_absensi,
          label_absensi: item.label_absensi,
          time_limit_datang: item.time_limit_datang,
          time_limit_pulang: item.time_limit_pulang,
          catatan_absensi:
            item.catatan_absensi.length > 30
              ? item.catatan_absensi.substring(0, 30) + "..."
              : item.catatan_absensi,
        });
      });
      res.send(listAbsensi);
    }
  },
  // Validation
  validate: (type) => {
    let mAbsensi = null;
    const ruleKodePegawai = query("kode_pegawai")
      .notEmpty()
      .custom(async (value) => {
        mAbsensi = await Absensi.findOne({
          where: {
            kode_pegawai: value,
          },
        });
        if (!mAbsensi) {
          return Promise.reject("Absensi pegawai tidak ditemukan!");
        }
      });

    switch (type) {
      case "get":
        {
          return [ruleKodePegawai];
        }
        break;
    }
  },
};
