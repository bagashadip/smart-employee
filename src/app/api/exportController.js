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
    const checkDivisi = "divisi" in req.body;
    const kodePegawai = "kode_pegawai" in req.body;

    if (checkStartDate === false || checkEndDate === false) {
      res.status(400).json({
        status: false,
        message: "start date or end date required!",
      });
    }

    let filterDivisi = {
      kode_divisi: {
        [Op.notIn]: ["OPL", "ROP"]
      }
    }

    if(checkDivisi){
      filterDivisi = {
        kode_divisi: req.body.divisi
      }
    }
    
    let whereAbsensi = {
      timestamp_absensi: {
        [Op.and]: [
          { [Op.gte]: req.body.startDate },
          { [Op.lte]: req.body.endDate },
        ],
      }
    }

    if(kodePegawai)
    {
      whereAbsensi = {
        ...whereAbsensi,
        kode_pegawai: req.body.kode_pegawai
      }
    }

    // console.log(whereAbsensi)

    if (checkDivisi) {
      if (req.body.divisi == 'OPL' || req.body.divisi == 'ROP') {
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
              where: filterDivisi
            },
          ],
          attributes: [
            [Sequelize.col("pegawai.kode_pegawai"), "kode_pegawai"],
            [Sequelize.col("pegawai.namalengkap_pegawai"), "nama_pegawai"],
            [Sequelize.col("pegawai.kode_divisi"), "divisi"],
            [Sequelize.literal('date("timestamp_absensi")'), "tanggal_absen"],
            [Sequelize.literal("timestamp_absensi::time"), "jam_absen"],
            "label_absensi",
            "catatan_absensi",
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
                "case when tipe_absensi = 'Datang' then case when timestamp_absensi::time < time_limit_datang then 'Datang lebih awal' when timestamp_absensi::time between timestamp_absensi::time and (time_limit_datang + interval '30 minutes') then 'Datang tepat waktu' when timestamp_absensi::time > (time_limit_datang + interval '30 minutes') then 'Datang terlambat' end else case when timestamp_absensi::time < time_limit_pulang then 'Pulang lebih awal' when timestamp_absensi::time > time_limit_pulang then 'Pulang lebih akhir' when timestamp_absensi::time = time_limit_pulang then 'Pulang tepat waktu' end end"
              ),
              "keterangan",
            ],
          ],
          where: whereAbsensi,
          order: [
            [Sequelize.col("pegawai.kode_divisi"), "ASC"],
            [Sequelize.col("pegawai.namalengkap_pegawai"), "ASC"],
            ["timestamp_absensi", "ASC"],
          ],
        });
        res.json(mAbsensi);
    
      } else {
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
              where: filterDivisi
            },
          ],
          attributes: [
            [Sequelize.col("pegawai.kode_pegawai"), "kode_pegawai"],
            [Sequelize.col("pegawai.namalengkap_pegawai"), "nama_pegawai"],
            [Sequelize.col("pegawai.kode_divisi"), "divisi"],
            [Sequelize.literal('date("timestamp_absensi")'), "tanggal_absen"],
            [Sequelize.literal("timestamp_absensi::time"), "jam_absen"],
            [Sequelize.literal("timestamp_absensi::date"), "timestamp_absensi"],
            "label_absensi",
            "catatan_absensi",
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
                "case when tipe_absensi = 'Datang' then case when timestamp_absensi::time < time_limit_datang then 'Datang lebih awal' when timestamp_absensi::time between timestamp_absensi::time and (time_limit_datang + interval '30 minutes') then 'Datang tepat waktu' when timestamp_absensi::time > (time_limit_datang + interval '30 minutes') then 'Datang terlambat' end else case when timestamp_absensi::time < time_limit_pulang then 'Pulang lebih awal' when timestamp_absensi::time > time_limit_pulang then 'Pulang lebih akhir' when timestamp_absensi::time = time_limit_pulang then 'Pulang tepat waktu' end end"
              ),
              "keterangan",
            ],
          ],
          where: whereAbsensi,
          order: [
            ["timestamp_absensi", "ASC"],
            [Sequelize.col("pegawai.kode_divisi"), "ASC"],
            [Sequelize.col("pegawai.namalengkap_pegawai"), "ASC"],
          ],
        });
         
        const jamKerja = await JamKerjaDetail.findOne({
          where: {
            kode_jamkerja: "REGULER"
          }
        });
        const dataArray = mAbsensi.map(item => item.toJSON());
        const combinedAbsensi = combineRows(dataArray, jamKerja);
        res.json(combinedAbsensi);
      }
    } else {
      const mAbsensiRop = await Absensi.findAll({
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
            where: {
              kode_divisi: {
                [Op.in]: ["OPL", "ROP"]
              }
            }
          },
        ],
        attributes: [
          [Sequelize.col("pegawai.kode_pegawai"), "kode_pegawai"],
          [Sequelize.col("pegawai.namalengkap_pegawai"), "nama_pegawai"],
          [Sequelize.col("pegawai.kode_divisi"), "divisi"],
          [Sequelize.literal('date("timestamp_absensi")'), "tanggal_absen"],
          [Sequelize.literal("timestamp_absensi::time"), "jam_absen"],
          "label_absensi",
          "catatan_absensi",
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
              "case when tipe_absensi = 'Datang' then case when timestamp_absensi::time < time_limit_datang then 'Datang lebih awal' when timestamp_absensi::time between timestamp_absensi::time and (time_limit_datang + interval '30 minutes') then 'Datang tepat waktu' when timestamp_absensi::time > (time_limit_datang + interval '30 minutes') then 'Datang terlambat' end else case when timestamp_absensi::time < time_limit_pulang then 'Pulang lebih awal' when timestamp_absensi::time > time_limit_pulang then 'Pulang lebih akhir' when timestamp_absensi::time = time_limit_pulang then 'Pulang tepat waktu' end end"
            ),
            "keterangan",
          ],
        ],
        where: whereAbsensi,
        order: [
          [Sequelize.col("pegawai.kode_divisi"), "ASC"],
          [Sequelize.col("pegawai.namalengkap_pegawai"), "ASC"],
          ["timestamp_absensi", "ASC"],
        ],
      });

      const mAbsensiAll = await Absensi.findAll({
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
            where: filterDivisi
          },
        ],
        attributes: [
          [Sequelize.col("pegawai.kode_pegawai"), "kode_pegawai"],
          [Sequelize.col("pegawai.namalengkap_pegawai"), "nama_pegawai"],
          [Sequelize.col("pegawai.kode_divisi"), "divisi"],
          [Sequelize.literal('date("timestamp_absensi")'), "tanggal_absen"],
          [Sequelize.literal("timestamp_absensi::time"), "jam_absen"],
          [Sequelize.literal("timestamp_absensi::date"), "timestamp_absensi"],
          "label_absensi",
          "catatan_absensi",
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
              "case when tipe_absensi = 'Datang' then case when timestamp_absensi::time < time_limit_datang then 'Datang lebih awal' when timestamp_absensi::time between timestamp_absensi::time and (time_limit_datang + interval '30 minutes') then 'Datang tepat waktu' when timestamp_absensi::time > (time_limit_datang + interval '30 minutes') then 'Datang terlambat' end else case when timestamp_absensi::time < time_limit_pulang then 'Pulang lebih awal' when timestamp_absensi::time > time_limit_pulang then 'Pulang lebih akhir' when timestamp_absensi::time = time_limit_pulang then 'Pulang tepat waktu' end end"
            ),
            "keterangan",
          ],
        ],
        where: whereAbsensi,
        order: [
          ["timestamp_absensi", "ASC"],
          [Sequelize.col("pegawai.kode_divisi"), "ASC"],
          [Sequelize.col("pegawai.namalengkap_pegawai"), "ASC"],
        ],
      });
       
      const jamKerja = await JamKerjaDetail.findOne({
        where: {
          kode_jamkerja: "REGULER"
        }
      });
      const dataArray = mAbsensiAll.map(item => item.toJSON());
      const combinedAbsensi = combineRows(dataArray, jamKerja);
      res.json({
        "regular": combinedAbsensi,
        "shifting": mAbsensiRop
      });
    }
  },
};

