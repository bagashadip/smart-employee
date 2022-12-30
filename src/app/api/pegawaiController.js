const _module = "pegawai";
const _ = require("lodash");
const { body, query, validationResult } = require("express-validator");
const Sequelize = require("sequelize");
const error = require("../../util/errors");
const datatable = require("../../util/datatable");
const moment = require("moment");
const {
  Pegawai,
  Ptkp,
  Divisi,
  Posisi,
  Dpa,
  File,
  UnitKerja,
  Organisasi,
  User,
  JamKerja,
  JamKerjaDetail,
  Asn,
  Lapbul
} = require("../../models/model");

const Op = Sequelize.Op;

module.exports = {
  // List
  list: async (req, res) => {
    if (!(await req.user.hasAccess(_module, "view"))) {
      return error(res).permissionError();
    }

    const mPegawai = await Pegawai.findAll({
      include: [
        {
          model: Ptkp,
          as: "ptkp",
          attributes: ["kode_ptkp", "keterangan_ptkp"],
        },
        {
          model: Divisi,
          as: "divisi",
          attributes: ["kode_divisi", "nama_divisi", "kode_unitkerja"],
        },
        {
          model: Posisi,
          as: "posisi",
          attributes: ["kode_posisi", "nama_posisi"],
        },
        {
          model: Dpa,
          as: "dpa",
          attributes: ["kode_dpa", "nama_dpa", "grade_dpa"],
        },
        {
          model: File,
          as: "foto",
          attributes: ["name", "path", "extension", "size"],
        },
        {
          model: JamKerja,
          as: "jamkerja",
          attributes: ["kode_jamkerja", "tampil_jamkerja"],
          include: {
            model: JamKerjaDetail,
            as: "jamkerjaDetail",
            attributes: ["nama_jamkerjadetail", "jam_datang", "jam_pulang"],
          },
        },
      ],
    });
    res.json(mPegawai);
  },
  // Datatable
  data: async (req, res) => {
    if (!(await req.user.hasAccess(_module, "view"))) {
      return error(res).permissionError();
    }

    var dataTableObj = await datatable(req.body);
    var count = await Pegawai.count();
    var modules = await Pegawai.findAndCountAll({
      ...dataTableObj,
      include: [
        {
          model: Ptkp,
          as: "ptkp",
          attributes: ["kode_ptkp", "keterangan_ptkp"],
        },
        {
          model: Divisi,
          as: "divisi",
          attributes: ["kode_divisi", "nama_divisi", "kode_unitkerja"],
        },
        {
          model: Posisi,
          as: "posisi",
          attributes: ["kode_posisi", "nama_posisi"],
        },
        {
          model: Dpa,
          as: "dpa",
          attributes: ["kode_dpa", "nama_dpa", "grade_dpa"],
        },
        {
          model: File,
          as: "foto",
          attributes: ["name", "path", "extension", "size"],
        },
        {
          model: JamKerja,
          as: "jamkerja",
          attributes: ["kode_jamkerja", "tampil_jamkerja"],
          include: {
            model: JamKerjaDetail,
            as: "jamkerjaDetail",
            attributes: ["nama_jamkerjadetail", "jam_datang", "jam_pulang"],
          },
        },
      ],
    });

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

    const mPegawai = await Pegawai.findOne({
      where: {
        kode_pegawai: req.query.kode_pegawai,
      },
      include: [
        {
          model: Ptkp,
          as: "ptkp",
          attributes: ["kode_ptkp", "keterangan_ptkp"],
        },
        {
          model: Divisi,
          as: "divisi",
          attributes: ["kode_divisi", "nama_divisi", "kode_unitkerja","template_lapbul"],
          include: [
            {
              model: UnitKerja,
              as: "unitkerja",
              attributes: [
                "kode_unitkerja",
                "nama_unitkerja",
                "latitude_unitkerja",
                "longitude_unitkerja",
                "radiuslokasi_unitkerja",
              ],
              include: [
                {
                  model: Organisasi,
                  as: "organisasi",
                  attributes: ["kode_organisasi", "nama_organisasi"],
                },
              ],
            },
            {
              model: Pegawai,
              as: "manajer",
              attributes: ["kode_pegawai", "namalengkap_pegawai"],
              include: [
                {
                  model: Posisi,
                  as: "posisi",
                  attributes: ["kode_posisi", "nama_posisi"],
                },
                {
                  model: Dpa,
                  as: "dpa",
                  attributes: ["kode_dpa", "nama_dpa", "grade_dpa"],
                },
              ],
            },
            {
              model: Asn,
              as: "asn",
              attributes: ["nip_asn", "nama_asn", "jabatan_asn"],
            },
          ],
        },
        {
          model: Posisi,
          as: "posisi",
          attributes: ["kode_posisi", "nama_posisi","kak"],
        },
        {
          model: Dpa,
          as: "dpa",
          attributes: ["kode_dpa", "nama_dpa", "grade_dpa","jenis_kontrak"],
        },
        {
          model: File,
          as: "foto",
          attributes: ["name", "path", "extension", "size"],
        },
        {
          model: JamKerja,
          as: "jamkerja",
          attributes: ["kode_jamkerja", "tampil_jamkerja"],
          include: {
            model: JamKerjaDetail,
            as: "jamkerjaDetail",
            attributes: ["nama_jamkerjadetail", "jam_datang", "jam_pulang"],
          },
        },
      ],
    });
    let tempRes = JSON.parse(JSON.stringify(mPegawai));
    if (tempRes.tanggalbergabung_pegawai) {
      var currDate = moment().startOf("day");
      let tglGabung = moment(tempRes.tanggalbergabung_pegawai, "YYYY-MM-DD");
      tempRes.masa_kerja = moment.duration(currDate.diff(tglGabung)).asDays();
    }

    //Get latest lapbul
    let mLapbul = await Lapbul.findOne({
      where: {
          kode_pegawai: req.query.kode_pegawai
      },
      order: [
        ['id_lapbul','DESC']
      ]
    });

    if(mLapbul){
      tempRes.uraian_pelaksanaan = mLapbul.uraian_pelaksanaan;
    }
    else{
      tempRes.uraian_pelaksanaan = null;
    }

    res.json(tempRes);
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

    if (!("kode_pegawai" in req.body)) {
      let num;
      let now = moment();

      const getLast = await Pegawai.findOne({
        order: [["kode_pegawai", "DESC"]],
        limit: 1,
      });

      if (getLast.kode_pegawai.substring(6, 11) === "99999") {
        num = "00001";
      } else {
        num = parseInt(getLast.kode_pegawai.substring(6, 11)) + 1;
      }

      const leadZero = `${num}`.padStart(5, "0");
      req.body.kode_pegawai =
        String(now.format("YYYY")) + now.format("MM") + leadZero;

      await new Pegawai({
        ...req.body,
      }).save();
    } else {
      const mPegawai = await Pegawai.findOne({
        where: {
          kode_pegawai: {
            [Op.iLike]: req.body.kode_pegawai,
          },
        },
      });
      if (mPegawai) {
        res.status(422).send({
          status: "Validation Error",
          errors: [
            {
              value: "20220500180",
              msg: "Data already exist!",
              param: "kode_pegawai",
              location: "body",
            },
          ],
        });
      }

      await new Pegawai({
        ...req.body,
      }).save();
    }

    res.json({
      status: true,
      statusCode: 200,
      message: "Pegawai " + req.body.kode_pegawai + " berhasil ditambah.",
    });
  },
  // Update
  update: async (req, res) => {
    if (!(await req.user.hasAccess(_module, "update"))) {
      return error(res).permissionError();
    }

    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return error(res).validationError(validation.array());
    }

    const mPegawai = await Pegawai.findOne({
      where: {
        kode_pegawai: req.query.kode_pegawai,
      },
      attributes: ["emailpribadi_pegawai"],
    });

    if (mPegawai.emailpribadi_pegawai !== req.body.emailpribadi_pegawai) {
      const mEmail = await Pegawai.findAll({
        where: {
          emailpribadi_pegawai: {
            [Op.not]: mPegawai.emailpribadi_pegawai,
          },
        },
        attributes: ["emailpribadi_pegawai"],
      });
      let findEmail = mEmail.find(
        (o) => o.emailpribadi_pegawai === req.body.emailpribadi_pegawai
      );

      if (findEmail) {
        res.json({
          status: "Validation Error",
          errors: [
            {
              value: req.body.email,
              msg: "Email already exist!",
              param: "emailpribadi_pegawai",
              location: "body",
            },
          ],
        });
      }
    }

    if (mPegawai)
      await Pegawai.update(
        { ...req.body },
        { where: { kode_pegawai: req.query.kode_pegawai } }
      );

    res.json({
      status: true,
      statusCode: 200,
      message: "Pegawai " + req.query.kode_pegawai + " berhasil diubah.",
    });
  },
  // Delete
  delete: async (req, res) => {
    if (!(await req.user.hasAccess(_module, "delete"))) {
      return error(res).permissionError();
    }

    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return error(res).validationError(validation.array());
    }

    await Pegawai.destroy({
      where: {
        kode_pegawai: req.query.kode_pegawai,
      },
    });
    res.send({
      status: true,
      message: "Pegawai " + req.query.kode_pegawai + " berhasil dihapus.",
    });
  },
  // Validation
  validate: (type) => {
    let mPegawai = null;
    const ruleKodePegawai = query("kode_pegawai")
      .trim()
      .notEmpty()
      .custom(async (value) => {
        mPegawai = await Pegawai.findOne({
          where: {
            kode_pegawai: {
              [Op.iLike]: value,
            },
          },
        });
        if (!mPegawai) {
          return Promise.reject("Data not found!");
        }
      });
    const ruleCreateKodePegawai = body("kode_pegawai")
      .trim()
      .custom(async (value) => {
        if (value) {
          mPegawai = await Pegawai.findOne({
            where: {
              kode_pegawai: {
                [Op.iLike]: value,
              },
            },
          });
          if (mPegawai) {
            return Promise.reject("Data already exist!");
          }
        }
      });
    const ruleNamaPegawai = body("namalengkap_pegawai").trim().notEmpty();
    const ruleNoKtp = body("noktp_pegawai").trim();
    const ruleJenisKelamin = body("jeniskelamin_pegawai").trim();
    const ruleTanggalLahir = body("tanggallahir_pegawai").isDate();
    const ruleGolDarah = body("goldarah_pegawai").trim();
    const ruleStatusPernikahan = body("statuspernikahan_pegawai").trim();
    const ruleAgama = body("agama_pegawai").trim();
    const ruleNoTelp = body("notelp_pegawai").trim();
    const ruleEmailPribadi = body("emailpribadi_pegawai")
      .trim()
      .isEmail()
      .notEmpty()
      .custom(async (value) => {
        mPegawai = await Pegawai.findOne({
          where: {
            emailpribadi_pegawai: {
              [Op.iLike]: value,
            },
          },
        });
        if (mPegawai) {
          return Promise.reject("Email already exist!");
        }
      });
    const ruleEmailJsc = body("emailjsc_pegawai").trim().isEmail();
    const ruleFoto = body("foto_pegawai")
      .notEmpty()
      .custom(async (value) => {
        if (value) {
          mFile = await File.findByPk(value);
          if (!mFile) {
            return Promise.reject("File foto tidak ditemukan!");
          }
        }
      });
    const ruleAlamatKtp = body("alamatktp_pegawai").trim();
    const ruleAlamatDomisili = body("domisili_pegawai").trim();
    const ruleNamaKontakDarurat = body("namakontakdarurat_pegawai").trim();
    const ruleNoTelpDarurat = body("notelpdarurat_pegawai").trim();
    const ruleNoRek = body("norek_pegawai").trim();
    const ruleBankRek = body("bankrek_pegawai").trim();
    const ruleNpwp = body("npwp_pegawai").trim();
    const ruleNoBpjsKes = body("nobpjskesehatan_pegawai").trim();
    const ruleNoBpjsKet = body("nobpjsketenagakerjaan_pegawai").trim();
    const ruleTanggalBergabung = body("tanggalbergabung_pegawai")
      .isDate()
      .notEmpty();
    const ruleTanggalLulus = body("tanggallulus_pegawai").isDate();
    const ruleStatus = body("status_pegawai").trim();
    const ruleStatusAktif = body("statusaktif_pegawai").trim().notEmpty();
    const rulePtkp = body("ptkp_pegawai")
      .trim()
      .optional()
      .custom(async (value) => {
        if (value) {
          mPtkp = await Ptkp.findOne({
            where: {
              kode_ptkp: value,
            },
          });
          if (!mPtkp) {
            return Promise.reject("PTKP tidak ditemukan!");
          }
        }
      });
    const ruleDivisi = body("kode_divisi")
      .trim()
      .notEmpty()
      .custom(async (value) => {
        if (value) {
          mDivisi = await Divisi.findOne({
            where: {
              kode_divisi: value,
            },
          });
          if (!mDivisi) {
            return Promise.reject("Divisi tidak ditemukan!");
          }
        }
      });
    const rulePosisi = body("kode_posisi")
      .trim()
      .notEmpty()
      .custom(async (value) => {
        if (value) {
          mPosisi = await Posisi.findOne({
            where: {
              kode_posisi: value,
            },
          });
          if (!mPosisi) {
            return Promise.reject("Posisi tidak ditemukan!");
          }
        }
      });
    const ruleDpa = body("kode_dpa")
      .trim()
      .notEmpty()
      .custom(async (value) => {
        if (value) {
          mDpa = await Dpa.findOne({
            where: {
              kode_dpa: value,
            },
          });
          if (!mDpa) {
            return Promise.reject("DPA tidak ditemukan!");
          }
        }
      });
    const ruleKodeJamKerja = body("kode_jamkerja").custom(async (value) => {
      if (value) {
        const mJamkerja = await JamKerja.findOne({
          where: {
            kode_jamkerja: value,
          },
        });

        if (!mJamkerja) {
          return Promise.reject("Kode jam kerja tidak ditemukan!");
        }
      }
    });

    switch (type) {
      case "create":
        {
          return [
            ruleNamaPegawai,
            ruleNoKtp,
            ruleJenisKelamin,
            ruleTanggalLahir.optional({ nullable: true }),
            ruleGolDarah,
            ruleStatusPernikahan,
            ruleAgama,
            ruleNoTelp,
            ruleEmailPribadi,
            ruleEmailJsc.optional({ nullable: true }),
            ruleFoto,
            ruleAlamatKtp,
            ruleAlamatDomisili,
            ruleNamaKontakDarurat,
            ruleNoTelpDarurat,
            ruleNoRek,
            ruleBankRek,
            ruleNpwp,
            ruleNoBpjsKes,
            ruleNoBpjsKet,
            ruleTanggalBergabung,
            ruleTanggalLulus.optional({ nullable: true }),
            ruleStatus,
            ruleStatusAktif,
            rulePtkp,
            ruleDivisi,
            rulePosisi,
            ruleDpa,
            ruleKodeJamKerja,
          ];
        }
        break;
      case "update":
        {
          return [
            ruleKodePegawai,
            ruleNamaPegawai.optional(),
            ruleNoKtp.optional(),
            ruleJenisKelamin.optional(),
            ruleTanggalLahir.optional({ nullable: true }),
            ruleGolDarah.optional(),
            ruleStatusPernikahan.optional(),
            ruleAgama.optional(),
            ruleNoTelp.optional(),
            ruleEmailJsc.optional({ nullable: true }),
            ruleFoto.optional(),
            ruleAlamatKtp.optional(),
            ruleAlamatDomisili.optional(),
            ruleNamaKontakDarurat.optional(),
            ruleNoTelpDarurat.optional(),
            ruleNoRek.optional(),
            ruleBankRek.optional(),
            ruleNpwp.optional(),
            ruleNoBpjsKes.optional(),
            ruleNoBpjsKet.optional(),
            ruleTanggalBergabung.optional(),
            ruleTanggalLulus.optional({ nullable: true }),
            ruleStatus.optional(),
            rulePtkp.optional(),
            ruleDivisi.optional(),
            rulePosisi.optional(),
            ruleDpa.optional(),
            ruleKodeJamKerja.optional(),
          ];
        }
        break;
      case "get":
        {
          return [ruleKodePegawai];
        }
        break;
      case "delete":
        {
          return [ruleKodePegawai];
        }
        break;
    }
  },
};
