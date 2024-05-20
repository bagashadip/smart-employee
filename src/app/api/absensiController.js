const _module = "absensi";
const _ = require("lodash");
const { body, query, validationResult } = require("express-validator");
const Sequelize = require("sequelize");
const error = require("../../util/errors");
const datatable = require("../../util/datatable");
const moment = require("moment");
const { Absensi, File, Pegawai, JamKerja, JamKerjaDetail } = require("../../models/model");
const Op = Sequelize.Op;
const { distanceValidation } = require('./../../helper/distanceValidation');

module.exports = {
  // List
  list: async (req, res) => {
    if (!(await req.user.hasAccess(_module, "view"))) {
      return error(res).permissionError();
    }
    const mAbsensi = await Absensi.findAll({
      include: [
        {
          model: Pegawai,
          as: "pegawai",
        },
        {
          model: File,
          as: "foto",
          attributes: ["name", "path", "extension", "size"],
        },
      ],
    });
    res.json(mAbsensi);
  },
  // Datatable
  data: async (req, res) => {
    if (!(await req.user.hasAccess(_module, "view"))) {
      return error(res).permissionError();
    }

    var { filter } = req.body;
    let filterKodeDivisi = null;
    if (filter && filter.length > 0) {
      filter.forEach((f) => {
        if (f.column === "kode_divisi") {
          filterKodeDivisi = f.value;
        }
      });
    }

    // remove filter containing kode_divisi
    const payload = req.body;
    const filterIndex = payload.filter.findIndex((f) => f.column === "kode_divisi");
    if (filterIndex !== -1) {
      payload.filter.splice(filterIndex, 1);
    }

    var dataTableObj = await datatable(req.body);
    var queryFilter = {
      ...dataTableObj,
      include: [
        {
          model: Pegawai,
          as: "pegawai",
        },
        {
          model: File,
          as: "foto",
          attributes: ["name", "path", "extension", "size"],
        },
      ],

      attributes: [
        "id_absensi",
        "foto_absensi",
        "longitude_absensi",
        "latitude_absensi",
        "label_absensi",
        "catatan_absensi",
        "tipe_absensi",
        "timestamp_absensi",
        "kode_pegawai",
        "time_limit_datang",
        "time_limit_pulang",
        "createdAt",
        "updatedAt",
        [Sequelize.literal('"pegawai"."kode_divisi"'), "kode_divisi"],
      ],
    };

    if (filterKodeDivisi) {
      if (queryFilter.where && queryFilter.where[Op.and]) {
        Array.isArray(filterKodeDivisi) 
        ? queryFilter.where[Op.and].push(Sequelize.literal('"pegawai"."kode_divisi" IN (' + filterKodeDivisi.map(kode => `'${kode}'`).join(', ') + ')')) 
        : queryFilter.where[Op.and].push(Sequelize.literal('"pegawai"."kode_divisi" = \'' + filterKodeDivisi + "'"));
      } else {
        let queryDivisi = Array.isArray(filterKodeDivisi)
        ? {[Op.and]: [Sequelize.literal('"pegawai"."kode_divisi" IN (' + filterKodeDivisi.map(kode => `'${kode}'`).join(', ') + ')')]}
        : {[Op.and]: [Sequelize.literal('"pegawai"."kode_divisi" = \'' + filterKodeDivisi + "'")]};
        queryFilter.where = queryDivisi;
      }
    }

    var count = await Absensi.count();
    var modules = await Absensi.findAndCountAll(queryFilter);

    res.json({
      recordsFiltered: modules.count,
      recordsTotal: count,
      items: modules.rows,
    });
  },
  // Get One Row require ID
  get: async (req, res) => {
    if (!(await req.user.hasAccess(_module, "view"))) {
      return error(res).permissionError();
    }

    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return error(res).validationError(validation.array());
    }

    const mAbsensi = await Absensi.findOne({
      where: {
        id_absensi: req.query.id_absensi,
      },
      include: [
        {
          model: Pegawai,
          as: "pegawai",
        },
        {
          model: File,
          as: "foto",
          attributes: ["name", "path", "extension", "size"],
        },
      ],
    });
    res.json(mAbsensi);
  },
  // Create
  create: async (req, res) => {
    if (!(await req.user.hasAccess(_module, "create"))) {
      return error(res).permissionError();
    }

    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return error(res).validationError(validation.array());
    }

    const timestampAbsensi = new Date(req.body.timestamp_absensi);
    var year = timestampAbsensi.getFullYear();
    var month = ('0' + (timestampAbsensi.getMonth() + 1)).slice(-2);
    var day = ('0' + timestampAbsensi.getDate()).slice(-2);
    let formatedTimestamp = year + '-' + month + '-' + day;

    const absensiValidate = await Absensi.count({
      where: {
        tipe_absensi: req.body.tipe_absensi,
        kode_pegawai: req.body.kode_pegawai,
        [Op.and]: [
          Sequelize.where(
            Sequelize.fn("date", Sequelize.col("timestamp_absensi")),
            "=",
            formatedTimestamp
          ),
        ],
      },
    });
    if (absensiValidate > 0) {
      return res.status(422).json({
        status: false,
        statusCode: 422,
        msg: "Sudah melakukan absen " + req.body.tipe_absensi + "!",
      });
    } else {
      const divisi = await Pegawai.findOne({
        where: {
          kode_pegawai: req.user.kode_pegawai
        },
        attributes: ['kode_divisi', 'kode_jamkerja'],
        include: [
          {
            model: JamKerja,
            as: "jamkerja",
            attributes: ["kode_jamkerja"],
            include: [
              {
                model: JamKerjaDetail,
                as: "jamkerjaDetail",
                attributes: ["kode_jamkerja", "durasi_kerja", "jam_datang", "jam_pulang", "jam_pulang_max"]
              }
            ]
          },
        ]
      });

      if (divisi.kode_divisi.toLowerCase() !== "opl" && divisi.kode_divisi.toLowerCase() !== "rop") {
        const timeFormat = (timeLimit, type) => {
          if (type === 'pulang') {
            let durasiKerja = divisi.jamkerja.jamkerjaDetail[0].durasi_kerja;
            const timeSplit = durasiKerja.split(":");
            const hour = parseInt(timeSplit[0]);
            const minute = parseInt(timeSplit[1]);
            let jamPulang = timeLimit;
            jamPulang.setHours(jamPulang.getHours() + hour);
            jamPulang.setMinutes(jamPulang.getMinutes() + minute);
            let jamPulangMax = moment(timeLimit, 'YYYY-MM-DD').format('YYYY-MM-DD');
            jamPulangMax = moment(jamPulangMax + ' ' + divisi.jamkerja.jamkerjaDetail[0].jam_pulang_max, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
            jamPulang = moment(jamPulang, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');

            if (jamPulang > jamPulangMax) {
              return jamPulangMax;
            }
          }
          return moment(timeLimit, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
        };

        const validateTimePulang = (timeString) => {
          const time = timeString;
          let referenceTime = moment(req.body.timestamp_absensi).format('YYYY-MM-DD');
          referenceTime = moment(referenceTime + ' ' + divisi.jamkerja.jamkerjaDetail[0].jam_pulang_max).format('YYYY-MM-DD HH:mm:ss');

          return time > referenceTime;
        };

        const validateTimeDatang = (timeString) => {
          const time = timeString;
          let referenceTime = moment(timeString).format('YYYY-MM-DD');
          referenceTime = moment(referenceTime + ' ' + divisi.jamkerja.jamkerjaDetail[0].jam_datang).format('YYYY-MM-DD HH:mm:ss');

          return time < referenceTime;
        };

        let timeLimit = new Date(req.body.timestamp_absensi);
        let timeLimitDatang = timeFormat(timeLimit, 'datang');
        let timeLimitPulang = timeFormat(timeLimit, 'pulang');

        /* Validasi absen datang */
        if (req.body.tipe_absensi.toLowerCase() === 'datang') {
          const absenBalkot = {
            latAbs: req.body.latitude_absensi,
            lonAbs: req.body.longitude_absensi,
            latUk: -6.181578,
            lonUk: 106.828768,
            rad: 150
          }
          const validateDistance = distanceValidation(absenBalkot);
          if (validateDistance.status == "WFH") {
            const absenFch = {
              latAbs: req.body.latitude_absensi,
              lonAbs: req.body.longitude_absensi,
              latUk: -6.1825923085334145,
              lonUk: 106.824068600014,
              rad: 150
            }
            const validateDistance = distanceValidation(absenFch);
            if (validateDistance.status == "WFH") {
              return res.status(422).json({
                status: false,
                statusCode: 422,
                msg: "Lokasi absen hanya bisa di area Balai Kota atau JB Tower.",
              });
            }
          }

          req.body.time_limit_datang = moment(timeLimitDatang).format('HH:mm:ss');
          req.body.time_limit_pulang = moment(timeLimitPulang).format('HH:mm:ss');

          /* Jika datang lebih pagi, time limit atau waktu pulang disesuaikan dengan ketentuan jam pulang reguler */
          if (validateTimeDatang(timeLimitDatang)) {
            req.body.time_limit_pulang = divisi.jamkerja.jamkerjaDetail[0].jam_pulang;
          }

          /* Jika datang terlambat, time limit atau waktu pulang disesuaikan dengan ketentuan jam pulang maksimal reguler */
          if (validateTimePulang(timeLimitPulang)) {
            req.body.time_limit_pulang = divisi.jamkerja.jamkerjaDetail[0].jam_pulang_max;
          }
        } else {
          const newDate = new Date(req.body.timestamp_absensi);
          var year = newDate.getFullYear();
          var month = ('0' + (newDate.getMonth() + 1)).slice(-2);
          var day = ('0' + newDate.getDate()).slice(-2);

          const formatedDate = year + '-' + month + '-' + day;

          const getAbsenDatang = await Absensi.findOne({
            where: {
              tipe_absensi: 'Datang',
              kode_pegawai: req.body.kode_pegawai,
              [Op.and]: [
                Sequelize.where(
                  Sequelize.fn("date", Sequelize.col("timestamp_absensi")),
                  "=",
                  formatedDate
                ),
              ],
            },
          });

          if (!getAbsenDatang) {
            return res.status(422).json({
              status: false,
              statusCode: 422,
              msg: "Belum melakukan absen datang!",
            });
          }

          /* Pengecekan sudah bisa absen pulang atau belum */
          // const timestampAbsen = moment(req.body.timestamp_absensi, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
          // let limitPulang = moment(req.body.timestamp_absensi).format('YYYY-MM-DD');
          // limitPulang = moment(limitPulang + ' ' + getAbsenDatang.time_limit_pulang).format('YYYY-MM-DD HH:mm:ss');
          // if (timestampAbsen < limitPulang) {
          //   res.status(422).json({
          //     status: false,
          //     statusCode: 422,
          //     msg: "Kamu baru bisa absen pulang di jam " + getAbsenDatang.time_limit_pulang,
          //   });
          //   return;
          // }

          req.body.time_limit_datang = getAbsenDatang.time_limit_datang;
          req.body.time_limit_pulang = getAbsenDatang.time_limit_pulang;
        }
        
      }
      
      const absensi = await new Absensi({
        ...req.body,
      }).save();

      res.json({
        status: true,
        statusCode: 200,
        message: "Sukses melakukan absensi.",
      });
    }
  },
  // Validation
  validate: (type) => {
    let mAbsensi = null;
    let mFile = null;
    let mPegawai = null;
    let absensiValidate = null;
    const ruleId = query("id_absensi")
      .trim()
      .notEmpty()
      .custom(async (value) => {
        mAbsensi = await Absensi.findByPk(value);
        if (!mAbsensi) {
          return Promise.reject("Data not found!");
        }
      });
    const ruleFotoAbsensi = body("foto_absensi")
      .trim()
      .notEmpty()
      .custom(async (value) => {
        if (value) {
          mFile = await File.findByPk(value);
          if (!mFile) {
            return Promise.reject("Foto absensi tidak ditemukan!");
          }
        }
      });
    const ruleLongitude = body("longitude_organisasi").isFloat().optional();
    const ruleLatitude = body("latitude_organisasi").isFloat().optional();
    const ruleLabel = body("label_absensi").trim().notEmpty();
    const ruleCatatan = body("logo_organisasi").trim().optional();
    const ruleTipe = body("tipe_absensi").trim().notEmpty();
    const ruleKodePegawai = body("kode_pegawai")
      .trim()
      .optional()
      .custom(async (value) => {
        if (value) {
          mPegawai = await Pegawai.findOne({
            where: {
              kode_pegawai: {
                [Op.iLike]: value,
              },
            },
          });
          if (!mPegawai) {
            return Promise.reject("Data Pegawai tidak ditemukan!");
          }
        }
      });
    const ruleTimeStamp = body("timestamp_absensi").trim().notEmpty();
    const ruleTimeLimitDatang = body("time_limit_datang")
      .optional()
      .matches(/(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)/)
      .withMessage("time format should be HH:MM:SS (ex: 07:00:00)");

    const ruleTimeLimitPulang = body("time_limit_pulang")
      .optional()
      .matches(/(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)/)
      .withMessage("time format should be HH:MM:SS (ex: 07:00:00)");

    switch (type) {
      case "create":
        {
          return [
            ruleFotoAbsensi,
            ruleLongitude,
            ruleLatitude,
            ruleLabel,
            ruleCatatan,
            ruleTipe,
            ruleKodePegawai,
            ruleTimeStamp,
            ruleTimeLimitDatang,
            ruleTimeLimitPulang,
          ];
        }
        break;
      case "get":
        {
          return [ruleId];
        }
        break;
    }
  },
};