function combineRows(records, jamKerja) {
  const combinedRecords = [];
  const groupedRecords = groupBy(records, record => `${record.kode_pegawai}_${record.timestamp_absensi}}`);

  for (const key in groupedRecords) {
      if (groupedRecords.hasOwnProperty(key)) {
          const group = groupedRecords[key];
          const divisi = group[0].divisi;
          let jamAbsen = [];
          group.map(record => {
            jamAbsen.push(record.jam_absen)
          });
          const jamDatang = divisi.toLowerCase() != 'opl' && divisi.toLowerCase != 'rop' ? jamKerja.jam_datang : group[0].time_limit;
          const jamPulang = divisi.toLowerCase() != 'opl' && divisi.toLowerCase != 'rop' ? jamKerja.jam_pulang : group[0].time_limit;
          
          const combinedRecord = {
              kode_pegawai: group[0].kode_pegawai,
              nama_pegawai: group[0].nama_pegawai,
              divisi: divisi,
              lokasi: group.map(record => record.label_absensi).join(" ; "),
              tanggal_presensi: group[0].tanggal_absen,
              jam_datang: jamAbsen[0],
              jam_pulang: jamAbsen[1],
              durasi_kerja: durasiKerja(jamAbsen[0], jamAbsen[1]),
              waktu_terlambat: getTimeLate(jamAbsen[0], jamDatang),
              waktu_pulang_cepat: getTimeEarly(jamAbsen[1], jamPulang),
              catatan_absensi: group.map(record => record.catatan_absensi).join(" ; "),
              status: absenStatus(jamAbsen, jamDatang)
              // Add other fields as needed
          };
          combinedRecords.push(combinedRecord);
      }
  }

  return combinedRecords;
}

