const _module = "histori-presensi";
const _ = require("lodash");
const { query, validationResult } = require("express-validator");
const error = require("../../util/errors");
const Sequelize = require("sequelize");
const { Absensi, Pegawai } = require("../../models/model");
const date = require("date-and-time");
const Op = Sequelize.Op;
const moment = require("moment");

module.exports = {
  get: async (req, res) => {
    if (!(await req.user.hasAccess(_module, "view"))) {
      return error(res).permissionError();
    }

    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return error(res).validationError(validation.array());
    }

    const mAbsensi = await Absensi.findAll({
      include: [
        {
          model: Pegawai,
          as: "pegawai",
          attributes: ["kode_divisi"]
        },
      ],
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
          timestampAbsensi: splitDate.join(" "),
          tipeAbsensi: item.tipe_absensi,
          labelAbsensi: item.label_absensi,
          timeLimitDatang: item.time_limit_datang,
          timeLimitPulang: item.time_limit_pulang,
          divisi: item.pegawai.kode_divisi,
          catatanAbsensi:
            item.catatan_absensi.length > 30
              ? item.catatan_absensi.substring(0, 30) + "..."
              : item.catatan_absensi,
        });
      });
      res.send(listAbsensi);
    }
  },
  getDateParam: async (req, res) => {
    // if (!(await req.user.hasAccess(_module, "create"))) {
    //   return error(res).permissionError();
    // }

    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return error(res).validationError(validation.array());
    }

    const mAbsensi = await Absensi.findAll({
      include: [
        {
          model: Pegawai,
          as: "pegawai",
          attributes: ["kode_divisi"]
        },
      ],
      where: {
        kode_pegawai: req.query.kode_pegawai,
        [Op.and]: [
          Sequelize.where(
            Sequelize.fn("date", Sequelize.col("timestamp_absensi")),
            ">=",
            moment(req.query.tanggal_mulai).format("YYYY-MM-DD")
          ),
          Sequelize.where(
            Sequelize.fn("date", Sequelize.col("timestamp_absensi")),
            "<=",
            moment(req.query.tanggal_selesai).format("YYYY-MM-DD")
          ),
        ]
      },
      order: [
        ["timestamp_absensi", "DESC"]
      ]
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
          timestampAbsensi: splitDate.join(" "),
          tipeAbsensi: item.tipe_absensi,
          labelAbsensi: item.label_absensi,
          timeLimitDatang: item.time_limit_datang,
          timeLimitPulang: item.time_limit_pulang,
          divisi: item.pegawai.kode_divisi,
          catatanAbsensi:
            item.catatan_absensi.length > 30
              ? item.catatan_absensi.substring(0, 30) + "..."
              : item.catatan_absensi,
        });
      });
      res.send(listAbsensi);
    }
  },
  getYesterday: async (req, res) => {
    if (!(await req.user.hasAccess(_module, "view"))) {
      return error(res).permissionError();
    }

    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return error(res).validationError(validation.array());
    }

    let limitDatang, limitPulang, mAbsensi, mAbsensiToday;

    //Absensi yesterday
    mAbsensi = await Absensi.findAll({
      include: [
        {
          model: Pegawai,
          as: "pegawai",
          attributes: ["kode_divisi"]
        },
      ],
      where: {
        kode_pegawai: req.query.kode_pegawai,
        [Op.and]: [
          Sequelize.where(
            Sequelize.fn("date", Sequelize.col("timestamp_absensi")),
            "=",
            moment().subtract(1, 'days').format('YYYY-MM-DD')
          ),
        ],
      },
    });

    //Absensi of yesterday found
    if(mAbsensi)
    {
      mAbsensi.forEach((item, index) => {
        limitDatang = item.time_limit_datang;
        limitPulang = item.time_limit_pulang;
      });
    }

    //Get today's absensi
    mAbsensiToday = await Absensi.findAll({
      include: [
        {
          model: Pegawai,
          as: "pegawai",
          attributes: ["kode_divisi"]
        },
      ],
      where: {
        kode_pegawai: req.query.kode_pegawai,
        [Op.and]: [
          Sequelize.where(
            Sequelize.fn("date", Sequelize.col("timestamp_absensi")),
            "=",
            moment().format('YYYY-MM-DD')
          ),
        ],
      },
    });

    //Absensi of yesterday not found
    if(!mAbsensi)
    {
      if(mAbsensiToday)
      {
        mAbsensi.forEach((item, index) => {
          limitDatang = item.time_limit_datang;
          limitPulang = item.time_limit_pulang;
        });
      }else{
        res.send([]);
      }
    }

    console.log(limitDatang > limitPulang)

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

    if(limitDatang > limitPulang)
    {

      //Get last 12 hours of today's absensi
      const mAbsensiLast12Hours = await Absensi.findAll({
        include: [
          {
            model: Pegawai,
            as: "pegawai",
            attributes: ["kode_divisi"]
          },
        ],
        where: {
          kode_pegawai: req.query.kode_pegawai,
          [Op.and]: [
            Sequelize.where(
              Sequelize.fn("date", Sequelize.col("timestamp_absensi")),
              ">=",
              moment().subtract(12, 'hours').format('YYYY-MM-DD HH:mm:ss')
            ),
          ],
        },
      });

      if(mAbsensiLast12Hours){
        let listAbsensi = [];
        mAbsensiLast12Hours.forEach((item, index) => {
          let dateFormat = date.format(item.timestamp_absensi, "DD M YYYY HH:mm");
          let splitDate = dateFormat.split(" ");
          const getMonthName = monthName[parseInt(splitDate[1]) - 1];
          splitDate[1] = getMonthName;
          listAbsensi.push({
            timestampAbsensi: splitDate.join(" "),
            tipeAbsensi: item.tipe_absensi,
            labelAbsensi: item.label_absensi,
            timeLimitDatang: item.time_limit_datang,
            timeLimitPulang: item.time_limit_pulang,
            divisi: item.pegawai.kode_divisi,
            catatanAbsensi:
              item.catatan_absensi.length > 30
                ? item.catatan_absensi.substring(0, 30) + "..."
                : item.catatan_absensi,
          });
        });
        res.send(listAbsensi);
      }
    }else if(mAbsensiToday){
      let listAbsensi = [];
      
      mAbsensiToday.forEach((item, index) => {
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
          divisi: item.pegawai.kode_divisi,
          catatan_absensi:
            item.catatan_absensi.length > 30
              ? item.catatan_absensi.substring(0, 30) + "..."
              : item.catatan_absensi,
        });
      });
      res.send(listAbsensi);
    }else{
      res.send([]);
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
