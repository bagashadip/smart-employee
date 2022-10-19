const _ = require("lodash");
const { body, query, validationResult } = require("express-validator");
const Sequelize = require("sequelize");
const error = require("../../util/errors");
const datatable = require("../../util/datatable");
const { LiburNasional } = require("../../models/model");

const Op = Sequelize.Op;

module.exports = {
    // Get all
    list: async (req, res) => {
        const mLiburNasional = await LiburNasional.findAll({
            attributes: ["id_liburnasional", "tahun", "tanggal",  "nama_liburnasional"],
        });
        res.json(mLiburNasional);
    },

    //Get by kode pegawai and date
    get: async (req, res) => {
        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return error(res).validationError(validation.array());
        }

        const mLiburNasional = await LiburNasional.findAll({
            where: {
                id_liburnasional: req.query.id_liburnasional
            }
        });
        res.json(mLiburNasional);
    },

    detail: async (req, res) => {
        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return error(res).validationError(validation.array());
        }

        const mKegiatan = await Kegiatan.findOne({
            where: {
                id_kegiatan: req.query.id_kegiatan
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

    //Add new kegiatan
    create: async (req, res) => {
        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return error(res).validationError(validation.array());
        }

        const mLiburNasional = await new LiburNasional({
            ...req.body,
        }).save();

        res.json({
            status: true,
            statusCode: 200,
            message: "Libur nasional " + mLiburNasional.nama_liburnasional + " berhasil ditambah."
        });
    },

    //Update kegiatan
    update: async (req, res) => {
        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return error(res).validationError(validation.array());
        }

        await Kegiatan.update(
            { ...req.body },
            { where: { id_kegiatan: req.query.id_kegiatan } }
        );

        res.json({
            status: true,
            statusCode: 200,
            message: "Kegiatan " + req.query.id_kegiatan + " berhasil diubah.",
        });
    },

    //Delete
    delete: async (req, res) => {
        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return error(res).validationError(validation.array());
        }

        await Kegiatan.destroy({
            where: {
                id_kegiatan: req.query.id_kegiatan,
            },
        });
        res.send({
            status: true,
            message: req.query.id_kegiatan + " berhasil dihapus.",
        });
    },

    //Validate
    validate: (type) => {
        return type
    }
};