// Helper function to group records by a specific key
function groupBy(arr, keyFn) {
  return arr.reduce((acc, curr) => {
      const key = keyFn(curr);
      (acc[key] = acc[key] || []).push(curr);
      return acc;
  }, {});
}

function durasiKerja(startTimeStr, endTimeStr) {
  if (!endTimeStr) {
    return "";
  }
  // Create Date objects for the times
  const startTime = new Date(`2000-01-01T${startTimeStr}`);
  const endTime = new Date(`2000-01-01T${endTimeStr}`);

  // Calculate the time difference in milliseconds
  const timeDiffMs = endTime.getTime() - startTime.getTime();

  // Convert the time difference to hours, minutes, and seconds
  const hoursDiff = Math.floor(timeDiffMs / (1000 * 60 * 60));
  const minutesDiff = Math.floor((timeDiffMs % (1000 * 60 * 60)) / (1000 * 60));
  const secondsDiff = Math.floor((timeDiffMs % (1000 * 60)) / 1000);
  const formattedDiff = `${String(hoursDiff).padStart(2, '0')}:${String(minutesDiff).padStart(2, '0')}:${String(secondsDiff).padStart(2, '0')}`;
  return formattedDiff;

}

function getTimeLate(jamAbsen, jamDatang) {
  const startTime = new Date(`2000-01-01T${jamAbsen}`);
  const endTime = new Date(`2000-01-01T${jamDatang}`);

  if (startTime.getTime() <= endTime.getTime()) {
    return "00:00:00";
  }

  const timeDiffMs = startTime.getTime() - endTime.getTime();
  const hoursDiff = Math.floor(timeDiffMs / (1000 * 60 * 60));
  const minutesDiff = Math.floor((timeDiffMs % (1000 * 60 * 60)) / (1000 * 60));
  const secondsDiff = Math.floor((timeDiffMs % (1000 * 60)) / 1000);
  const formattedDiff = `${String(hoursDiff).padStart(2, '0')}:${String(minutesDiff).padStart(2, '0')}:${String(secondsDiff).padStart(2, '0')}`;
  return formattedDiff;
}

function getTimeEarly(jamAbsen, jamPulang, divisi) {
  if (!jamAbsen) {
    return "";
  }
    
  const startTime = new Date(`2000-01-01T${jamAbsen}`);
  const endTime = new Date(`2000-01-01T${jamPulang}`);

  if (endTime.getTime() <= startTime.getTime()) {
    return "00:00:00";
  }

  const timeDiffMs = endTime.getTime() - startTime.getTime();
  const hoursDiff = Math.floor(timeDiffMs / (1000 * 60 * 60));
  const minutesDiff = Math.floor((timeDiffMs % (1000 * 60 * 60)) / (1000 * 60));
  const secondsDiff = Math.floor((timeDiffMs % (1000 * 60)) / 1000);
  const formattedDiff = `${String(hoursDiff).padStart(2, '0')}:${String(minutesDiff).padStart(2, '0')}:${String(secondsDiff).padStart(2, '0')}`;
  return formattedDiff;
}

function absenStatus (jamAbsen, jamDatang) {
  let status = "";
  const startTime = new Date(`2000-01-01T${jamAbsen[0]}`);
  const endTime = new Date(`2000-01-01T${jamDatang}`);

  if (startTime.getTime() <= endTime.getTime()) {
    status += "DATANG TEPAT WAKTU/DALAM RENTANG WAKTU ; ";
  } else {
    status += "TERLAMBAT MELEBIHI BATAS WAKTU ; ";
  }

  if (!jamAbsen[1]) {
    status += "TIDAK PRESENSI PULANG ; ";
  }

  return status;
}
