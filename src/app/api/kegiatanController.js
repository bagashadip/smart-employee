const _ = require("lodash");
const { body, query, validationResult } = require("express-validator");
const Sequelize = require("sequelize");
const error = require("../../util/errors");
const datatable = require("../../util/datatable");
const { Kegiatan, Absensi, Pegawai, File, Divisi} = require("../../models/model");

const Op = Sequelize.Op;

module.exports = {
    // List
    list: async (req, res) => {
        const mKegiatan = await Kegiatan.findAll({
            attributes: ["id_kegiatan", "foto_kegiatan", "desc_kegiatan",  "nama_kegiatan", "tanggal_kegiatan", "kode_pegawai"],
        });
        res.json(mKegiatan);
    },
    get: async (req, res) => {
        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return error(res).validationError(validation.array());
        }

        const mKegiatan = await Kegiatan.findAll({
            where: {
                kode_pegawai: req.query.kode_pegawai,
                tanggal_kegiatan: {
                    [Op.gte]: req.query.tanggal_mulai,
                    [Op.lte]: req.query.tanggal_selesai
                }
            },
            include: [
                {
                    model: File,
                    as: "foto",
                    attributes: ["name", "path", "extension", "size"],
                },
            ],
        });
        res.json(mKegiatan);
    },
    create: async (req, res) => {
        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return error(res).validationError(validation.array());
        }

        const mKegiatan = await new Kegiatan({
            ...req.body,
        }).save();

        res.json({
            status: true,
            statusCode: 200,
            message: "Kegiatan " + mKegiatan.nama_kegiatan + " berhasil ditambah."
        });
    },
    validate: (type) => {
        return type
    }
};