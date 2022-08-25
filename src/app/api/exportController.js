const _ = require("lodash");
const { body, query, validationResult } = require("express-validator");
const Sequelize = require("sequelize");
const error = require("../../util/errors");
const moment = require("moment");
const {
  Absensi,
  Pegawai,
  Divisi,
  JamKerja,
  JamKerjaDetail,
} = require("../../models/model");

const Op = Sequelize.Op;

module.exports = {
  exportAbsensi: async (req, res) => {
    const checkStartDate = "startDate" in req.body;
    const checkEndDate = "endDate" in req.body;

    if (checkStartDate === false || checkEndDate === false) {
      res.status(400).json({
        status: false,
        message: "start date or end date required!",
      });
    }

    const mAbsensi = await Absensi.findAll({
      include: [
        {
          model: Pegawai,
          as: "pegawai",
          attributes: [],
          include: [
            {
              model: Divisi,
              as: "divisi",
              attributes: [],
            },
          ],
        },
      ],
      attributes: [
        [Sequelize.col("pegawai.namalengkap_pegawai"), "nama_pegawai"],
        [Sequelize.col("pegawai.kode_divisi"), "divisi"],
        [Sequelize.literal('date("timestamp_absensi")'), "tanggal_absen"],
        [Sequelize.literal("timestamp_absensi::time"), "jam_absen"],
        "tipe_absensi",
        [
          Sequelize.literal(
            "case when tipe_absensi = 'Datang' then time_limit_datang else time_limit_pulang end"
          ),
          "time_limit",
        ],
        [
          Sequelize.literal(
            "case when tipe_absensi = 'Datang' then cast((timestamp_absensi::time - time_limit_datang) as text) else cast((timestamp_absensi::time - time_limit_pulang) as text) end"
          ),
          "selisih",
        ],
        [
          Sequelize.literal(
            "case when tipe_absensi = 'Datang' then case when timestamp_absensi::time < time_limit_datang then 'Datang lebih awal' when timestamp_absensi::time between timestamp_absensi::time and (time_limit_datang + interval '1 hour') then 'Datang tepat waktu' when timestamp_absensi::time > (time_limit_datang + interval '1 hour') then 'Datang terlambat' end else case when timestamp_absensi::time < time_limit_pulang then 'Pulang lebih awal' when timestamp_absensi::time > time_limit_pulang then 'Pulang lebih akhir' when timestamp_absensi::time = time_limit_pulang then 'Pulang tepat waktu' end end"
          ),
          "keterangan",
        ],
      ],
      where: {
        createdAt: {
          [Op.and]: [
            { [Op.gte]: req.body.startDate },
            { [Op.lte]: req.body.endDate },
          ],
        },
      },
      order: [
        [Sequelize.col("pegawai.kode_divisi"), "ASC"],
        [Sequelize.col("pegawai.namalengkap_pegawai"), "ASC"],
        ["timestamp_absensi", "ASC"],
      ],
    });
    res.json(mAbsensi);
  },
};
